import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { getProductBySlug, getProductsByCategory } from "@/lib/db";
import { CustomOrderCTA } from "@/components/product/CustomOrderCTA";
import { ProductCustomizationCard } from "@/components/product/ProductCustomizationCard";
import { MessageCircle, Truck, ArrowRightLeft, AlertTriangle } from "lucide-react";

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

                            {/* Stock Status */}
                            <div className="flex items-center gap-2 mb-6">
                                {!isOutOfStock ? (
                                    <>
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-sm text-green-700 font-medium tracking-wide font-display">
                                            Em estoque
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-2 h-2 bg-amber-500 rounded-full" />
                                        <span className="text-sm text-amber-700 font-medium tracking-wide">
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
                                            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-amber-800 font-medium text-sm font-display">
                                                    Este produto está disponível sob encomenda
                                                </p>
                                                <p className="text-amber-700 text-sm mt-1 leading-relaxed">
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
                                        className="btn btn-primary w-full flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle className="w-5 h-5" />
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
                                            className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 transition-colors bg-green-50 px-4 py-2 rounded-full border border-green-100"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            Tem dúvidas? Fale conosco pelo WhatsApp
                                        </a>
                                    </div>
                                </>
                            )}

                            {/* Shipping Info */}
                            <div className="mt-8 pt-6 border-t border-beige">
                                <div className="flex items-center gap-3 text-taupe mb-4">
                                    <Truck className="w-5 h-5 text-gold shrink-0" />
                                    <p className="text-sm">
                                        <strong className="text-dark font-display block mb-1">Frete Grátis</strong>
                                        Em compras acima de R$ 300 para todo o Brasil.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 text-taupe">
                                    <ArrowRightLeft className="w-5 h-5 text-gold shrink-0" />
                                    <p className="text-sm">
                                        <strong className="text-dark font-display block mb-1">Troca Fácil</strong>
                                        Garantia de satisfação ou seu dinheiro de volta.
                                    </p>
                                </div>
                            </div>

                            {/* SKU */}
                            {product.sku && (
                                <p className="mt-6 text-xs text-taupe/60 uppercase tracking-widest font-mono">
                                    SKU: {product.sku}
                                </p>
                            )}

                            {/* Customization Card no lugar de Peça Artesanal */}
                            <div className="mt-8 border-t border-beige pt-6">
                                <ProductCustomizationCard productName={product.name} />
                            </div>
                        </div>
                    </div>

                    {/* Description Section - Nova posição fora do grid principal */}
                    {product.description && (
                        <div className="mt-16 pt-12 border-t border-beige">
                            <div className="max-w-3xl mx-auto text-center mb-8">
                                <h2 className="font-display text-3xl text-dark mb-4">Detalhes da Peça</h2>
                                <div className="w-16 h-px bg-gold mx-auto opacity-50"></div>
                            </div>
                            <div className="max-w-2xl mx-auto">
                                <div className="prose prose-brown prose-lg mx-auto text-center leading-loose text-taupe whitespace-pre-line font-light">
                                    {product.description}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>



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
