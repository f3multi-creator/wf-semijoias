import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    if (!url || !key) return null;
    return createClient(url, key);
}

export async function POST(request: NextRequest) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Configuração inválida" }, { status: 500 });
    }

    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
        }

        // Buscar usuário
        const { data: user } = await supabase
            .from("users")
            .select("id, name, email")
            .eq("email", email.toLowerCase())
            .single();

        // Sempre retorna sucesso (segurança - não revelar se email existe)
        if (!user) {
            return NextResponse.json({ success: true });
        }

        // Gerar token de recuperação
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hora

        // Salvar token no banco
        await supabase
            .from("users")
            .update({
                reset_token: resetToken,
                reset_token_expires: resetTokenExpires.toISOString(),
            })
            .eq("id", user.id);

        // Enviar email de recuperação via Resend
        await sendPasswordResetEmail(user.email, user.name || "Cliente", resetToken);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Erro ao processar recuperação:", error);
        return NextResponse.json({ error: "Erro ao processar solicitação" }, { status: 500 });
    }
}

