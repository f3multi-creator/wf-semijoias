"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, StarOff, Upload, Search, ImageIcon } from "lucide-react";

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    is_featured: boolean;
    is_active: boolean;
    images?: { url: string }[];
    category?: { name: string };
}

interface Category {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    position: number;
}

export default function HomepageEditorPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [saving, setSaving] = useState<string | null>(null);
    const [tab, setTab] = useState<"bestsellers" | "categories">("bestsellers");
    const [uploadingCat, setUploadingCat] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch("/api/admin/products"),
                fetch("/api/admin/categories"),
            ]);
            const prodData = await prodRes.json();
            const catData = await catRes.json();
            setProducts(Array.isArray(prodData) ? prodData : []);
            setCategories(Array.isArray(catData) ? catData : []);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        } finally {
            setLoading(false);
        }
    }

    async function toggleFeatured(productId: string, currentValue: boolean) {
        setSaving(productId);
        try {
            const res = await fetch("/api/admin/products", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: productId, is_featured: !currentValue }),
            });
            if (res.ok) {
                setProducts((prev) =>
                    prev.map((p) =>
                        p.id === productId ? { ...p, is_featured: !currentValue } : p
                    )
                );
            }
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
        } finally {
            setSaving(null);
        }
    }

    async function handleCategoryImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files?.[0] || !selectedCatId) return;

        const file = e.target.files[0];
        setUploadingCat(selectedCatId);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });
            const uploadData = await uploadRes.json();

            if (!uploadData.url) throw new Error("Upload falhou");

            // Atualizar imagem da categoria
            const res = await fetch("/api/admin/categories", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: selectedCatId, image_url: uploadData.url }),
            });

            if (res.ok) {
                setCategories((prev) =>
                    prev.map((c) =>
                        c.id === selectedCatId ? { ...c, image_url: uploadData.url } : c
                    )
                );
            }
        } catch (error) {
            console.error("Erro ao fazer upload:", error);
            alert("Erro ao fazer upload da imagem");
        } finally {
            setUploadingCat(null);
            setSelectedCatId(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    function triggerUpload(catId: string) {
        setSelectedCatId(catId);
        setTimeout(() => fileInputRef.current?.click(), 50);
    }

    const featuredProducts = products.filter((p) => p.is_featured);
    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-8 text-center text-taupe">
                Carregando...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin"
                    className="p-2 hover:bg-beige rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-display text-dark">
                        Editor da Página Inicial
                    </h1>
                    <p className="text-sm text-taupe">
                        Gerencie os mais vendidos e as fotos das categorias
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setTab("bestsellers")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === "bestsellers"
                            ? "bg-white text-dark shadow-sm"
                            : "text-taupe hover:text-dark"
                        }`}
                >
                    Mais Vendidos ({featuredProducts.length})
                </button>
                <button
                    onClick={() => setTab("categories")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === "categories"
                            ? "bg-white text-dark shadow-sm"
                            : "text-taupe hover:text-dark"
                        }`}
                >
                    Fotos das Categorias
                </button>
            </div>

            {/* Tab: Mais Vendidos */}
            {tab === "bestsellers" && (
                <div className="space-y-6">
                    {/* Produtos em destaque atuais */}
                    {featuredProducts.length > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                            <h2 className="text-lg font-medium text-dark mb-4 flex items-center gap-2">
                                <Star className="w-5 h-5 text-amber-500" />
                                Mais Vendidos Atuais ({featuredProducts.length})
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {featuredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="bg-white rounded-lg p-3 border border-amber-200 relative group"
                                    >
                                        <div className="relative aspect-square mb-2 bg-gray-100 rounded overflow-hidden">
                                            {product.images?.[0]?.url ? (
                                                <Image
                                                    src={product.images[0].url}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="150px"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <ImageIcon className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-dark font-medium truncate">
                                            {product.name}
                                        </p>
                                        <button
                                            onClick={() => toggleFeatured(product.id, true)}
                                            disabled={saving === product.id}
                                            className="absolute top-1 right-1 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                            title="Remover dos mais vendidos"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Busca e lista de todos os produtos */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h2 className="text-lg font-medium text-dark mb-4">
                            Todos os Produtos
                        </h2>
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar produto por nome ou categoria..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-sm"
                            />
                        </div>
                        <div className="max-h-[500px] overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-gray-50">
                                    <tr>
                                        <th className="text-left py-2 px-3 font-medium text-taupe">Foto</th>
                                        <th className="text-left py-2 px-3 font-medium text-taupe">Produto</th>
                                        <th className="text-left py-2 px-3 font-medium text-taupe">Categoria</th>
                                        <th className="text-left py-2 px-3 font-medium text-taupe">Preço</th>
                                        <th className="text-center py-2 px-3 font-medium text-taupe">Destaque</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product) => (
                                        <tr
                                            key={product.id}
                                            className={`border-t border-gray-100 hover:bg-gray-50 ${product.is_featured ? "bg-amber-50/50" : ""
                                                }`}
                                        >
                                            <td className="py-2 px-3">
                                                <div className="w-10 h-10 relative rounded overflow-hidden bg-gray-100">
                                                    {product.images?.[0]?.url ? (
                                                        <Image
                                                            src={product.images[0].url}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                            sizes="40px"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <ImageIcon className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-2 px-3">
                                                <span className="font-medium text-dark">{product.name}</span>
                                                {!product.is_active && (
                                                    <span className="ml-2 text-xs text-red-500">(inativo)</span>
                                                )}
                                            </td>
                                            <td className="py-2 px-3 text-taupe">
                                                {product.category?.name || "—"}
                                            </td>
                                            <td className="py-2 px-3 text-dark">
                                                {product.price?.toLocaleString("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                })}
                                            </td>
                                            <td className="py-2 px-3 text-center">
                                                <button
                                                    onClick={() =>
                                                        toggleFeatured(product.id, product.is_featured)
                                                    }
                                                    disabled={saving === product.id}
                                                    className={`p-1.5 rounded-lg transition-colors ${product.is_featured
                                                            ? "text-amber-500 hover:text-amber-700 hover:bg-amber-100"
                                                            : "text-gray-300 hover:text-amber-500 hover:bg-amber-50"
                                                        } disabled:opacity-50`}
                                                    title={
                                                        product.is_featured
                                                            ? "Remover dos mais vendidos"
                                                            : "Adicionar aos mais vendidos"
                                                    }
                                                >
                                                    {product.is_featured ? (
                                                        <Star className="w-5 h-5 fill-current" />
                                                    ) : (
                                                        <StarOff className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab: Fotos das Categorias */}
            {tab === "categories" && (
                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h2 className="text-lg font-medium text-dark mb-2">
                            Fotos das Categorias
                        </h2>
                        <p className="text-sm text-taupe mb-6">
                            Estas fotos aparecem na seção &quot;Explore por Categoria&quot; da página inicial.
                            Formato recomendado: proporção 3:4 (ex: 600×800px).
                        </p>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleCategoryImageUpload}
                            className="hidden"
                        />

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {categories.map((cat) => (
                                <div key={cat.id} className="space-y-3">
                                    {/* Image Preview */}
                                    <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden group">
                                        {cat.image_url ? (
                                            <Image
                                                src={cat.image_url}
                                                alt={cat.name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                                                <ImageIcon className="w-12 h-12" />
                                                <span className="text-xs">Sem imagem</span>
                                            </div>
                                        )}

                                        {/* Overlay com botão de upload */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                            <button
                                                onClick={() => triggerUpload(cat.id)}
                                                disabled={uploadingCat === cat.id}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-dark px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-amber-50 disabled:opacity-50"
                                            >
                                                {uploadingCat === cat.id ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                                                        Enviando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-4 h-4" />
                                                        {cat.image_url ? "Trocar Foto" : "Enviar Foto"}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Label */}
                                    <div className="text-center">
                                        <p className="font-medium text-dark text-sm">{cat.name}</p>
                                        <p className="text-xs text-taupe">/{cat.slug}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
