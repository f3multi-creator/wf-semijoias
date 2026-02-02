"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Banner {
    id: string;
    url: string;
    alt: string;
    is_active: boolean;
    position: number;
    created_at: string;
}

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Carregar banners
    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const response = await fetch("/api/admin/banners");
            const data = await response.json();
            if (data.banners) {
                setBanners(data.banners);
            }
        } catch (error) {
            console.error("Erro ao carregar banners:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Upload de arquivo
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        setError("");
        setSuccess("");

        try {
            for (const file of Array.from(files)) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("folder", "banners");

                const uploadResponse = await fetch("/api/admin/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    throw new Error("Erro no upload");
                }

                const uploadData = await uploadResponse.json();

                // Salvar banner no banco
                await fetch("/api/admin/banners", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        url: uploadData.url,
                        alt: file.name.replace(/\.[^/.]+$/, ""),
                    }),
                });
            }

            setSuccess(`${files.length} banner(s) adicionado(s) com sucesso!`);
            fetchBanners();
        } catch (error) {
            setError("Erro ao fazer upload. Tente novamente.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    // Toggle ativo/inativo
    const toggleActive = async (id: string, currentActive: boolean) => {
        try {
            await fetch(`/api/admin/banners/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_active: !currentActive }),
            });
            fetchBanners();
        } catch (error) {
            setError("Erro ao atualizar banner");
        }
    };

    // Deletar banner
    const deleteBanner = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este banner?")) return;

        try {
            await fetch(`/api/admin/banners/${id}`, {
                method: "DELETE",
            });
            setSuccess("Banner excluído com sucesso!");
            fetchBanners();
        } catch (error) {
            setError("Erro ao excluir banner");
        }
    };

    // Atualizar posição
    const updatePosition = async (id: string, newPosition: number) => {
        try {
            await fetch(`/api/admin/banners/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ position: newPosition }),
            });
            fetchBanners();
        } catch (error) {
            setError("Erro ao atualizar posição");
        }
    };

    const activeBanners = banners.filter(b => b.is_active);
    const inactiveBanners = banners.filter(b => !b.is_active);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Gerenciar Banners</h1>
                <p className="text-gray-600 mt-1">
                    Faça upload de imagens e selecione quais aparecem na home.
                    Se selecionar várias, elas vão rotacionar automaticamente.
                </p>
            </div>

            {/* Feedback */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                    {success}
                </div>
            )}

            {/* Upload Area */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                <h2 className="text-lg font-medium mb-4">Adicionar Novos Banners</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-amber-500 transition-colors">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleUpload}
                        className="hidden"
                        id="banner-upload"
                        disabled={isUploading}
                    />
                    <label
                        htmlFor="banner-upload"
                        className="cursor-pointer block"
                    >
                        <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {isUploading ? (
                            <p className="text-gray-600">Enviando...</p>
                        ) : (
                            <>
                                <p className="text-gray-600 font-medium">Clique para fazer upload</p>
                                <p className="text-gray-400 text-sm mt-1">ou arraste e solte imagens aqui</p>
                                <p className="text-gray-400 text-xs mt-2">Recomendado: 1920x600px (16:9 ou similar)</p>
                            </>
                        )}
                    </label>
                </div>
            </div>

            {/* Banners Ativos */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">
                        Banners Ativos
                        <span className="text-sm text-gray-500 ml-2">({activeBanners.length})</span>
                    </h2>
                    <p className="text-sm text-gray-500">
                        {activeBanners.length === 1
                            ? "Sempre mostrará esta imagem"
                            : activeBanners.length > 1
                                ? "Imagens vão rotacionar automaticamente"
                                : "Nenhum banner ativo"}
                    </p>
                </div>

                {activeBanners.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        Nenhum banner ativo. Ative banners abaixo ou faça upload de novos.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeBanners
                            .sort((a, b) => a.position - b.position)
                            .map((banner, index) => (
                                <div key={banner.id} className="relative group rounded-lg overflow-hidden border-2 border-amber-500">
                                    <div className="aspect-video relative">
                                        <Image
                                            src={banner.url}
                                            alt={banner.alt}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => toggleActive(banner.id, banner.is_active)}
                                            className="px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                                        >
                                            Desativar
                                        </button>
                                        <button
                                            onClick={() => deleteBanner(banner.id)}
                                            className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                    <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                                        #{index + 1}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>

            {/* Banners Inativos */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-medium mb-4">
                    Banco de Imagens
                    <span className="text-sm text-gray-500 ml-2">({inactiveBanners.length})</span>
                </h2>

                {inactiveBanners.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        Nenhuma imagem no banco. Faça upload de novas imagens acima.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {inactiveBanners.map((banner) => (
                            <div key={banner.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
                                <div className="aspect-video relative">
                                    <Image
                                        src={banner.url}
                                        alt={banner.alt}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => toggleActive(banner.id, banner.is_active)}
                                        className="px-3 py-1.5 bg-amber-500 text-white text-sm rounded hover:bg-amber-600"
                                    >
                                        Ativar
                                    </button>
                                    <button
                                        onClick={() => deleteBanner(banner.id)}
                                        className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
