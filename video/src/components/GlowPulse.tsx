import React from "react";
import { useCurrentFrame } from "remotion";
import { glowPulse } from "../lib/animations";
import { COLORS } from "../theme";

interface GlowPulseProps {
  children: React.ReactNode;
  color?: string;
  period?: number;
  borderRadius?: number;
  style?: React.CSSProperties;
}

export const GlowPulse: React.FC<GlowPulseProps> = ({
  children,
  color = COLORS.primary,
  period = 60,
  borderRadius = 12,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const spread = glowPulse(frame, period);

  return (
    <div
      style={{
        boxShadow: `0 0 ${5 * spread}px ${color}, 0 0 ${15 * spread}px ${color}`,
        borderRadius,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
