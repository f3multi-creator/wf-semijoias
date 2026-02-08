import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Cliente Supabase Admin (com service role para bypass do RLS)
function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

    if (!url || !key) {
        return null;
    }

    return createClient(url, key);
}

// GET - Listar todas as linhas
export async function GET() {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const { data, error } = await supabase
            .from("lines")
            .select("*")
            .order("position");

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Erro ao buscar linhas:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Criar nova linha
export async function POST(request: NextRequest) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { name, slug, description, image_url, position, is_active } = body;

        if (!name || !slug) {
            return NextResponse.json({ error: "Nome e slug são obrigatórios" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("lines")
            .insert({
                name,
                slug,
                description,
                image_url,
                position: position || 0,
                is_active: is_active !== false
            })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
        console.error("Erro ao criar linha:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT - Atualizar linha
export async function PUT(request: NextRequest) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { id, name, slug, description, image_url, position, is_active } = body;

        if (!id) {
            return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("lines")
            .update({
                name,
                slug,
                description,
                image_url,
                position,
                is_active
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Erro ao atualizar linha:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Remover linha
export async function DELETE(request: NextRequest) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
        }

        const { error } = await supabase
            .from("lines")
            .delete()
            .eq("id", id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Erro ao remover linha:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
