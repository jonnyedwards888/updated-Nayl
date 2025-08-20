import { supabase } from '../lib/supabase';

export interface DatabaseAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  title: string;
  description: string;
  category: 'streak' | 'milestone' | 'special' | 'daily';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  max_progress: number;
  is_unlocked: boolean;
  unlocked_at?: string;
  created_at: string;
  updated_at: string;
}

class AchievementService {
  private async getUserId(): Promise<string> {
    // This should integrate with your auth system
    return 'default_user'; // Replace with actual user ID
  }

  // Get local achievements for instant display (fallback while database syncs)
  async getLocalAchievements(): Promise<DatabaseAchievement[]> {
    // Return mock data for instant display
    // This simulates what would come from AsyncStorage
    return [
      {
        id: '1',
        user_id: 'default_user',
        achievement_id: 'sprout',
        title: 'Sprout',
        description: 'First day without biting',
        category: 'streak',
        rarity: 'common',
        progress: 1,
        max_progress: 1,
        is_unlocked: true,
        unlocked_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        user_id: 'default_user',
        achievement_id: 'sun-kissed',
        title: 'Sun-kissed',
        description: 'A week of progress',
        category: 'streak',
        rarity: 'rare',
        progress: 7,
        max_progress: 7,
        is_unlocked: true,
        unlocked_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        user_id: 'default_user',
        achievement_id: 'deeply-rooted',
        title: 'Deeply Rooted',
        description: 'One month milestone',
        category: 'streak',
        rarity: 'epic',
        progress: 0,
        max_progress: 30,
        is_unlocked: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '4',
        user_id: 'default_user',
        achievement_id: 'blossoming',
        title: 'Blossoming',
        description: 'Two months of strength',
        category: 'milestone',
        rarity: 'legendary',
        progress: 0,
        max_progress: 60,
        is_unlocked: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '5',
        user_id: 'default_user',
        achievement_id: 'the-oak',
        title: 'The Oak',
        description: 'Three months of resilience',
        category: 'milestone',
        rarity: 'legendary',
        progress: 0,
        max_progress: 90,
        is_unlocked: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '6',
        user_id: 'default_user',
        achievement_id: 'conqueror',
        title: 'Conqueror',
        description: 'Six months of mastery',
        category: 'milestone',
        rarity: 'legendary',
        progress: 0,
        max_progress: 180,
        is_unlocked: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }

  // Get all achievements for a user
  async getUserAchievements(): Promise<DatabaseAchievement[]> {
    try {
      const userId = await this.getUserId();

      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching user achievements:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting user achievements:', error);
      return [];
    }
  }

  // Get specific achievement progress
  async getAchievementProgress(achievementId: string): Promise<DatabaseAchievement | null> {
    try {
      const userId = await this.getUserId();

      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .eq('achievement_id', achievementId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching achievement progress:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting achievement progress:', error);
      return null;
    }
  }

  // Update achievement progress
  async updateAchievementProgress(
    achievementId: string, 
    progress: number, 
    isUnlocked: boolean = false
  ): Promise<void> {
    try {
      const userId = await this.getUserId();
      const now = new Date().toISOString();

      const { error } = await supabase
        .from('user_achievements')
        .upsert({
          user_id: userId,
          achievement_id: achievementId,
          progress,
          is_unlocked: isUnlocked,
          unlocked_at: isUnlocked ? now : null,
          updated_at: now,
        }, {
          onConflict: 'user_id,achievement_id'
        });

      if (error) {
        console.error('Error updating achievement progress:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error updating achievement progress:', error);
      throw error;
    }
  }

  // Unlock an achievement
  async unlockAchievement(achievementId: string): Promise<void> {
    try {
      const userId = await this.getUserId();
      const now = new Date().toISOString();

      const { error } = await supabase
        .from('user_achievements')
        .update({
          is_unlocked: true,
          unlocked_at: now,
          updated_at: now,
        })
        .eq('user_id', userId)
        .eq('achievement_id', achievementId);

      if (error) {
        console.error('Error unlocking achievement:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      throw error;
    }
  }

  // Get unlocked achievements count
  async getUnlockedAchievementsCount(): Promise<number> {
    try {
      const userId = await this.getUserId();

      const { count, error } = await supabase
        .from('user_achievements')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_unlocked', true);

      if (error) {
        console.error('Error counting unlocked achievements:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error getting unlocked achievements count:', error);
      return 0;
    }
  }

  // Initialize default achievements for a user
  async initializeDefaultAchievements(): Promise<void> {
    try {
      const userId = await this.getUserId();
      const now = new Date().toISOString();

      const defaultAchievements = [
        {
          achievement_id: 'sprout',
          title: 'Sprout',
          description: 'First day without biting',
          category: 'streak' as const,
          rarity: 'common' as const,
          progress: 0,
          max_progress: 1,
          is_unlocked: false,
        },
        {
          achievement_id: 'sun-kissed',
          title: 'Sun-kissed',
          description: 'A week of progress',
          category: 'streak' as const,
          rarity: 'rare' as const,
          progress: 0,
          max_progress: 7,
          is_unlocked: false,
        },
        {
          achievement_id: 'deeply-rooted',
          title: 'Deeply Rooted',
          description: 'One month milestone',
          category: 'streak' as const,
          rarity: 'epic' as const,
          progress: 0,
          max_progress: 30,
          is_unlocked: false,
        },
        {
          achievement_id: 'blossoming',
          title: 'Blossoming',
          description: 'Two months of strength',
          category: 'milestone' as const,
          rarity: 'legendary' as const,
          progress: 0,
          max_progress: 60,
          is_unlocked: false,
        },
        {
          achievement_id: 'the-oak',
          title: 'The Oak',
          description: 'Three months of resilience',
          category: 'milestone' as const,
          rarity: 'legendary' as const,
          progress: 0,
          max_progress: 90,
          is_unlocked: false,
        },
        {
          achievement_id: 'conqueror',
          title: 'Conqueror',
          description: 'Six months of mastery',
          category: 'milestone' as const,
          rarity: 'legendary' as const,
          progress: 0,
          max_progress: 180,
          is_unlocked: false,
        },
      ];

      for (const achievement of defaultAchievements) {
        await supabase
          .from('user_achievements')
          .upsert({
            user_id: userId,
            ...achievement,
            created_at: now,
            updated_at: now,
          }, {
            onConflict: 'user_id,achievement_id'
          });
      }
    } catch (error) {
      console.error('Error initializing default achievements:', error);
      throw error;
    }
  }
}

export default new AchievementService();
