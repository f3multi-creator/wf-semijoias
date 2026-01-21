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

    if (!query || query.length < 2) {
        return NextResponse.json([]);
    }

    try {
        const { data, error } = await supabase
            .from("products")
            .select(`
                id,
                name,
                slug,
                price,
                compare_price,
                is_active,
                images:product_images(url, is_primary),
                category:categories(name, slug)
            `)
            .eq("is_active", true)
            .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
            .order("name")
            .limit(20);

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
        }));

        return NextResponse.json(products);
    } catch (error: any) {
        console.error("Erro na busca:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
