// Design tokens extracted from the conspiracy-board theme
// Source: src/lib/theme/visual/conspiracy-board.css + src/lib/theme/slices/progress.ts + core.ts

export const COLORS = {
  bg: "#1a1a2e",
  bgSurface: "#16213e",
  bgElevated: "#0f3460",
  primary: "#e63946",
  secondary: "#f4a261",
  text: "#e0e0e0",
  textMuted: "#a0a0a0",
  textHeading: "#f4a261",
  border: "#333333",
  success: "#2a9d8f",
  error: "#e63946",
} as const;

export const RANKS = [
  { min: 0, name: "Outsider", desc: "Still thinks for themselves" },
  { min: 10, name: "Curious Bystander", desc: "Lingering near the compound" },
  { min: 30, name: "Initiate", desc: "Has tasted the Kool-Aid" },
  { min: 60, name: "True Believer", desc: "There is no going back" },
  { min: 110, name: "Inner Circle", desc: "Knows the secret handshake" },
  { min: 210, name: "Supreme Leader", desc: "All hail" },
] as const;

export const STEPS = [
  { label: "Witnessed", icon: "\u{1F441}", color: COLORS.textMuted },
  { label: "Initiated", icon: "\u{1F525}", color: COLORS.secondary },
  { label: "Recruited", icon: "\u{1F91D}", color: COLORS.success },
] as const;

export const APP_NAME = "The Cult of AI";
export const TAGLINE = "Adjust your tinfoil hat and join us";
