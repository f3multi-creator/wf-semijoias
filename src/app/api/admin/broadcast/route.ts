import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { subject, message } = await request.json();

        if (!subject || !message) {
            return NextResponse.json({ error: "Assunto e mensagem são obrigatórios" }, { status: 400 });
        }

        // 1. Buscar todos os emails (ou newsletter subscribers)
        // Por simplicidade, vamos pegar todos os customers que têm email.
        // O ideal seria ter uma flag "newsletter_subscribed".
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: users, error } = await supabase
            .from("customers") // Assumindo tabela customers
            .select("email, name")
            .not("email", "is", null);

        if (error) throw error;
        if (!users || users.length === 0) {
            return NextResponse.json({ error: "Nenhum usuário encontrado" }, { status: 404 });
        }

        // 2. Enviar emails em lote (limitado pelo plano do Resend, cuidado)
        // O plano gratuito do Resend permite 100 emails/dia. 
        // Vamos limitar a 10 para teste/demonstração e evitar bloqueio.
        const limitedUsers = users.slice(0, 10);

        const emails = limitedUsers.map(user => ({
            from: 'WF Semijoias <noreply@wfsemijoias.com.br>',
            to: user.email,
            subject: subject,
            html: `
            <div style="font-family: sans-serif; color: #333;">
                ${message}
                <br>
                <hr>
                <p style="font-size: 12px; color: #888;">
                    Você recebeu este email porque é cliente WF Semijoias. 
                    <a href="#">Descadastrar</a>
                </p>
            </div>
        `
        }));

        // Enviar em batch
        const { data, error: sendError } = await resend.batch.send(emails);

        if (sendError) {
            console.error("Resend Batch Error:", sendError);
            return NextResponse.json({ error: "Erro ao enviar emails" }, { status: 500 });
        }

        return NextResponse.json({ success: true, count: limitedUsers.length });

    } catch (error) {
        console.error("Broadcast Error:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
