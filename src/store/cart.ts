"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Tipo simplificado para o carrinho (sem dependências do Supabase)
export interface CartProduct {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
    stock_quantity: number;
}

export interface CartItem {
    product: CartProduct;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    isOpen: boolean;

    // Actions
    addItem: (product: CartProduct, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;

    // Computed
    getSubtotal: () => number;
    getItemCount: () => number;
    getShipping: (subtotal: number) => number;
    getTotal: () => number;
}

const FREE_SHIPPING_THRESHOLD = 300; // Frete grátis acima de R$ 300
const DEFAULT_SHIPPING = 25; // Valor padrão do frete (será substituído pelo Melhor Envio)

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (product, quantity = 1) => {
                set((state) => {
                    const existingItem = state.items.find(
                        (item) => item.product.id === product.id
                    );

                    if (existingItem) {
                        // Atualiza quantidade se já existe
                        const newQuantity = Math.min(
                            existingItem.quantity + quantity,
                            product.stock_quantity
                        );
                        return {
                            items: state.items.map((item) =>
                                item.product.id === product.id
                                    ? { ...item, quantity: newQuantity }
                                    : item
                            ),
                            isOpen: true, // Abre o carrinho ao adicionar
                        };
                    }

                    // Adiciona novo item
                    return {
                        items: [...state.items, { product, quantity }],
                        isOpen: true,
                    };
                });
            },

            removeItem: (productId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.product.id !== productId),
                }));
            },

            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }

                set((state) => ({
                    items: state.items.map((item) =>
                        item.product.id === productId
                            ? {
                                ...item,
                                quantity: Math.min(quantity, item.product.stock_quantity),
                            }
                            : item
                    ),
                }));
            },

            clearCart: () => {
                set({ items: [] });
            },

            toggleCart: () => {
                set((state) => ({ isOpen: !state.isOpen }));
            },

            openCart: () => {
                set({ isOpen: true });
            },

            closeCart: () => {
                set({ isOpen: false });
            },

            getSubtotal: () => {
                return get().items.reduce(
                    (total, item) => total + item.product.price * item.quantity,
                    0
                );
            },

            getItemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            },

            getShipping: (subtotal) => {
                if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
                return DEFAULT_SHIPPING;
            },

            getTotal: () => {
                const subtotal = get().getSubtotal();
                const shipping = get().getShipping(subtotal);
                return subtotal + shipping;
            },
        }),
        {
            name: "wf-cart", // Nome no localStorage
            partialize: (state) => ({ items: state.items }), // Só persiste os items
        }
    )
);

// Hook para formatação de preço
export function formatPrice(value: number): string {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}
