-- Add user_reasons table for storing user reasons for stopping nail biting
-- Run this in your Supabase SQL Editor

-- Create the user_reasons table
CREATE TABLE IF NOT EXISTS user_reasons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_reasons_user_id ON user_reasons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reasons_created_at ON user_reasons(created_at DESC);

-- Add RLS (Row Level Security)
ALTER TABLE user_reasons ENABLE ROW LEVEL SECURITY;

-- Create policies for user_reasons table
CREATE POLICY "Users can view their own reasons" ON user_reasons
  FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own reasons" ON user_reasons
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own reasons" ON user_reasons
  FOR UPDATE USING (user_id = auth.uid()::text);

CREATE POLICY "Users can delete their own reasons" ON user_reasons
  FOR DELETE USING (user_id = auth.uid()::text);

-- Add comments for documentation
COMMENT ON TABLE user_reasons IS 'Stores user reasons for stopping nail biting';
COMMENT ON COLUMN user_reasons.user_id IS 'The user ID who owns this reason';
COMMENT ON COLUMN user_reasons.text IS 'The reason text entered by the user';
COMMENT ON COLUMN user_reasons.created_at IS 'When the reason was created';
COMMENT ON COLUMN user_reasons.updated_at IS 'When the reason was last updated';
