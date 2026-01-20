export const metadata = {
    title: "Trocas e Devoluções",
    description: "Política de trocas e devoluções da WF Semijoias.",
};

export default function TrocasPage() {
    return (
        <div className="min-h-screen bg-offwhite">
            <section className="bg-cream py-12 md:py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-display text-dark mb-4">
                        Trocas e Devoluções
                    </h1>
                    <p className="text-taupe max-w-xl mx-auto">
                        Sua satisfação é nossa prioridade. Conheça nossa política de trocas.
                    </p>
                </div>
            </section>

            <section className="py-12">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="space-y-8">
                        <div className="bg-white border border-beige rounded-lg p-6">
                            <h2 className="text-xl font-display text-dark mb-4">
                                Prazo para Troca ou Devolução
                            </h2>
                            <p className="text-taupe mb-4">
                                Você tem até <strong>7 dias corridos</strong> após o recebimento
                                do produto para solicitar troca ou devolução, conforme o Código
                                de Defesa do Consumidor.
                            </p>
                        </div>

                        <div className="bg-white border border-beige rounded-lg p-6">
                            <h2 className="text-xl font-display text-dark mb-4">
                                Condições para Troca
                            </h2>
                            <ul className="text-taupe space-y-2">
                                <li>• Produto em perfeito estado, sem uso</li>
                                <li>• Embalagem original intacta</li>
                                <li>• Todas as etiquetas e acessórios inclusos</li>
                                <li>• Nota fiscal do pedido</li>
                            </ul>
                        </div>

                        <div className="bg-white border border-beige rounded-lg p-6">
                            <h2 className="text-xl font-display text-dark mb-4">
                                Como Solicitar
                            </h2>
                            <ol className="text-taupe space-y-3">
                                <li>
                                    <strong>1.</strong> Entre em contato pelo WhatsApp ou e-mail
                                    informando o número do pedido
                                </li>
                                <li>
                                    <strong>2.</strong> Aguarde a aprovação da solicitação
                                </li>
                                <li>
                                    <strong>3.</strong> Envie o produto para nosso endereço
                                    (informaremos o frete de retorno)
                                </li>
                                <li>
                                    <strong>4.</strong> Após receber e verificar o produto,
                                    processaremos a troca ou reembolso
                                </li>
                            </ol>
                        </div>

                        <div className="bg-white border border-beige rounded-lg p-6">
                            <h2 className="text-xl font-display text-dark mb-4">
                                Reembolso
                            </h2>
                            <p className="text-taupe mb-4">
                                O reembolso será realizado na mesma forma de pagamento da
                                compra original:
                            </p>
                            <ul className="text-taupe space-y-2">
                                <li>• <strong>Cartão de crédito:</strong> Estorno em até 2 faturas</li>
                                <li>• <strong>PIX:</strong> Devolução em até 5 dias úteis</li>
                                <li>• <strong>Boleto:</strong> Transferência bancária em até 10 dias úteis</li>
                            </ul>
                        </div>

                        <div className="bg-gold/10 border border-gold rounded-lg p-6">
                            <h2 className="text-xl font-display text-dark mb-4">
                                Produtos com Defeito
                            </h2>
                            <p className="text-taupe">
                                Se o produto apresentar defeito de fabricação, entre em contato
                                imediatamente. Cubriremos o frete de retorno e enviaremos
                                um novo produto ou realizaremos o reembolso integral.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <a
                            href="https://wa.me/5511999999999"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            Solicitar Troca pelo WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
