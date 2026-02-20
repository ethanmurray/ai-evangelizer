export interface ContentTheme {
  appName: string;
  tagline: string;
  concepts: {
    useCase: string;
    useCasePlural: string;
    library: string;
    upvote: string;
    dashboard: string;
    leaderboard: string;
    profile: string;
    login: string;
    submit: string;
    step1: string;
    step2: string;
    step3: string;
    completed: string;
    newUser: string;
    recruit: string;
    delete: string;
  };
  ranks: Array<{ min: number; name: string; desc: string }>;
  microcopy: {
    emptyDashboard: string;
    recruitSuccess: string;
    completionCelebration: string;
    stubAccountWelcome: string;
    notFound: string;
    loginSubtext: string;
    submissionPrompt: string;
    deleteConfirmTitle: string;
    deleteConfirmBody: string;
    deleteConfirmPlaceholder: string;
    deleteConfirmButton: string;
    deleteSuccess: string;
  };
  toneGuidance: string;
}

export interface VisualTheme {
  name: string;
  cssClass: string;
}

export interface AppTheme {
  content: ContentTheme;
  visual: VisualTheme;
}
