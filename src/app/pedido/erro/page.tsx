import Link from "next/link";

export default function OrderErrorPage() {
    return (
        <section className="min-h-[60vh] flex items-center py-20 bg-cream">
            <div className="container">
                <div className="max-w-lg mx-auto text-center">
                    {/* Error Icon */}
                    <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>

                    <h1 className="font-display text-3xl md:text-4xl text-dark mb-4">
                        Pagamento não aprovado
                    </h1>

                    <p className="text-brown mb-8">
                        Infelizmente houve um problema com o seu pagamento.
                        Por favor, tente novamente ou escolha outra forma de pagamento.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/checkout" className="btn btn-primary">
                            Tentar Novamente
                        </Link>
                        <Link href="/" className="btn btn-outline">
                            Voltar para a Loja
                        </Link>
                    </div>

                    <p className="text-taupe text-sm mt-8">
                        Precisa de ajuda? Entre em contato pelo WhatsApp ou email.
                    </p>
                </div>
            </div>
        </section>
    );
}
