import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation
        },
    });
    return { data, error };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  const signOut = async () => {
    try {
    const { error } = await supabase.auth.signOut();
    return { error };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };
}