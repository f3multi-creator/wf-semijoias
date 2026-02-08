/**
 * Script para executar migration no Supabase
 * 
 * Executa via: node --experimental-fetch supabase/execute-migration.mjs
 */

// Statements separados para execução individual
const statements = [
    // 1. Remover categoria Anéis
    `DELETE FROM categories WHERE slug = 'aneis';`,

    // 2. Renomear Colares para Cordões
    `UPDATE categories SET name = 'Cordões', slug = 'cordoes' WHERE slug = 'colares';`,

    // 3. Adicionar categoria Conjuntos
    `INSERT INTO categories (name, slug, position)
   SELECT 'Conjuntos', 'conjuntos', 5
   WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'conjuntos');`,

    // 4. Criar tabela lines
    `CREATE TABLE IF NOT EXISTS lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );`,

    // 5. Criar tabela product_lines
    `CREATE TABLE IF NOT EXISTS product_lines (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    line_id UUID NOT NULL REFERENCES lines(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, line_id)
  );`,

    // 6. Índices
    `CREATE INDEX IF NOT EXISTS idx_product_lines_product ON product_lines(product_id);`,
    `CREATE INDEX IF NOT EXISTS idx_product_lines_line ON product_lines(line_id);`,
    `CREATE INDEX IF NOT EXISTS idx_lines_slug ON lines(slug);`,
    `CREATE INDEX IF NOT EXISTS idx_lines_active ON lines(is_active);`,

    // 7. Expandir collections
    `ALTER TABLE collections ADD COLUMN IF NOT EXISTS hero_image TEXT;`,
    `ALTER TABLE collections ADD COLUMN IF NOT EXISTS short_description TEXT;`,
    `ALTER TABLE collections ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;`,
    `ALTER TABLE collections ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();`,

    // 8. RLS
    `ALTER TABLE lines ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE product_lines ENABLE ROW LEVEL SECURITY;`,

    // 9. Policies - drop first
    `DROP POLICY IF EXISTS "Linhas públicas" ON lines;`,
    `DROP POLICY IF EXISTS "Product lines públicas" ON product_lines;`,
    `DROP POLICY IF EXISTS "Admin linhas" ON lines;`,
    `DROP POLICY IF EXISTS "Admin product_lines" ON product_lines;`,

    // 10. Create policies
    `CREATE POLICY "Linhas públicas" ON lines FOR SELECT USING (is_active = true);`,
    `CREATE POLICY "Product lines públicas" ON product_lines FOR SELECT USING (true);`,
    `CREATE POLICY "Admin linhas" ON lines FOR ALL USING (auth.role() = 'service_role');`,
    `CREATE POLICY "Admin product_lines" ON product_lines FOR ALL USING (auth.role() = 'service_role');`,

    // 11. Inserir linhas iniciais
    `INSERT INTO lines (name, slug, description, position) VALUES
    ('Couro', 'couro', 'Peças em couro legítimo com acabamento artesanal', 1),
    ('Pérolas', 'perolas', 'Joias com pérolas naturais e cultivadas', 2),
    ('Cristal', 'cristal', 'Peças com cristais e pedras lapidadas', 3),
    ('Pedras Naturais', 'pedras-naturais', 'Joias com pedras brasileiras naturais', 4)
  ON CONFLICT (slug) DO NOTHING;`
];

const SUPABASE_URL = 'https://pvxowtxutzgouwcwgwdg.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2eG93dHh1dHpnb3V3Y3dnd2RnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjI4MjY3MiwiZXhwIjoyMDgxODU4NjcyfQ.A56hWHultyqz0T2Pb22WLzkU-35lvfQfQJ8H28CN7vc';

async function runMigration() {
    console.log('🚀 Iniciando migration...\n');

    for (let i = 0; i < statements.length; i++) {
        const sql = statements[i];
        const shortSql = sql.substring(0, 50).replace(/\n/g, ' ') + '...';

        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                    'apikey': SERVICE_ROLE_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sql_query: sql })
            });

            if (response.ok) {
                console.log(`✅ [${i + 1}/${statements.length}] ${shortSql}`);
            } else {
                const text = await response.text();
                console.log(`⚠️ [${i + 1}/${statements.length}] ${shortSql}`);
                console.log(`   Status: ${response.status}`);
                if (text) console.log(`   Response: ${text.substring(0, 200)}`);
            }
        } catch (err) {
            console.log(`❌ [${i + 1}/${statements.length}] Erro: ${err.message}`);
        }
    }

    console.log('\n✨ Migration concluída!');
    console.log('Verifique no Supabase: SELECT * FROM lines;');
}

runMigration();
