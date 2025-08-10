import { supabase, TriggerEntry } from '../lib/supabase';
import sessionService from './sessionService';

export interface TriggerStats {
  totalEpisodes: number;
  thisWeek: number;
  mostCommonTime: string;
  mostCommonTrigger: string;
  mostCommonTriggerCount: number;
}

class TriggerService {
  // Save a new trigger entry
  async saveTrigger(trigger: string, details?: string): Promise<void> {
    try {
      const userId = await sessionService.getCurrentUserId();
      const now = new Date().toISOString();

      const entry = {
        user_id: userId,
        trigger,
        emoji: this.getTriggerEmoji(trigger),
        timestamp: now,
        details,
      };

      const { error } = await supabase
        .from('trigger_entries')
        .insert(entry);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving trigger:', error);
      throw error;
    }
  }

  // Get all trigger history for current user
  async getTriggerHistory(): Promise<TriggerEntry[]> {
    try {
      const userId = await sessionService.getCurrentUserId();

      const { data, error } = await supabase
        .from('trigger_entries')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting trigger history:', error);
      return [];
    }
  }

  // Calculate statistics from trigger history
  calculateStats(history: TriggerEntry[]): TriggerStats {
    const triggerCounts: { [key: string]: number } = {};
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    let thisWeekCount = 0;
    const timeCounts: { [key: string]: number } = {};
    
    history.forEach(entry => {
      // Count total episodes by trigger
      triggerCounts[entry.trigger] = (triggerCounts[entry.trigger] || 0) + 1;
      
      // Count this week's episodes
      const entryDate = new Date(entry.timestamp);
      if (entryDate >= oneWeekAgo) {
        thisWeekCount++;
      }

      // Count by time of day
      const hour = entryDate.getHours();
      let timeOfDay = '';
      if (hour >= 6 && hour < 12) timeOfDay = 'Morning';
      else if (hour >= 12 && hour < 18) timeOfDay = 'Afternoon';
      else if (hour >= 18 && hour < 22) timeOfDay = 'Evening';
      else timeOfDay = 'Night';
      
      timeCounts[timeOfDay] = (timeCounts[timeOfDay] || 0) + 1;
    });

    const mostCommonTrigger = Object.keys(triggerCounts).reduce((a, b) => 
      triggerCounts[a] > triggerCounts[b] ? a : b
    ) || 'None';

    const mostCommonTime = Object.keys(timeCounts).reduce((a, b) => 
      timeCounts[a] > timeCounts[b] ? a : b
    ) || 'Evening';

    return {
      totalEpisodes: history.length,
      thisWeek: thisWeekCount,
      mostCommonTime,
      mostCommonTrigger,
      mostCommonTriggerCount: triggerCounts[mostCommonTrigger] || 0,
    };
  }

  // Get filtered history
  getFilteredHistory(history: TriggerEntry[], filter: string): TriggerEntry[] {
    if (filter === 'all') {
      return history;
    }
    return history.filter(entry => entry.trigger.toLowerCase() === filter.toLowerCase());
  }

  // Get trigger emoji
  getTriggerEmoji(trigger: string): string {
    const emojiMap: { [key: string]: string } = {
      'anxiety': '😰',
      'stress': '😰',
      'boredom': '😐',
      'nervousness': '😬',
      'habit': '🤔',
      'other': '❓',
    };
    return emojiMap[trigger.toLowerCase()] || '❓';
  }

  // Clear all trigger history (for testing/reset)
  async clearHistory(): Promise<void> {
    try {
      const userId = await sessionService.getCurrentUserId();
      
      const { error } = await supabase
        .from('trigger_entries')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error clearing trigger history:', error);
      throw error;
    }
  }
}

export default new TriggerService(); 