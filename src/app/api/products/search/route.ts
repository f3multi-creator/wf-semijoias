import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const revalidate = 60; // Cache for 60 seconds

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
        return NextResponse.json([]);
    }

    // Sanitizar query contra manipulação PostgREST
    const sanitized = query.replace(/[%_(),."'\\]/g, '');
    if (!sanitized) {
        return NextResponse.json([]);
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json([], { status: 500 });
    }

    try {
        const { data: products, error } = await supabase
            .from("products")
            .select("id, name, slug, price, images")
            .ilike("name", `%${sanitized}%`)
            .eq("is_active", true)
            .limit(5);

        if (error) throw error;

        const formatted = (products || []).map((p: any) => ({
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
