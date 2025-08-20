-- Add successful_days_this_week column to existing user_stats table
-- Run this in your Supabase SQL Editor if you have an existing database

-- Add the new column
ALTER TABLE user_stats 
ADD COLUMN IF NOT EXISTS successful_days_this_week INTEGER DEFAULT 0;

-- Update the user_dashboard view
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

-- Update the user_analytics view
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
