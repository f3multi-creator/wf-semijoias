import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy de imagens do Instagram
 * Contorna problemas de CORS servindo a imagem através do nosso servidor
 * 
 * Uso: /api/instagram/image?url=URL_ENCODED_DA_IMAGEM
 */

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
        return NextResponse.json({ error: "URL não fornecida" }, { status: 400 });
    }

    try {
        // Busca a imagem do Instagram
        const response = await fetch(imageUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                "Referer": "https://www.instagram.com/",
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Falha ao buscar imagem" }, { status: response.status });
        }

        const contentType = response.headers.get("content-type") || "image/jpeg";
        const imageBuffer = await response.arrayBuffer();

        // Retorna a imagem com os headers corretos
        return new NextResponse(imageBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=86400", // Cache de 24h
                "Access-Control-Allow-Origin": "*",
            },
        });
    } catch (error: any) {
        console.error("Erro no proxy de imagem:", error);
        return NextResponse.json({ error: "Erro ao processar imagem" }, { status: 500 });
    }
}
