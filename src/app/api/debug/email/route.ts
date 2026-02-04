import { NextRequest, NextResponse } from "next/server";
import { Resend } from 'resend';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const testEmail = searchParams.get('email') || 'f3multi@gmail.com';

    const apiKey = process.env.RESEND_API_KEY;

    const debugInfo = {
        timestamp: new Date().toISOString(),
        hasApiKey: !!apiKey,
        apiKeyLength: apiKey?.length || 0,
        apiKeyPrefix: apiKey?.substring(0, 10) + '...',
        testEmail,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    };

    if (!apiKey) {
        return NextResponse.json({
            ...debugInfo,
            error: 'RESEND_API_KEY não está configurada',
            emailTest: { success: false }
        });
    }

    try {
        const resend = new Resend(apiKey);

        // Tentar enviar um email de teste
        const result = await resend.emails.send({
            from: 'WF Semijoias <noreply@wfsemijoias.com.br>',
            to: testEmail,
            subject: '✅ Teste de Email - WF Semijoias',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Teste de Email Funcionando! 🎉</h2>
                    <p>Se você está vendo este email, o sistema de emails está configurado corretamente.</p>
                    <p>Data/Hora: ${new Date().toLocaleString('pt-BR')}</p>
                    <hr>
                    <p style="color: #666; font-size: 12px;">WF Semijoias - Teste de configuração</p>
                </div>
            `,
        });

        return NextResponse.json({
            ...debugInfo,
            emailTest: {
                success: true,
                result,
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            ...debugInfo,
            emailTest: {
                success: false,
                error: error.message,
                errorDetails: error.response || error.cause || String(error),
            }
        });
    }
}
