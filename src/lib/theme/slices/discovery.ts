export interface DiscoverySlice {
  concepts: {
    recommended: string;
    related: string;
  };
  microcopy: {
    noRecommendations: string;
  };
}

export const discoveryCult: DiscoverySlice = {
  concepts: {
    recommended: "The Algorithm Suggests",
    related: "Fellow Travelers",
  },
  microcopy: {
    noRecommendations: "The algorithm has not yet divined your path.",
  },
};

export const discoveryCorporate: DiscoverySlice = {
  concepts: {
    recommended: "Recommended For You",
    related: "Related Skills",
  },
  microcopy: {
    noRecommendations: "Start learning to get personalized recommendations.",
  },
};

export const discoveryAcademic: DiscoverySlice = {
  concepts: {
    recommended: "Suggested Coursework",
    related: "Adjacent Disciplines",
  },
  microcopy: {
    noRecommendations: "Complete prerequisite modules to receive curriculum recommendations from your advisor.",
  },
};

export const discoveryStartup: DiscoverySlice = {
  concepts: {
    recommended: "Hot Skills to Ship",
    related: "Adjacent Plays",
  },
  microcopy: {
    noRecommendations: "Start iterating on a skill and we'll surface your next growth hack.",
  },
};

export const discoveryScifi: DiscoverySlice = {
  concepts: {
    recommended: "Neural Link Suggests",
    related: "Connected Pathways",
  },
  microcopy: {
    noRecommendations: "Insufficient data uploaded to the mainframe. Begin interfacing to activate recommendations.",
  },
};

export const discoveryRetro: DiscoverySlice = {
  concepts: {
    recommended: ">>> RECOMMENDED.EXE",
    related: "SEE ALSO:",
  },
  microcopy: {
    noRecommendations: "NO DATA FOUND. PRESS ANY KEY TO BEGIN LOADING RECOMMENDATIONS...",
  },
};

export const discoveryNerdy: DiscoverySlice = {
  concepts: {
    recommended: "Quest Board",
    related: "Side Quests",
  },
  microcopy: {
    noRecommendations: "The quest board is empty. Complete your first adventure to unlock new quests!",
  },
};

export const discoveryConsulting: DiscoverySlice = {
  concepts: {
    recommended: "High-Impact Value-Add Opportunities",
    related: "Adjacency Synergy Matrix",
  },
  microcopy: {
    noRecommendations: "Let's circle back once you've built out your capability stack to surface net-new paradigm-shifting recommendations.",
  },
};
