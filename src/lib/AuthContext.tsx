import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface SessionUser {
  id: string;
  email: string;
  firstName?: string;
  primaryEmailAddress?: {
    emailAddress: string;
  };
}

interface AuthState {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: SessionUser | null;
  supabaseUser: User | null;
  session: Session | null;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoaded: false,
    isSignedIn: false,
    user: null,
    supabaseUser: null,
    session: null,
  });

  const mapUser = (sbUser: User | null): SessionUser | null => {
    if (!sbUser) return null;
    const emailStr = sbUser.email || '';
    return {
      id: sbUser.id,
      email: emailStr,
      firstName: emailStr.split('@')[0] || 'Bruker',
      primaryEmailAddress: {
        emailAddress: emailStr,
      },
    };
  };

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const sbUser = session?.user ?? null;
      setState({
        isLoaded: true,
        isSignedIn: !!sbUser,
        user: mapUser(sbUser),
        supabaseUser: sbUser,
        session,
      });
    });

    // 2. Listen to authentication changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const sbUser = session?.user ?? null;
      setState({
        isLoaded: true,
        isSignedIn: !!sbUser,
        user: mapUser(sbUser),
        supabaseUser: sbUser,
        session,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Map useUser() helper hook directly to simulate the Clerk interface
export function useUser() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useUser must be used within an AuthProvider');
  }
  return {
    isLoaded: context.isLoaded,
    isSignedIn: context.isSignedIn,
    user: context.user,
  };
}
