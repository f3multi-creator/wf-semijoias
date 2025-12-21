import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
    return (
        <section className="min-h-[60vh] flex items-center py-20 bg-cream">
            <div className="container">
                <div className="max-w-lg mx-auto text-center">
                    {/* 404 */}
                    <div className="mb-8">
                        <span className="font-display text-9xl text-beige">404</span>
                    </div>

                    <h1 className="font-display text-3xl md:text-4xl text-dark mb-4">
                        Página não encontrada
                    </h1>

                    <p className="text-brown mb-8">
                        Desculpe, a página que você está procurando não existe ou foi movida.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/" className="btn btn-primary">
                            Voltar para o Início
                        </Link>
                        <Link href="/categoria/brincos" className="btn btn-outline">
                            Ver Produtos
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
