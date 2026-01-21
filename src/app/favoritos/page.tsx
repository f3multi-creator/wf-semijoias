"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/store/wishlist";
import { useCart, formatPrice } from "@/store/cart";

export default function FavoritosPage() {
    const { items, removeItem, clearWishlist, getItemCount } = useWishlist();
    const { addItem: addToCart } = useCart();

    const handleAddToCart = (item: typeof items[0]) => {
        addToCart({
            id: item.id,
            name: item.name,
            slug: item.slug,
            price: item.price,
            image: item.image,
            stock_quantity: 99, // Será verificado no checkout
        });
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-offwhite">
                <div className="container py-16">
                    <h1 className="font-display text-3xl text-dark mb-8 text-center">
                        Meus Favoritos
                    </h1>
                    <div className="text-center py-12 bg-cream border border-beige">
                        <svg
                            className="w-16 h-16 mx-auto text-taupe mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                        <p className="text-dark text-lg mb-2">
                            Sua lista de favoritos está vazia
                        </p>
                        <p className="text-taupe mb-6">
                            Explore nossos produtos e adicione seus favoritos aqui
                        </p>
                        <Link href="/" className="btn btn-primary">
                            Ver Produtos
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-offwhite">
            <div className="container py-16">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="font-display text-3xl text-dark">
                        Meus Favoritos
                        <span className="text-taupe text-lg ml-2">
                            ({getItemCount()} {getItemCount() === 1 ? 'item' : 'itens'})
                        </span>
                    </h1>
                    <button
                        onClick={clearWishlist}
                        className="text-taupe hover:text-red-600 text-sm underline"
                    >
                        Limpar lista
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white border border-beige group relative"
                        >
                            {/* Botão remover */}
                            <button
                                onClick={() => removeItem(item.id)}
                                className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                                aria-label="Remover dos favoritos"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                </svg>
                            </button>

                            <Link href={`/produto/${item.slug}`}>
                                <div className="relative aspect-square bg-cream">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </Link>

                            <div className="p-4">
                                <p className="text-xs text-gold uppercase tracking-wider mb-1">
                                    {item.category}
                                </p>
                                <Link href={`/produto/${item.slug}`}>
                                    <h3 className="font-medium text-dark mb-2 line-clamp-2 hover:text-gold transition-colors">
                                        {item.name}
                                    </h3>
                                </Link>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-dark font-semibold">
                                        {formatPrice(item.price)}
                                    </span>
                                    {item.comparePrice && item.comparePrice > item.price && (
                                        <span className="text-taupe text-sm line-through">
                                            {formatPrice(item.comparePrice)}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleAddToCart(item)}
                                    className="w-full btn btn-primary text-sm py-2"
                                >
                                    Adicionar ao Carrinho
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
