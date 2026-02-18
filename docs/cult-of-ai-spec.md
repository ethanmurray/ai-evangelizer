# The Cult of AI — MVP Spec

## Overview

A gamified web app to drive GenAI adoption across a large corporation. Users complete "see one, do one, teach two" progressions on various AI use cases to earn badges and climb a leaderboard. The app uses a playful cult/conspiracy theme but is fully skinnable for other organizations.

**Initial pilot**: 20-40 software engineers and data scientists in a Digital and AI practice. Seeded with dev-focused use cases, but open to any submissions.

---

## Users & Registration

- Fields: name, email, team (select from existing or add new)
- No authentication—just email to identify returning users
- No password, no magic link for MVP. Just "enter your email" to log in
- Plan for Okta integration later, but not now

---

## Use Cases

- Fields: title, short description, resources (flexible—could be a URL, a person's name, a written guide, a video link), submitted_by, upvote count
- Seeded with ~10-15 software dev use cases at launch
- Anyone can submit new ones
- Anyone can upvote a use case, one per user per use case
- No categories yet, just a single list sorted by upvote count by default, with search
- No moderation or approval flow

---

## Progression per Use Case

- **Step 1 (See)** → self-attested, one click
- **Step 2 (Do)** → self-attested, one click
- **Step 3 (Teach)** → enter recipient's email, twice to complete. Recipient gets that use case auto-marked as Step 1 complete on their account

When someone is shared with who hasn't signed up yet, create a stub account (is_stub = true) so they see progress when they eventually join. On first real login, convert the stub to a full account (is_stub = false).

---

## Ranks

- Calculated from count of fully completed use cases (all three steps done)
- Six tiers with configurable thresholds (default: 0, 1-2, 3-5, 6-10, 11-20, 21+)
- Rank names and descriptions are theme-dependent (see Skinning section)

---

## Screens

1. **Login/Register** — Email input, name and team if new user
2. **Dashboard** — Current rank with progress to next, use cases in progress, recent activity, quick link to library
3. **Library** — List view sorted by upvote count, search bar, "submit new" button, each card shows title, upvote count, your status (not started / in progress / completed)
4. **Detail** — Title, description, resources, progress steps with action buttons, upvote button, submitted by
5. **Leaderboard** — Ranked list showing name, rank title, completed count, team. Filter by team dropdown
6. **Profile** — Your rank, full list of use cases with status, sharing history (who you've taught, who taught you)

---

## Skinning & Theming System

The app must be fully skinnable across two dimensions: **visual theme** and **content theme**. Think of it like i18n but for personality, not language.

### Content Theme (text/copy swap)

All user-facing strings live in a single theme file. A theme file defines:

- App name and tagline
- Naming for core concepts: use cases, library, upvotes, dashboard, leaderboard, profile, login page, submit action, three progression steps, completion state
- Rank definitions: array of {name, description, min_threshold}
- UI microcopy: empty states, onboarding messages, 404 page, confirmation messages, sharing notifications, completion celebrations
- Tone guidance (for reference, not rendered)

### "Cult" theme (default)

```typescript
export const cultTheme = {
  appName: "The Cult of AI",
  tagline: "Adjust your tinfoil hat and join us",
  concepts: {
    useCase: "Ritual",
    useCasePlural: "Rituals",
    library: "The Sacred Texts",
    upvote: "Drink the Kool-Aid",
    dashboard: "Your Bunker",
    leaderboard: "The Inner Circle",
    profile: "Your Dossier",
    login: "Join the Cult",
    submit: "Channel a vision",
    step1: "Witnessed",
    step2: "Initiated",
    step3: "Recruited",
    completed: "Indoctrinated",
    newUser: "Outsider",
    recruit: "Recruit",
  },
  ranks: [
    { min: 0, name: "Outsider", desc: "Still thinks for themselves" },
    { min: 1, name: "Curious Bystander", desc: "Lingering near the compound" },
    { min: 3, name: "Initiate", desc: "Has tasted the Kool-Aid" },
    { min: 6, name: "True Believer", desc: "There is no going back" },
    { min: 11, name: "Inner Circle", desc: "Knows the secret handshake" },
    { min: 21, name: "Supreme Leader", desc: "All hail" },
  ],
  microcopy: {
    emptyDashboard: "You haven't performed any rituals yet. The algorithm is watching. And waiting.",
    recruitSuccess: "One of us. One of us.",
    completionCelebration: "You have drunk deeply. There is no antidote.",
    stubAccountWelcome: "You've already been witnessed in {count} rituals. Your indoctrination has begun.",
    notFound: "This page has been redacted by the government.",
    loginSubtext: "There is no leaving. (Just kidding. But also not.)",
    submissionPrompt: "Share what the algorithm has revealed to you",
  },
  toneGuidance: "Dry, self-aware humor. Conspiracy board meets corporate training. Never try-hard.",
};
```

### "Corporate" theme (example alternative)

```typescript
export const corporateTheme = {
  appName: "AI Skills Tracker",
  tagline: "Learn, practice, share",
  concepts: {
    useCase: "Skill",
    useCasePlural: "Skills",
    library: "Skill Library",
    upvote: "Recommend",
    dashboard: "My Progress",
    leaderboard: "Team Rankings",
    profile: "My Profile",
    login: "Sign In",
    submit: "Submit a skill",
    step1: "Learned",
    step2: "Applied",
    step3: "Shared",
    completed: "Mastered",
    newUser: "New Member",
    recruit: "Learner",
  },
  ranks: [
    { min: 0, name: "Newcomer", desc: "Just getting started" },
    { min: 1, name: "Learner", desc: "Building foundations" },
    { min: 3, name: "Practitioner", desc: "Applying skills daily" },
    { min: 6, name: "Advocate", desc: "Sharing knowledge actively" },
    { min: 11, name: "Champion", desc: "Driving adoption across teams" },
    { min: 21, name: "Expert", desc: "Leading the way" },
  ],
  microcopy: {
    emptyDashboard: "You haven't started any skills yet. Browse the library to begin.",
    recruitSuccess: "Nice! They've been added to your sharing history.",
    completionCelebration: "Skill mastered! Great work.",
    stubAccountWelcome: "Welcome! You've already been introduced to {count} skills by colleagues.",
    notFound: "Page not found.",
    loginSubtext: "Track your AI learning journey",
    submissionPrompt: "Share an AI use case you've found valuable",
  },
  toneGuidance: "Professional, warm, encouraging. Standard corporate L&D voice.",
};
```

### Visual Theme (look and feel swap)

Separate from content theme, controls:

- Color palette: primary, secondary, accent, background, surface, text colors
- Typography: heading font, body font
- Visual motifs
- Rank icons/badges
- Animation style
- Logo/icon

**"Conspiracy Board"** (pairs with Cult):
- Dark background (#1a1a2e or similar)
- Red (#e63946) and gold (#f4a261) accents
- Typewriter heading font (Special Elite or Courier Prime from Google Fonts)
- Clean sans-serif body (Inter)
- Corkboard textures, red string, pushpin accents as subtle visual elements
- Tinfoil hat as logo/icon
- Slightly glitchy or flickery micro-animations

**"Clean"** (pairs with Corporate):
- Light background
- Blue/green professional accents
- Modern sans-serif throughout (Inter or similar)
- Minimal decoration
- Standard smooth fade transitions
- Generic app icon

### Implementation approach

- Content themes: TypeScript files following a shared interface, loaded via React context provider
- Every component pulls strings from context via a `useTheme()` hook, never hardcodes user-facing text
- Visual themes: Tailwind CSS with CSS custom properties, swapped via the same context
- Content and visual themes are independent (can mix and match)
- Theme is set via environment variable, not user-selectable in MVP
- Adding a new theme = creating one content TS file and one Tailwind preset/CSS file

---

## Data Model (Supabase/Postgres)

All table and column names are theme-agnostic.

### users
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | primary key, default gen_random_uuid() |
| name | text | required |
| email | text | unique, required |
| team | text | required |
| is_stub | boolean | default false, true if created via sharing before signup |
| created_at | timestamptz | default now() |

### teams
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | primary key, default gen_random_uuid() |
| name | text | unique, required |
| created_at | timestamptz | default now() |

(Optional—can just use freetext team on users for MVP. Separate table is cleaner for leaderboard filtering.)

### use_cases
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | primary key, default gen_random_uuid() |
| title | text | required |
| description | text | required |
| resources | text | markdown/plaintext, can contain URLs, names, guides |
| submitted_by | uuid | foreign key → users.id, nullable for seeded content |
| created_at | timestamptz | default now() |

### upvotes
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | primary key, default gen_random_uuid() |
| user_id | uuid | foreign key → users.id |
| use_case_id | uuid | foreign key → use_cases.id |
| created_at | timestamptz | default now() |
| | | unique constraint on (user_id, use_case_id) |

### progress
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | primary key, default gen_random_uuid() |
| user_id | uuid | foreign key → users.id |
| use_case_id | uuid | foreign key → use_cases.id |
| seen_at | timestamptz | nullable, set when step 1 completed |
| done_at | timestamptz | nullable, set when step 2 completed |
| created_at | timestamptz | default now() |
| | | unique constraint on (user_id, use_case_id) |

### shares
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | primary key, default gen_random_uuid() |
| sharer_id | uuid | foreign key → users.id (person who taught) |
| recipient_id | uuid | foreign key → users.id (person who learned) |
| use_case_id | uuid | foreign key → use_cases.id |
| created_at | timestamptz | default now() |

### Derived calculations (not stored)

- A use case is "completed" for a user when:
  - progress.seen_at IS NOT NULL
  - AND progress.done_at IS NOT NULL  
  - AND count of shares where sharer_id = user AND use_case_id = this use case >= 2
- User's rank = count of completed use cases matched against rank thresholds
- Upvote count = count of upvotes for a use_case_id

### Useful views/queries to create

- `user_completed_counts`: user_id, count of fully completed use cases
- `use_case_upvote_counts`: use_case_id, count of upvotes
- `user_progress_summary`: user_id, use_case_id, seen_at, done_at, share_count, is_completed

---

## Tech Stack

- **Next.js** with App Router
- **Supabase** for database (Postgres)
- **Supabase JS client** for data access
- **Tailwind CSS** with CSS custom properties for theme switching
- **Deploy to Vercel**

### Supabase notes

- Use Supabase JS client for all data access
- Skip Row Level Security (RLS) for MVP—add later with real auth
- The `is_stub` pattern: when a stub user "signs up," update their record and set is_stub = false
- Plan for Okta integration later, potentially via Supabase Auth with SAML

---

## Seed Data

Seed the database with 10-15 software development focused use cases. Examples:

1. **Code generation** — Use AI to write boilerplate code, utility functions, or scaffold new features
2. **Code review** — Have AI review your PR for bugs, style issues, or improvements
3. **Debug assistance** — Paste error messages and stack traces to get debugging suggestions
4. **Write unit tests** — Generate test cases for existing functions
5. **Documentation** — Generate README files, docstrings, or API documentation
6. **SQL query writing** — Describe what data you need in plain English, get SQL back
7. **Regex generation** — Describe the pattern you need, get a working regex
8. **Code refactoring** — Ask AI to simplify, optimize, or modernize existing code
9. **Learn a new framework** — Use AI as an interactive tutor for unfamiliar technologies
10. **Data transformation** — Convert data between formats (JSON, CSV, XML, etc.)
11. **API integration** — Get help understanding and integrating third-party APIs
12. **Git help** — Complex git operations explained and generated
13. **Shell scripting** — Generate bash/zsh scripts for automation tasks
14. **Code translation** — Convert code between programming languages

---

## Design Direction

For the default "Cult" theme with "Conspiracy Board" visuals:

- Dark, moody background
- Accents of red and gold
- Typewriter-style headings
- Subtle corkboard/pushpin textures where appropriate (don't overdo it)
- Tinfoil hat iconography
- Dry, knowing humor in all copy—like an inside joke, not trying too hard
- Mobile-first, responsive design
- Micro-interactions that feel slightly conspiratorial (subtle flickers, reveals)

---

## Out of Scope for MVP

- Authentication (Okta, passwords, magic links)
- Row Level Security
- Email notifications
- Categories/tags for use cases
- Moderation/approval workflow
- Admin panel
- Rewards/gift card redemption system
- Native mobile app
