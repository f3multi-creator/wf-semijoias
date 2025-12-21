import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { getFeaturedProducts, getCategories } from "@/lib/db";

// Revalidar a cada 60 segundos
export const revalidate = 60;

export default async function HomePage() {
  // Buscar dados do Supabase
  const [products, categories] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
  ]);

  // Transformar produtos do Supabase para o formato do ProductCard
  const formattedProducts = products.map((product: any) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    comparePrice: product.compare_price,
    images: product.images?.map((img: any) => img.url) || ["/products/brinco-ametista-1.jpg"],
    category: product.category?.name || "Semijoias",
    isNew: product.is_new,
    isFeatured: product.is_featured,
  }));

  // Formatar categorias
  const formattedCategories = categories.map((cat: any) => ({
    name: cat.name,
    slug: cat.slug,
    image: cat.image_url || `/categories/${cat.slug}.jpg`,
  }));

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark/60 to-dark/30">
          <div className="absolute inset-0 bg-beige" />
          {/* Placeholder - será substituído por imagem real */}
          <div className="absolute inset-0 bg-gradient-to-br from-nude via-beige to-sand opacity-50" />
        </div>

        {/* Content */}
        <div className="container relative z-10">
          <div className="max-w-2xl animate-fadeIn">
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
              Nova Coleção
            </p>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-dark mb-6 leading-tight">
              Beleza que{" "}
              <span className="text-gold italic">transforma</span>
            </h1>
            <p className="text-brown text-lg md:text-xl mb-8 leading-relaxed">
              Semijoias artesanais feitas à mão com pedras brasileiras premium.
              Cada peça conta uma história única.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/colecoes" className="btn btn-primary">
                Ver Coleção
              </Link>
              <Link href="/sobre" className="btn btn-outline">
                Nossa História
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-taupe animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="section bg-cream">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-dark mb-3">
              Explore por Categoria
            </h2>
            <p className="text-taupe">Encontre a peça perfeita para você</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {formattedCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/categoria/${category.slug}`}
                className="group relative aspect-[3/4] overflow-hidden bg-beige hover-lift"
              >
                {/* Category Image */}
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-dark/30 group-hover:bg-dark/50 transition-colors duration-300" />

                {/* Content */}
                <div className="absolute inset-0 flex items-end p-6">
                  <div>
                    <h3 className="font-display text-2xl text-white mb-1">
                      {category.name}
                    </h3>
                    <span className="text-white/80 text-sm uppercase tracking-wider group-hover:text-gold transition-colors">
                      Ver todos →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section bg-offwhite">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-dark mb-2">
                Mais Vendidos
              </h2>
              <p className="text-taupe">As peças favoritas das nossas clientes</p>
            </div>
            <Link href="/produtos" className="btn btn-ghost">
              Ver todos os produtos
            </Link>
          </div>

          {formattedProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {formattedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-taupe">Nenhum produto em destaque ainda.</p>
              <p className="text-sm text-taupe mt-2">Cadastre produtos no painel admin.</p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="section bg-dark text-cream">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative aspect-square bg-charcoal rounded-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brown to-charcoal" />
              {/* Placeholder para imagem */}
            </div>

            {/* Content */}
            <div>
              <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
                Nossa Essência
              </p>
              <h2 className="font-display text-3xl md:text-4xl mb-6">
                Feito à mão, com amor e dedicação
              </h2>
              <p className="text-stone leading-relaxed mb-6">
                Cada semijoia WF é criada artesanalmente por mãos talentosas,
                utilizando pedras brasileiras premium cuidadosamente selecionadas.
                Acreditamos que a verdadeira beleza está nos detalhes.
              </p>
              <p className="text-stone leading-relaxed mb-8">
                Nossas peças são pensadas para mulheres que valorizam a autenticidade,
                a qualidade e o significado por trás de cada acessório que usam.
              </p>
              <Link href="/sobre" className="btn bg-gold text-white hover:bg-gold-dark">
                Conheça Nossa História
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Placeholder */}
      <section className="section bg-cream">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-dark mb-3">
              @wfsemijoias
            </h2>
            <p className="text-taupe">Siga-nos no Instagram e inspire-se</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {[...Array(6)].map((_, i) => (
              <a
                key={i}
                href="https://instagram.com/wfsemijoias"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square bg-beige hover:opacity-80 transition-opacity overflow-hidden"
              >
                <div className="w-full h-full bg-gradient-to-br from-nude via-sand to-stone" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-beige">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="w-12 h-12 mx-auto mb-3 text-gold">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h4 className="font-display text-lg text-dark mb-1">Frete Grátis</h4>
              <p className="text-taupe text-sm">Acima de R$ 300</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-3 text-gold">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-display text-lg text-dark mb-1">Compra Segura</h4>
              <p className="text-taupe text-sm">Pagamento protegido</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-3 text-gold">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h4 className="font-display text-lg text-dark mb-1">Troca Fácil</h4>
              <p className="text-taupe text-sm">30 dias para trocar</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-3 text-gold">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h4 className="font-display text-lg text-dark mb-1">Até 12x</h4>
              <p className="text-taupe text-sm">Sem juros no cartão</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
