import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Emails autorizados para acessar o admin
const ADMIN_EMAILS = ["romulofelisberto@gmail.com"];

/**
 * Verifica se o usuário autenticado é admin.
 * Retorna a session se autorizado, ou uma NextResponse 401/403 se não.
 */
export async function requireAdmin(): Promise<
    | { authorized: true; session: any }
    | { authorized: false; response: NextResponse }
> {
    const session = await auth();

    if (!session?.user?.email) {
        return {
            authorized: false,
            response: NextResponse.json(
                { error: "Não autenticado" },
                { status: 401 }
            ),
        };
    }

    if (!ADMIN_EMAILS.includes(session.user.email)) {
        return {
            authorized: false,
            response: NextResponse.json(
                { error: "Acesso negado" },
                { status: 403 }
            ),
        };
    }

    return { authorized: true, session };
}
