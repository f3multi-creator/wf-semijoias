"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

interface Banner {
    id: string;
    url: string;
    alt: string;
}

// Hero shots locais
const LOCAL_HERO_IMAGES: Banner[] = [
    { id: "hero-1", url: "/hero/hero-1.jpg", alt: "WF Semijoias - Coleção Exclusiva" },
    { id: "hero-2", url: "/hero/hero-2.jpg", alt: "WF Semijoias - Joias Artesanais" },
    { id: "hero-3", url: "/hero/hero-3.jpg", alt: "WF Semijoias - Pedras Brasileiras" },
    { id: "hero-4", url: "/hero/hero-4.jpg", alt: "WF Semijoias - Beleza Única" },
    { id: "hero-5", url: "/hero/hero-5.jpg", alt: "WF Semijoias - Elegância Natural" },
];

export function HeroBanner() {
    // Gerar índice aleatório inicial (apenas no cliente)
    const [randomStartIndex] = useState(() =>
        Math.floor(Math.random() * LOCAL_HERO_IMAGES.length)
    );

    const [banners, setBanners] = useState<Banner[]>(LOCAL_HERO_IMAGES);
    const [currentIndex, setCurrentIndex] = useState(randomStartIndex);
    const [isLoading, setIsLoading] = useState(true);

    // Buscar banners da API (se houver, sobrescreve os locais)
    useEffect(() => {
        async function fetchBanners() {
            try {
                const response = await fetch("/api/banners");
                const data = await response.json();
                if (data.banners && data.banners.length > 0) {
                    setBanners(data.banners);
                    // Novo índice aleatório para banners da API
                    setCurrentIndex(Math.floor(Math.random() * data.banners.length));
                }
            } catch (error) {
                console.error("Erro ao carregar banners:", error);
                // Mantém os locais em caso de erro
            } finally {
                setIsLoading(false);
            }
        }
        fetchBanners();
    }, []);

    // Auto-rotate banners a cada 5 segundos (se houver mais de um)
    useEffect(() => {
        if (banners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [banners.length]);

    // Navegação manual
    const goToSlide = useCallback((index: number) => {
        setCurrentIndex(index);
    }, []);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    }, [banners.length]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, [banners.length]);

    // Com imagens locais, não precisamos de loading state

    if (banners.length === 0) {
        // Fallback para banner padrão
        return (
            <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-beige to-nude" />
                <div className="container relative z-10 h-full flex items-center">
                    <div className="max-w-xl">
                        <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4 animate-fadeIn">
                            Coleção Exclusiva
                        </p>
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-dark mb-6 leading-tight animate-fadeIn">
                            Joias que contam
                            <br />
                            <span className="text-gold italic">histórias</span>
                        </h1>
                        <p className="text-taupe text-lg mb-8 leading-relaxed animate-fadeIn">
                            Semijoias artesanais feitas à mão com pedras brasileiras premium.
                        </p>
                        <Link href="/categoria/colares" className="btn btn-primary animate-fadeIn">
                            Explorar Coleção
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative h-[60vh] min-h-[500px] overflow-hidden group">
            {/* Slides */}
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${index === currentIndex ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <Image
                        src={banner.url}
                        alt={banner.alt}
                        fill
                        priority={index === 0}
                        className="object-cover"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-dark/40 to-transparent" />
                </div>
            ))}

            {/* Content overlay */}
            <div className="container relative z-10 h-full flex items-center">
                <div className="max-w-xl text-white">
                    <p className="uppercase tracking-[0.3em] text-sm mb-4 text-gold">
                        Coleção Exclusiva
                    </p>
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
                        Joias que contam
                        <br />
                        <span className="text-gold italic">histórias</span>
                    </h1>
                    <p className="text-cream/90 text-lg mb-8 leading-relaxed">
                        Semijoias artesanais feitas à mão com pedras brasileiras premium.
                    </p>
                    <Link href="/categoria/colares" className="btn btn-primary">
                        Explorar Coleção
                    </Link>
                </div>
            </div>

            {/* Navigation Arrows (aparecem no hover se houver mais de 1 banner) */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={goToPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Banner anterior"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Próximo banner"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Dots indicator (se houver mais de 1 banner) */}
            {banners.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                ? "bg-gold w-6"
                                : "bg-white/50 hover:bg-white"
                                }`}
                            aria-label={`Ir para banner ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
