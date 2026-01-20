"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("As senhas não coincidem");
            return;
        }

        if (form.password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Erro ao criar conta");
                return;
            }

            // Redirecionar para login com mensagem de sucesso
            router.push("/login?registered=true");
        } catch (error) {
            setError("Erro ao criar conta. Tente novamente.");
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
                        <h1 className="font-display text-2xl text-dark text-center mb-2">
                            Criar sua conta
                        </h1>
                        <p className="text-taupe text-center text-sm mb-8">
                            Crie uma conta para acompanhar seus pedidos
                        </p>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-taupe mb-1">Nome completo</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold"
                                    placeholder="Seu nome"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-taupe mb-1">Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold"
                                    placeholder="seu@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-taupe mb-1">Senha</label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold"
                                    placeholder="Mínimo 6 caracteres"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-taupe mb-1">Confirmar Senha</label>
                                <input
                                    type="password"
                                    value={form.confirmPassword}
                                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold"
                                    placeholder="Repita a senha"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn btn-primary disabled:opacity-50"
                            >
                                {loading ? "Criando conta..." : "Criar Conta"}
                            </button>
                        </form>

                        <p className="text-center text-sm text-taupe mt-6">
                            Já tem uma conta?{" "}
                            <Link href="/login" className="text-gold hover:underline">
                                Fazer login
                            </Link>
                        </p>
                    </div>

                    <p className="text-center text-xs text-taupe mt-6">
                        Ao criar sua conta, você concorda com nossa{" "}
                        <Link href="/privacidade" className="underline">Política de Privacidade</Link>
                        {" "}e{" "}
                        <Link href="/termos" className="underline">Termos de Uso</Link>.
                    </p>
                </div>
            </div>
        </section>
    );
}
