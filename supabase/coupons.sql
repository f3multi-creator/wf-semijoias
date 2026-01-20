-- Tabela de cupons de desconto
CREATE TABLE IF NOT EXISTS coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    min_purchase DECIMAL(10,2) DEFAULT 0,
    max_uses INTEGER DEFAULT NULL,
    uses_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca por código
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_coupons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS coupons_updated_at ON coupons;
CREATE TRIGGER coupons_updated_at
    BEFORE UPDATE ON coupons
    FOR EACH ROW
    EXECUTE FUNCTION update_coupons_updated_at();

-- RLS Policy (permite acesso via service role)
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access to coupons" ON coupons
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Inserir cupom de exemplo
INSERT INTO coupons (code, discount_type, discount_value, min_purchase)
VALUES ('BEMVINDA10', 'percentage', 10, 0)
ON CONFLICT (code) DO NOTHING;
