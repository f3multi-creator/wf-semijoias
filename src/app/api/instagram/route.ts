import { NextRequest, NextResponse } from "next/server";

/**
 * API para buscar posts do Instagram
 * 
 * Para configurar:
 * 
 * OPÇÃO 1: Instagram Graph API (oficial)
 * - Crie um app em developers.facebook.com
 * - Adicione Instagram Basic Display API
 * - Configure INSTAGRAM_ACCESS_TOKEN no .env
 * 
 * OPÇÃO 2: Behold.so (mais fácil)
 * - Crie conta em behold.so
 * - Conecte seu Instagram
 * - Configure BEHOLD_FEED_ID no .env
 * 
 * OPÇÃO 3: Feed manual
 * - Adicione INSTAGRAM_POSTS no .env como JSON
 */

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get("count") || "6");

    // Opção 1: Instagram Graph API
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
    if (accessToken) {
        try {
            const response = await fetch(
                `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,media_type&access_token=${accessToken}&limit=${count}`
            );

            if (response.ok) {
                const data = await response.json();
                const posts = data.data
                    ?.filter((post: any) => post.media_type !== "VIDEO")
                    ?.map((post: any) => ({
                        id: post.id,
                        permalink: post.permalink,
                        media_url: post.media_url,
                        caption: post.caption,
                    }));

                return NextResponse.json(posts || []);
            }
        } catch (error) {
            console.error("Erro ao buscar Instagram:", error);
        }
    }

    // Opção 2: Behold.so
    const beholdFeedId = process.env.BEHOLD_FEED_ID?.trim();
    if (beholdFeedId) {
        try {
            const response = await fetch(
                `https://feeds.behold.so/${beholdFeedId}`
            );

            if (response.ok) {
                const data = await response.json();
                const posts = data.slice(0, count).map((post: any) => ({
                    id: post.id,
                    permalink: post.permalink,
                    media_url: post.mediaUrl,
                    caption: post.caption,
                }));

                return NextResponse.json(posts);
            }
        } catch (error) {
            console.error("Erro ao buscar Behold:", error);
        }
    }

    // Opção 3: Posts manuais do .env
    const manualPosts = process.env.INSTAGRAM_POSTS?.trim();
    if (manualPosts) {
        try {
            const posts = JSON.parse(manualPosts);
            return NextResponse.json(posts.slice(0, count));
        } catch (error) {
            console.error("Erro ao parsear INSTAGRAM_POSTS:", error);
        }
    }

    // Nenhuma configuração encontrada
    return NextResponse.json([]);
}
