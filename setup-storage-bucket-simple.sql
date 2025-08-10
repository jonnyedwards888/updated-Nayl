-- Simple Supabase Storage bucket setup for profile pictures
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

-- Create storage policy to allow anyone to upload (for development)
CREATE POLICY "Allow anyone to upload profile pictures" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'user-uploads');

-- Create storage policy to allow public read access
CREATE POLICY "Allow public read access to profile pictures" ON storage.objects
FOR SELECT USING (bucket_id = 'user-uploads');

-- Create storage policy to allow anyone to update (for development)
CREATE POLICY "Allow anyone to update profile pictures" ON storage.objects
FOR UPDATE USING (bucket_id = 'user-uploads');

-- Create storage policy to allow anyone to delete (for development)
CREATE POLICY "Allow anyone to delete profile pictures" ON storage.objects
FOR DELETE USING (bucket_id = 'user-uploads');
