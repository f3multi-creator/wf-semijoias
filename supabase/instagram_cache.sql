-- =====================================================
-- WF SEMIJOIAS - Cache do Instagram
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

CREATE TABLE IF NOT EXISTS instagram_cache (
  id TEXT PRIMARY KEY DEFAULT 'instagram_feed',
  posts JSONB,
  user_id TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Política de acesso (leitura pública, escrita service_role)
ALTER TABLE instagram_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cache público para leitura" ON instagram_cache 
  FOR SELECT USING (true);

CREATE POLICY "Apenas service_role pode atualizar" ON instagram_cache 
  FOR ALL USING (auth.role() = 'service_role');
