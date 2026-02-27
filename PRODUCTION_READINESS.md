# Production Readiness Plan

## Context

The app is a Next.js 16 internal tool ("The Cult of AI") deployed on Vercel with Supabase and Resend. It's currently in MVP/prototype state with several security shortcuts taken during development — auth verification bypassed, API routes unauthenticated, real credentials committed to git, no security headers, no RLS on core tables. This plan prioritizes fixes by risk level.

---

## P0 — Critical Security (fix before real users)

### 1. Rotate leaked credentials & sanitize `.env.example`
- **File:** `.env.example`
- The file contains a real Resend API key, real Supabase URL/key, and a personal email — all committed to git
- Replace all values with placeholders (e.g., `RESEND_API_KEY=re_your_key_here`)
- Rotate the Resend API key in the Resend dashboard
- **Effort:** Small

### 2. Fix auth bypass — require magic link verification
- **File:** `src/lib/auth/providers/SimpleAuthProvider.ts` (lines 34-40, 57-63)
- Both `register()` and `login()` return the user immediately without email verification (marked `// BYPASS`)
- Uncomment the verification flow so users must click the magic link before gaining access
- Also update `src/app/api/auth/verify-magic-link/route.ts` to mark tokens as `used_at` after verification (currently tokens can be reused)
- **Effort:** Small (code exists, just needs uncommenting)

### 3. Add security headers via middleware
- **Create:** `src/middleware.ts`
- Add `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`, and a baseline CSP
- Use `'unsafe-inline'` for scripts initially (needed for the theme hydration script in `layout.tsx`); can tighten with nonces later
- **Effort:** Small

### 4. Authenticate email API routes
- **Files:** `src/app/api/send-share-email/route.ts`, `send-learned-email/route.ts`, `send-reply-email/route.ts`, `test-email/route.ts`
- All four routes accept unauthenticated POST requests — anyone can trigger emails
- Create a shared helper (`src/lib/api-auth.ts`) that verifies the caller is a real user
- Gate `/api/test-email` to dev-only (`NODE_ENV !== 'production'`)
- **Effort:** Medium

### 5. Add rate limiting to magic link + email endpoints
- **Create:** `src/lib/rate-limit.ts`
- Simple in-memory rate limiter (e.g., 3 magic links per email per 15 min, 10 email sends per IP per minute)
- Apply to `send-magic-link` and all email routes
- For a more durable solution, swap to `@upstash/ratelimit` later
- **Effort:** Small

### 6. Fix HTML injection in email templates
- **Create:** `src/lib/utils/escape-html.ts` (extract from `reply-notification.ts` which already has `escapeHtml()`)
- Apply to all user-derived strings in: `send-share-email/route.ts` (lines 55-56 — `displayName`, `useCaseTitle` injected raw), `send-learned-email/route.ts`, `send-magic-link/route.ts`, `weekly-digest.ts`
- **Effort:** Small

### 7. Enable RLS on Supabase tables
- **Create:** New migration (e.g., `supabase/migrations/017_enable_rls.sql`)
- The core schema (`001_cult_of_ai_schema.sql`) creates tables without RLS — meaning anyone with the public anon key can read/write all data directly via the Supabase REST API
- Enable RLS and add appropriate policies for each table
- Move admin-only queries (`src/lib/data/admin.ts`) to server-side API routes using `supabaseServer`
- **Effort:** Large

---

## P1 — Robustness (production confidence)

### 8. Add React error boundaries
- **Create:** `src/app/error.tsx`, `src/app/(main)/error.tsx`, `src/app/not-found.tsx`
- Currently any rendering error crashes the entire page to a white screen
- **Effort:** Small

### 9. Replace silent error swallowing with logging
- **Files:** `src/lib/data/badges.ts`, `comments.ts`, `use-cases.ts`, `progress.ts`, `src/app/(main)/dashboard/page.tsx`
- Replace ~16 instances of `.catch(() => {})` with `.catch((err) => console.error('[context]:', err))`
- **Effort:** Small

### 10. Add server-side admin authorization
- **Create:** `src/app/api/admin/route.ts`
- **Modify:** `src/app/(main)/admin/page.tsx`, `src/lib/data/admin.ts`
- Admin status is currently only checked client-side; data functions use the anon Supabase client
- **Effort:** Medium

### 11. Add CI with GitHub Actions
- **Create:** `.github/workflows/ci.yml`
- Run `tsc --noEmit`, `npm run lint`, `npm run build` on push/PR
- **Effort:** Small

### 12. Add input validation with zod
- **Create:** `src/lib/api-schemas.ts`
- Add zod schemas for all API route request bodies; validate at the top of each handler
- **Effort:** Medium

### 13. Use `supabaseServer` consistently in API routes
- **Files:** `send-learned-email/route.ts`, `send-reply-email/route.ts`, `cron/weekly-digest/route.ts`, `profile-card/[id]/route.tsx`
- These currently import the anon-key client; will break once RLS is enabled
- **Effort:** Small

---

## P2 — Scalability & Operations

### 14. Add error monitoring (Sentry or similar)
- Replace `console.error` with structured error tracking
- **Effort:** Medium

### 15. Add `robots.txt` to block crawlers
- **Create:** `src/app/robots.ts` — disallow all for an internal tool
- **Effort:** Small

### 16. Add health check endpoint
- **Create:** `src/app/api/health/route.ts` — ping Supabase, return status
- **Effort:** Small

### 17. Fix N+1 queries in data layer
- `src/lib/data/use-cases.ts` fetches all upvote counts separately after fetching use cases
- `src/lib/data/admin.ts` fetches all users + all events then filters in JS
- Consolidate into Supabase views or joins
- **Effort:** Medium per function

### 18. Move sessions from localStorage to httpOnly cookies
- Currently stored in localStorage (vulnerable to XSS)
- Requires creating a `/api/auth/me` endpoint and updating `AuthContext`
- **Effort:** Large

---

## P3 — Nice-to-Have

- Expand test coverage (API routes, data functions, email templates)
- Add feature flags for safe rollouts
- Configure `next/image` optimization
- Improve email batch processing for scale (Vercel `waitUntil()`)

---

## Verification

After implementing each phase:
1. **P0:** Attempt to call `/api/send-share-email` without auth (should 401). Verify magic link is required to log in. Check response headers include CSP/X-Frame-Options. Confirm `.env.example` has no real keys.
2. **P1:** Trigger a rendering error and confirm error boundary catches it. Push a PR and verify CI runs. Send malformed JSON to an API route and confirm zod rejects it.
3. **P2:** Hit `/api/health` and confirm 200. Check Sentry dashboard for captured errors. Verify `robots.txt` returns disallow-all.
