import { useState, useEffect, useCallback } from 'react';
import { notificationService, type Notification } from '../services/notificationService';

export interface UseNotificationReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useNotification(storeId: number): UseNotificationReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationService.getNotifications(storeId);
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat notifikasi');
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    void fetchAll();
    const id = setInterval(() => void fetchAll(), 30_000);
    return () => clearInterval(id);
  }, [fetchAll]);

  const markAsRead = useCallback(async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return { notifications, unreadCount, loading, error, markAsRead, refresh: fetchAll };
}
