import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    if (!url || !key) return null;
    return createClient(url, key);
}

export async function GET(request: NextRequest) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const lineSlug = searchParams.get("line");

    if (!query || query.length < 2) {
        return NextResponse.json([]);
    }

    try {
        let queryBuilder = supabase
            .from("products")
            .select(`
                id,
                name,
                slug,
                price,
                compare_price,
                collection_id,
                is_active,
                images:product_images(url, is_primary),
                category:categories(name, slug),
                lines:product_lines(
                    line:lines(name, slug)
                )
            `)
            .eq("is_active", true)
            .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
            .order("name")
            .limit(50);

        // Se houver filtro de linha, precisamos filtrar
        // O Supabase não tem um "where exists" simples via API JS para relação N:N
        // Então vamos filtrar no código ou fazer uma query inversa se necessário
        // Mas como 'lines' está no select, podemos filtrar depois ou usar modificadores !inner

        if (lineSlug) {
            // Usando !inner para forçar o join e filtrar pela linha
            // Mantendo a mesma estrutura de retorno (alias 'lines') para compatibilidade de tipos
            queryBuilder = supabase
                .from("products")
                .select(`
                    id,
                    name,
                    slug,
                    price,
                    compare_price,
                    collection_id,
                    is_active,
                    images:product_images(url, is_primary),
                    category:categories(name, slug),
                    lines:product_lines!inner(
                        line:lines!inner(name, slug)
                    )
                `)
                .eq("is_active", true)
                .eq("lines.line.slug", lineSlug)
                .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
                .order("name");
        }

        const { data, error } = await queryBuilder;

        if (error) throw error;

        // Formatar produtos para o frontend
        const products = (data || []).map((product: any) => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            comparePrice: product.compare_price,
            image: product.images?.find((img: any) => img.is_primary)?.url
                || product.images?.[0]?.url
                || "/products/placeholder.jpg",
            category: product.category?.name || "Semijoias",
            // Extrair linhas se disponível (depende da query usada)
            lines: product.lines?.map((pl: any) => pl.line)
                || product.product_lines?.map((pl: any) => pl.line)
                || []
        }));

        return NextResponse.json(products);
    } catch (error: any) {
        console.error("Erro na busca:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
