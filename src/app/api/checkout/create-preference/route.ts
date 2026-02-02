import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { getSupabaseAdmin } from "@/lib/supabase-admin";

interface CheckoutItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface CreatePreferenceBody {
  items: CheckoutItem[];
  shipping?: {
    id: number;
    name: string;
    price: number;
    company?: string;
    delivery_time?: number;
  };
  discount?: number;
  customerEmail?: string;
  shippingAddress?: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePreferenceBody = await request.json();
    const { items, shipping, discount = 0, customerEmail, shippingAddress } = body;

    // Validação básica
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Nenhum item no carrinho" },
        { status: 400 }
      );
    }

    // Verifica qual token usar (sandbox ou produção)
    const isSandbox = process.env.MERCADO_PAGO_SANDBOX?.trim() === "true";
    let accessToken = isSandbox
      ? process.env.MERCADO_PAGO_ACCESS_TOKEN_SANDBOX
      : process.env.MERCADO_PAGO_ACCESS_TOKEN;

    // Remove possíveis caracteres inváidos (\r\n) do token
    accessToken = accessToken?.trim().replace(/[\r\n]/g, '');

    if (!accessToken) {
      console.error('Token não encontrado:', {
        isSandbox,
        hasSandboxToken: !!process.env.MERCADO_PAGO_ACCESS_TOKEN_SANDBOX,
        hasProdToken: !!process.env.MERCADO_PAGO_ACCESS_TOKEN
      });
      return NextResponse.json(
        { error: `Mercado Pago não configurado (${isSandbox ? 'sandbox' : 'produção'})` },
        { status: 500 }
      );
    }

    // Inicializa o cliente Mercado Pago
    const client = new MercadoPagoConfig({
      accessToken: accessToken
    });

    const preference = new Preference(client);

    // Calcula o total
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingCost = shipping?.price || 0;
    const finalShippingCost = subtotal >= 300 ? 0 : shippingCost; // Frete grátis acima de R$300
    const total = subtotal + finalShippingCost - discount;

    // Gera referência externa (ID do pedido)
    const externalReference = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Criar pedido no banco de dados ANTES de redirecionar para o Mercado Pago
    const supabase = getSupabaseAdmin();
    if (supabase && customerEmail) {
      try {
        // Criar o pedido
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            customer_email: customerEmail,
            customer_name: customerEmail.split('@')[0], // Nome temporário, será atualizado
            subtotal: subtotal,
            shipping_cost: finalShippingCost,
            discount: discount,
            total: total,
            shipping_address: shippingAddress || {},
            shipping_method: shipping?.name || 'Padrão',
            external_reference: externalReference,
            status: 'pending',
            payment_status: 'pending',
          })
          .select()
          .single();

        if (orderError) {
          console.error('Erro ao criar pedido:', orderError);
        } else if (order) {
          // Inserir itens do pedido
          const orderItems = items.map(item => ({
            order_id: order.id,
            product_id: item.id,
            product_name: item.name,
            product_image: item.image || '',
            quantity: item.quantity,
            unit_price: item.price,
            total: item.price * item.quantity,
          }));

          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

          if (itemsError) {
            console.error('Erro ao criar itens do pedido:', itemsError);
          }

          console.log(`Pedido ${order.id} criado com external_reference: ${externalReference}`);
        }
      } catch (dbError) {
        console.error('Erro ao salvar pedido no banco:', dbError);
        // Continua mesmo com erro no banco - o webhook vai tentar criar depois
      }
    }

    // Cria a preferência de pagamento
    const response = await preference.create({
      body: {
        items: items.map(item => ({
          id: item.id,
          title: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          currency_id: 'BRL',
          picture_url: item.image ? `${process.env.NEXT_PUBLIC_SITE_URL}${item.image}` : undefined,
        })),
        shipments: shipping ? {
          cost: finalShippingCost,
          mode: 'not_specified',
        } : undefined,
        payer: customerEmail ? {
          email: customerEmail,
        } : undefined,
        // Configuração explícita de métodos de pagamento
        payment_methods: {
          installments: 12, // Até 12x
          // NÃO excluir nenhum tipo de pagamento - habilita todos
          excluded_payment_types: [],
          excluded_payment_methods: [],
          // Parcelas sem juros (opcional - o vendedor absorve)
          default_installments: 1,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/sucesso?ref=${externalReference}`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/erro?ref=${externalReference}`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/pendente?ref=${externalReference}`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mercadopago`,
        external_reference: externalReference,
        statement_descriptor: 'WF SEMIJOIAS',
        // Expira em 24 horas (para boleto e PIX)
        expires: true,
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
    });

    return NextResponse.json({
      preferenceId: response.id,
      initPoint: response.init_point,
      sandboxInitPoint: response.sandbox_init_point,
      externalReference,
    });

  } catch (error) {
    console.error("Erro ao criar preferência:", error);
    return NextResponse.json(
      { error: "Erro ao processar pagamento", details: String(error) },
      { status: 500 }
    );
  }
}
