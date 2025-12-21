import { NextRequest, NextResponse } from "next/server";
// import { supabase } from '@/lib/supabase';

interface MercadoPagoWebhook {
    action: string;
    api_version: string;
    data: {
        id: string;
    };
    date_created: string;
    id: number;
    live_mode: boolean;
    type: string;
    user_id: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: MercadoPagoWebhook = await request.json();

        // Log para debug
        console.log("Webhook Mercado Pago recebido:", JSON.stringify(body, null, 2));

        // Tipos de notificação que nos interessam
        if (body.type === "payment" && body.action === "payment.created") {
            const paymentId = body.data.id;

            // Buscar detalhes do pagamento na API do Mercado Pago
            // const payment = await getPaymentDetails(paymentId);

            // Atualizar status do pedido no Supabase baseado no status do pagamento
            // Exemplo de status do Mercado Pago:
            // - pending: pagamento pendente (boleto, PIX aguardando)
            // - approved: pagamento aprovado
            // - authorized: pagamento autorizado (cartão)
            // - in_process: em análise
            // - rejected: rejeitado
            // - cancelled: cancelado
            // - refunded: reembolsado

            /*
            await supabase
              .from('orders')
              .update({
                payment_status: payment.status,
                payment_id: paymentId,
                updated_at: new Date().toISOString(),
              })
              .eq('external_reference', payment.external_reference);
            */

            console.log(`Pagamento ${paymentId} processado com sucesso`);
        }

        // Mercado Pago espera resposta 200 para confirmar recebimento
        return NextResponse.json({ received: true });

    } catch (error) {
        console.error("Erro no webhook Mercado Pago:", error);
        // Retorna 200 mesmo com erro para evitar retentativas infinitas
        return NextResponse.json({ received: true, error: "internal" });
    }
}

// Função para buscar detalhes do pagamento (implementar quando tivermos credenciais)
/*
async function getPaymentDetails(paymentId: string) {
  const response = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
      },
    }
  );
  return response.json();
}
*/
