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
  },
};
