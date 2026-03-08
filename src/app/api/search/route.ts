import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

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

    // Sanitizar query contra manipulação PostgREST
    const sanitized = query.replace(/[%_(),."'\\]/g, '');
    if (!sanitized) {
        return NextResponse.json([]);
    }

    // Sanitizar lineSlug
    const sanitizedLine = lineSlug ? lineSlug.replace(/[%_(),."'\\]/g, '') : '';

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
            .or(`name.ilike.%${sanitized}%,description.ilike.%${sanitized}%`)
            .order("name")
            .limit(50);

        if (sanitizedLine) {
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
                .eq("lines.line.slug", sanitizedLine)
                .or(`name.ilike.%${sanitized}%,description.ilike.%${sanitized}%`)
                .order("name");
        }

        const { data, error } = await queryBuilder;

        if (error) throw error;

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
            lines: product.lines?.map((pl: any) => pl.line)
                || product.product_lines?.map((pl: any) => pl.line)
                || []
        }));

        return NextResponse.json(products);
    } catch (error) {
        console.error("Erro na busca:", error);
        return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
    }
}
