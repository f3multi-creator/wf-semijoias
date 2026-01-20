"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (searchParams.get("registered")) {
            setSuccess("Conta criada com sucesso! Faça login para continuar.");
        }
    }, [searchParams]);

    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email: form.email,
                password: form.password,
                redirect: false,
            });

            if (result?.error) {
                setError("Email ou senha incorretos");
            } else if (result?.ok) {
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            setError("Erro ao fazer login. Tente novamente.");
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
                            Entrar na sua conta
                        </h1>
                        <p className="text-taupe text-center text-sm mb-8">
                            Acesse sua conta para acompanhar seus pedidos
                        </p>

                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded mb-6 text-sm">
                                {success}
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Google Login */}
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-beige hover:border-gold transition-colors mb-6"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            <span className="text-dark">Continuar com Google</span>
                        </button>

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-beige"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-offwhite text-taupe">ou</span>
                            </div>
                        </div>

                        {/* Email Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                    className="w-full px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold"
                                    placeholder="Sua senha"
                                />
                            </div>

                            <div className="text-right">
                                <Link href="/esqueci-senha" className="text-sm text-gold hover:underline">
                                    Esqueci minha senha
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn btn-primary disabled:opacity-50"
                            >
                                {loading ? "Entrando..." : "Entrar"}
                            </button>
                        </form>

                        <p className="text-center text-sm text-taupe mt-6">
                            Não tem uma conta?{" "}
                            <Link href="/registro" className="text-gold hover:underline">
                                Criar conta
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Carregando...</div>}>
            <LoginForm />
        </Suspense>
    );
}
