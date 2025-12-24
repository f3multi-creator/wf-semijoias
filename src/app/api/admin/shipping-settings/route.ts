import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy-load Supabase client para evitar erro no build
let supabaseAdminInstance: SupabaseClient | null = null;
function getSupabaseAdmin(): SupabaseClient | null {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return null;
    }
    if (!supabaseAdminInstance) {
        supabaseAdminInstance = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );
    }
    return supabaseAdminInstance;
}

export async function GET() {
    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const { data, error } = await supabaseAdmin
            .from("shipping_settings")
            .select("*")
            .limit(1)
            .single();

        if (error) {
            // Se não existe, retorna valores padrão
            if (error.code === "PGRST116") {
                return NextResponse.json({
                    cep_origem: "01310100",
                    frete_gratis_ativo: true,
                    frete_gratis_valor_minimo: 299,
                    peso_padrao_gramas: 100,
                    largura_cm: 10,
                    altura_cm: 5,
                    comprimento_cm: 10,
                    transportadoras_ativas: ["correios", "jadlog"],
                    sandbox_ativo: true,
                });
            }
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Erro ao buscar configurações:", error);
        return NextResponse.json(
            { error: "Erro ao buscar configurações" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const body = await request.json();

        // Primeiro, verifica se existe um registro
        const { data: existing } = await supabaseAdmin
            .from("shipping_settings")
            .select("id")
            .limit(1)
            .single();

        let result;

        if (existing) {
            // Atualiza registro existente
            result = await supabaseAdmin
                .from("shipping_settings")
                .update({
                    cep_origem: body.cep_origem,
                    frete_gratis_ativo: body.frete_gratis_ativo,
                    frete_gratis_valor_minimo: body.frete_gratis_valor_minimo,
                    peso_padrao_gramas: body.peso_padrao_gramas,
                    largura_cm: body.largura_cm,
                    altura_cm: body.altura_cm,
                    comprimento_cm: body.comprimento_cm,
                    transportadoras_ativas: body.transportadoras_ativas,
                    sandbox_ativo: body.sandbox_ativo,
                })
                .eq("id", existing.id)
                .select()
                .single();
        } else {
            // Cria novo registro
            result = await supabaseAdmin
                .from("shipping_settings")
                .insert({
                    cep_origem: body.cep_origem,
                    frete_gratis_ativo: body.frete_gratis_ativo,
                    frete_gratis_valor_minimo: body.frete_gratis_valor_minimo,
                    peso_padrao_gramas: body.peso_padrao_gramas,
                    largura_cm: body.largura_cm,
                    altura_cm: body.altura_cm,
                    comprimento_cm: body.comprimento_cm,
                    transportadoras_ativas: body.transportadoras_ativas,
                    sandbox_ativo: body.sandbox_ativo,
                })
                .select()
                .single();
        }

        if (result.error) {
            throw result.error;
        }

        return NextResponse.json(result.data);
    } catch (error) {
        console.error("Erro ao salvar configurações:", error);
        return NextResponse.json(
            { error: "Erro ao salvar configurações" },
            { status: 500 }
        );
    }
}
