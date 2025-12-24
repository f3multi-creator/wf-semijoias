import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy-load Supabase client para evitar erro no build
let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return null;
    }
    if (!supabaseInstance) {
        supabaseInstance = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
    }
    return supabaseInstance;
}

// Mock do Supabase para quando as variáveis não estão configuradas
const createMockChain = (): any => {
    const chain: any = {
        from: () => chain,
        select: () => chain,
        insert: () => chain,
        update: () => chain,
        delete: () => chain,
        upsert: () => chain,
        eq: () => chain,
        neq: () => chain,
        gt: () => chain,
        gte: () => chain,
        lt: () => chain,
        lte: () => chain,
        like: () => chain,
        ilike: () => chain,
        is: () => chain,
        in: () => chain,
        contains: () => chain,
        containedBy: () => chain,
        range: () => chain,
        order: () => chain,
        limit: () => chain,
        offset: () => chain,
        match: () => chain,
        not: () => chain,
        or: () => chain,
        filter: () => chain,
        single: () => Promise.resolve({ data: null, error: { code: 'NOT_CONFIGURED' } }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
        then: (resolve: any) => resolve({ data: [], error: null }),
        count: () => Promise.resolve({ count: 0, error: null }),
    };
    return chain;
};

// Export como getter para compatibilidade
export const supabase = new Proxy({} as SupabaseClient, {
    get(_, prop) {
        const client = getSupabaseClient();
        if (!client) {
            // Retorna mock quando não configurado
            if (prop === 'from') return () => createMockChain();
            if (prop === 'storage') return { from: () => createMockChain() };
            return () => createMockChain();
        }
        return (client as any)[prop];
    }
});

// Helper para URL de imagens do Supabase Storage
export function getImageUrl(path: string): string {
    if (!path) return '/placeholder-product.jpg';

    // Se já é uma URL completa, retorna como está
    if (path.startsWith('http')) return path;

    // Se é um path relativo (/products/...), mantém como está (imagem local)
    if (path.startsWith('/')) return path;

    // Constrói a URL do Supabase Storage
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${path}`;
}

// Helper para fazer upload de imagem
export async function uploadProductImage(
    file: File,
    productId: string
): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
        .from('products')
        .upload(fileName, file, {
            cacheControl: '31536000', // 1 ano de cache
            upsert: false,
        });

    if (error) {
        console.error('Erro no upload:', error);
        return null;
    }

    return fileName;
}

// Helper para deletar imagem
export async function deleteProductImage(path: string): Promise<boolean> {
    const { error } = await supabase.storage
        .from('products')
        .remove([path]);

    if (error) {
        console.error('Erro ao deletar:', error);
        return false;
    }

    return true;
}
