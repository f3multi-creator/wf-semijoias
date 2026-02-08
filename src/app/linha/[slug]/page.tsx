import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getLineBySlug, getProductsByLine, getLines } from "@/lib/db";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";

interface PageProps {
    params: Promise<{ slug: string }>;
}

// Gerar metadata dinâmica
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const line = await getLineBySlug(resolvedParams.slug);

    if (!line) {
        return { title: "Linha não encontrada" };
    }

    return {
        title: `Linha ${line.name} | WF Semijoias`,
        description: line.description || `Explore nossa linha de ${line.name.toLowerCase()} em semijoias.`,
    };
}

// Gerar páginas estáticas
export async function generateStaticParams() {
    const lines = await getLines();
    return lines.map((line) => ({ slug: line.slug }));
}

export default async function LinhaPage({ params }: PageProps) {
    const resolvedParams = await params;
    const line = await getLineBySlug(resolvedParams.slug);

    if (!line) {
        notFound();
    }

    const products = await getProductsByLine(resolvedParams.slug);

    return (
        <div className="min-h-screen bg-offwhite">
            {/* Breadcrumb */}
            <div className="container py-4">
                <nav className="text-sm text-taupe">
                    <Link href="/" className="hover:text-gold">
                        Início
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-dark">{line.name}</span>
                </nav>
            </div>

            {/* Hero da Linha */}
            <section className="bg-cream border-b border-beige">
                <div className="container py-12">
                    <h1 className="text-3xl md:text-4xl font-display text-dark mb-4">
                        Linha {line.name}
                    </h1>
                    {line.description && (
                        <p className="text-taupe max-w-2xl">{line.description}</p>
                    )}
                </div>
            </section>

            {/* Grid de Produtos */}
            <section className="container py-12">
                {products.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-taupe text-lg">
                            Nenhum produto encontrado nesta linha.
                        </p>
                        <Link href="/" className="text-gold hover:underline mt-4 inline-block">
                            Voltar para o início
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className="text-taupe mb-6">
                            {products.length} {products.length === 1 ? "produto" : "produtos"}
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
