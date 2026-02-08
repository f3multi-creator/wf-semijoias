"use client";

import { useState } from "react";

export default function MarketingPage() {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm("Tem certeza que deseja enviar este e-mail para todos os clientes inscritos?")) return;

        setLoading(true);
        try {
            const response = await fetch("/api/admin/broadcast", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, message }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`E-mail enviado com sucesso para ${data.count} destinatários!`);
                setSubject("");
                setMessage("");
            } else {
                alert(data.error || "Erro ao enviar e-mail.");
            }
        } catch (error) {
            console.error("Erro ao enviar:", error);
            alert("Erro de conexão.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Marketing / Broadcast</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">Novo E-mail em Massa</h2>

                    <form onSubmit={handleSend} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Assunto
                            </label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:border-amber-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mensagem (HTML suportado)
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full h-64 px-4 py-2 border border-gray-300 rounded focus:border-amber-500 focus:outline-none font-mono text-sm"
                                required
                                placeholder="<h1>Olá!</h1><p>Confira nossas novidades...</p>"
                            />
                        </div>

                        <div className="flex gap-4 pt-2">
                            <button
                                type="button"
                                onClick={() => setPreview(!preview)}
                                className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                            >
                                {preview ? "Ocultar Preview" : "Ver Preview"}
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50"
                            >
                                {loading ? "Enviando..." : "Enviar Broadcast"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Preview */}
                {preview && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4 text-gray-500">Preview</h2>
                        <div className="border border-gray-100 rounded p-4 bg-gray-50 min-h-[400px]">
                            <h3 className="font-bold border-b pb-2 mb-4">{subject || "(Sem assunto)"}</h3>
                            <div
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: message || "(Sem conteúdo)" }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
