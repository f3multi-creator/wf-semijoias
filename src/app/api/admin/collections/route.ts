import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";

// GET - Listar todas as coleções
export async function GET() {
    const adminCheck = await requireAdmin();
    if (!adminCheck.authorized) return adminCheck.response;

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const { data, error } = await supabase
            .from("collections")
            .select("*")
            .order("position");

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error) {
        console.error("Erro ao buscar coleções:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

// POST - Criar nova coleção
export async function POST(request: NextRequest) {
    const adminCheck = await requireAdmin();
    if (!adminCheck.authorized) return adminCheck.response;

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { name, slug, description, short_description, image_url, hero_image, position, is_active } = body;

        if (!name || !slug) {
            return NextResponse.json({ error: "Nome e slug são obrigatórios" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("collections")
            .insert({
                name,
                slug,
                description,
                short_description,
                image_url,
                hero_image,
                position: position || 0,
                is_active: is_active !== false
            })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar coleção:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

// PUT - Atualizar coleção
export async function PUT(request: NextRequest) {
    const adminCheck = await requireAdmin();
    if (!adminCheck.authorized) return adminCheck.response;

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { id, name, slug, description, short_description, image_url, hero_image, position, is_active } = body;

        if (!id) {
            return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("collections")
            .update({
                name,
                slug,
                description,
                short_description,
                image_url,
                hero_image,
                position,
                is_active
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error) {
        console.error("Erro ao atualizar coleção:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

// DELETE - Remover coleção
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
            return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
        }

        const { error } = await supabase
            .from("collections")
            .delete()
            .eq("id", id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao remover coleção:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
