import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isAnonymous: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
};

// Create the context
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session only
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      // Check if user is anonymous based on metadata
      setIsAnonymous(session?.user?.app_metadata?.provider === 'anonymous');
      setLoading(false);
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Manually update auth state after successful login
    setSession(data.session);
    setUser(data.user);
    setIsAnonymous(data.user?.app_metadata?.provider === 'anonymous');
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    // Manually update auth state if session is available (auto-confirm enabled)
    if (data.session) {
      setSession(data.session);
      setUser(data.user);
      setIsAnonymous(false);
    }
  };

  const signInAnonymously = async () => {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;

    // Manually update auth state
    setSession(data.session);
    setUser(data.user);
    setIsAnonymous(true);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Manually clear auth state
    setSession(null);
    setUser(null);
    setIsAnonymous(false);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isAnonymous,
        loading,
        signIn,
        signUp,
        signInAnonymously,
        signOut,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Export the hook to use this context
export const useAuth = () => useContext(AuthContext);
