import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { ConspiracyBackground } from "../components/ConspiracyBackground";
import { RankCard } from "../components/RankCard";
import { fontFamily } from "../fonts";
import { COLORS, RANKS } from "../theme";
import { fadeIn, fadeOut, SPRING_GENTLE } from "../lib/animations";

// Each rank gets ~25 frames of focus
const RANK_FRAME_DURATION = 25;
const RANK_START_FRAME = 15;

export const RankProgression: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = fadeIn(frame, 0, 12);
  const exitOpacity = fadeOut(frame, 162, 17);

  // Determine which rank is currently shown
  const rankFrame = frame - RANK_START_FRAME;
  const rawIndex = rankFrame / RANK_FRAME_DURATION;
  const currentIndex = Math.min(
    Math.max(0, Math.floor(rawIndex)),
    RANKS.length - 1,
  );

  // Spring for the current rank card entrance
  const cardEntrance = spring({
    frame: rankFrame - currentIndex * RANK_FRAME_DURATION,
    fps,
    config: SPRING_GENTLE,
  });

  // Glow increases with rank
  const glowIntensity = currentIndex / (RANKS.length - 1);

  // Scale increases slightly per rank
  const baseScale = interpolate(currentIndex, [0, RANKS.length - 1], [0.85, 1.15]);
  const scale = baseScale * cardEntrance;

  // Points counter
  const currentRank = RANKS[currentIndex];
  const points = interpolate(
    frame,
    [RANK_START_FRAME, RANK_START_FRAME + RANKS.length * RANK_FRAME_DURATION],
    [0, 210],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      <ConspiracyBackground />
      <AbsoluteFill style={{ opacity: exitOpacity }}>
        {/* Header */}
        <div
          style={{
            position: "absolute",
            top: 120,
            width: "100%",
            textAlign: "center",
            fontFamily: fontFamily.heading,
            fontSize: 52,
            color: COLORS.textHeading,
            opacity: headerOpacity,
          }}
        >
          Rise Through the Ranks
        </div>

        {/* Rank card */}
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {rankFrame >= 0 && (
            <RankCard
              name={currentRank.name}
              desc={currentRank.desc}
              glowIntensity={glowIntensity}
              scale={scale}
            />
          )}
        </AbsoluteFill>

        {/* Points counter */}
        <div
          style={{
            position: "absolute",
            bottom: 120,
            width: "100%",
            textAlign: "center",
            fontFamily: fontFamily.body,
            fontSize: 28,
            color: COLORS.textMuted,
            opacity: headerOpacity,
          }}
        >
          <span style={{ color: COLORS.secondary, fontSize: 36, fontWeight: 700 }}>
            {Math.round(points)}
          </span>{" "}
          points
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
