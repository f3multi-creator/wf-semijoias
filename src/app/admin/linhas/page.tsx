"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Line {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    is_active: boolean;
    position: number;
}

export default function AdminLinhasPage() {
    const [lines, setLines] = useState<Line[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingLine, setEditingLine] = useState<Line | null>(null);
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        is_active: true,
        position: 0,
    });

    useEffect(() => {
        loadLines();
    }, []);

    const loadLines = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/admin/lines");
            const data = await response.json();
            if (Array.isArray(data)) {
                setLines(data);
            }
        } catch (error) {
            console.error("Erro ao carregar linhas:", error);
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

    const handleEdit = (line: Line) => {
        setEditingLine(line);
        setForm({
            name: line.name,
            slug: line.slug,
            description: line.description || "",
            is_active: line.is_active,
            position: line.position,
        });
        setShowForm(true);
    };

    const handleNew = () => {
        setEditingLine(null);
        setForm({
            name: "",
            slug: "",
            description: "",
            is_active: true,
            position: lines.length,
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
            const method = editingLine ? "PUT" : "POST";
            const body = editingLine ? { ...form, id: editingLine.id } : form;

            const response = await fetch("/api/admin/lines", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || "Erro ao salvar");
            }

            setShowForm(false);
            loadLines();
        } catch (error: any) {
            alert(error.message);
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta linha?")) return;

        try {
            const response = await fetch(`/api/admin/lines?id=${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Erro ao excluir");
            }

            loadLines();
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-display text-dark">Linhas (Materiais)</h1>
                <button onClick={handleNew} className="btn btn-primary">
                    + Nova Linha
                </button>
            </div>

            {/* Formulário */}
            {showForm && (
                <div className="bg-cream border border-beige p-6 mb-8">
                    <h2 className="text-lg font-medium text-dark mb-4">
                        {editingLine ? "Editar Linha" : "Nova Linha"}
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
                                    placeholder="Ex: Pérolas"
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
                                    placeholder="Ex: perolas"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-taupe mb-1">Descrição</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-4 py-2 border border-beige bg-offwhite focus:outline-none focus:border-gold resize-none"
                                placeholder="Descrição curta da linha..."
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
                        ) : lines.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-taupe">
                                    Nenhuma linha cadastrada ainda.
                                </td>
                            </tr>
                        ) : (
                            lines.map((line) => (
                                <tr key={line.id} className="hover:bg-beige/30">
                                    <td className="px-6 py-4 text-dark font-medium">{line.name}</td>
                                    <td className="px-6 py-4 text-taupe">/{line.slug}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 text-xs rounded ${line.is_active
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {line.is_active ? "Ativa" : "Inativa"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(line)}
                                                className="text-gold hover:underline text-sm"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(line.id)}
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
                Linhas são os materiais usados nas joias (ex: Couro, Pérolas, Cristal).
                Um produto pode pertencer a múltiplas linhas.
            </p>
        </div>
    );
}
