import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
}

// GET - Listar banners ativos (API pública)
export async function GET() {
    const supabase = getSupabase();
    if (!supabase) {
        return NextResponse.json({ banners: [] });
    }

    try {
        const { data, error } = await supabase
            .from("banners")
            .select("id, url, alt, position")
            .eq("is_active", true)
            .order("position", { ascending: true });

        if (error) throw error;

        return NextResponse.json({
            banners: data || [],
            count: data?.length || 0
        });
    } catch (error: any) {
        console.error("Erro ao buscar banners:", error);
        return NextResponse.json({ banners: [], count: 0 });
    }
}
