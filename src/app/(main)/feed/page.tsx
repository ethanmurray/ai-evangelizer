'use client';

import React, { useState } from 'react';
import { useTheme } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { ActivityFeedItem } from '@/components/ui/ActivityFeedItem';
import { Button } from '@/components/ui/Button';

export default function FeedPage() {
  const { t } = useTheme();
  const { user } = useAuth();
  const [teamFilter, setTeamFilter] = useState<string | undefined>(undefined);
  const { events, isLoading, hasMore, loadMore } = useActivityFeed(teamFilter);

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold animate-flicker">{t.concepts.activityFeed}</h1>
        <div className="flex gap-2">
          <Button
            variant={teamFilter === undefined ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setTeamFilter(undefined)}
          >
            All
          </Button>
          {user?.team && (
            <Button
              variant={teamFilter === user.team ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setTeamFilter(user.team)}
            >
              My Team
            </Button>
          )}
        </div>
      </div>

      {isLoading && events.length === 0 && (
        <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
          Loading...
        </div>
      )}

      {!isLoading && events.length === 0 && (
        <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
          {t.microcopy.feedEmpty}
        </div>
      )}

      <div className="space-y-3">
        {events.map((event) => (
          <ActivityFeedItem key={event.id} event={event} />
        ))}
      </div>

      {hasMore && events.length > 0 && (
        <div className="text-center">
          <Button variant="ghost" onClick={loadMore}>
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
