"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Eye, Type } from "lucide-react";

interface HeroSettings {
    subtitle: string;
    title: string;
    titleHighlight: string;
    description: string;
    buttonText: string;
    buttonLink: string;
}

const DEFAULTS: HeroSettings = {
    subtitle: "Coleção Exclusiva",
    title: "Joias que contam",
    titleHighlight: "histórias",
    description: "Semijoias artesanais feitas à mão com pedras brasileiras premium.",
    buttonText: "Explorar Coleção",
    buttonLink: "/categoria/colares",
};

export default function HeroEditorPage() {
    const [settings, setSettings] = useState<HeroSettings>(DEFAULTS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch("/api/admin/hero-settings");
                const data = await res.json();
                if (data.settings) {
                    setSettings(data.settings);
                }
            } catch {
                console.error("Erro ao carregar configurações");
            } finally {
                setLoading(false);
            }
        }
        fetchSettings();
    }, []);

    async function handleSave() {
        setSaving(true);
        setError("");
        setSaved(false);

        try {
            const res = await fetch("/api/admin/hero-settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.sql) {
                    setError(`Tabela não existe. Execute este SQL no Supabase:\n\n${data.sql}`);
                } else {
                    setError(data.error || "Erro ao salvar");
                }
                return;
            }

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch {
            setError("Erro de conexão");
        } finally {
            setSaving(false);
        }
    }

    function handleChange(field: keyof HeroSettings, value: string) {
        setSettings((prev) => ({ ...prev, [field]: value }));
    }

    function resetToDefaults() {
        setSettings(DEFAULTS);
    }

    if (loading) {
        return (
            <div className="p-8 text-center text-taupe">
                Carregando configurações...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin"
                        className="p-2 hover:bg-beige rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-display text-dark">
                            Texto do Banner Principal
                        </h1>
                        <p className="text-sm text-taupe">
                            Edite o texto que aparece sobre o hero shot na página inicial
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={resetToDefaults}
                        className="px-4 py-2 text-sm text-taupe hover:text-dark border border-beige rounded-lg transition-colors"
                    >
                        Restaurar Padrão
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? "Salvando..." : "Salvar"}
                    </button>
                </div>
            </div>

            {/* Success/Error Messages */}
            {saved && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                    Configurações salvas com sucesso! As alterações aparecerão na página inicial.
                </div>
            )}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm whitespace-pre-wrap">
                    {error}
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Form */}
                <div className="space-y-6">
                    <div className="bg-white border border-beige rounded-xl p-6 space-y-5">
                        <div className="flex items-center gap-2 text-dark font-medium mb-2">
                            <Type className="w-5 h-5 text-gold" />
                            Textos do Hero
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-1">
                                Subtítulo (texto dourado acima)
                            </label>
                            <input
                                type="text"
                                value={settings.subtitle}
                                onChange={(e) => handleChange("subtitle", e.target.value)}
                                className="w-full px-4 py-2 border border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
                                placeholder="Ex: Coleção Exclusiva"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-1">
                                Título principal (linha 1)
                            </label>
                            <input
                                type="text"
                                value={settings.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                className="w-full px-4 py-2 border border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
                                placeholder="Ex: Joias que contam"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-1">
                                Título destaque (linha 2, em itálico dourado)
                            </label>
                            <input
                                type="text"
                                value={settings.titleHighlight}
                                onChange={(e) => handleChange("titleHighlight", e.target.value)}
                                className="w-full px-4 py-2 border border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
                                placeholder="Ex: histórias"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-1">
                                Descrição
                            </label>
                            <textarea
                                value={settings.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 border border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none"
                                placeholder="Ex: Semijoias artesanais feitas à mão..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-dark mb-1">
                                    Texto do Botão
                                </label>
                                <input
                                    type="text"
                                    value={settings.buttonText}
                                    onChange={(e) => handleChange("buttonText", e.target.value)}
                                    className="w-full px-4 py-2 border border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
                                    placeholder="Ex: Explorar Coleção"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dark mb-1">
                                    Link do Botão
                                </label>
                                <input
                                    type="text"
                                    value={settings.buttonLink}
                                    onChange={(e) => handleChange("buttonLink", e.target.value)}
                                    className="w-full px-4 py-2 border border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
                                    placeholder="Ex: /categoria/colares"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-dark font-medium">
                        <Eye className="w-5 h-5 text-gold" />
                        Pré-visualização
                    </div>
                    <div className="relative aspect-video bg-gradient-to-r from-stone-800 to-stone-600 rounded-xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                        <div className="relative z-10 h-full flex items-center p-8">
                            <div className="max-w-sm text-white">
                                <p className="uppercase tracking-[0.3em] text-xs mb-3 text-amber-400">
                                    {settings.subtitle || "Subtítulo"}
                                </p>
                                <h2 className="font-serif text-2xl md:text-3xl mb-4 leading-tight">
                                    {settings.title || "Título"}
                                    <br />
                                    <span className="text-amber-400 italic">
                                        {settings.titleHighlight || "destaque"}
                                    </span>
                                </h2>
                                <p className="text-white/80 text-sm mb-4">
                                    {settings.description || "Descrição"}
                                </p>
                                <span className="inline-block px-4 py-2 bg-amber-600 text-white text-sm rounded">
                                    {settings.buttonText || "Botão"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-taupe">
                        Esta é uma pré-visualização simplificada. O resultado final na página inicial
                        terá as imagens do banner como fundo.
                    </p>
                </div>
            </div>
        </div>
    );
}
