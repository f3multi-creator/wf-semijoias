export const metadata = {
    title: "FAQ - Perguntas Frequentes",
    description: "Dúvidas frequentes sobre produtos, entregas, trocas e devoluções da WF Semijoias.",
};

const faqs = [
    {
        question: "Qual o prazo de entrega?",
        answer: "O prazo de entrega varia de acordo com a sua região e o método de envio escolhido. Após a aprovação do pagamento, seu pedido é despachado em até 2 dias úteis. O prazo dos Correios pode variar de 3 a 15 dias úteis, dependendo do destino.",
    },
    {
        question: "Posso trocar ou devolver um produto?",
        answer: "Sim! Você tem até 7 dias corridos após o recebimento para solicitar a troca ou devolução. O produto deve estar em perfeito estado, com a embalagem original e todas as etiquetas. Entre em contato pelo WhatsApp para iniciar o processo.",
    },
    {
        question: "Quais formas de pagamento são aceitas?",
        answer: "Aceitamos cartão de crédito (em até 12x), PIX e boleto bancário. Todas as transações são processadas de forma segura pelo Mercado Pago.",
    },
    {
        question: "As peças desbotam ou escurecem?",
        answer: "Nossas semijoias são banhadas com camadas de ouro 18k ou ródio de alta qualidade. Para garantir a durabilidade, evite contato com água, perfumes e produtos químicos. Guarde suas peças em local seco e arejado.",
    },
    {
        question: "Como faço para rastrear meu pedido?",
        answer: "Assim que seu pedido for despachado, você receberá um e-mail com o código de rastreamento. Use esse código no site dos Correios ou Melhor Envio para acompanhar a entrega.",
    },
    {
        question: "Vocês fazem entregas para todo o Brasil?",
        answer: "Sim! Entregamos em todo o território nacional através dos Correios e transportadoras parceiras. O frete é grátis para compras acima de R$ 299.",
    },
    {
        question: "Como cuidar das minhas semijoias?",
        answer: "Evite contato com água, perfumes, cremes e produtos químicos. Guarde cada peça separadamente em saquinhos ou caixinhas. Para limpar, use um pano macio e seco.",
    },
    {
        question: "Posso retirar meu pedido pessoalmente?",
        answer: "Sim! Oferecemos a opção de retirada na fábrica em São Paulo. Selecione essa opção no checkout e agende seu horário de retirada.",
    },
];

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-offwhite">
            <section className="bg-cream py-12 md:py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-display text-dark mb-4">
                        Perguntas Frequentes
                    </h1>
                    <p className="text-taupe max-w-xl mx-auto">
                        Tire suas dúvidas sobre nossos produtos, entregas e políticas.
                    </p>
                </div>
            </section>

            <section className="py-12">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white border border-beige rounded-lg p-6">
                                <h3 className="text-lg font-medium text-dark mb-2">
                                    {faq.question}
                                </h3>
                                <p className="text-taupe">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-taupe mb-4">
                            Não encontrou o que procurava?
                        </p>
                        <a
                            href="https://wa.me/5511999999999"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            Fale Conosco no WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
