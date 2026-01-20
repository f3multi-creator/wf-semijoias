// Script para atualizar categoria Anéis → CONJUNTOS
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pvxowtxutzgouwcwgwdg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2eG93dHh1dHpnb3V3Y3dnd2RnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjI4MjY3MiwiZXhwIjoyMDgxODU4NjcyfQ.A56hWHultyqz0T2Pb22WLzkU-35lvfQfQJ8H28CN7vc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
    console.log('🔄 Atualizando categoria Anéis → CONJUNTOS...\n');

    const { data, error } = await supabase
        .from('categories')
        .update({ name: 'Conjuntos', slug: 'conjuntos' })
        .eq('slug', 'aneis')
        .select();

    if (error) {
        console.error('❌ Erro:', error.message);
    } else {
        console.log('✅ Categoria atualizada:', data);
    }

    // Listar todas as categorias
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('position');

    console.log('\n📋 Categorias atuais:');
    categories?.forEach(c => console.log(`  - ${c.name} (${c.slug})`));
}

main().catch(console.error);
