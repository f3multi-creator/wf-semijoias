// Script to execute migration via Supabase
const https = require('https');

const SUPABASE_URL = 'https://pvxowtxutzgouwcwgwdg.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2eG93dHh1dHpnb3V3Y3dnd2RnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjI4MjY3MiwiZXhwIjoyMDgxODU4NjcyfQ.A56hWHultyqz0T2Pb22WLzkU-35lvfQfQJ8H28CN7vc';

const sql = `
-- 1. ATUALIZAR CATEGORIAS EXISTENTES
DELETE FROM categories WHERE slug = 'aneis';
UPDATE categories SET name = 'Cordões', slug = 'cordoes' WHERE slug = 'colares';
INSERT INTO categories (name, slug, position)
SELECT 'Conjuntos', 'conjuntos', 5
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'conjuntos');

-- 2. CRIAR TABELA DE LINHAS (MATERIAIS)
CREATE TABLE IF NOT EXISTS lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CRIAR TABELA DE JUNÇÃO PRODUTO-LINHA (N:N)
CREATE TABLE IF NOT EXISTS product_lines (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  line_id UUID NOT NULL REFERENCES lines(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, line_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_product_lines_product ON product_lines(product_id);
CREATE INDEX IF NOT EXISTS idx_product_lines_line ON product_lines(line_id);
CREATE INDEX IF NOT EXISTS idx_lines_slug ON lines(slug);
CREATE INDEX IF NOT EXISTS idx_lines_active ON lines(is_active);

-- 4. EXPANDIR TABELA DE COLEÇÕES
ALTER TABLE collections ADD COLUMN IF NOT EXISTS hero_image TEXT;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
`;

const sql2 = `
-- 5. RLS (Row Level Security)
ALTER TABLE lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_lines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Linhas públicas" ON lines;
DROP POLICY IF EXISTS "Product lines públicas" ON product_lines;
DROP POLICY IF EXISTS "Admin linhas" ON lines;
DROP POLICY IF EXISTS "Admin product_lines" ON product_lines;

CREATE POLICY "Linhas públicas" ON lines FOR SELECT USING (is_active = true);
CREATE POLICY "Product lines públicas" ON product_lines FOR SELECT USING (true);
CREATE POLICY "Admin linhas" ON lines FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin product_lines" ON product_lines FOR ALL USING (auth.role() = 'service_role');
`;

const sql3 = `
-- Inserir linhas iniciais
INSERT INTO lines (name, slug, description, position) VALUES
  ('Couro', 'couro', 'Peças em couro legítimo com acabamento artesanal', 1),
  ('Pérolas', 'perolas', 'Joias com pérolas naturais e cultivadas', 2),
  ('Cristal', 'cristal', 'Peças com cristais e pedras lapidadas', 3),
  ('Pedras Naturais', 'pedras-naturais', 'Joias com pedras brasileiras naturais', 4)
ON CONFLICT (slug) DO NOTHING;
`;

async function executeSql(sqlQuery, name) {
    return new Promise((resolve, reject) => {
        const url = new URL('/rest/v1/rpc/exec_sql', SUPABASE_URL);

        const postData = JSON.stringify({ query: sqlQuery });

        const options = {
            hostname: url.hostname,
            port: 443,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                'apikey': SERVICE_ROLE_KEY,
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`${name}: Status ${res.statusCode}`);
                if (res.statusCode >= 400) {
                    console.log(`Response: ${data}`);
                }
                resolve(data);
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

// Use raw SQL via PostgREST
async function executeRawSql(sqlQuery, name) {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    console.log(`Executing: ${name}...`);

    try {
        // Execute via the admin API
        const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                'apikey': SERVICE_ROLE_KEY,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({ query: sqlQuery })
        });

        console.log(`${name}: ${response.status}`);
        const text = await response.text();
        if (response.status >= 400) console.log(text);
        return text;
    } catch (err) {
        console.error(`Error in ${name}:`, err.message);
    }
}

console.log('Starting migration...');
console.log('SQL to execute:');
console.log(sql);
console.log('---');
console.log('Please run this SQL directly in Supabase SQL Editor');
console.log('URL: https://supabase.com/dashboard/project/pvxowtxutzgouwcwgwdg/sql/new');
