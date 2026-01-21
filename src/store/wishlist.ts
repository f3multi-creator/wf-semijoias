"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistProduct {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number | null;
    image: string;
    category: string;
}

interface WishlistStore {
    items: WishlistProduct[];

    // Actions
    addItem: (product: WishlistProduct) => void;
    removeItem: (productId: string) => void;
    toggleItem: (product: WishlistProduct) => void;
    clearWishlist: () => void;

    // Computed
    isInWishlist: (productId: string) => boolean;
    getItemCount: () => number;
}

export const useWishlist = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product) => {
                set((state) => {
                    // Não adicionar duplicata
                    if (state.items.some((item) => item.id === product.id)) {
                        return state;
                    }
                    return {
                        items: [...state.items, product],
                    };
                });
            },

            removeItem: (productId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== productId),
                }));
            },

            toggleItem: (product) => {
                const isInList = get().isInWishlist(product.id);
                if (isInList) {
                    get().removeItem(product.id);
                } else {
                    get().addItem(product);
                }
            },

            clearWishlist: () => {
                set({ items: [] });
            },

            isInWishlist: (productId) => {
                return get().items.some((item) => item.id === productId);
            },

            getItemCount: () => {
                return get().items.length;
            },
        }),
        {
            name: "wf-wishlist", // Nome no localStorage
        }
    )
);
