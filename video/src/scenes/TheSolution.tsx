import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { ConspiracyBackground } from "../components/ConspiracyBackground";
import { StepBadge } from "../components/StepBadge";
import { RedLine } from "../components/RedLine";
import { fontFamily } from "../fonts";
import { COLORS, STEPS } from "../theme";
import { fadeIn, fadeOut, SPRING_SNAPPY } from "../lib/animations";

const STEP_Y = 540;
const STEP_POSITIONS = [560, 960, 1360]; // x positions for 3 steps

export const TheSolution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = fadeIn(frame, 0, 15);

  // Step 1 springs in at frame 20
  const step1Progress = spring({
    frame: frame - 20,
    fps,
    config: SPRING_SNAPPY,
  });

  // Step 2 springs in at frame 55
  const step2Progress = spring({
    frame: frame - 55,
    fps,
    config: SPRING_SNAPPY,
  });

  // Step 3 springs in at frame 90
  const step3Progress = spring({
    frame: frame - 90,
    fps,
    config: SPRING_SNAPPY,
  });

  const stepProgresses = [step1Progress, step2Progress, step3Progress];

  // "Indoctrinated" label appears after all steps
  const completionOpacity = fadeIn(frame, 130, 20);

  const exitOpacity = fadeOut(frame, 160, 19);

  return (
    <AbsoluteFill>
      <ConspiracyBackground />
      <AbsoluteFill style={{ opacity: exitOpacity }}>
        {/* Header */}
        <div
          style={{
            position: "absolute",
            top: 140,
            width: "100%",
            textAlign: "center",
            fontFamily: fontFamily.heading,
            fontSize: 56,
            color: COLORS.textHeading,
            opacity: headerOpacity,
          }}
        >
          The Ritual
        </div>

        {/* Red connecting lines (SVG overlay) */}
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {/* Line from step 1 to step 2 */}
          <RedLine
            x1={STEP_POSITIONS[0] + 70}
            y1={STEP_Y}
            x2={STEP_POSITIONS[1] - 70}
            y2={STEP_Y}
            startFrame={40}
            duration={15}
          />
          {/* Line from step 2 to step 3 */}
          <RedLine
            x1={STEP_POSITIONS[1] + 70}
            y1={STEP_Y}
            x2={STEP_POSITIONS[2] - 70}
            y2={STEP_Y}
            startFrame={75}
            duration={15}
          />
        </svg>

        {/* Step badges */}
        {STEPS.map((step, i) => (
          <div
            key={step.label}
            style={{
              position: "absolute",
              left: STEP_POSITIONS[i],
              top: STEP_Y,
              transform: `translate(-50%, -50%) scale(${stepProgresses[i]})`,
              opacity: stepProgresses[i],
            }}
          >
            <StepBadge
              icon={step.icon}
              label={step.label}
              color={step.color}
              active={stepProgresses[i] > 0.5}
            />
          </div>
        ))}

        {/* Completion label */}
        <div
          style={{
            position: "absolute",
            bottom: 160,
            width: "100%",
            textAlign: "center",
            fontFamily: fontFamily.heading,
            fontSize: 36,
            color: COLORS.success,
            opacity: completionOpacity,
          }}
        >
          Indoctrinated.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
