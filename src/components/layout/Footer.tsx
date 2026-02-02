import Link from "next/link";
import Image from "next/image";

const WHATSAPP_NUMBER = "5527999201077";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Vim pelo site da WF Semijoias e gostaria de mais informações.")}`;

export function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        institucional: [
            { name: "Sobre Nós", href: "/sobre" },
            { name: "Contato", href: "/contato" },
            { name: "FAQ", href: "/faq" },
        ],
        ajuda: [
            { name: "Trocas e Devoluções", href: "/trocas" },
            { name: "Política de Privacidade", href: "/privacidade" },
            { name: "Termos de Uso", href: "/termos" },
        ],
        contato: [
            { name: "contato@wfsemijoias.com.br", href: "mailto:contato@wfsemijoias.com.br" },
        ],
    };

    const socialLinks = [
        {
            name: "Instagram",
            href: "https://instagram.com/wfsemijoias",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            ),
        },
        {
            name: "Facebook",
            href: "https://facebook.com/wfsemijoias",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            ),
        },
        {
            name: "Pinterest",
            href: "https://pinterest.com/wfsemijoias",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
            ),
        },
    ];

    return (
        <footer className="bg-dark text-cream">
            {/* Newsletter */}
            <div className="border-b border-charcoal">
                <div className="container py-12">
                    <div className="max-w-2xl mx-auto text-center">
                        <h3 className="font-display text-2xl md:text-3xl mb-3">
                            Receba novidades exclusivas
                        </h3>
                        <p className="text-stone mb-6">
                            Cadastre-se e ganhe 10% OFF na primeira compra
                        </p>
                        <form className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="Seu melhor e-mail"
                                className="flex-1 py-3 px-4 bg-charcoal border border-charcoal text-cream placeholder:text-stone focus:outline-none focus:border-gold transition-colors"
                                required
                            />
                            <button
                                type="submit"
                                className="btn bg-gold text-white hover:bg-gold-dark whitespace-nowrap"
                            >
                                Quero Receber
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Links */}
            <div className="container py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="block mb-4">
                            <Image
                                src="/logo-light.png"
                                alt="WF Semijoias"
                                width={140}
                                height={50}
                                className="h-12 w-auto brightness-0 invert"
                            />
                        </Link>
                        <p className="text-stone text-sm leading-relaxed mb-6">
                            Semijoias artesanais feitas à mão com pedras brasileiras premium.
                            Cada peça é única, criada com amor e dedicação.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-stone hover:text-gold transition-colors"
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Institucional */}
                    <div>
                        <h4 className="font-display text-lg mb-4">Institucional</h4>
                        <ul className="space-y-2">
                            {footerLinks.institucional.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-stone hover:text-gold transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Ajuda */}
                    <div>
                        <h4 className="font-display text-lg mb-4">Ajuda</h4>
                        <ul className="space-y-2">
                            {footerLinks.ajuda.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-stone hover:text-gold transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contato */}
                    <div>
                        <h4 className="font-display text-lg mb-4">Contato</h4>
                        <ul className="space-y-3">
                            {/* Botão WhatsApp destacado */}
                            <li>
                                <a
                                    href={WHATSAPP_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors text-sm font-medium"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Fale pelo WhatsApp
                                </a>
                            </li>
                            {footerLinks.contato.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-stone hover:text-gold transition-colors text-sm"
                                        target={link.href.startsWith("http") ? "_blank" : undefined}
                                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {/* Selos de Segurança */}
                        <div className="mt-6">
                            <p className="text-stone text-xs mb-2">Pagamento Seguro</p>
                            <div className="flex gap-2 flex-wrap">
                                <span className="px-2 py-1 bg-charcoal text-xs">PIX</span>
                                <span className="px-2 py-1 bg-charcoal text-xs">Cartão</span>
                                <span className="px-2 py-1 bg-charcoal text-xs">Boleto</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-charcoal">
                <div className="container py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-stone text-xs">
                        <p>© {currentYear} WF Semijoias. Todos os direitos reservados.</p>
                        <div className="flex gap-4">
                            <Link href="/privacidade" className="hover:text-gold transition-colors">
                                Política de Privacidade
                            </Link>
                            <Link href="/termos" className="hover:text-gold transition-colors">
                                Termos de Uso
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
