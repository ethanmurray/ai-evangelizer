import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../theme";

interface RedLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  startFrame: number;
  duration?: number;
}

export const RedLine: React.FC<RedLineProps> = ({
  x1,
  y1,
  x2,
  y2,
  startFrame,
  duration = 20,
}) => {
  const frame = useCurrentFrame();
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const dashOffset = length * (1 - progress);

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={COLORS.primary}
      strokeWidth={2.5}
      strokeDasharray={length}
      strokeDashoffset={dashOffset}
      opacity={progress > 0 ? 1 : 0}
    />
  );
};
