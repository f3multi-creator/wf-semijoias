"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart, formatPrice } from "@/store/cart";

export function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getShipping, getTotal } = useCart();

    const subtotal = getSubtotal();
    const shipping = getShipping(subtotal);
    const total = getTotal();
    const freeShippingRemaining = Math.max(0, 300 - subtotal);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-dark/50 z-40 transition-opacity"
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-cream z-50 shadow-2xl flex flex-col animate-slideIn">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-beige">
                    <h2 className="font-display text-2xl text-dark">Seu Carrinho</h2>
                    <button
                        onClick={closeCart}
                        className="p-2 hover:text-gold transition-colors"
                        aria-label="Fechar carrinho"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Free Shipping Progress */}
                {freeShippingRemaining > 0 && items.length > 0 && (
                    <div className="px-6 py-4 bg-beige/50">
                        <p className="text-sm text-brown mb-2">
                            Faltam <span className="font-semibold text-gold">{formatPrice(freeShippingRemaining)}</span> para frete grátis!
                        </p>
                        <div className="h-2 bg-beige rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gold transition-all duration-300"
                                style={{ width: `${Math.min((subtotal / 300) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {items.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 text-taupe">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <p className="text-taupe mb-4">Seu carrinho está vazio</p>
                            <button onClick={closeCart} className="btn btn-outline">
                                Continuar Comprando
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.product.id} className="flex gap-4 p-4 bg-offwhite rounded-sm">
                                    {/* Image */}
                                    <div className="relative w-20 h-20 flex-shrink-0 bg-beige">
                                        <Image
                                            src={item.product.image || "/placeholder-product.jpg"}
                                            alt={item.product.name}
                                            fill
                                            sizes="80px"
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/produto/${item.product.slug}`}
                                            className="font-display text-dark hover:text-gold transition-colors line-clamp-1"
                                            onClick={closeCart}
                                        >
                                            {item.product.name}
                                        </Link>
                                        <p className="text-gold font-medium mt-1">
                                            {formatPrice(item.product.price)}
                                        </p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                className="w-7 h-7 flex items-center justify-center border border-beige hover:border-gold transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                disabled={item.quantity >= item.product.stock_quantity}
                                                className="w-7 h-7 flex items-center justify-center border border-beige hover:border-gold transition-colors disabled:opacity-50"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Remove & Total */}
                                    <div className="flex flex-col items-end justify-between">
                                        <button
                                            onClick={() => removeItem(item.product.id)}
                                            className="text-taupe hover:text-red-500 transition-colors"
                                            aria-label="Remover item"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                        <p className="text-sm font-medium text-dark">
                                            {formatPrice(item.product.price * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-beige p-6">
                        {/* Summary */}
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-taupe">Subtotal</span>
                                <span className="text-dark">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-taupe">Frete</span>
                                <span className={shipping === 0 ? "text-green-600" : "text-dark"}>
                                    {shipping === 0 ? "Grátis" : formatPrice(shipping)}
                                </span>
                            </div>
                            <div className="flex justify-between text-lg font-medium pt-2 border-t border-beige">
                                <span className="text-dark">Total</span>
                                <span className="text-dark">{formatPrice(total)}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                            <Link
                                href="/checkout"
                                onClick={closeCart}
                                className="btn btn-primary w-full"
                            >
                                Finalizar Compra
                            </Link>
                            <button
                                onClick={closeCart}
                                className="btn btn-ghost w-full"
                            >
                                Continuar Comprando
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
