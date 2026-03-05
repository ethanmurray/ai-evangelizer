import { interpolate, type SpringConfig } from "remotion";

// Preset springs for consistent motion
export const SPRING_SNAPPY: SpringConfig = {
  damping: 15,
  stiffness: 200,
  mass: 0.5,
  overshootClamping: false,
};

export const SPRING_GENTLE: SpringConfig = {
  damping: 20,
  stiffness: 120,
  mass: 0.8,
  overshootClamping: false,
};

// Flicker effect — replicates the animate-flicker CSS keyframe from globals.css
// Returns an opacity value (0-1) based on frame position within a cycle
export function flickerOpacity(frame: number, period: number = 120): number {
  const pos = (frame % period) / period;
  if (pos >= 0.92 && pos < 0.93) return 0.8;
  if (pos >= 0.93 && pos < 0.94) return 1;
  if (pos >= 0.96 && pos < 0.97) return 0.6;
  return 1;
}

// Returns the number of characters to show for a typewriter effect
export function typedCharCount(
  frame: number,
  text: string,
  charsPerSecond: number = 20,
  fps: number = 30,
): number {
  const framesPerChar = fps / charsPerSecond;
  return Math.min(Math.floor(frame / framesPerChar), text.length);
}

// Fade in: 0 → 1 over a frame range
export function fadeIn(
  frame: number,
  startFrame: number = 0,
  duration: number = 15,
): number {
  return interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// Fade out: 1 → 0 over a frame range
export function fadeOut(
  frame: number,
  startFrame: number,
  duration: number = 15,
): number {
  return interpolate(frame, [startFrame, startFrame + duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// Glow pulse — returns a multiplier (1-3) for box-shadow spread
export function glowPulse(frame: number, period: number = 60): number {
  return interpolate(
    Math.sin((frame / period) * Math.PI * 2),
    [-1, 1],
    [1, 3],
  );
}
