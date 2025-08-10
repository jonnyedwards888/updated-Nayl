-- Update existing user_stats table with new columns
-- Run this in your Supabase SQL Editor

-- Add new columns to user_stats table
ALTER TABLE user_stats 
ADD COLUMN IF NOT EXISTS cumulative_brain_rewiring_seconds INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS consecutive_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_login_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS total_days_logged_in INTEGER DEFAULT 0;

-- Update existing records to have default values
UPDATE user_stats 
SET 
    consecutive_days = 1,
    last_login_date = CURRENT_DATE,
    total_days_logged_in = 1
WHERE consecutive_days IS NULL OR consecutive_days = 0;