/* 
  RUN THIS IN YOUR SUPABASE SQL EDITOR
  This script ensures the 'product-images' bucket exists and has correct permissions.
*/

-- 1. Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Allow public access to read files
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'product-images');

-- 3. Allow authenticated users to upload files
CREATE POLICY "Allow Auth Uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- 4. Allow authenticated users to update/delete their own uploads
CREATE POLICY "Allow Auth Updates" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'product-images');

CREATE POLICY "Allow Auth Deletes" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'product-images');
