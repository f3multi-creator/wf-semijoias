import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from 'mercadopago';

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
  };
  discount?: number;
  customerEmail?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePreferenceBody = await request.json();
    const { items, shipping, discount = 0, customerEmail } = body;

    // Validação básica
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Nenhum item no carrinho" },
        { status: 400 }
      );
    }

    // Verifica se o access token está configurado
    if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: "Mercado Pago não configurado" },
        { status: 500 }
      );
    }

    // Inicializa o cliente Mercado Pago
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
    });

    const preference = new Preference(client);

    // Calcula o total
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingCost = shipping?.price || 0;

    // Gera referência externa (ID do pedido)
    const externalReference = `ORDER_${Date.now()}`;

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
          cost: subtotal >= 300 ? 0 : shippingCost, // Frete grátis acima de R$300
          mode: 'not_specified',
        } : undefined,
        payer: customerEmail ? {
          email: customerEmail,
        } : undefined,
        payment_methods: {
          installments: 12, // Até 12x
          excluded_payment_types: [],
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/sucesso`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/erro`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/pendente`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mercadopago`,
        external_reference: externalReference,
        statement_descriptor: 'WF SEMIJOIAS',
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
