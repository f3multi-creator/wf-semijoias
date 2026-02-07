import Link from "next/link";
import Image from "next/image";

export const metadata = {
    title: "Sobre Nós | Nossa História de 40 Anos",
    description: "Conheça a história de mais de 40 anos da família Felisberto no setor de joias e semijoias no Espírito Santo. Uma homenagem à nossa fundadora Waleria Felisberto.",
};

// Dados da linha do tempo
const timelineData = [
    {
        year: "1986",
        title: "O Início de uma Jornada",
        description: "Waleria Felisberto dá início à sua trajetória no mundo das joias no Espírito Santo, movida pela paixão por criar peças únicas e exclusivas.",
        highlight: true,
    },
    {
        year: "Anos 90",
        title: "Expansão e Parceria",
        description: "Francisco, marido de Waleria, une-se ao negócio. Juntos, expandem a atuação para ouro, prata e semijoias, consolidando a marca na região.",
    },
    {
        year: "Anos 2000",
        title: "Consolidação no Mercado",
        description: "A família Felisberto se torna referência em qualidade e design no Espírito Santo, conquistando clientes fiéis por todo o estado.",
    },
    {
        year: "Anos 2010",
        title: "Diversificação das Marcas",
        description: "Nasce a Felisberto Joias, focada em ouro personalizado, e a WF Semijoias, levando a arte e tradição para um público ainda maior.",
    },
    {
        year: "2026",
        title: "O Legado Continua",
        description: "A família honra a memória de Waleria, continuando sua missão de encantar o Brasil com peças que carregam inovação, carinho e requinte.",
        highlight: true,
    },
];

export default function SobrePage() {
    return (
        <div className="min-h-screen bg-offwhite">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-dark to-charcoal py-20 md:py-32 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_var(--wf-gold)_0%,_transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_var(--wf-gold)_0%,_transparent_40%)]"></div>
                </div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <span className="inline-block text-gold text-sm uppercase tracking-[0.3em] mb-4 font-medium">
                        Desde 1986
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display text-cream mb-6 leading-tight">
                        40 Anos de Tradição<br />
                        <span className="text-gold">e Inovação</span>
                    </h1>
                    <p className="text-lg md:text-xl text-stone max-w-2xl mx-auto leading-relaxed">
                        Uma história de amor, dedicação e arte construída no coração do Espírito Santo.
                        Do ouro às semijoias, nossa família leva beleza e sofisticação a cada peça.
                    </p>
                </div>
            </section>

            {/* Homenagem a Waleria Felisberto */}
            <section className="py-16 md:py-24 bg-cream">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            {/* Foto placeholder - espaço para imagem real */}
                            <div className="relative group">
                                <div className="aspect-[3/4] bg-beige rounded-lg overflow-hidden shadow-xl">
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                        <div className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center mb-4">
                                            <svg className="w-12 h-12 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-taupe text-sm">Foto de Waleria Felisberto</span>
                                        <span className="text-stone text-xs mt-1">(Adicionar imagem)</span>
                                    </div>
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gold/10 rounded-full -z-10"></div>
                                <div className="absolute -top-4 -left-4 w-24 h-24 bg-gold/5 rounded-full -z-10"></div>
                            </div>

                            {/* Texto da homenagem */}
                            <div>
                                <span className="text-gold text-sm uppercase tracking-[0.2em] mb-3 block">
                                    Em Memória
                                </span>
                                <h2 className="text-3xl md:text-4xl font-display text-dark mb-6">
                                    Waleria Felisberto
                                </h2>
                                <p className="text-sm text-taupe mb-4 italic">
                                    Fundadora • 1986 — Janeiro de 2026
                                </p>
                                <div className="space-y-4 text-taupe leading-relaxed">
                                    <p>
                                        Com mãos habilidosas e um olhar único para a beleza, Waleria Felisberto
                                        transformou sonhos em joias por mais de quatro décadas. Sua jornada começou
                                        em 1986, no Espírito Santo, onde construiu muito mais do que um negócio:
                                        construiu um <strong className="text-dark">legado de amor e arte</strong>.
                                    </p>
                                    <p>
                                        Waleria nos deixou não apenas memórias, mas um tesouro inestimável:
                                        <strong className="text-dark"> cadernos repletos de desenhos</strong>, coleções
                                        atemporais e designs que continuam inspirando cada nova peça que criamos.
                                    </p>
                                    <p>
                                        Sua partida em janeiro de 2026 deixou saudade, mas também a certeza de que
                                        seu espírito vive em cada detalhe do nosso trabalho. A família segue unida,
                                        honrando sua memória e perpetuando sua missão de levar
                                        <strong className="text-dark"> inovação, carinho e requinte</strong> a cada
                                        cliente.
                                    </p>
                                </div>
                                <div className="mt-8 p-6 bg-offwhite rounded-lg border-l-4 border-gold">
                                    <p className="text-dark font-display text-xl italic">
                                        "Cada joia conta uma história. A nossa história é feita de amor."
                                    </p>
                                    <p className="text-taupe text-sm mt-2">— Waleria Felisberto</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Linha do Tempo */}
            <section className="py-16 md:py-24 bg-offwhite">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-gold text-sm uppercase tracking-[0.2em] mb-3 block">
                            Nossa Trajetória
                        </span>
                        <h2 className="text-3xl md:text-4xl font-display text-dark">
                            Uma História de Quatro Décadas
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto relative">
                        {/* Linha central */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-gold via-gold/50 to-gold hidden md:block"></div>

                        {/* Mobile: linha à esquerda */}
                        <div className="absolute left-6 w-0.5 h-full bg-gradient-to-b from-gold via-gold/50 to-gold md:hidden"></div>

                        <div className="space-y-12">
                            {timelineData.map((item, index) => (
                                <div
                                    key={index}
                                    className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                        }`}
                                >
                                    {/* Marcador central */}
                                    <div className="absolute left-6 md:left-1/2 md:transform md:-translate-x-1/2 z-10">
                                        <div className={`w-4 h-4 rounded-full border-4 ${item.highlight
                                                ? 'bg-gold border-gold shadow-lg shadow-gold/30'
                                                : 'bg-cream border-gold'
                                            }`}></div>
                                    </div>

                                    {/* Conteúdo */}
                                    <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'
                                        }`}>
                                        <div className={`bg-cream p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow ${item.highlight ? 'ring-2 ring-gold/20' : ''
                                            }`}>
                                            <span className={`inline-block text-2xl font-display mb-2 ${item.highlight ? 'text-gold' : 'text-dark'
                                                }`}>
                                                {item.year}
                                            </span>
                                            <h3 className="text-lg font-display text-dark mb-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-taupe text-sm leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Espaçamento para o outro lado */}
                                    <div className="hidden md:block md:w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Nossas Marcas */}
            <section className="py-16 md:py-24 bg-cream">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-gold text-sm uppercase tracking-[0.2em] mb-3 block">
                            Conheça
                        </span>
                        <h2 className="text-3xl md:text-4xl font-display text-dark">
                            Nossas Marcas
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                        {/* Felisberto Joias */}
                        <div className="bg-dark p-8 rounded-lg text-center group hover:bg-charcoal transition-colors">
                            <div className="w-20 h-20 mx-auto mb-6 bg-gold/20 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-display text-cream mb-3">
                                Felisberto Joias
                            </h3>
                            <p className="text-stone mb-6">
                                Nossa linha premium de <strong className="text-gold">ouro personalizado</strong>.
                                Peças exclusivas criadas sob medida para momentos únicos.
                            </p>
                            <a
                                href="https://instagram.com/felisbertojoias"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                                @felisbertojoias
                            </a>
                        </div>

                        {/* WF Semijoias */}
                        <div className="bg-offwhite p-8 rounded-lg text-center border border-beige group hover:border-gold/30 transition-colors">
                            <div className="w-20 h-20 mx-auto mb-6 bg-gold/10 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-display text-dark mb-3">
                                WF Semijoias
                            </h3>
                            <p className="text-taupe mb-6">
                                <strong className="text-dark">Semijoias artesanais premium</strong> com pedras
                                brasileiras selecionadas. A mesma tradição e qualidade em peças acessíveis.
                            </p>
                            <Link
                                href="/categoria/brincos"
                                className="inline-flex items-center gap-2 text-gold hover:text-gold-dark transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                                Ver Coleção
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Galeria do Legado */}
            <section className="py-16 md:py-24 bg-offwhite">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-gold text-sm uppercase tracking-[0.2em] mb-3 block">
                            Memórias
                        </span>
                        <h2 className="text-3xl md:text-4xl font-display text-dark mb-4">
                            O Legado de Waleria
                        </h2>
                        <p className="text-taupe max-w-2xl mx-auto">
                            Cadernos de desenho, coleções históricas e momentos especiais que guardam
                            décadas de criatividade e dedicação.
                        </p>
                    </div>

                    {/* Grid de imagens placeholder */}
                    <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Cadernos de Desenho", span: "col-span-2 row-span-2" },
                            { label: "Primeiras Coleções", span: "" },
                            { label: "Ateliê Original", span: "" },
                            { label: "Peças Icônicas", span: "col-span-2" },
                            { label: "Família Felisberto", span: "" },
                            { label: "Momentos Especiais", span: "" },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className={`${item.span} bg-beige rounded-lg aspect-square flex flex-col items-center justify-center p-4 hover:bg-nude transition-colors cursor-pointer group`}
                            >
                                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-3 group-hover:bg-gold/20 transition-colors">
                                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-taupe text-xs text-center">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Estatísticas */}
            <section className="py-16 bg-dark">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {[
                            { number: "40+", label: "Anos de história" },
                            { number: "2", label: "Marcas consolidadas" },
                            { number: "∞", label: "Peças criadas" },
                            { number: "1", label: "Família unida" },
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl md:text-5xl font-display text-gold mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-stone text-sm uppercase tracking-wider">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-16 md:py-24 bg-cream">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-display text-dark mb-6">
                        Faça Parte da Nossa História
                    </h2>
                    <p className="text-taupe max-w-xl mx-auto mb-8">
                        Cada peça que você escolhe carrega décadas de tradição, amor e dedicação.
                        Conheça nossas coleções e encontre a joia perfeita para você.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/categoria/brincos" className="btn btn-primary">
                            Ver Coleções
                        </Link>
                        <Link href="/contato" className="btn btn-outline">
                            Fale Conosco
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
