'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useNotifications } from '@/hooks/useNotifications';

function formatTime(dateStr: string): string {
  // Simple relative time for notifications
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function NotificationBell() {
  const { user } = useAuth();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications(user?.id);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-1.5 rounded-lg hover:opacity-80 transition-opacity"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
            style={{ background: 'var(--color-error)', color: '#fff' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-72 rounded-lg border shadow-xl z-50 overflow-hidden"
          style={{
            background: 'var(--color-bg-elevated)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex justify-between items-center px-3 py-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <span className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Notifications</span>
            {unreadCount > 0 && (
              <button
                className="text-xs"
                style={{ color: 'var(--color-primary)' }}
                onClick={() => markAllRead()}
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="text-xs text-center py-4" style={{ color: 'var(--color-text-muted)' }}>
                No notifications
              </p>
            )}
            {notifications.map((n) => (
              <button
                key={n.id}
                className="w-full text-left px-3 py-2 border-b last:border-0 hover:opacity-80 transition-opacity"
                style={{
                  borderColor: 'var(--color-border)',
                  background: n.is_read ? 'transparent' : 'var(--color-bg-surface)',
                }}
                onClick={() => {
                  if (!n.is_read) markRead(n.id);
                }}
              >
                <p className="text-xs font-bold" style={{ color: n.is_read ? 'var(--color-text-muted)' : 'var(--color-primary)' }}>
                  {n.title}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  {n.body}
                </p>
                <p className="text-[10px] mt-1" style={{ color: 'var(--color-text-muted)' }}>
                  {formatTime(n.created_at)}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
