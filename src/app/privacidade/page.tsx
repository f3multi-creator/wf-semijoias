export const metadata = {
    title: "Política de Privacidade",
    description: "Saiba como a WF Semijoias coleta, usa e protege seus dados pessoais.",
};

export default function PrivacidadePage() {
    return (
        <div className="min-h-screen bg-offwhite">
            <section className="bg-cream py-12 md:py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-display text-dark mb-4">
                        Política de Privacidade
                    </h1>
                    <p className="text-taupe">
                        Última atualização: Janeiro de 2026
                    </p>
                </div>
            </section>

            <section className="py-12">
                <div className="container mx-auto px-4 max-w-3xl prose prose-lg prose-stone">
                    <h2>1. Coleta de Informações</h2>
                    <p>
                        A WF Semijoias coleta informações que você nos fornece diretamente, como nome,
                        e-mail, telefone e endereço de entrega ao realizar uma compra em nossa loja.
                    </p>

                    <h2>2. Uso das Informações</h2>
                    <p>Utilizamos suas informações para:</p>
                    <ul>
                        <li>Processar e entregar seus pedidos</li>
                        <li>Enviar atualizações sobre o status do pedido</li>
                        <li>Responder suas dúvidas e solicitações</li>
                        <li>Enviar comunicações de marketing (com seu consentimento)</li>
                        <li>Melhorar nossos produtos e serviços</li>
                    </ul>

                    <h2>3. Compartilhamento de Dados</h2>
                    <p>
                        Não vendemos suas informações pessoais. Podemos compartilhar dados apenas
                        com parceiros essenciais para a operação (transportadoras, processadores
                        de pagamento) e quando exigido por lei.
                    </p>

                    <h2>4. Segurança</h2>
                    <p>
                        Usamos criptografia SSL e outras medidas de segurança para proteger
                        suas informações. Seus dados de pagamento são processados de forma
                        segura pelo Mercado Pago, não tendo acesso aos dados do seu cartão.
                    </p>

                    <h2>5. Cookies</h2>
                    <p>
                        Utilizamos cookies para melhorar sua experiência de navegação,
                        lembrar suas preferências e analisar o tráfego do site. Você pode
                        gerenciar as preferências de cookies nas configurações do seu navegador.
                    </p>

                    <h2>6. Seus Direitos</h2>
                    <p>
                        Conforme a LGPD, você tem direito a acessar, corrigir, excluir ou
                        portar seus dados pessoais. Para exercer esses direitos, entre em
                        contato conosco pelo e-mail: contato@wfsemijoias.com.br
                    </p>

                    <h2>7. Alterações nesta Política</h2>
                    <p>
                        Podemos atualizar esta política periodicamente. Notificaremos sobre
                        mudanças significativas através do nosso site ou por e-mail.
                    </p>

                    <h2>8. Contato</h2>
                    <p>
                        Para dúvidas sobre esta política ou sobre o tratamento de seus dados,
                        entre em contato: contato@wfsemijoias.com.br
                    </p>
                </div>
            </section>
        </div>
    );
}
