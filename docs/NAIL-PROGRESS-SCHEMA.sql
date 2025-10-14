-- Nail Progress Photo Tracking
-- Stores photos of user's nails to track healing progress over time

CREATE TABLE IF NOT EXISTS nail_progress_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Index for fast user queries
CREATE INDEX IF NOT EXISTS idx_nail_progress_user_id ON nail_progress_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_nail_progress_created_at ON nail_progress_photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nail_progress_user_date ON nail_progress_photos(user_id, created_at DESC);

-- Row Level Security
ALTER TABLE nail_progress_photos ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own photos
CREATE POLICY "Users can view own nail progress photos"
  ON nail_progress_photos FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own photos
CREATE POLICY "Users can insert own nail progress photos"
  ON nail_progress_photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own photos
CREATE POLICY "Users can update own nail progress photos"
  ON nail_progress_photos FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own photos
CREATE POLICY "Users can delete own nail progress photos"
  ON nail_progress_photos FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_nail_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_nail_progress_photos_updated_at
  BEFORE UPDATE ON nail_progress_photos
  FOR EACH ROW
  EXECUTE FUNCTION update_nail_progress_updated_at();

-- Storage bucket for nail progress photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('nail-progress', 'nail-progress', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload own nail photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'nail-progress' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own nail photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'nail-progress' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public can view nail photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'nail-progress');

CREATE POLICY "Users can delete own nail photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'nail-progress' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
