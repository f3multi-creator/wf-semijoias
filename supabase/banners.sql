-- =====================================================
-- WF SEMIJOIAS - Tabela de Banners
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- Criar tabela de banners
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  alt VARCHAR(255) DEFAULT 'Banner WF Semijoias',
  is_active BOOLEAN DEFAULT false,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Banners ativos são públicos" ON banners 
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin pode gerenciar banners" ON banners 
  FOR ALL USING (auth.role() = 'service_role');

-- Criar bucket de storage para banners (opcional - pode usar o bucket 'products' existente)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('banners', 'banners', true);

-- =====================================================
-- INSTRUÇÕES:
-- 1. Vá ao Supabase Dashboard > SQL Editor
-- 2. Cole este código e execute
-- 3. Acesse /admin/banners no site para fazer upload das imagens
-- =====================================================
