import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { ConspiracyBackground } from "../components/ConspiracyBackground";
import { FlickerText } from "../components/FlickerText";
import { GlowPulse } from "../components/GlowPulse";
import { fontFamily } from "../fonts";
import { COLORS, TAGLINE } from "../theme";
import { fadeIn, SPRING_SNAPPY } from "../lib/animations";

export const CallToAction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterOpacity = fadeIn(frame, 0, 10);

  // CTA text springs in at frame 10
  const ctaScale = spring({
    frame: frame - 10,
    fps,
    config: SPRING_SNAPPY,
  });
  const ctaOpacity = fadeIn(frame, 10, 15);

  // URL fades in at frame 60
  const urlOpacity = fadeIn(frame, 60, 20);

  // Tagline fades in at frame 85
  const taglineOpacity = fadeIn(frame, 85, 20);

  return (
    <AbsoluteFill>
      <ConspiracyBackground />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: enterOpacity,
        }}
      >
        {/* Main CTA */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `scale(${ctaScale})`,
          }}
        >
          <GlowPulse
            color={COLORS.primary}
            period={45}
            borderRadius={20}
            style={{
              padding: "24px 64px",
              backgroundColor: `${COLORS.primary}20`,
              border: `2px solid ${COLORS.primary}`,
            }}
          >
            <FlickerText
              text="Join The Cult"
              fontSize={88}
              flickerPeriod={80}
            />
          </GlowPulse>
        </div>

        {/* URL */}
        <div
          style={{
            marginTop: 48,
            opacity: urlOpacity,
            fontFamily: fontFamily.body,
            fontSize: 36,
            color: COLORS.text,
            letterSpacing: 2,
          }}
        >
          ai-evangelizer.vercel.app
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: 24,
            opacity: taglineOpacity,
            fontFamily: fontFamily.body,
            fontSize: 24,
            color: COLORS.textMuted,
            fontStyle: "italic",
          }}
        >
          {TAGLINE}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
