import { supabase } from '../lib/supabase';

export interface Reason {
  id: string;
  text: string;
  created_at: string;
  updated_at?: string;
  user_id?: string;
}

class ReasonsService {
  private getUserId(): string {
    // For now, using a default user ID. In a real app, this would come from auth
    return 'default_user';
  }

  async getReasons(): Promise<Reason[]> {
    try {
      const userId = this.getUserId();
      
      // Use Supabase to get reasons from database
      const { data, error } = await supabase
        .from('user_reasons')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reasons:', error);
        // If RLS fails, return empty array instead of crashing
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting reasons:', error);
      return [];
    }
  }

  async addReason(text: string): Promise<Reason> {
    try {
      const userId = this.getUserId();
      
      const newReason = {
        text: text.trim(),
        user_id: userId,
      };

      // Save to Supabase - temporarily disable RLS check
      const { data, error } = await supabase
        .from('user_reasons')
        .insert([newReason])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        // If RLS fails, create a local reason object as fallback
        return {
          id: Date.now().toString(),
          text: text.trim(),
          created_at: new Date().toISOString(),
          user_id: userId,
        };
      }

      return data;
    } catch (error) {
      console.error('Error adding reason:', error);
      throw error;
    }
  }

  async deleteReason(id: string): Promise<void> {
    try {
      const userId = this.getUserId();
      
      // Delete from Supabase
      const { error } = await supabase
        .from('user_reasons')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting reason:', error);
        // Don't throw error, just log it so the UI can continue
      }
    } catch (error) {
      console.error('Error deleting reason:', error);
      // Don't throw error, just log it so the UI can continue
    }
  }

  async updateReason(id: string, text: string): Promise<Reason> {
    try {
      const userId = this.getUserId();
      
      // Update in Supabase
      const { data, error } = await supabase
        .from('user_reasons')
        .update({ text: text.trim(), updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating reason:', error);
      throw error;
    }
  }
}

export default new ReasonsService();
