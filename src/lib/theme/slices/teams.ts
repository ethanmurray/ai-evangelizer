export interface TeamsSlice {
  concepts: {
    teamDashboard: string;
    skillGaps: string;
    heatmap: string;
  };
  microcopy: {
    heatmapSubtitle: string;
  };
}

export const teamsCult: TeamsSlice = {
  concepts: {
    teamDashboard: "Cult Census",
    skillGaps: "Blind Spots",
    heatmap: "The Conspiracy Map",
  },
  microcopy: {
    heatmapSubtitle: "Which rituals have the masses embraced?",
  },
};

export const teamsCorporate: TeamsSlice = {
  concepts: {
    teamDashboard: "Team Dashboard",
    skillGaps: "Skill Gaps",
    heatmap: "Adoption Heatmap",
  },
  microcopy: {
    heatmapSubtitle: "See which skills are widely adopted vs. underexplored.",
  },
};
