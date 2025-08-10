-- Set up Supabase Storage bucket for profile pictures
-- Run this in your Supabase SQL Editor

-- Create the storage bucket for user uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-uploads',
  'user-uploads',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policy to allow authenticated users to upload
CREATE POLICY "Allow authenticated users to upload profile pictures" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'user-uploads' AND
  auth.role() = 'authenticated'
);

-- Create storage policy to allow public read access
CREATE POLICY "Allow public read access to profile pictures" ON storage.objects
FOR SELECT USING (bucket_id = 'user-uploads');

-- Create storage policy to allow users to update their own profile pictures
CREATE POLICY "Allow users to update their own profile pictures" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'user-uploads' AND
  auth.role() = 'authenticated'
);

-- Create storage policy to allow users to delete their own profile pictures
CREATE POLICY "Allow users to delete their own profile pictures" ON storage.objects
FOR DELETE USING (
  bucket_id = 'user-uploads' AND
  auth.role() = 'authenticated'
);
