-- Nayl App - Incremental Schema Update
-- Run this in your Supabase SQL Editor to add missing performance features
-- This only adds what's missing, won't recreate existing triggers

-- ===== NEW TABLES (Only if they don't exist) =====

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

-- ===== ADD MISSING COLUMNS TO EXISTING TABLES =====

-- Add last_login_date to user_sessions if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_sessions' AND column_name = 'last_login_date'
    ) THEN
        ALTER TABLE user_sessions ADD COLUMN last_login_date DATE DEFAULT CURRENT_DATE;
    END IF;
END $$;

-- Add missing columns to user_stats if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_stats' AND column_name = 'cumulative_brain_rewiring_seconds'
    ) THEN
        ALTER TABLE user_stats ADD COLUMN cumulative_brain_rewiring_seconds INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_stats' AND column_name = 'consecutive_days'
    ) THEN
        ALTER TABLE user_stats ADD COLUMN consecutive_days INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_stats' AND column_name = 'last_login_date'
    ) THEN
        ALTER TABLE user_stats ADD COLUMN last_login_date DATE DEFAULT CURRENT_DATE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_stats' AND column_name = 'total_days_logged_in'
    ) THEN
        ALTER TABLE user_stats ADD COLUMN total_days_logged_in INTEGER DEFAULT 0;
    END IF;
END $$;

-- ===== PERFORMANCE INDEXES (Only if they don't exist) =====

-- Single column indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_user_sessions_start_time ON user_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_login_date ON user_sessions(last_login_date);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON user_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_updated_at ON user_sessions(updated_at);

CREATE INDEX IF NOT EXISTS idx_user_stats_consecutive_days ON user_stats(consecutive_days);
CREATE INDEX IF NOT EXISTS idx_user_stats_longest_streak_seconds ON user_stats(longest_streak_seconds);
CREATE INDEX IF NOT EXISTS idx_user_stats_created_at ON user_stats(created_at);
CREATE INDEX IF NOT EXISTS idx_user_stats_updated_at ON user_stats(updated_at);

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

-- ===== ADD MISSING TRIGGERS (Only if they don't exist) =====

-- Add trigger for user_achievements if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'update_user_achievements_updated_at'
    ) THEN
        CREATE TRIGGER update_user_achievements_updated_at 
            BEFORE UPDATE ON user_achievements 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- ===== ROW LEVEL SECURITY (Only if not already enabled) =====

-- Enable RLS on new tables only
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'user_achievements' AND rowsecurity = true
    ) THEN
        ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'user_reasons' AND rowsecurity = true
    ) THEN
        ALTER TABLE user_reasons ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create RLS policies for new tables
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_achievements' AND policyname = 'Allow all operations on user_achievements'
    ) THEN
        CREATE POLICY "Allow all operations on user_achievements" ON user_achievements
            FOR ALL USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_reasons' AND policyname = 'Allow all operations on user_reasons'
    ) THEN
        CREATE POLICY "Allow all operations on user_reasons" ON user_reasons
            FOR ALL USING (true);
    END IF;
END $$;

-- ===== PERFORMANCE VIEWS (Replace if they exist) =====

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
    COUNT(ua.id) as total_achievements,
    COUNT(CASE WHEN ua.is_unlocked THEN 1 END) as unlocked_achievements
FROM user_sessions us
LEFT JOIN user_stats ust ON us.user_id = ust.user_id
LEFT JOIN user_achievements ua ON us.user_id = ua.user_id
GROUP BY us.user_id, us.current_streak_seconds, us.total_streak_seconds, 
         us.start_time, us.last_reset_time, us.last_login_date,
         ust.consecutive_days, ust.longest_streak_seconds, ust.total_episodes, ust.total_days_logged_in;

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
    COUNT(te.id) as total_triggers,
    COUNT(DISTINCT DATE(te.timestamp)) as days_with_triggers,
    AVG(EXTRACT(EPOCH FROM (te.timestamp - us.start_time))) as avg_trigger_time
FROM user_sessions us
LEFT JOIN user_stats ust ON us.user_id = ust.user_id
LEFT JOIN trigger_entries te ON us.user_id = te.user_id
GROUP BY us.user_id, us.current_streak_seconds, us.total_streak_seconds, 
         us.start_time, ust.longest_streak_seconds, ust.total_episodes, 
         ust.consecutive_days, ust.total_days_logged_in;

-- ===== VERIFICATION QUERY =====
-- Run this to see what was created/updated
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
    AND tablename IN ('user_sessions', 'user_stats', 'trigger_entries', 'user_achievements', 'user_reasons')
ORDER BY tablename, indexname;
