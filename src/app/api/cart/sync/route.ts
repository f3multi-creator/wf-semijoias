import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const session = await auth();
        const { items } = await request.json();

        // Verify authentication
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { error } = await supabase
            .from("carts")
            .upsert({
                user_id: userId,
                items,
                updated_at: new Date().toISOString(),
                status: 'open'
            }, { onConflict: 'user_id' });

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Cart Sync Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
