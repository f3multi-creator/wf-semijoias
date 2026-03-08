import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";

// GET - Obter configurações do hero
export async function GET() {
    const adminCheck = await requireAdmin();
    if (!adminCheck.authorized) return adminCheck.response;

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const { data, error } = await supabase
            .from("site_settings")
            .select("*")
            .eq("key", "hero_config")
            .single();

        if (error) {
            // Tabela ou registro não existe — retornar defaults
            console.log("[SETTINGS] hero_config não encontrado, retornando defaults");
            return NextResponse.json({
                settings: {
                    subtitle: "Coleção Exclusiva",
                    title: "Joias que contam",
                    titleHighlight: "histórias",
                    description: "Semijoias artesanais feitas à mão com pedras brasileiras premium.",
                    buttonText: "Explorar Coleção",
                    buttonLink: "/categoria/colares",
                },
                isDefault: true,
            });
        }

        return NextResponse.json({
            settings: data.value,
            isDefault: false,
        });
    } catch (error: unknown) {
        console.error("[SETTINGS] Erro ao buscar hero_config:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

// POST - Salvar configurações do hero
export async function POST(request: NextRequest) {
    const adminCheck = await requireAdmin();
    if (!adminCheck.authorized) return adminCheck.response;

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { subtitle, title, titleHighlight, description, buttonText, buttonLink } = body;

        const settings = {
            subtitle: subtitle || "Coleção Exclusiva",
            title: title || "Joias que contam",
            titleHighlight: titleHighlight || "histórias",
            description: description || "Semijoias artesanais feitas à mão com pedras brasileiras premium.",
            buttonText: buttonText || "Explorar Coleção",
            buttonLink: buttonLink || "/categoria/colares",
        };

        // Tentar upsert (inserir ou atualizar se existir)
        const { error } = await supabase
            .from("site_settings")
            .upsert(
                { key: "hero_config", value: settings, updated_at: new Date().toISOString() },
                { onConflict: "key" }
            );

        if (error) {
            console.error("[SETTINGS] Erro ao salvar hero_config:", error);
            return NextResponse.json({ error: "Erro ao salvar configurações do hero" }, { status: 500 });
        }

        return NextResponse.json({ success: true, settings });
    } catch (error: unknown) {
        console.error("[SETTINGS] Erro ao salvar hero_config:", error);
        return NextResponse.json({ error: "Erro ao salvar configurações" }, { status: 500 });
    }
}
