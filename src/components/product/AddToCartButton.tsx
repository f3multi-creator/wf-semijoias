"use client";

import { useState } from "react";
import { useCart, CartProduct } from "@/store/cart";

interface AddToCartButtonProps {
    product: CartProduct;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const { addItem } = useCart();

    const handleAddToCart = () => {
        setIsAdding(true);
        addItem(product, quantity);

        // Reset após animação
        setTimeout(() => {
            setIsAdding(false);
            setQuantity(1);
        }, 500);
    };

    const isDisabled = product.stock_quantity <= 0;

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center border border-beige">
                <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-dark hover:bg-beige transition-colors"
                    disabled={quantity <= 1}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                </button>
                <input
                    type="number"
                    min="1"
                    max={product.stock_quantity}
                    value={quantity}
                    onChange={(e) =>
                        setQuantity(
                            Math.min(Math.max(1, Number(e.target.value)), product.stock_quantity)
                        )
                    }
                    className="w-16 h-12 text-center text-dark bg-transparent border-x border-beige focus:outline-none"
                />
                <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center text-dark hover:bg-beige transition-colors"
                    disabled={quantity >= product.stock_quantity}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

            {/* Add to Cart Button */}
            <button
                onClick={handleAddToCart}
                disabled={isDisabled || isAdding}
                className={`flex-1 btn ${isDisabled
                        ? "bg-taupe text-white cursor-not-allowed"
                        : isAdding
                            ? "bg-green-600 text-white"
                            : "btn-primary"
                    }`}
            >
                {isDisabled
                    ? "Esgotado"
                    : isAdding
                        ? "✓ Adicionado!"
                        : "Adicionar ao Carrinho"}
            </button>
        </div>
    );
}
