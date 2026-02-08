"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/store/cart";

export function CartSync() {
    const { data: session } = useSession();
    const { items } = useCart();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Debounce logic
    useEffect(() => {
        // Check if user is logged in (session exists and has user.id)
        if (session?.user?.id && items.length > 0) {
            // Clear previous timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Set new timeout (2 seconds)
            timeoutRef.current = setTimeout(() => {
                fetch("/api/cart/sync", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        items
                    }),
                });
            }, 2000);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [items, session]);

    return null;
}
