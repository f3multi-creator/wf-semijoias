import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * API para buscar posts do Instagram via RapidAPI (Instagram Looter)
 * 
 * Fluxo:
 * 1. Busca user ID pelo username
 * 2. Busca posts pelo user ID
 * 3. Cache no Supabase (atualiza 1x por dia)
 */

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "1188e2b871msh54a1b0c801384ccp10678fjsn1d8c17bc3109";
const RAPIDAPI_HOST = "instagram-looter2.p.rapidapi.com";
const INSTAGRAM_USERNAME = "wfsemijoias";
const CACHE_DURATION_HOURS = 24;

interface InstagramPost {
    id: string;
    imageUrl: string;
    permalink: string;
    caption?: string;
}

// Supabase client para cache
function getSupabaseClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) return null;
    return createClient(url, key);
}

// Verifica se o cache ainda é válido
async function getCachedPosts(supabase: any): Promise<{ posts: InstagramPost[], userId: string } | null> {
    try {
        const { data, error } = await supabase
            .from("instagram_cache")
            .select("*")
            .eq("id", "instagram_feed")
            .single();

        if (error || !data) return null;

        const cacheAge = Date.now() - new Date(data.updated_at).getTime();
        const maxAge = CACHE_DURATION_HOURS * 60 * 60 * 1000;

        if (cacheAge > maxAge) return null;

        return { posts: data.posts || [], userId: data.user_id || "" };
    } catch {
        return null;
    }
}

// Salva posts no cache
async function saveCachedPosts(supabase: any, posts: InstagramPost[], userId: string) {
    try {
        await supabase
            .from("instagram_cache")
            .upsert({
                id: "instagram_feed",
                posts: posts,
                user_id: userId,
                updated_at: new Date().toISOString()
            });
    } catch (error) {
        console.error("Erro ao salvar cache:", error);
    }
}

// Busca user ID pelo username
async function getUserId(username: string): Promise<string | null> {
    try {
        const response = await fetch(
            `https://${RAPIDAPI_HOST}/id?username=${username}`,
            {
                method: "GET",
                headers: {
                    "x-rapidapi-key": RAPIDAPI_KEY,
                    "x-rapidapi-host": RAPIDAPI_HOST
                }
            }
        );

        if (!response.ok) {
            throw new Error(`RapidAPI error: ${response.status}`);
        }

        const data = await response.json();
        return data.user_id || data.id || data.pk || null;
    } catch (error) {
        console.error("Erro ao buscar user ID:", error);
        return null;
    }
}

// Busca posts pelo user ID
async function fetchPosts(userId: string): Promise<InstagramPost[]> {
    try {
        const response = await fetch(
            `https://${RAPIDAPI_HOST}/user-feeds2?id=${userId}&count=8`,
            {
                method: "GET",
                headers: {
                    "x-rapidapi-key": RAPIDAPI_KEY,
                    "x-rapidapi-host": RAPIDAPI_HOST
                }
            }
        );

        if (!response.ok) {
            throw new Error(`RapidAPI error: ${response.status}`);
        }

        const responseData = await response.json();

        // Navega até os edges corretos
        // Estrutura: data.data.user.edge_owner_to_timeline_media.edges
        const edges = responseData?.data?.user?.edge_owner_to_timeline_media?.edges || [];

        const posts: InstagramPost[] = edges
            .slice(0, 8)
            .map((edge: any, index: number) => {
                const node = edge.node;
                if (!node) return null;

                // Pega a URL da imagem
                const imageUrl = node.display_url || node.thumbnail_src || "";

                // Pega o shortcode para o permalink
                const shortcode = node.shortcode || "";

                // Pega a caption
                const captionEdges = node.edge_media_to_caption?.edges || [];
                const caption = captionEdges[0]?.node?.text || "";

                return {
                    id: node.id || `post-${index}`,
                    imageUrl: imageUrl,
                    permalink: shortcode ? `https://instagram.com/p/${shortcode}/` : `https://instagram.com/${INSTAGRAM_USERNAME}/`,
                    caption: caption
                };
            })
            .filter((post: InstagramPost | null): post is InstagramPost => post !== null && post.imageUrl !== "");

        return posts;
    } catch (error) {
        console.error("Erro ao buscar posts:", error);
        return [];
    }
}

export async function GET() {
    try {
        const supabase = getSupabaseClient();

        // Tenta buscar do cache primeiro
        if (supabase) {
            const cached = await getCachedPosts(supabase);
            if (cached && cached.posts.length > 0) {
                return NextResponse.json({
                    posts: cached.posts,
                    source: "cache",
                    count: cached.posts.length
                });
            }
        }

        // Se não tem cache válido, busca da API
        // Primeiro pega o user ID
        const userId = await getUserId(INSTAGRAM_USERNAME);

        if (!userId) {
            return NextResponse.json({
                error: "Não foi possível obter o user ID",
                posts: []
            }, { status: 500 });
        }

        // Depois busca os posts
        const posts = await fetchPosts(userId);

        if (posts.length > 0 && supabase) {
            // Salva no cache
            await saveCachedPosts(supabase, posts, userId);
        }

        return NextResponse.json({
            posts: posts,
            source: "api",
            count: posts.length,
            userId: userId
        });
    } catch (error: any) {
        console.error("Erro na API Instagram:", error);
        return NextResponse.json(
            { error: "Erro ao buscar posts", posts: [] },
            { status: 500 }
        );
    }
}
