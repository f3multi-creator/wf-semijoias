import { NextRequest, NextResponse } from "next/server";
import { getEmailServiceStatus, sendWelcomeEmail } from "@/lib/email";

// GET - Verificar status do serviço de email
export async function GET() {
    const status = getEmailServiceStatus();

    return NextResponse.json({
        emailService: status,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        hint: status.configured
            ? "Serviço configurado. Use POST com { email, name } para enviar um email de teste."
            : "⚠️ RESEND_API_KEY não configurada. Adicione nas variáveis de ambiente.",
    });
}

// POST - Enviar email de teste
export async function POST(request: NextRequest) {
    try {
        const { email, name } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Campo 'email' é obrigatório" },
                { status: 400 }
            );
        }

        // Verificar status antes de tentar
        const status = getEmailServiceStatus();
        if (!status.configured) {
            return NextResponse.json({
                success: false,
                error: "RESEND_API_KEY não configurada",
                action: "Adicione RESEND_API_KEY nas variáveis de ambiente (.env.local e Vercel)",
            }, { status: 500 });
        }

        // Enviar email de teste (usando template de boas-vindas)
        console.log(`[DEBUG] Enviando email de teste para ${email}`);
        const result = await sendWelcomeEmail(email, name || "Teste");

        return NextResponse.json({
            success: result.success,
            error: result.error ? String(result.error) : undefined,
            sentTo: email,
            sentFrom: status.fromEmail,
            timestamp: new Date().toISOString(),
        });
    } catch (error: unknown) {
        console.error("[DEBUG] Erro no teste de email:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}
