import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendStockAlertEmail } from "@/lib/email";

export const revalidate = 0;

export async function GET(request: Request) {
    // Opcional: Verificar segredo do Cron para segurança
    const authHeader = request.headers.get("authorization");
    if (
        process.env.CRON_SECRET &&
        authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        // Buscar produtos com estoque baixo (< 5)
        // Assumindo que there is a 'stock_quantity' field
        const { data: products, error } = await supabase
            .from("products")
            .select("id, name, slug, stock_quantity")
            .lt("stock_quantity", 5)
            .gt("stock_quantity", 0) // Ignorar esgotados (0) se quiser, ou incluir. Vamos incluir 0 também? 
            // O plano diz "acabando", então talvez 1-4. Mas 0 é crítico.
            // Vamos pegar < 5 e > -1 (para não pegar negativos se houver erro)
            .order("stock_quantity", { ascending: true })
            .limit(20);

        if (error) throw error;

        if (!products || products.length === 0) {
            return NextResponse.json({ message: "Stock is healthy" });
        }

        // Enviar email
        const formattedProducts = products.map((p) => ({
            name: p.name,
            stock: p.stock_quantity,
            slug: p.slug,
        }));

        const emailResult = await sendStockAlertEmail(formattedProducts);

        if (!emailResult.success) {
            throw new Error("Failed to send email");
        }

        return NextResponse.json({
            success: true,
            products_alerted: products.length,
        });
    } catch (error) {
        console.error("Cron Stock Alert Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
