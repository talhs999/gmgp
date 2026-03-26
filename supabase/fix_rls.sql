-- RUN THIS IN YOUR SUPABASE SQL EDITOR
-- This fixes the 42P17 Infinite Recursion error that is crashing your website

-- Drop the recursive policy on profiles
DROP POLICY IF EXISTS "Admin read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create a safe, non-recursive public read policy
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
