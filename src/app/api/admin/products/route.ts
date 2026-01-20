import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Cliente Supabase Admin (com service role para bypass do RLS)
function getSupabaseAdmin() {
    // .trim() remove possíveis \r\n que podem estar no final das variáveis
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

    if (!url || !key) {
        console.error("Supabase não configurado:", { url: !!url, key: !!key });
        return null;
    }

    return createClient(url, key);
}

// GET - Listar produtos ou buscar por ID
export async function GET(request: NextRequest) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    try {
        if (id) {
            // Buscar produto por ID
            const { data, error } = await supabase
                .from("products")
                .select("*, images:product_images(*), category:categories(id, name, slug)")
                .eq("id", id)
                .single();

            if (error) throw error;
            return NextResponse.json(data);
        } else {
            // Listar todos os produtos
            const { data, error } = await supabase
                .from("products")
                .select("*, images:product_images(*), category:categories(id, name, slug)")
                .order("created_at", { ascending: false });

            if (error) throw error;
            return NextResponse.json(data);
        }
    } catch (error: any) {
        console.error("Erro ao buscar produtos:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Criar novo produto
export async function POST(request: NextRequest) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { images, ...productData } = body;

        // Criar produto
        const { data: product, error: productError } = await supabase
            .from("products")
            .insert(productData)
            .select()
            .single();

        if (productError) throw productError;

        // Criar imagens se existirem
        if (images && images.length > 0) {
            const imagesToInsert = images.map((img: any, index: number) => ({
                product_id: product.id,
                url: img.url,
                is_primary: img.is_primary || index === 0,
                position: index,
            }));

            await supabase.from("product_images").insert(imagesToInsert);
        }

        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        console.error("Erro ao criar produto:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT - Atualizar produto existente
export async function PUT(request: NextRequest) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { id, images, ...productData } = body;

        if (!id) {
            return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
        }

        // Atualizar produto
        const { data: product, error: productError } = await supabase
            .from("products")
            .update(productData)
            .eq("id", id)
            .select()
            .single();

        if (productError) throw productError;

        // Atualizar imagens se fornecidas
        if (images) {
            // Deletar imagens antigas
            await supabase
                .from("product_images")
                .delete()
                .eq("product_id", id);

            // Inserir novas imagens
            if (images.length > 0) {
                const imagesToInsert = images.map((img: any, index: number) => ({
                    product_id: id,
                    url: img.url,
                    is_primary: img.is_primary || index === 0,
                    position: index,
                }));

                await supabase.from("product_images").insert(imagesToInsert);
            }
        }

        return NextResponse.json(product);
    } catch (error: any) {
        console.error("Erro ao atualizar produto:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Deletar produto
export async function DELETE(request: NextRequest) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    try {
        // Deletar imagens primeiro (por causa da constraint de foreign key)
        await supabase
            .from("product_images")
            .delete()
            .eq("product_id", id);

        // Deletar produto
        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Erro ao deletar produto:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
