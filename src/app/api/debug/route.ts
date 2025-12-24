import { NextResponse } from "next/server";

export async function GET() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    
    return NextResponse.json({
        hasClientId: !!clientId,
        clientIdPrefix: clientId ? clientId.substring(0, 15) + "..." : "NOT SET",
        hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasAuthSecret: !!process.env.AUTH_SECRET,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        authTrustHost: process.env.AUTH_TRUST_HOST,
        nextauthUrl: process.env.NEXTAUTH_URL,
    });
}
