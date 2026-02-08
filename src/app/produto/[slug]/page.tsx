import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { getProductBySlug, getProductsByCategory } from "@/lib/db";
import { CustomOrderCTA } from "@/components/product/CustomOrderCTA";
import { CustomizationBanner } from "@/components/product/CustomizationBanner";

const WHATSAPP_NUMBER = "5527999201077";

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

    // Preparar imagens do produto para a galeria
    const galleryImages = product.images?.length > 0
        ? product.images
            .sort((a: any, b: any) => a.position - b.position)
            .map((img: any) => ({
                url: img.url,
                alt: img.alt_text || product.name,
                is_hero: img.is_hero || img.position === 0, // Primeira imagem ou marcada como hero
            }))
        : [{ url: "/products/brinco-ametista-1.jpg", alt: product.name, is_hero: true }];

    // Imagem principal para o carrinho (primeira ou hero)
    const mainImage = galleryImages.find((img: any) => img.is_hero)?.url || galleryImages[0]?.url;

    const discount = product.compare_price
        ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
        : 0;

    const formatPrice = (value: number) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    // URLs do WhatsApp
    const whatsappOrderUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Olá! Vim pelo site da WF Semijoias e gostaria de encomendar o produto "${product.name}". Podem me ajudar?`
    )}`;

    const whatsappQuestionUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Olá! Vim pelo site da WF Semijoias e tenho uma dúvida sobre o produto "${product.name}".`
    )}`;

    const isOutOfStock = product.stock_quantity <= 0;

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
                    <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-16 items-start">
                        {/* Gallery - Agora usando componente interativo */}
                        <div className="lg:sticky lg:top-8">
                            <ProductGallery
                                images={galleryImages}
                                productName={product.name}
                                discount={discount}
                            />
                        </div>

                        {/* Product Info */}
                        <div className="lg:py-4">
                            {/* Category */}
                            <p className="text-gold uppercase tracking-[0.2em] text-sm mb-3">
                                {product.category?.name || 'Semijoias'}
                            </p>

                            {/* Title */}
                            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-dark mb-6 leading-tight">
                                {product.name}
                            </h1>

                            {/* Price Section */}
                            <div className="mb-8 pb-6 border-b border-beige">
                                <div className="flex items-baseline gap-4 mb-2">
                                    <span className="text-3xl text-dark font-semibold">
                                        {formatPrice(product.price)}
                                    </span>
                                    {product.compare_price && (
                                        <span className="text-lg text-taupe line-through">
                                            {formatPrice(product.compare_price)}
                                        </span>
                                    )}
                                </div>
                                <p className="text-taupe text-sm">
                                    ou <strong>12x</strong> de {formatPrice(product.price / 12)} sem juros
                                </p>
                            </div>

                            {/* Description */}
                            {product.description && (
                                <div className="mb-8">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-brown mb-3">
                                        Descrição
                                    </h3>
                                    <p className="text-brown leading-relaxed text-base whitespace-pre-line">
                                        {product.description}
                                    </p>
                                </div>
                            )}

                            {/* Stock Status */}
                            <div className="flex items-center gap-2 mb-6">
                                {!isOutOfStock ? (
                                    <>
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-sm text-green-700 font-medium">
                                            Em estoque
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="w-2 h-2 bg-amber-500 rounded-full" />
                                        <span className="text-sm text-amber-700 font-medium">
                                            Disponível sob encomenda
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Sob Encomenda - Quando produto está sem estoque */}
                            {isOutOfStock ? (
                                <div className="mb-6">
                                    {/* Aviso de sob encomenda */}
                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div>
                                                <p className="text-amber-800 font-medium text-sm">
                                                    Este produto está disponível sob encomenda
                                                </p>
                                                <p className="text-amber-700 text-sm mt-1">
                                                    Como nossas peças são artesanais, podemos produzir uma exclusivamente para você!
                                                    Entre em contato pelo WhatsApp para saber prazo e condições.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botão de encomendar via WhatsApp */}
                                    <a
                                        href={whatsappOrderUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-4 px-6 bg-green-500 hover:bg-green-600 text-white font-medium text-lg transition-all duration-300 rounded"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        Encomendar via WhatsApp
                                    </a>
                                </div>
                            ) : (
                                <>
                                    {/* Add to Cart - Quando tem estoque */}
                                    <AddToCartButton
                                        product={{
                                            id: product.id,
                                            name: product.name,
                                            slug: product.slug,
                                            price: product.price,
                                            image: mainImage,
                                            stock_quantity: product.stock_quantity,
                                        }}
                                    />

                                    {/* Link para dúvidas via WhatsApp */}
                                    <div className="mt-4 text-center">
                                        <a
                                            href={whatsappQuestionUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                            Tem dúvidas? Fale conosco pelo WhatsApp
                                        </a>
                                    </div>
                                </>
                            )}

                            {/* Shipping Info */}
                            <div className="mt-8 p-4 bg-offwhite border border-beige">
                                <p className="text-sm text-brown">
                                    🚚 <strong className="text-gold">Frete grátis</strong> em compras acima de R$ 300
                                </p>
                            </div>

                            {/* Informação sobre peças artesanais */}
                            <div className="mt-4 p-4 bg-gold/5 border border-gold/20 rounded">
                                <div className="flex items-start gap-3">
                                    <span className="text-xl">✨</span>
                                    <div>
                                        <p className="text-brown text-sm font-medium">Peça Artesanal</p>
                                        <p className="text-brown/80 text-sm mt-1">
                                            Cada peça é única e feita à mão com muito carinho.
                                            Podemos criar peças personalizadas especialmente para você!
                                        </p>
                                    </div>
                                </div>
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

            {/* Banner de Personalização */}
            <CustomizationBanner />

            {/* Seção de Exclusividade */}
            <CustomOrderCTA productName={product.name} />

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
