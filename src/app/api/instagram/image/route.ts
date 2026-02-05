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
        // Busca a imagem do Instagram com headers bem completos
        const response = await fetch(imageUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                "Accept-Encoding": "gzip, deflate, br",
                "Referer": "https://www.instagram.com/",
                "Origin": "https://www.instagram.com",
                "Sec-Fetch-Dest": "image",
                "Sec-Fetch-Mode": "no-cors",
                "Sec-Fetch-Site": "cross-site",
                "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": '"Windows"',
            },
        });

        if (!response.ok) {
            console.error(`Erro ao buscar imagem: ${response.status} ${response.statusText}`);
            // Retorna uma imagem placeholder em caso de erro
            return new NextResponse(null, {
                status: 302,
                headers: {
                    "Location": "https://via.placeholder.com/400x400?text=WF"
                }
            });
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
        // Retorna redirect para placeholder em caso de erro
        return new NextResponse(null, {
            status: 302,
            headers: {
                "Location": "https://via.placeholder.com/400x400?text=WF"
            }
        });
    }
}
