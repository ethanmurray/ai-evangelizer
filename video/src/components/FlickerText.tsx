import React from "react";
import { useCurrentFrame } from "remotion";
import { flickerOpacity } from "../lib/animations";
import { fontFamily } from "../fonts";
import { COLORS } from "../theme";

interface FlickerTextProps {
  text: string;
  fontSize?: number;
  color?: string;
  style?: React.CSSProperties;
  flickerPeriod?: number;
}

export const FlickerText: React.FC<FlickerTextProps> = ({
  text,
  fontSize = 72,
  color = COLORS.textHeading,
  style = {},
  flickerPeriod = 120,
}) => {
  const frame = useCurrentFrame();
  const opacity = flickerOpacity(frame, flickerPeriod);

  return (
    <div
      style={{
        fontFamily: fontFamily.heading,
        fontSize,
        color,
        opacity,
        textAlign: "center",
        lineHeight: 1.2,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
