
import Link from "next/link";
import { MessageCircle, Sparkles } from "lucide-react";

const WHATSAPP_NUMBER = "5527999201077";

interface ProductCustomizationCardProps {
    productName: string;
}

export function ProductCustomizationCard({ productName }: ProductCustomizationCardProps) {
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Olá! Estou vendo o produto "${productName}" e gostaria de saber sobre personalização (tamanho, banho, pedras).`
    )}`;

    return (
        <div className="mt-6 p-6 bg-cream border border-beige rounded-none">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-gold/10 text-gold rounded-full shrink-0">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h3 className="font-display text-xl text-dark mb-2">
                        Sua Joia, Do Seu Jeito
                    </h3>
                    <p className="text-taupe text-sm leading-relaxed mb-4">
                        Deseja ajustar o tamanho, trocar o banho ou escolher uma pedra específica?
                        Personalize sua peça exclusivamente com nossa equipe.
                    </p>

                    <Link
                        href={whatsappUrl}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:text-brown transition-colors uppercase tracking-wider"
                    >
                        <MessageCircle size={16} />
                        Falar com Personal Stylist
                    </Link>
                </div>
            </div>
        </div>
    );
}
