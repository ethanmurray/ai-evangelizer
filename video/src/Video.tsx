import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { COLORS } from "./theme";
import { IntroHook } from "./scenes/IntroHook";
import { ProblemStatement } from "./scenes/ProblemStatement";
import { TheSolution } from "./scenes/TheSolution";
import { RankProgression } from "./scenes/RankProgression";
import { ViralityNetwork } from "./scenes/ViralityNetwork";
import { CallToAction } from "./scenes/CallToAction";

export const Video: React.FC = () => {
  const frame = useCurrentFrame();

  // Volume builds cinematically: quiet intro → crescendo at ranks/virality → holds for CTA
  const volume = interpolate(
    frame,
    [0, 105, 420, 600, 750, 870, 900],
    [0.3, 0.5, 0.7, 0.9, 1.0, 1.0, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Background music — place your .mp3 in video/public/music.mp3 */}
      <Audio src={staticFile("music.mp3")} volume={volume} />

      <Sequence from={0} durationInFrames={105} name="Intro Hook">
        <IntroHook />
      </Sequence>
      <Sequence from={105} durationInFrames={135} name="Problem Statement">
        <ProblemStatement />
      </Sequence>
      <Sequence from={240} durationInFrames={180} name="The Solution">
        <TheSolution />
      </Sequence>
      <Sequence from={420} durationInFrames={180} name="Rank Progression">
        <RankProgression />
      </Sequence>
      <Sequence from={600} durationInFrames={150} name="Virality Network">
        <ViralityNetwork />
      </Sequence>
      <Sequence from={750} durationInFrames={150} name="Call to Action">
        <CallToAction />
      </Sequence>
    </AbsoluteFill>
  );
};
