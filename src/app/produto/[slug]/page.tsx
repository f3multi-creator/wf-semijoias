import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductCard } from "@/components/product/ProductCard";
import { getProductBySlug, getProductsByCategory } from "@/lib/db";

// Revalidar a cada 60 segundos
export const revalidate = 60;

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;

    // Buscar produto do Supabase
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    // Buscar produtos relacionados da mesma categoria
    const relatedProductsRaw = product.category
        ? await getProductsByCategory(product.category.slug, 5)
        : [];

    // Excluir o produto atual e limitar a 4
    const relatedProducts = relatedProductsRaw
        .filter((p: any) => p.id !== product.id)
        .slice(0, 4)
        .map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            comparePrice: p.compare_price,
            images: p.images?.map((img: any) => img.url) || ["/products/brinco-ametista-1.jpg"],
            category: p.category?.name || "Semijoias",
        }));

    // Preparar imagens do produto
    const images = product.images?.length > 0
        ? product.images.sort((a: any, b: any) => a.position - b.position).map((img: any) => img.url)
        : ["/products/brinco-ametista-1.jpg"];

    const discount = product.compare_price
        ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
        : 0;

    const formatPrice = (value: number) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    return (
        <>
            {/* Breadcrumb */}
            <nav className="py-4 bg-beige/50">
                <div className="container">
                    <ol className="flex items-center gap-2 text-sm text-taupe">
                        <li>
                            <Link href="/" className="hover:text-gold transition-colors">
                                Início
                            </Link>
                        </li>
                        <li>/</li>
                        <li>
                            <Link
                                href={`/categoria/${product.category?.slug || 'produtos'}`}
                                className="hover:text-gold transition-colors"
                            >
                                {product.category?.name || 'Produtos'}
                            </Link>
                        </li>
                        <li>/</li>
                        <li className="text-dark">{product.name}</li>
                    </ol>
                </div>
            </nav>

            {/* Product Section */}
            <section className="section bg-cream">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Gallery */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="relative aspect-square bg-beige overflow-hidden">
                                <Image
                                    src={images[0]}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover"
                                    priority
                                />
                                {discount > 0 && (
                                    <span className="absolute top-4 left-4 bg-gold text-white text-sm px-3 py-1 tracking-wider">
                                        -{discount}%
                                    </span>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex gap-2">
                                    {images.map((image: string, index: number) => (
                                        <button
                                            key={index}
                                            className="relative w-20 h-20 bg-beige overflow-hidden border-2 border-transparent hover:border-gold transition-colors"
                                        >
                                            <Image
                                                src={image}
                                                alt={`${product.name} - ${index + 1}`}
                                                fill
                                                sizes="80px"
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="lg:py-8">
                            <p className="text-gold uppercase tracking-[0.2em] text-sm mb-2">
                                {product.category?.name || 'Semijoias'}
                            </p>
                            <h1 className="font-display text-3xl md:text-4xl text-dark mb-4">
                                {product.name}
                            </h1>

                            {/* Price */}
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-2xl text-dark font-medium">
                                    {formatPrice(product.price)}
                                </span>
                                {product.compare_price && (
                                    <span className="text-lg text-taupe line-through">
                                        {formatPrice(product.compare_price)}
                                    </span>
                                )}
                            </div>

                            <p className="text-taupe text-sm mb-6">
                                ou 12x de {formatPrice(product.price / 12)} sem juros
                            </p>

                            {/* Description */}
                            {product.description && (
                                <p className="text-brown leading-relaxed mb-8">
                                    {product.description}
                                </p>
                            )}

                            {/* Stock Status */}
                            <div className="flex items-center gap-2 mb-6">
                                {product.stock_quantity > 0 ? (
                                    <>
                                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                                        <span className="text-sm text-green-700">
                                            Em estoque ({product.stock_quantity} disponíveis)
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                                        <span className="text-sm text-red-700">Esgotado</span>
                                    </>
                                )}
                            </div>

                            {/* Add to Cart */}
                            <AddToCartButton
                                product={{
                                    id: product.id,
                                    name: product.name,
                                    slug: product.slug,
                                    price: product.price,
                                    image: images[0],
                                    stock_quantity: product.stock_quantity,
                                }}
                            />

                            {/* Shipping Info */}
                            <div className="mt-8 p-4 bg-offwhite border border-beige">
                                <p className="text-sm text-brown">
                                    🚚 <strong className="text-gold">Frete grátis</strong> em compras acima de R$ 300
                                </p>
                            </div>

                            {/* SKU */}
                            {product.sku && (
                                <p className="mt-4 text-xs text-taupe">
                                    SKU: {product.sku}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="section bg-offwhite">
                    <div className="container">
                        <h2 className="font-display text-2xl md:text-3xl text-dark mb-8">
                            Você também pode gostar
                        </h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p: any) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
