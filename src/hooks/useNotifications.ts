'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchRecentNotifications,
  markNotificationRead,
  markAllRead as markAllReadApi,
  Notification,
} from '@/lib/data/notifications';

export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    const recent = await fetchRecentNotifications(userId);
    setNotifications(recent);
    setUnreadCount(recent.filter((n) => !n.is_read).length);
  }, [userId]);

  useEffect(() => {
    load();
    // Poll every 30 seconds
    intervalRef.current = setInterval(load, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [load]);

  const markRead = useCallback(async (notificationId: string) => {
    await markNotificationRead(notificationId);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllRead = useCallback(async () => {
    if (!userId) return;
    await markAllReadApi(userId);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }, [userId]);

  return { notifications, unreadCount, markRead, markAllRead, refresh: load };
}
