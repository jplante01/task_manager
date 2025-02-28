/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AuthContextType } from './AuthContext.types';

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthContextType['session']>(null);
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setLoading(true);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        setSession(session);
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  // Auth methods
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  // Expose session data and auth methods
  const value = {
    session,
    user,
    signOut,
    signIn,
    signUp,
    loading,
    // Add other auth methods as needed
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
