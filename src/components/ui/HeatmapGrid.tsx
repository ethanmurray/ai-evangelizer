'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/theme';
import { useHeatmap } from '@/hooks/useHeatmap';
import { Card } from './Card';
import { HeatLevel } from '@/lib/data/heatmap';

const heatColors: Record<HeatLevel, string> = {
  cold: '#9ca3af',   // gray
  cool: '#3b82f6',   // blue
  warm: '#eab308',   // yellow
  hot: '#ef4444',    // red
};

export function HeatmapGrid() {
  const { t } = useTheme();
  const { byLabel, isLoading } = useHeatmap();

  if (isLoading) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>Loading...</div>
    );
  }

  if (byLabel.length === 0) {
    return (
      <Card>
        <p className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
          No data available yet.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
        {t.microcopy.heatmapSubtitle}
      </p>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
        <span>Adoption:</span>
        {(['cold', 'cool', 'warm', 'hot'] as HeatLevel[]).map((level) => (
          <span key={level} className="flex items-center gap-1">
            <span
              className="w-3 h-3 rounded-sm inline-block"
              style={{ background: heatColors[level] }}
            />
            {level === 'cold' ? '0-10%' : level === 'cool' ? '10-30%' : level === 'warm' ? '30-60%' : '60%+'}
          </span>
        ))}
      </div>

      {/* Grouped by label */}
      {byLabel.map((group) => (
        <div key={group.label}>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-bold" style={{ color: 'var(--color-secondary)' }}>
              {group.label}
            </h3>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              ({group.cells.length} {t.concepts.useCasePlural.toLowerCase()}, avg {group.avgAdoption}%)
            </span>
          </div>
          <div className="space-y-1">
            {group.cells.map((cell) => (
              <Link key={cell.id} href={`/library/${cell.id}`} className="block">
                <div
                  className="flex items-center gap-3 rounded-lg px-3 py-2 hover:opacity-80 transition-opacity"
                  style={{ background: 'var(--color-bg-surface)' }}
                >
                  <span className="text-sm flex-1 truncate" style={{ color: 'var(--color-text)' }}>
                    {cell.title}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-24 h-3 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${cell.adoptionPercent}%`,
                          background: heatColors[cell.heatLevel],
                        }}
                      />
                    </div>
                    <span
                      className="text-xs w-8 text-right font-medium"
                      style={{ color: heatColors[cell.heatLevel] }}
                    >
                      {cell.adoptionPercent}%
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
