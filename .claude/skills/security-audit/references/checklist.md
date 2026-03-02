# Security Checklist — AI Evangelizer

Source: `PRODUCTION_READINESS.md`

## P0 — Critical Security (fix before real users)

| # | Item | Key Files | What to Check |
|---|------|-----------|---------------|
| 1 | Leaked credentials | `.env.example` | Real Resend API key (`re_`), real Supabase URL/key, personal email |
| 2 | Auth bypass | `src/lib/auth/providers/SimpleAuthProvider.ts:34-40,57-63` | `// BYPASS` comments, login/register returning without verification |
| 3 | Security headers | `src/middleware.ts` | File exists, sets X-Frame-Options, CSP, HSTS, X-Content-Type-Options, Referrer-Policy |
| 4 | Unauthenticated API routes | `src/app/api/send-share-email/route.ts`, `send-learned-email/route.ts`, `send-reply-email/route.ts`, `test-email/route.ts` | Auth check at top of POST handler |
| 5 | Rate limiting | `src/app/api/auth/send-magic-link/route.ts`, all email routes | Rate limit middleware or helper |
| 6 | HTML injection in emails | `src/lib/email-templates/*.ts`, `src/app/api/send-*/route.ts` | `escapeHtml()` on all user-derived strings |
| 7 | RLS disabled | `supabase/migrations/*.sql` | `ENABLE ROW LEVEL SECURITY`, `CREATE POLICY` statements |

## P1 — Robustness

| # | Item | Key Files | What to Check |
|---|------|-----------|---------------|
| 8 | Error boundaries | `src/app/error.tsx`, `src/app/(main)/error.tsx`, `src/app/not-found.tsx` | Files exist with proper error UI |
| 9 | Silent error swallowing | `src/lib/data/*.ts`, `src/app/(main)/dashboard/page.tsx` | `.catch(() => {})` replaced with logging |
| 10 | Server-side admin auth | `src/app/api/admin/`, `src/lib/data/admin.ts` | Admin verified on server, not just client |
| 11 | CI pipeline | `.github/workflows/ci.yml` | Runs tsc, lint, build on push/PR |
| 12 | Input validation | `src/app/api/*/route.ts` | Zod schemas for request bodies |
| 13 | Consistent supabaseServer | `src/app/api/*/route.ts` | Use supabaseServer, not anon client |

## P2 — Scalability & Operations

| # | Item | Key Files | What to Check |
|---|------|-----------|---------------|
| 14 | Error monitoring | `sentry.*.config.ts`, `next.config.ts` | Sentry or similar configured |
| 15 | robots.txt | `src/app/robots.ts` | Disallow all (internal tool) |
| 16 | Health check | `src/app/api/health/route.ts` | Returns 200, pings Supabase |
| 17 | N+1 queries | `src/lib/data/use-cases.ts`, `admin.ts` | Consolidated queries vs sequential fetches |
| 18 | httpOnly sessions | `src/lib/auth/`, `AuthContext` | Cookies instead of localStorage |
