import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";

// GET - Listar todas as categorias
export async function GET() {
    const adminCheck = await requireAdmin();
    if (!adminCheck.authorized) return adminCheck.response;

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .order("position");

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        return NextResponse.json({ error: "Erro ao buscar categorias" }, { status: 500 });
    }
}

// POST - Criar nova categoria
export async function POST(request: NextRequest) {
    const adminCheck = await requireAdmin();
    if (!adminCheck.authorized) return adminCheck.response;

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { name, slug, description, image_url, position } = body;

        if (!name || !slug) {
            return NextResponse.json({ error: "Nome e slug são obrigatórios" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("categories")
            .insert({ name, slug, description, image_url, position: position || 0 })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar categoria:", error);
        return NextResponse.json({ error: "Erro ao criar categoria" }, { status: 500 });
    }
}

// PUT - Atualizar categoria
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
            return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("categories")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error) {
        console.error("Erro ao atualizar categoria:", error);
        return NextResponse.json({ error: "Erro ao atualizar categoria" }, { status: 500 });
    }
}
