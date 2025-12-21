// Tipos do banco de dados (sincronizado com Supabase)

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    compare_price: number | null;
    sku: string | null;
    stock_quantity: number;
    low_stock_threshold: number;
    category_id: string | null;
    collection_id: string | null;
    weight_grams: number | null;
    dimensions: {
        width: number;
        height: number;
        depth: number;
    } | null;
    is_active: boolean;
    is_featured: boolean;
    seo_title: string | null;
    seo_description: string | null;
    created_at: string;
    updated_at: string;
    // Relações
    images?: ProductImage[];
    category?: Category;
    collection?: Collection;
}

export interface ProductImage {
    id: string;
    product_id: string;
    url: string;
    alt_text: string | null;
    position: number;
    is_primary: boolean;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    parent_id: string | null;
    position: number;
}

export interface Collection {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    is_active: boolean;
}

export interface Customer {
    id: string;
    full_name: string | null;
    email: string;
    phone: string | null;
    cpf: string | null;
    birth_date: string | null;
    default_address_id: string | null;
    accepts_marketing: boolean;
    created_at: string;
    updated_at: string;
    // Relações
    addresses?: Address[];
}

export interface Address {
    id: string;
    customer_id: string;
    label: string | null;
    street: string;
    number: string;
    complement: string | null;
    neighborhood: string;
    city: string;
    state: string;
    postal_code: string;
    is_default: boolean;
    created_at: string;
}

export interface Order {
    id: string;
    customer_id: string;
    status: OrderStatus;
    payment_status: PaymentStatus;
    payment_method: string | null;
    payment_id: string | null; // ID do Mercado Pago
    subtotal: number;
    shipping_cost: number;
    discount: number;
    total: number;
    coupon_code: string | null;
    shipping_address: Address;
    tracking_code: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    // Relações
    items?: OrderItem[];
    customer?: Customer;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    product_image: string;
    quantity: number;
    unit_price: number;
    total: number;
    // Relações
    product?: Product;
}

export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';

export type PaymentStatus =
    | 'pending'
    | 'approved'
    | 'in_process'
    | 'rejected'
    | 'refunded'
    | 'cancelled';

export interface Coupon {
    id: string;
    code: string;
    description: string | null;
    discount_type: 'percentage' | 'fixed' | 'free_shipping';
    discount_value: number;
    minimum_order_value: number | null;
    max_uses: number | null;
    uses_count: number;
    max_uses_per_customer: number;
    applicable_to: 'all' | 'category' | 'collection' | 'product';
    applicable_ids: string[] | null;
    starts_at: string | null;
    expires_at: string | null;
    is_active: boolean;
    created_at: string;
}

// Tipos para o carrinho (client-side)
export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Cart {
    items: CartItem[];
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
    coupon?: Coupon;
}

// Tipos para frete (Melhor Envio)
export interface ShippingOption {
    id: number;
    name: string;
    company: {
        id: number;
        name: string;
        picture: string;
    };
    price: number;
    delivery_time: number; // dias
    error?: string;
}
