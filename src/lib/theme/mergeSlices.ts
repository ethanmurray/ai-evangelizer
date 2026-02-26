import type { ContentTheme } from './types';
import { coreCult, coreCorporate, type CoreSlice } from './slices/core';
import { progressCult, progressCorporate, type ProgressSlice } from './slices/progress';
import { crudCult, crudCorporate, type CrudSlice } from './slices/crud';
import { authCult, authCorporate, type AuthSlice } from './slices/auth';
import { sharingCult, sharingCorporate, type SharingSlice } from './slices/sharing';
import { socialCult, socialCorporate, type SocialSlice } from './slices/social';
import { badgesCult, badgesCorporate, type BadgesSlice } from './slices/badges';
import { difficultyCult, difficultyCorporate, type DifficultySlice } from './slices/difficulty';
import { teamsCult, teamsCorporate, type TeamsSlice } from './slices/teams';
import { discoveryCult, discoveryCorporate, type DiscoverySlice } from './slices/discovery';

interface ThemeSlices {
  core: CoreSlice;
  progress: ProgressSlice;
  crud: CrudSlice;
  auth: AuthSlice;
  sharing: SharingSlice;
  social: SocialSlice;
  badges: BadgesSlice;
  difficulty: DifficultySlice;
  teams: TeamsSlice;
  discovery: DiscoverySlice;
}

function mergeSlices(slices: ThemeSlices): ContentTheme {
  return {
    appName: slices.core.appName,
    tagline: slices.core.tagline,
    toneGuidance: slices.core.toneGuidance,
    concepts: {
      ...slices.core.concepts,
      ...slices.progress.concepts,
      ...slices.crud.concepts,
      ...slices.social.concepts,
      ...slices.badges.concepts,
      ...slices.difficulty.concepts,
      ...slices.teams.concepts,
      ...slices.discovery.concepts,
    },
    ranks: slices.progress.ranks,
    microcopy: {
      ...slices.core.microcopy,
      ...slices.progress.microcopy,
      ...slices.crud.microcopy,
      ...slices.auth.microcopy,
      ...slices.sharing.microcopy,
      ...slices.social.microcopy,
      ...slices.teams.microcopy,
      ...slices.discovery.microcopy,
    },
    badgeNames: slices.badges.badgeNames,
  };
}

export const cultTheme: ContentTheme = mergeSlices({
  core: coreCult,
  progress: progressCult,
  crud: crudCult,
  auth: authCult,
  sharing: sharingCult,
  social: socialCult,
  badges: badgesCult,
  difficulty: difficultyCult,
  teams: teamsCult,
  discovery: discoveryCult,
});

export const corporateTheme: ContentTheme = mergeSlices({
  core: coreCorporate,
  progress: progressCorporate,
  crud: crudCorporate,
  auth: authCorporate,
  sharing: sharingCorporate,
  social: socialCorporate,
  badges: badgesCorporate,
  difficulty: difficultyCorporate,
  teams: teamsCorporate,
  discovery: discoveryCorporate,
});
