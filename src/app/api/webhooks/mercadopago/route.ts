import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { sendOrderConfirmationEmail } from "@/lib/email";
import crypto from "crypto";

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
        // --- Verificação de assinatura HMAC ---
        const webhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
        const isProduction = process.env.NODE_ENV === 'production';

        if (!webhookSecret) {
            if (isProduction) {
                console.error('CRÍTICO: MERCADO_PAGO_WEBHOOK_SECRET não configurado em produção');
                return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
            }
            console.warn('MERCADO_PAGO_WEBHOOK_SECRET não configurado — aceito apenas em dev');
        } else {
            const xSignature = request.headers.get('x-signature');
            const xRequestId = request.headers.get('x-request-id');

            if (!xSignature || !xRequestId) {
                console.error('Webhook: headers x-signature ou x-request-id ausentes');
                return NextResponse.json({ error: 'Missing signature headers' }, { status: 401 });
            }

            // Extrair ts e v1 do header
            const parts = xSignature.split(',');
            const tsValue = parts.find(p => p.trim().startsWith('ts='))?.split('=')[1];
            const hashValue = parts.find(p => p.trim().startsWith('v1='))?.split('=')[1];

            if (!tsValue || !hashValue) {
                console.error('Webhook: formato de assinatura inválido');
                return NextResponse.json({ error: 'Invalid signature format' }, { status: 401 });
            }

            // Reconstruir o body para validação
            const url = new URL(request.url);
            const dataId = url.searchParams.get('data.id') || url.searchParams.get('id') || '';

            // Template: id:[data.id];request-id:[x-request-id];ts:[ts];
            const manifest = `id:${dataId};request-id:${xRequestId};ts:${tsValue};`;
            const hmac = crypto.createHmac('sha256', webhookSecret)
                .update(manifest)
                .digest('hex');

            if (hmac !== hashValue) {
                console.error('Webhook: assinatura HMAC inválida');
                return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
            }
            console.log('Webhook: assinatura HMAC verificada com sucesso');
        }

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

            // Se o pagamento foi aprovado, decrementar estoque e enviar email
            if (payment.status === 'approved' && order) {
                // --- Decrementar estoque ---
                try {
                    if (order.items && order.items.length > 0) {
                        for (const item of order.items) {
                            // Tentar decremento atômico via RPC
                            const { error: rpcError } = await supabase.rpc('decrement_stock', {
                                p_product_id: item.product_id,
                                p_quantity: item.quantity,
                            });

                            if (rpcError) {
                                // Fallback: decremento manual (buscar valor atual e subtrair)
                                console.warn(`RPC decrement_stock não disponível, usando fallback para produto ${item.product_id}`);
                                const { data: product } = await supabase
                                    .from('products')
                                    .select('stock_quantity')
                                    .eq('id', item.product_id)
                                    .single();

                                if (product) {
                                    const newStock = Math.max(0, (product.stock_quantity || 0) - item.quantity);
                                    await supabase
                                        .from('products')
                                        .update({ stock_quantity: newStock })
                                        .eq('id', item.product_id);
                                }
                            }
                        }
                        console.log(`Estoque decrementado para ${order.items.length} itens`);
                    }
                } catch (stockError) {
                    console.error('Erro ao decrementar estoque:', stockError);
                    // Não falhar o webhook por causa do estoque
                }

                // --- Enviar email de confirmação ---
                try {
                    const emailItems = order.items?.map((item: any) => ({
                        name: item.product_name,
                        quantity: item.quantity,
                        price: item.unit_price,
                    })) || [];

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
