-- Nayl App Database Schema
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_streak_seconds INTEGER DEFAULT 0,
    total_streak_seconds INTEGER DEFAULT 0,
    last_reset_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    total_episodes INTEGER DEFAULT 0,
    longest_streak_seconds INTEGER DEFAULT 0,
    current_streak_seconds INTEGER DEFAULT 0,
    total_streak_seconds INTEGER DEFAULT 0,
    -- New columns for proper tracking
    cumulative_brain_rewiring_seconds INTEGER DEFAULT 0,
    consecutive_days INTEGER DEFAULT 0,
    last_login_date DATE DEFAULT CURRENT_DATE,
    total_days_logged_in INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger_entries table
CREATE TABLE IF NOT EXISTS trigger_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    trigger TEXT NOT NULL,
    emoji TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_trigger_entries_user_id ON trigger_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_trigger_entries_timestamp ON trigger_entries(timestamp);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_sessions_updated_at 
    BEFORE UPDATE ON user_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at 
    BEFORE UPDATE ON user_stats 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE trigger_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (for now, allow all operations - you can make this more secure later)
CREATE POLICY "Allow all operations on user_sessions" ON user_sessions
    FOR ALL USING (true);

CREATE POLICY "Allow all operations on user_stats" ON user_stats
    FOR ALL USING (true);

CREATE POLICY "Allow all operations on trigger_entries" ON trigger_entries
    FOR ALL USING (true);

-- Insert some sample data for testing (optional)
-- INSERT INTO user_sessions (user_id, current_streak_seconds, total_streak_seconds) 
-- VALUES ('test_user_1', 3600, 3600);

-- INSERT INTO user_stats (user_id, total_episodes, longest_streak_seconds, current_streak_seconds, total_streak_seconds)
-- VALUES ('test_user_1', 0, 3600, 3600, 3600);