-- Fix nail_progress_photos table to work with custom user IDs (TEXT instead of UUID)
-- Run this in your Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own nail progress photos" ON nail_progress_photos;
DROP POLICY IF EXISTS "Users can insert own nail progress photos" ON nail_progress_photos;
DROP POLICY IF EXISTS "Users can update own nail progress photos" ON nail_progress_photos;
DROP POLICY IF EXISTS "Users can delete own nail progress photos" ON nail_progress_photos;

-- Drop the table and recreate with TEXT user_id
DROP TABLE IF EXISTS nail_progress_photos CASCADE;

-- Recreate table with TEXT user_id (no auth reference)
CREATE TABLE nail_progress_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  thumbnail_url TEXT,
  
  -- Progress metadata
  days_clean INTEGER NOT NULL DEFAULT 0,
  streak_seconds_at_photo INTEGER NOT NULL DEFAULT 0,
  
  -- Photo details
  caption TEXT,
  hand_type TEXT CHECK (hand_type IN ('left', 'right', 'both')) DEFAULT 'both',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for performance
CREATE INDEX idx_nail_progress_user_id ON nail_progress_photos(user_id);
CREATE INDEX idx_nail_progress_created_at ON nail_progress_photos(created_at DESC);
CREATE INDEX idx_nail_progress_user_date ON nail_progress_photos(user_id, created_at DESC);

-- Disable RLS (since we're using custom auth, not Supabase auth)
ALTER TABLE nail_progress_photos DISABLE ROW LEVEL SECURITY;

-- Trigger for updated_at
CREATE TRIGGER update_nail_progress_photos_updated_at
  BEFORE UPDATE ON nail_progress_photos
  FOR EACH ROW
  EXECUTE FUNCTION update_nail_progress_updated_at();

-- Storage policies (remove ALL existing policies for nail-progress bucket)
DROP POLICY IF EXISTS "Users can upload own nail photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own nail photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own nail photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view nail photos" ON storage.objects;
DROP POLICY IF EXISTS "Public upload to nail-progress" ON storage.objects;
DROP POLICY IF EXISTS "Public view nail-progress" ON storage.objects;
DROP POLICY IF EXISTS "Public delete from nail-progress" ON storage.objects;

-- Create new public access policies for nail-progress bucket
CREATE POLICY "nail_progress_public_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'nail-progress');

CREATE POLICY "nail_progress_public_view"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'nail-progress');

CREATE POLICY "nail_progress_public_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'nail-progress');
