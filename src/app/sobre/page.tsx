import Link from "next/link";
import Image from "next/image";

export const metadata = {
    title: "Sobre Nós",
    description: "Conheça a história da WF Semijoias e nossa paixão por criar peças únicas.",
};

export default function SobrePage() {
    return (
        <div className="min-h-screen bg-offwhite">
            {/* Hero */}
            <section className="bg-cream py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-display text-dark mb-6">
                        Nossa História
                    </h1>
                    <p className="text-lg text-taupe max-w-2xl mx-auto">
                        Criando semijoias artesanais com amor e dedicação desde 2018.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                        <div>
                            <h2 className="text-2xl font-display text-dark mb-4">
                                Quem Somos
                            </h2>
                            <p className="text-taupe mb-4">
                                A WF Semijoias nasceu da paixão por criar peças únicas que
                                celebram a beleza e a força da mulher brasileira. Cada semijoia
                                é cuidadosamente elaborada à mão, combinando técnicas artesanais
                                tradicionais com design contemporâneo.
                            </p>
                            <p className="text-taupe">
                                Trabalhamos com pedras brasileiras selecionadas e materiais
                                de alta qualidade para garantir que cada peça seja especial
                                e duradoura.
                            </p>
                        </div>
                        <div className="bg-beige aspect-square rounded-lg flex items-center justify-center">
                            <span className="text-taupe text-sm">Imagem em breve</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <div className="text-center p-6 bg-cream rounded-lg">
                            <div className="text-3xl font-display text-gold mb-2">5+</div>
                            <div className="text-taupe">Anos de experiência</div>
                        </div>
                        <div className="text-center p-6 bg-cream rounded-lg">
                            <div className="text-3xl font-display text-gold mb-2">1000+</div>
                            <div className="text-taupe">Peças vendidas</div>
                        </div>
                        <div className="text-center p-6 bg-cream rounded-lg">
                            <div className="text-3xl font-display text-gold mb-2">100%</div>
                            <div className="text-taupe">Artesanal</div>
                        </div>
                    </div>

                    <div className="bg-cream p-8 rounded-lg">
                        <h2 className="text-2xl font-display text-dark mb-4 text-center">
                            Nossa Missão
                        </h2>
                        <p className="text-taupe text-center max-w-2xl mx-auto">
                            Empoderar mulheres através de acessórios únicos que expressam
                            sua personalidade e estilo. Acreditamos que cada mulher merece
                            se sentir especial e confiante, e nossas peças são criadas
                            para fazer exatamente isso.
                        </p>
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href="/categoria/brincos"
                            className="btn btn-primary"
                        >
                            Conheça Nossas Peças
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
