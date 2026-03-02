---
name: security-audit
description: Use this skill to audit the AI Evangelizer codebase for security vulnerabilities. Invoke when the user says "/security-audit", "check security", "audit for vulnerabilities", "check production readiness", "find security issues", or wants to assess the app's security posture against the PRODUCTION_READINESS.md checklist. Also use proactively when reviewing code changes that touch auth, API routes, email templates, or database queries.
user-invokable: true
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

Read `references/checklist.md` for the full list of 18 items organized by priority (P0/P1/P2). Also read `PRODUCTION_READINESS.md` for expanded context on each item. For each checklist item, use Grep and Read to search for the vulnerability pattern in the listed key files.
