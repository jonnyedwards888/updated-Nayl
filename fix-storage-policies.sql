-- Fix Supabase Storage policies for profile picture uploads
-- Run this in your Supabase SQL Editor

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anyone to upload profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow anyone to update profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow anyone to delete profile pictures" ON storage.objects;

-- Create new, more permissive policies for development
CREATE POLICY "Allow all operations on user-uploads bucket" ON storage.objects
FOR ALL USING (bucket_id = 'user-uploads');

-- Alternative: If the above doesn't work, try these individual policies:
-- CREATE POLICY "Allow insert on user-uploads" ON storage.objects
-- FOR INSERT WITH CHECK (bucket_id = 'user-uploads');

-- CREATE POLICY "Allow select on user-uploads" ON storage.objects
-- FOR SELECT USING (bucket_id = 'user-uploads');

-- CREATE POLICY "Allow update on user-uploads" ON storage.objects
-- FOR UPDATE USING (bucket_id = 'user-uploads');

-- CREATE POLICY "Allow delete on user-uploads" ON storage.objects
-- FOR DELETE USING (bucket_id = 'user-uploads');
