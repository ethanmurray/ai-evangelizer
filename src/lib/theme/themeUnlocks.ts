import type { ThemeKey } from './ThemeProvider';

export interface ThemeUnlockConfig {
  key: ThemeKey;
  label: string;
  /** null means free/always unlocked */
  requiredPoints: number | null;
}

export const THEME_UNLOCK_CONFIG: ThemeUnlockConfig[] = [
  // Free themes
  { key: 'cult', label: 'Conspiracy Mode', requiredPoints: null },
  { key: 'corporate', label: 'Corporate Mode', requiredPoints: null },
  { key: 'academic', label: 'Academic Mode', requiredPoints: null },
  { key: 'startup', label: 'Startup Mode', requiredPoints: null },
  { key: 'scifi', label: 'Sci-Fi Mode', requiredPoints: null },
  { key: 'retro', label: 'Retro Mode', requiredPoints: null },
  { key: 'nerdy', label: 'Nerdy Mode', requiredPoints: null },
  { key: 'consulting', label: 'Consulting Mode', requiredPoints: null },
  // Unlockable themes
  { key: 'pirate', label: 'Pirate Mode', requiredPoints: 30 },
  { key: 'noir', label: 'Film Noir Mode', requiredPoints: 75 },
  { key: 'medieval', label: 'Medieval Mode', requiredPoints: 150 },
];

export function isThemeUnlocked(themeKey: ThemeKey, userPoints: number): boolean {
  const config = THEME_UNLOCK_CONFIG.find((c) => c.key === themeKey);
  if (!config) return true; // unknown theme = allow
  if (config.requiredPoints === null) return true; // free theme
  return userPoints >= config.requiredPoints;
}

export function getNewlyUnlockedThemes(
  previousPoints: number,
  newPoints: number
): ThemeUnlockConfig[] {
  return THEME_UNLOCK_CONFIG.filter((config) => {
    if (config.requiredPoints === null) return false;
    return previousPoints < config.requiredPoints && newPoints >= config.requiredPoints;
  });
}
