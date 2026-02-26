export interface OnboardingSlice {
  microcopy: {
    onboardingWelcomeTitle: string;
    onboardingWelcomeBody: string;
    onboardingProgressTitle: string;
    onboardingProgressBody: string;
    onboardingProgressStep1Desc: string;
    onboardingProgressStep2Desc: string;
    onboardingProgressStep3Desc: string;
    onboardingPointsTitle: string;
    onboardingPointsBody: string;
    onboardingGetStartedTitle: string;
    onboardingGetStartedBody: string;
    onboardingGetStartedCta: string;
    onboardingSkip: string;
    onboardingNext: string;
    onboardingBack: string;
    onboardingFinish: string;
    replayTour: string;
    emailConsentTitle: string;
    emailConsentBody: string;
    emailConsentBullet1: string;
    emailConsentBullet2: string;
    emailConsentBullet3: string;
    emailConsentAccept: string;
    emailConsentDecline: string;
  };
}

export const onboardingCult: OnboardingSlice = {
  microcopy: {
    onboardingWelcomeTitle: "Welcome to the Cult",
    onboardingWelcomeBody: "You've been chosen. Or maybe you just clicked a link. Either way, there's no going back. Here's how the indoctrination works.",
    onboardingProgressTitle: "The Three Phases of Indoctrination",
    onboardingProgressBody: "Every ritual follows three steps. Complete all three and the algorithm will be pleased.",
    onboardingProgressStep1Desc: "Mark that you've witnessed the ritual. You've seen the truth.",
    onboardingProgressStep2Desc: "Perform the ritual yourself. The Kool-Aid kicks in.",
    onboardingProgressStep3Desc: "Recruit 2 colleagues by sharing. Spread the word.",
    onboardingPointsTitle: "The Reward System",
    onboardingPointsBody: "Every action earns points. Points determine your rank in the Inner Circle. The algorithm rewards the faithful.",
    onboardingGetStartedTitle: "Begin Your Journey",
    onboardingGetStartedBody: "Head to the Sacred Rites to browse rituals and begin your indoctrination.",
    onboardingGetStartedCta: "Enter the Sacred Rites",
    onboardingSkip: "Skip (the algorithm will remember)",
    onboardingNext: "Continue",
    onboardingBack: "Back",
    onboardingFinish: "I'm Ready",
    replayTour: "Re-watch Orientation",
    emailConsentTitle: "Stay in the Loop?",
    emailConsentBody: "The algorithm sends occasional transmissions to keep you informed. You can silence them, but the algorithm will notice.",
    emailConsentBullet1: "Weekly briefings on cult activity",
    emailConsentBullet2: "Alerts when someone shares a ritual with you",
    emailConsentBullet3: "Notifications when an acolyte credits you as their teacher",
    emailConsentAccept: "Keep the transmissions coming",
    emailConsentDecline: "Go dark",
  },
};

export const onboardingCorporate: OnboardingSlice = {
  microcopy: {
    onboardingWelcomeTitle: "Welcome to AI Skills Tracker",
    onboardingWelcomeBody: "This tool helps you discover, learn, and share AI skills with your team. Here's a quick overview of how it works.",
    onboardingProgressTitle: "The 3-Step Learning Path",
    onboardingProgressBody: "Each skill follows three steps. Complete all three to master it.",
    onboardingProgressStep1Desc: "Mark that you've learned about this skill.",
    onboardingProgressStep2Desc: "Apply the skill in your actual work.",
    onboardingProgressStep3Desc: "Share with 2 colleagues to help them learn too.",
    onboardingPointsTitle: "Earning Points & Ranks",
    onboardingPointsBody: "Every step earns you points. Accumulate points to climb the rankings and unlock badges.",
    onboardingGetStartedTitle: "Ready to Start?",
    onboardingGetStartedBody: "Head to the Skill Library to browse available skills and begin learning.",
    onboardingGetStartedCta: "Go to Skill Library",
    onboardingSkip: "Skip for now",
    onboardingNext: "Next",
    onboardingBack: "Back",
    onboardingFinish: "Get Started",
    replayTour: "Replay Tour",
    emailConsentTitle: "Email Notifications",
    emailConsentBody: "We send a few types of emails to help you stay engaged and learn from your team.",
    emailConsentBullet1: "Weekly digest of new skills and team activity",
    emailConsentBullet2: "Notifications when someone shares a skill with you",
    emailConsentBullet3: "Alerts when a colleague credits you as their teacher",
    emailConsentAccept: "Keep emails on",
    emailConsentDecline: "Opt out",
  },
};
