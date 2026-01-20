import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    if (!url || !key) return null;
    return createClient(url, key);
}

// GET - Listar cupons
export async function GET(request: NextRequest) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");

        if (code) {
            // Buscar cupom específico (para validação no checkout)
            const { data, error } = await supabase
                .from("coupons")
                .select("*")
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
        }

        // Listar todos os cupons
        const { data, error } = await supabase
            .from("coupons")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return NextResponse.json(data || []);
    } catch (error: any) {
        console.error("Erro ao buscar cupons:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Criar cupom
export async function POST(request: NextRequest) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { code, discount_type, discount_value, min_purchase, max_uses, expires_at, is_active } = body;

        if (!code || !discount_type || !discount_value) {
            return NextResponse.json({ error: "Campos obrigatórios: code, discount_type, discount_value" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("coupons")
            .insert({
                code: code.toUpperCase(),
                discount_type,
                discount_value,
                min_purchase: min_purchase || 0,
                max_uses: max_uses || null,
                expires_at: expires_at || null,
                is_active: is_active !== false,
                uses_count: 0,
            })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
        console.error("Erro ao criar cupom:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT - Atualizar cupom
export async function PUT(request: NextRequest) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ error: "ID do cupom é obrigatório" }, { status: 400 });
        }

        if (updateData.code) {
            updateData.code = updateData.code.toUpperCase();
        }

        const { data, error } = await supabase
            .from("coupons")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Erro ao atualizar cupom:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Remover cupom
export async function DELETE(request: NextRequest) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID do cupom é obrigatório" }, { status: 400 });
        }

        const { error } = await supabase
            .from("coupons")
            .delete()
            .eq("id", id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Erro ao deletar cupom:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
