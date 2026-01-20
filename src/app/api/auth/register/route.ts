import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

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
        const { name, email, password } = await request.json();

        // Validações
        if (!name || !email || !password) {
            return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: "Senha deve ter pelo menos 6 caracteres" }, { status: 400 });
        }

        // Verificar se email já existe
        const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("email", email.toLowerCase())
            .single();

        if (existingUser) {
            return NextResponse.json({ error: "Este email já está cadastrado" }, { status: 400 });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar usuário
        const { data, error } = await supabase
            .from("users")
            .insert({
                name,
                email: email.toLowerCase(),
                password: hashedPassword,
                email_verified: false,
            })
            .select("id, name, email")
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            message: "Conta criada com sucesso!",
            user: { id: data.id, name: data.name, email: data.email },
        }, { status: 201 });
    } catch (error: any) {
        console.error("Erro ao registrar:", error);
        return NextResponse.json({ error: error.message || "Erro ao criar conta" }, { status: 500 });
    }
}
