
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { data: customer, error } = await supabase
        .from("customers")
        .select("*")
        .eq("email", session.user.email)
        .single();

    if (error && error.code !== "PGRST116") { // PGRST116 = not found
        console.error("Erro ao buscar perfil:", error);
        return NextResponse.json({ error: "Erro ao buscar perfil" }, { status: 500 });
    }

    // Se não existir, retorna vazio mas sucesso (o front vai lidar)
    // Na verdade, o customer deve ser criado no login se não existir, mas por via das dúvidas:
    return NextResponse.json({ customer: customer || null });
}

export async function PATCH(request: NextRequest) {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { phone } = body;

    if (!phone) {
        return NextResponse.json({ error: "Telefone obrigatório" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    // Upsert customer
    const { data, error } = await supabase
        .from("customers")
        .upsert({
            email: session.user.email,
            full_name: session.user.name || session.user.email.split("@")[0],
            phone: phone,
            updated_at: new Date().toISOString()
        }, { onConflict: "email" })
        .select()
        .single();

    if (error) {
        console.error("Erro ao atualizar perfil:", error);
        return NextResponse.json({ error: "Erro ao atualizar perfil" }, { status: 500 });
    }

    return NextResponse.json({ customer: data });
}
