import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCollectionBySlug, getProductsByCollection, getCollections } from "@/lib/db";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";

interface PageProps {
    params: Promise<{ slug: string }>;
}

// Gerar metadata dinâmica
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const collection = await getCollectionBySlug(resolvedParams.slug);

    if (!collection) {
        return { title: "Coleção não encontrada" };
    }

    return {
        title: `${collection.name} | WF Semijoias`,
        description: collection.short_description || collection.description || `Confira nossa coleção ${collection.name}.`,
    };
}

// Gerar páginas estáticas
export async function generateStaticParams() {
    const collections = await getCollections();
    return collections.map((col) => ({ slug: col.slug }));
}

export default async function ColecaoPage({ params }: PageProps) {
    const resolvedParams = await params;
    const collection = await getCollectionBySlug(resolvedParams.slug);

    if (!collection) {
        notFound();
    }

    const products = await getProductsByCollection(resolvedParams.slug);

    return (
        <div className="min-h-screen bg-offwhite">
            {/* Breadcrumb */}
            <div className="container py-4">
                <nav className="text-sm text-taupe">
                    <Link href="/" className="hover:text-gold">
                        Início
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-dark">{collection.name}</span>
                </nav>
            </div>

            {/* Hero da Coleção */}
            <section
                className="relative bg-cream border-b border-beige"
                style={{
                    backgroundImage: collection.hero_image ? `url(${collection.hero_image})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className={`container py-16 ${collection.hero_image ? 'bg-dark/60' : ''}`}>
                    <div className="max-w-2xl">
                        <h1 className={`text-3xl md:text-4xl font-display mb-4 ${collection.hero_image ? 'text-white' : 'text-dark'}`}>
                            {collection.name}
                        </h1>
                        {collection.short_description && (
                            <p className={`text-lg ${collection.hero_image ? 'text-cream' : 'text-gold'} font-medium`}>
                                {collection.short_description}
                            </p>
                        )}
                        {collection.description && (
                            <p className={`mt-4 ${collection.hero_image ? 'text-gray-200' : 'text-taupe'}`}>
                                {collection.description}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Grid de Produtos */}
            <section className="container py-12">
                {products.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-taupe text-lg">
                            Nenhum produto encontrado nesta coleção.
                        </p>
                        <Link href="/" className="text-gold hover:underline mt-4 inline-block">
                            Voltar para o início
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className="text-taupe mb-6">
                            {products.length} {products.length === 1 ? "produto" : "produtos"} nesta coleção
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map((product: any) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
