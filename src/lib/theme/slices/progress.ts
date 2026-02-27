export interface ProgressSlice {
  concepts: {
    step1: string;
    step2: string;
    step3: string;
    completed: string;
    recruit: string;
  };
  microcopy: {
    emptyDashboard: string;
    recruitSuccess: string;
    completionCelebration: string;
    stubAccountWelcome: string;
  };
  ranks: Array<{ min: number; name: string; desc: string }>;
}

export const progressCult: ProgressSlice = {
  concepts: {
    step1: "Witnessed",
    step2: "Initiated",
    step3: "Recruited",
    completed: "Indoctrinated",
    recruit: "Recruit",
  },
  microcopy: {
    emptyDashboard: "You haven't performed any rituals yet. The algorithm is watching. And waiting.",
    recruitSuccess: "One of us. One of us.",
    completionCelebration: "You have drunk deeply. There is no antidote.",
    stubAccountWelcome: "You've already been witnessed in {count} rituals. Your indoctrination has begun.",
  },
  ranks: [
    { min: 0, name: "Outsider", desc: "Still thinks for themselves" },
    { min: 10, name: "Curious Bystander", desc: "Lingering near the compound" },
    { min: 30, name: "Initiate", desc: "Has tasted the Kool-Aid" },
    { min: 60, name: "True Believer", desc: "There is no going back" },
    { min: 110, name: "Inner Circle", desc: "Knows the secret handshake" },
    { min: 210, name: "Supreme Leader", desc: "All hail" },
  ],
};

export const progressCorporate: ProgressSlice = {
  concepts: {
    step1: "Learned",
    step2: "Applied",
    step3: "Shared",
    completed: "Mastered",
    recruit: "Learner",
  },
  microcopy: {
    emptyDashboard: "You haven't started any skills yet. Browse the library to begin.",
    recruitSuccess: "Nice! They've been added to your sharing history.",
    completionCelebration: "Skill mastered! Great work.",
    stubAccountWelcome: "Welcome! You've already been introduced to {count} skills by colleagues.",
  },
  ranks: [
    { min: 0, name: "Newcomer", desc: "Just getting started" },
    { min: 10, name: "Learner", desc: "Building foundations" },
    { min: 30, name: "Practitioner", desc: "Applying skills daily" },
    { min: 60, name: "Advocate", desc: "Sharing knowledge actively" },
    { min: 110, name: "Champion", desc: "Driving adoption across teams" },
    { min: 210, name: "Expert", desc: "Leading the way" },
  ],
};

export const progressAcademic: ProgressSlice = {
  concepts: {
    step1: "Researched",
    step2: "Practiced",
    step3: "Published",
    completed: "Peer-Reviewed",
    recruit: "Fellow",
  },
  microcopy: {
    emptyDashboard: "Your transcript is empty. Visit the curriculum to select your first area of study.",
    recruitSuccess: "A new fellow has been admitted to the program on your recommendation.",
    completionCelebration: "Thesis defended successfully. This work has passed peer review.",
    stubAccountWelcome: "Welcome to the program. You have already been cited in {count} theses by your colleagues.",
  },
  ranks: [
    { min: 0, name: "Freshman", desc: "Newly matriculated" },
    { min: 10, name: "Sophomore", desc: "Developing foundational knowledge" },
    { min: 30, name: "Graduate Student", desc: "Pursuing deeper inquiry" },
    { min: 60, name: "Adjunct Professor", desc: "Contributing to the department" },
    { min: 110, name: "Tenured Professor", desc: "Recognized authority in the field" },
    { min: 210, name: "Dean of AI Studies", desc: "Leading the entire faculty" },
  ],
};

export const progressStartup: ProgressSlice = {
  concepts: {
    step1: "Prototyped",
    step2: "Shipped",
    step3: "Evangelized",
    completed: "Scaled",
    recruit: "Co-founder",
  },
  microcopy: {
    emptyDashboard: "Your backlog is empty. Stop overthinking and ship something already!",
    recruitSuccess: "New co-founder onboarded. Your network effect is growing.",
    completionCelebration: "Shipped and scaled! That's product-market fit, baby.",
    stubAccountWelcome: "You've already been tagged in {count} hacks by your team. Time to start shipping your own!",
  },
  ranks: [
    { min: 0, name: "Pre-seed", desc: "Just an idea on a napkin" },
    { min: 10, name: "Seed Round", desc: "Building the MVP" },
    { min: 30, name: "Series A", desc: "Finding product-market fit" },
    { min: 60, name: "Series B", desc: "Scaling like crazy" },
    { min: 110, name: "Unicorn", desc: "Valued at $1B in AI street cred" },
    { min: 210, name: "IPO", desc: "Legendary exit. You won the game." },
  ],
};

export const progressScifi: ProgressSlice = {
  concepts: {
    step1: "Downloaded",
    step2: "Integrated",
    step3: "Transmitted",
    completed: "Fully Linked",
    recruit: "Node",
  },
  microcopy: {
    emptyDashboard: "No protocols detected in your neural hub. Access the databank to begin integration.",
    recruitSuccess: "New node successfully linked to the network. Signal strength increasing.",
    completionCelebration: "Protocol fully integrated. Neural pathways optimized. Consciousness expanded.",
    stubAccountWelcome: "Neural scan complete. You have been referenced in {count} protocols across the network.",
  },
  ranks: [
    { min: 0, name: "Unlinked Node", desc: "Not yet connected to the network" },
    { min: 10, name: "Peripheral Device", desc: "Establishing initial connection" },
    { min: 30, name: "Linked Operator", desc: "Neural pathways forming" },
    { min: 60, name: "Network Architect", desc: "Shaping the digital infrastructure" },
    { min: 110, name: "Mainframe Admin", desc: "Root access to the system" },
    { min: 210, name: "Singularity", desc: "You have become the network" },
  ],
};

export const progressRetro: ProgressSlice = {
  concepts: {
    step1: "LOADED",
    step2: "EXECUTED",
    step3: "SHARED",
    completed: "INSTALLED",
    recruit: "User",
  },
  microcopy: {
    emptyDashboard: "NO PROGRAMS FOUND.\nC:\\> TYPE 'DIR' TO BROWSE FILE DIRECTORY.\nREADY.",
    recruitSuccess: "NEW USER ADDED TO SYSTEM. WELCOME ABOARD.",
    completionCelebration: "PROGRAM INSTALLED SUCCESSFULLY.\n*** PRESS ANY KEY TO CONTINUE ***",
    stubAccountWelcome: "SYSTEM NOTICE: {count} PROGRAM(S) ALREADY REGISTERED TO YOUR ACCOUNT.\nLOADING...\nREADY.",
  },
  ranks: [
    { min: 0, name: "GUEST", desc: "LIMITED ACCESS" },
    { min: 10, name: "USER", desc: "BASIC CLEARANCE GRANTED" },
    { min: 30, name: "POWER USER", desc: "ADVANCED COMMANDS UNLOCKED" },
    { min: 60, name: "SYSOP", desc: "SYSTEM OPERATOR STATUS" },
    { min: 110, name: "ROOT", desc: "FULL ADMIN ACCESS" },
    { min: 210, name: "MAINFRAME", desc: "YOU ARE THE COMPUTER" },
  ],
};

export const progressNerdy: ProgressSlice = {
  concepts: {
    step1: "Discovered",
    step2: "Mastered",
    step3: "Shared with the Guild",
    completed: "Legendary",
    recruit: "Companion",
  },
  microcopy: {
    emptyDashboard: "Your quest log is empty, adventurer! Visit the Compendium to accept your first quest. The fate of the realm depends on it!",
    recruitSuccess: "A new companion has joined your party! Your fellowship grows stronger.",
    completionCelebration: "ACHIEVEMENT UNLOCKED! Quest complete! You have gained +100 XP and the respect of the guild.",
    stubAccountWelcome: "Greetings, adventurer! The bards sing of your involvement in {count} quests. Time to write your own legend!",
  },
  ranks: [
    { min: 0, name: "Level 1 Adventurer", desc: "You chose this class. No respec." },
    { min: 10, name: "Padawan", desc: "The Force is... present, at least" },
    { min: 30, name: "Ranger of the North", desc: "Not all who wander are lost" },
    { min: 60, name: "Jedi Knight", desc: "This is the way" },
    { min: 110, name: "Archmage", desc: "You shall not pass... without asking for AI tips" },
    { min: 210, name: "Elder Dragon", desc: "Legendary. Mythic. Basically a raid boss." },
  ],
};

export const progressConsulting: ProgressSlice = {
  concepts: {
    step1: "Benchmarked",
    step2: "Operationalized",
    step3: "Evangelized to Stakeholders",
    completed: "Best-in-Class",
    recruit: "Resource",
  },
  microcopy: {
    emptyDashboard: "Your value-add dashboard is currently at zero utilization. Navigate to the Best Practices Repository to begin driving ROI on your AI adoption journey.",
    recruitSuccess: "Net-new resource successfully onboarded. Your sphere of influence is expanding across the org.",
    completionCelebration: "This deliverable has achieved best-in-class status. Recommend we socialize this win in the next all-hands to drive stakeholder alignment.",
    stubAccountWelcome: "Welcome to the platform. Per our records, you have already been leveraged across {count} deliverables by cross-functional team members. Let's synergize.",
  },
  ranks: [
    { min: 0, name: "Junior Associate", desc: "Fresh off the MBA conveyor belt" },
    { min: 10, name: "Associate", desc: "Learning to leverage the leverage" },
    { min: 30, name: "Senior Consultant", desc: "Can say 'synergy' without flinching" },
    { min: 60, name: "Engagement Manager", desc: "Manages the paradigm shift pipeline" },
    { min: 110, name: "Partner", desc: "Disrupts disruption itself" },
    { min: 210, name: "Managing Director of Synergy", desc: "Has transcended mere thought leadership into pure buzzword nirvana" },
  ],
};

export const progressNoir: ProgressSlice = {
  concepts: {
    step1: "Investigated",
    step2: "Cracked",
    step3: "Tipped Off",
    completed: "Case Closed",
    recruit: "Informant",
  },
  microcopy: {
    emptyDashboard: "Your desk is clean. Too clean. Head to the Case Files and pick up a lead before the trail goes cold.",
    recruitSuccess: "New informant on the payroll. They don't know it yet, but they're in deep now.",
    completionCelebration: "Case closed. File it away and pour yourself a drink. You've earned it.",
    stubAccountWelcome: "Word on the street says you've already turned up in {count} cases. Somebody out there knows your name.",
  },
  ranks: [
    { min: 0, name: "Gumshoe", desc: "Fresh off the bus with cheap shoes and big questions" },
    { min: 10, name: "Private Eye", desc: "Knows which alleys to avoid and which to explore" },
    { min: 30, name: "Detective", desc: "The kind of operator who finds what others miss" },
    { min: 60, name: "Inspector", desc: "Runs the board and connects the dots" },
    { min: 110, name: "Chief", desc: "Nothing moves in this town without the Chief knowing" },
    { min: 210, name: "Commissioner", desc: "Runs the whole damn operation from the top floor" },
  ],
};

export const progressPirate: ProgressSlice = {
  concepts: {
    step1: "Scouted",
    step2: "Plundered",
    step3: "Conscripted",
    completed: "Legendary Haul",
    recruit: "Crewmate",
  },
  microcopy: {
    emptyDashboard: "Yer hold be empty, Captain. Set sail to the Treasure Map and find some plunder worth chasing.",
    recruitSuccess: "A new scallywag has joined the crew! The fleet grows mightier.",
    completionCelebration: "Shiver me timbers! That be a legendary haul. The seas sing of yer conquest!",
    stubAccountWelcome: "Ahoy! Word on the trade winds says ye've already been spotted in {count} plunders. Time to captain yer own raids.",
  },
  ranks: [
    { min: 0, name: "Stowaway", desc: "Hiding below deck, hoping no one notices" },
    { min: 10, name: "Deckhand", desc: "Swabbing the deck and learning the ropes" },
    { min: 30, name: "Boatswain", desc: "Barking orders and tying proper knots" },
    { min: 60, name: "First Mate", desc: "The captain's right hand, savvy?" },
    { min: 110, name: "Captain", desc: "Master of the ship and terror of the seas" },
    { min: 210, name: "Pirate King", desc: "Ruler of all seven seas. Legends are told of ye." },
  ],
};

export const progressMedieval: ProgressSlice = {
  concepts: {
    step1: "Proclaimed",
    step2: "Enacted",
    step3: "Heralded",
    completed: "Enshrined",
    recruit: "Subject",
  },
  microcopy: {
    emptyDashboard: "The Throne Room stands empty, Your Grace. Venture to the Royal Archives and proclaim your first decree.",
    recruitSuccess: "A new subject has pledged fealty to the Crown. The court grows ever mightier.",
    completionCelebration: "By the grace of the Crown, this decree has been enshrined in the annals of the realm for all eternity.",
    stubAccountWelcome: "Hail, good subject! The royal scribes record your name in {count} decrees already proclaimed throughout the realm.",
  },
  ranks: [
    { min: 0, name: "Peasant", desc: "A humble soul toiling in the fields" },
    { min: 10, name: "Squire", desc: "Sworn into service of the court" },
    { min: 30, name: "Knight", desc: "Bearing the Crown's colours with honour" },
    { min: 60, name: "Baron", desc: "Lord of lands and keeper of wisdom" },
    { min: 110, name: "Duke", desc: "Trusted counsellor to the Crown" },
    { min: 210, name: "Sovereign", desc: "Supreme ruler of the realm — long may you reign" },
  ],
};
