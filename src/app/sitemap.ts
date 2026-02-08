import { MetadataRoute } from 'next';
import { getCategories, getLines, getCollections, getProducts } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidar a cada hora

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wfsemijoias.com.br';

    // Páginas estáticas
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/sobre`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contato`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];

    // Buscar dados dinâmicos
    const [categories, lines, collections, products] = await Promise.all([
        getCategories(),
        getLines(),
        getCollections(),
        getProducts(),
    ]);

    // Páginas de categorias
    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
        url: `${baseUrl}/categoria/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Páginas de linhas/materiais
    const linePages: MetadataRoute.Sitemap = lines.map((line) => ({
        url: `${baseUrl}/linha/${line.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Páginas de coleções
    const collectionPages: MetadataRoute.Sitemap = collections.map((collection) => ({
        url: `${baseUrl}/colecao/${collection.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Páginas de produtos
    const productPages: MetadataRoute.Sitemap = products.map((product: any) => ({
        url: `${baseUrl}/produto/${product.slug}`,
        lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    return [
        ...staticPages,
        ...categoryPages,
        ...linePages,
        ...collectionPages,
        ...productPages,
    ];
}
