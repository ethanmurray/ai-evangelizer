'use client';

import React from 'react';
import { useTheme } from '@/lib/theme';
import { Card } from '@/components/ui/Card';
import type { UseCasePeopleResult, UseCasePerson } from '@/lib/data/progress';

const STATUS_COLORS: Record<string, string> = {
  recruited: 'var(--color-success)',
  initiated: 'var(--color-secondary)',
  witnessed: 'var(--color-text-muted)',
};

function PersonAvatar({ name, color }: { name: string; color: string }) {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
      style={{ background: color, color: '#fff' }}
    >
      {(name || '?').charAt(0).toUpperCase()}
    </div>
  );
}

function buildMailtoHref(person: UseCasePerson, useCaseTitle: string): string {
  const subject = encodeURIComponent(`Help with ${useCaseTitle}`);
  const body = encodeURIComponent(
    `Hi ${person.name || 'there'},\n\nI saw that you have experience with "${useCaseTitle}" and was hoping you could help me learn more about it.\n\nThanks!`
  );
  return `mailto:${person.email}?subject=${subject}&body=${body}`;
}

interface PeopleWhoKnowThisProps {
  people: UseCasePeopleResult;
  totalCount: number;
  isLoading: boolean;
  useCaseTitle: string;
}

export function PeopleWhoKnowThis({
  people,
  totalCount,
  isLoading,
  useCaseTitle,
}: PeopleWhoKnowThisProps) {
  const { t } = useTheme();

  if (isLoading) {
    return (
      <Card>
        <div className="text-center py-4" style={{ color: 'var(--color-text-muted)' }}>
          Loading...
        </div>
      </Card>
    );
  }

  if (totalCount === 0) return null;

  const groups = [
    { key: 'recruited', label: t.concepts.step3, people: people.recruited, color: STATUS_COLORS.recruited },
    { key: 'initiated', label: t.concepts.step2, people: people.initiated, color: STATUS_COLORS.initiated },
    { key: 'witnessed', label: t.concepts.step1, people: people.witnessed, color: STATUS_COLORS.witnessed },
  ];

  return (
    <Card>
      <h2 className="text-sm font-bold mb-1" style={{ color: 'var(--color-secondary)' }}>
        People Who Know This ({totalCount})
      </h2>
      <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
        Click a name to email them for help with this {t.concepts.useCase.toLowerCase()}.
      </p>

      <div className="space-y-4">
        {groups.map((group) => {
          if (group.people.length === 0) return null;
          return (
            <div key={group.key}>
              <h3
                className="text-xs font-bold uppercase tracking-wide mb-2"
                style={{ color: group.color }}
              >
                {group.label} ({group.people.length})
              </h3>
              <div className="space-y-2">
                {group.people.map((person) => (
                  <a
                    key={person.user_id}
                    href={buildMailtoHref(person, useCaseTitle)}
                    className="flex items-center gap-3 rounded-lg p-2 hover:opacity-80 transition-opacity"
                    style={{
                      background: 'var(--color-bg-elevated)',
                      textDecoration: 'none',
                    }}
                  >
                    <PersonAvatar name={person.name} color={group.color} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
                        {person.name || person.email}
                        {person.has_interacted && (
                          <span
                            className="ml-2 text-xs"
                            style={{ color: 'var(--color-text-muted)' }}
                          >
                            (connected)
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>
                      &#9993;
                    </span>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
