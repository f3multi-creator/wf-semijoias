import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";

// GET - Listar cupons
export async function GET(request: NextRequest) {
    const adminCheck = await requireAdmin();
    if (!adminCheck.authorized) return adminCheck.response;

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        // Buscar cupom individual por ID
        if (id) {
            const { data, error } = await supabase
                .from("coupons")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;
            return NextResponse.json(data);
        }

        // Listar todos os cupons (admin only)
        const { data, error } = await supabase
            .from("coupons")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return NextResponse.json(data || []);
    } catch (error) {
        console.error("Erro ao buscar cupons:", error);
        return NextResponse.json({ error: "Erro ao buscar cupons" }, { status: 500 });
    }
}

// POST - Criar cupom
export async function POST(request: NextRequest) {
    const adminCheck = await requireAdmin();
    if (!adminCheck.authorized) return adminCheck.response;

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
    } catch (error) {
        console.error("Erro ao criar cupom:", error);
        return NextResponse.json({ error: "Erro ao criar cupom" }, { status: 500 });
    }
}

// PUT - Atualizar cupom
export async function PUT(request: NextRequest) {
    const adminCheck = await requireAdmin();
    if (!adminCheck.authorized) return adminCheck.response;

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
    } catch (error) {
        console.error("Erro ao atualizar cupom:", error);
        return NextResponse.json({ error: "Erro ao atualizar cupom" }, { status: 500 });
    }
}

// DELETE - Remover cupom
export async function DELETE(request: NextRequest) {
    const adminCheck = await requireAdmin();
    if (!adminCheck.authorized) return adminCheck.response;

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
    } catch (error) {
        console.error("Erro ao deletar cupom:", error);
        return NextResponse.json({ error: "Erro ao deletar cupom" }, { status: 500 });
    }
}
