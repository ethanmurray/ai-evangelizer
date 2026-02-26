export interface CoreSlice {
  appName: string;
  tagline: string;
  toneGuidance: string;
  concepts: {
    useCase: string;
    useCasePlural: string;
    library: string;
    dashboard: string;
    leaderboard: string;
    profile: string;
    login: string;
    submit: string;
    newUser: string;
    about: string;
  };
  microcopy: {
    notFound: string;
    loginSubtext: string;
    submissionPrompt: string;
    aboutTitle: string;
    aboutContent: string;
  };
}

export const coreCult: CoreSlice = {
  appName: "The Cult of AI",
  tagline: "Adjust your tinfoil hat and join us",
  toneGuidance: "Dry, self-aware humor. Conspiracy board meets corporate training. Never try-hard.",
  concepts: {
    useCase: "Ritual",
    useCasePlural: "Rituals",
    library: "The Sacred Rites",
    dashboard: "Your Bunker",
    leaderboard: "The Inner Circle",
    profile: "Your Dossier",
    login: "Join the Cult",
    submit: "Channel a vision",
    newUser: "Outsider",
    about: "Behind the Curtain",
  },
  microcopy: {
    notFound: "This page has been redacted by the government.",
    loginSubtext: "There is no leaving. (Just kidding. But also not.)",
    submissionPrompt: "Share what the algorithm has revealed to you",
    aboutTitle: "The Truth Revealed",
    aboutContent: "This app is just for fun, to encourage more valuable use of AI at work. If it works, we'll rebuild it for real and use it to help our whole company, and maybe our clients, to adopt AI. In early pilot stages, we're doing minimum investment: vibe-coded with no human code review, hosted in a public unapproved location, no security or authentication - so don't put anything sensitive here.\n\nWe're running this like an open source project. David Friedman and Ethan Murray initiated it, but it belongs to anyone who cares to make it better. Anyone can add Issues (feature requests) or directly make code change pull requests at https://github.com/ethanmurray/ai-evangelizer; anyone can merge code and it will auto-deploy to production, so try not to break it for everyone else. It began with no design and just a few rough ideas, so feel totally free to introduce your own ideas and make changes. The only guiding principle is to build something that drives more AI adoption on valuable uses that we want more of at work.",
  },
};

export const coreCorporate: CoreSlice = {
  appName: "AI Skills Tracker",
  tagline: "Learn, practice, share",
  toneGuidance: "Professional, warm, encouraging. Standard corporate L&D voice.",
  concepts: {
    useCase: "Skill",
    useCasePlural: "Skills",
    library: "Skill Library",
    dashboard: "My Progress",
    leaderboard: "Team Rankings",
    profile: "My Profile",
    login: "Sign In",
    submit: "Submit a skill",
    newUser: "New Member",
    about: "About This App",
  },
  microcopy: {
    notFound: "Page not found.",
    loginSubtext: "Track your AI learning journey",
    submissionPrompt: "Share an AI use case you've found valuable",
    aboutTitle: "About This App",
    aboutContent: "This app is just for fun, to encourage more valuable use of AI at work. If it works, we'll rebuild it for real and use it to help our whole company, and maybe our clients, to adopt AI. In early pilot stages, we're doing minimum investment: vibe-coded with no human code review, hosted in a public unapproved location, no security or authentication - so don't put anything sensitive here.\n\nWe're running this like an open source project. David Friedman and Ethan Murray initiated it, but it belongs to anyone who cares to make it better. Anyone can add Issues (feature requests) or directly make code change pull requests at https://github.com/ethanmurray/ai-evangelizer; anyone can merge code and it will auto-deploy to production, so try not to break it for everyone else. It began with no design and just a few rough ideas, so feel totally free to introduce your own ideas and make changes. The only guiding principle is to build something that drives more AI adoption on valuable uses that we want more of at work.",
  },
};
