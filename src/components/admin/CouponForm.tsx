"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface CouponFormProps {
    couponId?: string;
}

export function CouponForm({ couponId }: CouponFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        code: "",
        description: "",
        discount_type: "percentage",
        discount_value: "",
        minimum_order_value: "",
        max_uses: "",
        max_uses_per_customer: "1",
        starts_at: "",
        expires_at: "",
        is_active: true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Carregar cupom para edição
    useEffect(() => {
        if (!couponId) return;

        async function loadCoupon() {
            setLoading(true);
            const { data: coupon } = await supabase
                .from("coupons")
                .select("*")
                .eq("id", couponId)
                .single();

            if (coupon) {
                setForm({
                    code: coupon.code,
                    description: coupon.description || "",
                    discount_type: coupon.discount_type,
                    discount_value: coupon.discount_value.toString(),
                    minimum_order_value: coupon.minimum_order_value?.toString() || "",
                    max_uses: coupon.max_uses?.toString() || "",
                    max_uses_per_customer: coupon.max_uses_per_customer?.toString() || "1",
                    starts_at: coupon.starts_at ? coupon.starts_at.split("T")[0] : "",
                    expires_at: coupon.expires_at ? coupon.expires_at.split("T")[0] : "",
                    is_active: coupon.is_active,
                });
            }
            setLoading(false);
        }
        loadCoupon();
    }, [couponId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!form.code.trim()) newErrors.code = "Código é obrigatório";
        if (!form.discount_value || parseFloat(form.discount_value) <= 0) {
            newErrors.discount_value = "Valor do desconto é obrigatório";
        }
        if (form.discount_type === "percentage" && parseFloat(form.discount_value) > 100) {
            newErrors.discount_value = "Percentual não pode ser maior que 100%";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setSaving(true);

        try {
            const couponData = {
                code: form.code.toUpperCase().trim(),
                description: form.description.trim() || null,
                discount_type: form.discount_type,
                discount_value: parseFloat(form.discount_value),
                minimum_order_value: form.minimum_order_value
                    ? parseFloat(form.minimum_order_value)
                    : null,
                max_uses: form.max_uses ? parseInt(form.max_uses) : null,
                max_uses_per_customer: form.max_uses_per_customer
                    ? parseInt(form.max_uses_per_customer)
                    : 1,
                starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
                expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
                is_active: form.is_active,
            };

            if (couponId) {
                const { error } = await supabase
                    .from("coupons")
                    .update(couponData)
                    .eq("id", couponId);

                if (error) throw error;
            } else {
                const { error } = await supabase.from("coupons").insert(couponData);

                if (error) throw error;
            }

            router.push("/admin/cupons");
            router.refresh();
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar cupom. Verifique se o código já existe.");
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
        <form onSubmit={handleSubmit} className="max-w-xl">
            <div className="bg-cream border border-beige p-6 space-y-6">
                {/* Código */}
                <div>
                    <label className="block text-sm text-taupe mb-1">Código do Cupom *</label>
                    <input
                        type="text"
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.code ? "border-red-500" : "border-beige"
                            } bg-offwhite focus:outline-none focus:border-gold uppercase`}
                        placeholder="PRIMEIRACOMPRA"
                    />
                    {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                </div>

                {/* Descrição */}
                <div>
                    <label className="block text-sm text-taupe mb-1">Descrição (interno)</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-4 py-2 border border-beige bg-offwhite focus:outline-none focus:border-gold resize-none"
                        placeholder="10% off para novos clientes"
                    />
                </div>

                {/* Tipo e Valor */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-taupe mb-1">Tipo de Desconto *</label>
                        <select
                            name="discount_type"
                            value={form.discount_type}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-beige bg-offwhite focus:outline-none focus:border-gold"
                        >
                            <option value="percentage">Percentual (%)</option>
                            <option value="fixed">Valor Fixo (R$)</option>
                            <option value="free_shipping">Frete Grátis</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-taupe mb-1">
                            {form.discount_type === "percentage"
                                ? "Percentual (%)"
                                : form.discount_type === "fixed"
                                    ? "Valor (R$)"
                                    : "Valor (não usado)"}{" "}
                            *
                        </label>
                        <input
                            type="number"
                            name="discount_value"
                            value={form.discount_value}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            disabled={form.discount_type === "free_shipping"}
                            className={`w-full px-4 py-2 border ${errors.discount_value ? "border-red-500" : "border-beige"
                                } bg-offwhite focus:outline-none focus:border-gold disabled:opacity-50`}
                            placeholder={form.discount_type === "percentage" ? "10" : "50.00"}
                        />
                        {errors.discount_value && (
                            <p className="text-red-500 text-xs mt-1">{errors.discount_value}</p>
                        )}
                    </div>
                </div>

                {/* Valor mínimo */}
                <div>
                    <label className="block text-sm text-taupe mb-1">
                        Valor Mínimo do Pedido (R$)
                    </label>
                    <input
                        type="number"
                        name="minimum_order_value"
                        value={form.minimum_order_value}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-2 border border-beige bg-offwhite focus:outline-none focus:border-gold"
                        placeholder="Opcional"
                    />
                </div>

                {/* Limites de uso */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-taupe mb-1">Máximo de Usos Total</label>
                        <input
                            type="number"
                            name="max_uses"
                            value={form.max_uses}
                            onChange={handleChange}
                            min="1"
                            className="w-full px-4 py-2 border border-beige bg-offwhite focus:outline-none focus:border-gold"
                            placeholder="Ilimitado"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-taupe mb-1">Usos por Cliente</label>
                        <input
                            type="number"
                            name="max_uses_per_customer"
                            value={form.max_uses_per_customer}
                            onChange={handleChange}
                            min="1"
                            className="w-full px-4 py-2 border border-beige bg-offwhite focus:outline-none focus:border-gold"
                            placeholder="1"
                        />
                    </div>
                </div>

                {/* Validade */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-taupe mb-1">Data Início</label>
                        <input
                            type="date"
                            name="starts_at"
                            value={form.starts_at}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-beige bg-offwhite focus:outline-none focus:border-gold"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-taupe mb-1">Data Expiração</label>
                        <input
                            type="date"
                            name="expires_at"
                            value={form.expires_at}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-beige bg-offwhite focus:outline-none focus:border-gold"
                        />
                    </div>
                </div>

                {/* Ativo */}
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={form.is_active}
                        onChange={handleChange}
                        className="accent-gold"
                    />
                    <span className="text-dark">Cupom Ativo</span>
                </label>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-6">
                <button type="submit" disabled={saving} className="btn btn-primary">
                    {saving ? "Salvando..." : couponId ? "Salvar Alterações" : "Criar Cupom"}
                </button>
                <Link href="/admin/cupons" className="btn btn-outline">
                    Cancelar
                </Link>
            </div>
        </form>
    );
}
