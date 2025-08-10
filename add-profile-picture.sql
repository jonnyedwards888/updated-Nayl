-- Add profile picture URL field to user_stats table
-- Run this in your Supabase SQL Editor

ALTER TABLE user_stats 
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;

-- Add a comment to document the field
COMMENT ON COLUMN user_stats.profile_picture_url IS 'URL to the user''s profile picture stored in Supabase Storage';
