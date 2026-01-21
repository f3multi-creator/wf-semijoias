"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function RedefinirSenhaPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Token inválido ou expirado");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("Senha deve ter pelo menos 6 caracteres");
            return;
        }

        if (password !== confirmPassword) {
            setError("As senhas não coincidem");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Erro ao redefinir senha");
            }

            setSuccess(true);
            setTimeout(() => router.push("/login"), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <main className="min-h-screen flex items-center justify-center" style={{ background: "#fafaf8" }}>
                <div className="w-full max-w-md p-8 bg-white shadow-lg text-center" style={{ border: "1px solid #e8e6e3" }}>
                    <div className="text-5xl mb-4">✅</div>
                    <h1 className="text-2xl font-medium mb-4">Senha Redefinida!</h1>
                    <p className="text-gray-600 mb-6">Sua senha foi alterada com sucesso. Redirecionando para o login...</p>
                    <Link
                        href="/login"
                        className="inline-block px-6 py-3 text-white text-sm font-medium"
                        style={{ backgroundColor: "#1a1a1a" }}
                    >
                        Ir para Login
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center" style={{ background: "#fafaf8" }}>
            <div className="w-full max-w-md p-8 bg-white shadow-lg" style={{ border: "1px solid #e8e6e3" }}>
                <h1 className="text-2xl font-medium text-center mb-2">Redefinir Senha</h1>
                <p className="text-gray-600 text-center mb-6">Digite sua nova senha abaixo</p>

                {error && !token && (
                    <div className="p-3 mb-4 text-center text-red-700" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
                        {error}
                        <div className="mt-4">
                            <Link href="/esqueci-senha" className="text-sm underline" style={{ color: "#b8860b" }}>
                                Solicitar novo link
                            </Link>
                        </div>
                    </div>
                )}

                {token && (
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-3 mb-4 text-sm text-red-700" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
                                {error}
                            </div>
                        )}

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Nova Senha
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border focus:outline-none focus:ring-2"
                                style={{ borderColor: "#e8e6e3", focusRingColor: "#b8860b" }}
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirmar Nova Senha
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border focus:outline-none focus:ring-2"
                                style={{ borderColor: "#e8e6e3" }}
                                placeholder="Digite a senha novamente"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 text-white font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
                            style={{ backgroundColor: "#1a1a1a" }}
                        >
                            {loading ? "Redefinindo..." : "Redefinir Senha"}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <Link href="/login" className="text-sm hover:underline" style={{ color: "#b8860b" }}>
                        Voltar para o Login
                    </Link>
                </div>
            </div>
        </main>
    );
}
