-- Add profile_name field to user_stats table
-- Run this in your Supabase SQL Editor

-- Add profile_name column to user_stats table
ALTER TABLE user_stats 
ADD COLUMN IF NOT EXISTS profile_name TEXT DEFAULT 'Your Name';

-- Update existing records to have a default name if they don't have one
UPDATE user_stats 
SET profile_name = 'Your Name' 
WHERE profile_name IS NULL;

-- Make the column NOT NULL after setting default values
ALTER TABLE user_stats 
ALTER COLUMN profile_name SET NOT NULL;
