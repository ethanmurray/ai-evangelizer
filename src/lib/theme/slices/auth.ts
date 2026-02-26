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

export const authAcademic: AuthSlice = {
  microcopy: {
    checkEmailTitle: "Verification Pending Faculty Review",
    checkEmailBody: "A verification correspondence has been dispatched to {email}. Please follow the enclosed link to complete your enrollment in the program.",
    checkEmailExpiry: "This invitation expires in 15 minutes. The admissions committee maintains strict deadlines.",
    verifySuccess: "Enrollment confirmed. Welcome to the faculty. Your academic journey begins now.",
    verifyExpired: "This verification has lapsed. Per university policy, you must resubmit your application.",
    verifyAlreadyUsed: "This verification has already been processed. Please consult the registrar if you need assistance signing in.",
    verifyInvalid: "This verification link is not recognized by the registrar. Please reapply through the proper channels.",
    teacherPrompt: "Who was the professor or mentor who introduced you to this curriculum?",
    teacherPlaceholder: "their@email.com",
    teacherSkip: "I am self-taught",
    teacherSubmit: "Cite the source",
  },
};

export const authStartup: AuthSlice = {
  microcopy: {
    checkEmailTitle: "You're Almost In!",
    checkEmailBody: "We just fired off a magic link to {email}. Click it and let's get you building.",
    checkEmailExpiry: "Heads up — link expires in 15 minutes. Move fast or it breaks.",
    verifySuccess: "You're in! Welcome aboard. Time to ship something amazing.",
    verifyExpired: "That link's dead. Iterate — go back and grab a fresh one.",
    verifyAlreadyUsed: "Already claimed! You're good. Just sign in and keep shipping.",
    verifyInvalid: "Bad link. Something broke. Pivot back to signup and try again.",
    teacherPrompt: "Who got you into this? Give your co-founder some credit.",
    teacherPlaceholder: "their@email.com",
    teacherSkip: "I'm a self-starter",
    teacherSubmit: "Give them equity (just kidding, credit)",
  },
};

export const authScifi: AuthSlice = {
  microcopy: {
    checkEmailTitle: "Neural Link Verification Initiated",
    checkEmailBody: "An encrypted verification beacon has been transmitted to {email}. Activate the link to establish your neural connection to the mainframe.",
    checkEmailExpiry: "Beacon signal degrades in 15 minutes. Interface protocol requires timely response.",
    verifySuccess: "Neural link established. Identity matrix verified. Welcome to the network, operator.",
    verifyExpired: "Beacon signal lost. Transmission window has closed. Re-initiate the connection sequence.",
    verifyAlreadyUsed: "This verification packet has already been consumed by the mainframe. Attempt standard interface login.",
    verifyInvalid: "AUTHENTICATION FAILURE: Verification packet corrupted or unrecognized. Re-initiate upload sequence.",
    teacherPrompt: "Which operator first uploaded this knowledge to your neural pathways?",
    teacherPlaceholder: "their@email.com",
    teacherSkip: "Self-acquired from the datastream",
    teacherSubmit: "Log the source operator",
  },
};

export const authRetro: AuthSlice = {
  microcopy: {
    checkEmailTitle: "YOU'VE GOT MAIL!",
    checkEmailBody: "VERIFICATION LINK SENT TO {email}. CHECK YOUR INBOX AND CLICK THE LINK TO CONTINUE.",
    checkEmailExpiry: "LINK EXPIRES IN 15 MINUTES. DO NOT POWER OFF YOUR TERMINAL.",
    verifySuccess: "ACCESS GRANTED. WELCOME TO THE SYSTEM. PRESS ANY KEY TO CONTINUE...",
    verifyExpired: "LINK EXPIRED. SESSION TIMED OUT. PLEASE RESTART AND TRY AGAIN.",
    verifyAlreadyUsed: "ERROR: LINK ALREADY USED. YOU ARE ALREADY REGISTERED. TRY LOGGING IN.",
    verifyInvalid: "INVALID LINK DETECTED. BAD SECTOR. PLEASE RE-REGISTER.",
    teacherPrompt: "WHO SHOWED YOU THIS PROGRAM? ENTER THEIR EMAIL:",
    teacherPlaceholder: "their@email.com",
    teacherSkip: "I FOUND IT MYSELF",
    teacherSubmit: "SUBMIT",
  },
};

export const authNerdy: AuthSlice = {
  microcopy: {
    checkEmailTitle: "A Wild Verification Appeared!",
    checkEmailBody: "We sent a quest notification to {email}. Click the link to accept the quest and join the party!",
    checkEmailExpiry: "This quest expires in 15 minutes. Don't let it despawn!",
    verifySuccess: "Achievement Unlocked: Account Verified! You have joined the fellowship. May your rolls be ever natural 20s.",
    verifyExpired: "Quest expired! The portal has closed. Return to the character creation screen and try again.",
    verifyAlreadyUsed: "This quest has already been completed. No double-dipping on XP! Try signing in.",
    verifyInvalid: "That's not a valid quest scroll. Looks like a forgery from a mimic. Please re-register.",
    teacherPrompt: "Who was your Jedi Master? Which wizard guided you here?",
    teacherPlaceholder: "their@email.com",
    teacherSkip: "I chose the solo campaign",
    teacherSubmit: "Award XP to my mentor",
  },
};

export const authConsulting: AuthSlice = {
  microcopy: {
    checkEmailTitle: "Action Required: Email Verification Deliverable",
    checkEmailBody: "As per our engagement letter, a verification link has been transmitted to {email}. Please action this at your earliest convenience to onboard onto the platform.",
    checkEmailExpiry: "This link has a 15-minute SLA. Please prioritize accordingly to avoid re-scoping.",
    verifySuccess: "Onboarding complete. You are now a fully ramped resource. Let's leverage this momentum to drive impact.",
    verifyExpired: "This verification has exceeded its SLA window. Please circle back to registration to re-initiate the onboarding pipeline.",
    verifyAlreadyUsed: "This verification deliverable has already been actioned. Please leverage the sign-in workflow to access the platform.",
    verifyInvalid: "This verification link failed our quality assurance framework. Please re-engage with the registration process.",
    teacherPrompt: "Which thought leader or key stakeholder evangelized this capability to you?",
    teacherPlaceholder: "their@email.com",
    teacherSkip: "I self-sourced this opportunity",
    teacherSubmit: "Attribute the referral",
  },
};
