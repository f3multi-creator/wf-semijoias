import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";

// PATCH - Atualizar banner (ativo, posição, alt)
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const adminCheck = await requireAdmin();
    if (!adminCheck.authorized) return adminCheck.response;

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    try {
        const { id } = await params;
        const body = await request.json();

        const updateData: any = {};
        if (typeof body.is_active === "boolean") updateData.is_active = body.is_active;
        if (typeof body.position === "number") updateData.position = body.position;
        if (body.alt) updateData.alt = body.alt;

        const { data, error } = await supabase
            .from("banners")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ banner: data });
    } catch (error) {
        console.error("Erro ao atualizar banner:", error);
        return NextResponse.json({ error: "Erro ao atualizar banner" }, { status: 500 });
    }
}

// DELETE - Excluir banner
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const adminCheck = await requireAdmin();
    if (!adminCheck.authorized) return adminCheck.response;

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    try {
        const { id } = await params;

        const { error } = await supabase
            .from("banners")
            .delete()
            .eq("id", id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao excluir banner:", error);
        return NextResponse.json({ error: "Erro ao excluir banner" }, { status: 500 });
    }
}
