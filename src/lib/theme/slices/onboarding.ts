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

export const onboardingAcademic: OnboardingSlice = {
  microcopy: {
    onboardingWelcomeTitle: "Welcome to the Department",
    onboardingWelcomeBody: "You have been admitted to the AI proficiency program. This orientation will acquaint you with the curriculum structure and evaluation criteria.",
    onboardingProgressTitle: "The Three-Phase Curriculum",
    onboardingProgressBody: "Each competency follows a peer-reviewed pedagogical framework. Complete all phases to earn full marks.",
    onboardingProgressStep1Desc: "Attend the lecture and review the syllabus materials.",
    onboardingProgressStep2Desc: "Submit your thesis demonstrating practical application.",
    onboardingProgressStep3Desc: "Present findings at a symposium and mentor 2 peers.",
    onboardingPointsTitle: "Grading & Academic Standing",
    onboardingPointsBody: "Each phase contributes to your cumulative GPA. Higher standing unlocks advanced seminars and research opportunities.",
    onboardingGetStartedTitle: "Commence Your Studies",
    onboardingGetStartedBody: "Proceed to the Course Catalog to review available modules and enroll in your first seminar.",
    onboardingGetStartedCta: "Open Course Catalog",
    onboardingSkip: "Defer enrollment",
    onboardingNext: "Next section",
    onboardingBack: "Previous section",
    onboardingFinish: "Begin coursework",
    replayTour: "Review orientation materials",
    emailConsentTitle: "Communication Preferences",
    emailConsentBody: "The department periodically distributes correspondence regarding academic activities and peer contributions.",
    emailConsentBullet1: "Weekly departmental bulletin summarizing curriculum updates",
    emailConsentBullet2: "Notifications when a colleague shares coursework with you",
    emailConsentBullet3: "Alerts when a peer cites you as their instructor",
    emailConsentAccept: "Subscribe to department mailings",
    emailConsentDecline: "Decline at this time",
  },
};

export const onboardingStartup: OnboardingSlice = {
  microcopy: {
    onboardingWelcomeTitle: "Let's Go! You're In.",
    onboardingWelcomeBody: "Welcome to the fastest way to 10x your AI skills. No fluff, no meetings — just ship, iterate, and scale. Here's the playbook.",
    onboardingProgressTitle: "The 3-Step Build Cycle",
    onboardingProgressBody: "Every skill is a sprint. Ship all three steps and you've leveled up. Time to disrupt.",
    onboardingProgressStep1Desc: "Scout it — learn the landscape and spot the opportunity.",
    onboardingProgressStep2Desc: "Ship it — build something real and push to production.",
    onboardingProgressStep3Desc: "Scale it — share with 2 teammates and multiply the impact.",
    onboardingPointsTitle: "Traction & Leaderboard",
    onboardingPointsBody: "Every action earns traction points. Climb the leaderboard, unlock perks, and prove you're a 10x player.",
    onboardingGetStartedTitle: "Ready to Ship?",
    onboardingGetStartedBody: "Dive into the Skill Library, pick your first sprint, and start iterating.",
    onboardingGetStartedCta: "Let's Ship It",
    onboardingSkip: "Skip (you can pivot back later)",
    onboardingNext: "Next",
    onboardingBack: "Pivot back",
    onboardingFinish: "LFG!",
    replayTour: "Re-run the playbook",
    emailConsentTitle: "Stay in the Loop",
    emailConsentBody: "We send lean, high-signal updates to keep you shipping. No spam — just actionable intel.",
    emailConsentBullet1: "Weekly growth metrics and trending skills",
    emailConsentBullet2: "Pings when a co-founder shares a skill with you",
    emailConsentBullet3: "Shoutouts when someone credits you as their mentor",
    emailConsentAccept: "I'm in",
    emailConsentDecline: "Not now",
  },
};

export const onboardingScifi: OnboardingSlice = {
  microcopy: {
    onboardingWelcomeTitle: "Neural Link Initialized",
    onboardingWelcomeBody: "Connection established. Your consciousness has been uploaded to the AI training mainframe. Initiating interface protocol orientation sequence.",
    onboardingProgressTitle: "Three-Phase Upload Protocol",
    onboardingProgressBody: "Each skill module requires a three-phase neural pathway integration. Complete all phases to achieve full synchronization.",
    onboardingProgressStep1Desc: "Download — absorb the data packet into your neural pathways.",
    onboardingProgressStep2Desc: "Interface — execute the protocol in a live environment.",
    onboardingProgressStep3Desc: "Transmit — broadcast the data to 2 additional nodes in your network.",
    onboardingPointsTitle: "Synchronization Rating",
    onboardingPointsBody: "Each completed phase increases your sync rating. Higher ratings unlock restricted data sectors and advanced interface protocols.",
    onboardingGetStartedTitle: "Awaiting Command",
    onboardingGetStartedBody: "Access the Skill Database to browse available modules and initiate your first upload sequence.",
    onboardingGetStartedCta: "Access Skill Database",
    onboardingSkip: "Defer initialization",
    onboardingNext: "Continue sequence",
    onboardingBack: "Reverse sequence",
    onboardingFinish: "Engage",
    replayTour: "Replay orientation protocol",
    emailConsentTitle: "Communication Array Configuration",
    emailConsentBody: "The mainframe can transmit periodic data bursts to your communication terminal. Configure your receiving frequency.",
    emailConsentBullet1: "Weekly neural network activity digest",
    emailConsentBullet2: "Alerts when an operator transmits a skill module to you",
    emailConsentBullet3: "Notifications when a node designates you as their mentor",
    emailConsentAccept: "Activate communication array",
    emailConsentDecline: "Maintain radio silence",
  },
};

export const onboardingRetro: OnboardingSlice = {
  microcopy: {
    onboardingWelcomeTitle: "*** WELCOME TO THE SYSTEM ***",
    onboardingWelcomeBody: "LOADING USER PROFILE... DONE. SYSTEM ONLINE. THIS ORIENTATION PROGRAM WILL GUIDE YOU THROUGH AVAILABLE COMMANDS.",
    onboardingProgressTitle: "=== 3-STEP PROGRAM ===",
    onboardingProgressBody: "EACH SKILL REQUIRES 3 COMMANDS TO COMPLETE. EXECUTE ALL 3 TO UNLOCK NEXT LEVEL.",
    onboardingProgressStep1Desc: "STEP 1: READ.EXE — LOAD THE SKILL FILE INTO MEMORY.",
    onboardingProgressStep2Desc: "STEP 2: RUN.EXE — EXECUTE THE SKILL IN YOUR WORKSPACE.",
    onboardingProgressStep3Desc: "STEP 3: SHARE.EXE — TRANSMIT TO 2 USERS ON THE NETWORK.",
    onboardingPointsTitle: "=== POINT SYSTEM ===",
    onboardingPointsBody: "EACH COMMAND EARNS POINTS. ACCUMULATE POINTS TO INCREASE YOUR ACCESS LEVEL. HIGH SCORE TABLE UPDATED DAILY.",
    onboardingGetStartedTitle: "PRESS ANY KEY TO CONTINUE",
    onboardingGetStartedBody: "NAVIGATE TO SKILL DIRECTORY TO BROWSE AVAILABLE FILES AND BEGIN LOADING...",
    onboardingGetStartedCta: "DIR /SKILLS",
    onboardingSkip: "ESC TO SKIP",
    onboardingNext: "PRESS ANY KEY",
    onboardingBack: "BACK",
    onboardingFinish: "RUN PROGRAM",
    replayTour: "REPLAY INTRO.EXE",
    emailConsentTitle: "=== EMAIL CONFIG ===",
    emailConsentBody: "SYSTEM CAN SEND PERIODIC MESSAGES TO YOUR INBOX. CONFIGURE EMAIL SETTINGS BELOW.",
    emailConsentBullet1: "WEEKLY DIGEST OF SYSTEM ACTIVITY AND NEW FILES",
    emailConsentBullet2: "ALERT WHEN A USER SHARES A FILE WITH YOU",
    emailConsentBullet3: "NOTIFICATION WHEN A USER CREDITS YOU AS TEACHER",
    emailConsentAccept: "ENABLE NOTIFICATIONS",
    emailConsentDecline: "DISABLE",
  },
};

export const onboardingNerdy: OnboardingSlice = {
  microcopy: {
    onboardingWelcomeTitle: "A New Quest Awaits!",
    onboardingWelcomeBody: "Hail, adventurer! You've entered the realm of AI mastery. Whether you're a level 1 noob or a seasoned archmage, this quest log will guide your journey.",
    onboardingProgressTitle: "The Three Trials",
    onboardingProgressBody: "Every skill is a quest with three trials. Complete all three to earn XP and unlock legendary loot.",
    onboardingProgressStep1Desc: "Trial 1: Study the ancient scrolls (learn the skill).",
    onboardingProgressStep2Desc: "Trial 2: Defeat the boss encounter (apply it in practice).",
    onboardingProgressStep3Desc: "Trial 3: Recruit 2 party members (share with colleagues).",
    onboardingPointsTitle: "XP & Leveling Up",
    onboardingPointsBody: "Every completed trial grants XP. Level up to unlock new skill trees, rare badges, and bragging rights in the guild hall.",
    onboardingGetStartedTitle: "Roll for Initiative!",
    onboardingGetStartedBody: "Head to the Quest Board to choose your first adventure and begin your epic journey.",
    onboardingGetStartedCta: "Open Quest Board",
    onboardingSkip: "Skip cutscene",
    onboardingNext: "Next page",
    onboardingBack: "Previous page",
    onboardingFinish: "Start Adventure!",
    replayTour: "Replay intro cutscene",
    emailConsentTitle: "Notification Settings",
    emailConsentBody: "The guild can send ravens to your inbox with updates from the realm. Choose your communication preferences, adventurer.",
    emailConsentBullet1: "Weekly dispatch from the guild hall with new quests and loot",
    emailConsentBullet2: "Alert when a party member shares a skill scroll with you",
    emailConsentBullet3: "Notification when an adventurer credits you as their mentor",
    emailConsentAccept: "Send the ravens!",
    emailConsentDecline: "Stealth mode",
  },
};

export const onboardingConsulting: OnboardingSlice = {
  microcopy: {
    onboardingWelcomeTitle: "Welcome to the Transformation Journey",
    onboardingWelcomeBody: "Per our last alignment session, this platform operationalizes your AI upskilling initiative. Let's do a quick deep-dive into the end-to-end value creation framework.",
    onboardingProgressTitle: "The Three-Horizon Capability Building Model",
    onboardingProgressBody: "Each skill follows a best-in-class three-horizon methodology. Complete all horizons to actualize full competency realization.",
    onboardingProgressStep1Desc: "Horizon 1: Internalize the thought leadership and socialize key takeaways.",
    onboardingProgressStep2Desc: "Horizon 2: Operationalize the learnings by executing against deliverables in a real-world context.",
    onboardingProgressStep3Desc: "Horizon 3: Synergize cross-functionally by cascading insights to 2 stakeholders.",
    onboardingPointsTitle: "Value-Add Metrics & Incentive Architecture",
    onboardingPointsBody: "Each touchpoint generates value-add credits. Accumulate credits to move up the maturity model and unlock premium-tier thought leadership content.",
    onboardingGetStartedTitle: "Let's Take This Offline",
    onboardingGetStartedBody: "Navigate to the Capability Library to identify quick wins and begin your transformation journey. Let's not boil the ocean — start with low-hanging fruit.",
    onboardingGetStartedCta: "Circle Back to Capability Library",
    onboardingSkip: "Table this for now",
    onboardingNext: "Advance to next slide",
    onboardingBack: "Revisit previous slide",
    onboardingFinish: "Greenlight the initiative",
    replayTour: "Re-socialize the orientation deck",
    emailConsentTitle: "Stakeholder Communication Cadence Alignment",
    emailConsentBody: "To maximize touchpoint ROI, we recommend opting into our multi-channel engagement framework. Let's align on your communication preferences.",
    emailConsentBullet1: "Weekly capability maturity digest with actionable insights and KPIs",
    emailConsentBullet2: "Real-time notifications when a stakeholder cascades a deliverable to you",
    emailConsentBullet3: "Alerts when a colleague attributes you as a force multiplier in their journey",
    emailConsentAccept: "Greenlight communications",
    emailConsentDecline: "Deprioritize for now",
  },
};
