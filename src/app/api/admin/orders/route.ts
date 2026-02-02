import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendShippingEmail } from "@/lib/email";

// Cliente Supabase Admin
function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

    if (!url || !key) return null;
    return createClient(url, key);
}

// GET - Listar pedidos com filtros
export async function GET(request: NextRequest) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const orderId = searchParams.get("id");

        // Se passou ID, busca pedido específico
        if (orderId) {
            const { data, error } = await supabase
                .from("orders")
                .select(`
                    *,
                    items:order_items(
                        *,
                        product:products(id, name, slug)
                    )
                `)
                .eq("id", orderId)
                .single();

            if (error) throw error;
            return NextResponse.json(data);
        }

        // Busca com filtros
        let query = supabase
            .from("orders")
            .select(`
                *,
                items:order_items(count)
            `)
            .order("created_at", { ascending: false });

        if (status && status !== "all") {
            query = query.eq("status", status);
        }

        if (startDate) {
            query = query.gte("created_at", startDate);
        }

        if (endDate) {
            query = query.lte("created_at", endDate + "T23:59:59");
        }

        const { data, error } = await query;

        if (error) throw error;
        return NextResponse.json(data || []);
    } catch (error: any) {
        console.error("Erro ao buscar pedidos:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT - Atualizar pedido (status, tracking, etc)
export async function PUT(request: NextRequest) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { id, status, tracking_code, notes } = body;

        if (!id) {
            return NextResponse.json({ error: "ID do pedido é obrigatório" }, { status: 400 });
        }

        const updateData: Record<string, any> = {
            updated_at: new Date().toISOString(),
        };

        if (status) updateData.status = status;
        if (tracking_code !== undefined) updateData.tracking_code = tracking_code;
        if (notes !== undefined) updateData.notes = notes;

        const { data, error } = await supabase
            .from("orders")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        // Disparar email de envio se status é 'shipped' e tem tracking
        if (data.status === 'shipped' && data.tracking_code && data.customer_email) {
            sendShippingEmail(
                data.customer_email,
                data.customer_name || 'Cliente',
                data.id,
                data.tracking_code
            ).then(() => {
                console.log(`Email de envio enviado para ${data.customer_email}`);
            }).catch((emailError) => {
                console.error('Erro ao enviar email de envio:', emailError);
            });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Erro ao atualizar pedido:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
