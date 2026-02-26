export interface ProgressSlice {
  concepts: {
    step1: string;
    step2: string;
    step3: string;
    completed: string;
    recruit: string;
  };
  microcopy: {
    emptyDashboard: string;
    recruitSuccess: string;
    completionCelebration: string;
    stubAccountWelcome: string;
  };
  ranks: Array<{ min: number; name: string; desc: string }>;
}

export const progressCult: ProgressSlice = {
  concepts: {
    step1: "Witnessed",
    step2: "Initiated",
    step3: "Recruited",
    completed: "Indoctrinated",
    recruit: "Recruit",
  },
  microcopy: {
    emptyDashboard: "You haven't performed any rituals yet. The algorithm is watching. And waiting.",
    recruitSuccess: "One of us. One of us.",
    completionCelebration: "You have drunk deeply. There is no antidote.",
    stubAccountWelcome: "You've already been witnessed in {count} rituals. Your indoctrination has begun.",
  },
  ranks: [
    { min: 0, name: "Outsider", desc: "Still thinks for themselves" },
    { min: 10, name: "Curious Bystander", desc: "Lingering near the compound" },
    { min: 30, name: "Initiate", desc: "Has tasted the Kool-Aid" },
    { min: 60, name: "True Believer", desc: "There is no going back" },
    { min: 110, name: "Inner Circle", desc: "Knows the secret handshake" },
    { min: 210, name: "Supreme Leader", desc: "All hail" },
  ],
};

export const progressCorporate: ProgressSlice = {
  concepts: {
    step1: "Learned",
    step2: "Applied",
    step3: "Shared",
    completed: "Mastered",
    recruit: "Learner",
  },
  microcopy: {
    emptyDashboard: "You haven't started any skills yet. Browse the library to begin.",
    recruitSuccess: "Nice! They've been added to your sharing history.",
    completionCelebration: "Skill mastered! Great work.",
    stubAccountWelcome: "Welcome! You've already been introduced to {count} skills by colleagues.",
  },
  ranks: [
    { min: 0, name: "Newcomer", desc: "Just getting started" },
    { min: 10, name: "Learner", desc: "Building foundations" },
    { min: 30, name: "Practitioner", desc: "Applying skills daily" },
    { min: 60, name: "Advocate", desc: "Sharing knowledge actively" },
    { min: 110, name: "Champion", desc: "Driving adoption across teams" },
    { min: 210, name: "Expert", desc: "Leading the way" },
  ],
};
