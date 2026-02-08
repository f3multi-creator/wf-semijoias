"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart, formatPrice } from "@/store/cart";
import { WhatsAppModal } from "@/components/checkout/WhatsAppModal";

interface AppliedCoupon {
    code: string;
    discount_type: "percentage" | "fixed";
    discount_value: number;
    min_purchase: number;
}

export default function CheckoutPage() {
    const { items, getSubtotal, getShipping, getTotal, removeItem, updateQuantity } = useCart();
    const { data: session, status } = useSession();
    const router = useRouter();

    const [step, setStep] = useState<"cart" | "shipping" | "payment">("cart");
    const [isLoading, setIsLoading] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
    const [couponError, setCouponError] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);
    const [shippingCep, setShippingCep] = useState("");
    const [shippingOptions, setShippingOptions] = useState<any[]>([]);
    const [selectedShipping, setSelectedShipping] = useState<any>(null);

    // WhatsApp/Profile Logic
    const [userPhone, setUserPhone] = useState("");
    const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
    const [isProfileLoading, setIsProfileLoading] = useState(false);

    // Verificar se o usuário está autenticado e buscar perfil
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/checkout");
        } else if (status === "authenticated") {
            fetchUserProfile();
        }
    }, [status, router]);

    const fetchUserProfile = async () => {
        try {
            const response = await fetch("/api/user/profile");
            const data = await response.json();
            if (data.customer?.phone) {
                setUserPhone(data.customer.phone);
            }
        } catch (error) {
            console.error("Erro ao buscar perfil:", error);
        }
    };

    const subtotal = getSubtotal();
    const shipping = selectedShipping?.price || getShipping(subtotal);

    // Calcular desconto baseado no cupom aplicado
    const calculateDiscount = () => {
        if (!appliedCoupon) return 0;
        if (subtotal < appliedCoupon.min_purchase) return 0;

        if (appliedCoupon.discount_type === "percentage") {
            return subtotal * (appliedCoupon.discount_value / 100);
        } else {
            return Math.min(appliedCoupon.discount_value, subtotal);
        }
    };

    const discount = calculateDiscount();
    const total = subtotal + shipping - discount;

    // Calcular frete usando a API real do Melhor Envio
    const calculateShipping = async () => {
        if (shippingCep.length < 8) return;

        setIsLoading(true);
        try {
            const response = await fetch("/api/shipping/calculate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cep: shippingCep,
                    items: items.map((item) => ({
                        id: item.product.id,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                    subtotal: subtotal,
                }),
            });

            const data = await response.json();

            if (data.success && data.options) {
                setShippingOptions(data.options);
                if (data.options.length > 0 && !selectedShipping) {
                    setSelectedShipping(data.options[0]);
                }
            } else {
                setShippingOptions([
                    { id: "pac", name: "PAC", company: "Correios", price: 19.90, delivery_time: 7 },
                    { id: "sedex", name: "SEDEX", company: "Correios", price: 34.90, delivery_time: 3 },
                ]);
            }
        } catch (error) {
            setShippingOptions([
                { id: "pac", name: "PAC", company: "Correios", price: 19.90, delivery_time: 7 },
                { id: "sedex", name: "SEDEX", company: "Correios", price: 34.90, delivery_time: 3 },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // Aplicar cupom via API
    const applyCoupon = async () => {
        if (!couponCode.trim()) return;

        setCouponLoading(true);
        setCouponError("");

        try {
            const response = await fetch(`/api/admin/coupons?code=${couponCode.toUpperCase()}`);
            const data = await response.json();

            if (!response.ok) {
                setCouponError(data.error || "Cupom inválido");
                setAppliedCoupon(null);
                return;
            }

            // Verificar compra mínima
            if (data.min_purchase && subtotal < data.min_purchase) {
                setCouponError(`Compra mínima de ${formatPrice(data.min_purchase)}`);
                setAppliedCoupon(null);
                return;
            }

            setAppliedCoupon({
                code: data.code,
                discount_type: data.discount_type,
                discount_value: data.discount_value,
                min_purchase: data.min_purchase || 0,
            });
            setCouponError("");
        } catch (error) {
            setCouponError("Erro ao validar cupom");
            setAppliedCoupon(null);
        } finally {
            setCouponLoading(false);
        }
    };

    // Remover cupom
    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
        setCouponError("");
    };

    // Iniciar fluxo de pagamento (abre modal primeiro)
    const handlePaymentClick = () => {
        if (!session?.user?.email) {
            router.push("/login?callbackUrl=/checkout");
            return;
        }
        setIsWhatsAppModalOpen(true);
    };

    const handleConfirmWhatsApp = async (confirmedPhone: string) => {
        setIsProfileLoading(true);
        try {
            // Salvar telefone no banco
            const response = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: confirmedPhone })
            });

            if (!response.ok) {
                throw new Error("Erro ao salvar telefone");
            }

            setUserPhone(confirmedPhone);
            setIsWhatsAppModalOpen(false);

            // Prosseguir com pagamento
            await processPayment(confirmedPhone);
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar contato. Tente novamente.");
        } finally {
            setIsProfileLoading(false);
        }
    };

    // Processar pagamento com Mercado Pago
    const processPayment = async (phone: string) => {
        setIsLoading(true);

        try {
            // Chama a API para criar a preferência do Mercado Pago
            const response = await fetch("/api/checkout/create-preference", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map((item) => ({
                        id: item.product.id,
                        name: item.product.name,
                        quantity: item.quantity,
                        price: item.product.price,
                        image: item.product.image,
                    })),
                    shipping: selectedShipping,
                    discount,
                    customerEmail: session?.user?.email,
                    customerPhone: phone // Passar telefone para a API (precisaria atualizar a API tb se quiser usar lá)
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Erro na API:", data);
                alert(data.error || "Erro ao processar pagamento. Tente novamente.");
                return;
            }

            if (data.initPoint) {
                // Redireciona para o checkout do Mercado Pago
                window.location.href = data.initPoint;
            } else {
                console.error("Resposta sem initPoint:", data);
                alert("Erro ao criar link de pagamento. Tente novamente.");
            }
        } catch (error) {
            console.error("Erro ao criar pagamento:", error);
            alert("Erro ao processar pagamento. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    // Mostrar loading enquanto verifica autenticação
    if (status === "loading") {
        return (
            <section className="section bg-cream min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-taupe">Verificando sua conta...</p>
                </div>
            </section>
        );
    }

    if (items.length === 0) {
        return (
            <section className="section bg-cream min-h-[60vh] flex items-center">
                <div className="container text-center">
                    <div className="max-w-md mx-auto">
                        <div className="w-20 h-20 mx-auto mb-6 text-taupe">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h1 className="font-display text-3xl text-dark mb-4">
                            Seu carrinho está vazio
                        </h1>
                        <p className="text-taupe mb-8">
                            Adicione algumas peças lindas antes de finalizar sua compra!
                        </p>
                        <Link href="/" className="btn btn-primary">
                            Explorar Produtos
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="section bg-cream">
            <WhatsAppModal
                isOpen={isWhatsAppModalOpen}
                onClose={() => setIsWhatsAppModalOpen(false)}
                onConfirm={handleConfirmWhatsApp}
                initialPhone={userPhone}
                isLoading={isProfileLoading}
            />

            <div className="container">
                <h1 className="font-display text-3xl md:text-4xl text-dark mb-8">
                    Finalizar Compra
                </h1>

                {/* Progress Steps */}
                <div className="flex items-center gap-4 mb-12">
                    {["cart", "shipping", "payment"].map((s, index) => (
                        <div key={s} className="flex items-center">
                            <button
                                onClick={() => setStep(s as any)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step === s
                                    ? "bg-gold text-white"
                                    : "bg-beige text-taupe hover:bg-sand"
                                    }`}
                            >
                                {index + 1}
                            </button>
                            <span
                                className={`ml-2 text-sm hidden sm:inline ${step === s ? "text-dark" : "text-taupe"
                                    }`}
                            >
                                {s === "cart" ? "Carrinho" : s === "shipping" ? "Entrega" : "Pagamento"}
                            </span>
                            {index < 2 && (
                                <div className="w-8 sm:w-16 h-px bg-beige mx-4" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Cart Step */}
                        {step === "cart" && (
                            <div className="bg-offwhite p-6 space-y-4">
                                <h2 className="font-display text-xl text-dark mb-4">
                                    Itens do Carrinho
                                </h2>
                                {items.map((item) => (
                                    <div key={item.product.id} className="flex gap-4 p-4 bg-cream">
                                        <div className="relative w-24 h-24 flex-shrink-0 bg-beige">
                                            <Image
                                                src={item.product.image || "/placeholder-product.jpg"}
                                                alt={item.product.name}
                                                fill
                                                sizes="96px"
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Link
                                                href={`/produto/${item.product.slug}`}
                                                className="font-display text-dark hover:text-gold transition-colors"
                                            >
                                                {item.product.name}
                                            </Link>
                                            <p className="text-gold font-medium mt-1">
                                                {formatPrice(item.product.price)}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center border border-beige hover:border-gold"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center border border-beige hover:border-gold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end justify-between">
                                            <button
                                                onClick={() => removeItem(item.product.id)}
                                                className="text-taupe hover:text-red-500 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                            <p className="font-medium text-dark">
                                                {formatPrice(item.product.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setStep("shipping")}
                                    className="btn btn-primary w-full mt-4"
                                >
                                    Continuar para Entrega
                                </button>
                            </div>
                        )}

                        {/* Shipping Step */}
                        {step === "shipping" && (
                            <div className="bg-offwhite p-6">
                                <h2 className="font-display text-xl text-dark mb-6">
                                    Endereço de Entrega
                                </h2>

                                {/* CEP Calculator */}
                                <div className="mb-6">
                                    <label className="block text-sm text-taupe mb-2">
                                        Calcule o frete
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Digite seu CEP"
                                            value={shippingCep}
                                            onChange={(e) => setShippingCep(e.target.value.replace(/\D/g, "").slice(0, 8))}
                                            className="flex-1 px-4 py-3 border border-beige bg-cream focus:outline-none focus:border-gold"
                                        />
                                        <button
                                            onClick={calculateShipping}
                                            disabled={isLoading || shippingCep.length < 8}
                                            className="btn btn-outline"
                                        >
                                            {isLoading ? "..." : "Calcular"}
                                        </button>
                                    </div>
                                </div>

                                {/* Shipping Options */}
                                {shippingOptions.length > 0 && (
                                    <div className="space-y-3 mb-6">
                                        <p className="text-sm text-taupe">Opções de entrega:</p>
                                        {shippingOptions.map((option) => (
                                            <label
                                                key={option.id}
                                                className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${selectedShipping?.id === option.id
                                                    ? "border-gold bg-cream"
                                                    : "border-beige hover:border-sand"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="shipping"
                                                        checked={selectedShipping?.id === option.id}
                                                        onChange={() => setSelectedShipping(option)}
                                                        className="accent-gold"
                                                    />
                                                    <div>
                                                        <p className="text-dark">
                                                            {option.name} - {option.company}
                                                        </p>
                                                        <p className="text-taupe text-sm">
                                                            Entrega em até {option.delivery_time} dias úteis
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="font-medium text-dark">
                                                    {subtotal >= 300 && option.price <= 25
                                                        ? "Grátis"
                                                        : formatPrice(option.price)}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setStep("cart")}
                                        className="btn btn-outline"
                                    >
                                        Voltar
                                    </button>
                                    <button
                                        onClick={() => setStep("payment")}
                                        disabled={!selectedShipping}
                                        className="btn btn-primary flex-1"
                                    >
                                        Continuar para Pagamento
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Payment Step */}
                        {step === "payment" && (
                            <div className="bg-offwhite p-6">
                                <h2 className="font-display text-xl text-dark mb-6">
                                    Pagamento
                                </h2>

                                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="p-2 bg-green-100 rounded-full text-green-600">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 text-lg mb-1">
                                                Compra Garantida
                                            </h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                Sua compra é processada pelo <strong>Mercado Pago</strong>. Receba seu produto ou seu dinheiro de volta. Garantia total do Mercado Livre.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4">
                                        <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide font-medium">Formas de pagamento aceitas:</p>
                                        <div className="flex flex-wrap gap-2 items-center">
                                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-sm rounded border border-gray-200">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                PIX
                                            </span>
                                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-sm rounded border border-gray-200">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                                Cartão até 12x
                                            </span>
                                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-sm rounded border border-gray-200">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                                Boleto
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setStep("shipping")}
                                        className="btn btn-outline"
                                    >
                                        Voltar
                                    </button>
                                    <button
                                        onClick={handlePaymentClick}
                                        disabled={isLoading}
                                        className="btn btn-primary flex-1"
                                    >
                                        {isLoading
                                            ? "Processando..."
                                            : userPhone
                                                ? `Confirmar (WhatsApp) e Pagar ${formatPrice(total)}`
                                                : `Ir para Pagamento ${formatPrice(total)}`
                                        }
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-offwhite p-6 sticky top-24">
                            <h3 className="font-display text-xl text-dark mb-4">
                                Resumo do Pedido
                            </h3>

                            {/* Coupon */}
                            <div className="mb-6">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Cupom de desconto"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        disabled={!!appliedCoupon || couponLoading}
                                        className="flex-1 px-3 py-2 text-sm border border-beige bg-cream focus:outline-none focus:border-gold"
                                    />
                                    {appliedCoupon ? (
                                        <button
                                            onClick={removeCoupon}
                                            className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
                                        >
                                            Remover
                                        </button>
                                    ) : (
                                        <button
                                            onClick={applyCoupon}
                                            disabled={couponLoading || !couponCode}
                                            className="px-4 py-2 text-sm bg-dark text-cream hover:bg-charcoal transition-colors disabled:opacity-50"
                                        >
                                            {couponLoading ? "..." : "Aplicar"}
                                        </button>
                                    )}
                                </div>
                                {appliedCoupon && (
                                    <p className="text-green-600 text-xs mt-1">
                                        ✓ Cupom {appliedCoupon.code} aplicado!
                                        ({appliedCoupon.discount_type === "percentage"
                                            ? `${appliedCoupon.discount_value}%`
                                            : formatPrice(appliedCoupon.discount_value)} de desconto)
                                    </p>
                                )}
                                {couponError && (
                                    <p className="text-red-600 text-xs mt-1">
                                        {couponError}
                                    </p>
                                )}
                            </div>

                            {/* Items Summary */}
                            <div className="space-y-2 mb-4 pb-4 border-b border-beige">
                                {items.map((item) => (
                                    <div key={item.product.id} className="flex justify-between text-sm">
                                        <span className="text-taupe">
                                            {item.product.name} x{item.quantity}
                                        </span>
                                        <span className="text-dark">
                                            {formatPrice(item.product.price * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-taupe">Subtotal</span>
                                    <span className="text-dark">{formatPrice(subtotal)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-600">Desconto</span>
                                        <span className="text-green-600">-{formatPrice(discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-taupe">Frete</span>
                                    <span className={shipping === 0 ? "text-green-600" : "text-dark"}>
                                        {selectedShipping
                                            ? subtotal >= 300 && selectedShipping.price <= 25
                                                ? "Grátis"
                                                : formatPrice(selectedShipping.price)
                                            : shipping === 0
                                                ? "Grátis"
                                                : "Calcular"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between text-lg font-medium pt-4 border-t border-beige">
                                <span className="text-dark">Total</span>
                                <span className="text-dark">{formatPrice(total)}</span>
                            </div>

                            <p className="text-taupe text-xs mt-4">
                                ou 12x de {formatPrice(total / 12)} sem juros
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
