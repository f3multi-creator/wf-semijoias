import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
    const adminCheck = await requireAdmin();
    if (!adminCheck.authorized) return adminCheck.response;

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });
        }

        // Validar tipo de arquivo
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({
                error: "Tipo de arquivo não permitido. Use: JPG, PNG, WebP ou GIF"
            }, { status: 400 });
        }

        // Validar tamanho (máx 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json({
                error: "Arquivo muito grande. Máximo: 5MB"
            }, { status: 400 });
        }

        // Gerar nome único
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

        // Converter para buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload para Supabase Storage
        const { data, error } = await supabase.storage
            .from("products")
            .upload(fileName, buffer, {
                contentType: file.type,
                cacheControl: "31536000", // Cache de 1 ano
                upsert: false,
            });

        if (error) {
            console.error("Erro no upload:", error);
            return NextResponse.json({ error: "Erro no upload" }, { status: 500 });
        }

        // Obter URL pública
        const { data: { publicUrl } } = supabase.storage
            .from("products")
            .getPublicUrl(fileName);

        return NextResponse.json({
            success: true,
            url: publicUrl,
            fileName: fileName,
        });
    } catch (error) {
        console.error("Erro no upload:", error);
        return NextResponse.json({ error: "Erro no upload" }, { status: 500 });
    }
}

// DELETE - Remover imagem do storage
export async function DELETE(request: NextRequest) {
    const adminCheck = await requireAdmin();
    if (!adminCheck.authorized) return adminCheck.response;

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const fileName = searchParams.get("fileName");

        if (!fileName) {
            return NextResponse.json({ error: "Nome do arquivo é obrigatório" }, { status: 400 });
        }

        // Validar nome do arquivo: apenas nome simples, sem path traversal
        if (fileName.includes('/') || fileName.includes('\\') || fileName.includes('..')) {
            return NextResponse.json({ error: "Nome de arquivo inválido" }, { status: 400 });
        }

        const { error } = await supabase.storage
            .from("products")
            .remove([fileName]);

        if (error) {
            console.error("Erro ao deletar:", error);
            return NextResponse.json({ error: "Erro no upload" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao deletar:", error);
        return NextResponse.json({ error: "Erro no upload" }, { status: 500 });
    }
}
