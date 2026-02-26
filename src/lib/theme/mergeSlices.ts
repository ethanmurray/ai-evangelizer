import type { ContentTheme } from './types';
import { coreCult, coreCorporate, coreAcademic, coreStartup, coreScifi, coreRetro, coreNerdy, coreConsulting, type CoreSlice } from './slices/core';
import { progressCult, progressCorporate, progressAcademic, progressStartup, progressScifi, progressRetro, progressNerdy, progressConsulting, type ProgressSlice } from './slices/progress';
import { crudCult, crudCorporate, crudAcademic, crudStartup, crudScifi, crudRetro, crudNerdy, crudConsulting, type CrudSlice } from './slices/crud';
import { authCult, authCorporate, authAcademic, authStartup, authScifi, authRetro, authNerdy, authConsulting, type AuthSlice } from './slices/auth';
import { sharingCult, sharingCorporate, sharingAcademic, sharingStartup, sharingScifi, sharingRetro, sharingNerdy, sharingConsulting, type SharingSlice } from './slices/sharing';
import { socialCult, socialCorporate, socialAcademic, socialStartup, socialScifi, socialRetro, socialNerdy, socialConsulting, type SocialSlice } from './slices/social';
import { badgesCult, badgesCorporate, badgesAcademic, badgesStartup, badgesScifi, badgesRetro, badgesNerdy, badgesConsulting, type BadgesSlice } from './slices/badges';
import { difficultyCult, difficultyCorporate, difficultyAcademic, difficultyStartup, difficultyScifi, difficultyRetro, difficultyNerdy, difficultyConsulting, type DifficultySlice } from './slices/difficulty';
import { teamsCult, teamsCorporate, teamsAcademic, teamsStartup, teamsScifi, teamsRetro, teamsNerdy, teamsConsulting, type TeamsSlice } from './slices/teams';
import { discoveryCult, discoveryCorporate, discoveryAcademic, discoveryStartup, discoveryScifi, discoveryRetro, discoveryNerdy, discoveryConsulting, type DiscoverySlice } from './slices/discovery';
import { onboardingCult, onboardingCorporate, onboardingAcademic, onboardingStartup, onboardingScifi, onboardingRetro, onboardingNerdy, onboardingConsulting, type OnboardingSlice } from './slices/onboarding';

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
  onboarding: OnboardingSlice;
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
      ...slices.onboarding.microcopy,
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
  onboarding: onboardingCult,
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
  onboarding: onboardingCorporate,
});

export const academicTheme: ContentTheme = mergeSlices({
  core: coreAcademic,
  progress: progressAcademic,
  crud: crudAcademic,
  auth: authAcademic,
  sharing: sharingAcademic,
  social: socialAcademic,
  badges: badgesAcademic,
  difficulty: difficultyAcademic,
  teams: teamsAcademic,
  discovery: discoveryAcademic,
  onboarding: onboardingAcademic,
});

export const startupTheme: ContentTheme = mergeSlices({
  core: coreStartup,
  progress: progressStartup,
  crud: crudStartup,
  auth: authStartup,
  sharing: sharingStartup,
  social: socialStartup,
  badges: badgesStartup,
  difficulty: difficultyStartup,
  teams: teamsStartup,
  discovery: discoveryStartup,
  onboarding: onboardingStartup,
});

export const scifiTheme: ContentTheme = mergeSlices({
  core: coreScifi,
  progress: progressScifi,
  crud: crudScifi,
  auth: authScifi,
  sharing: sharingScifi,
  social: socialScifi,
  badges: badgesScifi,
  difficulty: difficultyScifi,
  teams: teamsScifi,
  discovery: discoveryScifi,
  onboarding: onboardingScifi,
});

export const retroTheme: ContentTheme = mergeSlices({
  core: coreRetro,
  progress: progressRetro,
  crud: crudRetro,
  auth: authRetro,
  sharing: sharingRetro,
  social: socialRetro,
  badges: badgesRetro,
  difficulty: difficultyRetro,
  teams: teamsRetro,
  discovery: discoveryRetro,
  onboarding: onboardingRetro,
});

export const nerdyTheme: ContentTheme = mergeSlices({
  core: coreNerdy,
  progress: progressNerdy,
  crud: crudNerdy,
  auth: authNerdy,
  sharing: sharingNerdy,
  social: socialNerdy,
  badges: badgesNerdy,
  difficulty: difficultyNerdy,
  teams: teamsNerdy,
  discovery: discoveryNerdy,
  onboarding: onboardingNerdy,
});

export const consultingTheme: ContentTheme = mergeSlices({
  core: coreConsulting,
  progress: progressConsulting,
  crud: crudConsulting,
  auth: authConsulting,
  sharing: sharingConsulting,
  social: socialConsulting,
  badges: badgesConsulting,
  difficulty: difficultyConsulting,
  teams: teamsConsulting,
  discovery: discoveryConsulting,
  onboarding: onboardingConsulting,
});
