import Link from "next/link";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const navigation = [
        { name: "Dashboard", href: "/admin", icon: "📊" },
        { name: "Produtos", href: "/admin/produtos", icon: "💎" },
        { name: "Pedidos", href: "/admin/pedidos", icon: "📦" },
        { name: "Clientes", href: "/admin/clientes", icon: "👥" },
        { name: "Cupons", href: "/admin/cupons", icon: "🎟️" },
        { name: "Configurações", href: "/admin/config", icon: "⚙️" },
    ];

    return (
        <div className="min-h-screen bg-offwhite flex">
            {/* Sidebar */}
            <aside className="w-64 bg-dark text-cream flex-shrink-0">
                <div className="p-6">
                    <Link href="/admin" className="block">
                        <h1 className="font-display text-xl tracking-[0.1em]">
                            WF <span className="text-gold">ADMIN</span>
                        </h1>
                    </Link>
                </div>

                <nav className="mt-4">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 px-6 py-3 text-stone hover:text-cream hover:bg-charcoal transition-colors"
                        >
                            <span>{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 w-64 p-6 border-t border-charcoal">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-stone hover:text-gold transition-colors text-sm"
                    >
                        ← Voltar para a loja
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
