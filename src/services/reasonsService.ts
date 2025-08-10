import { supabase } from '../lib/supabase';

export interface Reason {
  id: string;
  text: string;
  createdAt: string;
  userId?: string;
}

class ReasonsService {
  private getUserId(): string {
    // For now, using a default user ID. In a real app, this would come from auth
    return 'default_user';
  }

  async getReasons(): Promise<Reason[]> {
    try {
      const userId = this.getUserId();
      
      // TODO: Replace with Supabase query when backend is ready
      // const { data, error } = await supabase
      //   .from('user_reasons')
      //   .select('*')
      //   .eq('user_id', userId)
      //   .order('created_at', { ascending: false });

      // For now, return mock data
      const mockReasons: Reason[] = [
        {
          id: '1',
          text: 'I want to have beautiful, healthy nails',
          createdAt: new Date().toISOString(),
          userId,
        },
        {
          id: '2',
          text: 'I want to stop the habit for good',
          createdAt: new Date().toISOString(),
          userId,
        },
      ];

      return mockReasons;
    } catch (error) {
      console.error('Error getting reasons:', error);
      return [];
    }
  }

  async addReason(text: string): Promise<Reason> {
    try {
      const userId = this.getUserId();
      
      const newReason: Reason = {
        id: Date.now().toString(),
        text: text.trim(),
        createdAt: new Date().toISOString(),
        userId,
      };

      // TODO: Save to Supabase when backend is ready
      // const { data, error } = await supabase
      //   .from('user_reasons')
      //   .insert([newReason])
      //   .select()
      //   .single();

      // if (error) throw error;
      // return data;

      return newReason;
    } catch (error) {
      console.error('Error adding reason:', error);
      throw error;
    }
  }

  async deleteReason(id: string): Promise<void> {
    try {
      const userId = this.getUserId();
      
      // TODO: Delete from Supabase when backend is ready
      // const { error } = await supabase
      //   .from('user_reasons')
      //   .delete()
      //   .eq('id', id)
      //   .eq('user_id', userId);

      // if (error) throw error;
    } catch (error) {
      console.error('Error deleting reason:', error);
      throw error;
    }
  }

  async updateReason(id: string, text: string): Promise<Reason> {
    try {
      const userId = this.getUserId();
      
      // TODO: Update in Supabase when backend is ready
      // const { data, error } = await supabase
      //   .from('user_reasons')
      //   .update({ text: text.trim(), updated_at: new Date().toISOString() })
      //   .eq('id', id)
      //   .eq('user_id', userId)
      //   .select()
      //   .single();

      // if (error) throw error;
      // return data;

      return {
        id,
        text: text.trim(),
        createdAt: new Date().toISOString(),
        userId,
      };
    } catch (error) {
      console.error('Error updating reason:', error);
      throw error;
    }
  }
}

export default new ReasonsService();
