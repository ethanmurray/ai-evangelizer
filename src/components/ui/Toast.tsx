'use client';

import React, { useEffect, useState } from 'react';

interface ToastProps {
  title: string;
  body: string;
  onDismiss: () => void;
  duration?: number;
}

export function Toast({ title, body, onDismiss, duration = 5000 }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div
      className="pointer-events-auto rounded-lg border p-3 shadow-lg transition-all duration-300"
      style={{
        background: 'var(--color-bg-elevated)',
        borderColor: 'var(--color-primary)',
        transform: visible ? 'translateX(0)' : 'translateX(120%)',
        opacity: visible ? 1 : 0,
        maxWidth: '320px',
      }}
    >
      <p className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
        {title}
      </p>
      <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
        {body}
      </p>
    </div>
  );
}
