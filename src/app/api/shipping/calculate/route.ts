import { NextRequest, NextResponse } from "next/server";
import MelhorEnvio from "menv-js";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy-load Supabase client para evitar erro no build
let supabaseInstance: SupabaseClient | null = null;
function getSupabase(): SupabaseClient | null {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return null;
    }
    if (!supabaseInstance) {
        supabaseInstance = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
    }
    return supabaseInstance;
}

interface ShippingSettings {
    cep_origem: string;
    frete_gratis_ativo: boolean;
    frete_gratis_valor_minimo: number;
    peso_padrao_gramas: number;
    largura_cm: number;
    altura_cm: number;
    comprimento_cm: number;
    sandbox_ativo: boolean;
    transportadoras_ativas: string[];
    retirada_fabrica_ativo: boolean;
    retirada_fabrica_endereco?: string;
}

// Buscar configurações de frete do banco
async function getShippingSettings(): Promise<ShippingSettings> {
    const supabase = getSupabase();
    if (!supabase) {
        return getDefaultSettings();
    }

    try {
        const { data } = await supabase
            .from("shipping_settings")
            .select("*")
            .limit(1)
            .single();

        return data || getDefaultSettings();
    } catch {
        return getDefaultSettings();
    }
}

function getDefaultSettings(): ShippingSettings {
    return {
        cep_origem: process.env.MELHOR_ENVIO_CEP_ORIGEM || "01310100",
        frete_gratis_ativo: true,
        frete_gratis_valor_minimo: 299,
        peso_padrao_gramas: 100,
        largura_cm: 10,
        altura_cm: 5,
        comprimento_cm: 10,
        sandbox_ativo: false,
        transportadoras_ativas: ["correios", "jadlog"],
        retirada_fabrica_ativo: true,
        retirada_fabrica_endereco: "Colatina, ES",
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { cep, items, subtotal } = body;

        if (!cep) {
            return NextResponse.json({ error: "CEP é obrigatório" }, { status: 400 });
        }

        // Buscar configurações do banco
        const settings = await getShippingSettings();

        // Verificar frete grátis
        const freteGratis = settings.frete_gratis_ativo &&
            subtotal >= settings.frete_gratis_valor_minimo;

        // Se não tiver token do Melhor Envio, retorna valores simulados
        const token = process.env.MELHOR_ENVIO_TOKEN;
        if (!token) {
            return getSimulatedShipping(cep, freteGratis, settings.frete_gratis_valor_minimo);
        }

        // Inicializar SDK do Melhor Envio
        const menv = new MelhorEnvio(token, settings.sandbox_ativo, 30000);

        // Preparar produtos para cotação
        // Valores padrão para semijoias (pequenas e leves)
        const products = items?.length > 0
            ? items.map((item: any, index: number) => ({
                id: String(item.id || `item-${index}`),
                width: settings.largura_cm,
                height: settings.altura_cm,
                length: settings.comprimento_cm,
                weight: settings.peso_padrao_gramas / 1000, // Converter para kg
                insurance_value: item.price || 50,
                quantity: item.quantity || 1,
            }))
            : [{
                id: "default",
                width: settings.largura_cm,
                height: settings.altura_cm,
                length: settings.comprimento_cm,
                weight: settings.peso_padrao_gramas / 1000,
                insurance_value: 50,
                quantity: 1,
            }];

        // Calcular frete usando o SDK
        const result = await menv.calculateShipment({
            fromPostalCode: settings.cep_origem.replace(/\D/g, ""),
            toPostalCode: cep.replace(/\D/g, ""),
            productsOrPackageData: products,
            services: null, // null = todas as transportadoras
            ownHand: false,
            insuranceValue: subtotal || 100,
        });

        // Mapa de transportadoras para filtro
        const transportadoraMap: Record<string, string[]> = {
            "correios": ["correios", "pac", "sedex"],
            "jadlog": ["jadlog"],
            "loggi": ["loggi"],
            "azul": ["azul"],
            "latam": ["latam"],
            "jet": ["jet"],
        };

        // Filtrar transportadoras baseado nas ativas
        const transportadorasAtivas = settings.transportadoras_ativas || ["correios", "jadlog"];

        const isTransportadoraAtiva = (companyName: string, serviceName: string) => {
            const name = (companyName + " " + serviceName).toLowerCase();
            return transportadorasAtivas.some(t => {
                const keywords = transportadoraMap[t] || [t];
                return keywords.some(k => name.includes(k));
            });
        };

        // Processar resultado
        let options = (Array.isArray(result) ? result : [result])
            .filter((option: any) => option.price && !option.error)
            .filter((option: any) => isTransportadoraAtiva(
                option.company?.name || "",
                option.name || ""
            ))
            .map((option: any) => ({
                id: option.id || option.Id,
                name: option.name,
                company: option.company?.name || option.name,
                price: freteGratis && option.name?.toLowerCase().includes("pac")
                    ? 0
                    : parseFloat(option.price || option.custom_price),
                originalPrice: parseFloat(option.price || option.custom_price),
                delivery_time: option.delivery_time || option.custom_delivery_time,
                delivery_range: option.delivery_range || option.custom_delivery_range,
                freeShipping: freteGratis && option.name?.toLowerCase().includes("pac"),
            }))
            .sort((a: any, b: any) => a.price - b.price);

        // Se frete grátis ativo, adicionar opção gratuita no topo
        if (freteGratis && options.length > 0) {
            const cheapestOption = options.find((o: any) => o.originalPrice > 0);
            if (cheapestOption && !options.some((o: any) => o.price === 0)) {
                options.unshift({
                    id: "frete-gratis",
                    name: "Frete Grátis",
                    company: cheapestOption.company,
                    price: 0,
                    originalPrice: cheapestOption.originalPrice,
                    delivery_time: cheapestOption.delivery_time,
                    delivery_range: cheapestOption.delivery_range,
                    freeShipping: true,
                });
            }
        }

        // Adicionar opção "Retirar na Fábrica" se ativo
        if (settings.retirada_fabrica_ativo) {
            options.push({
                id: "retirada-fabrica",
                name: "Retirar na Fábrica",
                company: settings.retirada_fabrica_endereco || "Colatina, ES",
                price: 0,
                originalPrice: 0,
                delivery_time: 0,
                delivery_range: null,
                freeShipping: true,
            });
        }

        return NextResponse.json({
            success: true,
            simulated: false,
            freteGratisDisponivel: freteGratis,
            freteGratisValorMinimo: settings.frete_gratis_valor_minimo,
            retiradaFabricaAtivo: settings.retirada_fabrica_ativo,
            options,
        });

    } catch (error: any) {
        console.error("Erro ao calcular frete:", error);

        // Retorna erro detalhado para debug
        return NextResponse.json({
            success: false,
            error: "Erro ao calcular frete",
            errorMessage: error?.message || "Erro desconhecido",
            errorDetails: error?.response?.data || null,
        }, { status: 500 });
    }
}

// Função para retornar valores simulados quando não há token
function getSimulatedShipping(cep: string, freteGratis: boolean, valorMinimo: number) {
    // Determinar região pelo CEP
    const cepNum = parseInt(cep.replace(/\D/g, "").substring(0, 5));

    let regionPrices = { pac: 19.9, sedex: 32.9 };

    // Sudeste (mais barato)
    if (cepNum >= 1000 && cepNum <= 39999) {
        regionPrices = { pac: 19.9, sedex: 32.9 };
    }
    // Sul
    else if (cepNum >= 80000 && cepNum <= 99999) {
        regionPrices = { pac: 22.9, sedex: 38.9 };
    }
    // Centro-Oeste
    else if (cepNum >= 70000 && cepNum <= 79999) {
        regionPrices = { pac: 24.9, sedex: 42.9 };
    }
    // Nordeste
    else if (cepNum >= 40000 && cepNum <= 69999) {
        regionPrices = { pac: 29.9, sedex: 49.9 };
    }
    // Norte (mais caro)
    else {
        regionPrices = { pac: 34.9, sedex: 54.9 };
    }

    const options = [];

    // Se frete grátis, adiciona opção gratuita
    if (freteGratis) {
        options.push({
            id: "frete-gratis",
            name: "Frete Grátis",
            company: "Correios (PAC)",
            price: 0,
            originalPrice: regionPrices.pac,
            delivery_time: 12,
            delivery_range: { min: 10, max: 15 },
            freeShipping: true,
        });
    }

    // PAC
    options.push({
        id: "pac",
        name: "PAC",
        company: "Correios",
        price: freteGratis ? 0 : regionPrices.pac,
        originalPrice: regionPrices.pac,
        delivery_time: 12,
        delivery_range: { min: 10, max: 15 },
        freeShipping: freteGratis,
    });

    // SEDEX
    options.push({
        id: "sedex",
        name: "SEDEX",
        company: "Correios",
        price: regionPrices.sedex,
        delivery_time: 5,
        delivery_range: { min: 3, max: 7 },
        freeShipping: false,
    });

    return NextResponse.json({
        success: true,
        simulated: true,
        freteGratisDisponivel: freteGratis,
        freteGratisValorMinimo: valorMinimo,
        options,
    });
}
