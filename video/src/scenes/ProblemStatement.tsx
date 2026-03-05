import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ConspiracyBackground } from "../components/ConspiracyBackground";
import { TypewriterText } from "../components/TypewriterText";
import { fontFamily } from "../fonts";
import { COLORS } from "../theme";
import { fadeIn, fadeOut, typedCharCount } from "../lib/animations";

const LINE1 = "Your team isn't using AI.";
const LINE2 = "The tools are there. The adoption isn't.";

export const ProblemStatement: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterOpacity = fadeIn(frame, 0, 10);
  const exitOpacity = fadeOut(frame, 118, 16);

  // Line 1 starts typing at frame 8
  const line1Frame = Math.max(0, frame - 8);
  const line1Chars = typedCharCount(line1Frame, LINE1, 18, fps);
  const line1Done = line1Chars >= LINE1.length;

  // Line 2 starts at frame 58 (after line 1 + pause)
  const line2Visible = frame >= 58;
  const line2Frame = Math.max(0, frame - 58);

  // "AI" highlight in line 1
  const renderLine1 = () => {
    const shown = LINE1.slice(0, line1Chars);
    const aiIndex = shown.indexOf("AI");
    if (aiIndex === -1) return shown;
    return (
      <>
        {shown.slice(0, aiIndex)}
        <span style={{ color: COLORS.primary }}>
          {shown.slice(aiIndex, aiIndex + 2)}
        </span>
        {shown.slice(aiIndex + 2)}
      </>
    );
  };

  // Blinking cursor
  const cursor1Visible = !line1Done && frame % 30 < 15;

  return (
    <AbsoluteFill>
      <ConspiracyBackground />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: enterOpacity * exitOpacity,
          padding: "0 200px",
        }}
      >
        {/* Line 1 */}
        <div
          style={{
            fontFamily: fontFamily.body,
            fontSize: 56,
            fontWeight: 600,
            color: COLORS.text,
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          {renderLine1()}
          {!line1Done && (
            <span
              style={{
                color: COLORS.primary,
                opacity: cursor1Visible ? 1 : 0,
              }}
            >
              |
            </span>
          )}
        </div>

        {/* Line 2 */}
        {line2Visible && (
          <div style={{ marginTop: 32 }}>
            <TypewriterText
              text={LINE2}
              fontSize={36}
              color={COLORS.textMuted}
              charsPerSecond={22}
            />
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
