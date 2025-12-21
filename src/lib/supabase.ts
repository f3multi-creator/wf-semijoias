import { createClient } from '@supabase/supabase-js';

// Cliente Supabase para uso no browser (Row Level Security ativo)
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
