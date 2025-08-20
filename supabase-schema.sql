-- Nayl App Database Schema - Performance Optimized
-- Run this in your Supabase SQL Editor

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_streak_seconds INTEGER DEFAULT 0,
    total_streak_seconds INTEGER DEFAULT 0,
    last_reset_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_date DATE DEFAULT CURRENT_DATE,
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
    successful_days_this_week INTEGER DEFAULT 0,
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

-- Create achievements table for better performance
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    achievement_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    rarity TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    max_progress INTEGER NOT NULL,
    is_unlocked BOOLEAN DEFAULT FALSE,
    unlocked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Create user_reasons table (referenced in reasonsService)
CREATE TABLE IF NOT EXISTS user_reasons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    reason_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== PERFORMANCE INDEXES =====

-- Single column indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_start_time ON user_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_login_date ON user_sessions(last_login_date);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON user_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_updated_at ON user_sessions(updated_at);

CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_consecutive_days ON user_stats(consecutive_days);
CREATE INDEX IF NOT EXISTS idx_user_stats_longest_streak_seconds ON user_stats(longest_streak_seconds);
CREATE INDEX IF NOT EXISTS idx_user_stats_created_at ON user_stats(created_at);
CREATE INDEX IF NOT EXISTS idx_user_stats_updated_at ON user_stats(updated_at);

CREATE INDEX IF NOT EXISTS idx_trigger_entries_user_id ON trigger_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_trigger_entries_timestamp ON trigger_entries(timestamp);
CREATE INDEX IF NOT EXISTS idx_trigger_entries_created_at ON trigger_entries(created_at);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_is_unlocked ON user_achievements(is_unlocked);
CREATE INDEX IF NOT EXISTS idx_user_achievements_category ON user_achievements(category);
CREATE INDEX IF NOT EXISTS idx_user_achievements_created_at ON user_achievements(created_at);

CREATE INDEX IF NOT EXISTS idx_user_reasons_user_id ON user_reasons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reasons_created_at ON user_reasons(created_at);

-- Composite indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_login_date ON user_sessions(user_id, last_login_date);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_created ON user_sessions(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_consecutive ON user_stats(user_id, consecutive_days);
CREATE INDEX IF NOT EXISTS idx_trigger_entries_user_timestamp ON trigger_entries(user_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_unlocked ON user_achievements(user_id, is_unlocked);

-- Partial indexes for specific query patterns
CREATE INDEX IF NOT EXISTS idx_user_sessions_active_users ON user_sessions(user_id) 
    WHERE current_streak_seconds > 0;
CREATE INDEX IF NOT EXISTS idx_user_stats_high_achievers ON user_stats(user_id) 
    WHERE longest_streak_seconds > 86400; -- More than 1 day
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked_only ON user_achievements(user_id, achievement_id) 
    WHERE is_unlocked = TRUE;

-- ===== TRIGGERS AND FUNCTIONS =====

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

CREATE TRIGGER update_user_achievements_updated_at 
    BEFORE UPDATE ON user_achievements 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== ROW LEVEL SECURITY =====

-- Enable Row Level Security (RLS)
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE trigger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reasons ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (for now, allow all operations - you can make this more secure later)
CREATE POLICY "Allow all operations on user_sessions" ON user_sessions
    FOR ALL USING (true);

CREATE POLICY "Allow all operations on user_stats" ON user_stats
    FOR ALL USING (true);

CREATE POLICY "Allow all operations on trigger_entries" ON trigger_entries
    FOR ALL USING (true);

CREATE POLICY "Allow all operations on user_achievements" ON user_achievements
    FOR ALL USING (true);

CREATE POLICY "Allow all operations on user_reasons" ON user_reasons
    FOR ALL USING (true);

-- ===== PERFORMANCE VIEWS =====

-- Create a view for user dashboard data (reduces multiple queries)
CREATE OR REPLACE VIEW user_dashboard AS
SELECT 
    us.user_id,
    us.current_streak_seconds,
    us.total_streak_seconds,
    us.start_time,
    us.last_reset_time,
    us.last_login_date,
    ust.consecutive_days,
    ust.longest_streak_seconds,
    ust.total_episodes,
    ust.total_days_logged_in,
    ust.successful_days_this_week,
    COUNT(ua.id) as total_achievements,
    COUNT(CASE WHEN ua.is_unlocked THEN 1 END) as unlocked_achievements
FROM user_sessions us
LEFT JOIN user_stats ust ON us.user_id = ust.user_id
LEFT JOIN user_achievements ua ON us.user_id = ua.user_id
GROUP BY us.user_id, us.current_streak_seconds, us.total_streak_seconds, 
         us.start_time, us.last_reset_time, us.last_login_date,
         ust.consecutive_days, ust.longest_streak_seconds, ust.total_episodes, 
         ust.total_days_logged_in, ust.successful_days_this_week;

-- Create a view for analytics data
CREATE OR REPLACE VIEW user_analytics AS
SELECT 
    us.user_id,
    us.current_streak_seconds,
    us.total_streak_seconds,
    us.start_time,
    ust.longest_streak_seconds,
    ust.total_episodes,
    ust.consecutive_days,
    ust.total_days_logged_in,
    ust.successful_days_this_week,
    COUNT(te.id) as total_triggers,
    COUNT(DISTINCT DATE(te.timestamp)) as days_with_triggers,
    AVG(EXTRACT(EPOCH FROM (te.timestamp - us.start_time))) as avg_trigger_time
FROM user_sessions us
LEFT JOIN user_stats ust ON us.user_id = ust.user_id
LEFT JOIN trigger_entries te ON us.user_id = te.user_id
GROUP BY us.user_id, us.current_streak_seconds, us.total_streak_seconds, 
         us.start_time, ust.longest_streak_seconds, ust.total_episodes, 
         ust.consecutive_days, ust.total_days_logged_in, ust.successful_days_this_week;

-- ===== SAMPLE DATA (Optional) =====
-- INSERT INTO user_sessions (user_id, current_streak_seconds, total_streak_seconds) 
-- VALUES ('test_user_1', 3600, 3600);

-- INSERT INTO user_stats (user_id, total_episodes, longest_streak_seconds, current_streak_seconds, total_streak_seconds)
-- VALUES ('test_user_1', 0, 3600, 3600, 3600);