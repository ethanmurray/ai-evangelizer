---
name: e2e-test-runner
description: Use this skill to run the full E2E test suite (38 test cases across 15 suites) against the live AI Evangelizer app using Chrome DevTools MCP. Invoke when the user says "/test-e2e", "run the test suite", "run all tests", "run the e2e tests", "run the runbook", or wants to execute the full test runbook systematically. For ad-hoc testing of individual features, use /ui-test instead.
user-invocable: true
---

# E2E Test Runner — Chrome DevTools MCP

Execute the full 38-test runbook against the live AI Evangelizer app. Read `references/test-runbook.md` for the complete test specifications before starting.

## Quick Start

1. Read `references/test-runbook.md` for the full test specifications
2. Authenticate as `dafriedman@gmail.com` (see Auth section below)
3. Run suites in order: 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8.1–8.3 → 9 → 10 → 11 → 12 → 13 → **8.4 last**
4. Run Suite 14 (invasive tests) only after all non-invasive suites pass
5. Report results in the summary table format

## App Info

- **URL:** https://ai-evangelizer.vercel.app
- **Test account:** dafriedman@gmail.com
- **Auth:** Magic link (may auto-redirect if session exists)

## Authentication

1. `navigate_page` → `https://ai-evangelizer.vercel.app/dashboard`
2. `wait_for` → `["Welcome back", "Continue", "Email"]` (15s)
3. If login page shows, `fill` email → `dafriedman@gmail.com`, `click` Continue
4. If magic link needed, extract token with `evaluate_script`:

```js
async () => {
  const url = 'https://kxdibcvlsnsxxezukxfu.supabase.co';
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZGliY3Zsc25zeHhlenVreGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NzUxMzAsImV4cCI6MjA4NDI1MTEzMH0.aGhM3qlIQ9OQvqyjlyDdKK6kokNI3N-B3S4z6GNZdls';
  const h = { apikey: key, Authorization: `Bearer ${key}` };
  const u = await (await fetch(`${url}/rest/v1/users?select=id&email=eq.dafriedman%40gmail.com&limit=1`, { headers: h })).json();
  if (!u.length) return { error: 'No user' };
  const l = await (await fetch(`${url}/rest/v1/magic_links?select=token&user_id=eq.${u[0].id}&used_at=is.null&order=created_at.desc&limit=1`, { headers: h })).json();
  return l.length ? { token: l[0].token } : { error: 'No token' };
}
```

Then `navigate_page` → `/auth/verify?token=[TOKEN]`

## Execution Rules

1. **Order matters:** Non-invasive suites (0–13) before invasive (14). Suite 8.4 (Sign Out) runs last of all.
2. **Every page:** Run `list_console_messages(error)` and `list_network_requests` to catch errors.
3. **Screenshots:** `take_screenshot` on failures and at key visual checkpoints.
4. **Responsive tests:** Reset to desktop (1280x800) after mobile/tablet suites.
5. **React inputs:** Use native value setter for controlled inputs (see React Input Handling below).

## React Input Handling

For React controlled inputs:
```js
const input = document.querySelector('input[type="email"]');
const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
nativeInputValueSetter.call(input, 'value-here');
input.dispatchEvent(new Event('input', { bubbles: true }));
```

## Chrome DevTools MCP Tools Reference

| Tool | Purpose |
|------|---------|
| `navigate_page` | Navigate to URL |
| `take_snapshot` | Get DOM text for assertions |
| `take_screenshot` | Visual capture |
| `click` | Click elements |
| `fill` | Fill inputs |
| `fill_form` | Fill multiple fields |
| `type_text` | Type into focused element |
| `press_key` | Keyboard input |
| `hover` | Hover over elements |
| `wait_for` | Wait for text/elements |
| `evaluate_script` | Execute JS in page |
| `list_console_messages` | Check console output |
| `list_network_requests` | Check API calls |
| `emulate` | Set viewport (mobile/tablet/desktop) |
| `performance_start_trace` | Start perf trace |
| `performance_stop_trace` | Get perf results |

## Results Format

Track results as you go. After all tests, output a summary table:

```
| Suite | Tests | Result | Notes |
|-------|-------|--------|-------|
| 0: Auth & Login | 4 | PASS/FAIL | ... |
| 1: Dashboard | 5 | PASS/FAIL | ... |
...
| Overall | 38 | XX/38 PASS | |
```

Include key metrics: LCP times, CLS scores, console error count, failed network requests.
