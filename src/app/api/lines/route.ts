import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// GET - Listar linhas ativas (rota pública para filtros de busca)
export async function GET() {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json([], { status: 500 });
    }

    try {
        const { data, error } = await supabase
            .from("lines")
            .select("name, slug")
            .eq("is_active", true)
            .order("position");

        if (error) throw error;
        return NextResponse.json(data || []);
    } catch (error) {
        console.error("Erro ao buscar linhas:", error);
        return NextResponse.json([], { status: 500 });
    }
}
