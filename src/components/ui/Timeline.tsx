'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/theme';
import { TimelineEvent, TimelineEventType } from '@/lib/data/timeline';
import { Card } from './Card';

const eventColors: Record<TimelineEventType, string> = {
  learned: 'var(--color-text-muted)',
  applied: 'var(--color-secondary)',
  shared: 'var(--color-success)',
  submitted: 'var(--color-warning)',
  completed: 'var(--color-primary)',
};

const eventLabels: Record<TimelineEventType, string> = {
  learned: 'Learned',
  applied: 'Applied',
  shared: 'Shared',
  submitted: 'Submitted',
  completed: 'Completed',
};

interface TimelineProps {
  events: TimelineEvent[];
  isLoading: boolean;
}

export function Timeline({ events, isLoading }: TimelineProps) {
  const { t } = useTheme();
  const [expanded, setExpanded] = useState(false);

  if (isLoading) return null;

  if (events.length === 0) {
    return (
      <Card>
        <h2 className="text-sm font-bold mb-2" style={{ color: 'var(--color-secondary)' }}>
          {t.concepts.timeline}
        </h2>
        <p className="text-sm py-2" style={{ color: 'var(--color-text-muted)' }}>
          {t.microcopy.timelineEmpty}
        </p>
      </Card>
    );
  }

  const displayEvents = expanded ? events : events.slice(0, 10);

  // Group by month
  const grouped: Record<string, TimelineEvent[]> = {};
  for (const event of displayEvents) {
    if (!grouped[event.month]) grouped[event.month] = [];
    grouped[event.month].push(event);
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-bold" style={{ color: 'var(--color-secondary)' }}>
          {t.concepts.timeline}
        </h2>
        {events.length > 10 && (
          <button
            className="text-xs"
            style={{ color: 'var(--color-primary)' }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show less' : `Show all (${events.length})`}
          </button>
        )}
      </div>

      <div className="relative pl-6">
        {/* Vertical line */}
        <div
          className="absolute left-2 top-0 bottom-0 w-0.5"
          style={{ background: 'var(--color-border)' }}
        />

        {Object.entries(grouped).map(([month, monthEvents]) => (
          <div key={month} className="mb-4">
            <h3 className="text-xs font-bold mb-2 -ml-6" style={{ color: 'var(--color-text-muted)' }}>
              {month}
            </h3>
            {monthEvents.map((event) => (
              <div key={event.id} className="relative mb-2 flex items-start gap-2">
                {/* Dot */}
                <div
                  className="absolute -left-[18px] top-1 w-3 h-3 rounded-full border-2"
                  style={{
                    borderColor: eventColors[event.type],
                    background: eventColors[event.type],
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-bold uppercase"
                      style={{ color: eventColors[event.type] }}
                    >
                      {eventLabels[event.type]}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                      {new Date(event.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <Link
                    href={`/library/${event.use_case_id}`}
                    className="text-sm hover:underline"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {event.use_case_title}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}
