"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ShippingSettings {
    id: string;
    cep_origem: string;
    frete_gratis_ativo: boolean;
    frete_gratis_valor_minimo: number;
    peso_padrao_gramas: number;
    largura_cm: number;
    altura_cm: number;
    comprimento_cm: number;
    transportadoras_ativas: string[];
    sandbox_ativo: boolean;
}

const transportadorasDisponiveis = [
    { id: "correios", nome: "Correios (PAC/SEDEX)" },
    { id: "jadlog", nome: "Jadlog" },
    { id: "loggi", nome: "Loggi" },
    { id: "azul", nome: "Azul Cargo" },
    { id: "latam", nome: "LATAM Cargo" },
];

export default function ConfiguracoesPage() {
    const [settings, setSettings] = useState<ShippingSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [melhorEnvioToken, setMelhorEnvioToken] = useState("");

    useEffect(() => {
        fetchSettings();
    }, []);

    async function fetchSettings() {
        try {
            const response = await fetch("/api/admin/shipping-settings");
            if (response.ok) {
                const data = await response.json();
                setSettings(data);
            }
        } catch (error) {
            console.error("Erro ao buscar configurações:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (!settings) return;

        setIsSaving(true);
        setMessage(null);

        try {
            const response = await fetch("/api/admin/shipping-settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            if (response.ok) {
                setMessage({ type: "success", text: "Configurações salvas com sucesso!" });
            } else {
                throw new Error("Erro ao salvar");
            }
        } catch (error) {
            setMessage({ type: "error", text: "Erro ao salvar configurações" });
        } finally {
            setIsSaving(false);
        }
    }

    function toggleTransportadora(id: string) {
        if (!settings) return;

        const ativas = settings.transportadoras_ativas || [];
        const novas = ativas.includes(id)
            ? ativas.filter(t => t !== id)
            : [...ativas, id];

        setSettings({ ...settings, transportadoras_ativas: novas });
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-display text-dark">Configurações de Frete</h1>
                    <p className="text-taupe mt-1">Gerencie o Melhor Envio e regras de frete grátis</p>
                </div>
                <Link href="/admin" className="text-taupe hover:text-gold">
                    ← Voltar
                </Link>
            </div>

            {message && (
                <div className={`mb-6 p-4 ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">
                {/* Token Melhor Envio */}
                <div className="bg-offwhite p-6 border border-beige">
                    <h2 className="font-display text-lg text-dark mb-4">🔑 Token Melhor Envio</h2>
                    <p className="text-sm text-taupe mb-4">
                        Obtenha seu token em{" "}
                        <a href="https://melhorenvio.com.br/painel/gerenciar/tokens" target="_blank" rel="noopener" className="text-gold underline">
                            melhorenvio.com.br
                        </a>
                    </p>
                    <div className="flex gap-4">
                        <input
                            type="password"
                            placeholder="Cole seu token aqui..."
                            value={melhorEnvioToken}
                            onChange={(e) => setMelhorEnvioToken(e.target.value)}
                            className="flex-1 px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold"
                        />
                        <button
                            type="button"
                            className="px-4 py-2 bg-dark text-cream hover:bg-charcoal transition-colors"
                            onClick={() => {
                                alert("Para configurar o token, adicione a variável MELHOR_ENVIO_TOKEN nas configurações da Vercel.");
                            }}
                        >
                            Como Configurar
                        </button>
                    </div>
                    <p className="text-xs text-taupe mt-2">
                        ⚠️ O token deve ser configurado nas variáveis de ambiente da Vercel por segurança.
                    </p>
                </div>

                {/* CEP de Origem */}
                <div className="bg-offwhite p-6 border border-beige">
                    <h2 className="font-display text-lg text-dark mb-4">📍 CEP de Origem</h2>
                    <p className="text-sm text-taupe mb-4">CEP do local de onde os produtos serão enviados</p>
                    <input
                        type="text"
                        value={settings?.cep_origem || ""}
                        onChange={(e) => setSettings(prev => prev ? { ...prev, cep_origem: e.target.value.replace(/\D/g, "").slice(0, 8) } : prev)}
                        placeholder="00000000"
                        maxLength={8}
                        className="w-48 px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold"
                    />
                </div>

                {/* Frete Grátis */}
                <div className="bg-offwhite p-6 border border-beige">
                    <h2 className="font-display text-lg text-dark mb-4">🎁 Frete Grátis</h2>

                    <label className="flex items-center gap-3 mb-4 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings?.frete_gratis_ativo || false}
                            onChange={(e) => setSettings(prev => prev ? { ...prev, frete_gratis_ativo: e.target.checked } : prev)}
                            className="w-5 h-5 accent-gold"
                        />
                        <span className="text-dark">Ativar frete grátis para pedidos acima de um valor mínimo</span>
                    </label>

                    {settings?.frete_gratis_ativo && (
                        <div className="flex items-center gap-2">
                            <span className="text-taupe">Valor mínimo: R$</span>
                            <input
                                type="number"
                                value={settings?.frete_gratis_valor_minimo || 0}
                                onChange={(e) => setSettings(prev => prev ? { ...prev, frete_gratis_valor_minimo: parseFloat(e.target.value) || 0 } : prev)}
                                min="0"
                                step="0.01"
                                className="w-32 px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold"
                            />
                        </div>
                    )}
                </div>

                {/* Dimensões Padrão */}
                <div className="bg-offwhite p-6 border border-beige">
                    <h2 className="font-display text-lg text-dark mb-4">📦 Dimensões Padrão dos Produtos</h2>
                    <p className="text-sm text-taupe mb-4">Valores usados no cálculo de frete quando o produto não tem dimensões específicas</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm text-taupe mb-1">Peso (g)</label>
                            <input
                                type="number"
                                value={settings?.peso_padrao_gramas || 0}
                                onChange={(e) => setSettings(prev => prev ? { ...prev, peso_padrao_gramas: parseInt(e.target.value) || 0 } : prev)}
                                min="1"
                                className="w-full px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-taupe mb-1">Largura (cm)</label>
                            <input
                                type="number"
                                value={settings?.largura_cm || 0}
                                onChange={(e) => setSettings(prev => prev ? { ...prev, largura_cm: parseInt(e.target.value) || 0 } : prev)}
                                min="1"
                                className="w-full px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-taupe mb-1">Altura (cm)</label>
                            <input
                                type="number"
                                value={settings?.altura_cm || 0}
                                onChange={(e) => setSettings(prev => prev ? { ...prev, altura_cm: parseInt(e.target.value) || 0 } : prev)}
                                min="1"
                                className="w-full px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-taupe mb-1">Comprimento (cm)</label>
                            <input
                                type="number"
                                value={settings?.comprimento_cm || 0}
                                onChange={(e) => setSettings(prev => prev ? { ...prev, comprimento_cm: parseInt(e.target.value) || 0 } : prev)}
                                min="1"
                                className="w-full px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold"
                            />
                        </div>
                    </div>
                </div>

                {/* Transportadoras */}
                <div className="bg-offwhite p-6 border border-beige">
                    <h2 className="font-display text-lg text-dark mb-4">🚚 Transportadoras</h2>
                    <p className="text-sm text-taupe mb-4">Selecione as transportadoras que deseja oferecer aos clientes</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {transportadorasDisponiveis.map((t) => (
                            <label key={t.id} className="flex items-center gap-3 p-3 border border-beige bg-cream cursor-pointer hover:border-gold transition-colors">
                                <input
                                    type="checkbox"
                                    checked={settings?.transportadoras_ativas?.includes(t.id) || false}
                                    onChange={() => toggleTransportadora(t.id)}
                                    className="w-5 h-5 accent-gold"
                                />
                                <span className="text-dark">{t.nome}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Ambiente */}
                <div className="bg-offwhite p-6 border border-beige">
                    <h2 className="font-display text-lg text-dark mb-4">⚙️ Ambiente</h2>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings?.sandbox_ativo || false}
                            onChange={(e) => setSettings(prev => prev ? { ...prev, sandbox_ativo: e.target.checked } : prev)}
                            className="w-5 h-5 accent-gold"
                        />
                        <span className="text-dark">Modo Sandbox (testes - sem custos reais)</span>
                    </label>
                    <p className="text-xs text-taupe mt-2">
                        Ative o modo sandbox para testar a integração sem gerar cobranças.
                        Desative quando estiver pronto para produção.
                    </p>
                </div>

                {/* Botão Salvar */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="btn btn-primary px-8"
                    >
                        {isSaving ? "Salvando..." : "Salvar Configurações"}
                    </button>
                </div>
            </form>
        </div>
    );
}
