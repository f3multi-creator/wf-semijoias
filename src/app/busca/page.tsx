"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice: number | null;
    image: string;
    category: string;
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialQuery = searchParams.get("q") || "";
    const initialLine = searchParams.get("line") || "";

    const [query, setQuery] = useState(initialQuery);
    const [selectedLine, setSelectedLine] = useState(initialLine);
    const [products, setProducts] = useState<Product[]>([]);
    const [lines, setLines] = useState<{ name: string, slug: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    // Carregar linhas disponíveis
    useEffect(() => {
        fetch("/api/admin/lines")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setLines(data);
            })
            .catch(console.error);
    }, []);

    const searchProducts = useCallback(async (searchQuery: string, lineSlug: string) => {
        if (searchQuery.length < 2 && !lineSlug) {
            setProducts([]);
            setSearched(false);
            return;
        }

        setLoading(true);
        setSearched(true);

        // Atualizar URL sem recarregar
        const params = new URLSearchParams();
        if (searchQuery) params.set("q", searchQuery);
        if (lineSlug) params.set("line", lineSlug);
        router.replace(`/busca?${params.toString()}`, { scroll: false });

        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&line=${encodeURIComponent(lineSlug)}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Erro na busca:", error);
            setProducts([]);
        }
        setLoading(false);
    }, [router]);

    // Buscar quando a query ou linha muda (com debounce para query)
    useEffect(() => {
        const timeout = setTimeout(() => {
            searchProducts(query, selectedLine);
        }, 300);

        return () => clearTimeout(timeout);
    }, [query, selectedLine, searchProducts]);

    const formatPrice = (value: number) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    return (
        <div className="min-h-screen bg-offwhite">
            {/* Header de busca */}
            <div className="bg-cream border-b border-beige py-8">
                <div className="container">
                    <h1 className="font-display text-3xl text-dark mb-6 text-center">
                        Buscar Produtos
                    </h1>
                    <div className="max-w-2xl mx-auto">
                        <div className="relative mb-6">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="O que você está procurando?"
                                className="w-full px-6 py-4 text-lg border border-beige bg-white focus:outline-none focus:border-gold transition-colors"
                                autoFocus
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe">
                                {loading ? (
                                    <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                )}
                            </div>
                        </div>

                        {/* Filtros de Linha */}
                        {lines.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2">
                                <button
                                    onClick={() => setSelectedLine("")}
                                    className={`px-4 py-1 rounded-full text-sm transition-colors ${selectedLine === ""
                                        ? "bg-dark text-white"
                                        : "bg-white border border-beige text-dark hover:border-gold"
                                        }`}
                                >
                                    Todos
                                </button>
                                {lines.map((line) => (
                                    <button
                                        key={line.slug}
                                        onClick={() => setSelectedLine(line.slug)}
                                        className={`px-4 py-1 rounded-full text-sm transition-colors ${selectedLine === line.slug
                                            ? "bg-dark text-white"
                                            : "bg-white border border-beige text-dark hover:border-gold"
                                            }`}
                                    >
                                        {line.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {query.length > 0 && query.length < 2 && !selectedLine && (
                            <p className="text-taupe text-sm mt-2 text-center">
                                Digite pelo menos 2 caracteres para buscar
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Resultados */}
            <div className="container py-12">
                {loading && (
                    <div className="text-center py-12">
                        <p className="text-taupe">Buscando produtos...</p>
                    </div>
                )}

                {!loading && searched && products.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-dark text-lg mb-2">
                            Nenhum produto encontrado
                        </p>
                        <p className="text-taupe">
                            Tente buscar por outros termos ou remover os filtros
                        </p>
                        <button
                            onClick={() => {
                                setQuery("");
                                setSelectedLine("");
                            }}
                            className="text-gold hover:underline mt-4 inline-block"
                        >
                            Limpar busca
                        </button>
                    </div>
                )}

                {!loading && products.length > 0 && (
                    <>
                        <p className="text-taupe mb-6 text-center md:text-left">
                            {products.length} resultado{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/produto/${product.slug}`}
                                    className="group bg-white border border-beige hover:border-gold transition-colors flex flex-col"
                                >
                                    <div className="relative aspect-square bg-cream overflow-hidden">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-4 flex-grow flex flex-col justify-between">
                                        <div>
                                            <p className="text-xs text-gold uppercase tracking-wider mb-1">
                                                {product.category}
                                            </p>
                                            <h3 className="font-medium text-dark mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                                                {product.name}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-dark font-semibold">
                                                {formatPrice(product.price)}
                                            </span>
                                            {product.comparePrice && product.comparePrice > product.price && (
                                                <span className="text-taupe text-sm line-through">
                                                    {formatPrice(product.comparePrice)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}

                {!loading && !searched && (
                    <div className="text-center py-12">
                        <p className="text-taupe">
                            Use a barra de pesquisa ou os filtros acima
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
