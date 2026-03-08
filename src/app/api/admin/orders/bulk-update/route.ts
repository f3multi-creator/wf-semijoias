import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(request: Request) {
    const adminCheck = await requireAdmin();
    if (!adminCheck.authorized) return adminCheck.response;

    try {
        const { orderIds, status } = await request.json();

        if (!orderIds || !Array.isArray(orderIds) || !status) {
            return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();
        if (!supabase) {
            return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
        }

        const { error } = await supabase
            .from("orders")
            .update({ status })
            .in("id", orderIds);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Bulk update error:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
