---
name: security-audit
description: Use this skill to audit the AI Evangelizer codebase for security vulnerabilities. Invoke when the user says "/security-audit", "check security", "audit for vulnerabilities", "check production readiness", "find security issues", or wants to assess the app's security posture against the PRODUCTION_READINESS.md checklist. Also use proactively when reviewing code changes that touch auth, API routes, email templates, or database queries.
user-invocable: true
---

# Security Audit

Scan the AI Evangelizer codebase against the documented security checklist. Read `references/checklist.md` for the full item list.

## Workflow

### 1. Scan Each Category

For each checklist item, search the codebase for the specific vulnerability pattern. Use Grep and Read tools to inspect the relevant files.

### 2. Report Format

For each item, report:

```
### [P0/P1/P2]-[number]: [Title]
- **Status:** VULNERABLE | FIXED | PARTIAL
- **Files:** [affected file paths with line numbers]
- **Evidence:** [what you found — the vulnerable code or the fix]
- **Fix:** [suggested remediation if still vulnerable]
```

### 3. Summary Table

End with a summary:

```
| # | Item | Priority | Status |
|---|------|----------|--------|
| 1 | Leaked credentials | P0 | VULNERABLE/FIXED/PARTIAL |
...
```

---

## Scan Categories

### P0 — Critical Security

**1. Leaked credentials in `.env.example`**
- Check: Does `.env.example` contain real API keys, Supabase URLs with real project refs, or personal emails?
- Pattern: Look for `re_` (Resend key prefix), real Supabase project URLs, `@gmail.com` addresses

**2. Auth bypass**
- Check: `src/lib/auth/providers/SimpleAuthProvider.ts` — are `register()` and `login()` returning users without verification?
- Pattern: Search for `// BYPASS`, commented-out verification logic

**3. Missing security headers**
- Check: Does `src/middleware.ts` exist? Does it set `X-Frame-Options`, `X-Content-Type-Options`, `CSP`, `HSTS`, `Referrer-Policy`?
- Pattern: Search for `middleware.ts`, check response headers

**4. Unauthenticated API routes**
- Check: Do email-sending routes validate the caller?
- Files: `src/app/api/send-share-email/route.ts`, `send-learned-email/route.ts`, `send-reply-email/route.ts`, `test-email/route.ts`
- Pattern: Look for auth checks at the top of POST handlers

**5. Missing rate limiting**
- Check: Are `send-magic-link` and email routes rate-limited?
- Pattern: Search for rate limit imports or middleware in API routes

**6. HTML injection in email templates**
- Check: Are user-derived strings escaped before HTML interpolation?
- Files: All files in `src/lib/email-templates/`, `src/app/api/send-*/route.ts`
- Pattern: Look for `escapeHtml()` usage, raw string interpolation in HTML

**7. Disabled RLS**
- Check: Do Supabase migration files enable RLS and define policies?
- Files: `supabase/migrations/*.sql`
- Pattern: Search for `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`, `CREATE POLICY`

### P1 — Robustness

**8. Missing error boundaries**
- Check: Do `src/app/error.tsx`, `src/app/(main)/error.tsx`, `src/app/not-found.tsx` exist?

**9. Silent error swallowing**
- Pattern: Search for `.catch(() => {})` or `.catch(() => null)` across the codebase

**10. Client-side-only admin checks**
- Check: Is admin status verified server-side in API routes, or only in React components?
- Files: `src/app/(main)/admin/page.tsx`, `src/lib/data/admin.ts`, any `src/app/api/admin/` routes

**11. Missing CI**
- Check: Does `.github/workflows/` exist with a CI configuration?

**12. Missing input validation**
- Check: Do API routes validate request bodies with zod or similar?
- Pattern: Search for `zod`, `z.object`, `z.string` in API route files

**13. Inconsistent Supabase client usage**
- Check: Do API routes use `supabaseServer` or the anon-key client?
- Pattern: Search for `supabase` imports in `src/app/api/` — flag any using the anon client

### P2 — Scalability

**14. Error monitoring** — Check for Sentry or similar integration
**15. robots.txt** — Check for `src/app/robots.ts`
**16. Health check** — Check for `src/app/api/health/route.ts`
**17. N+1 queries** — Check `src/lib/data/use-cases.ts` and `admin.ts` for sequential fetches
**18. localStorage sessions** — Check if sessions use httpOnly cookies or localStorage
