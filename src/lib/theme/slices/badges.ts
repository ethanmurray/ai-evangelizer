export interface BadgesSlice {
  concepts: {
    badges: string;
    skillRadar: string;
  };
  badgeNames: Record<string, { name: string; description: string }>;
}

export const badgesCult: BadgesSlice = {
  concepts: {
    badges: "Sacred Marks",
    skillRadar: "The All-Seeing Eye",
  },
  badgeNames: {
    first_learn: { name: "The Awakening", description: "Witnessed your first ritual" },
    first_apply: { name: "First Blood", description: "Performed your first ritual" },
    first_share: { name: "Blood Oath", description: "Shared the forbidden knowledge" },
    ten_learned: { name: "Deep State", description: "Witnessed 10 rituals" },
    five_applied: { name: "Dark Arts Practitioner", description: "Performed 5 rituals" },
    taught_five: { name: "Cult Recruiter", description: "Indoctrinated 5 souls" },
    full_stack_ai: { name: "Omniscient One", description: "Mastered all domains of forbidden knowledge" },
    submitted_one: { name: "The Channeler", description: "Channeled a vision from the algorithm" },
    five_completed: { name: "Inner Circle Candidate", description: "Fully indoctrinated in 5 rituals" },
    speed_learner: { name: "Flash Indoctrination", description: "Witnessed 3 rituals in a single day" },
    twenty_five_learned: { name: "The Enlightened", description: "Witnessed 25 rituals — your third eye is fully open" },
    ten_applied: { name: "Dark Arts Master", description: "Performed 10 rituals with your own hands" },
    ten_shared: { name: "Prophet", description: "Spread the word 10 times" },
    three_submitted: { name: "Oracle", description: "Channeled 3 visions from the algorithm" },
    taught_ten: { name: "Grand Recruiter", description: "Indoctrinated 10 souls into the fold" },
    ten_completed: { name: "Supreme Devotee", description: "Fully mastered 10 rituals" },
  },
};

export const badgesCorporate: BadgesSlice = {
  concepts: {
    badges: "Badges",
    skillRadar: "Skill Radar",
  },
  badgeNames: {
    first_learn: { name: "First Step", description: "Learned your first skill" },
    first_apply: { name: "Applied!", description: "Applied your first skill" },
    first_share: { name: "First Share", description: "Shared a skill with a colleague" },
    ten_learned: { name: "10 Learned", description: "Learned 10 skills" },
    five_applied: { name: "5 Applied", description: "Applied 5 skills" },
    taught_five: { name: "Mentor", description: "Taught 5 different people" },
    full_stack_ai: { name: "Full Stack AI", description: "Completed a use case in every category" },
    submitted_one: { name: "Contributor", description: "Submitted a skill to the library" },
    five_completed: { name: "5 Mastered", description: "Fully mastered 5 skills" },
    speed_learner: { name: "Quick Learner", description: "Learned 3 skills in one day" },
    twenty_five_learned: { name: "Knowledge Expert", description: "Learned 25 skills" },
    ten_applied: { name: "Power User", description: "Applied 10 skills" },
    ten_shared: { name: "Team Player", description: "Shared 10 times with colleagues" },
    three_submitted: { name: "Thought Leader", description: "Submitted 3 skills to the library" },
    taught_ten: { name: "Senior Mentor", description: "Taught 10 different people" },
    ten_completed: { name: "AI Champion", description: "Fully mastered 10 skills" },
  },
};

export const badgesAcademic: BadgesSlice = {
  concepts: {
    badges: "Credentials",
    skillRadar: "Competency Matrix",
  },
  badgeNames: {
    first_learn: { name: "Matriculation", description: "Enrolled in your first course of study" },
    first_apply: { name: "Lab Practicum", description: "Applied theory in a practical setting" },
    first_share: { name: "First Publication", description: "Published your findings to the faculty" },
    ten_learned: { name: "Dean's List", description: "Completed 10 courses of study" },
    five_applied: { name: "Tenured Practitioner", description: "Demonstrated applied mastery in 5 domains" },
    taught_five: { name: "Distinguished Professor", description: "Mentored 5 students through the curriculum" },
    full_stack_ai: { name: "Polymath", description: "Achieved interdisciplinary mastery across all fields" },
    submitted_one: { name: "Peer-Reviewed Author", description: "Submitted a thesis for peer review" },
    five_completed: { name: "Summa Cum Laude", description: "Completed 5 full courses with distinction" },
    speed_learner: { name: "Accelerated Program", description: "Completed 3 courses in a single symposium session" },
  },
};

export const badgesStartup: BadgesSlice = {
  concepts: {
    badges: "Achievements",
    skillRadar: "Growth Radar",
  },
  badgeNames: {
    first_learn: { name: "Day One", description: "Shipped your first learning -- iterate from here!" },
    first_apply: { name: "First Deploy", description: "Pushed your first skill to production" },
    first_share: { name: "Evangelist", description: "Spread the word -- growth hacking starts here" },
    ten_learned: { name: "10x Learner", description: "Learned 10 skills -- you're scaling fast" },
    five_applied: { name: "Serial Shipper", description: "Applied 5 skills -- move fast, break things" },
    taught_five: { name: "Team Multiplier", description: "Upskilled 5 teammates -- that's real leverage" },
    full_stack_ai: { name: "Unicorn", description: "Mastered every category -- you ARE the disruption" },
    submitted_one: { name: "Open Source Contributor", description: "Submitted a skill -- building in public" },
    five_completed: { name: "Product-Market Fit", description: "Fully completed 5 skills -- you found your niche" },
    speed_learner: { name: "Blitzscaler", description: "Learned 3 skills in one day -- hypergrowth mode" },
  },
};

export const badgesScifi: BadgesSlice = {
  concepts: {
    badges: "Augmentations",
    skillRadar: "Neural Scan",
  },
  badgeNames: {
    first_learn: { name: "First Upload", description: "Initial data packet uploaded to your neural cortex" },
    first_apply: { name: "Protocol Activated", description: "Executed your first interface protocol in the field" },
    first_share: { name: "Signal Broadcast", description: "Transmitted knowledge across the neural network" },
    ten_learned: { name: "Cortex Expansion", description: "10 data modules integrated into your neural pathways" },
    five_applied: { name: "Field Operator", description: "Deployed 5 protocols in live mainframe environments" },
    taught_five: { name: "Network Architect", description: "Established neural links with 5 operatives" },
    full_stack_ai: { name: "Singularity", description: "All known systems merged into unified consciousness" },
    submitted_one: { name: "Code Injector", description: "Uploaded new firmware to the collective mainframe" },
    five_completed: { name: "Cyber-Enhanced", description: "5 full augmentation cycles completed" },
    speed_learner: { name: "Overclock", description: "3 data uploads in a single cycle -- neural link overheating" },
  },
};

export const badgesRetro: BadgesSlice = {
  concepts: {
    badges: "ACHIEVEMENTS.DAT",
    skillRadar: "RADAR.EXE",
  },
  badgeNames: {
    first_learn: { name: "HELLO WORLD", description: "FIRST PROGRAM LOADED SUCCESSFULLY" },
    first_apply: { name: "RUN.EXE", description: "EXECUTED FIRST SKILL... PRESS ANY KEY TO CONTINUE" },
    first_share: { name: "SHARE.COM", description: "FILE SHARED ON BBS -- 1 DOWNLOAD(S)" },
    ten_learned: { name: "POWER USER", description: "10 PROGRAMS LOADED INTO MEMORY" },
    five_applied: { name: "SYSOP", description: "5 SKILLS DEPLOYED -- SYSTEM ONLINE" },
    taught_five: { name: "BBS MODERATOR", description: "UPLOADED KNOWLEDGE TO 5 USERS... LOADING..." },
    full_stack_ai: { name: "ROOT ACCESS", description: "ALL DIRECTORIES UNLOCKED -- TOTAL SYSTEM MASTERY" },
    submitted_one: { name: "UPLOAD COMPLETE", description: "1 FILE UPLOADED TO THE BOARD SUCCESSFULLY" },
    five_completed: { name: "ELITE STATUS", description: "5 PROGRAMS FULLY EXECUTED -- WELCOME TO L33T" },
    speed_learner: { name: "TURBO MODE", description: "3 PROGRAMS IN 1 SESSION -- CPU OVERCLOCKED" },
  },
};

export const badgesNerdy: BadgesSlice = {
  concepts: {
    badges: "Loot Drops",
    skillRadar: "Character Sheet",
  },
  badgeNames: {
    first_learn: { name: "A New Hope", description: "Your journey begins, young padawan" },
    first_apply: { name: "Critical Hit!", description: "Rolled a nat 20 on your first skill check" },
    first_share: { name: "Fellowship Founded", description: "Shared lore with the party -- one does not simply hoard knowledge" },
    ten_learned: { name: "Skill Tree Unlocked", description: "10 abilities learned -- your power level is over 9000" },
    five_applied: { name: "Combo Breaker", description: "Chained 5 skills -- MULTI-KILL" },
    taught_five: { name: "Dungeon Master", description: "Guided 5 adventurers through the campaign" },
    full_stack_ai: { name: "Prestige Class", description: "Mastered all skill trees -- achievement unlocked: Legendary" },
    submitted_one: { name: "Side Quest Complete", description: "Submitted a new quest to the guild board" },
    five_completed: { name: "Completionist", description: "100% completion on 5 quests -- no collectibles missed" },
    speed_learner: { name: "Speed Run", description: "3 quests in one session -- any% no glitches" },
  },
};

export const badgesConsulting: BadgesSlice = {
  concepts: {
    badges: "Competency Validators",
    skillRadar: "360-Degree Capability Assessment",
  },
  badgeNames: {
    first_learn: { name: "Onboarded", description: "Successfully aligned on your first learning deliverable" },
    first_apply: { name: "Value Actualized", description: "Leveraged a best-in-class skill in a real-world engagement" },
    first_share: { name: "Thought Leader", description: "Cascaded key learnings to downstream stakeholders" },
    ten_learned: { name: "Synergy Engine", description: "Synthesized 10 cross-functional competency modules" },
    five_applied: { name: "Results-Oriented Executor", description: "Operationalized 5 high-impact deliverables end-to-end" },
    taught_five: { name: "Force Multiplier", description: "Upleveled 5 resources via proactive knowledge-transfer cadences" },
    full_stack_ai: { name: "Paradigm Architect", description: "Synergized cross-functional paradigm shifts across all verticals" },
    submitted_one: { name: "IP Contributor", description: "Drove net-new intellectual property into the firm's asset portfolio" },
    five_completed: { name: "Circle-Back Champion", description: "Closed the loop on 5 end-to-end capability-building workstreams" },
    speed_learner: { name: "Agile Learner", description: "Fast-tracked 3 competency sprints in a single billing cycle -- let's double-click on that" },
  },
};
