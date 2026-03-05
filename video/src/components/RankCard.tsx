import React from "react";
import { fontFamily } from "../fonts";
import { COLORS } from "../theme";

interface RankCardProps {
  name: string;
  desc: string;
  glowIntensity?: number; // 0-1
  scale?: number;
}

export const RankCard: React.FC<RankCardProps> = ({
  name,
  desc,
  glowIntensity = 0,
  scale = 1,
}) => {
  const glowColor =
    glowIntensity > 0.6 ? COLORS.primary : COLORS.secondary;
  const spread = glowIntensity * 25;

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        padding: "28px 48px",
        borderRadius: 16,
        border: `2px solid ${glowIntensity > 0 ? glowColor : COLORS.border}`,
        backgroundColor: COLORS.bgSurface,
        boxShadow:
          glowIntensity > 0
            ? `0 0 ${spread}px ${glowColor}, 0 0 ${spread * 2}px ${glowColor}40`
            : "none",
        textAlign: "center",
        minWidth: 400,
      }}
    >
      <div
        style={{
          fontFamily: fontFamily.heading,
          fontSize: 48,
          color: COLORS.textHeading,
          marginBottom: 8,
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontFamily: fontFamily.body,
          fontSize: 24,
          color: COLORS.textMuted,
        }}
      >
        {desc}
      </div>
    </div>
  );
};
