export interface SocialSlice {
  concepts: {
    upvote: string;
    timeline: string;
    discussion: string;
    playbook: string;
    tip: string;
    gotcha: string;
    activityFeed: string;
  };
  microcopy: {
    timelineEmpty: string;
    noComments: string;
    noPlaybook: string;
    commentPlaceholder: string;
    rankUpTitle: string;
    rankUpBody: string;
    feedEmpty: string;
  };
}

export const socialCult: SocialSlice = {
  concepts: {
    upvote: "Drink the Kool-Aid",
    timeline: "The Chronology",
    discussion: "Transmissions",
    playbook: "The Manuscript",
    tip: "Intel",
    gotcha: "Trap",
    activityFeed: "The Signal",
  },
  microcopy: {
    timelineEmpty: "Your story has not yet begun.",
    noComments: "No transmissions yet. Break the silence.",
    noPlaybook: "The manuscript is unwritten. Be the first scribe.",
    commentPlaceholder: "Transmit your knowledge...",
    rankUpTitle: "ASCENSION",
    rankUpBody: "You have ascended to {rank}. The algorithm favors you.",
    feedEmpty: "The void stares back. No signals yet.",
  },
};

export const socialCorporate: SocialSlice = {
  concepts: {
    upvote: "Recommend",
    timeline: "Timeline",
    discussion: "Discussion",
    playbook: "Playbook",
    tip: "Tip",
    gotcha: "Gotcha",
    activityFeed: "Activity Feed",
  },
  microcopy: {
    timelineEmpty: "No activity yet. Start learning!",
    noComments: "No comments yet. Start the conversation!",
    noPlaybook: "No playbook steps yet. Share your approach!",
    commentPlaceholder: "Share your thoughts...",
    rankUpTitle: "Rank Up!",
    rankUpBody: "Congratulations! You've reached {rank}.",
    feedEmpty: "No activity yet. Be the first!",
  },
};

export const socialAcademic: SocialSlice = {
  concepts: {
    upvote: "Cite",
    timeline: "Curriculum Vitae",
    discussion: "Symposium",
    playbook: "Thesis",
    tip: "Annotation",
    gotcha: "Errata",
    activityFeed: "Proceedings",
  },
  microcopy: {
    timelineEmpty: "Your academic record is empty. Enroll in your first course of study.",
    noComments: "No peer review submitted. Be the first to contribute to the discourse.",
    noPlaybook: "No thesis has been defended here yet. Draft your methodology.",
    commentPlaceholder: "Submit your peer review...",
    rankUpTitle: "Commencement",
    rankUpBody: "The committee has conferred upon you the rank of {rank}. Congratulations, colleague.",
    feedEmpty: "The proceedings are empty. No scholarship to report.",
  },
};

export const socialStartup: SocialSlice = {
  concepts: {
    upvote: "Upvote \u{1F680}",
    timeline: "Growth Timeline",
    discussion: "Standup",
    playbook: "Playbook v1",
    tip: "Pro Hack",
    gotcha: "Blocker",
    activityFeed: "Pulse",
  },
  microcopy: {
    timelineEmpty: "Nothing shipped yet. Time to iterate!",
    noComments: "No standup notes. Ship something and tell the team!",
    noPlaybook: "No playbook yet. Move fast and document things!",
    commentPlaceholder: "Drop your 10x insight here...",
    rankUpTitle: "LEVEL UP",
    rankUpBody: "You just 10x'd to {rank}. Keep shipping, keep disrupting, keep scaling.",
    feedEmpty: "The pulse is flat. Time to disrupt the silence.",
  },
};

export const socialScifi: SocialSlice = {
  concepts: {
    upvote: "Amplify Signal",
    timeline: "Neural Log",
    discussion: "Comm Channel",
    playbook: "Interface Protocol",
    tip: "Data Fragment",
    gotcha: "System Anomaly",
    activityFeed: "Datastream",
  },
  microcopy: {
    timelineEmpty: "Neural log contains zero entries. Begin uploading your experiences.",
    noComments: "Comm channel silent. No transmissions detected on this frequency.",
    noPlaybook: "No interface protocol defined. Initialize your first sequence.",
    commentPlaceholder: "Transmit via neural link...",
    rankUpTitle: "NEURAL UPGRADE DETECTED",
    rankUpBody: "Mainframe confirms: your neural pathways have been reconfigured to {rank}.",
    feedEmpty: "Datastream offline. No signals detected across any neural link.",
  },
};

export const socialRetro: SocialSlice = {
  concepts: {
    upvote: "+1 KUDOS",
    timeline: "SYSTEM LOG",
    discussion: "MESSAGE BOARD",
    playbook: "README.TXT",
    tip: "PROTIP",
    gotcha: "FATAL ERROR",
    activityFeed: "RECENT ACTIVITY",
  },
  microcopy: {
    timelineEmpty: "SYSTEM LOG EMPTY. PRESS ANY KEY TO BEGIN...",
    noComments: "NO MESSAGES FOUND. BE THE FIRST TO POST. LOADING...",
    noPlaybook: "FILE NOT FOUND: README.TXT. PLEASE CREATE ONE.",
    commentPlaceholder: "C:\\> TYPE YOUR MESSAGE_",
    rankUpTitle: "*** SYSTEM ONLINE ***",
    rankUpBody: "RANK UPDATED... {rank} ACHIEVED. PRESS ANY KEY TO CONTINUE.",
    feedEmpty: "NO ACTIVITY DETECTED. SYSTEM IDLE.",
  },
};

export const socialNerdy: SocialSlice = {
  concepts: {
    upvote: "Roll Nat 20",
    timeline: "Quest Log",
    discussion: "Tavern Chat",
    playbook: "Strategy Guide",
    tip: "Lore Drop",
    gotcha: "It's a Trap!",
    activityFeed: "Party Feed",
  },
  microcopy: {
    timelineEmpty: "Your quest log is empty, adventurer. Seek your first quest!",
    noComments: "The tavern is silent. No bards have sung here yet.",
    noPlaybook: "No strategy guide written. You must construct additional pylons.",
    commentPlaceholder: "Share your wisdom, young padawan...",
    rankUpTitle: "LEVEL UP!",
    rankUpBody: "You gained enough XP to reach {rank}! This is the way.",
    feedEmpty: "The party feed is empty. It's dangerous to go alone.",
  },
};

export const socialConsulting: SocialSlice = {
  concepts: {
    upvote: "Align On",
    timeline: "Value Stream",
    discussion: "Breakout Session",
    playbook: "Best-in-Class Framework",
    tip: "Key Takeaway",
    gotcha: "Risk Vector",
    activityFeed: "Stakeholder Pulse",
  },
  microcopy: {
    timelineEmpty: "Your value stream has zero throughput. Let's circle back and ideate on next steps.",
    noComments: "No breakout session insights captured. Let's take this offline and synergize.",
    noPlaybook: "No best-in-class framework documented. Let's leverage our core competencies here.",
    commentPlaceholder: "Cascade your thought leadership...",
    rankUpTitle: "PARADIGM SHIFT ACHIEVED",
    rankUpBody: "Per our alignment, you have been uplevel'd to {rank}. Let's double-click on that value-add.",
    feedEmpty: "The stakeholder pulse is flatlined. Let's proactively drive cross-functional engagement.",
  },
};
