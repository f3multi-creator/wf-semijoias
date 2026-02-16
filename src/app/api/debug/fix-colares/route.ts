import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    if (!url || !key) return null;
    return createClient(url, key);
}

// GET - Diagnóstico de categorias + normalização do slug "colares"
export async function GET() {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    // 1. Listar todas as categorias
    const { data: categories, error: catError } = await supabase
        .from("categories")
        .select("id, name, slug, position")
        .order("position", { ascending: true });

    if (catError) {
        return NextResponse.json({ error: catError.message }, { status: 500 });
    }

    // 2. Verificar se existe a categoria "colares"
    const colares = categories?.find((c) => c.slug === "colares");

    // 3. Verificar se existe alguma categoria com slug "cordao", "cordoes", "cordão" etc
    const cordaoVariants = categories?.filter((c) =>
        c.slug.includes("cordao") ||
        c.slug.includes("cordoes") ||
        c.slug.includes("cordão") ||
        c.name.toLowerCase().includes("cordão") ||
        c.name.toLowerCase().includes("cordao") ||
        c.name.toLowerCase().includes("colar")
    );

    return NextResponse.json({
        allCategories: categories,
        colaresFound: !!colares,
        colaresCategory: colares || null,
        cordaoVariants: cordaoVariants || [],
        hint: !colares && cordaoVariants && cordaoVariants.length > 0
            ? `Categoria "${cordaoVariants[0].name}" (slug: ${cordaoVariants[0].slug}) encontrada. Use POST para normalizar para "Colares" com slug "colares".`
            : colares
                ? "Categoria 'colares' encontrada! Verifique se há produtos associados."
                : "Nenhuma categoria 'colares' ou variantes encontrada. Crie uma no painel admin.",
    });
}

// POST - Normalizar: renomear qualquer variante de "cordão" para "Colares"
export async function POST() {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    // Buscar variantes
    const { data: categories } = await supabase
        .from("categories")
        .select("id, name, slug")
        .or("slug.ilike.%cordao%,slug.ilike.%cordoes%,name.ilike.%cordão%,name.ilike.%cordao%");

    if (!categories || categories.length === 0) {
        // Se não encontrou variantes, verificar se colares já existe
        const { data: colares } = await supabase
            .from("categories")
            .select("id, name, slug")
            .eq("slug", "colares")
            .single();

        if (colares) {
            return NextResponse.json({
                success: true,
                message: "Categoria 'colares' já existe. Nenhuma alteração necessária.",
                category: colares,
            });
        }

        return NextResponse.json({
            success: false,
            message: "Nenhuma categoria 'cordão' ou variante encontrada para normalizar. Crie a categoria 'Colares' manualmente.",
        }, { status: 404 });
    }

    // Normalizar a primeira variante encontrada
    const target = categories[0];
    const { data: updated, error } = await supabase
        .from("categories")
        .update({ name: "Colares", slug: "colares" })
        .eq("id", target.id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        success: true,
        message: `Categoria "${target.name}" (slug: ${target.slug}) normalizada para "Colares" (slug: colares)`,
        before: target,
        after: updated,
    });
}
