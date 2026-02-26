'use client';

import React from 'react';
import Link from 'next/link';
import { ActivityEvent, formatRelativeTime } from '@/lib/data/activity';
import { Card } from './Card';

const eventIcons: Record<string, string> = {
  learned: '\uD83D\uDC41\uFE0F',
  applied: '\u2699\uFE0F',
  shared: '\uD83D\uDCE8',
  submitted: '\u2728',
  rank_up: '\uD83C\uDF1F',
  team_milestone: '\uD83C\uDFC6',
};

function getEventText(event: ActivityEvent): string {
  switch (event.event_type) {
    case 'learned':
      return `${event.actor_name} learned`;
    case 'applied':
      return `${event.actor_name} applied`;
    case 'shared':
      return `${event.actor_name} shared`;
    case 'submitted':
      return `${event.actor_name} submitted`;
    case 'rank_up':
      return `${event.actor_name} ranked up to ${event.metadata?.rank || 'a new rank'}`;
    case 'team_milestone':
      return `Team ${event.team} reached ${event.metadata?.points || '?'} points`;
    default:
      return `${event.actor_name} did something`;
  }
}

export function ActivityFeedItem({ event }: { event: ActivityEvent }) {
  const icon = eventIcons[event.event_type] || '\uD83D\uDD35';
  const text = getEventText(event);
  const timeAgo = formatRelativeTime(event.created_at);

  return (
    <Card className="flex items-start gap-3">
      <span className="text-lg flex-shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span style={{ color: 'var(--color-text)' }}>{text}</span>
          {event.use_case_title && event.use_case_id && (
            <>
              {' '}
              <Link
                href={`/library/${event.use_case_id}`}
                className="font-medium hover:underline"
                style={{ color: 'var(--color-primary)' }}
              >
                {event.use_case_title}
              </Link>
            </>
          )}
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
          {timeAgo}
        </p>
      </div>
    </Card>
  );
}
