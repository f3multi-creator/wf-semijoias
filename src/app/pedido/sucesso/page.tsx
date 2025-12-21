import Link from "next/link";

interface OrderResultProps {
    searchParams: Promise<{
        collection_id?: string;
        collection_status?: string;
        payment_id?: string;
        status?: string;
        external_reference?: string;
        merchant_order_id?: string;
    }>;
}

export default async function OrderSuccessPage({ searchParams }: OrderResultProps) {
    const params = await searchParams;

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

                    {params.external_reference && (
                        <div className="bg-offwhite p-4 mb-8 border border-beige">
                            <p className="text-sm text-taupe">Referência do pedido:</p>
                            <p className="text-dark font-medium">{params.external_reference}</p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/" className="btn btn-primary">
                            Continuar Comprando
                        </Link>
                        <Link href="/minha-conta/pedidos" className="btn btn-outline">
                            Ver Meus Pedidos
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
