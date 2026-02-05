"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface InstagramPost {
    id: string;
    imageUrl: string;
    permalink: string;
    caption?: string;
}

interface InstagramFeedProps {
    username?: string;
}

export function InstagramFeed({ username = "wfsemijoias" }: InstagramFeedProps) {
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await fetch("/api/instagram");
                const data = await response.json();

                if (data.posts && data.posts.length > 0) {
                    setPosts(data.posts);
                } else {
                    setError(true);
                }
            } catch (e) {
                console.error("Erro ao carregar Instagram:", e);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);

    // Loading state
    if (loading) {
        return (
            <section className="section bg-cream">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-3xl md:text-4xl text-dark mb-3">
                            @{username}
                        </h2>
                        <p className="text-taupe">Carregando posts...</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="aspect-square bg-beige animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Error state - mostra placeholders com link para Instagram
    if (error || posts.length === 0) {
        return (
            <section className="section bg-cream">
                <div className="container">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <svg className="w-8 h-8 text-gold" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                            </svg>
                            <h2 className="font-display text-3xl md:text-4xl text-dark">
                                @{username}
                            </h2>
                        </div>
                        <p className="text-taupe text-lg">
                            Siga-nos no Instagram e inspire-se com nossas criações
                        </p>
                    </div>
                    <div className="text-center">
                        <a
                            href={`https://instagram.com/${username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Seguir no Instagram
                        </a>
                    </div>
                </div>
            </section>
        );
    }

    // Posts loaded successfully
    return (
        <section className="section bg-cream">
            <div className="container">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <svg className="w-8 h-8 text-gold" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                        </svg>
                        <h2 className="font-display text-3xl md:text-4xl text-dark">
                            @{username}
                        </h2>
                    </div>
                    <p className="text-taupe text-lg">
                        Siga-nos no Instagram e inspire-se com nossas criações
                    </p>
                </div>

                {/* Grid de Posts */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                    {posts.map((post) => (
                        <a
                            key={post.id}
                            href={post.permalink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-square overflow-hidden bg-beige"
                        >
                            <Image
                                src={post.imageUrl}
                                alt={post.caption?.slice(0, 100) || "Post Instagram WF Semijoias"}
                                fill
                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                unoptimized // Necessário para imagens externas
                            />

                            {/* Overlay no hover */}
                            <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/40 transition-all duration-300 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
                                    </svg>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-10">
                    <a
                        href={`https://instagram.com/${username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
                        </svg>
                        Seguir no Instagram
                    </a>
                </div>
            </div>
        </section>
    );
}
