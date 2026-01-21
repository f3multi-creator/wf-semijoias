"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock_quantity: number;
    is_active: boolean;
    low_stock_threshold: number;
    category: { id: string; name: string; slug: string } | null;
    images: { url: string; is_primary: boolean }[];
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Filtros
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadProducts();
    }, [search, categoryFilter, statusFilter]);

    const loadCategories = async () => {
        try {
            const response = await fetch("/api/categories");
            const data = await response.json();
            if (Array.isArray(data)) {
                setCategories(data);
            }
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
        }
    };

    const loadProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            if (categoryFilter) params.set("category_id", categoryFilter);
            if (statusFilter) params.set("is_active", statusFilter);

            const response = await fetch(`/api/admin/products?${params}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setProducts(data);
            }
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
        }
        setLoading(false);
    };

    // Debounce para busca
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
    const handleSearchChange = (value: string) => {
        if (searchTimeout) clearTimeout(searchTimeout);
        const timeout = setTimeout(() => {
            setSearch(value);
        }, 300);
        setSearchTimeout(timeout);
    };

    const formatPrice = (value: number) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-display text-dark">Produtos</h1>
                <Link href="/admin/produtos/novo" className="btn btn-primary">
                    + Novo Produto
                </Link>
            </div>

            {/* Filtros funcionais */}
            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Buscar produtos..."
                    defaultValue=""
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold"
                />
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold"
                >
                    <option value="">Todas as categorias</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold"
                >
                    <option value="">Todos os status</option>
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                </select>
                {(search || categoryFilter || statusFilter) && (
                    <button
                        onClick={() => {
                            setSearch("");
                            setCategoryFilter("");
                            setStatusFilter("");
                        }}
                        className="px-4 py-2 text-taupe hover:text-dark underline text-sm"
                    >
                        Limpar filtros
                    </button>
                )}
            </div>

            {/* Products Table */}
            <div className="bg-cream border border-beige overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-beige/50">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Produto</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Categoria</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Preço</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Estoque</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-beige">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-taupe">
                                        Carregando produtos...
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-taupe">
                                        {search || categoryFilter || statusFilter
                                            ? "Nenhum produto encontrado com os filtros aplicados."
                                            : "Nenhum produto cadastrado ainda."}
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => {
                                    const primaryImage = product.images?.find((img) => img.is_primary)?.url
                                        || product.images?.[0]?.url
                                        || "/products/brinco-ametista-1.jpg";

                                    return (
                                        <tr key={product.id} className="hover:bg-beige/30">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-12 h-12 bg-beige">
                                                        <Image
                                                            src={primaryImage}
                                                            alt={product.name}
                                                            fill
                                                            sizes="48px"
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-dark font-medium">{product.name}</p>
                                                        <p className="text-taupe text-xs">/{product.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-dark">{product.category?.name || '-'}</td>
                                            <td className="px-6 py-4 text-dark">{formatPrice(product.price)}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`${product.stock_quantity === 0
                                                        ? "text-red-600"
                                                        : product.stock_quantity <= (product.low_stock_threshold || 5)
                                                            ? "text-yellow-600"
                                                            : "text-green-600"
                                                        }`}
                                                >
                                                    {product.stock_quantity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded ${product.is_active
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    {product.is_active ? "Ativo" : "Inativo"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/admin/produtos/${product.id}`}
                                                        className="text-gold hover:underline text-sm"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <Link
                                                        href={`/produto/${product.slug}`}
                                                        target="_blank"
                                                        className="text-taupe hover:underline text-sm"
                                                    >
                                                        Ver
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Contagem de resultados */}
            {!loading && products.length > 0 && (
                <p className="text-taupe text-sm mt-4">
                    {products.length} produto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
                </p>
            )}
        </div>
    );
}
