import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export async function POST(request: Request) {
    const adminCheck = await requireAdmin();
    if (!adminCheck.authorized) return adminCheck.response;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "Serviço de email não configurado" }, { status: 500 });
    }

    try {
        const { subject, message } = await request.json();

        if (!subject || !message) {
            return NextResponse.json({ error: "Assunto e mensagem são obrigatórios" }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();
        if (!supabase) {
            return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
        }

        const { data: users, error } = await supabase
            .from("customers")
            .select("email, name")
            .not("email", "is", null);

        if (error) throw error;
        if (!users || users.length === 0) {
            return NextResponse.json({ error: "Nenhum usuário encontrado" }, { status: 404 });
        }

        const limitedUsers = users.slice(0, 10);
        const resend = new Resend(apiKey);

        const emails = limitedUsers.map(user => ({
            from: 'WF Semijoias <noreply@wfsemijoias.com.br>',
            to: user.email,
            subject: escapeHtml(subject),
            html: `
            <div style="font-family: sans-serif; color: #333;">
                ${escapeHtml(message).replace(/\n/g, '<br>')}
                <br>
                <hr>
                <p style="font-size: 12px; color: #888;">
                    Você recebeu este email porque é cliente WF Semijoias.
                    <a href="#">Descadastrar</a>
                </p>
            </div>
        `
        }));

        const { error: sendError } = await resend.batch.send(emails);

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
