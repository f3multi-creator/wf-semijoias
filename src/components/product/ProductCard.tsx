import Image from "next/image";
import Link from "next/link";

export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    images: string[];
    category: string;
    isNew?: boolean;
    isFeatured?: boolean;
}

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const discount = product.comparePrice
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0;

    const formatPrice = (value: number) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    return (
        <article className="group relative">
            <Link href={`/produto/${product.slug}`} className="block">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-beige mb-4">
                    {/* Main Image */}
                    <Image
                        src={product.images[0] || "/placeholder-product.jpg"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Hover Image (if exists) */}
                    {product.images[1] && (
                        <Image
                            src={product.images[1]}
                            alt={`${product.name} - alternativa`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        />
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.isNew && (
                            <span className="bg-dark text-cream text-xs px-3 py-1 tracking-wider uppercase">
                                Novo
                            </span>
                        )}
                        {discount > 0 && (
                            <span className="bg-gold text-white text-xs px-3 py-1 tracking-wider">
                                -{discount}%
                            </span>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button className="w-full btn bg-dark/90 text-cream hover:bg-dark text-sm">
                            Adicionar ao carrinho
                        </button>
                    </div>

                    {/* Wishlist Button */}
                    <button
                        className="absolute top-3 right-3 w-9 h-9 bg-cream/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cream"
                        aria-label="Adicionar aos favoritos"
                    >
                        <svg
                            className="w-4 h-4 text-dark hover:text-gold transition-colors"
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
                    </button>
                </div>

                {/* Product Info */}
                <div className="text-center">
                    <p className="text-taupe text-xs uppercase tracking-wider mb-1">
                        {product.category}
                    </p>
                    <h3 className="font-display text-lg text-dark mb-2 group-hover:text-gold transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-dark font-medium">
                            {formatPrice(product.price)}
                        </span>
                        {product.comparePrice && (
                            <span className="text-taupe text-sm line-through">
                                {formatPrice(product.comparePrice)}
                            </span>
                        )}
                    </div>
                    <p className="text-taupe text-xs mt-1">
                        ou 12x de {formatPrice(product.price / 12)}
                    </p>
                </div>
            </Link>
        </article>
    );
}
