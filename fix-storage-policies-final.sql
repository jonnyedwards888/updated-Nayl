-- Final fix for Supabase Storage policies for profile picture uploads
-- Run this in your Supabase SQL Editor

-- First, drop ALL existing policies on storage.objects for user-uploads bucket
DROP POLICY IF EXISTS "Allow anyone to upload profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow anyone to update profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow anyone to delete profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow all operations on user-uploads bucket" ON storage.objects;

-- Create a single, very permissive policy for development
CREATE POLICY "Allow all operations on user-uploads bucket" ON storage.objects
FOR ALL USING (bucket_id = 'user-uploads');

-- If the above doesn't work, try disabling RLS temporarily for development
-- ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Note: For production, you should use more restrictive policies like:
-- CREATE POLICY "Users can upload their own files" ON storage.objects
-- FOR INSERT WITH CHECK (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
