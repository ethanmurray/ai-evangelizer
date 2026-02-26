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
