import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/db";

// Revalidar a cada 60 segundos
export const revalidate = 60;

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;

    const [category, productsRaw] = await Promise.all([
        getCategoryBySlug(slug),
        getProductsByCategory(slug, 50),
    ]);

    if (!category) {
        notFound();
    }

    // Formatar produtos
    const products = productsRaw.map((product: any) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        comparePrice: product.compare_price,
        images: product.images?.map((img: any) => img.url) || ["/products/brinco-ametista-1.jpg"],
        category: product.category?.name || category.name,
        isNew: product.is_new,
        isFeatured: product.is_featured,
    }));

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
                        <li className="text-dark">{category.name}</li>
                    </ol>
                </div>
            </nav>

            {/* Header */}
            <section className="section bg-cream">
                <div className="container">
                    <div className="text-center mb-12">
                        <h1 className="font-display text-4xl md:text-5xl text-dark mb-4">
                            {category.name}
                        </h1>
                        {category.description && (
                            <p className="text-taupe max-w-2xl mx-auto">
                                {category.description}
                            </p>
                        )}
                    </div>

                    {/* Products Grid */}
                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                            {products.map((product: any) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-taupe text-lg mb-4">
                                Nenhum produto nesta categoria ainda.
                            </p>
                            <Link href="/" className="btn btn-outline">
                                Ver outros produtos
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
