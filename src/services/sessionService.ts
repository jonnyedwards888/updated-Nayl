import { supabase, UserSession, UserStats } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = '@nayl_current_session';
const USER_ID_KEY = '@nayl_user_id';

class SessionService {
  private currentUserId: string | null = null;

  // Initialize user ID (for demo purposes, you might want to implement proper auth later)
  async initializeUser(): Promise<string> {
    try {
      let userId = await AsyncStorage.getItem(USER_ID_KEY);
      if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await AsyncStorage.setItem(USER_ID_KEY, userId);
      }
      this.currentUserId = userId;
      return userId;
    } catch (error) {
      console.error('Error initializing user:', error);
      throw error;
    }
  }

  // Get current user ID
  async getCurrentUserId(): Promise<string> {
    if (!this.currentUserId) {
      return await this.initializeUser();
    }
    return this.currentUserId;
  }

  // Start or resume a session
  async startSession(): Promise<UserSession> {
    try {
      const userId = await this.getCurrentUserId();
      const now = new Date().toISOString();
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

      // Check if there's an existing active session
      const { data: existingSession, error: fetchError } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching existing session:', fetchError);
        // Return a mock session for offline functionality instead of throwing
        return {
          id: 'offline-session',
          user_id: userId,
          start_time: now,
          current_streak_seconds: 0,
          total_streak_seconds: 0,
          last_reset_time: now,
          created_at: now,
          updated_at: now,
        } as UserSession;
      }

      if (existingSession) {
        // Update existing session
        const { data: updatedSession, error: updateError } = await supabase
          .from('user_sessions')
          .update({
            updated_at: now,
          })
          .eq('id', existingSession.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating session:', updateError);
          // Return the existing session data instead of throwing
          return {
            ...existingSession,
            updated_at: now,
          };
        }
        
        // Update daily login tracking
        await this.updateDailyLoginTracking(today).catch(error => {
          console.warn('Failed to update daily login tracking:', error);
        });
        
        return updatedSession;
      } else {
        // Create new session
        const { data: newSession, error: insertError } = await supabase
          .from('user_sessions')
          .insert({
            user_id: userId,
            start_time: now,
            current_streak_seconds: 0,
            total_streak_seconds: 0,
            last_reset_time: now,
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating new session:', insertError);
          // Return a mock session for offline functionality instead of throwing
          return {
            id: 'offline-session',
            user_id: userId,
            start_time: now,
            current_streak_seconds: 0,
            total_streak_seconds: 0,
            last_reset_time: now,
            created_at: now,
            updated_at: now,
          } as UserSession;
        }
        
        // Update daily login tracking for new user
        await this.updateDailyLoginTracking(today).catch(error => {
          console.warn('Failed to update daily login tracking:', error);
        });
        
        return newSession;
      }
    } catch (error) {
      console.error('Error starting session:', error);
      
      // If it's a network error, we can still continue with local functionality
      if (error instanceof Error && error.message.includes('Network request failed')) {
        console.warn('Network error detected - continuing with local functionality');
        // Return a mock session for offline functionality
        return {
          id: 'offline-session',
          user_id: await this.getCurrentUserId(),
          start_time: new Date().toISOString(),
          current_streak_seconds: 0,
          total_streak_seconds: 0,
          last_reset_time: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as UserSession;
      }
      
      // For any other error, return a mock session instead of throwing
      return {
        id: 'error-session',
        user_id: await this.getCurrentUserId(),
        start_time: new Date().toISOString(),
        current_streak_seconds: 0,
        total_streak_seconds: 0,
        last_reset_time: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as UserSession;
    }
  }

  // Update session with current streak
  async updateSession(currentStreakSeconds: number): Promise<void> {
    try {
      const userId = await this.getCurrentUserId();
      const now = new Date().toISOString();

      const { error } = await supabase
        .from('user_sessions')
        .update({
          current_streak_seconds: currentStreakSeconds,
          total_streak_seconds: currentStreakSeconds, // For now, we'll update this logic later
          updated_at: now,
        })
        .eq('user_id', userId);

      if (error) {
        console.warn('Error updating session:', error);
        // Don't throw the error, just log it
      }

      // Also update user stats to track longest streak
      await this.updateUserStats(currentStreakSeconds);
      
      // Ensure longest streak is updated if needed
      await this.updateLongestStreakIfNeeded(currentStreakSeconds);
    } catch (error) {
      console.error('Error updating session:', error);
      // Don't throw the error, just log it
    }
  }

  // Update streak start time (for editing streak)
  async updateStreakStartTime(newStartTime: Date): Promise<void> {
    try {
      const userId = await this.getCurrentUserId();
      const now = new Date().toISOString();
      const newStartTimeISO = newStartTime.toISOString();
      


      const { error } = await supabase
        .from('user_sessions')
        .update({
          start_time: newStartTimeISO,
          last_reset_time: newStartTimeISO, // Also update last_reset_time for consistency
          updated_at: now,
        })
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating streak start time:', error);
      throw error;
    }
  }

  // Reset session (when user resets their streak)
  async resetSession(trigger: string): Promise<void> {
    try {
      const userId = await this.getCurrentUserId();
      const now = new Date().toISOString();

      // Update session to reset streak
      const { error: sessionError } = await supabase
        .from('user_sessions')
        .update({
          current_streak_seconds: 0,
          last_reset_time: now,
          updated_at: now,
        })
        .eq('user_id', userId);

      if (sessionError) throw sessionError;

      // Update user stats
      await this.updateUserStats(0, trigger);

    } catch (error) {
      console.error('Error resetting session:', error);
      throw error;
    }
  }

  // Get current session
  async getCurrentSession(): Promise<UserSession | null> {
    try {
      const userId = await this.getCurrentUserId();

      // Add timeout and better error handling
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No session found - this is normal for new users
          return null;
        }
        
        // Log specific error details for debugging
        console.error('Supabase error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // Don't throw the error, just return null
        return null;
      }

      return data;
    } catch (error) {
      // Enhanced error logging
      if (error instanceof Error) {
        console.error('Error getting current session:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      } else {
        console.error('Unknown error getting current session:', error);
      }
      
      // Return null instead of throwing to prevent app crashes
      return null;
    }
  }

  // Update user statistics
  async updateUserStats(currentStreakSeconds: number, trigger?: string): Promise<void> {
    try {
      const userId = await this.getCurrentUserId();
      const now = new Date().toISOString();

      // Get current stats
      const { data: existingStats, error: fetchError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      const updateData: Partial<UserStats> = {
        current_streak_seconds: currentStreakSeconds,
        updated_at: now,
      };

      if (existingStats) {
        // Update existing stats
        updateData.total_streak_seconds = existingStats.total_streak_seconds + currentStreakSeconds;
        
        // Update longest streak if current streak is longer
        if (currentStreakSeconds > existingStats.longest_streak_seconds) {
          updateData.longest_streak_seconds = currentStreakSeconds;
          // Reduced logging to prevent terminal spam
          // console.log(`🎉 New longest streak achieved: ${currentStreakSeconds} seconds (${Math.floor(currentStreakSeconds / 86400)} days)`);
        }
        
        if (trigger) {
          updateData.total_episodes = existingStats.total_episodes + 1;
        }

        const { error: updateError } = await supabase
          .from('user_stats')
          .update(updateData)
          .eq('id', existingStats.id);

        if (updateError) throw updateError;
      } else {
        // Create new stats
        const { error: insertError } = await supabase
          .from('user_stats')
          .insert({
            user_id: userId,
            total_episodes: trigger ? 1 : 0,
            longest_streak_seconds: currentStreakSeconds,
            current_streak_seconds: currentStreakSeconds,
            total_streak_seconds: currentStreakSeconds,
          });

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  }

  // Update longest streak if current streak exceeds it
  async updateLongestStreakIfNeeded(currentStreakSeconds: number): Promise<void> {
    try {
      const userId = await this.getCurrentUserId();
      const now = new Date().toISOString();

      // Get current stats
      const { data: existingStats, error: fetchError } = await supabase
        .from('user_stats')
        .select('longest_streak_seconds')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.warn('Error fetching stats for longest streak update:', fetchError);
        return;
      }

      const currentLongest = existingStats?.longest_streak_seconds || 0;

      // If no stats exist or current streak is longer, update
      if (!existingStats || currentStreakSeconds > currentLongest) {
        const { error: updateError } = await supabase
          .from('user_stats')
          .upsert({
            user_id: userId,
            longest_streak_seconds: currentStreakSeconds,
            updated_at: now,
          }, {
            onConflict: 'user_id'
          });

        if (updateError) {
          console.warn('Error updating longest streak:', updateError);
        } else {
          // Reduced logging to prevent terminal spam
          // console.log(`🎉 Longest streak updated: ${currentLongest}s → ${currentStreakSeconds}s (${Math.floor(currentStreakSeconds / 86400)} days)`);
        }
      }
      // Removed the else clause that was logging every time the streak was unchanged
    } catch (error) {
      console.error('Error updating longest streak:', error);
      // Don't throw error to avoid breaking the main streak tracking
    }
  }

  // Reset longest streak (for testing purposes)
  async resetLongestStreak(): Promise<void> {
    try {
      const userId = await this.getCurrentUserId();
      const now = new Date().toISOString();

      const { error } = await supabase
        .from('user_stats')
        .upsert({
          user_id: userId,
          longest_streak_seconds: 0,
          updated_at: now,
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.warn('Error resetting longest streak:', error);
      } else {
        console.log('Longest streak reset to 0 for testing');
      }
    } catch (error) {
      console.error('Error resetting longest streak:', error);
      throw error;
    }
  }

  // Force refresh longest streak data (useful for testing/debugging)
  async forceRefreshLongestStreak(): Promise<void> {
    try {
      const currentStreak = await this.getCurrentStreakSeconds();
      console.log(`Force refreshing longest streak. Current streak: ${currentStreak}s`);
      
      // Update both user stats and longest streak
      await this.updateUserStats(currentStreak);
      await this.updateLongestStreakIfNeeded(currentStreak);
      
      console.log('Longest streak data force refreshed');
    } catch (error) {
      console.error('Error force refreshing longest streak:', error);
      throw error;
    }
  }

  // Get user statistics
  async getUserStats(): Promise<UserStats | null> {
    try {
      const userId = await this.getCurrentUserId();

      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting user stats:', error);
      return null;
    }
  }

  // Calculate brain rewiring percentage (100% = 60 days)
  calculateBrainRewiringPercentage(totalSeconds: number): number {
    const sixtyDaysInSeconds = 60 * 24 * 60 * 60; // 60 days in seconds
    const percentage = (totalSeconds / sixtyDaysInSeconds) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  }

  // Get consecutive days for flame counter
  async getConsecutiveDays(): Promise<number> {
    try {
      const userId = await this.getCurrentUserId();
      const { data, error } = await supabase
        .from('user_stats')
        .select('consecutive_days')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.warn('Error getting consecutive days:', error);
        return 0;
      }
      return data?.consecutive_days || 0;
    } catch (error) {
      console.error('Error getting consecutive days:', error);
      return 0;
    }
  }

  // Get weekly check-in data
  async getWeeklyCheckIns(): Promise<boolean[]> {
    try {
      const userId = await this.getCurrentUserId();
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
      
      // Try to get data from user_sessions first
      try {
        const { data, error } = await supabase
          .from('user_sessions')
          .select('last_login_date')
          .eq('user_id', userId)
          .gte('last_login_date', startOfWeek.toISOString().split('T')[0])
          .order('last_login_date', { ascending: true });

        if (error) {
          console.warn('Error getting weekly check-ins from user_sessions:', error);
          throw error;
        }

        // Create array of 7 days (Sunday to Saturday)
        const weekDays = Array(7).fill(false);
        
        // Mark days that have been logged in
        data?.forEach(session => {
          const loginDate = new Date(session.last_login_date);
          const dayIndex = loginDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
          weekDays[dayIndex] = true;
        });

        return weekDays;
      } catch (columnError) {
        // If last_login_date column doesn't exist, fall back to user_stats
        console.log('last_login_date column not found, using user_stats fallback');
        const stats = await this.getUserStats();
        const consecutiveDays = stats?.consecutive_days || 0;
        
        // Create a simple fallback based on consecutive days
        const weekDays = Array(7).fill(false);
        if (consecutiveDays > 0) {
          // Mark today and previous days as checked in based on consecutive days
          const today = new Date().getDay();
          for (let i = 0; i < Math.min(consecutiveDays, 7); i++) {
            const dayIndex = (today - i + 7) % 7;
            weekDays[dayIndex] = true;
          }
        }
        
        return weekDays;
      }
    } catch (error) {
      console.error('Error getting weekly check-ins:', error);
      return Array(7).fill(false);
    }
  }

  // Mark today as checked in
  async markTodayCheckedIn(): Promise<void> {
    try {
      const userId = await this.getCurrentUserId();
      const today = new Date().toISOString().split('T')[0];
      
      // Update user_stats with today's login
      try {
        await this.updateDailyLoginTracking(today);
      } catch (trackingError) {
        console.warn('Failed to update daily login tracking:', trackingError);
      }
      
      // Try to update user_sessions last_login_date
      try {
        const { error } = await supabase
          .from('user_sessions')
          .update({ last_login_date: today })
          .eq('user_id', userId);

        if (error) {
          console.warn('Error updating user_sessions last_login_date:', error);
        }
      } catch (columnError) {
        // If last_login_date column doesn't exist, just log it
        console.log('last_login_date column not found, skipping user_sessions update');
      }
    } catch (error) {
      console.error('Error marking today as checked in:', error);
      // Don't throw the error, just log it
    }
  }

  // Get longest streak in seconds
  async getLongestStreakSeconds(): Promise<number> {
    try {
      const userId = await this.getCurrentUserId();

      const { data, error } = await supabase
        .from('user_stats')
        .select('longest_streak_seconds')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error getting longest streak:', error);
        return 0;
      }

      return data?.longest_streak_seconds || 0;
    } catch (error) {
      console.error('Error getting longest streak:', error);
      return 0;
    }
  }

  // Get current streak in seconds
  async getCurrentStreakSeconds(): Promise<number> {
    try {
      const session = await this.getCurrentSession();
      if (!session) {
        return 0;
      }

      // Use start_time instead of last_reset_time for more accurate streak calculation
      const startTime = new Date(session.start_time);
      const now = new Date();
      const timeSinceStart = Math.floor((now.getTime() - startTime.getTime()) / 1000);

      // Ensure we don't return negative values
      const currentStreak = Math.max(0, timeSinceStart);
      
      // Removed frequent logging to reduce terminal spam
      // if (currentStreak > 0 && currentStreak % 300 === 0) {
      //   console.log(`Current streak: ${currentStreak}s (${Math.floor(currentStreak / 86400)} days)`);
      // }

      return currentStreak;
    } catch (error) {
      console.error('Error getting current streak:', error);
      return 0;
    }
  }

  // Update daily login tracking
  async updateDailyLoginTracking(today: string): Promise<void> {
    try {
      const userId = await this.getCurrentUserId();

      // Get current stats
      const { data: existingStats, error: fetchError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingStats) {
        const lastLoginDate = existingStats.last_login_date;
        const isNewDay = lastLoginDate !== today;
        
        if (isNewDay) {
          // Calculate consecutive days
          let newConsecutiveDays = existingStats.consecutive_days || 0;
          
          if (lastLoginDate) {
            const lastLogin = new Date(lastLoginDate);
            const currentLogin = new Date(today);
            
            // Check if dates are valid before calculating
            if (!isNaN(lastLogin.getTime()) && !isNaN(currentLogin.getTime())) {
              const daysDiff = Math.floor((currentLogin.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
              
              if (daysDiff === 1) {
                // Consecutive day
                newConsecutiveDays = (existingStats.consecutive_days || 0) + 1;
              } else if (daysDiff > 1) {
                // Gap in days, reset consecutive count
                newConsecutiveDays = 1;
              }
              // If daysDiff === 0, it's the same day, don't update
            } else {
              // Invalid dates, treat as first login
              newConsecutiveDays = 1;
            }
          } else {
            // No last login date, treat as first login
            newConsecutiveDays = 1;
          }

          // Update stats
          const { error: updateError } = await supabase
            .from('user_stats')
            .update({
              last_login_date: today,
              consecutive_days: newConsecutiveDays,
              total_days_logged_in: (existingStats.total_days_logged_in || 0) + 1,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingStats.id);

          if (updateError) throw updateError;
        }
      } else {
        // Create new stats for first login
        const { error: insertError } = await supabase
          .from('user_stats')
          .insert({
            user_id: userId,
            last_login_date: today,
            consecutive_days: 1,
            total_days_logged_in: 1,
            total_episodes: 0,
            longest_streak_seconds: 0,
            current_streak_seconds: 0,
            total_streak_seconds: 0,
            cumulative_brain_rewiring_seconds: 0,
          });

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error updating daily login tracking:', error);
      throw error;
    }
  }
}

export default new SessionService();