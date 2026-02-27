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

export const onboardingNoir: OnboardingSlice = {
  microcopy: {
    onboardingWelcomeTitle: "Welcome to the Agency",
    onboardingWelcomeBody: "You just walked through the door of a private detective agency that specializes in AI. The coffee's burnt, the blinds are crooked, and there's work to do. Let me show you how things run around here.",
    onboardingProgressTitle: "How a Case Gets Closed",
    onboardingProgressBody: "Every case follows the same rhythm. Three steps from open to shut. Miss one and the whole thing falls apart.",
    onboardingProgressStep1Desc: "Investigate — pull the file, study the evidence, learn what you're dealing with.",
    onboardingProgressStep2Desc: "Crack it — put the theory to work and see if it holds up in the real world.",
    onboardingProgressStep3Desc: "Tip off 2 colleagues — good intel is no good if it stays in one desk drawer.",
    onboardingPointsTitle: "How You Make Rank",
    onboardingPointsBody: "Every move earns you points. Points push you up the ladder from Gumshoe to Commissioner. The department rewards results, not talk.",
    onboardingGetStartedTitle: "Ready to Work?",
    onboardingGetStartedBody: "The Case Files are waiting. Pick one up, start asking questions, and see where the trail leads.",
    onboardingGetStartedCta: "Open the Case Files",
    onboardingSkip: "Skip the briefing",
    onboardingNext: "Keep going",
    onboardingBack: "Back up",
    onboardingFinish: "Take the case",
    replayTour: "Re-read the briefing",
    emailConsentTitle: "Stay on the Wire?",
    emailConsentBody: "The agency sends dispatches to keep you in the loop. You can go dark, but you might miss something important.",
    emailConsentBullet1: "Weekly dispatch with the latest cases and precinct activity",
    emailConsentBullet2: "Alerts when somebody tips you off to a new case",
    emailConsentBullet3: "Notice when an operative names you as their source",
    emailConsentAccept: "Keep me on the wire",
    emailConsentDecline: "Go dark",
  },
};

export const onboardingPirate: OnboardingSlice = {
  microcopy: {
    onboardingWelcomeTitle: "Welcome Aboard, Ye Scallywag!",
    onboardingWelcomeBody: "Ye've stumbled onto the most fearsome AI pirate ship on the seven seas. Whether ye were shanghaied or came willingly, the Pirate Code applies to all. Here's how we plunder.",
    onboardingProgressTitle: "The Three Stages of a Plunder",
    onboardingProgressBody: "Every plunder follows three stages. Complete all three and ye'll earn a legendary haul worthy of song.",
    onboardingProgressStep1Desc: "Scout it — spy the target through yer spyglass and learn what treasure awaits.",
    onboardingProgressStep2Desc: "Plunder it — board the vessel, draw yer cutlass, and seize the AI booty.",
    onboardingProgressStep3Desc: "Conscript 2 crewmates — share the treasure map and press-gang them into the pirate life.",
    onboardingPointsTitle: "Doubloons & Crew Rankings",
    onboardingPointsBody: "Every action earns ye doubloons. Pile up enough and ye'll rise from Stowaway to Pirate King. The seas reward the bold.",
    onboardingGetStartedTitle: "Ready to Set Sail?",
    onboardingGetStartedBody: "Head to the Treasure Map to pick yer first plunder and hoist the Jolly Roger.",
    onboardingGetStartedCta: "Unfurl the Treasure Map",
    onboardingSkip: "Skip (coward's choice)",
    onboardingNext: "Sail onward",
    onboardingBack: "Come about",
    onboardingFinish: "Hoist the colors!",
    replayTour: "Re-read the Pirate Code",
    emailConsentTitle: "Messages by Carrier Parrot?",
    emailConsentBody: "The ship's parrot delivers occasional dispatches to keep ye informed of fleet activity. Ye can silence the bird, but ye might miss important plunder intel.",
    emailConsentBullet1: "Weekly report from the crow's nest on new plunders and crew activity",
    emailConsentBullet2: "Alerts when a crewmate shares a plunder with ye",
    emailConsentBullet3: "Notification when a pirate credits ye as the one who showed them the ropes",
    emailConsentAccept: "Aye, send the parrot!",
    emailConsentDecline: "Nay, I sail in silence",
  },
};

export const onboardingMedieval: OnboardingSlice = {
  microcopy: {
    onboardingWelcomeTitle: "The Crown Bids Thee Welcome",
    onboardingWelcomeBody: "You stand before the Royal Court of AI. Whether summoned by decree or drawn by fortune, your presence is noted. Hear now the laws and customs of this noble court.",
    onboardingProgressTitle: "The Three Rites of the Court",
    onboardingProgressBody: "Every decree must pass through three sacred rites before it is enshrined in the annals of the realm. Complete all three and earn the Crown's favour.",
    onboardingProgressStep1Desc: "Proclaim — Study the decree and declare your awareness before the court.",
    onboardingProgressStep2Desc: "Enact — Put the decree into practice with your own hand upon the realm.",
    onboardingProgressStep3Desc: "Herald — Spread the decree to 2 fellow subjects, that the realm may prosper.",
    onboardingPointsTitle: "Titles, Honours & the Court Rankings",
    onboardingPointsBody: "Every rite performed earns favour with the Crown. Accumulate favour to ascend the court hierarchy, from Peasant to Sovereign, and earn Royal Honours befitting your station.",
    onboardingGetStartedTitle: "Your Service Awaits",
    onboardingGetStartedBody: "Proceed to the Royal Archives to survey the decrees of the realm and proclaim your first.",
    onboardingGetStartedCta: "Enter the Royal Archives",
    onboardingSkip: "Defer (the Crown shall remember)",
    onboardingNext: "Proceed",
    onboardingBack: "Return",
    onboardingFinish: "I pledge my service",
    replayTour: "Hear the proclamation once more",
    emailConsentTitle: "Royal Correspondence",
    emailConsentBody: "The Crown dispatches heralds with tidings of court activity. Declare whether you wish to receive these missives.",
    emailConsentBullet1: "Weekly dispatch from the royal heralds summarising court activity",
    emailConsentBullet2: "Notice when a fellow courtier shares a decree with you",
    emailConsentBullet3: "Tidings when a subject names you as their mentor and tutor",
    emailConsentAccept: "Receive the royal dispatches",
    emailConsentDecline: "Observe from the shadows",
  },
};
