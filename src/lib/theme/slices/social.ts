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
