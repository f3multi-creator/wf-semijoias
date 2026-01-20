// Script para verificar e criar categorias se necessário
// Execute com: npx tsx scripts/check-categories.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pvxowtxutzgouwcwgwdg.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2eG93dHh1dHpnb3V3Y3dnd2RnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjI4MjY3MiwiZXhwIjoyMDgxODU4NjcyfQ.A56hWHultyqz0T2Pb22WLzkU-35lvfQfQJ8H28CN7vc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
    console.log('🔍 Verificando categorias...\n');

    // Buscar categorias existentes
    const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .order('position');

    if (error) {
        console.error('❌ Erro ao buscar categorias:', error.message);

        // Tentar criar a tabela se não existir
        console.log('\n📦 Tentando criar categorias padrão...');
        const defaultCategories = [
            { name: 'Brincos', slug: 'brincos', position: 1 },
            { name: 'Colares', slug: 'colares', position: 2 },
            { name: 'Anéis', slug: 'aneis', position: 3 },
            { name: 'Pulseiras', slug: 'pulseiras', position: 4 },
        ];

        for (const cat of defaultCategories) {
            const { error: insertError } = await supabase
                .from('categories')
                .upsert(cat, { onConflict: 'slug' });

            if (insertError) {
                console.error(`  ❌ Erro ao criar ${cat.name}:`, insertError.message);
            } else {
                console.log(`  ✅ ${cat.name} criada/atualizada`);
            }
        }
        return;
    }

    if (!categories || categories.length === 0) {
        console.log('⚠️ Nenhuma categoria encontrada. Criando categorias padrão...\n');

        const defaultCategories = [
            { name: 'Brincos', slug: 'brincos', position: 1 },
            { name: 'Colares', slug: 'colares', position: 2 },
            { name: 'Anéis', slug: 'aneis', position: 3 },
            { name: 'Pulseiras', slug: 'pulseiras', position: 4 },
        ];

        const { error: insertError } = await supabase
            .from('categories')
            .insert(defaultCategories);

        if (insertError) {
            console.error('❌ Erro ao inserir categorias:', insertError.message);
        } else {
            console.log('✅ Categorias padrão criadas!');
        }
    } else {
        console.log(`✅ Encontradas ${categories.length} categorias:\n`);
        categories.forEach((cat, i) => {
            console.log(`  ${i + 1}. ${cat.name} (${cat.slug}) - posição ${cat.position}`);
        });
    }

    // Verificar Supabase Storage
    console.log('\n🖼️ Verificando Supabase Storage...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

    if (bucketError) {
        console.error('❌ Erro ao verificar storage:', bucketError.message);
    } else {
        const productsBucket = buckets?.find(b => b.name === 'products');
        if (productsBucket) {
            console.log('✅ Bucket "products" existe');
        } else {
            console.log('⚠️ Bucket "products" não encontrado');
            console.log('🔧 Criando bucket "products"...');

            const { error: createError } = await supabase.storage.createBucket('products', {
                public: true,
                fileSizeLimit: 5242880, // 5MB
            });

            if (createError) {
                console.error('❌ Erro ao criar bucket:', createError.message);
            } else {
                console.log('✅ Bucket "products" criado com sucesso!');
            }
        }
    }
}

main().catch(console.error);
