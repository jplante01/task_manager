export interface Task {
  id: string;
  description: string;
  completed: boolean;
  starred: boolean;
  created_at: string;
  user_id: string;  // Add this for Supabase integration
} 