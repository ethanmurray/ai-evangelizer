'use client';

import React from 'react';
import { useTheme } from '@/lib/theme';
import { SkillRadarPoint } from '@/lib/data/skill-radar';
import { Card } from './Card';

interface SkillRadarChartProps {
  data: SkillRadarPoint[];
  isLoading: boolean;
}

const SIZE = 300;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RADIUS = 100;
const LEVELS = 4;

function polarToCartesian(angle: number, radius: number): [number, number] {
  // Start from top (-90°) and go clockwise
  const rad = ((angle - 90) * Math.PI) / 180;
  return [CX + radius * Math.cos(rad), CY + radius * Math.sin(rad)];
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
  const count = data.length;
  const angleStep = 360 / count;

  // Build the data polygon
  const dataPoints = data.map((d, i) => {
    const r = (d.score / 100) * RADIUS;
    return polarToCartesian(i * angleStep, r);
  });
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + ' Z';

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
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" style={{ maxWidth: SIZE }}>
          {/* Grid rings */}
          {Array.from({ length: LEVELS }, (_, i) => {
            const r = (RADIUS / LEVELS) * (i + 1);
            const points = Array.from({ length: count }, (_, j) =>
              polarToCartesian(j * angleStep, r)
            );
            const path = points.map((p, j) => `${j === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + ' Z';
            return (
              <path
                key={`ring-${i}`}
                d={path}
                fill="none"
                stroke="var(--color-border)"
                strokeWidth={1}
                opacity={0.5}
              />
            );
          })}

          {/* Axis lines */}
          {data.map((_, i) => {
            const [x, y] = polarToCartesian(i * angleStep, RADIUS);
            return (
              <line
                key={`axis-${i}`}
                x1={CX}
                y1={CY}
                x2={x}
                y2={y}
                stroke="var(--color-border)"
                strokeWidth={1}
                opacity={0.5}
              />
            );
          })}

          {/* Data polygon */}
          <path
            d={dataPath}
            fill="var(--color-primary)"
            fillOpacity={0.3}
            stroke="var(--color-primary)"
            strokeWidth={2}
          />

          {/* Data points */}
          {dataPoints.map((p, i) => (
            <circle
              key={`dot-${i}`}
              cx={p[0]}
              cy={p[1]}
              r={3}
              fill="var(--color-primary)"
            />
          ))}

          {/* Labels */}
          {data.map((d, i) => {
            const [x, y] = polarToCartesian(i * angleStep, RADIUS + 20);
            return (
              <text
                key={`label-${i}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--color-text-muted)"
                fontSize={11}
              >
                {d.label}
              </text>
            );
          })}
        </svg>
      )}
    </Card>
  );
}
