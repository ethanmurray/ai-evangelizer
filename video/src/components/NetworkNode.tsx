import React from "react";
import { COLORS } from "../theme";

interface NetworkNodeProps {
  x: number;
  y: number;
  scale?: number;
  glowIntensity?: number;
}

export const NetworkNode: React.FC<NetworkNodeProps> = ({
  x,
  y,
  scale = 1,
  glowIntensity = 0,
}) => {
  const size = 44 * scale;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Glow */}
      {glowIntensity > 0 && (
        <circle
          r={size / 2 + 8}
          fill="none"
          stroke={COLORS.primary}
          strokeWidth={2}
          opacity={glowIntensity * 0.6}
          filter="url(#glow)"
        />
      )}
      {/* Node circle */}
      <circle
        r={size / 2}
        fill={COLORS.bgElevated}
        stroke={COLORS.primary}
        strokeWidth={2.5}
      />
      {/* Person icon (simple silhouette) */}
      <circle cy={-6 * scale} r={7 * scale} fill={COLORS.text} />
      <ellipse
        cy={10 * scale}
        rx={11 * scale}
        ry={8 * scale}
        fill={COLORS.text}
      />
    </g>
  );
};
