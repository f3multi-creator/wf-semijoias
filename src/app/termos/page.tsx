export const metadata = {
    title: "Termos de Uso",
    description: "Termos e condições de uso do site WF Semijoias.",
};

export default function TermosPage() {
    return (
        <div className="min-h-screen bg-offwhite">
            <section className="bg-cream py-12 md:py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-display text-dark mb-4">
                        Termos de Uso
                    </h1>
                    <p className="text-taupe">
                        Última atualização: Janeiro de 2026
                    </p>
                </div>
            </section>

            <section className="py-12">
                <div className="container mx-auto px-4 max-w-3xl prose prose-lg prose-stone">
                    <h2>1. Aceitação dos Termos</h2>
                    <p>
                        Ao acessar e usar o site WF Semijoias, você concorda em cumprir estes
                        Termos de Uso. Se não concordar com qualquer parte destes termos,
                        não utilize nosso site.
                    </p>

                    <h2>2. Uso do Site</h2>
                    <p>
                        Você concorda em usar o site apenas para fins legais e de acordo com
                        estes termos. É proibido:
                    </p>
                    <ul>
                        <li>Usar o site de forma que possa danificá-lo ou prejudicar seu funcionamento</li>
                        <li>Tentar acessar áreas restritas sem autorização</li>
                        <li>Transmitir vírus ou códigos maliciosos</li>
                        <li>Coletar informações de outros usuários sem consentimento</li>
                    </ul>

                    <h2>3. Conta de Usuário</h2>
                    <p>
                        Ao criar uma conta, você é responsável por manter a confidencialidade
                        de suas credenciais. Notifique-nos imediatamente sobre qualquer uso
                        não autorizado da sua conta.
                    </p>

                    <h2>4. Produtos e Preços</h2>
                    <p>
                        Nos reservamos o direito de alterar preços, descrições e disponibilidade
                        de produtos sem aviso prévio. As cores dos produtos podem variar
                        ligeiramente devido à calibração de monitores.
                    </p>

                    <h2>5. Pedidos e Pagamentos</h2>
                    <p>
                        Ao realizar um pedido, você está fazendo uma oferta de compra.
                        Nos reservamos o direito de recusar ou cancelar pedidos por qualquer
                        motivo, incluindo erros de preço ou problemas de estoque.
                    </p>

                    <h2>6. Propriedade Intelectual</h2>
                    <p>
                        Todo o conteúdo do site, incluindo textos, imagens, logos e design,
                        é propriedade da WF Semijoias e protegido por direitos autorais.
                        É proibida a reprodução sem autorização.
                    </p>

                    <h2>7. Limitação de Responsabilidade</h2>
                    <p>
                        O site é fornecido "como está". Não garantimos que o site estará
                        disponível de forma ininterrupta ou livre de erros. Não nos
                        responsabilizamos por danos indiretos decorrentes do uso do site.
                    </p>

                    <h2>8. Alterações nos Termos</h2>
                    <p>
                        Podemos modificar estes termos a qualquer momento. O uso continuado
                        do site após alterações constitui aceitação dos novos termos.
                    </p>

                    <h2>9. Lei Aplicável</h2>
                    <p>
                        Estes termos são regidos pelas leis brasileiras. Qualquer disputa
                        será resolvida nos tribunais de São Paulo, SP.
                    </p>
                </div>
            </section>
        </div>
    );
}
