"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Order {
    id: string;
    customer_email: string;
    customer_name: string;
    total: number;
    subtotal: number;
    shipping_cost: number;
    status: string;
    payment_status: string;
    tracking_code: string | null;
    created_at: string;
    items: { count: number }[];
}

const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
    pending: "Pendente",
    paid: "Pago",
    processing: "Processando",
    shipped: "Enviado",
    delivered: "Entregue",
    cancelled: "Cancelado",
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

    useEffect(() => {
        loadOrders();
    }, [statusFilter]);

    const handleBulkAction = async (newStatus: string) => {
        if (!confirm(`Tem certeza que deseja alterar o status de ${selectedOrders.length} pedidos para ${statusLabels[newStatus]}?`)) return;

        try {
            const response = await fetch("/api/admin/orders/bulk-update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderIds: selectedOrders, status: newStatus }),
            });

            if (response.ok) {
                alert("Pedidos atualizados com sucesso!");
                setSelectedOrders([]);
                loadOrders();
            } else {
                alert("Erro ao atualizar pedidos.");
            }
        } catch (error) {
            console.error("Erro no bulk update:", error);
            alert("Erro ao conectar com o servidor.");
        }
    };

    const loadOrders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter !== "all") params.set("status", statusFilter);

            const response = await fetch(`/api/admin/orders?${params}`);
            const data = await response.json();

            if (Array.isArray(data)) {
                setOrders(data);
            }
        } catch (error) {
            console.error("Erro ao carregar pedidos:", error);
        }
        setLoading(false);
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

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Pedidos</h1>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-4 mb-6">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                    <option value="all">Todos os status</option>
                    <option value="pending">Pendente</option>
                    <option value="paid">Pago</option>
                    <option value="processing">Processando</option>
                    <option value="shipped">Enviado</option>
                    <option value="delivered">Entregue</option>
                    <option value="cancelled">Cancelado</option>
                </select>
            </div>

            {/* Ações em Massa */}
            {selectedOrders.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6 flex items-center justify-between animate-fadeIn">
                    <span className="text-amber-800 font-medium">
                        {selectedOrders.length} pedidos selecionados
                    </span>
                    <div className="flex gap-2">
                        <select
                            className="px-3 py-2 border border-amber-300 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            onChange={(e) => handleBulkAction(e.target.value)}
                            value=""
                        >
                            <option value="" disabled>Alterar Status para...</option>
                            <option value="paid">Pago</option>
                            <option value="shipped">Enviado</option>
                            <option value="delivered">Entregue</option>
                            <option value="cancelled">Cancelado</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Tabela */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        Carregando pedidos...
                    </div>
                ) : orders.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        Nenhum pedido encontrado
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                        checked={selectedOrders.length === orders.length}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedOrders(orders.map(o => o.id));
                                            } else {
                                                setSelectedOrders([]);
                                            }
                                        }}
                                    />
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pedido
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Data
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.id} className={`hover:bg-gray-50 ${selectedOrders.includes(order.id) ? "bg-amber-50" : ""}`}>
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                            checked={selectedOrders.includes(order.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedOrders([...selectedOrders, order.id]);
                                                } else {
                                                    setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                                                }
                                            }}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-sm text-gray-900">
                                            #{order.id.slice(0, 8).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {order.customer_name || "Cliente"}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {order.customer_email}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {formatDate(order.created_at)}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {formatPrice(order.total)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                                            {statusLabels[order.status] || order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/admin/pedidos/${order.id}`}
                                            className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                                        >
                                            Ver detalhes
                                        </Link>
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
