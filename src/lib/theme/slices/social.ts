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

export const socialNoir: SocialSlice = {
  concepts: {
    upvote: "Follow This Lead",
    timeline: "The Case History",
    discussion: "Interrogation Room",
    playbook: "The Dossier",
    tip: "Inside Tip",
    gotcha: "Red Herring",
    activityFeed: "The Wire",
  },
  microcopy: {
    timelineEmpty: "Nothing on the record yet. Clean slate — or maybe somebody wiped it.",
    noComments: "The interrogation room is empty. Nobody's talking. Be the first to break the silence.",
    noPlaybook: "The dossier is blank. Somebody's got to write the first page.",
    commentPlaceholder: "Spill what you know...",
    rankUpTitle: "PROMOTION",
    rankUpBody: "Word came down from the top. You've been made {rank}. Don't let it go to your head.",
    feedEmpty: "The wire is dead quiet. Not a whisper on any channel.",
  },
};

export const socialPirate: SocialSlice = {
  concepts: {
    upvote: "Arr, That's Gold!",
    timeline: "Ship's Log",
    discussion: "Crew Parley",
    playbook: "Captain's Orders",
    tip: "Smuggler's Tip",
    gotcha: "Siren's Warning",
    activityFeed: "Crow's Nest Watch",
  },
  microcopy: {
    timelineEmpty: "Yer ship's log be blank, Captain. Set sail and start making history.",
    noComments: "The crew is silent. Someone start the parley!",
    noPlaybook: "No captain's orders have been issued. Be the first to chart the course.",
    commentPlaceholder: "Speak yer mind, ye scurvy dog...",
    rankUpTitle: "PROMOTION ON DECK!",
    rankUpBody: "By the powers vested in Davy Jones, ye've been promoted to {rank}. The crew salutes ye!",
    feedEmpty: "The crow's nest reports nothing on the horizon. Dead calm, Captain.",
  },
};

export const socialMedieval: SocialSlice = {
  concepts: {
    upvote: "By Royal Decree!",
    timeline: "The Royal Chronicle",
    discussion: "Court Deliberations",
    playbook: "The Grand Strategy",
    tip: "Counsel of the Wise",
    gotcha: "Treachery Afoot",
    activityFeed: "Heralds' Tidings",
  },
  microcopy: {
    timelineEmpty: "The royal chronicle is yet unwritten. Let your deeds fill its pages.",
    noComments: "The court is silent. No counsel has been offered. Speak, good subject.",
    noPlaybook: "No grand strategy has been composed. Be the first to advise the Crown.",
    commentPlaceholder: "Offer your counsel to the court...",
    rankUpTitle: "ROYAL ELEVATION",
    rankUpBody: "Hear ye! By grace of the Crown, you have been elevated to {rank}. May you serve the realm with distinction.",
    feedEmpty: "The heralds have no tidings to report. The realm awaits your noble deeds.",
  },
};
