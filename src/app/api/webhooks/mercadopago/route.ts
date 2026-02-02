import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { sendOrderConfirmationEmail } from "@/lib/email";

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

interface MercadoPagoPayment {
    id: number;
    status: string;
    status_detail: string;
    external_reference: string;
    transaction_amount: number;
    currency_id: string;
    payment_method_id: string;
    payment_type_id: string;
    payer: {
        email: string;
        first_name?: string;
        last_name?: string;
    };
    date_approved?: string;
    date_created: string;
}

// Mapear status do Mercado Pago para status do pedido
function mapPaymentStatus(mpStatus: string): { paymentStatus: string; orderStatus: string } {
    const statusMap: Record<string, { paymentStatus: string; orderStatus: string }> = {
        'approved': { paymentStatus: 'approved', orderStatus: 'confirmed' },
        'authorized': { paymentStatus: 'authorized', orderStatus: 'confirmed' },
        'pending': { paymentStatus: 'pending', orderStatus: 'pending' },
        'in_process': { paymentStatus: 'in_process', orderStatus: 'pending' },
        'in_mediation': { paymentStatus: 'in_mediation', orderStatus: 'pending' },
        'rejected': { paymentStatus: 'rejected', orderStatus: 'cancelled' },
        'cancelled': { paymentStatus: 'cancelled', orderStatus: 'cancelled' },
        'refunded': { paymentStatus: 'refunded', orderStatus: 'refunded' },
        'charged_back': { paymentStatus: 'charged_back', orderStatus: 'refunded' },
    };

    return statusMap[mpStatus] || { paymentStatus: mpStatus, orderStatus: 'pending' };
}

// Buscar detalhes do pagamento na API do Mercado Pago
async function getPaymentDetails(paymentId: string): Promise<MercadoPagoPayment | null> {
    try {
        // Verificar qual token usar (sandbox ou produção)
        const isSandbox = process.env.MERCADO_PAGO_SANDBOX?.trim() === "true";
        let accessToken = isSandbox
            ? process.env.MERCADO_PAGO_ACCESS_TOKEN_SANDBOX
            : process.env.MERCADO_PAGO_ACCESS_TOKEN;

        // Limpar possíveis caracteres inválidos
        accessToken = accessToken?.trim().replace(/[\r\n]/g, '');

        if (!accessToken) {
            console.error('Token do Mercado Pago não configurado');
            return null;
        }

        const response = await fetch(
            `https://api.mercadopago.com/v1/payments/${paymentId}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            console.error('Erro ao buscar pagamento:', response.status, await response.text());
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar detalhes do pagamento:', error);
        return null;
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: MercadoPagoWebhook = await request.json();

        // Log para debug
        console.log("=== Webhook Mercado Pago recebido ===");
        console.log("Tipo:", body.type);
        console.log("Ação:", body.action);
        console.log("Data ID:", body.data?.id);
        console.log("Live Mode:", body.live_mode);

        // Processar apenas notificações de pagamento
        if (body.type === "payment") {
            const paymentId = body.data.id;

            // Buscar detalhes do pagamento na API do Mercado Pago
            const payment = await getPaymentDetails(paymentId);

            if (!payment) {
                console.error(`Não foi possível obter detalhes do pagamento ${paymentId}`);
                return NextResponse.json({ received: true, error: "payment_not_found" });
            }

            console.log("=== Detalhes do Pagamento ===");
            console.log("Status:", payment.status);
            console.log("Status Detail:", payment.status_detail);
            console.log("External Reference:", payment.external_reference);
            console.log("Valor:", payment.transaction_amount);
            console.log("Método:", payment.payment_method_id);

            // Obter cliente Supabase Admin
            const supabase = getSupabaseAdmin();
            if (!supabase) {
                console.error('Supabase admin não configurado');
                return NextResponse.json({ received: true, error: "supabase_not_configured" });
            }

            // Mapear status
            const { paymentStatus, orderStatus } = mapPaymentStatus(payment.status);

            // Atualizar pedido no banco de dados
            const { data: order, error: updateError } = await supabase
                .from('orders')
                .update({
                    payment_id: paymentId,
                    payment_status: paymentStatus,
                    payment_method: payment.payment_method_id,
                    status: orderStatus,
                    updated_at: new Date().toISOString(),
                })
                .eq('external_reference', payment.external_reference)
                .select(`
                    *,
                    items:order_items(*)
                `)
                .single();

            if (updateError) {
                console.error('Erro ao atualizar pedido:', updateError);
                
                // Se o pedido não existe, pode ser que ainda não foi criado
                // (o webhook pode chegar antes do redirect do cliente)
                if (updateError.code === 'PGRST116') {
                    console.log('Pedido ainda não existe, será criado pelo checkout');
                }
                
                return NextResponse.json({ received: true, error: "update_failed" });
            }

            console.log(`Pedido ${payment.external_reference} atualizado com sucesso`);
            console.log(`Status: ${orderStatus}, Payment Status: ${paymentStatus}`);

            // Se o pagamento foi aprovado, enviar email de confirmação
            if (payment.status === 'approved' && order) {
                try {
                    // Preparar itens para o email
                    const emailItems = order.items?.map((item: any) => ({
                        name: item.product_name,
                        quantity: item.quantity,
                        price: item.unit_price,
                    })) || [];

                    // Enviar email de confirmação
                    await sendOrderConfirmationEmail(
                        order.customer_email,
                        order.customer_name,
                        order.id,
                        emailItems,
                        order.total
                    );

                    console.log(`Email de confirmação enviado para ${order.customer_email}`);
                } catch (emailError) {
                    console.error('Erro ao enviar email de confirmação:', emailError);
                    // Não falhar o webhook por causa do email
                }
            }

            return NextResponse.json({ 
                received: true, 
                success: true,
                orderId: order?.id,
                status: orderStatus 
            });
        }

        // Para outros tipos de notificação, apenas confirmar recebimento
        console.log(`Notificação do tipo ${body.type} ignorada`);
        return NextResponse.json({ received: true });

    } catch (error) {
        console.error("Erro no webhook Mercado Pago:", error);
        // Retorna 200 mesmo com erro para evitar retentativas infinitas
        return NextResponse.json({ received: true, error: "internal" });
    }
}

// Endpoint GET para verificação do webhook (Mercado Pago pode fazer ping)
export async function GET() {
    return NextResponse.json({ 
        status: "ok", 
        message: "Webhook Mercado Pago ativo",
        timestamp: new Date().toISOString()
    });
}
