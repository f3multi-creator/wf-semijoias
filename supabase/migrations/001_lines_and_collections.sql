-- =====================================================
-- WF SEMIJOIAS - Migration: Sistema de Linhas e Coleções
-- Executar no Supabase SQL Editor
-- Data: 2026-02-07
-- =====================================================

-- 1. ATUALIZAR CATEGORIAS EXISTENTES
-- =====================================================

-- Remover categoria "Anéis"
DELETE FROM categories WHERE slug = 'aneis';

-- Renomear "Colares" para "Cordões" (se existir)
UPDATE categories SET name = 'Cordões', slug = 'cordoes' WHERE slug = 'colares';

-- Adicionar categoria "Conjuntos" se não existir
INSERT INTO categories (name, slug, position)
SELECT 'Conjuntos', 'conjuntos', 5
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'conjuntos');

-- =====================================================
-- 2. CRIAR TABELA DE LINHAS (MATERIAIS)
-- =====================================================

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

-- Inserir linhas iniciais
INSERT INTO lines (name, slug, description, position) VALUES
  ('Couro', 'couro', 'Peças em couro legítimo com acabamento artesanal', 1),
  ('Pérolas', 'perolas', 'Joias com pérolas naturais e cultivadas', 2),
  ('Cristal', 'cristal', 'Peças com cristais e pedras lapidadas', 3),
  ('Pedras Naturais', 'pedras-naturais', 'Joias com pedras brasileiras naturais', 4)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 3. CRIAR TABELA DE JUNÇÃO PRODUTO-LINHA (N:N)
-- =====================================================

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

-- =====================================================
-- 4. EXPANDIR TABELA DE COLEÇÕES
-- =====================================================

-- Adicionar novos campos para página de coleção
ALTER TABLE collections ADD COLUMN IF NOT EXISTS hero_image TEXT;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- =====================================================
-- 5. RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS nas novas tabelas
ALTER TABLE lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_lines ENABLE ROW LEVEL SECURITY;

-- Políticas públicas de leitura
CREATE POLICY "Linhas públicas" ON lines FOR SELECT USING (is_active = true);
CREATE POLICY "Product lines públicas" ON product_lines FOR SELECT USING (true);

-- Políticas de admin (service_role)
CREATE POLICY "Admin linhas" ON lines FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin product_lines" ON product_lines FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 6. TRIGGER PARA UPDATED_AT
-- =====================================================

CREATE TRIGGER lines_updated_at
  BEFORE UPDATE ON lines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- CONCLUÍDO!
-- Verifique se as tabelas foram criadas com:
-- SELECT * FROM lines;
-- SELECT * FROM product_lines;
-- =====================================================
