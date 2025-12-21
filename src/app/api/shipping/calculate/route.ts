import { NextRequest, NextResponse } from "next/server";

// API do Melhor Envio para cálculo de frete
// Documentação: https://docs.melhorenvio.com.br/

const MELHOR_ENVIO_URL = process.env.MELHOR_ENVIO_SANDBOX === "true"
    ? "https://sandbox.melhorenvio.com.br/api/v2"
    : "https://melhorenvio.com.br/api/v2";

interface ShippingItem {
    id: string;
    width: number;
    height: number;
    length: number;
    weight: number;
    quantity: number;
}

interface ShippingRequest {
    from: { postal_code: string };
    to: { postal_code: string };
    products: ShippingItem[];
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { cep, items } = body;

        if (!cep) {
            return NextResponse.json({ error: "CEP é obrigatório" }, { status: 400 });
        }

        // CEP de origem (seu armazém/loja)
        const cepOrigem = process.env.MELHOR_ENVIO_CEP_ORIGEM || "01310100";

        // Se não tiver token do Melhor Envio, retorna valores simulados
        if (!process.env.MELHOR_ENVIO_TOKEN) {
            return getSimulatedShipping(cep);
        }

        // Preparar produtos para cotação
        // Valores padrão para semijoias (pequenas e leves)
        const products: ShippingItem[] = items?.map((item: any, index: number) => ({
            id: item.id || `item-${index}`,
            width: 10, // cm
            height: 5,  // cm
            length: 10, // cm
            weight: 0.1, // kg (100g por item)
            quantity: item.quantity || 1,
        })) || [{
            id: "default",
            width: 10,
            height: 5,
            length: 10,
            weight: 0.1,
            quantity: 1,
        }];

        const payload: ShippingRequest = {
            from: { postal_code: cepOrigem.replace(/\D/g, "") },
            to: { postal_code: cep.replace(/\D/g, "") },
            products,
        };

        const response = await fetch(`${MELHOR_ENVIO_URL}/me/shipment/calculate`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
                "User-Agent": "WF Semijoias (contato@wfsemijoias.com.br)",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error("Erro Melhor Envio:", await response.text());
            return getSimulatedShipping(cep);
        }

        const data = await response.json();

        // Filtrar apenas opções com preço (algumas podem não atender a rota)
        const options = data
            .filter((option: any) => option.price && !option.error)
            .map((option: any) => ({
                id: option.id,
                name: option.name,
                company: option.company?.name || option.name,
                price: parseFloat(option.price),
                delivery_time: option.delivery_time,
                delivery_range: option.delivery_range,
            }))
            .sort((a: any, b: any) => a.price - b.price);

        return NextResponse.json({
            success: true,
            options,
        });

    } catch (error) {
        console.error("Erro ao calcular frete:", error);
        return NextResponse.json(
            { error: "Erro ao calcular frete. Tente novamente." },
            { status: 500 }
        );
    }
}

// Frete simulado quando não tem token do Melhor Envio
function getSimulatedShipping(cep: string) {
    const cepNum = parseInt(cep.replace(/\D/g, ""));

    // Determinar região pelo CEP (simplificado)
    let region = "outros";
    if (cepNum >= 1000000 && cepNum <= 19999999) region = "sp";
    else if (cepNum >= 20000000 && cepNum <= 28999999) region = "rj";
    else if (cepNum >= 30000000 && cepNum <= 39999999) region = "mg";
    else if (cepNum >= 80000000 && cepNum <= 87999999) region = "pr";
    else if (cepNum >= 88000000 && cepNum <= 89999999) region = "sc";
    else if (cepNum >= 90000000 && cepNum <= 99999999) region = "rs";

    // Preços simulados por região
    const prices: Record<string, { sedex: number; pac: number; days: number }> = {
        sp: { sedex: 15.90, pac: 12.90, days: 3 },
        rj: { sedex: 18.90, pac: 14.90, days: 4 },
        mg: { sedex: 18.90, pac: 14.90, days: 4 },
        pr: { sedex: 22.90, pac: 16.90, days: 5 },
        sc: { sedex: 24.90, pac: 18.90, days: 6 },
        rs: { sedex: 26.90, pac: 19.90, days: 7 },
        outros: { sedex: 32.90, pac: 24.90, days: 10 },
    };

    const regionPrices = prices[region];

    return NextResponse.json({
        success: true,
        simulated: true,
        options: [
            {
                id: "sedex",
                name: "SEDEX",
                company: "Correios",
                price: regionPrices.sedex,
                delivery_time: regionPrices.days,
                delivery_range: {
                    min: regionPrices.days,
                    max: regionPrices.days + 2,
                },
            },
            {
                id: "pac",
                name: "PAC",
                company: "Correios",
                price: regionPrices.pac,
                delivery_time: regionPrices.days + 5,
                delivery_range: {
                    min: regionPrices.days + 3,
                    max: regionPrices.days + 7,
                },
            },
        ],
    });
}
