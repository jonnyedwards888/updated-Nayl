-- Fix integer overflow issue for total_streak_seconds
-- Change from INTEGER to BIGINT to support larger values

-- First, drop the dependent views
DROP VIEW IF EXISTS user_dashboard;
DROP VIEW IF EXISTS user_analytics;

-- Update user_stats table
ALTER TABLE user_stats 
ALTER COLUMN total_streak_seconds TYPE BIGINT;

-- Update user_sessions table  
ALTER TABLE user_sessions 
ALTER COLUMN total_streak_seconds TYPE BIGINT;

-- Also update other streak-related fields to be safe
ALTER TABLE user_stats 
ALTER COLUMN longest_streak_seconds TYPE BIGINT;

ALTER TABLE user_stats 
ALTER COLUMN current_streak_seconds TYPE BIGINT;

ALTER TABLE user_sessions 
ALTER COLUMN current_streak_seconds TYPE BIGINT;

-- Recreate the user_dashboard view with BIGINT columns
CREATE OR REPLACE VIEW user_dashboard AS
SELECT 
  us.user_id,
  us.current_streak_seconds,
  us.total_streak_seconds,
  us.start_time,
  us.last_reset_time,
  us.last_login_date,
  COALESCE(ust.consecutive_days, 0) as consecutive_days,
  COALESCE(ust.longest_streak_seconds, 0) as longest_streak_seconds,
  COALESCE(ust.total_episodes, 0) as total_episodes,
  COALESCE(ust.total_days_logged_in, 0) as total_days_logged_in,
  COALESCE(ust.successful_days_this_week, 0) as successful_days_this_week,
  COALESCE(COUNT(ua.id), 0) as total_achievements,
  COALESCE(COUNT(CASE WHEN ua.is_unlocked THEN 1 END), 0) as unlocked_achievements
FROM user_sessions us
LEFT JOIN user_stats ust ON us.user_id = ust.user_id
LEFT JOIN user_achievements ua ON us.user_id = ua.user_id
GROUP BY us.user_id, us.current_streak_seconds, us.total_streak_seconds, 
         us.start_time, us.last_reset_time, us.last_login_date,
         ust.consecutive_days, ust.longest_streak_seconds, ust.total_episodes, 
         ust.total_days_logged_in, ust.successful_days_this_week;

-- Recreate the user_analytics view with BIGINT columns
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
  COALESCE(COUNT(te.id), 0) as total_triggers,
  COALESCE(COUNT(DISTINCT DATE(te.timestamp)), 0) as days_with_triggers,
  COALESCE(AVG(EXTRACT(EPOCH FROM (te.timestamp - us.start_time))), 0) as avg_trigger_time
FROM user_sessions us
LEFT JOIN user_stats ust ON us.user_id = ust.user_id
LEFT JOIN trigger_entries te ON us.user_id = te.user_id
GROUP BY us.user_id, us.current_streak_seconds, us.total_streak_seconds, 
         us.start_time, ust.longest_streak_seconds, ust.total_episodes, 
         ust.consecutive_days, ust.total_days_logged_in, ust.successful_days_this_week;

-- Add comment explaining the change
COMMENT ON COLUMN user_stats.total_streak_seconds IS 'Total accumulated streak time in seconds (BIGINT to prevent overflow)';
COMMENT ON COLUMN user_sessions.total_streak_seconds IS 'Total accumulated streak time in seconds (BIGINT to prevent overflow)';
COMMENT ON COLUMN user_stats.longest_streak_seconds IS 'Longest streak duration in seconds (BIGINT to prevent overflow)';
COMMENT ON COLUMN user_stats.current_streak_seconds IS 'Current streak duration in seconds (BIGINT to prevent overflow)';
COMMENT ON COLUMN user_sessions.current_streak_seconds IS 'Current streak duration in seconds (BIGINT to prevent overflow)';
