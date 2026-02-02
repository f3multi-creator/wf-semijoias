"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

// Emails autorizados para acessar o admin
const ADMIN_EMAILS = ["romulofelisberto@gmail.com"];

// Ícones SVG inline para evitar dependências
const icons = {
    dashboard: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
        </svg>
    ),
    products: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    ),
    orders: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
    ),
    coupons: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
    ),
    shipping: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
    ),
    banners: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    back: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
    ),
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (status === "loading") return;

        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/admin");
            return;
        }

        // Verificar se o email está na lista de admins
        const userEmail = session?.user?.email?.toLowerCase();
        if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
            setIsAuthorized(true);
        } else {
            // Usuário logado mas não é admin
            router.push("/");
        }
    }, [status, session, router]);

    // Loading state
    if (status === "loading" || !isAuthorized) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Verificando acesso...</p>
                </div>
            </div>
        );
    }

    const navigation = [
        { name: "Dashboard", href: "/admin", icon: icons.dashboard },
        { name: "Produtos", href: "/admin/produtos", icon: icons.products },
        { name: "Pedidos", href: "/admin/pedidos", icon: icons.orders },
        { name: "Cupons", href: "/admin/cupons", icon: icons.coupons },
        { name: "Frete", href: "/admin/configuracoes", icon: icons.shipping },
        { name: "Banners", href: "/admin/banners", icon: icons.banners },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex font-body">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 fixed h-full">
                <div className="p-6 border-b border-slate-700">
                    <Link href="/admin" className="block">
                        <h1 className="text-lg font-semibold tracking-wide">
                            WF <span className="text-amber-500">Admin</span>
                        </h1>
                    </Link>
                    <p className="text-xs text-slate-500 mt-1 truncate">
                        {session?.user?.email}
                    </p>
                </div>

                <nav className="mt-2 px-3">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2.5 my-1 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-slate-700">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-slate-500 hover:text-amber-500 transition-colors text-sm"
                    >
                        {icons.back}
                        <span>Voltar para a loja</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
