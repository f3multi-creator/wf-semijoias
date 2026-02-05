"use client";

import Link from "next/link";

interface CustomOrderCTAProps {
    productName?: string;
    whatsappNumber?: string;
}

const DEFAULT_WHATSAPP = "5527999201077";

export function CustomOrderCTA({
    productName,
    whatsappNumber = DEFAULT_WHATSAPP
}: CustomOrderCTAProps) {
    const message = productName
        ? `Olá! Vi o produto "${productName}" no site e gostaria de saber mais sobre peças personalizadas. Vocês podem me ajudar?`
        : "Olá! Vim pelo site da WF Semijoias e gostaria de saber mais sobre peças personalizadas e exclusivas.";

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    return (
        <section className="bg-gradient-to-br from-gold/10 via-beige to-nude py-16 md:py-20">
            <div className="container">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Ícone decorativo */}
                    <div className="mb-6">
                        <span className="inline-flex items-center justify-center w-16 h-16 bg-gold/20 rounded-full">
                            <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </span>
                    </div>

                    {/* Título */}
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-dark mb-4">
                        Peças <span className="text-gold italic">Exclusivas</span> & Personalizadas
                    </h2>

                    {/* Descrição */}
                    <p className="text-brown text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
                        Nossas peças são únicas! Temos uma <strong>equipe dedicada a te ouvir</strong>.
                        Podemos fazer alterações nas peças existentes ou criar uma
                        <strong> peça do zero exclusivamente para você</strong>.
                    </p>

                    {/* Benefícios */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="flex flex-col items-center p-4">
                            <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="font-display text-lg text-dark mb-1">Feito com Amor</h3>
                            <p className="text-taupe text-sm">Cada peça criada especialmente para você</p>
                        </div>
                        <div className="flex flex-col items-center p-4">
                            <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="font-display text-lg text-dark mb-1">Atendimento Dedicado</h3>
                            <p className="text-taupe text-sm">Equipe pronta para entender seus desejos</p>
                        </div>
                        <div className="flex flex-col items-center p-4">
                            <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                            <h3 className="font-display text-lg text-dark mb-1">Qualidade Premium</h3>
                            <p className="text-taupe text-sm">Pedras brasileiras selecionadas</p>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Falar com Nossa Equipe
                    </a>

                    <p className="text-taupe text-sm mt-4">
                        Resposta rápida • Sem compromisso
                    </p>
                </div>
            </div>
        </section>
    );
}
