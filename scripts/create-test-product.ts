// Script para criar/atualizar produto de teste no Supabase
// Execute com: npx tsx scripts/create-test-product.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pvxowtxutzgouwcwgwdg.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2eG93dHh1dHpnb3V3Y3dnd2RnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjI4MjY3MiwiZXhwIjoyMDgxODU4NjcyfQ.A56hWHultyqz0T2Pb22WLzkU-35lvfQfQJ8H28CN7vc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
    console.log('🔧 Conectando ao Supabase...');

    // Verificar se produto de teste existe
    const { data: existingProduct } = await supabase
        .from('products')
        .select('id, name, price')
        .ilike('name', '%teste%')
        .limit(1)
        .single();

    if (existingProduct) {
        console.log(`📦 Produto encontrado: ${existingProduct.name} - R$${existingProduct.price}`);
        console.log('🔄 Atualizando preço para R$15.00...');

        const { error } = await supabase
            .from('products')
            .update({ price: 15.00 })
            .eq('id', existingProduct.id);

        if (error) {
            console.error('❌ Erro ao atualizar:', error.message);
        } else {
            console.log('✅ Preço atualizado para R$15.00!');
        }
    } else {
        console.log('📦 Nenhum produto de teste encontrado. Criando novo...');

        // Buscar categoria
        const { data: category } = await supabase
            .from('categories')
            .select('id')
            .limit(1)
            .single();

        const { data: newProduct, error } = await supabase
            .from('products')
            .insert({
                name: 'Produto Teste Pagamento',
                slug: 'produto-teste-pagamento',
                description: 'Produto criado para testar integração com Mercado Pago',
                price: 15.00,
                stock_quantity: 100,
                is_active: true,
                is_featured: false,
                is_new: false,
                category_id: category?.id || null,
            })
            .select()
            .single();

        if (error) {
            console.error('❌ Erro ao criar produto:', error.message);
        } else {
            console.log(`✅ Produto criado: ${newProduct?.name} - R$${newProduct?.price}`);
        }
    }

    // Listar todos os produtos
    console.log('\n📋 Produtos no banco:');
    const { data: allProducts } = await supabase
        .from('products')
        .select('id, name, price, is_active')
        .order('created_at', { ascending: false });

    allProducts?.forEach(p => {
        console.log(`  - ${p.name}: R$${p.price} (${p.is_active ? '✅ Ativo' : '❌ Inativo'})`);
    });
}

main().catch(console.error);
