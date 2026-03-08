import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Configuração inválida" }, { status: 500 });
    }

    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: "Senha deve ter pelo menos 8 caracteres" }, { status: 400 });
        }

        // Buscar usuário pelo token
        const { data: user } = await supabase
            .from("users")
            .select("id, reset_token_expires")
            .eq("reset_token", token)
            .single();

        if (!user) {
            return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 400 });
        }

        // Verificar se token expirou
        if (new Date(user.reset_token_expires) < new Date()) {
            return NextResponse.json({ error: "Token expirado. Solicite um novo link." }, { status: 400 });
        }

        // Hash da nova senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Atualizar senha e limpar token
        const { error } = await supabase
            .from("users")
            .update({
                password: hashedPassword,
                reset_token: null,
                reset_token_expires: null,
            })
            .eq("id", user.id);

        if (error) throw error;

        return NextResponse.json({ success: true, message: "Senha redefinida com sucesso!" });
    } catch (error: any) {
        console.error("Erro ao redefinir senha:", error);
        return NextResponse.json({ error: "Erro ao redefinir senha" }, { status: 500 });
    }
}
