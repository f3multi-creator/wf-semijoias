import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
}

// PATCH - Atualizar banner (ativo, posição, alt)
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = getSupabase();
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
    } catch (error: any) {
        console.error("Erro ao atualizar banner:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Excluir banner
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = getSupabase();
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
    } catch (error: any) {
        console.error("Erro ao excluir banner:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
