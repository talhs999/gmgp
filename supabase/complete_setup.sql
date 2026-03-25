-- ============================================
-- GMGP Clone - Complete Database Schema & Seed Data
-- ============================================

-- TABLES AND POLICIES
-- ============================================
-- GMGP Clone - Supabase Database Schema
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
-- Row Level Security (RLS) Policies
-- ============================================

-- Products: read publicly, write admin only
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin insert products" ON products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admin update products" ON products FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admin delete products" ON products FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Categories: public read
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin manage categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Profiles: user can read/update own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admin read all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Orders: user sees own orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin read all orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admin update order status" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Order Items: tied to orders
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Users insert order items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Admin read all order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Memberships
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own membership" ON memberships FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin manage memberships" ON memberships FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ============================================
-- Auto-create profile on new user signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, referral_code)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    substring(MD5(NEW.id::text), 1, 8)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================
-- Make yourself admin (run after you sign up!)
-- Replace 'your@email.com' with your actual email
-- ============================================
-- UPDATE profiles 
-- SET is_admin = true 
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');


-- ============================================
-- Seed Categories
-- ============================================
INSERT INTO categories (id, name, slug, image_url, sort_order) VALUES ('02abc2ed-1111-4000-8000-000000000001', 'Beef', 'beef', NULL, 1) ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (id, name, slug, image_url, sort_order) VALUES ('02b04093-1111-4000-8000-000000000002', 'Lamb', 'lamb', NULL, 2) ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (id, name, slug, image_url, sort_order) VALUES ('02b24741-1111-4000-8000-000000000003', 'Pork', 'pork', NULL, 3) ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (id, name, slug, image_url, sort_order) VALUES ('0c4e1e4c-1111-4000-8000-000000000004', 'Chicken', 'chicken', NULL, 4) ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (id, name, slug, image_url, sort_order) VALUES ('211e5048-1111-4000-8000-000000000005', 'BBQ Packs', 'bbq', NULL, 5) ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (id, name, slug, image_url, sort_order) VALUES ('53f2c110-1111-4000-8000-000000000006', 'Wagyu', 'wagyu', NULL, 6) ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (id, name, slug, image_url, sort_order) VALUES ('616c0af7-1111-4000-8000-000000000007', 'Sausages', 'sausages', NULL, 7) ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (id, name, slug, image_url, sort_order) VALUES ('11e88ccb-1111-4000-8000-000000000008', 'Burgers', 'burgers', NULL, 8) ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (id, name, slug, image_url, sort_order) VALUES ('0b41986c-1111-4000-8000-000000000009', 'Marinated', 'marinated', NULL, 9) ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (id, name, slug, image_url, sort_order) VALUES ('531f7055-1111-4000-8000-000000000010', 'Halal', 'halal', NULL, 10) ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (id, name, slug, image_url, sort_order) VALUES ('5314e79a-1111-4000-8000-000000000011', 'Gift Packs', 'gifts', NULL, 11) ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Seed Products
-- ============================================
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('4531a9fd-a840-4892-a6a9-a280bff684bb', 'Wagyu Ribeye Steak MB5+', 'wagyu-ribeye-mb5', 'Our flagship Wagyu ribeye, marbled to perfection. Melt-in-your-mouth tenderness with rich, buttery flavour that sets the gold standard for premium beef.', '02abc2ed-1111-4000-8000-000000000001', 89.99, 119.99, 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80', ARRAY['https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80'], 'ALL-TIME FAVOURITE', 'red', true, true, true, ARRAY['wagyu','steak','beef','premium'], '[{"label":"300g","price":89.99},{"label":"500g","price":139.99},{"label":"1kg","price":259.99}]'::jsonb, 3, 4, 9) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('17150375-2b0c-4e19-ace2-bd597678440f', 'Black Angus Tenderloin Fillet', 'angus-tenderloin', 'The most tender cut of Black Angus beef. Lean, delicate, and perfect for a special occasion dinner.', '02abc2ed-1111-4000-8000-000000000001', 64.99, NULL, 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&q=80', ARRAY[]::TEXT[], 'NEW', 'green', true, true, false, ARRAY['angus','steak','beef','tenderloin'], '[{"label":"250g","price":64.99},{"label":"500g","price":119.99}]'::jsonb, 8, 6, 6) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('63366b9a-03f5-47d5-b745-5e847e0843ae', 'Premium Beef Mince 5-Star', 'beef-mince-5-star', 'Freshly ground premium beef mince from Australian grass-fed cattle. Perfect for burgers, bolognese, and meatballs.', '02abc2ed-1111-4000-8000-000000000001', 18.99, 24.99, 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=800&q=80', ARRAY[]::TEXT[], 'BEST VALUE', 'green', true, false, true, ARRAY['mince','beef','family'], '[{"label":"500g","price":18.99},{"label":"1kg","price":35.99},{"label":"2kg","price":64.99}]'::jsonb, 5, 5, 6) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('b2febeb4-139a-4208-9103-55793f12c124', 'Beef Short Ribs (Korean Style)', 'beef-short-ribs', 'Cut thin flanken-style for fast grilling. Marinate and grill for the ultimate Korean BBQ experience at home.', '02abc2ed-1111-4000-8000-000000000001', 34.99, NULL, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80', ARRAY[]::TEXT[], 'BBQ FAVOURITE', 'red', true, true, true, ARRAY['ribs','beef','bbq','korean'], '[{"label":"500g","price":34.99},{"label":"1kg","price":64.99}]'::jsonb, 3, 5, 8) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('168ccdb1-9577-4b0b-a09d-ca053c4e68a2', 'T-Bone Steak 500g', 't-bone-steak', 'Classic T-bone from premium grain-fed beef. Two steaks in one — tenderloin and sirloin separated by the iconic T-shaped bone.', '02abc2ed-1111-4000-8000-000000000001', 42.99, 54.99, 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80', ARRAY[]::TEXT[], NULL, NULL, true, false, true, ARRAY['t-bone','steak','beef'], '[{"label":"500g","price":42.99},{"label":"700g","price":57.99}]'::jsonb, 5, 6, 7) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('eaa8852d-164d-47b4-8137-c77f109b0b7d', 'Lamb Shoulder Chops Pack', 'lamb-shoulder-chops', 'Thick-cut lamb shoulder chops with beautiful marbling. Ideal for slow cooking or BBQ grilling to achieve fork-tender results.', '02b04093-1111-4000-8000-000000000002', 29.99, NULL, 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80', ARRAY[]::TEXT[], 'ALL-TIME FAVOURITE', 'red', true, true, true, ARRAY['lamb','chops','bbq'], '[{"label":"500g","price":29.99},{"label":"1kg","price":54.99}]'::jsonb, 4, 6, 7) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('2e9acdef-7646-4847-898a-461f6ca21a46', 'Lamb Rack – French Trimmed', 'lamb-rack-french', 'Elegantly French-trimmed lamb rack for a restaurant-quality presentation. Season and roast for the ultimate dinner party centrepiece.', '02b04093-1111-4000-8000-000000000002', 54.99, 69.99, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', ARRAY[]::TEXT[], 'PREMIUM', 'red', true, true, false, ARRAY['lamb','rack','premium','special-occasion'], '[{"label":"600g","price":54.99},{"label":"1.2kg","price":99.99}]'::jsonb, 5, 6, 7) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('12c1ba9d-7c51-4eec-b504-4ffcc982bb88', 'Lamb Leg Bone-In', 'lamb-leg-bone-in', 'Full bone-in lamb leg, perfect for Sunday roasts. Slow-roast with rosemary, garlic and olive oil for unforgettable flavour.', '02b04093-1111-4000-8000-000000000002', 39.99, NULL, 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&q=80', ARRAY[]::TEXT[], 'FAMILY PACK', 'green', true, false, false, ARRAY['lamb','leg','roast','family'], '[{"label":"1.5kg","price":39.99},{"label":"2.5kg","price":59.99}]'::jsonb, 5, 5, 7) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('a6e1646a-054e-4adc-a88c-f52385f1e848', 'Pork Belly Strips', 'pork-belly-strips', 'Thick-cut pork belly strips with gorgeous fat layers. BBQ low and slow for crispy skin and melt-in-the-mouth meat.', '02b24741-1111-4000-8000-000000000003', 22.99, NULL, 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80', ARRAY[]::TEXT[], 'BBQ MUST-HAVE', 'red', true, true, true, ARRAY['pork','belly','bbq'], '[{"label":"500g","price":22.99},{"label":"1kg","price":39.99}]'::jsonb, 2, 5, 9) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('af302bbb-840a-4279-8a85-1d59353a4272', 'Pork Spare Ribs Full Rack', 'pork-spare-ribs', 'A full rack of meaty pork spare ribs. Low-and-slow BBQ heaven with a smoky glaze.', '02b24741-1111-4000-8000-000000000003', 32.99, 44.99, 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80', ARRAY[]::TEXT[], NULL, NULL, true, false, true, ARRAY['pork','ribs','bbq'], '[{"label":"1kg","price":32.99},{"label":"1.5kg","price":44.99}]'::jsonb, 3, 5, 8) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('eb25faf2-3e9a-44e6-9d04-37ddc5237ebd', 'Pork Neck Collar Steak', 'pork-neck-collar', 'The secret Thai BBQ cut — pork neck with beautiful fat marbling. Grill hot and fast for incredible results.', '02b24741-1111-4000-8000-000000000003', 19.99, NULL, 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=800&q=80', ARRAY[]::TEXT[], 'NEW', 'green', true, false, false, ARRAY['pork','collar','bbq'], '[{"label":"500g","price":19.99}]'::jsonb, 3, 6, 8) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('b3dfc03b-2778-4797-98ba-e0ae6c5e7ddc', 'Chicken Maryland Pack', 'chicken-maryland', 'Generous chicken maryland pieces (thigh + drumstick). Perfect for roasting, grilling, or slow cooking.', '0c4e1e4c-1111-4000-8000-000000000004', 16.99, NULL, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c7?w=800&q=80', ARRAY[]::TEXT[], 'FAMILY PACK', 'green', true, false, true, ARRAY['chicken','maryland','family'], '[{"label":"1kg","price":16.99},{"label":"2kg","price":29.99}]'::jsonb, 7, 6, 5) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('48cdd65c-d6b4-4f30-a5c4-3981a63d728e', 'Chicken Thigh Fillets Skinless', 'chicken-thigh-skinless', 'Tender, juicy skinless chicken thigh fillets — the versatile protein for everyday cooking.', '0c4e1e4c-1111-4000-8000-000000000004', 14.99, NULL, 'https://images.unsplash.com/photo-1604908177453-7462950a6a3b?w=800&q=80', ARRAY[]::TEXT[], NULL, NULL, true, false, true, ARRAY['chicken','thigh','skinless'], '[{"label":"500g","price":14.99},{"label":"1kg","price":27.99}]'::jsonb, 7, 7, 5) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('2e6ab005-03b8-4d42-aa4f-a5f03f3eb636', 'Whole Free Range Chicken', 'whole-chicken', 'Premium free-range whole chicken from Australian farms. Slow roast for crispy skin and flavourful, juicy meat.', '0c4e1e4c-1111-4000-8000-000000000004', 21.99, NULL, 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800&q=80', ARRAY[]::TEXT[], 'FREE RANGE', 'green', true, false, false, ARRAY['chicken','whole','free-range'], '[{"label":"1.4kg","price":21.99},{"label":"1.8kg","price":27.99}]'::jsonb, 7, 7, 5) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('97d817ab-e615-4b27-8fef-3b924d105e5f', 'Ultimate BBQ Party Pack', 'ultimate-bbq-pack', 'The perfect pack for your next gathering. Includes beef burgers, lamb chops, chicken wings, pork ribs, and snags — everything you need for an epic BBQ.', '211e5048-1111-4000-8000-000000000005', 79.99, 109.99, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80', ARRAY[]::TEXT[], 'BEST SELLER', 'red', true, true, true, ARRAY['bbq','pack','party','value'], '[{"label":"3kg","price":79.99},{"label":"5kg","price":119.99}]'::jsonb, 5, 5, 7) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('ef3a2f15-3d39-4574-9da2-18dc09d5e309', 'Weekend BBQ Essentials Pack', 'weekend-bbq-pack', 'A perfectly curated weekend BBQ pack for 4-6 people. Includes 4 rump steaks, 6 lamb cutlets, 1kg chicken wings, and 500g beef sausages.', '211e5048-1111-4000-8000-000000000005', 54.99, 74.99, 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800&q=80', ARRAY[]::TEXT[], 'ALL-TIME FAVOURITE', 'red', true, true, true, ARRAY['bbq','pack','weekend','steak'], '[{"label":"2.5kg","price":54.99}]'::jsonb, 5, 5, 7) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('f9c71389-47dc-4418-bdb9-fd9d47c468b8', 'Family Grill Pack x8', 'family-grill-pack', 'Feed the whole family with our value grill pack — 8 pieces of various cuts, all vacuum-sealed fresh.', '211e5048-1111-4000-8000-000000000005', 44.99, 59.99, 'https://images.unsplash.com/photo-1565299715199-866c917206bb?w=800&q=80', ARRAY[]::TEXT[], 'FAMILY VALUE', 'green', true, false, false, ARRAY['bbq','family','grill','value'], '[{"label":"2kg","price":44.99}]'::jsonb, 5, 5, 6) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('29be15d3-81c0-4160-a775-fef4eb6ba863', 'Wagyu Striploin MB9 200g', 'wagyu-striploin-mb9', 'Extremely high marble score of 9. Intensely rich, buttery, and utterly extraordinary. A once-in-a-while indulgence.', '53f2c110-1111-4000-8000-000000000006', 129.99, 169.99, 'https://images.unsplash.com/photo-1588347819613-eb49a508dedd?w=800&q=80', ARRAY[]::TEXT[], 'LUXURY', 'red', true, true, false, ARRAY['wagyu','striploin','luxury','steak'], '[{"label":"200g","price":129.99},{"label":"400g","price":249.99}]'::jsonb, 1, 4, 10) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('ba727f46-7174-43b2-bfdf-f80c726834ac', 'Wagyu Flat Iron Steak MB5', 'wagyu-flat-iron', 'The value cut of Wagyu — incredible marbling and tenderness at a more accessible price point.', '53f2c110-1111-4000-8000-000000000006', 59.99, NULL, 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=800&q=80', ARRAY[]::TEXT[], 'NEW', 'green', true, true, false, ARRAY['wagyu','flat-iron','steak'], '[{"label":"300g","price":59.99},{"label":"500g","price":94.99}]'::jsonb, 3, 5, 9) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('98ad360f-6950-45f6-ace2-d4d42a4b6392', 'Angus Beef Sausages 500g', 'angus-beef-sausages', 'Thick-skin beef sausages made fresh from pure Black Angus mince. No fillers, no nasties.', '616c0af7-1111-4000-8000-000000000007', 12.99, NULL, 'https://images.unsplash.com/photo-1548366086-7f1b76106622?w=800&q=80', ARRAY[]::TEXT[], 'ALL-TIME FAVOURITE', 'red', true, false, true, ARRAY['sausages','beef','snags','bbq'], '[{"label":"500g","price":12.99},{"label":"1kg","price":22.99}]'::jsonb, 5, 5, 7) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('b87b4cde-0c25-4217-9a47-f1d0f54f4639', 'Lamb Merguez Sausages', 'lamb-merguez', 'Spiced North African-style lamb sausages. Fragrant with cumin, coriander, and harissa. Incredible on the grill.', '616c0af7-1111-4000-8000-000000000007', 14.99, NULL, 'https://images.unsplash.com/photo-1515516969-d4008cc6241a?w=800&q=80', ARRAY[]::TEXT[], 'SPECIALTY', 'green', true, false, false, ARRAY['lamb','sausages','merguez','specialty'], '[{"label":"500g","price":14.99}]'::jsonb, 5, 5, 7) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('1a3af6f8-cabc-43c1-9d5a-caf077944c52', 'Wagyu Beef Burger Patties 4-Pack', 'wagyu-burger-patties', 'Hand-formed Wagyu beef patties — 150g each. Just season with salt and pepper and cook for the best burgers of your life.', '11e88ccb-1111-4000-8000-000000000008', 29.99, NULL, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', ARRAY[]::TEXT[], 'MUST TRY', 'red', true, true, true, ARRAY['wagyu','burger','patties'], '[{"label":"4-pack 600g","price":29.99},{"label":"8-pack 1.2kg","price":54.99}]'::jsonb, 4, 6, 8) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('bc341d9c-73b2-41cf-86c2-e9a95ed91a18', 'Smash Burger Patties 6-Pack', 'smash-burger-patties', 'Thin, smash-ready beef patties for the perfect crispy-edged smash burgers. 80g each — smash and stack!', '11e88ccb-1111-4000-8000-000000000008', 19.99, NULL, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80', ARRAY[]::TEXT[], 'TRENDING', 'green', true, false, true, ARRAY['burger','smash','patties'], '[{"label":"6-pack","price":19.99}]'::jsonb, 4, 6, 7) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('7bd3505a-5d47-4e2f-8151-3789826266ad', 'Greek Lemon-Herb Lamb Cutlets', 'greek-lamb-cutlets-marinated', 'Tender lamb cutlets, marinated overnight in lemon, garlic, oregano, and olive oil. Ready to grill in minutes.', '0b41986c-1111-4000-8000-000000000009', 32.99, NULL, 'https://images.unsplash.com/photo-1603048675614-1def26ee46a2?w=800&q=80', ARRAY[]::TEXT[], 'READY TO COOK', 'green', true, false, false, ARRAY['lamb','marinated','greek','cutlets'], '[{"label":"500g","price":32.99}]'::jsonb, 5, 6, 6) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('255a0ff4-1a2c-40b0-bb03-0266d9f95c29', 'Teriyaki Chicken Wings 1kg', 'teriyaki-chicken-wings', 'Succulent chicken wings marinated in our house-made teriyaki sauce. Grill or oven bake for sticky, caramelised perfection.', '0b41986c-1111-4000-8000-000000000009', 19.99, NULL, 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&q=80', ARRAY[]::TEXT[], 'CROWD FAVOURITE', 'red', true, false, true, ARRAY['chicken','wings','teriyaki','marinated'], '[{"label":"1kg","price":19.99},{"label":"2kg","price":35.99}]'::jsonb, 6, 6, 6) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('49728167-28d7-4c6f-af36-6c524f8f172b', 'Halal Beef Shawarma Pack', 'halal-beef-shawarma', 'Thinly sliced, pre-marinated halal beef shawarma strips. Authentic Middle Eastern spice blend. Ready to cook.', '531f7055-1111-4000-8000-000000000010', 24.99, NULL, 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80', ARRAY[]::TEXT[], '✅ HALAL', 'green', true, true, true, ARRAY['halal','beef','shawarma'], '[{"label":"500g","price":24.99},{"label":"1kg","price":44.99}]'::jsonb, 6, 6, 6) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('630e1700-bfff-4db4-b006-8fcfa878f4a1', 'Halal Lamb Kofta Mix 500g', 'halal-lamb-kofta', 'Pre-seasoned halal lamb kofta mix. Shape onto skewers and grill for the perfect Middle Eastern feast.', '531f7055-1111-4000-8000-000000000010', 18.99, NULL, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80', ARRAY[]::TEXT[], '✅ HALAL', 'green', true, false, false, ARRAY['halal','lamb','kofta','mince'], '[{"label":"500g","price":18.99}]'::jsonb, 5, 5, 7) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('89cd3bcd-5a56-4af1-bd92-87f9fe80954e', 'The Steak Lover Gift Box', 'steak-lover-gift-box', 'The ultimate gift for meat lovers. Includes 2x Wagyu Ribeye, 2x Angus Tenderloin, and 2x Premium Sirloin — all presented in premium vacuum-sealed packaging.', '5314e79a-1111-4000-8000-000000000011', 149.99, 199.99, 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&q=80', ARRAY[]::TEXT[], 'GIFT READY', 'red', true, true, false, ARRAY['gift','steak','wagyu','premium'], '[{"label":"1.5kg","price":149.99}]'::jsonb, 4, 5, 9) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('b5da520f-3f77-4e05-9a92-f384a0da16ca', 'Beef Cheeks Slow Braise Pack', 'beef-cheeks', 'The ultimate slow-cook cut. Beef cheeks become impossibly tender and gelatinous after a long braise in red wine.', '02abc2ed-1111-4000-8000-000000000001', 27.99, NULL, 'https://images.unsplash.com/photo-1611599537845-1c7aca0091c0?w=800&q=80', ARRAY[]::TEXT[], 'SLOW COOK', 'green', true, false, false, ARRAY['beef','cheeks','slow-cook'], '[{"label":"500g","price":27.99},{"label":"1kg","price":49.99}]'::jsonb, 4, 3, 9) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('781df6df-4ed2-4247-af31-187d6c89c872', 'Premium Rump Steak 400g', 'rump-steak-400g', 'Classic Aussie favourite — a thick-cut rump steak with bold beef flavour. Great value without compromising on taste.', '02abc2ed-1111-4000-8000-000000000001', 24.99, 31.99, 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80', ARRAY[]::TEXT[], NULL, NULL, true, false, true, ARRAY['rump','steak','beef','value'], '[{"label":"400g","price":24.99},{"label":"600g","price":35.99}]'::jsonb, 6, 7, 6) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('94def970-19c6-4614-a744-bdfcb5c2eb51', 'Oxtail Braising Pack', 'oxtail', 'Collagen-rich oxtail pieces perfect for a hearty, deeply flavoured braise or stew. Slow cook for 4-6 hours.', '02abc2ed-1111-4000-8000-000000000001', 22.99, NULL, 'https://images.unsplash.com/photo-1545093149-618ce3bcf49d?w=800&q=80', ARRAY[]::TEXT[], NULL, NULL, true, false, false, ARRAY['beef','oxtail','braise','slow-cook'], '[{"label":"1kg","price":22.99}]'::jsonb, 3, 4, 9) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('fc3bd475-fb59-45c9-a7b6-4b6b36bdd1fe', 'Chicken Breast Fillets 1kg', 'chicken-breast-1kg', 'Premium free-range chicken breast fillets — lean, versatile, and perfect for weeknight cooking.', '0c4e1e4c-1111-4000-8000-000000000004', 18.99, NULL, 'https://images.unsplash.com/photo-1604908177453-7462950a6a3b?w=800&q=80', ARRAY[]::TEXT[], NULL, NULL, true, false, true, ARRAY['chicken','breast','lean','free-range'], '[{"label":"1kg","price":18.99},{"label":"2kg","price":34.99}]'::jsonb, 9, 7, 4) ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Success! Database is ready to go.
-- ============================================
