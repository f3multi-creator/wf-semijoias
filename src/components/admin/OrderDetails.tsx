"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface OrderDetailsProps {
    order: any;
}

const statusOptions = [
    { value: "pending", label: "Pendente", color: "yellow" },
    { value: "confirmed", label: "Confirmado", color: "blue" },
    { value: "processing", label: "Processando", color: "purple" },
    { value: "shipped", label: "Enviado", color: "indigo" },
    { value: "delivered", label: "Entregue", color: "green" },
    { value: "cancelled", label: "Cancelado", color: "red" },
];

export function OrderDetails({ order }: OrderDetailsProps) {
    const [status, setStatus] = useState(order.status);
    const [trackingCode, setTrackingCode] = useState(order.tracking_code || "");
    const [notes, setNotes] = useState(order.notes || "");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const formatPrice = (value: number) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage("");

        const { error } = await supabase
            .from("orders")
            .update({
                status,
                tracking_code: trackingCode || null,
                notes: notes || null,
            })
            .eq("id", order.id);

        if (error) {
            setMessage("Erro ao salvar. Tente novamente.");
        } else {
            setMessage("Pedido atualizado com sucesso!");

            // TODO: Enviar notificação ao cliente via WhatsApp/Email
            // Se status mudou para 'shipped', enviar código de rastreio
        }

        setSaving(false);
    };

    const shippingAddress = order.shipping_address || {};

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
                {/* Order Items */}
                <div className="bg-cream border border-beige p-6">
                    <h2 className="font-display text-xl text-dark mb-4">Itens do Pedido</h2>
                    <div className="space-y-4">
                        {order.items?.map((item: any) => (
                            <div key={item.id} className="flex gap-4 p-4 bg-offwhite">
                                <div className="relative w-16 h-16 bg-beige flex-shrink-0">
                                    {item.product_image && (
                                        <Image
                                            src={item.product_image}
                                            alt={item.product_name}
                                            fill
                                            sizes="64px"
                                            className="object-cover"
                                        />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-dark font-medium">{item.product_name}</p>
                                    {item.product_sku && (
                                        <p className="text-taupe text-xs">SKU: {item.product_sku}</p>
                                    )}
                                    <p className="text-taupe text-sm mt-1">
                                        {item.quantity}x {formatPrice(item.unit_price)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-dark font-medium">{formatPrice(item.total)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="mt-6 pt-4 border-t border-beige space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-taupe">Subtotal</span>
                            <span className="text-dark">{formatPrice(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-taupe">Frete</span>
                            <span className="text-dark">{formatPrice(order.shipping_cost)}</span>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-green-600">Desconto</span>
                                <span className="text-green-600">-{formatPrice(order.discount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-medium pt-2 border-t border-beige">
                            <span className="text-dark">Total</span>
                            <span className="text-dark">{formatPrice(order.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-cream border border-beige p-6">
                    <h2 className="font-display text-xl text-dark mb-4">Endereço de Entrega</h2>
                    <div className="text-brown">
                        <p>{shippingAddress.street}, {shippingAddress.number}</p>
                        {shippingAddress.complement && <p>{shippingAddress.complement}</p>}
                        <p>{shippingAddress.neighborhood}</p>
                        <p>{shippingAddress.city} - {shippingAddress.state}</p>
                        <p>CEP: {shippingAddress.postal_code}</p>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                {/* Customer Info */}
                <div className="bg-cream border border-beige p-6">
                    <h2 className="font-display text-xl text-dark mb-4">Cliente</h2>
                    <div className="space-y-2">
                        <p className="text-dark font-medium">{order.customer_name || '-'}</p>
                        <p className="text-taupe text-sm">{order.customer_email}</p>
                        {order.customer_phone && (
                            <p className="text-taupe text-sm">{order.customer_phone}</p>
                        )}
                    </div>
                    <div className="mt-4 flex gap-2">
                        <a
                            href={`https://wa.me/55${order.customer_phone?.replace(/\D/g, '')}?text=Olá! Sobre seu pedido #${order.order_number} na WF Semijoias...`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 btn btn-outline text-sm py-2"
                        >
                            WhatsApp
                        </a>
                        <a
                            href={`mailto:${order.customer_email}?subject=Pedido #${order.order_number} - WF Semijoias`}
                            className="flex-1 btn btn-outline text-sm py-2"
                        >
                            Email
                        </a>
                    </div>
                </div>

                {/* Order Status */}
                <div className="bg-cream border border-beige p-6">
                    <h2 className="font-display text-xl text-dark mb-4">Status do Pedido</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-taupe mb-1">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-beige bg-offwhite focus:outline-none focus:border-gold"
                            >
                                {statusOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-taupe mb-1">Código de Rastreio</label>
                            <input
                                type="text"
                                value={trackingCode}
                                onChange={(e) => setTrackingCode(e.target.value)}
                                placeholder="Ex: BR123456789BR"
                                className="w-full px-4 py-2 border border-beige bg-offwhite focus:outline-none focus:border-gold"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-taupe mb-1">Observações internas</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 border border-beige bg-offwhite focus:outline-none focus:border-gold resize-none"
                            />
                        </div>

                        {message && (
                            <p className={`text-sm ${message.includes('Erro') ? 'text-red-600' : 'text-green-600'}`}>
                                {message}
                            </p>
                        )}

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full btn btn-primary"
                        >
                            {saving ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="bg-cream border border-beige p-6">
                    <h2 className="font-display text-xl text-dark mb-4">Pagamento</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-taupe">Status</span>
                            <span className={`px-2 py-1 text-xs rounded ${order.payment_status === 'approved'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {order.payment_status === 'approved' ? 'Aprovado' : 'Pendente'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-taupe">Método</span>
                            <span className="text-dark">{order.payment_method || '-'}</span>
                        </div>
                        {order.payment_id && (
                            <div className="flex justify-between">
                                <span className="text-taupe">ID MP</span>
                                <span className="text-dark text-xs">{order.payment_id}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Info */}
                <div className="bg-cream border border-beige p-6">
                    <h2 className="font-display text-xl text-dark mb-4">Informações</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-taupe">Pedido</span>
                            <span className="text-dark">#{order.order_number}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-taupe">Data</span>
                            <span className="text-dark">{formatDate(order.created_at)}</span>
                        </div>
                        {order.coupon_code && (
                            <div className="flex justify-between">
                                <span className="text-taupe">Cupom</span>
                                <span className="text-gold">{order.coupon_code}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
