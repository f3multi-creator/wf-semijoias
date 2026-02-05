import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * API para buscar posts do Instagram via RapidAPI (Instagram Looter)
 * 
 * Fluxo:
 * 1. Busca user ID e foto de perfil via /profile2
 * 2. Busca posts pelo user ID via /user-feeds2
 * 3. Cache no Supabase (atualiza 1x por dia)
 * 
 * REGRA: SEMPRE pula os 3 primeiros posts (fixados)
 */

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "1188e2b871msh54a1b0c801384ccp10678fjsn1d8c17bc3109";
const RAPIDAPI_HOST = "instagram-looter2.p.rapidapi.com";
const INSTAGRAM_USERNAME = "wfsemijoias";
const CACHE_DURATION_HOURS = 24;

// Configuração: quantos posts fixados pular
const SKIP_PINNED_POSTS = 3;
const POSTS_TO_SHOW = 8;

interface InstagramPost {
    id: string;
    imageUrl: string;
    permalink: string;
    caption?: string;
}

interface InstagramData {
    posts: InstagramPost[];
    profilePicUrl: string;
    userId: string;
}

// Supabase client para cache
function getSupabaseClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) return null;
    return createClient(url, key);
}

// Verifica se o cache ainda é válido
async function getCachedData(supabase: any): Promise<InstagramData | null> {
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

        return {
            posts: data.posts || [],
            profilePicUrl: data.profile_pic_url || "",
            userId: data.user_id || ""
        };
    } catch {
        return null;
    }
}

// Salva dados no cache
async function saveCachedData(supabase: any, data: InstagramData) {
    try {
        await supabase
            .from("instagram_cache")
            .upsert({
                id: "instagram_feed",
                posts: data.posts,
                user_id: data.userId,
                profile_pic_url: data.profilePicUrl,
                updated_at: new Date().toISOString()
            });
    } catch (error) {
        console.error("Erro ao salvar cache:", error);
    }
}

// Busca dados do perfil via /profile2 (inclui user ID e foto de perfil)
async function getProfileData(username: string): Promise<{ userId: string, profilePicUrl: string } | null> {
    try {
        const response = await fetch(
            `https://${RAPIDAPI_HOST}/profile2?username=${username}`,
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

        // ID pode estar em pk ou id
        const userId = data.pk || data.id || null;

        // Foto de perfil pode estar em profile_pic_url ou hd_profile_pic_url_info.url
        const profilePicUrl = data.hd_profile_pic_url_info?.url || data.profile_pic_url || "";

        if (!userId) return null;

        return { userId, profilePicUrl };
    } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error);
        return null;
    }
}

// Busca posts pelo user ID (pulando os fixados)
async function fetchPosts(userId: string): Promise<InstagramPost[]> {
    try {
        // Buscar mais posts para poder pular os fixados
        const totalToFetch = SKIP_PINNED_POSTS + POSTS_TO_SHOW;

        const response = await fetch(
            `https://${RAPIDAPI_HOST}/user-feeds2?id=${userId}&count=${totalToFetch}`,
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

        // Navega até os edges
        const edges = responseData?.data?.user?.edge_owner_to_timeline_media?.edges || [];

        console.log(`Total de posts recebidos: ${edges.length}`);
        console.log(`Pulando ${SKIP_PINNED_POSTS} posts fixados`);

        // REGRA: SEMPRE pula os 3 primeiros posts (fixados)
        const nonPinnedEdges = edges.slice(SKIP_PINNED_POSTS);

        console.log(`Posts após pular fixados: ${nonPinnedEdges.length}`);

        const posts: InstagramPost[] = nonPinnedEdges
            .slice(0, POSTS_TO_SHOW)
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

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const forceRefresh = url.searchParams.get("refresh") === "true";

        const supabase = getSupabaseClient();

        // Tenta buscar do cache primeiro (se não forçar refresh)
        if (supabase && !forceRefresh) {
            const cached = await getCachedData(supabase);
            if (cached && cached.posts.length > 0) {
                return NextResponse.json({
                    posts: cached.posts,
                    profilePicUrl: cached.profilePicUrl,
                    source: "cache",
                    count: cached.posts.length
                });
            }
        }

        // Se não tem cache válido ou forçamos refresh, busca da API
        // Primeiro pega dados do perfil (user ID + foto)
        const profileData = await getProfileData(INSTAGRAM_USERNAME);

        if (!profileData) {
            return NextResponse.json({
                error: "Não foi possível obter dados do perfil",
                posts: [],
                profilePicUrl: ""
            }, { status: 500 });
        }

        const { userId, profilePicUrl } = profileData;

        // Depois busca os posts
        const posts = await fetchPosts(userId);

        if (posts.length > 0 && supabase) {
            // Salva no cache
            await saveCachedData(supabase, { posts, profilePicUrl, userId });
        }

        return NextResponse.json({
            posts: posts,
            profilePicUrl: profilePicUrl,
            source: forceRefresh ? "api-forced" : "api",
            count: posts.length,
            userId: userId,
            skippedPinnedPosts: SKIP_PINNED_POSTS
        });
    } catch (error: any) {
        console.error("Erro na API Instagram:", error);
        return NextResponse.json(
            { error: "Erro ao buscar posts", posts: [], profilePicUrl: "" },
            { status: 500 }
        );
    }
}
