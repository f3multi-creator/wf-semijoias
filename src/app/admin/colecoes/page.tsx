"use client";

import { useState, useEffect } from "react";

interface Collection {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    short_description: string | null;
    image_url: string | null;
    hero_image: string | null;
    is_active: boolean;
    position: number;
}

export default function AdminColecoesPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        short_description: "",
        is_active: true,
        position: 0,
    });

    useEffect(() => {
        loadCollections();
    }, []);

    const loadCollections = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/admin/collections");
            const data = await response.json();
            if (Array.isArray(data)) {
                setCollections(data);
            }
        } catch (error) {
            console.error("Erro ao carregar coleções:", error);
        }
        setLoading(false);
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
            ...(name === "name" ? { slug: generateSlug(value) } : {}),
        }));
    };

    const handleEdit = (collection: Collection) => {
        setEditingCollection(collection);
        setForm({
            name: collection.name,
            slug: collection.slug,
            description: collection.description || "",
            short_description: collection.short_description || "",
            is_active: collection.is_active,
            position: collection.position,
        });
        setShowForm(true);
    };

    const handleNew = () => {
        setEditingCollection(null);
        setForm({
            name: "",
            slug: "",
            description: "",
            short_description: "",
            is_active: true,
            position: collections.length,
        });
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.slug.trim()) {
            alert("Nome e slug são obrigatórios");
            return;
        }

        setSaving(true);
        try {
            const method = editingCollection ? "PUT" : "POST";
            const body = editingCollection ? { ...form, id: editingCollection.id } : form;

            const response = await fetch("/api/admin/collections", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || "Erro ao salvar");
            }

            setShowForm(false);
            loadCollections();
        } catch (error: any) {
            alert(error.message);
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta coleção?")) return;

        try {
            const response = await fetch(`/api/admin/collections?id=${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Erro ao excluir");
            }

            loadCollections();
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-display text-dark">Coleções</h1>
                <button onClick={handleNew} className="btn btn-primary">
                    + Nova Coleção
                </button>
            </div>

            {/* Formulário */}
            {showForm && (
                <div className="bg-cream border border-beige p-6 mb-8">
                    <h2 className="text-lg font-medium text-dark mb-4">
                        {editingCollection ? "Editar Coleção" : "Nova Coleção"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-taupe mb-1">Nome *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-beige bg-offwhite focus:outline-none focus:border-gold"
                                    placeholder="Ex: Verão 2026"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-taupe mb-1">Slug *</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={form.slug}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-beige bg-offwhite focus:outline-none focus:border-gold"
                                    placeholder="Ex: verao-2026"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-taupe mb-1">Descrição curta</label>
                            <input
                                type="text"
                                name="short_description"
                                value={form.short_description}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-beige bg-offwhite focus:outline-none focus:border-gold"
                                placeholder="Frase de destaque para a página da coleção"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-taupe mb-1">Descrição completa</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 border border-beige bg-offwhite focus:outline-none focus:border-gold resize-none"
                                placeholder="Texto descritivo da coleção..."
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={form.is_active}
                                    onChange={handleChange}
                                    className="accent-gold"
                                />
                                <span className="text-dark">Ativa</span>
                            </label>
                        </div>
                        <div className="flex gap-4">
                            <button type="submit" disabled={saving} className="btn btn-primary">
                                {saving ? "Salvando..." : "Salvar"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="btn btn-outline"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lista */}
            <div className="bg-cream border border-beige overflow-hidden">
                <table className="w-full">
                    <thead className="bg-beige/50">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Nome</th>
                            <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Slug</th>
                            <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Status</th>
                            <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-beige">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-taupe">
                                    Carregando...
                                </td>
                            </tr>
                        ) : collections.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-taupe">
                                    Nenhuma coleção cadastrada ainda.
                                </td>
                            </tr>
                        ) : (
                            collections.map((col) => (
                                <tr key={col.id} className="hover:bg-beige/30">
                                    <td className="px-6 py-4 text-dark font-medium">{col.name}</td>
                                    <td className="px-6 py-4 text-taupe">/{col.slug}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 text-xs rounded ${col.is_active
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {col.is_active ? "Ativa" : "Inativa"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(col)}
                                                className="text-gold hover:underline text-sm"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(col.id)}
                                                className="text-red-600 hover:underline text-sm"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <p className="text-taupe text-sm mt-4">
                Coleções são agrupamentos temáticos ou sazonais (ex: Verão 2026, Natal).
                Cada produto pode pertencer a apenas uma coleção.
            </p>
        </div>
    );
}
