import { supabase } from '../lib/supabase';

// ── Domain types ──────────────────────────────────────────────────────────────

export interface ProfileUser {
  id: string;
  fullName: string;
  username: string;
  role: 'manajer' | 'utility';
  createdAt: string;
}

// ── Internal helpers ──────────────────────────────────────────────────────────

interface ProfileRow {
  id: string;
  full_name: string;
  username: string;
  role: 'manajer' | 'utility';
  created_at: string;
}

function mapRow(row: ProfileRow): ProfileUser {
  return {
    id: row.id,
    fullName: row.full_name,
    username: row.username,
    role: row.role,
    createdAt: row.created_at,
  };
}

// ── Service ───────────────────────────────────────────────────────────────────

export const userService = {
  getUsersByStore: async (storeId: number): Promise<ProfileUser[]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, username, role, created_at')
      .eq('store_id', storeId)
      .order('role', { ascending: true })
      .order('full_name', { ascending: true });

    if (error) return [];

    return ((data ?? []) as ProfileRow[]).map(mapRow);
  },

  createUser: async (params: {
    username: string;
    fullName: string;
    password: string;
  }): Promise<{ id: string; username: string; fullName: string; role: string } | null> => {
    const { data, error } = await supabase.functions.invoke('create-user', {
      body: params,
    });

    if (error) {
      // Extract meaningful error message from Edge Function response
      let message = error.message;
      try {
        if ('context' in error && error.context instanceof Response) {
          const body = await (error.context as Response).json();
          message = (body as { error?: string }).error ?? message;
        }
      } catch {
        // keep original message if parsing fails
      }
      throw new Error(message);
    }

    return data as { id: string; username: string; fullName: string; role: string };
  },
};
