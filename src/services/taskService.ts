// services/taskService.ts
import { supabase } from '../lib/supabase';
import { Task } from '../types/task';

export const taskService = {
  // Get all tasks for current user
  async getTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Task[];
  },

  // Create a new task
  async createTask(description: string, userId: string): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          description,
          user_id: userId,
          completed: false,
          starred: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  // Update a task
  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  // Delete a task
  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) throw error;
  },
};

export type { Task };
