import Link from "next/link";
import { Metadata } from "next";
import { ProductCard } from "@/components/product/ProductCard";
import { getNewProducts } from "@/lib/db";

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wfsemijoias.com.br';

export const metadata: Metadata = {
    title: "Novidades | WF Semijoias",
    description: "Confira as últimas novidades em semijoias artesanais da WF Semijoias. Peças adicionadas nos últimos 30 dias.",
    openGraph: {
        title: "Novidades | WF Semijoias",
        description: "Confira as últimas novidades em semijoias artesanais.",
        url: `${SITE_URL}/novidades`,
        siteName: "WF Semijoias",
        type: "website",
        locale: "pt_BR",
    },
    alternates: {
        canonical: `${SITE_URL}/novidades`,
    },
};

export default async function NovidadesPage() {
    const productsRaw = await getNewProducts(50);

    const products = productsRaw.map((product: any) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        comparePrice: product.compare_price,
        images: product.images?.map((img: any) => img.url) || ["/products/brinco-ametista-1.jpg"],
        category: product.category?.name || "Semijoias",
        isNew: true,
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
                        <li className="text-dark">Novidades</li>
                    </ol>
                </div>
            </nav>

            {/* Header */}
            <section className="section bg-cream">
                <div className="container">
                    <div className="text-center mb-12">
                        <h1 className="font-display text-4xl md:text-5xl text-dark mb-4">
                            Novidades
                        </h1>
                        <p className="text-taupe max-w-2xl mx-auto">
                            Confira as peças adicionadas nos últimos 30 dias.
                            Semijoias artesanais feitas à mão com pedras brasileiras premium.
                        </p>
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
                                Nenhuma novidade no momento.
                            </p>
                            <p className="text-taupe text-sm mb-6">
                                Volte em breve para conferir novas peças!
                            </p>
                            <Link href="/" className="btn btn-outline">
                                Ver todos os produtos
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
