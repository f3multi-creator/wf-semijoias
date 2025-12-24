-- =====================================================
-- WF SEMIJOIAS - Schema do Banco de Dados
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- 1. CATEGORIAS
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir categorias padrão
INSERT INTO categories (name, slug, position) VALUES
  ('Brincos', 'brincos', 1),
  ('Colares', 'colares', 2),
  ('Anéis', 'aneis', 3),
  ('Pulseiras', 'pulseiras', 4);

-- 2. COLEÇÕES
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUTOS
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  sku VARCHAR(50),
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  category_id UUID REFERENCES categories(id),
  collection_id UUID REFERENCES collections(id),
  weight_grams INTEGER,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  seo_title VARCHAR(70),
  seo_description VARCHAR(160),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. IMAGENS DOS PRODUTOS
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text VARCHAR(255),
  position INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CLIENTES
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  cpf VARCHAR(14),
  birth_date DATE,
  accepts_marketing BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ENDEREÇOS
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  label VARCHAR(50),
  street VARCHAR(255) NOT NULL,
  number VARCHAR(20) NOT NULL,
  complement VARCHAR(100),
  neighborhood VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state CHAR(2) NOT NULL,
  postal_code CHAR(9) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PEDIDOS
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL,
  customer_id UUID REFERENCES customers(id),
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  customer_phone VARCHAR(20),
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending',
  payment_status VARCHAR(20) DEFAULT 'pending',
  
  -- Pagamento (Mercado Pago)
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  external_reference VARCHAR(255),
  
  -- Valores
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  
  -- Cupom
  coupon_id UUID,
  coupon_code VARCHAR(50),
  
  -- Endereço de entrega (JSON)
  shipping_address JSONB NOT NULL,
  
  -- Frete
  shipping_method VARCHAR(100),
  tracking_code VARCHAR(100),
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ITENS DO PEDIDO
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  product_image TEXT,
  product_sku VARCHAR(50),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CUPONS
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed', 'free_shipping'
  discount_value DECIMAL(10,2) NOT NULL,
  minimum_order_value DECIMAL(10,2),
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  max_uses_per_customer INTEGER DEFAULT 1,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. USO DE CUPONS
CREATE TABLE IF NOT EXISTS coupon_uses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES coupons(id),
  order_id UUID NOT NULL REFERENCES orders(id),
  customer_id UUID REFERENCES customers(id),
  used_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_external_ref ON orders(external_reference);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS nas tabelas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura pública (produtos, categorias, coleções)
CREATE POLICY "Produtos públicos" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Imagens públicas" ON product_images FOR SELECT USING (true);
CREATE POLICY "Categorias públicas" ON categories FOR SELECT USING (true);
CREATE POLICY "Coleções públicas" ON collections FOR SELECT USING (is_active = true);
CREATE POLICY "Cupons ativos públicos" ON coupons FOR SELECT USING (is_active = true);

-- Políticas para service_role (admin) - acesso total
CREATE POLICY "Admin produtos" ON products FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin imagens" ON product_images FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin categorias" ON categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin coleções" ON collections FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin clientes" ON customers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin endereços" ON addresses FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin pedidos" ON orders FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin itens" ON order_items FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin cupons" ON coupons FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- FUNÇÃO PARA ATUALIZAR updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- PRODUTO DE TESTE (R$ 0,01)
-- =====================================================

INSERT INTO products (name, slug, description, price, stock_quantity, is_active, is_featured, category_id)
SELECT 
  'Produto Teste - NÃO COMPRAR',
  'produto-teste',
  'Produto para teste de pagamento. Valor: R$ 0,01. Não será enviado.',
  0.01,
  999,
  true,
  false,
  id
FROM categories WHERE slug = 'brincos'
LIMIT 1;

-- Inserir imagem placeholder para o produto de teste
INSERT INTO product_images (product_id, url, alt_text, is_primary)
SELECT 
  id,
  '/products/brinco-ametista-1.jpg',
  'Produto de teste',
  true
FROM products WHERE slug = 'produto-teste';

-- =====================================================
-- STORAGE BUCKET (executar separadamente se necessário)
-- =====================================================
-- No Supabase Dashboard > Storage > Create bucket:
-- Nome: products
-- Public: Yes

-- =====================================================
-- 11. CONFIGURAÇÕES DE FRETE
-- =====================================================

CREATE TABLE IF NOT EXISTS shipping_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cep_origem VARCHAR(9) DEFAULT '01310100',
  frete_gratis_ativo BOOLEAN DEFAULT true,
  frete_gratis_valor_minimo DECIMAL(10,2) DEFAULT 299.00,
  peso_padrao_gramas INTEGER DEFAULT 100,
  largura_cm INTEGER DEFAULT 10,
  altura_cm INTEGER DEFAULT 5,
  comprimento_cm INTEGER DEFAULT 10,
  transportadoras_ativas TEXT[] DEFAULT ARRAY['correios', 'jadlog'],
  sandbox_ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir configuração padrão
INSERT INTO shipping_settings (id) VALUES (gen_random_uuid());

-- RLS para shipping_settings
ALTER TABLE shipping_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública config frete" ON shipping_settings FOR SELECT USING (true);
CREATE POLICY "Admin config frete" ON shipping_settings FOR ALL USING (auth.role() = 'service_role');

-- Trigger para updated_at
CREATE TRIGGER shipping_settings_updated_at
  BEFORE UPDATE ON shipping_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

