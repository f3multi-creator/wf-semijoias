import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
}

// GET - Listar todos os banners
export async function GET() {
    const supabase = getSupabase();
    if (!supabase) {
        return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    try {
        const { data, error } = await supabase
            .from("banners")
            .select("*")
            .order("position", { ascending: true });

        if (error) throw error;

        return NextResponse.json({ banners: data || [] });
    } catch (error: any) {
        console.error("Erro ao buscar banners:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Criar novo banner
export async function POST(request: Request) {
    const supabase = getSupabase();
    if (!supabase) {
        return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { url, alt } = body;

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        // Pegar a próxima posição
        const { data: existing } = await supabase
            .from("banners")
            .select("position")
            .order("position", { ascending: false })
            .limit(1);

        const nextPosition = (existing && existing[0]?.position || 0) + 1;

        const { data, error } = await supabase
            .from("banners")
            .insert({
                url,
                alt: alt || "Banner",
                is_active: false,
                position: nextPosition,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ banner: data });
    } catch (error: any) {
        console.error("Erro ao criar banner:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
