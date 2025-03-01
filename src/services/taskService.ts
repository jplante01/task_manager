// services/taskService.ts
import { supabase } from '../lib/supabase';

export interface Task {
  id: string;
  user_id: string;
  description: string;
  completed: boolean;
  starred: boolean;
  created_at: string;
}

export const taskService = {
  // Get all tasks for current user
  getTasks: async (): Promise<Task[]> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  },
  
  // Create a new task
  createTask: async (description: string): Promise<Task> => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ description }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Update a task
  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  }
};