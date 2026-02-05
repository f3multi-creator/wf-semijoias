-- =====================================================
-- WF SEMIJOIAS - Cache do Instagram
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

CREATE TABLE IF NOT EXISTS instagram_cache (
  id TEXT PRIMARY KEY DEFAULT 'instagram_feed',
  posts JSONB,
  user_id TEXT,
  profile_pic_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adicionar coluna profile_pic_url se tabela já existir
ALTER TABLE instagram_cache ADD COLUMN IF NOT EXISTS profile_pic_url TEXT;

-- Política de acesso (leitura pública, escrita service_role)
ALTER TABLE instagram_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Cache público para leitura" ON instagram_cache 
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Apenas service_role pode atualizar" ON instagram_cache 
  FOR ALL USING (auth.role() = 'service_role');
