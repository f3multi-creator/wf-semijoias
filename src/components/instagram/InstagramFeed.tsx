"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface InstagramPost {
    id: string;
    permalink: string;
    media_url: string;
    caption?: string;
}

interface InstagramFeedProps {
    username?: string;
    count?: number;
}

/**
 * Componente de Feed do Instagram
 * 
 * Opções de integração:
 * 
 * 1. ELFSIGHT (Recomendado - mais fácil)
 *    - Acesse https://elfsight.com/instagram-feed-widget/
 *    - Crie uma conta gratuita
 *    - Configure o widget e copie o código
 *    - Descomente a seção "ELFSIGHT" abaixo
 * 
 * 2. BEHOLD.SO (API simples)
 *    - Acesse https://behold.so/
 *    - Conecte sua conta do Instagram
 *    - Use a API deles para buscar posts
 * 
 * 3. INSTAGRAM GRAPH API (Avançado)
 *    - Requer Facebook Business account
 *    - Configure em developers.facebook.com
 *    - Adicione INSTAGRAM_ACCESS_TOKEN no .env
 */

export function InstagramFeed({ username = "wfsemijoias", count = 6 }: InstagramFeedProps) {
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Tenta carregar posts do Instagram
        loadInstagramPosts();
    }, []);

    const loadInstagramPosts = async () => {
        try {
            // Verifica se há configuração de API
            const response = await fetch(`/api/instagram?count=${count}`);
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    setPosts(data);
                    setLoading(false);
                    return;
                }
            }
        } catch (e) {
            // Silently fail, show placeholder
        }

        setLoading(false);
        setError(true);
    };

    // Se tem posts reais, mostra o feed real
    if (!loading && posts.length > 0) {
        return (
            <section className="section bg-cream">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-3xl md:text-4xl text-dark mb-3">
                            @{username}
                        </h2>
                        <p className="text-taupe">Siga-nos no Instagram e inspire-se</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                        {posts.map((post) => (
                            <a
                                key={post.id}
                                href={post.permalink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="aspect-square relative overflow-hidden group"
                            >
                                <Image
                                    src={post.media_url}
                                    alt={post.caption?.slice(0, 50) || "Instagram post"}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 16vw"
                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/30 transition-colors flex items-center justify-center">
                                    <svg
                                        className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </div>
                            </a>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <a
                            href={`https://instagram.com/${username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline"
                        >
                            Ver mais no Instagram
                        </a>
                    </div>
                </div>
            </section>
        );
    }

    // Placeholder enquanto não tem integração configurada
    return (
        <section className="section bg-cream">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="font-display text-3xl md:text-4xl text-dark mb-3">
                        @{username}
                    </h2>
                    <p className="text-taupe">Siga-nos no Instagram e inspire-se</p>
                </div>

                {/* Grid de placeholders com gradiente */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                    {[...Array(count)].map((_, i) => (
                        <a
                            key={i}
                            href={`https://instagram.com/${username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="aspect-square bg-beige hover:opacity-80 transition-opacity overflow-hidden group relative"
                        >
                            <div className="w-full h-full bg-gradient-to-br from-nude via-sand to-stone" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg
                                    className="w-8 h-8 text-dark/50"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </div>
                        </a>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <a
                        href={`https://instagram.com/${username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                    >
                        Seguir no Instagram
                    </a>
                </div>

                {/* Nota para admin */}
                {error && (
                    <p className="text-center text-taupe text-sm mt-4">
                        💡 Configure a integração do Instagram em /admin/configuracoes para mostrar posts reais
                    </p>
                )}
            </div>
        </section>
    );
}
