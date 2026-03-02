---
name: ui-test
description: Use this skill for ad-hoc UI testing and visual verification using Chrome DevTools MCP. Invoke when the user asks to "test the UI", "check a page", "verify the login flow", "test the dashboard", "take a screenshot", "check for console errors", "test on mobile", or any request to interact with and verify the live app in a browser. Also use when the user says "/ui-test".
user-invocable: true
---

# UI Test — Chrome DevTools MCP

Perform ad-hoc UI testing against the live AI Evangelizer app using Chrome DevTools MCP tools. This skill handles free-form testing requests — for the full 38-test runbook, use `/test-e2e` instead.

## App Info

- **URL:** https://ai-evangelizer.vercel.app
- **Test account:** dafriedman@gmail.com
- **Auth:** Magic link (may auto-redirect if session exists)

## Workflow

### 1. Determine What to Test

Parse the user's request into concrete test steps. If vague, read `references/app-routes.md` to identify the relevant pages and features.

### 2. Ensure Authentication

Before testing any protected route:

1. `navigate_page` to `https://ai-evangelizer.vercel.app/dashboard`
2. `wait_for` text `["Welcome back", "Continue", "Email"]` (15s timeout)
3. `take_snapshot` to check the page state

If on the login page, authenticate:
1. `fill` the email input with `dafriedman@gmail.com`
2. `click` the Continue button
3. `wait_for` text `["Welcome back", "Check your email"]` (15s)
4. If redirected to `/dashboard` — done
5. If magic link required, extract token with `evaluate_script`:

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

Then `navigate_page` to `/auth/verify?token=[TOKEN]`.

### 3. Execute Tests

Use these Chrome DevTools MCP tools as needed:

| Tool | When to Use |
|------|-------------|
| `navigate_page` | Go to a URL |
| `take_snapshot` | Get DOM text content for assertions |
| `take_screenshot` | Capture visual state for user review |
| `click` | Click buttons, links, or interactive elements |
| `fill` | Fill input fields |
| `fill_form` | Fill multiple form fields at once |
| `type_text` | Type into focused element |
| `press_key` | Press keyboard keys |
| `hover` | Hover over elements |
| `wait_for` | Wait for text/elements to appear |
| `evaluate_script` | Run JS in page context |
| `list_console_messages` | Check for console errors |
| `list_network_requests` | Check for failed API calls |
| `emulate` | Change viewport for responsive testing |
| `resize_page` | Resize the browser window |
| `performance_start_trace` | Start a performance trace |
| `performance_stop_trace` | Stop and get trace results |
| `performance_analyze_insight` | Analyze performance data |

### 4. Check for Issues

On every page tested, always:
1. `list_console_messages` filtered to errors — report any unexpected errors
2. `list_network_requests` — flag any 4xx/5xx responses
3. `take_screenshot` — include in your report for visual verification

### 5. Responsive Testing

If the user asks to test on mobile or tablet:
- Mobile: `emulate` with viewport 375x812
- Tablet: `emulate` with viewport 768x1024
- Desktop: `emulate` with viewport 1280x800
- Always reset to desktop after responsive tests

### 6. Report Results

For each test action, report:
- What was tested
- Pass/fail with evidence (screenshot, DOM content, console output)
- Any issues found (console errors, visual bugs, broken interactions)

## React Input Handling

For React controlled inputs, use `evaluate_script` with native value setter:
```js
const input = document.querySelector('input[type="email"]');
const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
nativeInputValueSetter.call(input, 'value-here');
input.dispatchEvent(new Event('input', { bubbles: true }));
```

This ensures React's state updates correctly.
