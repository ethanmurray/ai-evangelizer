import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { typedCharCount } from "../lib/animations";
import { fontFamily } from "../fonts";
import { COLORS } from "../theme";

interface TypewriterTextProps {
  text: string;
  fontSize?: number;
  color?: string;
  charsPerSecond?: number;
  showCursor?: boolean;
  style?: React.CSSProperties;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  fontSize = 48,
  color = COLORS.text,
  charsPerSecond = 20,
  showCursor = true,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const charCount = typedCharCount(frame, text, charsPerSecond, fps);
  const displayText = text.slice(0, charCount);
  const done = charCount >= text.length;
  const cursorVisible = showCursor && !done && frame % 30 < 15;

  return (
    <div
      style={{
        fontFamily: fontFamily.body,
        fontSize,
        color,
        textAlign: "center",
        lineHeight: 1.4,
        ...style,
      }}
    >
      {displayText}
      <span style={{ color: COLORS.primary, opacity: cursorVisible ? 1 : 0 }}>
        |
      </span>
    </div>
  );
};
