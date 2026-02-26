'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { LabelPill } from '@/components/ui/LabelPill';
import type { TrendingUseCase } from '@/lib/data/trending';

interface TrendingCardProps {
  item: TrendingUseCase;
}

export function TrendingCard({ item }: TrendingCardProps) {
  return (
    <Link href={`/library/${item.id}`}>
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="font-medium text-sm truncate" style={{ color: 'var(--color-text)' }}>
              {item.title}
            </div>
            {item.labels.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {item.labels.slice(0, 3).map((label) => (
                  <LabelPill key={label} label={label} size="sm" />
                ))}
              </div>
            )}
          </div>
          <div
            className="text-sm font-bold shrink-0 flex items-center gap-1"
            style={{ color: 'var(--color-primary)' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
            {item.recentUpvotes}
          </div>
        </div>
      </Card>
    </Link>
  );
}
