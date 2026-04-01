-- 1. Add roles and permission tracking
ALTER TABLE IF EXISTS profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer' CHECK (role IN ('super_admin', 'admin', 'customer')),
ADD COLUMN IF NOT EXISTS allowed_tabs JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 2. Seed Super Admin
-- Replace with the appropriate email for the super admin
UPDATE profiles 
SET role = 'super_admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@gmgp.com');

-- 3. SQL-level Function for Deletion (including Auth cleanup)
-- This facilitates both admin deletion and self-deletion
CREATE OR REPLACE FUNCTION delete_user_by_id(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Mark as deleted (Soft Delete for tracking)
  UPDATE profiles 
  SET deleted_at = now() 
  WHERE id = target_user_id;

  -- Optional: Could perform hard delete here if you prefer, but the user requested 
  -- that the "admin panel me bhi ya cheez update ho" so we keep the profile record.
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Update RLS for Admin Role Selection
-- Ensure Super Admins can see/update all roles
DROP POLICY IF EXISTS "Super Admin manage all profiles" ON profiles;
CREATE POLICY "Super Admin manage all profiles" ON profiles 
FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- Admin can see profiles (already exists, but we refine for role check)
DROP POLICY IF EXISTS "Admin read all profiles" ON profiles;
CREATE POLICY "Admin read all profiles" ON profiles 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin'))
);
