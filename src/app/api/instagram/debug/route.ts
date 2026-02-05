import { NextResponse } from "next/server";

/**
 * Endpoint de DEBUG para testar a API do Instagram Looter
 * Acesse: /api/instagram/debug
 */

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "1188e2b871msh54a1b0c801384ccp10678fjsn1d8c17bc3109";
const RAPIDAPI_HOST = "instagram-looter2.p.rapidapi.com";
const INSTAGRAM_USERNAME = "wfsemijoias";

export async function GET() {
    const results: any = {
        step1_getUserId: null,
        step2_getPosts: null,
        errors: []
    };

    try {
        // Step 1: Get User ID
        console.log("Buscando user ID para:", INSTAGRAM_USERNAME);

        const userIdResponse = await fetch(
            `https://${RAPIDAPI_HOST}/id?username=${INSTAGRAM_USERNAME}`,
            {
                method: "GET",
                headers: {
                    "x-rapidapi-key": RAPIDAPI_KEY,
                    "x-rapidapi-host": RAPIDAPI_HOST
                }
            }
        );

        const userIdData = await userIdResponse.json();
        results.step1_getUserId = {
            status: userIdResponse.status,
            data: userIdData
        };

        const userId = userIdData.id || userIdData.user_id || userIdData.pk;

        if (!userId) {
            results.errors.push("Não conseguiu extrair user ID");
            return NextResponse.json(results);
        }

        // Step 2: Get Posts
        console.log("Buscando posts para user ID:", userId);

        const postsResponse = await fetch(
            `https://${RAPIDAPI_HOST}/user-feeds2?id=${userId}&count=6`,
            {
                method: "GET",
                headers: {
                    "x-rapidapi-key": RAPIDAPI_KEY,
                    "x-rapidapi-host": RAPIDAPI_HOST
                }
            }
        );

        const postsData = await postsResponse.json();
        results.step2_getPosts = {
            status: postsResponse.status,
            data: postsData,
            dataType: typeof postsData,
            isArray: Array.isArray(postsData),
            keys: typeof postsData === 'object' ? Object.keys(postsData) : []
        };

        return NextResponse.json(results);
    } catch (error: any) {
        results.errors.push(error.message);
        return NextResponse.json(results, { status: 500 });
    }
}
