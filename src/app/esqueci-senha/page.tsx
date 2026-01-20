"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function EsqueciSenhaPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Erro ao enviar email");
                return;
            }

            setSent(true);
        } catch (error) {
            setError("Erro ao enviar email. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-[70vh] flex items-center py-20 bg-cream">
            <div className="container">
                <div className="max-w-md mx-auto">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link href="/">
                            <Image
                                src="/logo-dark.png"
                                alt="WF Semijoias"
                                width={160}
                                height={60}
                                className="h-14 w-auto mx-auto"
                            />
                        </Link>
                    </div>

                    {/* Card */}
                    <div className="bg-offwhite p-8 border border-beige">
                        {sent ? (
                            <div className="text-center">
                                <div className="text-5xl mb-4">✉️</div>
                                <h1 className="font-display text-2xl text-dark mb-4">
                                    Email enviado!
                                </h1>
                                <p className="text-taupe mb-6">
                                    Se existe uma conta com este email, você receberá
                                    um link para redefinir sua senha.
                                </p>
                                <Link href="/login" className="text-gold hover:underline">
                                    Voltar para o login
                                </Link>
                            </div>
                        ) : (
                            <>
                                <h1 className="font-display text-2xl text-dark text-center mb-2">
                                    Esqueceu sua senha?
                                </h1>
                                <p className="text-taupe text-center text-sm mb-8">
                                    Digite seu email para receber um link de recuperação
                                </p>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6 text-sm">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-taupe mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold"
                                            placeholder="seu@email.com"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full btn btn-primary disabled:opacity-50"
                                    >
                                        {loading ? "Enviando..." : "Enviar Link de Recuperação"}
                                    </button>
                                </form>

                                <p className="text-center text-sm text-taupe mt-6">
                                    Lembrou a senha?{" "}
                                    <Link href="/login" className="text-gold hover:underline">
                                        Fazer login
                                    </Link>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
