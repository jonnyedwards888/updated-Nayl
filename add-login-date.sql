-- Add last_login_date column to user_sessions table
ALTER TABLE user_sessions 
ADD COLUMN IF NOT EXISTS last_login_date DATE DEFAULT CURRENT_DATE;

-- Update existing records to have today's date as last_login_date
UPDATE user_sessions 
SET last_login_date = CURRENT_DATE 
WHERE last_login_date IS NULL;

-- Add index for better performance on date queries
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_login_date 
ON user_sessions(user_id, last_login_date);