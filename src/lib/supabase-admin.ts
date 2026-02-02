import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Cliente Supabase com service_role para operações administrativas
// Usado em: webhooks, APIs que precisam bypassar RLS

let supabaseAdminInstance: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('Supabase admin: variáveis de ambiente não configuradas');
        return null;
    }

    if (!supabaseAdminInstance) {
        supabaseAdminInstance = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );
    }

    return supabaseAdminInstance;
}

// Export como Proxy para manter compatibilidade com o padrão do projeto
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
    get(_, prop) {
        const client = getSupabaseAdmin();
        if (!client) {
            throw new Error('Supabase admin não configurado');
        }
        return (client as any)[prop];
    }
});
