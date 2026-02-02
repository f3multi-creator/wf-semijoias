"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/store/cart";

const WHATSAPP_NUMBER = "5527999201077";

export default function OrderSuccessPage() {
    const searchParams = useSearchParams();
    const { clearCart } = useCart();

    const externalReference = searchParams.get('external_reference') || searchParams.get('ref');
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status') || searchParams.get('collection_status');

    // Limpar o carrinho quando a página carregar (pagamento aprovado)
    useEffect(() => {
        clearCart();
    }, [clearCart]);

    // URL do WhatsApp para dúvidas sobre o pedido
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Olá! Acabei de fazer um pedido no site (Ref: ${externalReference || 'N/A'}) e gostaria de mais informações.`
    )}`;

    return (
        <section className="min-h-[60vh] flex items-center py-20 bg-cream">
            <div className="container">
                <div className="max-w-lg mx-auto text-center">
                    {/* Success Icon */}
                    <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="font-display text-3xl md:text-4xl text-dark mb-4">
                        Pagamento Aprovado!
                    </h1>

                    <p className="text-brown mb-2">
                        Obrigada por comprar na WF Semijoias! ✨
                    </p>

                    <p className="text-taupe text-sm mb-8">
                        Você receberá um email com os detalhes do seu pedido e informações de rastreamento assim que o envio for realizado.
                    </p>

                    {externalReference && (
                        <div className="bg-offwhite p-4 mb-8 border border-beige">
                            <p className="text-sm text-taupe">Referência do pedido:</p>
                            <p className="text-dark font-medium">{externalReference}</p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <Link href="/" className="btn btn-primary">
                            Continuar Comprando
                        </Link>
                        <Link href="/minha-conta/pedidos" className="btn btn-outline">
                            Ver Meus Pedidos
                        </Link>
                    </div>

                    {/* WhatsApp para dúvidas */}
                    <div className="pt-6 border-t border-beige">
                        <p className="text-taupe text-sm mb-3">
                            Tem alguma dúvida sobre seu pedido?
                        </p>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors text-sm font-medium"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Fale conosco pelo WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
