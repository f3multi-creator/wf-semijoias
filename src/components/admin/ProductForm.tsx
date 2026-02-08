"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Line {
    id: string;
    name: string;
    slug: string;
    is_active: boolean;
}

interface Collection {
    id: string;
    name: string;
    slug: string;
    is_active: boolean;
}

interface ProductFormProps {
    productId?: string;
}

export function ProductForm({ productId }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [lines, setLines] = useState<Line[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false);

    // IDs das linhas selecionadas
    const [selectedLineIds, setSelectedLineIds] = useState<string[]>([]);

    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        price: "",
        compare_price: "",
        sku: "",
        stock_quantity: "0",
        category_id: "",
        collection_id: "",
        is_active: true,
        is_featured: false,
        is_new: false,
    });

    const [images, setImages] = useState<{ id?: string; url: string; is_primary: boolean }[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Carregar categorias, linhas e coleções via API
    useEffect(() => {
        async function loadData() {
            try {
                // Carregar categorias
                const catResponse = await fetch('/api/admin/categories');
                if (catResponse.ok) {
                    const data = await catResponse.json();
                    if (Array.isArray(data)) setCategories(data);
                }

                // Carregar linhas
                const linesResponse = await fetch('/api/admin/lines');
                if (linesResponse.ok) {
                    const data = await linesResponse.json();
                    if (Array.isArray(data)) setLines(data);
                }

                // Carregar coleções
                const collectionsResponse = await fetch('/api/admin/collections');
                if (collectionsResponse.ok) {
                    const data = await collectionsResponse.json();
                    if (Array.isArray(data)) setCollections(data);
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        }
        loadData();
    }, []);

    // Carregar produto para edição (via API)
    useEffect(() => {
        if (!productId) return;

        async function loadProduct() {
            setLoading(true);
            try {
                const response = await fetch(`/api/admin/products?id=${productId}`);
                const product = await response.json();

                if (product && !product.error) {
                    setForm({
                        name: product.name,
                        slug: product.slug,
                        description: product.description || "",
                        price: product.price.toString(),
                        compare_price: product.compare_price?.toString() || "",
                        sku: product.sku || "",
                        stock_quantity: product.stock_quantity.toString(),
                        category_id: product.category_id || "",
                        collection_id: product.collection_id || "",
                        is_active: product.is_active,
                        is_featured: product.is_featured,
                        is_new: product.is_new,
                    });
                    setImages(product.images?.map((img: any) => ({
                        id: img.id,
                        url: img.url,
                        is_primary: img.is_primary,
                    })) || []);
                    // Carregar linhas selecionadas
                    setSelectedLineIds(product.lines?.map((l: any) => l.id) || []);
                }
            } catch (error) {
                console.error("Erro ao carregar produto:", error);
            }
            setLoading(false);
        }
        loadProduct();
    }, [productId]);

    // Gerar slug a partir do nome
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    };

    // Atualizar form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
            // Auto-gerar slug quando mudar o nome
            ...(name === "name" ? { slug: generateSlug(value) } : {}),
        }));

        // Limpar erro do campo
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    // Upload de imagem via API (com service role)
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingImage(true);
        let hasError = false;

        for (const file of Array.from(files)) {
            // Validar antes de enviar
            if (file.size > 5 * 1024 * 1024) {
                alert(`Arquivo "${file.name}" é muito grande. Máximo: 5MB`);
                hasError = true;
                continue;
            }

            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await fetch("/api/admin/upload", {
                    method: "POST",
                    body: formData,
                });

                const result = await response.json();

                if (!response.ok) {
                    alert(`Erro ao enviar "${file.name}": ${result.error}`);
                    hasError = true;
                    continue;
                }

                // Adicionar à lista
                setImages(prev => [
                    ...prev,
                    { url: result.url, is_primary: prev.length === 0 },
                ]);
            } catch (error) {
                console.error("Erro no upload:", error);
                alert(`Erro ao enviar "${file.name}"`);
                hasError = true;
            }
        }

        setUploadingImage(false);
        e.target.value = ""; // Reset input
    };

    // Remover imagem
    const handleRemoveImage = async (index: number) => {
        const image = images[index];

        // Se a imagem tem ID, marcar para exclusão do banco
        // TODO: Implementar exclusão do storage

        setImages(prev => {
            const newImages = prev.filter((_, i) => i !== index);
            // Se removeu a primária, definir a primeira como primária
            if (image.is_primary && newImages.length > 0) {
                newImages[0].is_primary = true;
            }
            return newImages;
        });
    };

    // Definir imagem primária
    const handleSetPrimary = (index: number) => {
        setImages(prev => prev.map((img, i) => ({
            ...img,
            is_primary: i === index,
        })));
    };

    // Validar form
    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!form.name.trim()) newErrors.name = "Nome é obrigatório";
        if (!form.slug.trim()) newErrors.slug = "Slug é obrigatório";
        if (!form.price || parseFloat(form.price) <= 0) newErrors.price = "Preço deve ser maior que zero";
        if (parseInt(form.stock_quantity) < 0) newErrors.stock_quantity = "Estoque não pode ser negativo";
        if (!form.category_id) newErrors.category_id = "Categoria é obrigatória";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Toggle seleção de linha
    const handleLineToggle = (lineId: string) => {
        setSelectedLineIds(prev =>
            prev.includes(lineId)
                ? prev.filter(id => id !== lineId)
                : [...prev, lineId]
        );
    };

    // Salvar produto (via API)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setSaving(true);

        try {
            const productData = {
                id: productId, // Incluir ID para update
                name: form.name.trim(),
                slug: form.slug.trim(),
                description: form.description.trim() || null,
                price: parseFloat(form.price),
                compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
                sku: form.sku.trim() || null,
                stock_quantity: parseInt(form.stock_quantity),
                category_id: form.category_id || null,
                collection_id: form.collection_id || null,
                is_active: form.is_active,
                is_featured: form.is_featured,
                is_new: form.is_new,
                images: images,
                line_ids: selectedLineIds, // Linhas selecionadas
            };

            const method = productId ? "PUT" : "POST";
            const response = await fetch("/api/admin/products", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Erro ao salvar produto");
            }

            // Redirecionar para lista
            router.push("/admin/produtos");
            router.refresh();

        } catch (error: any) {
            console.error("Erro ao salvar:", error);
            alert(`Erro ao salvar produto: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-taupe">Carregando...</div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl">
            <div className="bg-cream border border-beige p-6 space-y-6">
                {/* Nome e Slug */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-taupe mb-1">Nome *</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-beige'} bg-offwhite focus:outline-none focus:border-gold`}
                            placeholder="Brinco Gota Ametista"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm text-taupe mb-1">Slug *</label>
                        <input
                            type="text"
                            name="slug"
                            value={form.slug}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border ${errors.slug ? 'border-red-500' : 'border-beige'} bg-offwhite focus:outline-none focus:border-gold`}
                            placeholder="brinco-gota-ametista"
                        />
                        {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                    </div>
                </div>

                {/* Descrição */}
                <div>
                    <label className="block text-sm text-taupe mb-1">Descrição</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-beige bg-offwhite focus:outline-none focus:border-gold resize-none"
                        placeholder="Descrição detalhada do produto..."
                    />
                </div>

                {/* Preços */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm text-taupe mb-1">Preço (R$) *</label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            className={`w-full px-4 py-2 border ${errors.price ? 'border-red-500' : 'border-beige'} bg-offwhite focus:outline-none focus:border-gold`}
                            placeholder="299.90"
                        />
                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                    </div>
                    <div>
                        <label className="block text-sm text-taupe mb-1">
                            Preço Original (R$)
                            <span className="ml-1 text-xs text-gray-400" title="Preço antes do desconto. Exibe 'De R$X por R$Y' no site">ⓘ</span>
                        </label>
                        <input
                            type="number"
                            name="compare_price"
                            value={form.compare_price}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            className="w-full px-4 py-2 border border-beige bg-offwhite focus:outline-none focus:border-gold"
                            placeholder="349.90 (opcional - mostra desconto)"
                        />
                        <p className="text-xs text-gray-400 mt-1">Deixe vazio se não houver desconto</p>
                    </div>
                    <div>
                        <label className="block text-sm text-taupe mb-1">SKU</label>
                        <input
                            type="text"
                            name="sku"
                            value={form.sku}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-beige bg-offwhite focus:outline-none focus:border-gold"
                            placeholder="BR-AM-001"
                        />
                    </div>
                </div>

                {/* Categoria e Estoque */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-taupe mb-1">Categoria *</label>
                        <select
                            name="category_id"
                            value={form.category_id}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border ${errors.category_id ? 'border-red-500' : 'border-beige'} bg-offwhite focus:outline-none focus:border-gold`}
                        >
                            <option value="">Selecione...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                    </div>
                    <div>
                        <label className="block text-sm text-taupe mb-1">
                            Estoque *
                            <span className="ml-1 text-xs text-gray-400" title="Quantidade disponível para venda">ⓘ</span>
                        </label>
                        <input
                            type="number"
                            name="stock_quantity"
                            value={form.stock_quantity}
                            onChange={handleChange}
                            min="0"
                            className={`w-full px-4 py-2 border ${errors.stock_quantity ? 'border-red-500' : 'border-beige'} bg-offwhite focus:outline-none focus:border-gold`}
                            placeholder="10"
                        />
                        {errors.stock_quantity && <p className="text-red-500 text-xs mt-1">{errors.stock_quantity}</p>}
                        {parseInt(form.stock_quantity) <= 5 && parseInt(form.stock_quantity) > 0 && (
                            <p className="text-amber-600 text-xs mt-1">⚠️ Estoque baixo</p>
                        )}
                    </div>
                </div>

                {/* Linhas (Materiais) e Coleção */}
                <div className="border-t border-beige pt-6">
                    <h3 className="text-sm font-medium text-dark mb-4">Classificação</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Linhas (multi-select) */}
                        <div>
                            <label className="block text-sm text-taupe mb-2">
                                Linhas (materiais)
                                <span className="ml-1 text-xs text-gray-400">opcionais</span>
                            </label>
                            <div className="flex flex-wrap gap-3 p-3 border border-beige bg-offwhite rounded">
                                {lines.length === 0 ? (
                                    <p className="text-taupe text-sm">Nenhuma linha cadastrada</p>
                                ) : (
                                    lines.filter(l => l.is_active).map(line => (
                                        <label
                                            key={line.id}
                                            className={`flex items-center gap-2 px-3 py-1.5 border rounded cursor-pointer transition-colors ${selectedLineIds.includes(line.id)
                                                    ? 'border-gold bg-gold/10 text-gold'
                                                    : 'border-beige hover:border-gold/50'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedLineIds.includes(line.id)}
                                                onChange={() => handleLineToggle(line.id)}
                                                className="hidden"
                                            />
                                            <span className="text-sm">{line.name}</span>
                                        </label>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Coleção (single select) */}
                        <div>
                            <label className="block text-sm text-taupe mb-2">
                                Coleção
                                <span className="ml-1 text-xs text-gray-400">opcional</span>
                            </label>
                            <select
                                name="collection_id"
                                value={form.collection_id}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-beige bg-offwhite focus:outline-none focus:border-gold"
                            >
                                <option value="">Nenhuma coleção</option>
                                {collections.filter(c => c.is_active).map(col => (
                                    <option key={col.id} value={col.id}>{col.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Opções */}
                <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={form.is_active}
                            onChange={handleChange}
                            className="accent-gold"
                        />
                        <span className="text-dark">Ativo</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="is_featured"
                            checked={form.is_featured}
                            onChange={handleChange}
                            className="accent-gold"
                        />
                        <span className="text-dark">Em Destaque</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="is_new"
                            checked={form.is_new}
                            onChange={handleChange}
                            className="accent-gold"
                        />
                        <span className="text-dark">Novidade</span>
                    </label>
                </div>

                {/* Imagens */}
                <div>
                    <label className="block text-sm text-taupe mb-2">Imagens</label>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {images.map((img, index) => (
                            <div key={index} className="relative aspect-square bg-beige group">
                                <Image
                                    src={img.url}
                                    alt={`Imagem ${index + 1}`}
                                    fill
                                    sizes="150px"
                                    className="object-cover"
                                />
                                {img.is_primary && (
                                    <span className="absolute top-2 left-2 bg-gold text-white text-xs px-2 py-1">
                                        Principal
                                    </span>
                                )}
                                <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    {!img.is_primary && (
                                        <button
                                            type="button"
                                            onClick={() => handleSetPrimary(index)}
                                            className="p-2 bg-white text-dark rounded hover:bg-gold hover:text-white"
                                            title="Definir como principal"
                                        >
                                            ★
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="p-2 bg-white text-red-600 rounded hover:bg-red-600 hover:text-white"
                                        title="Remover"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Upload Button */}
                        <label className="aspect-square border-2 border-dashed border-beige hover:border-gold transition-colors flex flex-col items-center justify-center cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={uploadingImage}
                            />
                            {uploadingImage ? (
                                <span className="text-taupe">Enviando...</span>
                            ) : (
                                <>
                                    <span className="text-3xl text-taupe">+</span>
                                    <span className="text-xs text-taupe mt-1">Adicionar</span>
                                </>
                            )}
                        </label>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-6">
                <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary"
                >
                    {saving ? "Salvando..." : productId ? "Salvar Alterações" : "Criar Produto"}
                </button>
                <Link href="/admin/produtos" className="btn btn-outline">
                    Cancelar
                </Link>
            </div>
        </form>
    );
}
