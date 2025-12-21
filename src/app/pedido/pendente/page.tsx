import Link from "next/link";

interface OrderResultProps {
    searchParams: Promise<{
        external_reference?: string;
    }>;
}

export default async function OrderPendingPage({ searchParams }: OrderResultProps) {
    const params = await searchParams;

    return (
        <section className="min-h-[60vh] flex items-center py-20 bg-cream">
            <div className="container">
                <div className="max-w-lg mx-auto text-center">
                    {/* Pending Icon */}
                    <div className="w-20 h-20 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <h1 className="font-display text-3xl md:text-4xl text-dark mb-4">
                        Pagamento Pendente
                    </h1>

                    <p className="text-brown mb-2">
                        Seu pedido foi recebido e está aguardando a confirmação do pagamento.
                    </p>

                    <p className="text-taupe text-sm mb-8">
                        Se você escolheu PIX ou boleto, assim que identificarmos o pagamento
                        você receberá um email de confirmação.
                    </p>

                    {params.external_reference && (
                        <div className="bg-offwhite p-4 mb-8 border border-beige">
                            <p className="text-sm text-taupe">Referência do pedido:</p>
                            <p className="text-dark font-medium">{params.external_reference}</p>
                        </div>
                    )}

                    <div className="bg-yellow-50 border border-yellow-200 p-4 mb-8 text-left">
                        <p className="text-yellow-800 text-sm">
                            <strong>💡 Dica:</strong> Pagamentos via PIX são confirmados em minutos.
                            Boletos podem levar até 3 dias úteis para compensar.
                        </p>
                    </div>

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
