import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductCard } from "@/components/product/ProductCard";

// Dados de exemplo (virão do Supabase)
const products = [
    {
        id: "1",
        name: "Brinco Gota Ametista",
        slug: "brinco-gota-ametista",
        price: 289.90,
        comparePrice: 349.90,
        description: "Brincos delicados com pedras de ametista brasileira em formato de gota. Acabamento em banho de ouro 18k. Perfeitos para ocasiões especiais ou para elevar seu look do dia a dia.",
        images: ["/products/brinco-ametista-1.jpg", "/products/brinco-ametista-2.jpg"],
        category: "Brincos",
        stock_quantity: 15,
        details: [
            { label: "Material", value: "Banho de ouro 18k" },
            { label: "Pedra", value: "Ametista brasileira" },
            { label: "Tamanho", value: "3cm de comprimento" },
            { label: "Fecho", value: "Tarraxa borboleta" },
        ],
        care: "Evite contato com produtos químicos, perfumes e água. Guarde separadamente de outras joias para evitar riscos.",
    },
    {
        id: "2",
        name: "Colar Ponto de Luz",
        slug: "colar-ponto-de-luz",
        price: 199.90,
        description: "Colar delicado com pingente ponto de luz em cristal. Corrente fina em banho de ouro 18k. Ideal para usar sozinho ou em composições com outros colares.",
        images: ["/products/colar-ponto-luz-1.jpg"],
        category: "Colares",
        stock_quantity: 20,
        details: [
            { label: "Material", value: "Banho de ouro 18k" },
            { label: "Pedra", value: "Cristal" },
            { label: "Comprimento", value: "45cm (ajustável)" },
            { label: "Fecho", value: "Fecho lagosta" },
        ],
        care: "Evite contato com produtos químicos, perfumes e água. Guarde separadamente de outras joias para evitar riscos.",
    },
    {
        id: "3",
        name: "Anel Quartzo Rosa",
        slug: "anel-quartzo-rosa",
        price: 179.90,
        description: "Anel delicado com pedra de quartzo rosa natural. Aro ajustável em banho de ouro 18k. A pedra do amor e da compaixão.",
        images: ["/products/anel-quartzo-1.jpg"],
        category: "Anéis",
        stock_quantity: 12,
        details: [
            { label: "Material", value: "Banho de ouro 18k" },
            { label: "Pedra", value: "Quartzo rosa natural" },
            { label: "Aro", value: "Ajustável" },
        ],
        care: "Evite contato com produtos químicos, perfumes e água. Guarde separadamente de outras joias para evitar riscos.",
    },
    {
        id: "4",
        name: "Pulseira Turmalina",
        slug: "pulseira-turmalina",
        price: 259.90,
        comparePrice: 299.90,
        description: "Pulseira com pedras de turmalina multicolorida brasileira. Acabamento em banho de ouro 18k. Peça única que combina energia e elegância.",
        images: ["/products/pulseira-turmalina-1.jpg"],
        category: "Pulseiras",
        stock_quantity: 8,
        details: [
            { label: "Material", value: "Banho de ouro 18k" },
            { label: "Pedra", value: "Turmalina multicolorida" },
            { label: "Comprimento", value: "18cm (ajustável)" },
            { label: "Fecho", value: "Fecho lagosta" },
        ],
        care: "Evite contato com produtos químicos, perfumes e água. Guarde separadamente de outras joias para evitar riscos.",
    },
];

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = products.find((p) => p.slug === slug);

    if (!product) {
        notFound();
    }

    const relatedProducts = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

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
                                href={`/categoria/${product.category.toLowerCase()}`}
                                className="hover:text-gold transition-colors"
                            >
                                {product.category}
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
                                    src={product.images[0]}
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
                            {product.images.length > 1 && (
                                <div className="flex gap-2">
                                    {product.images.map((image, index) => (
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
                                {product.category}
                            </p>
                            <h1 className="font-display text-3xl md:text-4xl text-dark mb-4">
                                {product.name}
                            </h1>

                            {/* Price */}
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-2xl text-dark font-medium">
                                    {formatPrice(product.price)}
                                </span>
                                {product.comparePrice && (
                                    <span className="text-lg text-taupe line-through">
                                        {formatPrice(product.comparePrice)}
                                    </span>
                                )}
                            </div>

                            <p className="text-taupe text-sm mb-6">
                                ou 12x de {formatPrice(product.price / 12)} sem juros
                            </p>

                            {/* Description */}
                            <p className="text-brown leading-relaxed mb-8">
                                {product.description}
                            </p>

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
                                    image: product.images[0],
                                    stock_quantity: product.stock_quantity,
                                }}
                            />

                            {/* Shipping Info */}
                            <div className="mt-8 p-4 bg-offwhite border border-beige">
                                <p className="text-sm text-brown">
                                    🚚 <strong className="text-gold">Frete grátis</strong> em compras acima de R$ 300
                                </p>
                            </div>

                            {/* Details */}
                            <div className="mt-8 pt-8 border-t border-beige">
                                <h3 className="font-display text-xl text-dark mb-4">
                                    Detalhes do Produto
                                </h3>
                                <dl className="space-y-2">
                                    {product.details.map((detail, index) => (
                                        <div key={index} className="flex">
                                            <dt className="w-32 text-taupe text-sm">{detail.label}</dt>
                                            <dd className="text-dark text-sm">{detail.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>

                            {/* Care */}
                            <div className="mt-8 pt-8 border-t border-beige">
                                <h3 className="font-display text-xl text-dark mb-4">
                                    Cuidados
                                </h3>
                                <p className="text-brown text-sm leading-relaxed">
                                    {product.care}
                                </p>
                            </div>
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
                            {relatedProducts.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    product={{
                                        id: p.id,
                                        name: p.name,
                                        slug: p.slug,
                                        price: p.price,
                                        comparePrice: p.comparePrice,
                                        images: p.images,
                                        category: p.category,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}

// Generate static params for demo products
export function generateStaticParams() {
    return products.map((product) => ({
        slug: product.slug,
    }));
}
