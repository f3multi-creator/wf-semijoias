import { NextResponse } from "next/server";

export async function GET() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const melhorEnvioToken = process.env.MELHOR_ENVIO_TOKEN;

    return NextResponse.json({
        // Google OAuth
        hasClientId: !!clientId,
        clientIdPrefix: clientId ? clientId.substring(0, 15) + "..." : "NOT SET",
        hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasAuthSecret: !!process.env.AUTH_SECRET,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        authTrustHost: process.env.AUTH_TRUST_HOST,
        nextauthUrl: process.env.NEXTAUTH_URL,
        // Melhor Envio
        hasMelhorEnvioToken: !!melhorEnvioToken,
        melhorEnvioTokenPrefix: melhorEnvioToken ? melhorEnvioToken.substring(0, 20) + "..." : "NOT SET",
        melhorEnvioCepOrigem: process.env.MELHOR_ENVIO_CEP_ORIGEM || "NOT SET",
        melhorEnvioSandbox: process.env.MELHOR_ENVIO_SANDBOX || "NOT SET",
    });
}
