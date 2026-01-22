"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImage {
    url: string;
    alt?: string;
    is_hero?: boolean;
}

interface ProductGalleryProps {
    images: ProductImage[];
    productName: string;
    discount?: number;
}

export function ProductGallery({ images, productName, discount = 0 }: ProductGalleryProps) {
    // Ordenar: hero shot primeiro, depois as demais
    const sortedImages = [...images].sort((a, b) => {
        if (a.is_hero && !b.is_hero) return -1;
        if (!a.is_hero && b.is_hero) return 1;
        return 0;
    });

    const [selectedIndex, setSelectedIndex] = useState(0);
    const selectedImage = sortedImages[selectedIndex];

    // Layout varia de acordo com número de imagens
    // 1 imagem: só a principal
    // 2-4 imagens: grid em linha
    // 5-6 imagens: grid em 2 linhas
    const thumbnailCount = sortedImages.length;

    return (
        <div className="space-y-3">
            {/* Hero Image - 4:3 Aspect Ratio for larger display */}
            <div className="relative aspect-[4/3] bg-beige overflow-hidden group rounded-sm">
                <Image
                    src={selectedImage?.url || "/products/placeholder.jpg"}
                    alt={selectedImage?.alt || productName}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                />

                {/* Discount Badge */}
                {discount > 0 && (
                    <span className="absolute top-4 left-4 bg-gold text-white text-sm px-4 py-1.5 tracking-wider font-medium">
                        -{discount}%
                    </span>
                )}

                {/* Navigation Arrows for Mobile */}
                {thumbnailCount > 1 && (
                    <>
                        <button
                            onClick={() => setSelectedIndex((prev) => (prev === 0 ? thumbnailCount - 1 : prev - 1))}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors shadow-md lg:opacity-0 lg:group-hover:opacity-100"
                            aria-label="Imagem anterior"
                        >
                            <svg className="w-5 h-5 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setSelectedIndex((prev) => (prev === thumbnailCount - 1 ? 0 : prev + 1))}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors shadow-md lg:opacity-0 lg:group-hover:opacity-100"
                            aria-label="Próxima imagem"
                        >
                            <svg className="w-5 h-5 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}

                {/* Image Counter */}
                {thumbnailCount > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-dark/70 text-white text-xs px-3 py-1 rounded-full lg:hidden">
                        {selectedIndex + 1} / {thumbnailCount}
                    </div>
                )}
            </div>

            {/* Thumbnails Grid */}
            {thumbnailCount > 1 && (
                <div className={`grid gap-2 ${thumbnailCount <= 4
                    ? 'grid-cols-4'
                    : 'grid-cols-3 sm:grid-cols-6'
                    }`}>
                    {sortedImages.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`relative aspect-video bg-beige overflow-hidden border-2 transition-all duration-200 ${index === selectedIndex
                                ? 'border-gold ring-2 ring-gold/30'
                                : 'border-transparent hover:border-gold/50'
                                }`}
                            aria-label={`Ver imagem ${index + 1}`}
                        >
                            <Image
                                src={image.url}
                                alt={image.alt || `${productName} - ${index + 1}`}
                                fill
                                sizes="120px"
                                className="object-cover"
                            />

                            {/* Hero Indicator on Thumbnail */}
                            {image.is_hero && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gold/20">
                                    <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Dots Indicator for Mobile */}
            {thumbnailCount > 1 && thumbnailCount <= 6 && (
                <div className="flex justify-center gap-2 lg:hidden">
                    {sortedImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === selectedIndex
                                ? 'bg-gold w-4'
                                : 'bg-taupe/40 hover:bg-taupe'
                                }`}
                            aria-label={`Ir para imagem ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
