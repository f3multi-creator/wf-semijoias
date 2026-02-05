"use client";

import { useEffect, useState } from "react";

interface InstagramPost {
    id: string;
    imageUrl: string;
    permalink: string;
    caption?: string;
}

interface InstagramFeedProps {
    username?: string;
}

// Função para criar URL do proxy de imagens
function getProxiedImageUrl(originalUrl: string): string {
    if (!originalUrl) return "";
    return `/api/instagram/image?url=${encodeURIComponent(originalUrl)}`;
}

// Dados do perfil
const PROFILE = {
    username: "wfsemijoias",
    name: "WF Semijoias | Autoral e Personalizada",
    posts: "1.5K",
    followers: "2.8K",
    following: "6.6K"
};

export function InstagramFeed({ username = "wfsemijoias" }: InstagramFeedProps) {
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [profilePicUrl, setProfilePicUrl] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await fetch("/api/instagram");
                const data = await response.json();

                if (data.posts && data.posts.length > 0) {
                    setPosts(data.posts.slice(0, 8));
                }
                if (data.profilePicUrl) {
                    setProfilePicUrl(data.profilePicUrl);
                }
            } catch (e) {
                console.error("Erro ao carregar Instagram:", e);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);

    return (
        <section className="py-16 bg-white">
            <div className="container max-w-4xl mx-auto px-4">

                {/* Header estilo Instagram */}
                <div className="flex items-center gap-6 md:gap-10 mb-8 pb-8 border-b border-gray-200">
                    {/* Foto de perfil */}
                    <div className="flex-shrink-0">
                        <a
                            href={`https://instagram.com/${username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-20 h-20 md:w-24 md:h-24 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
                        >
                            {profilePicUrl ? (
                                <img
                                    src={getProxiedImageUrl(profilePicUrl)}
                                    alt={PROFILE.name}
                                    className="w-full h-full rounded-full object-cover border-2 border-white"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                                    <span className="text-2xl font-bold text-gray-400">WF</span>
                                </div>
                            )}
                        </a>
                    </div>

                    {/* Info do perfil */}
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <a
                                href={`https://instagram.com/${username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xl md:text-2xl font-light text-gray-900 hover:opacity-70 transition-opacity"
                            >
                                {username}
                            </a>
                            <a
                                href={`https://instagram.com/${username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Seguir
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-6 text-sm md:text-base">
                            <span><strong className="font-semibold">{PROFILE.posts}</strong> publicações</span>
                            <span><strong className="font-semibold">{PROFILE.followers}</strong> seguidores</span>
                            <span className="hidden md:inline"><strong className="font-semibold">{PROFILE.following}</strong> seguindo</span>
                        </div>

                        {/* Nome */}
                        <p className="mt-2 text-sm font-semibold text-gray-900 hidden md:block">
                            {PROFILE.name}
                        </p>
                    </div>
                </div>

                {/* Grid de posts - 4 colunas */}
                <div className="grid grid-cols-4 gap-1 md:gap-2">
                    {loading ? (
                        // Loading skeleton
                        [...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="aspect-square bg-gray-100 animate-pulse"
                            />
                        ))
                    ) : posts.length > 0 ? (
                        // Posts reais
                        posts.map((post) => (
                            <a
                                key={post.id}
                                href={post.permalink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative aspect-square overflow-hidden bg-gray-100"
                            >
                                {/* Usando proxy para evitar CORS/expiration do CDN */}
                                <img
                                    src={getProxiedImageUrl(post.imageUrl)}
                                    alt={post.caption?.slice(0, 50) || "Post Instagram"}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />

                                {/* Overlay no hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <svg className="w-8 h-8 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                </div>
                            </a>
                        ))
                    ) : (
                        // Placeholder se não tem posts
                        [...Array(8)].map((_, i) => (
                            <a
                                key={i}
                                href={`https://instagram.com/${username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 hover:opacity-80 transition-opacity"
                            />
                        ))
                    )}
                </div>

                {/* Link para ver mais */}
                <div className="text-center mt-8">
                    <a
                        href={`https://instagram.com/${username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                        </svg>
                        Ver mais no Instagram
                    </a>
                </div>
            </div>
        </section>
    );
}
