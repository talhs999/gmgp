-- 1. Create Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10,2) NOT NULL,
  min_order_amount NUMERIC(10,2) DEFAULT 0,
  max_uses INT DEFAULT NULL,
  used_count INT DEFAULT 0,
  expires_at TIMESTAMPTZ DEFAULT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Add Coupon fields to Orders Table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS coupon_code TEXT DEFAULT NULL;

-- 3. RLS Policies for Coupons
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active coupons" ON coupons 
FOR SELECT USING (is_active = true);

CREATE POLICY "Admin manage coupons" ON coupons 
FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin'))
);

-- 4. RPC to safely increment used_count
CREATE OR REPLACE FUNCTION increment_coupon_usage(p_code TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE coupons 
  SET used_count = used_count + 1 
  WHERE code = p_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
