import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    if (!url || !key) return null;
    return createClient(url, key);
}

// GET - Listar pedidos do usuário logado
export async function GET(request: NextRequest) {
    try {
        // Verificar autenticação
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Não autenticado" },
                { status: 401 }
            );
        }

        const supabase = getSupabaseAdmin();
        if (!supabase) {
            return NextResponse.json(
                { error: "Erro de configuração" },
                { status: 500 }
            );
        }

        // Buscar pedidos do usuário pelo email
        const { data: orders, error } = await supabase
            .from("orders")
            .select(`
                id,
                created_at,
                status,
                payment_status,
                total,
                tracking_code,
                shipping_method,
                items:order_items(
                    id,
                    product_name,
                    product_image,
                    quantity,
                    unit_price
                )
            `)
            .eq("customer_email", session.user.email)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Erro ao buscar pedidos:", error);
            return NextResponse.json(
                { error: "Erro ao buscar pedidos" },
                { status: 500 }
            );
        }

        return NextResponse.json(orders || []);
    } catch (error) {
        console.error("Erro na API de pedidos:", error);
        return NextResponse.json(
            { error: "Erro interno" },
            { status: 500 }
        );
    }
}
