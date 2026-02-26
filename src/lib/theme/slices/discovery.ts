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
