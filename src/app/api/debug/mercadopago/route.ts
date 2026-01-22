import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function GET() {
    const isSandbox = process.env.MERCADO_PAGO_SANDBOX?.trim() === "true";

    let accessToken = isSandbox
        ? process.env.MERCADO_PAGO_ACCESS_TOKEN_SANDBOX
        : process.env.MERCADO_PAGO_ACCESS_TOKEN;

    // Remove \r\n
    accessToken = accessToken?.trim().replace(/[\r\n]/g, '');

    const info = {
        timestamp: new Date().toISOString(),
        isSandbox,
        hasSandboxToken: !!process.env.MERCADO_PAGO_ACCESS_TOKEN_SANDBOX,
        hasProdToken: !!process.env.MERCADO_PAGO_ACCESS_TOKEN,
        sandboxVarValue: process.env.MERCADO_PAGO_SANDBOX,
        sandboxVarTrimmed: process.env.MERCADO_PAGO_SANDBOX?.trim(),
        tokenLength: accessToken?.length || 0,
        tokenFirst10: accessToken?.substring(0, 10) + '...',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    };

    // Testar criação de preferência
    if (accessToken) {
        try {
            const client = new MercadoPagoConfig({ accessToken });
            const preference = new Preference(client);

            const response = await preference.create({
                body: {
                    items: [{
                        id: 'test',
                        title: 'Produto Teste',
                        quantity: 1,
                        unit_price: 1,
                        currency_id: 'BRL',
                    }],
                    back_urls: {
                        success: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/sucesso`,
                        failure: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/erro`,
                        pending: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/pendente`,
                    },
                    auto_return: 'approved',
                },
            });

            return NextResponse.json({
                ...info,
                testPreference: {
                    success: true,
                    preferenceId: response.id,
                    initPoint: response.init_point,
                    sandboxInitPoint: response.sandbox_init_point,
                }
            });
        } catch (error: any) {
            return NextResponse.json({
                ...info,
                testPreference: {
                    success: false,
                    error: error.message,
                    errorDetails: error.cause || error.response || String(error),
                }
            });
        }
    }

    return NextResponse.json({
        ...info,
        error: 'No access token found'
    });
}
