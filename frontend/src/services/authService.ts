import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export const authService = {
  signIn: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),

  signOut: () => supabase.auth.signOut(),

  getSession: () => supabase.auth.getSession(),

  getCurrentUser: () => supabase.auth.getUser(),

  onAuthStateChange: (callback: (event: AuthChangeEvent, session: Session | null) => void) =>
    supabase.auth.onAuthStateChange(callback),
};
