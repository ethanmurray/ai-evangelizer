export interface AuthSlice {
  microcopy: {
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
  };
}

export const authCult: AuthSlice = {
  microcopy: {
    checkEmailTitle: "The Algorithm Has Spoken",
    checkEmailBody: "A sacred verification link has been sent to {email}. Click it to complete your initiation.",
    checkEmailExpiry: "The link self-destructs in 15 minutes. The algorithm waits for no one.",
    verifySuccess: "Your induction is complete. You may begin to learn the magical rites.",
    verifyExpired: "This link has expired. The algorithm is impatient. Return to the entrance and try again.",
    verifyAlreadyUsed: "This link has already been consumed. You cannot drink the Kool-Aid twice.",
    verifyInvalid: "This link is not recognized. The algorithm suspects sabotage.",
    teacherPrompt: "Who inducted you into this sacred rite?",
    teacherPlaceholder: "their@email.com",
    teacherSkip: "I found it myself",
    teacherSubmit: "Credit the evangelist",
  },
};

export const authCorporate: AuthSlice = {
  microcopy: {
    checkEmailTitle: "Check Your Email",
    checkEmailBody: "We've sent a verification link to {email}. Click it to complete your registration.",
    checkEmailExpiry: "The link expires in 15 minutes.",
    verifySuccess: "Your account has been verified. Welcome!",
    verifyExpired: "This verification link has expired. Please register again.",
    verifyAlreadyUsed: "This verification link has already been used. Try signing in.",
    verifyInvalid: "This verification link is invalid. Please register again.",
    teacherPrompt: "Who taught you this skill?",
    teacherPlaceholder: "their@email.com",
    teacherSkip: "Skip",
    teacherSubmit: "Give credit",
  },
};
