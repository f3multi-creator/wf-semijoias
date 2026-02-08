
import Link from "next/link";
import Image from "next/image";

export function CustomizationBanner() {
    return (
        <section className="w-full bg-cream border-y border-beige my-12 py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                    {/* Texto e Conteúdo */}
                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div className="inline-block px-3 py-1 bg-gold/10 text-gold text-sm tracking-widest uppercase font-medium mb-2">
                            Ateliê Exclusivo
                        </div>
                        <h2 className="font-display text-3xl md:text-4xl text-dark">
                            Sua Joia, Do Seu Jeito
                        </h2>
                        <p className="text-taupe text-lg leading-relaxed max-w-lg">
                            Cada peça da WF Semijoias é feita à mão com materiais nobres.
                            Deseja ajustar o tamanho, trocar o banho ou escolher uma pedra específica?
                            Nossa equipe de personal stylists está pronta para criar algo único para você.
                        </p>

                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gold border border-beige">
                                    ✨
                                </span>
                                <span className="text-dark text-sm font-medium">Banho Personalizado</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gold border border-beige">
                                    📏
                                </span>
                                <span className="text-dark text-sm font-medium">Ajuste de Medida</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gold border border-beige">
                                    💎
                                </span>
                                <span className="text-dark text-sm font-medium">Escolha de Pedras</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gold border border-beige">
                                    🎁
                                </span>
                                <span className="text-dark text-sm font-medium">Embalagem Especial</span>
                            </div>
                        </div>

                        <Link
                            href="https://wa.me/5585994196191?text=Olá! Gostaria de personalizar uma joia da WF Semijoias."
                            target="_blank"
                            className="btn btn-primary inline-flex items-center gap-2 mt-4"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Falar com Personal Stylist
                        </Link>
                    </div>

                    {/* Imagem Visual Decorativa */}
                    <div className="flex-1 relative h-[400px] w-full max-w-md hidden md:block">
                        <div className="absolute inset-0 bg-gold/10 rounded-full transform translate-x-4 translate-y-4"></div>
                        <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-white shadow-xl bg-offwhite flex items-center justify-center">
                            <div className="text-center p-8">
                                <span className="text-6xl mb-4 block">✨</span>
                                <p className="font-display text-2xl text-dark">Exclusividade</p>
                                <p className="text-taupe text-sm mt-2 font-serif italic">Handmade in Brazil</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
