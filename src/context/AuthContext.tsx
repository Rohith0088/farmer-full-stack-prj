import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, User, AuthError } from '@supabase/supabase-js';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  age: string;
  city: string;
  area: string;
  role: 'customer' | 'farmer';
  avatar_url?: string;
  created_at?: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, fullName: string, phone: string, age: string, city: string, area: string, role: 'customer' | 'farmer') => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
  });

  /* ---------- fetch profile from "profiles" table ---------- */
  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const result = await Promise.race([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single(),
        new Promise<{ data: null; error: { message: string } }>(resolve =>
          setTimeout(() => resolve({ data: null, error: { message: 'Profile fetch timed out' } }), 4000)
        ),
      ]);

      const { data, error } = result as { data: any; error: any };

      if (error) {
        console.error('Error fetching profile:', error.message);
        return null;
      }
      return data as UserProfile;
    } catch {
      return null;
    }
  }, []);

  /* ---------- listen to auth state changes ---------- */
  useEffect(() => {
    let mounted = true;

    // Safety timeout: never show spinner for more than 5 seconds
    const safetyTimer = setTimeout(() => {
      if (mounted) {
        setState(prev => (prev.loading ? { ...prev, loading: false } : prev));
      }
    }, 5000);

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        // Set user immediately so UI renders, then fetch profile in background
        setState({ user: session.user, profile: null, session, loading: false });
        const profile = await fetchProfile(session.user.id);
        if (mounted && profile) {
          setState(prev => ({ ...prev, profile }));
        }
      } else {
        setState({ user: null, profile: null, session: null, loading: false });
      }
    }).catch(() => {
      if (mounted) {
        setState({ user: null, profile: null, session: null, loading: false });
      }
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        // On sign-out, clear immediately — no network calls needed
        if (event === 'SIGNED_OUT' || !session?.user) {
          setState({ user: null, profile: null, session: null, loading: false });
          return;
        }

        // For sign-in / token refresh, set user immediately then fetch profile
        setState(prev => ({ ...prev, user: session.user, session, loading: false }));
        const profile = await fetchProfile(session.user.id);
        if (mounted && profile) {
          setState(prev => ({ ...prev, profile }));
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  /* ---------- sign up ---------- */
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    age: string,
    city: string,
    area: string,
    role: 'customer' | 'farmer'
  ): Promise<{ error: AuthError | null }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone, age, city, area, role },
      },
    });

    if (!error && data.user) {
      // Upsert profile row
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        phone,
        age,
        city,
        area,
        role,
      });
    }

    return { error };
  };

  /* ---------- sign in ---------- */
  const signIn = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  /* ---------- sign out ---------- */
  const signOut = async (): Promise<void> => {
    // Clear state IMMEDIATELY so UI updates instantly
    setState({ user: null, profile: null, session: null, loading: false });
    // Then fire the network call in background (don't block UI)
    try {
      await Promise.race([
        supabase.auth.signOut(),
        new Promise(resolve => setTimeout(resolve, 3000)), // 3s max wait
      ]);
    } catch {
      // Ignore errors — state is already cleared
    }
  };

  /* ---------- update profile ---------- */
  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ error: Error | null }> => {
    if (!state.user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', state.user.id);

    if (!error) {
      setState(prev => ({
        ...prev,
        profile: prev.profile ? { ...prev.profile, ...updates } : null,
      }));
    }

    return { error };
  };

  return (
    <AuthContext.Provider value={{ ...state, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
