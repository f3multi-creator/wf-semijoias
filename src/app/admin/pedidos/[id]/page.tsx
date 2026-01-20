"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: {
        id: string;
        name: string;
        slug: string;
    };
}

interface Order {
    id: string;
    customer_email: string;
    customer_name: string;
    customer_phone: string;
    total: number;
    subtotal: number;
    shipping_cost: number;
    status: string;
    payment_status: string;
    payment_method: string;
    tracking_code: string | null;
    shipping_address: any;
    notes: string | null;
    created_at: string;
    updated_at: string;
    items: OrderItem[];
}

const statusOptions = [
    { value: "pending", label: "Pendente" },
    { value: "paid", label: "Pago" },
    { value: "processing", label: "Processando" },
    { value: "shipped", label: "Enviado" },
    { value: "delivered", label: "Entregue" },
    { value: "cancelled", label: "Cancelado" },
];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState("");
    const [trackingCode, setTrackingCode] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        loadOrder();
    }, [id]);

    const loadOrder = async () => {
        try {
            const response = await fetch(`/api/admin/orders?id=${id}`);
            const data = await response.json();

            if (data && !data.error) {
                setOrder(data);
                setStatus(data.status);
                setTrackingCode(data.tracking_code || "");
                setNotes(data.notes || "");
            }
        } catch (error) {
            console.error("Erro ao carregar pedido:", error);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch("/api/admin/orders", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    status,
                    tracking_code: trackingCode || null,
                    notes: notes || null,
                }),
            });

            if (response.ok) {
                alert("Pedido atualizado com sucesso!");
                loadOrder();
            } else {
                const data = await response.json();
                alert(`Erro: ${data.error}`);
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar pedido");
        }
        setSaving(false);
    };

    const formatPrice = (value: number) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Carregando pedido...</div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Pedido não encontrado</p>
                <Link href="/admin/pedidos" className="text-amber-600 hover:underline mt-4 inline-block">
                    Voltar para pedidos
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link href="/admin/pedidos" className="text-sm text-gray-500 hover:text-amber-600 mb-2 inline-block">
                        ← Voltar para pedidos
                    </Link>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Pedido #{order.id.slice(0, 8).toUpperCase()}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Criado em {formatDate(order.created_at)}
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Info do Pedido */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Itens do Pedido</h2>
                        <div className="divide-y divide-gray-200">
                            {order.items?.map((item) => (
                                <div key={item.id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-gray-900">{item.product?.name}</p>
                                        <p className="text-sm text-gray-500">Quantidade: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                            )) || (
                                    <p className="text-gray-500">Nenhum item encontrado</p>
                                )}
                        </div>
                        <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span>{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Frete</span>
                                <span>{formatPrice(order.shipping_cost)}</span>
                            </div>
                            <div className="flex justify-between font-medium text-lg pt-2 border-t">
                                <span>Total</span>
                                <span className="text-amber-600">{formatPrice(order.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Cliente */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Cliente</h2>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-gray-500">Nome:</span> {order.customer_name}</p>
                            <p><span className="text-gray-500">Email:</span> {order.customer_email}</p>
                            {order.customer_phone && (
                                <p><span className="text-gray-500">Telefone:</span> {order.customer_phone}</p>
                            )}
                        </div>
                    </div>

                    {/* Endereço */}
                    {order.shipping_address && (
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Endereço de Entrega</h2>
                            <div className="text-sm text-gray-700">
                                <p>{order.shipping_address.street}, {order.shipping_address.number}</p>
                                {order.shipping_address.complement && <p>{order.shipping_address.complement}</p>}
                                <p>{order.shipping_address.neighborhood}</p>
                                <p>{order.shipping_address.city} - {order.shipping_address.state}</p>
                                <p>CEP: {order.shipping_address.zip_code}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Ações */}
                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Atualizar Pedido</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    {statusOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Código de Rastreamento
                                </label>
                                <input
                                    type="text"
                                    value={trackingCode}
                                    onChange={(e) => setTrackingCode(e.target.value)}
                                    placeholder="Ex: BR123456789BR"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Observações Internas
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    placeholder="Notas sobre o pedido..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                                />
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 disabled:opacity-50 font-medium"
                            >
                                {saving ? "Salvando..." : "Salvar Alterações"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
