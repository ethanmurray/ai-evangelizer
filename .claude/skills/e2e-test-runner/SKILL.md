---
name: e2e-test-runner
description: Use this skill to run the full E2E test suite against the live AI Evangelizer app using Chrome DevTools MCP. Invoke when the user says "/test-e2e", "run the test suite", "run all tests", "run the e2e tests", "run the runbook", or wants to execute the full test runbook systematically. For ad-hoc testing of individual features, use /ui-test instead.
user-invokable: true
---

# E2E Test Runner — Chrome DevTools MCP

Execute the full test runbook against the live AI Evangelizer app. Read `scripts/mcp-test-runbook.md` for the complete test specifications before starting.

## Quick Start

1. Read `scripts/mcp-test-runbook.md` for the full test specifications
2. Read `.claude/skills/_shared/auth-flow.md` and authenticate as described
3. Run suites in order: 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8.1–8.3 → 9 → 10 → 11 → 12 → 13 → **8.4 last**
4. Run Suite 14 (invasive tests) only after all non-invasive suites pass
5. Report results in the summary table format

## Execution Rules

1. **Order matters:** Non-invasive suites (0–13) before invasive (14). Suite 8.4 (Sign Out) runs last of all.
2. **Every page:** Run `list_console_messages(error)` and `list_network_requests` to catch errors.
3. **Screenshots:** `take_screenshot` on failures and at key visual checkpoints.
4. **Responsive tests:** Reset to desktop (1280x800) after mobile/tablet suites.
5. **React inputs:** Use native value setter for controlled inputs (see `.claude/skills/_shared/auth-flow.md`).

## Results Format

Track results as you go. After all tests, output a summary table:

```
| Suite | Tests | Result | Notes |
|-------|-------|--------|-------|
| 0: Auth & Login | 4 | PASS/FAIL | ... |
| 1: Dashboard | 5 | PASS/FAIL | ... |
...
```

Include key metrics: LCP times, CLS scores, console error count, failed network requests.
