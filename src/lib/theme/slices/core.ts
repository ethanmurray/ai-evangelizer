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
    loginExplainer: string;
    loginStep1Title: string;
    loginStep1Desc: string;
    loginStep2Title: string;
    loginStep2Desc: string;
    loginStep3Title: string;
    loginStep3Desc: string;
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
    loginExplainer: "A secret society dedicated to spreading AI enlightenment through your workplace. Browse the sacred rites, perform them yourself, and recruit others into the fold.",
    loginStep1Title: "Discover the Rites",
    loginStep1Desc: "Browse our collection of AI rituals vetted by the inner circle.",
    loginStep2Title: "Perform the Ritual",
    loginStep2Desc: "Apply the sacred knowledge in your daily work.",
    loginStep3Title: "Recruit Believers",
    loginStep3Desc: "Share with colleagues and earn points in the inner circle.",
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
    loginExplainer: "A practical tool to help your team discover, learn, and share AI skills that make work better. Browse skills, apply them, and share what works.",
    loginStep1Title: "Browse Skills",
    loginStep1Desc: "Explore a curated library of AI use cases for your work.",
    loginStep2Title: "Apply & Practice",
    loginStep2Desc: "Try skills in your actual work and track your progress.",
    loginStep3Title: "Share & Earn",
    loginStep3Desc: "Share with colleagues to earn points and climb the rankings.",
    submissionPrompt: "Share an AI use case you've found valuable",
    aboutTitle: "About This App",
    aboutContent: "This app is just for fun, to encourage more valuable use of AI at work. If it works, we'll rebuild it for real and use it to help our whole company, and maybe our clients, to adopt AI. In early pilot stages, we're doing minimum investment: vibe-coded with no human code review, hosted in a public unapproved location, no security or authentication - so don't put anything sensitive here.\n\nWe're running this like an open source project. David Friedman and Ethan Murray initiated it, but it belongs to anyone who cares to make it better. Anyone can add Issues (feature requests) or directly make code change pull requests at https://github.com/ethanmurray/ai-evangelizer; anyone can merge code and it will auto-deploy to production, so try not to break it for everyone else. It began with no design and just a few rough ideas, so feel totally free to introduce your own ideas and make changes. The only guiding principle is to build something that drives more AI adoption on valuable uses that we want more of at work.",
  },
};

export const coreAcademic: CoreSlice = {
  appName: "The AI Curriculum",
  tagline: "A rigorous inquiry into applied artificial intelligence",
  toneGuidance: "University-professorial. Formal but accessible. Uses academic vocabulary naturally — 'curriculum', 'thesis', 'peer review', 'symposium', 'dissertation', 'faculty'. Authoritative yet encouraging of intellectual curiosity.",
  concepts: {
    useCase: "Thesis",
    useCasePlural: "Theses",
    library: "The Curriculum",
    dashboard: "Your Transcript",
    leaderboard: "Faculty Rankings",
    profile: "Academic Record",
    login: "Matriculate",
    submit: "Defend a thesis",
    newUser: "Freshman",
    about: "Course Syllabus",
  },
  microcopy: {
    notFound: "This page has not been published in any peer-reviewed journal we can locate.",
    loginSubtext: "Enroll in the program and begin your scholarly pursuit",
    loginExplainer: "A structured curriculum for developing applied AI proficiency. Review theses, conduct your own research, and present findings to peers through scholarly collaboration.",
    loginStep1Title: "Review the Syllabus",
    loginStep1Desc: "Browse peer-reviewed AI applications across disciplines.",
    loginStep2Title: "Conduct Research",
    loginStep2Desc: "Apply methodologies in your own professional practice.",
    loginStep3Title: "Publish & Present",
    loginStep3Desc: "Share findings with colleagues and earn academic standing.",
    submissionPrompt: "Present your thesis on a valuable application of AI for peer review",
    aboutTitle: "Course Syllabus & Program Overview",
    aboutContent: "This application constitutes an informal academic exercise designed to encourage more substantive engagement with artificial intelligence in professional settings. Should this pilot prove its thesis, we intend to develop a fully rigorous implementation for broader institutional and client-facing adoption. As this remains in early pilot stages, consider it a working draft: vibe-coded with no formal peer review, hosted on an unapproved public server, with no security or authentication protocols — so please do not submit anything of a sensitive nature.\n\nWe are conducting this as an open-source research project. David Friedman and Ethan Murray served as the founding faculty, but the program belongs to any scholar who wishes to contribute. Anyone may submit Issues (proposals for enhancement) or author code change pull requests at https://github.com/ethanmurray/ai-evangelizer; anyone may merge contributions, which auto-deploy to production — so please exercise collegial responsibility and avoid disrupting the work of fellow researchers. The project began with no formal design and only a preliminary hypothesis, so all are encouraged to introduce original ideas and make revisions. The sole guiding principle of this curriculum is to build something that drives greater AI adoption on the valuable use cases we wish to see flourish at work.",
  },
};

export const coreStartup: CoreSlice = {
  appName: "ShipAI",
  tagline: "Move fast and automate things",
  toneGuidance: "Hustle-culture startup energy. High velocity, high enthusiasm. 'Ship it', 'iterate', '10x', 'disrupt', 'pivot', 'scale', 'MVP'. Think YC demo day energy crossed with a caffeine overdose.",
  concepts: {
    useCase: "Hack",
    useCasePlural: "Hacks",
    library: "The Idea Backlog",
    dashboard: "Your Launch Pad",
    leaderboard: "Unicorn Board",
    profile: "Founder Profile",
    login: "Get In",
    submit: "Ship a hack",
    newUser: "Pre-seed",
    about: "Our Pitch Deck",
  },
  microcopy: {
    notFound: "404 — this page pivoted to a different URL. Iterate and try again.",
    loginSubtext: "Stop reading docs and start shipping",
    loginExplainer: "The fastest way to 10x your AI skills. Find hacks, ship them, share what works, and climb the leaderboard. No meetings required.",
    loginStep1Title: "Scout Hacks",
    loginStep1Desc: "Browse a backlog of high-impact AI use cases ready to ship.",
    loginStep2Title: "Ship It",
    loginStep2Desc: "Build, test, and deploy AI in your actual workflow.",
    loginStep3Title: "Scale It",
    loginStep3Desc: "Share with your team and earn traction on the leaderboard.",
    submissionPrompt: "What AI hack did you ship this week? Drop your MVP here",
    aboutTitle: "The Pitch",
    aboutContent: "Look — this app is an MVP. It's just for fun, to 10x our AI adoption at work. If it gets traction, we'll raise a seed round (kidding) and rebuild it to scale across the whole company and maybe even disrupt our clients' workflows too. We're in early pilot — think pre-seed stage: vibe-coded with zero code review, hosted on a public server with no auth, no security — so don't put anything sensitive here. We ship fast and break things (responsibly).\n\nWe're running this like an open-source startup. David Friedman and Ethan Murray were the co-founders, but this thing belongs to anyone with the hustle to make it better. File Issues (feature requests) or ship pull requests directly at https://github.com/ethanmurray/ai-evangelizer; anyone can merge and it auto-deploys to prod, so try not to push code that takes down the site for everyone. There was no design doc, no PRD, just vibes and velocity — so bring your own ideas, iterate, and make it yours. The only north star metric: drive more AI adoption on the use cases that actually matter at work. Now stop reading and go ship something.",
  },
};

export const coreScifi: CoreSlice = {
  appName: "AI_NEXUS://",
  tagline: "Interface with the machine. Expand the network.",
  toneGuidance: "Futurist/cyberpunk. Cool, slightly detached, technically poetic. 'Neural pathways', 'interface protocol', 'upload', 'download', 'neural link', 'mainframe'. Like a calm AI narrating your journey through cyberspace.",
  concepts: {
    useCase: "Protocol",
    useCasePlural: "Protocols",
    library: "The Databank",
    dashboard: "Neural Hub",
    leaderboard: "Network Hierarchy",
    profile: "Identity Matrix",
    login: "Establish Neural Link",
    submit: "Upload a protocol",
    newUser: "Unlinked Node",
    about: "System Manifest",
  },
  microcopy: {
    notFound: "ERROR: Requested memory sector not found. The data may have been purged from the mainframe.",
    loginSubtext: "Authenticate your neural signature to interface with the network",
    loginExplainer: "A neural interface for cataloging, executing, and transmitting AI protocols across your professional network. Expand the collective intelligence.",
    loginStep1Title: "Scan the Databank",
    loginStep1Desc: "Access AI protocols uploaded by network operators.",
    loginStep2Title: "Execute Protocol",
    loginStep2Desc: "Interface the protocol into your operational environment.",
    loginStep3Title: "Transmit to Network",
    loginStep3Desc: "Broadcast to colleague nodes and increase your sync rating.",
    submissionPrompt: "Upload an AI protocol you have tested in the field",
    aboutTitle: "// SYSTEM MANIFEST",
    aboutContent: "This application is an experimental interface designed to accelerate human-AI integration in professional neural pathways. If this pilot protocol proves viable, we will rebuild the mainframe for full-scale deployment across the organization and potentially extend the network to client nodes. Current status: early beta — vibe-coded with no human code review, hosted on an unsecured public relay, no authentication protocols in place — do not transmit sensitive data through this channel.\n\nThis project operates as an open-source network. David Friedman and Ethan Murray initialized the first build, but the system belongs to any operator who chooses to interface with it. Any node may submit Issues (enhancement requests) or push code modifications directly at https://github.com/ethanmurray/ai-evangelizer; any operator may merge changes, which auto-deploy to the live mainframe — exercise caution to avoid corrupting the network for other linked users. The system was initialized with no design schematic and only raw directives, so all operators are encouraged to upload their own architectures and modify existing code. Prime directive: build something that expands AI adoption across the most valuable use cases in our professional network.",
  },
};

export const coreRetro: CoreSlice = {
  appName: "AI_COMMAND.EXE",
  tagline: "SYSTEM ONLINE. READY.",
  toneGuidance: "BBS/early internet/DOS nostalgia. ALL CAPS for emphasis and system messages. References to LOADING..., PRESS ANY KEY, C:\\>, READY., SYSTEM ONLINE. Think green-on-black terminals, 8-bit aesthetics, and 56k modems.",
  concepts: {
    useCase: "Program",
    useCasePlural: "Programs",
    library: "FILE DIRECTORY",
    dashboard: "HOME SCREEN",
    leaderboard: "HIGH SCORES",
    profile: "USER PROFILE",
    login: "LOG ON",
    submit: "RUN PROGRAM",
    newUser: "NEW USER",
    about: "README.TXT",
  },
  microcopy: {
    notFound: "ERROR 404: FILE NOT FOUND.\nC:\\> PLEASE CHECK PATH AND TRY AGAIN.\nPRESS ANY KEY TO CONTINUE...",
    loginSubtext: "ENTER PASSWORD TO ACCESS SYSTEM. PRESS ANY KEY TO BEGIN.",
    loginExplainer: "A FILE DIRECTORY OF AI PROGRAMS FOR YOUR WORKSPACE. BROWSE FILES, RUN THEM, AND SHARE WITH OTHER USERS ON THE NETWORK.",
    loginStep1Title: "DIR /PROGRAMS",
    loginStep1Desc: "BROWSE THE FILE DIRECTORY FOR AVAILABLE AI PROGRAMS.",
    loginStep2Title: "RUN.EXE",
    loginStep2Desc: "EXECUTE THE PROGRAM IN YOUR WORK ENVIRONMENT.",
    loginStep3Title: "SHARE.EXE",
    loginStep3Desc: "TRANSMIT TO NETWORK USERS AND EARN HIGH SCORE POINTS.",
    submissionPrompt: "ENTER NEW PROGRAM DATA> Describe an AI use case to add to the directory",
    aboutTitle: "README.TXT",
    aboutContent: "LOADING README.TXT...\nREADY.\n\nThis app is just for fun, to encourage more valuable use of AI at work. If it works, we will rebuild it for real and use it to help our whole company, and maybe our clients, to adopt AI. STATUS: EARLY PILOT. Minimum investment: vibe-coded with no human code review, hosted in a public unapproved location, no security or authentication. DO NOT ENTER SENSITIVE DATA.\n\nRUNNING AS OPEN SOURCE PROJECT. David Friedman and Ethan Murray initiated it, but it belongs to anyone who cares to make it better. Anyone can add Issues (feature requests) or directly make code change pull requests at https://github.com/ethanmurray/ai-evangelizer; anyone can merge code and it will auto-deploy to production, so try not to break it for everyone else. It began with no design and just a few rough ideas, so feel totally free to introduce your own ideas and make changes. PRIME DIRECTIVE: Build something that drives more AI adoption on valuable uses that we want more of at work.\n\nSYSTEM ONLINE. READY.",
  },
};

export const coreNerdy: CoreSlice = {
  appName: "AI Quest",
  tagline: "Roll for initiative. Adopt AI. Save the realm.",
  toneGuidance: "Geeky pop culture mashup — D&D, gaming, Star Wars, LOTR, sci-fi references all blended together. Fun, enthusiastic, unapologetically nerdy. Exclamation marks welcome. Think of a DM who also binge-watches sci-fi.",
  concepts: {
    useCase: "Quest",
    useCasePlural: "Quests",
    library: "The Compendium",
    dashboard: "Your Quest Log",
    leaderboard: "Hall of Heroes",
    profile: "Character Sheet",
    login: "Enter the Realm",
    submit: "Embark on a quest",
    newUser: "Level 1 Adventurer",
    about: "Lore & Legend",
  },
  microcopy: {
    notFound: "You have wandered into the Void Between Worlds. This page does not exist in any known dimension. Roll a perception check... nah, it's just a 404.",
    loginSubtext: "The guild awaits, adventurer. Sign in to begin your journey.",
    loginExplainer: "An epic quest log of AI adventures for your workplace. Browse quests, complete trials, and recruit party members to level up together.",
    loginStep1Title: "Browse the Compendium",
    loginStep1Desc: "Discover AI quests submitted by fellow adventurers.",
    loginStep2Title: "Complete the Trial",
    loginStep2Desc: "Apply the skill in your work and earn XP for your efforts.",
    loginStep3Title: "Recruit Party Members",
    loginStep3Desc: "Share with colleagues and earn bonus XP in the Hall of Heroes.",
    submissionPrompt: "What AI quest have you completed? Share your tale with the guild!",
    aboutTitle: "The Sacred Lore",
    aboutContent: "Hear ye, hear ye! This app is a side quest — built just for fun to encourage more valuable use of AI at work. Think of it as the tutorial zone. If this pilot campaign succeeds, we'll forge it anew with legendary-tier craftsmanship and deploy it across the entire realm (our company) and possibly to allied factions (our clients). Current status: early access beta — vibe-coded with no code review party, hosted in the wilds of an unapproved public server, zero authentication wards — so don't store any sensitive scrolls here.\n\nWe're running this like an open-source guild. David Friedman and Ethan Murray were the founding party members, but this quest belongs to any adventurer brave enough to contribute. Anyone can file Issues (side quest requests) or submit pull request contributions at https://github.com/ethanmurray/ai-evangelizer; anyone can merge code and it auto-deploys to the live server, so try not to cast Fireball on production and TPK the whole party. There was no design document — just a napkin map and a dream — so bring your own ideas, homebrew your own features, and make it epic. The one rule of this campaign: build something that drives more AI adoption on the valuable use cases we want to see flourish at work. Now roll for initiative!",
  },
};

export const coreConsulting: CoreSlice = {
  appName: "AI Synergy Hub",
  tagline: "Leveraging best-in-class AI to move the needle",
  toneGuidance: "Management consulting voice pushed to EXTREME, absurd levels. 'Synergize cross-functional paradigm shifts', 'leverage best-in-class deliverables', 'circle back on the value-add', 'boil the ocean to move the needle'. The more buzzwordy and ridiculous the better. Think McKinsey parody meets corporate bingo.",
  concepts: {
    useCase: "Deliverable",
    useCasePlural: "Deliverables",
    library: "Best Practices Repository",
    dashboard: "Value-Add Dashboard",
    leaderboard: "Thought Leadership Index",
    profile: "Stakeholder Profile",
    login: "Onboard to Platform",
    submit: "Socialize a deliverable",
    newUser: "Net-New Stakeholder",
    about: "Executive Summary",
  },
  microcopy: {
    notFound: "This page has been sunset as part of a strategic rationalization exercise. Please circle back with a different URL to re-baseline your expectations.",
    loginSubtext: "Authenticate to unlock synergistic cross-functional AI capabilities",
    loginExplainer: "A best-in-class platform for operationalizing AI capability-building across your organization. Discover deliverables, execute against them, and cascade learnings to stakeholders.",
    loginStep1Title: "Identify Quick Wins",
    loginStep1Desc: "Browse the best practices repository for high-ROI deliverables.",
    loginStep2Title: "Execute the Deliverable",
    loginStep2Desc: "Operationalize the learnings in your day-to-day workflow.",
    loginStep3Title: "Cascade to Stakeholders",
    loginStep3Desc: "Socialize insights cross-functionally and drive value-add metrics.",
    submissionPrompt: "Socialize a high-impact AI deliverable to drive transformational value-add across the enterprise",
    aboutTitle: "Executive Summary & Strategic Rationale",
    aboutContent: "Per our last conversation, this app is a net-new greenfield initiative designed to synergize AI adoption and drive transformational value-add across the enterprise. If this pilot moves the needle, we'll circle back to right-size the solution for end-to-end deployment across the organization and potentially leverage it to boil the ocean with our client-facing engagements. Current state: early-stage MVP — vibe-coded with zero governance, hosted on an unsanctioned public-facing environment, no security or authentication frameworks — so please do not upload any sensitive deliverables to this platform.\n\nWe're operationalizing this as an open-source center of excellence. David Friedman and Ethan Murray were the initial thought leaders, but this initiative belongs to any stakeholder who wants to lean in and add value. Anyone can submit Issues (strategic enhancement proposals) or directly push code change pull requests at https://github.com/ethanmurray/ai-evangelizer; anyone can merge changes which auto-deploy to production, so please exercise due diligence to avoid disrupting the value stream for other stakeholders. This began with no design and just a few directional hypotheses, so feel empowered to ideate, iterate, and drive net-new innovation. The north star: build something that catalyzes AI adoption on the highest-ROI use cases we want to scale across the business. Let's take this offline and align on next steps.",
  },
};

export const coreNoir: CoreSlice = {
  appName: "The AI Files",
  tagline: "Every algorithm has a story. Most of them are lies.",
  toneGuidance: "Hard-boiled detective fiction. 1940s noir, Raymond Chandler meets AI adoption. Cynical, atmospheric, world-weary but sharp. 'Case', 'lead', 'trail', 'gumshoe', 'dame', 'stakeout', 'alibi'. Like a private eye narrating from a dimly lit office with a bottle of bourbon in the desk drawer.",
  concepts: {
    useCase: "Case",
    useCasePlural: "Cases",
    library: "The Case Files",
    dashboard: "Your Office",
    leaderboard: "The Lineup",
    profile: "Your Rap Sheet",
    login: "Walk Through the Door",
    submit: "Open a new case",
    newUser: "Stranger",
    about: "The Back Story",
  },
  microcopy: {
    notFound: "This page is gone, pal. Vanished like a witness who knew too much. Somebody cleaned this place out before you got here.",
    loginSubtext: "The door's unlocked. Step inside and state your business.",
    loginExplainer: "A private agency that tracks AI cases worth investigating. Pull a file, work the case, and tip off your colleagues when you crack something good.",
    loginStep1Title: "Pull a Case File",
    loginStep1Desc: "Browse open cases filed by detectives across the agency.",
    loginStep2Title: "Work the Case",
    loginStep2Desc: "Put the theory to work and see if it holds up in the real world.",
    loginStep3Title: "Tip Off Colleagues",
    loginStep3Desc: "Share good intel with fellow operatives and climb the ranks.",
    submissionPrompt: "Got a case worth filing? Lay it on the desk and don't leave anything out.",
    aboutTitle: "The Back Story",
    aboutContent: "Here's the setup, and I'll give it to you straight. This app is a side job — built on spec to get more people wise to AI at work. If this little operation pans out, we'll rebuild it proper and take it city-wide across the whole company, maybe even loop in the clients. Right now it's still a back-alley job: vibe-coded with no oversight, hosted on some public server with no lock on the door — so don't go leaving anything sensitive lying around.\n\nWe're running this like an open case. David Friedman and Ethan Murray kicked the whole thing off, but this job belongs to anybody with the nerve to pitch in. File an Issue (tip off the detectives) or submit a pull request at https://github.com/ethanmurray/ai-evangelizer; anybody can merge changes and they go live immediately, so try not to blow up the joint for the other operatives. There was no blueprint — just a hunch and a half-empty coffee cup — so bring your own leads, follow your own instincts, and make something of this place. The only standing order: build something that gets more people using AI on the cases that actually matter at work. Now quit reading and start investigating.",
  },
};

export const corePirate: CoreSlice = {
  appName: "AI Plunderers",
  tagline: "Hoist the sails and plunder the seven seas of AI",
  toneGuidance: "Swashbuckling, irreverent, nautical. Captain Jack Sparrow meets AI adoption. Self-aware humor with salty language. 'Plunder', 'booty', 'scallywag', 'sea dog', 'broadside'. Dry wit wrapped in pirate bravado.",
  concepts: {
    useCase: "Plunder",
    useCasePlural: "Plunders",
    library: "The Treasure Map",
    dashboard: "Captain's Quarters",
    leaderboard: "Crew Rankings",
    profile: "Yer Wanted Poster",
    login: "Board the Ship",
    submit: "Chart a plunder",
    newUser: "Stowaway",
    about: "The Pirate Code",
  },
  microcopy: {
    notFound: "Arrr! This page be lost to Davy Jones' locker. Turn the ship around, ye bilge rat.",
    loginSubtext: "Every pirate needs a crew. Sign aboard or walk the plank.",
    loginExplainer: "A treasure map of AI plunders for yer crew. Chart the seas, seize the booty, and conscript yer mates to build the mightiest fleet on the seven seas.",
    loginStep1Title: "Spy the Treasure",
    loginStep1Desc: "Scan the treasure map for AI plunders worth pursuing.",
    loginStep2Title: "Seize the Booty",
    loginStep2Desc: "Put the plunder to work in yer daily toil.",
    loginStep3Title: "Conscript the Crew",
    loginStep3Desc: "Share the map with crewmates and earn doubloons for yer rank.",
    submissionPrompt: "What AI treasure have ye plundered? Chart it on the map for the rest of the crew",
    aboutTitle: "The Pirate Code (More Like Guidelines, Really)",
    aboutContent: "Ahoy! This ship be built for fun — to plunder more valuable AI booty at work. If it proves seaworthy, we'll commission a proper galleon and sail it across the whole company, maybe even raid our clients' shores. We're still in early waters: vibe-coded with no code review, moored at an unapproved public port, no security or authentication — so don't stash any sensitive treasure here, savvy?\n\nWe're running this like a pirate fleet — no navy, no admiralty, just free sailors. David Friedman and Ethan Murray hoisted the first Jolly Roger, but this ship belongs to any scallywag bold enough to grab the wheel. Anyone can file Issues (mutiny requests) or submit pull request raids at https://github.com/ethanmurray/ai-evangelizer; anyone can merge code and it auto-deploys to production, so try not to sink the ship for the rest of the crew. There was no blueprint — just rum, ambition, and a rough sketch on a napkin — so bring your own ideas and make this vessel yours. The only rule of the Pirate Code: build something that drives more AI adoption on the plunders worth plundering at work. Now hoist the colors!",
  },
};

export const coreMedieval: CoreSlice = {
  appName: "The Royal Court of AI",
  tagline: "By decree of the Crown, ye shall master the arcane arts",
  toneGuidance: "Regal, formal, courtly medieval voice. 'By decree', 'henceforth', 'the Crown commands', 'sovereign will', 'the realm prospers'. Think Game of Thrones royal court meets AI adoption. Grand proclamations, noble language, feudal hierarchy. Earnest and majestic, never ironic about its own grandeur.",
  concepts: {
    useCase: "Decree",
    useCasePlural: "Decrees",
    library: "The Royal Archives",
    dashboard: "The Throne Room",
    leaderboard: "Court Rankings",
    profile: "Your Royal Charter",
    login: "Enter the Court",
    submit: "Issue a decree",
    newUser: "Peasant",
    about: "The Crown's Proclamation",
  },
  microcopy: {
    notFound: "This page has been lost to the ages. Neither herald nor cartographer can locate it within the realm. Turn back, good subject.",
    loginSubtext: "Present your seal and be admitted to the Royal Court",
    loginExplainer: "A royal registry of AI decrees for the advancement of the realm. Survey the archives, enact decrees in your domain, and herald wisdom to fellow subjects of the Crown.",
    loginStep1Title: "Survey the Archives",
    loginStep1Desc: "Browse royal decrees issued for the advancement of the realm.",
    loginStep2Title: "Enact the Decree",
    loginStep2Desc: "Put the Crown's wisdom into practice within your domain.",
    loginStep3Title: "Herald to the Realm",
    loginStep3Desc: "Spread the decree to fellow subjects and earn the Crown's favour.",
    submissionPrompt: "Issue a royal decree proclaiming a valuable application of AI for the good of the realm",
    aboutTitle: "A Proclamation from the Crown",
    aboutContent: "Hear ye, hear ye! By sovereign decree, this court has been convened to advance the arcane arts of artificial intelligence throughout the realm. Should this noble endeavour prove its worth, the Crown shall commission a grand reconstruction for deployment across the entire kingdom and, perhaps, to allied dominions beyond our borders. Be it known that this court is in its earliest days — forged in haste with no master craftsman's review, housed upon unsanctioned public grounds, with neither guard nor gate — therefore let no subject entrust sensitive scrolls to these halls.\n\nThis court operates as an open charter. Lord David Friedman and Lord Ethan Murray founded this institution, yet it belongs to any loyal subject who would serve the realm. Any citizen may petition with Issues (proposals for royal improvement) or contribute code directly at https://github.com/ethanmurray/ai-evangelizer; any member of the court may approve changes, which are proclaimed to the realm immediately — so exercise the wisdom befitting your station and do not bring ruin upon your fellow courtiers. This court was established with neither blueprint nor grand design, merely a sovereign vision and the will to act. All subjects are hereby encouraged to bring forth their own counsel and shape these halls. The sole commandment of this court: build something that advances AI adoption upon the most worthy endeavours of the realm.",
  },
};
