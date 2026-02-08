"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/store/cart";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const { getItemCount, openCart } = useCart();
    const { data: session, status } = useSession();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);

    const handleSearch = () => {
        if (searchTerm.trim().length > 1) {
            router.push(`/busca?q=${encodeURIComponent(searchTerm.trim())}`);
            setIsSearchOpen(false);
            setSearchTerm("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const navigation = [
        { name: "Novidades", href: "/novidades" },
        { name: "Brincos", href: "/categoria/brincos" },
        { name: "Colares", href: "/categoria/colares" },
        { name: "Conjuntos", href: "/categoria/conjuntos" },
        { name: "Pulseiras", href: "/categoria/pulseiras" },
        { name: "Sobre Nós", href: "/sobre" },
    ];

    return (
        <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-beige">
            {/* Top Bar - Frete Grátis */}
            <div className="bg-dark text-cream text-center py-2 text-sm tracking-wide">
                <p>FRETE GRÁTIS em compras acima de R$ 299 | Parcele em até 12x</p>
            </div>

            <div className="container">
                <div className="flex items-center justify-between h-20">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 hover:text-gold transition-colors"
                        aria-label="Menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>

                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <Image
                            src="/logo-dark.png"
                            alt="WF Semijoias"
                            width={140}
                            height={50}
                            className="h-12 w-auto"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm tracking-wider uppercase text-dark hover:text-gold transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* Dropdown Materiais */}
                        <div className="relative group">
                            <button className="text-sm tracking-wider uppercase text-dark hover:text-gold transition-colors flex items-center gap-1">
                                Materiais
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div className="absolute top-full left-0 w-48 bg-cream border border-beige shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pt-2">
                                <div className="py-2">
                                    <Link href="/linha/couro" className="block px-4 py-2 text-sm text-dark hover:bg-beige hover:text-gold">
                                        Couro
                                    </Link>
                                    <Link href="/linha/perolas" className="block px-4 py-2 text-sm text-dark hover:bg-beige hover:text-gold">
                                        Pérolas
                                    </Link>
                                    <Link href="/linha/cristal" className="block px-4 py-2 text-sm text-dark hover:bg-beige hover:text-gold">
                                        Cristal
                                    </Link>
                                    <Link href="/linha/pedras-naturais" className="block px-4 py-2 text-sm text-dark hover:bg-beige hover:text-gold">
                                        Pedras Naturais
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Icons */}
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="p-2 hover:text-gold transition-colors"
                            aria-label="Buscar"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>

                        {/* Account - Dinâmico baseado em login */}
                        <div className="relative hidden md:block">
                            {status === "loading" ? (
                                <div className="p-2 w-5 h-5 animate-pulse bg-beige rounded-full" />
                            ) : session ? (
                                <>
                                    <button
                                        onClick={() => setIsAccountOpen(!isAccountOpen)}
                                        className="flex items-center gap-2 p-2 hover:text-gold transition-colors"
                                        aria-label="Minha Conta"
                                    >
                                        {session.user?.image ? (
                                            <Image
                                                src={session.user.image}
                                                alt={session.user.name || ""}
                                                width={28}
                                                height={28}
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <div className="w-7 h-7 bg-gold text-white rounded-full flex items-center justify-center text-sm font-medium">
                                                {session.user?.name?.[0]?.toUpperCase() || "U"}
                                            </div>
                                        )}
                                    </button>
                                    {isAccountOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-cream border border-beige shadow-lg z-50">
                                            <div className="p-3 border-b border-beige">
                                                <p className="text-sm font-medium text-dark truncate">
                                                    {session.user?.name}
                                                </p>
                                                <p className="text-xs text-taupe truncate">
                                                    {session.user?.email}
                                                </p>
                                            </div>
                                            <Link
                                                href="/minha-conta/pedidos"
                                                className="block px-4 py-2 text-sm text-dark hover:bg-beige hover:text-gold transition-colors"
                                                onClick={() => setIsAccountOpen(false)}
                                            >
                                                Meus Pedidos
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setIsAccountOpen(false);
                                                    signOut();
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-dark hover:bg-beige hover:text-red-500 transition-colors"
                                            >
                                                Sair
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-dark hover:text-gold transition-colors"
                                    aria-label="Entrar"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    <span className="hidden lg:inline">Entrar</span>
                                </Link>
                            )}
                        </div>

                        {/* Wishlist */}
                        <Link
                            href="/favoritos"
                            className="p-2 hover:text-gold transition-colors hidden md:block"
                            aria-label="Favoritos"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        </Link>

                        {/* Cart */}
                        <button
                            onClick={openCart}
                            className="p-2 hover:text-gold transition-colors relative"
                            aria-label="Carrinho"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                            {/* Cart Count Badge */}
                            {getItemCount() > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-white text-xs rounded-full flex items-center justify-center">
                                    {getItemCount()}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-cream border-b border-beige animate-fadeIn">
                    <nav className="container py-6 flex flex-col gap-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-lg tracking-wider text-dark hover:text-gold transition-colors py-2 border-b border-beige/50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* Materiais Mobile */}
                        <div className="py-2 border-b border-beige/50">
                            <p className="text-sm text-taupe uppercase tracking-wider mb-2">Materiais</p>
                            <div className="flex flex-col gap-2 pl-4">
                                <Link
                                    href="/linha/couro"
                                    className="text-base text-dark hover:text-gold"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Couro
                                </Link>
                                <Link
                                    href="/linha/perolas"
                                    className="text-base text-dark hover:text-gold"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Pérolas
                                </Link>
                                <Link
                                    href="/linha/cristal"
                                    className="text-base text-dark hover:text-gold"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Cristal
                                </Link>
                                <Link
                                    href="/linha/pedras-naturais"
                                    className="text-base text-dark hover:text-gold"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Pedras Naturais
                                </Link>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 pt-4">
                            {session ? (
                                <>
                                    <Link
                                        href="/minha-conta/pedidos"
                                        className="btn btn-primary"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Meus Pedidos
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            signOut();
                                        }}
                                        className="btn btn-outline"
                                    >
                                        Sair ({session.user?.name?.split(" ")[0]})
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="btn btn-outline"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Entrar
                                </Link>
                            )}
                        </div>
                    </nav>
                </div>
            )}

            {/* Search Modal */}
            {isSearchOpen && (
                <div className="absolute top-full left-0 w-full bg-cream border-b border-beige p-4 animate-fadeIn z-50">
                    <div className="container">
                        <div className="relative max-w-3xl mx-auto">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    // Debounce logic would be better, but for simplicity:
                                    if (e.target.value.length > 2) {
                                        fetch(`/api/products/search?q=${e.target.value}`)
                                            .then(res => res.json())
                                            .then(data => setSuggestions(data))
                                            .catch(() => setSuggestions([]));
                                    } else {
                                        setSuggestions([]);
                                    }
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="O que você está buscando?"
                                className="w-full py-3 px-4 pr-12 border border-beige bg-offwhite rounded-none focus:outline-none focus:border-gold transition-colors"
                                autoFocus
                            />
                            <button
                                onClick={handleSearch}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe hover:text-gold"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>

                            {/* Live Suggestions */}
                            {suggestions.length > 0 && (
                                <div className="absolute top-full left-0 w-full bg-white border border-beige border-t-0 shadow-lg mt-1 max-h-96 overflow-y-auto">
                                    {suggestions.map((product: any) => (
                                        <Link
                                            key={product.id}
                                            href={`/produto/${product.slug}`}
                                            className="flex items-center gap-4 p-3 hover:bg-beige/30 transition-colors border-b border-beige/30 last:border-0"
                                            onClick={() => {
                                                setIsSearchOpen(false);
                                                setSearchTerm("");
                                                setSuggestions([]);
                                            }}
                                        >
                                            <div className="relative w-12 h-12 bg-offwhite flex-shrink-0">
                                                <Image
                                                    src={product.image || "/placeholder-product.jpg"}
                                                    alt={product.name}
                                                    fill
                                                    sizes="48px"
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-display text-dark text-sm">{product.name}</p>
                                                <p className="text-gold text-xs font-medium">
                                                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price)}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                    <button
                                        onClick={handleSearch}
                                        className="w-full p-2 text-center text-xs text-taupe hover:text-gold hover:bg-beige/30 uppercase tracking-wider"
                                    >
                                        Ver todos os resultados
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
