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
    edit: string;
    save: string;
    cancel: string;
    about: string;
    badges: string;
    difficulty: string;
    activityFeed: string;
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
    editTitle: string;
    editTitleLabel: string;
    editDescriptionLabel: string;
    editResourcesLabel: string;
    editSuccess: string;
    editError: string;
    aboutTitle: string;
    aboutContent: string;
    checkEmailTitle: string;
    checkEmailBody: string;
    checkEmailExpiry: string;
    verifySuccess: string;
    verifyExpired: string;
    verifyAlreadyUsed: string;
    verifyInvalid: string;
    teacherPrompt: string;
    teacherPlaceholder: string;
    teacherSkip: string;
    teacherSubmit: string;
    shareConfirmed: string;
    shareDenied: string;
    shareInvalidToken: string;
    shareStatusChanged: string;
    rankUpTitle: string;
    rankUpBody: string;
    feedEmpty: string;
  };
  badgeNames: Record<string, { name: string; description: string }>;
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
