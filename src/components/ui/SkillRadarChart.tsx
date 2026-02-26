'use client';

import React from 'react';
import { useTheme } from '@/lib/theme';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { SkillRadarPoint } from '@/lib/data/skill-radar';
import { Card } from './Card';

interface SkillRadarChartProps {
  data: SkillRadarPoint[];
  isLoading: boolean;
}

export function SkillRadarChart({ data, isLoading }: SkillRadarChartProps) {
  const { t } = useTheme();

  if (isLoading) {
    return (
      <Card>
        <h2 className="text-sm font-bold mb-2" style={{ color: 'var(--color-secondary)' }}>
          {t.concepts.skillRadar}
        </h2>
        <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
          Loading...
        </div>
      </Card>
    );
  }

  const hasData = data.some((d) => d.score > 0);

  return (
    <Card>
      <h2 className="text-sm font-bold mb-2" style={{ color: 'var(--color-secondary)' }}>
        {t.concepts.skillRadar}
      </h2>

      {!hasData ? (
        <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-muted)' }}>
          Start learning to see your skill profile!
        </p>
      ) : (
        <div style={{ width: '100%', minHeight: 300 }}>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis
                dataKey="label"
                tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
              />
              <Radar
                name="Skills"
                dataKey="score"
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
