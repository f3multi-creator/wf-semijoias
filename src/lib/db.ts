import { supabase } from './supabase';
import type { Product, Category, Collection, Line } from '@/types/database';

// ============================================
// PRODUTOS
// ============================================

export async function getProducts(options?: {
    featured?: boolean;
    category?: string;
    collection?: string;
    limit?: number;
}) {
    let query = supabase
        .from('products')
        .select(`
      *,
      category:categories(*),
      images:product_images(*)
    `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (options?.featured) {
        query = query.eq('is_featured', true);
    }

    if (options?.category) {
        query = query.eq('categories.slug', options.category);
    }

    if (options?.limit) {
        query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Erro ao buscar produtos:', error);
        return [];
    }

    return data || [];
}

export async function getProductBySlug(slug: string) {
    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      category:categories(*),
      collection:collections(*),
      images:product_images(*)
    `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error) {
        console.error('Erro ao buscar produto:', error);
        return null;
    }

    return data;
}

export async function getFeaturedProducts(limit = 8) {
    return getProducts({ featured: true, limit });
}

export async function getNewProducts(limit = 8) {
    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      category:categories(*),
      images:product_images(*)
    `)
        .eq('is_active', true)
        .eq('is_new', true)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Erro ao buscar novidades:', error);
        return [];
    }

    return data || [];
}

export async function getProductsByCategory(categorySlug: string, limit = 20) {
    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      category:categories!inner(*),
      images:product_images(*)
    `)
        .eq('is_active', true)
        .eq('categories.slug', categorySlug)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Erro ao buscar produtos por categoria:', error);
        return [];
    }

    return data || [];
}

// ============================================
// CATEGORIAS
// ============================================

export async function getCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('position', { ascending: true });

    if (error) {
        console.error('Erro ao buscar categorias:', error);
        return [];
    }

    return data || [];
}

export async function getCategoryBySlug(slug: string) {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Erro ao buscar categoria:', error);
        return null;
    }

    return data;
}

// ============================================
// COLEÇÕES
// ============================================

export async function getCollections() {
    const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });

    if (error) {
        console.error('Erro ao buscar coleções:', error);
        return [];
    }

    return data || [];
}

export async function getCollectionBySlug(slug: string) {
    const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error) {
        console.error('Erro ao buscar coleção:', error);
        return null;
    }

    return data;
}

export async function getProductsByCollection(collectionSlug: string, limit = 50) {
    // Primeiro buscar a coleção pelo slug
    const collection = await getCollectionBySlug(collectionSlug);
    if (!collection) return [];

    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      category:categories(*),
      images:product_images(*)
    `)
        .eq('is_active', true)
        .eq('collection_id', collection.id)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Erro ao buscar produtos por coleção:', error);
        return [];
    }

    return data || [];
}

// ============================================
// LINHAS (MATERIAIS)
// ============================================

export async function getLines() {
    const { data, error } = await supabase
        .from('lines')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });

    if (error) {
        console.error('Erro ao buscar linhas:', error);
        return [];
    }

    return data || [];
}

export async function getLineBySlug(slug: string) {
    const { data, error } = await supabase
        .from('lines')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error) {
        console.error('Erro ao buscar linha:', error);
        return null;
    }

    return data;
}

export async function getProductsByLine(lineSlug: string, limit = 50) {
    // Primeiro buscar a linha pelo slug
    const line = await getLineBySlug(lineSlug);
    if (!line) return [];

    // Buscar produtos que têm essa linha via tabela de junção
    const { data: productLines, error: junctionError } = await supabase
        .from('product_lines')
        .select('product_id')
        .eq('line_id', line.id);

    if (junctionError || !productLines || productLines.length === 0) {
        return [];
    }

    const productIds = productLines.map(pl => pl.product_id);

    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      category:categories(*),
      images:product_images(*)
    `)
        .eq('is_active', true)
        .in('id', productIds)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Erro ao buscar produtos por linha:', error);
        return [];
    }

    return data || [];
}

// ============================================
// PEDIDOS
// ============================================

export async function createOrder(orderData: {
    customer_email: string;
    customer_name: string;
    customer_phone?: string;
    subtotal: number;
    shipping_cost: number;
    discount: number;
    total: number;
    shipping_address: object;
    shipping_method?: string;
    coupon_code?: string;
    external_reference: string;
    items: Array<{
        product_id: string;
        product_name: string;
        product_image: string;
        quantity: number;
        unit_price: number;
        total: number;
    }>;
}) {
    // Criar pedido
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            customer_email: orderData.customer_email,
            customer_name: orderData.customer_name,
            customer_phone: orderData.customer_phone,
            subtotal: orderData.subtotal,
            shipping_cost: orderData.shipping_cost,
            discount: orderData.discount,
            total: orderData.total,
            shipping_address: orderData.shipping_address,
            shipping_method: orderData.shipping_method,
            coupon_code: orderData.coupon_code,
            external_reference: orderData.external_reference,
            status: 'pending',
            payment_status: 'pending',
        })
        .select()
        .single();

    if (orderError) {
        console.error('Erro ao criar pedido:', orderError);
        return null;
    }

    // Inserir itens do pedido
    const itemsToInsert = orderData.items.map(item => ({
        order_id: order.id,
        ...item,
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

    if (itemsError) {
        console.error('Erro ao criar itens do pedido:', itemsError);
    }

    return order;
}

export async function updateOrderPayment(
    externalReference: string,
    paymentData: {
        payment_id: string;
        payment_status: string;
        payment_method?: string;
    }
) {
    const { data, error } = await supabase
        .from('orders')
        .update({
            payment_id: paymentData.payment_id,
            payment_status: paymentData.payment_status,
            payment_method: paymentData.payment_method,
            status: paymentData.payment_status === 'approved' ? 'confirmed' : 'pending',
        })
        .eq('external_reference', externalReference)
        .select()
        .single();

    if (error) {
        console.error('Erro ao atualizar pagamento:', error);
        return null;
    }

    return data;
}

// ============================================
// CUPONS
// ============================================

export async function validateCoupon(code: string, orderValue: number) {
    const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();

    if (error || !coupon) {
        return { valid: false, error: 'Cupom inválido' };
    }

    // Verificar validade
    const now = new Date();

    if (coupon.starts_at && new Date(coupon.starts_at) > now) {
        return { valid: false, error: 'Cupom ainda não está ativo' };
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < now) {
        return { valid: false, error: 'Cupom expirado' };
    }

    // Verificar uso máximo
    if (coupon.max_uses && coupon.uses_count >= coupon.max_uses) {
        return { valid: false, error: 'Cupom esgotado' };
    }

    // Verificar valor mínimo
    if (coupon.minimum_order_value && orderValue < coupon.minimum_order_value) {
        return {
            valid: false,
            error: `Valor mínimo: R$ ${coupon.minimum_order_value.toFixed(2)}`
        };
    }

    // Calcular desconto
    let discount = 0;
    if (coupon.discount_type === 'percentage') {
        discount = orderValue * (coupon.discount_value / 100);
    } else if (coupon.discount_type === 'fixed') {
        discount = coupon.discount_value;
    }

    return {
        valid: true,
        coupon,
        discount,
        freeShipping: coupon.discount_type === 'free_shipping',
    };
}
