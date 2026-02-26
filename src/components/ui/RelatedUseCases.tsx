'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/theme';
import { Recommendation } from '@/lib/data/recommendations';
import { Card } from './Card';
import { LabelPill } from './LabelPill';

interface RelatedUseCasesProps {
  related: Recommendation[];
  isLoading: boolean;
}

export function RelatedUseCases({ related, isLoading }: RelatedUseCasesProps) {
  const { t } = useTheme();

  if (isLoading || related.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text-heading)' }}>
        {t.concepts.related}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {related.map((rec) => (
          <Link key={rec.id} href={`/library/${rec.id}`}>
            <Card hoverable>
              <h3 className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
                {rec.title}
              </h3>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                {rec.reason}
              </p>
              {rec.labels.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {rec.labels.slice(0, 2).map((label) => (
                    <LabelPill key={label} label={label} size="sm" />
                  ))}
                </div>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
