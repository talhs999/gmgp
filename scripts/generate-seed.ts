import fs from 'fs';
import path from 'path';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../src/lib/products';

function escapeSql(str: string | null | undefined): string {
  if (str === null || str === undefined) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
}

// Deterministic UUID generator based on a string seed string so relations match up perfectly
function stringToUuid(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  // Return something that looks like: 00000000-0000-4000-8000-00000000beef
  const paddedStr = str.replace(/[^a-zA-Z0-9]/g, '').padEnd(12, '0').substring(0, 12);
  return `${hex}-0000-4000-8000-${paddedStr}`;
}

async function run() {
  let sql = `-- ============================================
-- GMGP Clone - Complete Database Schema & Seed Data
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================

-- 1. Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price NUMERIC(10,2) NOT NULL,
  compare_at_price NUMERIC(10,2),
  image_url TEXT NOT NULL DEFAULT '',
  images TEXT[] DEFAULT '{}',
  badge TEXT,
  badge_color TEXT CHECK (badge_color IN ('red', 'green', 'grey')),
  in_stock BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  weight_options JSONB,
  leanness_rating INT CHECK (leanness_rating BETWEEN 1 AND 10),
  firmness_rating INT CHECK (firmness_rating BETWEEN 1 AND 10),
  richness_rating INT CHECK (richness_rating BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  suburb TEXT,
  state TEXT,
  postcode TEXT,
  is_member BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','preparing','delivered','cancelled')),
  total NUMERIC(10,2) NOT NULL,
  delivery_date DATE,
  address_snapshot JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL,
  weight_option TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Memberships
CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan TEXT DEFAULT 'monthly' CHECK (plan IN ('monthly', 'quarterly', 'annual')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  started_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);

-- ============================================
-- Row Level Security (RLS) Policies (Idempotent)
-- ============================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin insert products" ON products;
CREATE POLICY "Admin insert products" ON products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
DROP POLICY IF EXISTS "Admin update products" ON products;
CREATE POLICY "Admin update products" ON products FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
DROP POLICY IF EXISTS "Admin delete products" ON products;
CREATE POLICY "Admin delete products" ON products FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read categories" ON categories;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin manage categories" ON categories;
CREATE POLICY "Admin manage categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own profile" ON profiles;
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users update own profile" ON profiles;
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users insert own profile" ON profiles;
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Admin read all profiles" ON profiles;
CREATE POLICY "Admin read all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own orders" ON orders;
CREATE POLICY "Users read own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users create orders" ON orders;
CREATE POLICY "Users create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admin read all orders" ON orders;
CREATE POLICY "Admin read all orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
DROP POLICY IF EXISTS "Admin update order status" ON orders;
CREATE POLICY "Admin update order status" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own order items" ON order_items;
CREATE POLICY "Users read own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
);
DROP POLICY IF EXISTS "Users insert order items" ON order_items;
CREATE POLICY "Users insert order items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
);
DROP POLICY IF EXISTS "Admin read all order items" ON order_items;
CREATE POLICY "Admin read all order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own membership" ON memberships;
CREATE POLICY "Users read own membership" ON memberships FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admin manage memberships" ON memberships;
CREATE POLICY "Admin manage memberships" ON memberships FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ============================================
-- Handle new user signup trigger
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, referral_code)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    substring(MD5(NEW.id::text), 1, 8)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================
-- Seed Categories
-- ============================================
`;

  MOCK_CATEGORIES.forEach(c => {
    let _uuid = stringToUuid('cat_' + c.id);
    sql += `INSERT INTO categories (id, name, slug, image_url, sort_order) VALUES ('${_uuid}', ${escapeSql(c.name)}, ${escapeSql(c.slug)}, ${escapeSql(c.image_url)}, ${c.sort_order}) ON CONFLICT (slug) DO NOTHING;
`;
  });

  sql += `
-- ============================================
-- Seed Products
-- ============================================
`;

  MOCK_PRODUCTS.forEach(p => {
    let _prod_uuid = stringToUuid('prod_' + p.id);
    let _cat_uuid = stringToUuid('cat_' + p.category_id);
    const imagesArray = p.images && p.images.length ? `ARRAY[${p.images.map(i => escapeSql(i)).join(',')}]` : "ARRAY[]::TEXT[]";
    const tagsArray = p.tags && p.tags.length ? `ARRAY[${p.tags.map(t => escapeSql(t)).join(',')}]` : "ARRAY[]::TEXT[]";
    const weightJson = p.weight_options && p.weight_options.length ? escapeSql(JSON.stringify(p.weight_options)) : "NULL";

    sql += `INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('${_prod_uuid}', ${escapeSql(p.name)}, ${escapeSql(p.slug)}, ${escapeSql(p.description)}, '${_cat_uuid}', ${p.price}, ${p.compare_at_price || 'NULL'}, ${escapeSql(p.image_url)}, ${imagesArray}, ${escapeSql(p.badge || '')}, ${escapeSql(p.badge_color || '')}, ${p.in_stock}, ${p.is_featured}, ${p.is_best_seller}, ${tagsArray}, ${weightJson}::jsonb, ${p.leanness_rating || 'NULL'}, ${p.firmness_rating || 'NULL'}, ${p.richness_rating || 'NULL'}) ON CONFLICT (slug) DO NOTHING;
`;
  });

  sql += `
-- ============================================
-- Success! Database is ready to go.
-- ============================================
`;

  fs.writeFileSync(path.join(process.cwd(), 'supabase', 'complete_setup.sql'), sql);
  console.log("Generated complete_setup.sql with proper UUIDs!");
}

run();
