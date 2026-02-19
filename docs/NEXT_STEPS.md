# Next Steps

## Status (2026-02-18)

The app is deployed and working on Vercel. Auth flow (register + login) is functional. The full UI is in place: login, dashboard, library, use-case detail, leaderboard, and profile pages.

## Priority Items

### 1. Enable Row Level Security (RLS)
RLS is currently disabled for MVP speed. Before any real user data flows through, enable RLS policies on all tables. At minimum:
- Users can only update their own profile
- Progress records are scoped to the logged-in user
- Upvotes are one-per-user-per-use-case
- Shares are owned by the creating user

### 2. Seed Use Cases
The library page is empty. Seed the `use_cases` table with the initial dev-focused AI use cases from the spec (code review, documentation, testing, etc.). Can be done via a Supabase migration or admin UI.

### 3. Clean Up Test Users
Playwright tests create real users with `pw-*` prefixed emails. Consider:
- A cron job or admin endpoint to purge test users
- Or a separate Supabase project for testing

### 4. Custom Domain
Set up a custom domain on Vercel instead of the auto-generated `.vercel.app` URL.

### 5. Fix Supabase MCP
The Supabase MCP plugin is currently not working (locked to wrong project via OAuth). Options:
- Reinstall the marketplace plugin and re-authorize, selecting the correct project (`kxdibcvlsnsxxezukxfu`)
- Or use the local `supabase-mcp` npm package with PAT auth

## Future Enhancements

### Auth Migration
- Add Supabase Auth or Okta SSO (the auth abstraction layer is designed for this)
- The `SimpleAuthProvider` can be swapped for `SupabaseAuthProvider` or `OktaAuthProvider`

### Features
- Admin panel for managing use cases
- Email notifications for progress milestones
- Team leaderboard (in addition to individual)
- Export/reporting for leadership
- Dark/light mode toggle (visual themes are already built)
- Content theme toggle (cult vs corporate)

### Testing
- Add visual regression tests with Playwright screenshots
- Add API-level tests for data layer functions
- Consider a test Supabase project to avoid polluting production data
