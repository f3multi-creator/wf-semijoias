import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(request: Request) {
    const adminCheck = await requireAdmin();
    if (!adminCheck.authorized) return adminCheck.response;

    try {
        const { orderIds, status } = await request.json();

        if (!orderIds || !Array.isArray(orderIds) || !status) {
            return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

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
