import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "romulofelisberto@gmail.com")
    .split(",")
    .map((e: string) => e.trim().toLowerCase());

export default auth((req) => {
    const { pathname } = req.nextUrl;

    // Bloquear endpoints de debug em produção
    if (pathname.startsWith("/api/debug")) {
        if (process.env.NODE_ENV === "production") {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
    }

    // Proteger rotas admin (páginas e API)
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
        if (!req.auth?.user?.email) {
            if (pathname.startsWith("/api/")) {
                return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
            }
            const loginUrl = new URL("/login", req.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }

        const email = req.auth.user.email.toLowerCase();
        if (!ADMIN_EMAILS.includes(email)) {
            if (pathname.startsWith("/api/")) {
                return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
            }
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/admin/:path*",
        "/api/admin/:path*",
        "/api/debug/:path*",
    ],
};
