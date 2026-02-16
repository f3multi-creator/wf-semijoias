import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    if (!url || !key) return null;
    return createClient(url, key);
}

// GET - Obter configurações do hero
export async function GET() {
    const supabase = getSupabase();
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
    const supabase = getSupabase();
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
            // Se a tabela não existe, tentar criá-la
            if (error.code === "42P01") {
                console.log("[SETTINGS] Tabela site_settings não existe. Criando...");

                // Tentar criar a tabela via SQL
                const { error: createError } = await supabase.rpc("exec_sql", {
                    sql: `
                        CREATE TABLE IF NOT EXISTS site_settings (
                            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                            key text UNIQUE NOT NULL,
                            value jsonb NOT NULL DEFAULT '{}',
                            created_at timestamptz DEFAULT now(),
                            updated_at timestamptz DEFAULT now()
                        );
                    `
                });

                if (createError) {
                    return NextResponse.json({
                        error: "Tabela site_settings não existe. Crie no Supabase com a seguinte SQL:",
                        sql: `CREATE TABLE site_settings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    key text UNIQUE NOT NULL,
    value jsonb NOT NULL DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);`,
                    }, { status: 500 });
                }

                // Tentar novamente
                await supabase
                    .from("site_settings")
                    .upsert({ key: "hero_config", value: settings, updated_at: new Date().toISOString() }, { onConflict: "key" });
            } else {
                throw error;
            }
        }

        return NextResponse.json({ success: true, settings });
    } catch (error: unknown) {
        console.error("[SETTINGS] Erro ao salvar hero_config:", error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : "Erro interno"
        }, { status: 500 });
    }
}
