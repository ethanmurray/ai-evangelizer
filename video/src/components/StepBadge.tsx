import React from "react";
import { fontFamily } from "../fonts";
import { COLORS } from "../theme";

interface StepBadgeProps {
  icon: string;
  label: string;
  color: string;
  active?: boolean;
  scale?: number;
}

export const StepBadge: React.FC<StepBadgeProps> = ({
  icon,
  label,
  color,
  active = false,
  scale = 1,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: `3px solid ${active ? color : COLORS.border}`,
          backgroundColor: active ? COLORS.bgElevated : COLORS.bgSurface,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 48,
          boxShadow: active ? `0 0 20px ${color}, 0 0 40px ${color}40` : "none",
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontFamily: fontFamily.heading,
          fontSize: 28,
          color: active ? color : COLORS.textMuted,
          textAlign: "center",
        }}
      >
        {label}
      </div>
    </div>
  );
};
