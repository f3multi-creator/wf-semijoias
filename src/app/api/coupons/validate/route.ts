import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// GET - Validar cupom por código (rota pública para checkout)
export async function GET(request: NextRequest) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");

        if (!code) {
            return NextResponse.json({ error: "Código do cupom é obrigatório" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("coupons")
            .select("code, discount_type, discount_value, min_purchase, max_uses, uses_count, expires_at, is_active")
            .eq("code", code.toUpperCase())
            .eq("is_active", true)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: "Cupom não encontrado" }, { status: 404 });
        }

        // Verificar validade
        const now = new Date();
        if (data.expires_at && new Date(data.expires_at) < now) {
            return NextResponse.json({ error: "Cupom expirado" }, { status: 400 });
        }

        if (data.max_uses && data.uses_count >= data.max_uses) {
            return NextResponse.json({ error: "Cupom esgotado" }, { status: 400 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Erro ao validar cupom:", error);
        return NextResponse.json({ error: "Erro ao validar cupom" }, { status: 500 });
    }
}
