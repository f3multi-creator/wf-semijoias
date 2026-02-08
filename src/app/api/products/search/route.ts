import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const revalidate = 60; // Cache for 60 seconds

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
        return NextResponse.json([]);
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    try {
        const { data: products, error } = await supabase
            .from("products")
            .select("id, name, slug, price, images")
            .ilike("name", `%${query}%`)
            .eq("is_active", true)
            .limit(5);

        if (error) throw error;

        // Format output
        const formatted = products.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            image: p.images?.[0]?.url || "/placeholder-product.jpg",
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json([], { status: 500 });
    }
}
