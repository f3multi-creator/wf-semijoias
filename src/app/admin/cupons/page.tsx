"use client";

import { useState, useEffect } from "react";

interface Coupon {
    id: string;
    code: string;
    discount_type: "percentage" | "fixed";
    discount_value: number;
    min_purchase: number;
    max_uses: number | null;
    uses_count: number;
    expires_at: string | null;
    is_active: boolean;
    created_at: string;
}

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [form, setForm] = useState({
        code: "",
        discount_type: "percentage" as "percentage" | "fixed",
        discount_value: "",
        min_purchase: "",
        max_uses: "",
        expires_at: "",
        is_active: true,
    });

    useEffect(() => {
        loadCoupons();
    }, []);

    const loadCoupons = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/admin/coupons");
            const data = await response.json();
            if (Array.isArray(data)) {
                setCoupons(data);
            }
        } catch (error) {
            console.error("Erro ao carregar cupons:", error);
        }
        setLoading(false);
    };

    const resetForm = () => {
        setForm({
            code: "",
            discount_type: "percentage",
            discount_value: "",
            min_purchase: "",
            max_uses: "",
            expires_at: "",
            is_active: true,
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (coupon: Coupon) => {
        setForm({
            code: coupon.code,
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value.toString(),
            min_purchase: coupon.min_purchase.toString(),
            max_uses: coupon.max_uses?.toString() || "",
            expires_at: coupon.expires_at?.split("T")[0] || "",
            is_active: coupon.is_active,
        });
        setEditingId(coupon.id);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                id: editingId,
                code: form.code,
                discount_type: form.discount_type,
                discount_value: parseFloat(form.discount_value),
                min_purchase: parseFloat(form.min_purchase) || 0,
                max_uses: form.max_uses ? parseInt(form.max_uses) : null,
                expires_at: form.expires_at || null,
                is_active: form.is_active,
            };

            const method = editingId ? "PUT" : "POST";
            const response = await fetch("/api/admin/coupons", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                resetForm();
                loadCoupons();
            } else {
                const data = await response.json();
                alert(`Erro: ${data.error}`);
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar cupom");
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este cupom?")) return;

        try {
            const response = await fetch(`/api/admin/coupons?id=${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                loadCoupons();
            } else {
                const data = await response.json();
                alert(`Erro: ${data.error}`);
            }
        } catch (error) {
            console.error("Erro ao deletar:", error);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("pt-BR");
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Cupons</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 font-medium"
                >
                    + Novo Cupom
                </button>
            </div>

            {/* Formulário */}
            {showForm && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {editingId ? "Editar Cupom" : "Novo Cupom"}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Código *
                            </label>
                            <input
                                type="text"
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                placeholder="DESCONTO10"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo de Desconto *
                            </label>
                            <select
                                value={form.discount_type}
                                onChange={(e) => setForm({ ...form, discount_type: e.target.value as any })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            >
                                <option value="percentage">Porcentagem (%)</option>
                                <option value="fixed">Valor Fixo (R$)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Valor do Desconto *
                            </label>
                            <input
                                type="number"
                                value={form.discount_value}
                                onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                                placeholder={form.discount_type === "percentage" ? "10" : "50"}
                                required
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Compra Mínima (R$)
                            </label>
                            <input
                                type="number"
                                value={form.min_purchase}
                                onChange={(e) => setForm({ ...form, min_purchase: e.target.value })}
                                placeholder="0"
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Máximo de Usos
                            </label>
                            <input
                                type="number"
                                value={form.max_uses}
                                onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                                placeholder="Ilimitado"
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expira em
                            </label>
                            <input
                                type="date"
                                value={form.expires_at}
                                onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.is_active}
                                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                    className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                                />
                                <span className="text-sm text-gray-700">Ativo</span>
                            </label>
                        </div>
                        <div className="md:col-span-2 flex gap-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 disabled:opacity-50 font-medium"
                            >
                                {saving ? "Salvando..." : editingId ? "Salvar" : "Criar Cupom"}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tabela */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        Carregando cupons...
                    </div>
                ) : coupons.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        Nenhum cupom cadastrado
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Código</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Desconto</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Mín. Compra</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Usos</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Expira</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {coupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono font-medium text-gray-900">
                                        {coupon.code}
                                    </td>
                                    <td className="px-6 py-4">
                                        {coupon.discount_type === "percentage"
                                            ? `${coupon.discount_value}%`
                                            : `R$ ${coupon.discount_value.toFixed(2)}`}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        R$ {coupon.min_purchase.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {coupon.uses_count}/{coupon.max_uses || "∞"}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {formatDate(coupon.expires_at)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${coupon.is_active
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                            }`}>
                                            {coupon.is_active ? "Ativo" : "Inativo"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(coupon)}
                                                className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(coupon.id)}
                                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
