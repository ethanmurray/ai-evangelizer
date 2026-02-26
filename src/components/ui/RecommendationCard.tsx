'use client';

import React from 'react';
import Link from 'next/link';
import { Recommendation } from '@/lib/data/recommendations';
import { Card } from './Card';
import { LabelPill } from './LabelPill';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <Link href={`/library/${recommendation.id}`}>
      <Card hoverable className="mb-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
              {recommendation.title}
            </h3>
            <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
              {recommendation.reason}
            </p>
            {recommendation.labels.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {recommendation.labels.slice(0, 3).map((label) => (
                  <LabelPill key={label} label={label} size="sm" />
                ))}
              </div>
            )}
          </div>
          {recommendation.upvote_count > 0 && (
            <span className="text-xs whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
              {recommendation.upvote_count} upvotes
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}
