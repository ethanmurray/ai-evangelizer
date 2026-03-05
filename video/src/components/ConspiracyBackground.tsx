import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../theme";

export const ConspiracyBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const offsetX = interpolate(frame, [0, 900], [0, -50]);
  const offsetY = interpolate(frame, [0, 900], [0, -30]);

  return (
    <AbsoluteFill>
      {/* Base radial gradient */}
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse at 50% 50%, ${COLORS.bgSurface} 0%, ${COLORS.bg} 70%)`,
        }}
      />
      {/* Faint grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: -60,
          opacity: 0.06,
          backgroundImage: `
            linear-gradient(${COLORS.textMuted} 1px, transparent 1px),
            linear-gradient(90deg, ${COLORS.textMuted} 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: `translate(${offsetX}px, ${offsetY}px)`,
        }}
      />
      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
