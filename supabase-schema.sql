-- ============================================
-- PLATAFORMA MULTI-TENANT - Schema completo
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TENANTS (cada empresa/tienda)
-- ============================================
CREATE TABLE tenants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,  -- URL: /slug → tienda pública
  plan text DEFAULT 'basic' CHECK (plan IN ('basic', 'pro', 'enterprise')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- ADMINS (superadmin de cada empresa + owner)
-- ============================================
CREATE TABLE admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text DEFAULT 'admin' CHECK (role IN ('owner', 'admin')),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  -- owner tiene tenant_id NULL (ve todo)
  -- admin tiene tenant_id de su empresa
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- STORE CONFIG (configuración visual por tienda)
-- ============================================
CREATE TABLE store_config (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
  store_name text NOT NULL DEFAULT 'Mi Tienda',
  store_description text,
  logo_url text,
  favicon_url text,
  primary_color text DEFAULT '#000000',
  secondary_color text DEFAULT '#ffffff',
  accent_color text DEFAULT '#d4af37',
  background_color text DEFAULT '#ffffff',
  font_family text DEFAULT 'inter',
  hero_title text DEFAULT 'Bienvenido a nuestra tienda',
  hero_subtitle text,
  hero_image_url text,
  contact_email text,
  contact_phone text,
  address text,
  instagram_url text,
  facebook_url text,
  tiktok_url text,
  whatsapp_number text,
  currency text DEFAULT 'ARS',
  shipping_base_price decimal(10,2) DEFAULT 0,
  free_shipping_threshold decimal(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- CATEGORIES (por tenant)
-- ============================================
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  image_url text,
  is_active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, slug)
);

-- ============================================
-- PRODUCTS (por tenant)
-- ============================================
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  compare_at_price decimal(10,2),
  stock int DEFAULT 0,
  sku text,
  images text[] DEFAULT array[]::text[],
  tags text[] DEFAULT array[]::text[],
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, slug)
);

-- ============================================
-- PRODUCT VARIANTS (por producto)
-- ============================================
CREATE TABLE product_variants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  value text NOT NULL,
  stock int DEFAULT 0,
  price_modifier decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- BUYERS (compradores globales - cuenta global)
-- ============================================
CREATE TABLE buyers (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  full_name text,
  phone text,
  address text,
  city text,
  province text,
  postal_code text,
  country text DEFAULT 'Argentina',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- ORDERS (por tenant, comprador global)
-- ============================================
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  buyer_id uuid REFERENCES buyers(id) ON DELETE SET NULL,
  order_number text NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending','paid','processing','shipped','delivered','cancelled','refunded')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
  payment_method text,
  stripe_session_id text,
  subtotal decimal(10,2) NOT NULL,
  shipping_cost decimal(10,2) DEFAULT 0,
  discount decimal(10,2) DEFAULT 0,
  total decimal(10,2) NOT NULL,
  shipping_address jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, order_number)
);

-- ============================================
-- ORDER ITEMS
-- ============================================
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_image text,
  variant text,
  quantity int NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_products_tenant ON products(tenant_id);
CREATE INDEX idx_products_slug ON products(tenant_id, slug);
CREATE INDEX idx_products_featured ON products(tenant_id, is_featured);
CREATE INDEX idx_categories_tenant ON categories(tenant_id);
CREATE INDEX idx_orders_tenant ON orders(tenant_id);
CREATE INDEX idx_orders_status ON orders(tenant_id, status);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_tenants_slug ON tenants(slug);

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tenants_updated BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_store_config_updated BEFORE UPDATE ON store_config FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_buyers_updated BEFORE UPDATE ON buyers FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- RLS
-- ============================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- admins sin RLS (lo manejamos server-side con service role)
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Tienda pública: lectura libre
CREATE POLICY "public read tenants" ON tenants FOR SELECT USING (is_active = true);
CREATE POLICY "public read store_config" ON store_config FOR SELECT USING (true);
CREATE POLICY "public read active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "public read active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "public read product_variants" ON product_variants FOR SELECT USING (true);

-- Compradores: ven y editan solo su propia info
CREATE POLICY "buyers read own" ON buyers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "buyers update own" ON buyers FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "buyers delete own" ON buyers FOR DELETE USING (auth.uid() = id);
CREATE POLICY "buyers insert own" ON buyers FOR INSERT WITH CHECK (auth.uid() = id);

-- Pedidos: el comprador ve los suyos
CREATE POLICY "buyers read own orders" ON orders FOR SELECT USING (buyer_id = auth.uid());
CREATE POLICY "anyone create order" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "anyone create order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "buyers read own order items" ON order_items FOR SELECT
  USING (order_id IN (SELECT id FROM orders WHERE buyer_id = auth.uid()));
