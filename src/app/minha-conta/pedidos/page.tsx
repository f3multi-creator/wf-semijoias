"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface OrderItem {
    id: string;
    product_name: string;
    product_image: string;
    quantity: number;
    unit_price: number;
}

interface Order {
    id: string;
    created_at: string;
    status: string;
    payment_status: string;
    total: number;
    tracking_code: string | null;
    shipping_method: string;
    items: OrderItem[];
}

const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
    confirmed: { label: "Confirmado", color: "bg-blue-100 text-blue-800" },
    processing: { label: "Preparando", color: "bg-purple-100 text-purple-800" },
    shipped: { label: "Enviado", color: "bg-green-100 text-green-800" },
    delivered: { label: "Entregue", color: "bg-green-200 text-green-900" },
    cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800" },
    refunded: { label: "Reembolsado", color: "bg-gray-100 text-gray-800" },
};

export default function MeusPedidosPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/minha-conta/pedidos");
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user?.email) {
            fetchOrders();
        }
    }, [session]);

    async function fetchOrders() {
        try {
            const res = await fetch("/api/user/orders");
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Erro ao buscar pedidos:", error);
        } finally {
            setLoading(false);
        }
    }

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-cream py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-48"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return null;
    }

    return (
        <div className="min-h-screen bg-cream py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-display text-dark mb-2">
                        Meus Pedidos
                    </h1>
                    <p className="text-taupe">
                        Olá, {session?.user?.name || session?.user?.email}!
                    </p>
                </div>

                {/* Lista de Pedidos */}
                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <h2 className="text-xl font-medium text-dark mb-2">
                            Nenhum pedido ainda
                        </h2>
                        <p className="text-taupe mb-6">
                            Você ainda não fez nenhuma compra. Que tal explorar nossa coleção?
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-dark text-white px-6 py-3 rounded hover:bg-dark/90 transition"
                        >
                            Ver Produtos
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-lg shadow-sm overflow-hidden"
                            >
                                {/* Cabeçalho do Pedido */}
                                <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-taupe">
                                            Pedido #{order.id.slice(0, 8).toUpperCase()}
                                        </p>
                                        <p className="text-xs text-taupe">
                                            {new Date(order.created_at).toLocaleDateString("pt-BR", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${statusLabels[order.status]?.color || "bg-gray-100"
                                                }`}
                                        >
                                            {statusLabels[order.status]?.label || order.status}
                                        </span>
                                        <span className="font-medium text-dark">
                                            R$ {order.total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Itens do Pedido */}
                                <div className="p-4">
                                    <div className="flex flex-wrap gap-4">
                                        {order.items.slice(0, 3).map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-3"
                                            >
                                                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden relative">
                                                    {item.product_image ? (
                                                        <Image
                                                            src={item.product_image}
                                                            alt={item.product_name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-2xl">
                                                            💎
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-dark line-clamp-1">
                                                        {item.product_name}
                                                    </p>
                                                    <p className="text-xs text-taupe">
                                                        Qtd: {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <div className="flex items-center text-sm text-taupe">
                                                +{order.items.length - 3} item(s)
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Rastreamento */}
                                {order.tracking_code && (
                                    <div className="px-4 pb-4">
                                        <a
                                            href={`https://www.linkcorreios.com.br/?id=${order.tracking_code}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm text-gold hover:underline"
                                        >
                                            <span>📦</span>
                                            Rastrear: {order.tracking_code}
                                        </a>
                                    </div>
                                )}

                                {/* Botão de Detalhes */}
                                <div className="px-4 pb-4">
                                    <button
                                        onClick={() =>
                                            setSelectedOrder(
                                                selectedOrder?.id === order.id ? null : order
                                            )
                                        }
                                        className="text-sm text-dark hover:text-gold transition"
                                    >
                                        {selectedOrder?.id === order.id
                                            ? "Ocultar detalhes"
                                            : "Ver detalhes"}
                                    </button>
                                </div>

                                {/* Detalhes Expandidos */}
                                {selectedOrder?.id === order.id && (
                                    <div className="bg-gray-50 p-4 border-t">
                                        <h4 className="font-medium text-dark mb-3">
                                            Itens do Pedido
                                        </h4>
                                        <div className="space-y-2">
                                            {order.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex justify-between text-sm"
                                                >
                                                    <span className="text-dark">
                                                        {item.quantity}x {item.product_name}
                                                    </span>
                                                    <span className="text-taupe">
                                                        R$ {(item.unit_price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 pt-4 border-t flex justify-between font-medium">
                                            <span>Total</span>
                                            <span className="text-gold">
                                                R$ {order.total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Link para Voltar */}
                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="text-taupe hover:text-dark transition"
                    >
                        ← Continuar comprando
                    </Link>
                </div>
            </div>
        </div>
    );
}
