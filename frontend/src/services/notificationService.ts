import { supabase } from '../lib/supabase';

// ── Domain types ──────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  type: 'capacity_alert' | 'pickup_status' | 'system';
  title: string;
  body: string;
  severity: 'info' | 'warning' | 'critical' | null;
  isRead: boolean;
  createdAt: string;
}

// ── Internal helpers ──────────────────────────────────────────────────────────

interface NotificationRow {
  id: string;
  type: Notification['type'];
  title: string;
  body: string;
  severity: Notification['severity'];
  is_read: boolean;
  created_at: string;
}

function mapRow(row: NotificationRow): Notification {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    severity: row.severity,
    isRead: row.is_read,
    createdAt: row.created_at,
  };
}

// ── Service ───────────────────────────────────────────────────────────────────

export const notificationService = {
  getNotifications: async (storeId: number): Promise<Notification[]> => {
    const { data, error } = await supabase
      .from('notifications')
      .select('id, type, title, body, severity, is_read, created_at')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) return [];

    return ((data ?? []) as NotificationRow[]).map(mapRow);
  },

  markAsRead: async (notifId: string): Promise<void> => {
    await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notifId);
  },

  getUnreadCount: async (storeId: number): Promise<number> => {
    const { count } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('store_id', storeId)
      .eq('is_read', false);

    return count ?? 0;
  },
};
