'use client';

import { useState } from 'react';

export default function ContatoPage() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        // Simula envio (integrar com API de email futuramente)
        await new Promise(resolve => setTimeout(resolve, 1500));

        setSent(true);
        setSending(false);
        setForm({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-offwhite">
            <section className="bg-cream py-12 md:py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-display text-dark mb-4">
                        Fale Conosco
                    </h1>
                    <p className="text-taupe max-w-xl mx-auto">
                        Estamos aqui para ajudar! Entre em contato por WhatsApp ou preencha o formulário.
                    </p>
                </div>
            </section>

            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        {/* Informações de Contato */}
                        <div>
                            <h2 className="text-2xl font-display text-dark mb-6">
                                Informações
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-gold">📱</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-dark">WhatsApp</h3>
                                        <p className="text-taupe text-sm">Atendimento rápido</p>
                                        <a
                                            href="https://wa.me/5511999999999"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gold hover:underline"
                                        >
                                            (11) 99999-9999
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-gold">✉️</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-dark">E-mail</h3>
                                        <p className="text-taupe text-sm">Resposta em até 24h</p>
                                        <a
                                            href="mailto:contato@wfsemijoias.com.br"
                                            className="text-gold hover:underline"
                                        >
                                            contato@wfsemijoias.com.br
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-gold">📍</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-dark">Endereço</h3>
                                        <p className="text-taupe text-sm">Retirada na fábrica</p>
                                        <p className="text-dark">
                                            São Paulo, SP<br />
                                            <span className="text-sm text-taupe">
                                                (Agende sua visita pelo WhatsApp)
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-gold">⏰</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-dark">Horário de Atendimento</h3>
                                        <p className="text-taupe">
                                            Segunda a Sexta: 9h às 18h<br />
                                            Sábado: 9h às 13h
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <a
                                    href="https://wa.me/5511999999999"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary w-full text-center"
                                >
                                    Falar pelo WhatsApp
                                </a>
                            </div>
                        </div>

                        {/* Formulário */}
                        <div className="bg-white border border-beige rounded-lg p-6 md:p-8">
                            <h2 className="text-2xl font-display text-dark mb-6">
                                Envie uma Mensagem
                            </h2>

                            {sent ? (
                                <div className="text-center py-12">
                                    <div className="text-5xl mb-4">✅</div>
                                    <h3 className="text-xl font-medium text-dark mb-2">
                                        Mensagem Enviada!
                                    </h3>
                                    <p className="text-taupe">
                                        Responderemos em breve pelo e-mail informado.
                                    </p>
                                    <button
                                        onClick={() => setSent(false)}
                                        className="mt-4 text-gold hover:underline"
                                    >
                                        Enviar outra mensagem
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-taupe mb-1">
                                            Nome *
                                        </label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-taupe mb-1">
                                            E-mail *
                                        </label>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-taupe mb-1">
                                            Assunto *
                                        </label>
                                        <select
                                            value={form.subject}
                                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold"
                                        >
                                            <option value="">Selecione...</option>
                                            <option value="duvida">Dúvida sobre produto</option>
                                            <option value="pedido">Meu pedido</option>
                                            <option value="troca">Troca ou devolução</option>
                                            <option value="parceria">Parceria comercial</option>
                                            <option value="outro">Outro</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-taupe mb-1">
                                            Mensagem *
                                        </label>
                                        <textarea
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            required
                                            rows={4}
                                            className="w-full px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={sending}
                                        className="btn btn-primary w-full disabled:opacity-50"
                                    >
                                        {sending ? 'Enviando...' : 'Enviar Mensagem'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
