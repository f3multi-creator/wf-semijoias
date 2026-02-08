import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendAbandonedCartEmail } from "@/lib/email";

export const revalidate = 0;

export async function GET(request: Request) {
    // Verificar segredo do Cron
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
        // Buscar carrinhos abandonados:
        // status = 'open'
        // updated_at < 1 hour ago (mas não muito antigo, ex: 24h)
        // Para teste vamos colocar > 5 minutos

        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

        // Join com auth.users para pegar o email (se possível com service role)
        // Mas auth.users não é diretamente acessível via .from('auth.users') normalmente sem config extra
        // A melhor prática é ter uma tabela 'profiles' ou 'customers' sincronizada.
        // Vamos assumir que temos user_id e podemos buscar o email.

        // Primeiro pegar os carrinhos
        const { data: carts, error } = await supabase
            .from("carts")
            .select("*")
            .eq("status", "open")
            .lt("updated_at", oneHourAgo)
            .limit(20);

        if (error) throw error;

        if (!carts || carts.length === 0) {
            return NextResponse.json({ message: "No abandoned carts found" });
        }

        let emailsSent = 0;
        const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wfsemijoias.com.br';

        for (const cart of carts) {
            // Buscar dados do usuário (email)
            // Usando admin auth client
            const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(cart.user_id);

            if (userError || !user || !user.email) {
                console.error(`User not found for cart ${cart.id}`);
                continue;
            }

            // Enviar email
            // Assumindo 'name' no metadata ou generic
            const name = user.user_metadata?.name || "Cliente";
            const link = `${SITE_URL}/checkout`; // Link direto pro checkout/carrinho

            await sendAbandonedCartEmail(user.email, name, link);

            // Atualizar status para 'abandoned' (para não enviar novamente)
            await supabase
                .from("carts")
                .update({ status: 'abandoned' })
                .eq("id", cart.id);

            emailsSent++;
        }

        return NextResponse.json({
            success: true,
            emails_sent: emailsSent,
        });
    } catch (error) {
        console.error("Abandoned Cart Cron Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
