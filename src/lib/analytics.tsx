"use client";

import Script from "next/script";

// Meta Pixel (Facebook)
export function MetaPixel() {
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    if (!pixelId) return null;

    return (
        <>
        <Script
                id= "meta-pixel"
    strategy = "afterInteractive"
    dangerouslySetInnerHTML = {{
        __html: `
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '${pixelId}');
                        fbq('track', 'PageView');
                    `,
                }
}
            />
    < noscript >
    <img
                    height="1"
width = "1"
style = {{ display: "none" }}
src = {`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
alt = ""
    />
    </noscript>
    </>
    );
}

// Google Analytics (GA4)
export function GoogleAnalytics() {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    if (!gaId) return null;

    return (
        <>
        <Script
                src= {`https://www.googletagmanager.com/gtag/js?id=${gaId}`
}
strategy = "afterInteractive"
    />
    <Script
                id="google-analytics"
strategy = "afterInteractive"
dangerouslySetInnerHTML = {{
    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${gaId}');
                    `,
                }}
            />
    </>
    );
}

// Componente que agrupa todos os pixels de tracking
export function AnalyticsScripts() {
    return (
        <>
        <MetaPixel />
        < GoogleAnalytics />
        </>
    );
}

// ============================================
// Funções utilitárias para eventos de tracking
// ============================================

// Declaração global do fbq e gtag
declare global {
    interface Window {
        fbq?: (...args: unknown[]) => void;
        gtag?: (...args: unknown[]) => void;
    }
}

// Evento: Visualizar produto
export function trackViewContent(product: {
    id: string;
    name: string;
    price: number;
    category?: string;
}) {
    // Meta Pixel
    window.fbq?.("track", "ViewContent", {
        content_ids: [product.id],
        content_name: product.name,
        content_type: "product",
        value: product.price,
        currency: "BRL",
    });

    // Google Analytics
    window.gtag?.("event", "view_item", {
        currency: "BRL",
        value: product.price,
        items: [{
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            price: product.price,
        }],
    });
}

// Evento: Adicionar ao carrinho
export function trackAddToCart(product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
}) {
    window.fbq?.("track", "AddToCart", {
        content_ids: [product.id],
        content_name: product.name,
        content_type: "product",
        value: product.price * product.quantity,
        currency: "BRL",
    });

    window.gtag?.("event", "add_to_cart", {
        currency: "BRL",
        value: product.price * product.quantity,
        items: [{
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            price: product.price,
            quantity: product.quantity,
        }],
    });
}

// Evento: Iniciar checkout
export function trackInitiateCheckout(items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
}>, total: number) {
    window.fbq?.("track", "InitiateCheckout", {
        content_ids: items.map(i => i.id),
        num_items: items.reduce((sum, i) => sum + i.quantity, 0),
        value: total,
        currency: "BRL",
    });

    window.gtag?.("event", "begin_checkout", {
        currency: "BRL",
        value: total,
        items: items.map(i => ({
            item_id: i.id,
            item_name: i.name,
            price: i.price,
            quantity: i.quantity,
        })),
    });
}

// Evento: Compra realizada
export function trackPurchase(orderId: string, total: number, items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
}>) {
    window.fbq?.("track", "Purchase", {
        content_ids: items.map(i => i.id),
        content_type: "product",
        value: total,
        currency: "BRL",
    });

    window.gtag?.("event", "purchase", {
        transaction_id: orderId,
        currency: "BRL",
        value: total,
        items: items.map(i => ({
            item_id: i.id,
            item_name: i.name,
            price: i.price,
            quantity: i.quantity,
        })),
    });
}
