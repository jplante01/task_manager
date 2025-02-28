import { Session, User } from '@supabase/supabase-js';

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  loading: boolean;
}; 