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

export const teamsAcademic: TeamsSlice = {
  concepts: {
    teamDashboard: "Department Faculty Overview",
    skillGaps: "Curricular Deficiencies",
    heatmap: "Competency Distribution Matrix",
  },
  microcopy: {
    heatmapSubtitle: "A peer-reviewed visualization of departmental proficiency across the curriculum.",
  },
};

export const teamsStartup: TeamsSlice = {
  concepts: {
    teamDashboard: "Squad Pulse",
    skillGaps: "Growth Opportunities",
    heatmap: "Velocity Heatmap",
  },
  microcopy: {
    heatmapSubtitle: "Ship faster by seeing where your team needs to 10x their skills.",
  },
};

export const teamsScifi: TeamsSlice = {
  concepts: {
    teamDashboard: "Crew Manifest",
    skillGaps: "Neural Pathway Deficits",
    heatmap: "Interface Protocol Grid",
  },
  microcopy: {
    heatmapSubtitle: "Mainframe analysis of collective neural link integration levels.",
  },
};

export const teamsRetro: TeamsSlice = {
  concepts: {
    teamDashboard: "CREW ROSTER",
    skillGaps: "MISSING FILES",
    heatmap: "SYSTEM HEATMAP",
  },
  microcopy: {
    heatmapSubtitle: "LOADING SKILL MATRIX... PLEASE WAIT... SYSTEM ONLINE.",
  },
};

export const teamsNerdy: TeamsSlice = {
  concepts: {
    teamDashboard: "Party Roster",
    skillGaps: "Unfilled Skill Trees",
    heatmap: "World Map (Fog of War)",
  },
  microcopy: {
    heatmapSubtitle: "Reveal which skill trees your party has leveled up and which zones are still unexplored.",
  },
};

export const teamsConsulting: TeamsSlice = {
  concepts: {
    teamDashboard: "Cross-Functional Synergy Dashboard",
    skillGaps: "Capability Delta Analysis",
    heatmap: "Strategic Alignment Heatmap",
  },
  microcopy: {
    heatmapSubtitle: "Leverage this best-in-class visualization to identify white-space opportunities across your human capital portfolio.",
  },
};
