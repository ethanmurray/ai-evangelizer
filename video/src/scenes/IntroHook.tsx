import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { ConspiracyBackground } from "../components/ConspiracyBackground";
import { FlickerText } from "../components/FlickerText";
import { fontFamily } from "../fonts";
import { COLORS, APP_NAME, TAGLINE } from "../theme";
import { fadeIn, fadeOut, SPRING_SNAPPY } from "../lib/animations";

export const IntroHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title springs in at frame 20
  const titleScale = spring({
    frame: frame - 20,
    fps,
    config: SPRING_SNAPPY,
  });
  const titleOpacity = fadeIn(frame, 20, 20);

  // Tagline fades in at frame 55
  const taglineOpacity = fadeIn(frame, 55, 20);

  // Everything fades out at frame 88
  const exitOpacity = fadeOut(frame, 88, 16);

  return (
    <AbsoluteFill>
      <ConspiracyBackground />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: exitOpacity,
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
          }}
        >
          <FlickerText text={APP_NAME} fontSize={96} />
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: taglineOpacity,
            marginTop: 24,
            fontFamily: fontFamily.body,
            fontSize: 32,
            color: COLORS.textMuted,
            textAlign: "center",
          }}
        >
          {TAGLINE}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
