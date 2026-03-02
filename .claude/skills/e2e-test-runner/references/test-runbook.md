# AI Evangelizer — Chrome DevTools MCP Test Runbook

**App URL:** https://ai-evangelizer.vercel.app
**Login:** dafriedman@gmail.com (existing user, magic link auth)
**Test count:** 38 test cases across 15 suites (14 non-invasive + 1 invasive)

---

## Suite 0: Auth & Login

### 0.1 — Navigate to App & Determine Auth State
1. `navigate_page` → `https://ai-evangelizer.vercel.app/dashboard`
2. `wait_for` → `["Welcome back", "Continue", "Email"]` (15s)
3. `take_snapshot`
- **Pass:** If "Welcome back" visible → already logged in, skip to Suite 1. If login page → proceed to 0.2.

### 0.2 — Login Page Explainer Cards
1. `navigate_page` → `https://ai-evangelizer.vercel.app/login`
2. `wait_for` → `["Continue"]` (10s)
3. `take_snapshot` + `take_screenshot`
- **Pass:** 3 numbered step cards visible, app heading, tagline, email input, Continue button

### 0.3 — Login with Email
1. `fill` email input → `dafriedman@gmail.com`
2. `click` Continue button
3. `wait_for` → `["Welcome back", "Check your email"]` (15s)
4. **Branch A (auto-redirect):** URL contains `/dashboard` → done
5. **Branch B (magic link):** Use `evaluate_script` to fetch token from Supabase, then `navigate_page` → `/auth/verify?token=xxx`
- **Pass:** URL is `/dashboard`, user name visible

### 0.4 — Email Validation
1. On login page, click Continue with empty email → verify "valid email" error
2. Fill `invalid-email`, click Continue → verify "valid email" error
- **Pass:** Error messages appear for both cases

---

## Suite 1: Dashboard

### 1.1 — Core Elements
1. `navigate_page` → `/dashboard`
2. `take_snapshot` + `list_console_messages(error)`
- **Pass:** Welcome message, rank display, points, quick links (Library + Leaderboard), no console errors

### 1.2 — Rank Display
1. From snapshot, verify: "Current Rank" label, rank name, numeric points, "more to reach" progress text
- **Pass:** All rank card elements present

### 1.3 — Quick Links Navigation
1. Click Library link → verify `/library` loads
2. Navigate back → click Leaderboard link → verify `/leaderboard` loads
- **Pass:** Both links navigate correctly

### 1.4 — About Modal
1. Find and click About button
2. `take_snapshot` → verify modal with about content appears
- **Pass:** Modal opens with content and close button

### 1.5 — Conditional Sections
1. Check for: In Progress, Completed, Recommendations, Trending, Activity feed sections
2. If activity feed present, verify "View all" link
- **Pass:** Sections with data render; empty sections hidden

---

## Suite 2: Navigation / AppShell

### 2.1 — Desktop Sidebar
1. `emulate` viewport 1280×800
2. `take_snapshot` → verify 7 nav items: Dashboard, Library, Feed, Leaderboard, Badges, Profile, Getting Started
3. Click each nav item → verify correct route
- **Pass:** All nav items present and functional

### 2.2 — Mobile Bottom Nav
1. `emulate` viewport 375×812 (mobile)
2. `take_snapshot` → verify bottom nav present, sidebar hidden
3. Click Library → verify `/library`
- **Pass:** Bottom nav visible, sidebar hidden, navigation works

### 2.3 — Reset Viewport
1. `emulate` viewport 1280×800

---

## Suite 3: Library

### 3.1 — Core Elements
1. `navigate_page` → `/library`
2. `take_snapshot` + `list_console_messages(error)`
- **Pass:** Search input, Submit button, sort buttons, label pills, use case cards visible, no errors

### 3.2 — Search
1. Fill search → `email`
2. `take_snapshot` → verify filtered results
3. Clear search → verify all results restored
- **Pass:** Search filters and clears correctly

### 3.3 — Label Filter
1. Click a label pill (e.g. "Coding")
2. Verify results filtered, "Clear filters" link appears
3. Click "Clear filters" → verify full results
- **Pass:** Label filter toggles work

### 3.4 — Sort
1. Click "Easiest" → verify active styling
2. Click "Hardest" → verify active styling
3. Click "Default" → verify reset
- **Pass:** Sort buttons toggle correctly

### 3.5 — Submit Use Case Modal
1. Click "Submit" button → verify modal with Title, Description, Resources, Labels, Submit/Cancel
2. Click Cancel → verify modal closes
- **Pass:** Modal opens/closes with correct fields (do NOT submit)

### 3.6 — Card Navigation
1. Click first use case card → verify `/library/[id]` detail page loads
- **Pass:** Detail page shows title, description, progress card

---

## Suite 4: Use Case Detail

### 4.1 — Core Elements
1. `take_snapshot` + `list_console_messages(error)`
- **Pass:** Back button, title, description, labels, Follow, difficulty, upvote, progress card, comments, related use cases, no errors

### 4.2 — Follow Button
1. Click Follow → verify "Following" state
2. Click again → verify dropdown (Instant/Daily/Unfollow)
3. Click Unfollow → verify "Follow" state
- **Pass:** Follow toggle and dropdown work

### 4.3 — Upvote Button
1. Note current count, click upvote
2. Verify count changed
- **Pass:** Count updates on click

### 4.4 — Progress Steps
1. Verify "Your Progress" card with Learn/Apply/Share steps
2. Verify appropriate action button for current progress state
- **Pass:** Progress card renders with correct state

### 4.5 — Back Navigation
1. Click Back → verify returns to `/library`
- **Pass:** Returns to library listing

---

## Suite 5: Leaderboard

### 5.1 — Core Elements
1. `navigate_page` → `/leaderboard`
2. `take_snapshot` + `list_console_messages(error)`
- **Pass:** 4 view buttons (Individuals, Teams, Team Dashboard, Heatmap), rankings visible, no errors

### 5.2 — View Mode Switching
1. Click Teams → verify team rankings
2. Click Team Dashboard → verify team analytics
3. Click Heatmap → verify heatmap grid
4. Click Individuals → verify individual rankings
- **Pass:** All 4 views render distinct content

### 5.3 — Team Filter
1. On Individuals view, find team filter dropdown
2. Select a specific team → verify filtered results
3. Reset to All Teams
- **Pass:** Filter works

---

## Suite 6: Activity Feed

### 6.1 — Core Elements
1. `navigate_page` → `/feed`
2. `take_snapshot` + `list_console_messages(error)`
- **Pass:** All/My Team buttons, activity items visible, no errors

### 6.2 — Team Filter Toggle
1. Click "My Team" → verify active styling
2. Click "All" → verify active styling
- **Pass:** Filter toggles work

### 6.3 — Load More
1. If "Load more" visible, click it → verify more items loaded
- **Pass:** Pagination works (or N/A if not enough items)

---

## Suite 7: Badges

### 7.1 — Core Elements
1. `navigate_page` → `/badges`
2. `take_snapshot` + `list_console_messages(error)`
- **Pass:** "X of Y earned", 4 categories (Learning, Applying, Sharing & Teaching, Special), badge cards, no errors

### 7.2 — Badge Details
1. Find earned badge → verify emoji, name, "Earned [date]"
2. Find unearned badge → verify progress bar with numeric label
- **Pass:** Earned/unearned badges visually distinct

---

## Suite 8: Profile

### 8.1 — Core Elements
1. `navigate_page` → `/profile`
2. `take_snapshot` + `list_console_messages(error)`
- **Pass:** User info, Share Profile, Export PDF, rank, skill radar, badges, theme toggle, dark mode, replay tour, sign out, no errors

### 8.2 — Theme Toggle
1. Open theme dropdown → verify 11 themes (8 free + 3 unlockable with point thresholds)
2. Select "Startup Mode" → verify theme name updates
3. Revert to "Corporate Mode"
- **Pass:** Theme dropdown works, locked themes show requirements

### 8.3 — Dark Mode Toggle
1. Click toggle → verify mode label changes (Dark ↔ Light)
2. `take_screenshot` → verify visual change
3. Click again to revert
- **Pass:** Toggle switches mode with visual change

### 8.4 — Sign Out (RUN LAST)
1. Click "Sign Out" → verify redirect to `/login`
- **Pass:** Session destroyed, redirected to login

---

## Suite 9: Theme System

### 9.1 — Theme Text Adaptation
1. Switch to "Sci-Fi Mode" on profile
2. Navigate to `/dashboard` + `/library` → verify themed headings/text
3. Revert to "Corporate Mode"
- **Pass:** UI text changes per theme

### 9.2 — Unlockable Theme Visibility
1. Open theme dropdown → verify point thresholds: Pirate (30), Film Noir (75), Medieval (150)
- **Pass:** Locked themes show point requirements or "Unlocked" status

---

## Suite 10: Responsive Design

### 10.1 — Mobile Layout (375×812)
1. `emulate` mobile viewport
2. Navigate dashboard, library, leaderboard, badges → `take_screenshot` each
3. Verify: bottom nav visible, no sidebar, no horizontal overflow
- **Pass:** All pages render correctly on mobile

### 10.2 — Tablet Layout (768×1024)
1. `emulate` tablet viewport
2. Navigate same pages → `take_screenshot` each
- **Pass:** Layout adapts appropriately

### 10.3 — Reset to Desktop (1280×800)

---

## Suite 11: Error & Edge Cases

### 11.1 — Console Error Audit
1. Navigate all 7 main pages, `list_console_messages(error)` on each
- **Pass:** No unexpected console errors

### 11.2 — 404 Handling
1. `navigate_page` → `/nonexistent-page-xyz`
2. `take_snapshot` → verify no crash
- **Pass:** Shows 404 or redirects gracefully

### 11.3 — Network Request Audit
1. On dashboard, `list_network_requests(fetch, xhr)` → check for 4xx/5xx failures
- **Pass:** All API requests return 2xx

---

## Suite 12: Performance

### 12.1 — Dashboard Performance
1. Navigate to `/dashboard`
2. `performance_start_trace` reload=true, autoStop=true
3. Check: LCP < 2.5s, CLS < 0.1
- **Pass:** Core Web Vitals within thresholds

### 12.2 — Library Performance
1. Navigate to `/library`
2. `performance_start_trace` reload=true, autoStop=true
- **Pass:** Same thresholds

---

## Suite 13: Getting Started

### 13.1 — Core Elements
1. `navigate_page` → `/getting-started`
2. `take_snapshot` + `list_console_messages(error)`
- **Pass:** Heading, numbered steps, code blocks, pro tip card, no errors

---

## Execution Order

0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8.1–8.3 → 9 → 10 → 11 → 12 → 13 → **8.4 (Sign Out — last)**

---

## Suite 14: Invasive Tests (Data-Changing)

**Test user:** dafriedman@gmail.com (David Friedman) — dedicated test account
**Prerequisite:** Logged in as test user. Run after all non-invasive suites (0–13).

### I1 — Follow / Unfollow Use Case
1. Navigate to a use case detail (e.g. "Code review" at `/library/a6485dcf-...`)
2. Click "Follow" button → verify text changes to "Following (Instant)"
3. Click the following button again → verify dropdown shows: Instant, Daily, Unfollow
4. Click "Unfollow" → verify button reverts to "Follow"
- **Pass:** Follow lifecycle works: Follow → Following (Instant) → dropdown → Unfollow → Follow

### I2 — Upvote Use Case
1. On use case detail, note current "X Recommend" count
2. Click the upvote/Recommend button
3. Verify count increments by 1
- **Pass:** Count increases (e.g. "2 Recommend" → "3 Recommend")

### I3 — Add Comment
1. On use case detail, scroll to comment section
2. Select comment type (e.g. "Tip") from type selector
3. Fill comment textarea with test text
4. Click "Post" button
5. Verify comment appears in list with user name and correct type badge
- **Pass:** Comment visible with author name, type badge, and text

### I4 — Progress Steps (Learn / Apply)
1. On use case detail, find "Your Progress" card
2. Click "Mark as Learned" → verify Learned step fills in
3. Handle "Who taught you?" prompt → click "Skip" or "Give credit"
4. Click "Mark as Applied" → verify Applied step fills in
5. Verify: difficulty rating buttons become enabled, Share step shows email picker, Playbook section appears
- **Pass:** Learn → Apply flow completes, unlocks dependent features

### I5 — Rate Difficulty
1. After applying, find difficulty rating buttons (Easy / Moderate / Hard)
2. Click one (e.g. "Moderate")
3. Verify label changes to "Your rating" and count increments
- **Pass:** Rating saved, label updates, count increases

### I6 — Submit a New Use Case
1. Navigate to `/library`
2. Click "Submit a skill" button → modal opens
3. Fill Title (required), Description (required), optionally Resources
4. Select 1-2 label buttons (e.g. "Testing", "Automation")
5. Click "Submit"
6. Verify modal closes and new use case appears in library list
- **Pass:** New card visible in library with correct title, description, labels
- **Note:** Use `evaluate_script` with native value setter for React controlled inputs

### I7 — Theme Switching Persistence
1. Navigate to `/profile`
2. Open theme dropdown, select "Sci-Fi Mode"
3. Verify UI text transforms (e.g. "My Profile" → "Identity Matrix", "Badges" → "Augmentations")
4. Navigate to `/dashboard` → verify Sci-Fi theme persists
5. Revert to "Corporate Mode"
- **Pass:** Theme changes persist across navigation, all themed text updates correctly

### I8 — Share Profile
1. On `/profile`, click "Share Profile"
2. Read clipboard via `evaluate_script` → `navigator.clipboard.readText()`
3. Verify clipboard contains a profile URL like `/profile/[uuid]`
4. Navigate to the copied URL → verify public profile loads
- **Pass:** Profile URL copied to clipboard, loads correctly when visited

### I9 — Add / Remove Team
1. On `/profile`, click "+ Add Team"
2. Verify team picker appears with existing teams
3. Select a team (e.g. "Test Team") and click "Add"
4. Verify team tag appears on profile with × remove button
5. Click × to remove team → verify team removed
- **Pass:** Team added and removed successfully

### I10 — Dismiss Getting Started Checklist
1. Navigate to `/dashboard`
2. Find "Getting Started" section with progress (e.g. "4/5 complete")
3. Click "Dismiss" button
4. Verify checklist disappears from dashboard
- **Pass:** Checklist removed from view

---

## Test Results Summary

Report results in this format:

### Non-Invasive Tests (Suites 0–13)

| Suite | Tests | Result | Notes |
|-------|-------|--------|-------|
| 0: Auth & Login | 4 | | |
| 1: Dashboard | 5 | | |
| 2: Navigation | 3 | | |
| 3: Library | 6 | | |
| 4: Use Case Detail | 5 | | |
| 5: Leaderboard | 3 | | |
| 6: Activity Feed | 3 | | |
| 7: Badges | 2 | | |
| 8: Profile | 4 | | |
| 9: Theme System | 2 | | |
| 10: Responsive | 3 | | |
| 11: Error/Edge | 3 | | |
| 12: Performance | 2 | | |
| 13: Getting Started | 1 | | |

### Invasive Tests (Suite 14)

| Test | Description | Result | Notes |
|------|-------------|--------|-------|
| I1 | Follow/Unfollow | | |
| I2 | Upvote | | |
| I3 | Add Comment | | |
| I4 | Progress Steps | | |
| I5 | Difficulty Rating | | |
| I6 | Submit Use Case | | |
| I7 | Theme Persistence | | |
| I8 | Share Profile | | |
| I9 | Add/Remove Team | | |
| I10 | Dismiss Checklist | | |
