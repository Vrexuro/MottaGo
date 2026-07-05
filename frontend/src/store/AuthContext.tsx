import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';
import type { UserRole } from '../types/user.types';

interface ProfileRow {
  role: string;
  store_id: number | null;
  full_name: string | null;
}

export interface ProfileData {
  role: UserRole;
  storeId: number | null;
  fullName: string | null;
}

export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: ProfileData | null;
  logout: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

async function fetchProfile(userId: string): Promise<ProfileData | null> {
  const { data } = await supabase
    .from('profiles')
    .select('role, store_id, full_name')
    .eq('id', userId)
    .single();

  if (!data) return null;

  const row = data as ProfileRow;
  return {
    role: row.role as UserRole,
    storeId: row.store_id,
    fullName: row.full_name,
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  useEffect(() => {
    authService.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const p = await fetchProfile(session.user.id);
        setProfile(p);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const p = await fetchProfile(session.user.id);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, profile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
