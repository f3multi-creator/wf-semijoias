"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/" });
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

                        {/* Email Form (visual apenas) */}
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm text-taupe mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold"
                                    placeholder="seu@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-taupe mb-1">Senha</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                type="button"
                                className="w-full btn btn-primary"
                                onClick={handleGoogleLogin}
                            >
                                Entrar
                            </button>
                        </form>

                        <p className="text-center text-taupe text-sm mt-6">
                            Ainda não tem conta?{" "}
                            <button
                                onClick={handleGoogleLogin}
                                className="text-gold hover:underline"
                            >
                                Cadastre-se com Google
                            </button>
                        </p>
                    </div>

                    <p className="text-center text-taupe text-xs mt-6">
                        Ao continuar, você concorda com nossos{" "}
                        <Link href="/termos" className="underline">
                            Termos de Uso
                        </Link>{" "}
                        e{" "}
                        <Link href="/privacidade" className="underline">
                            Política de Privacidade
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}
