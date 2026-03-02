---
name: ui-test
description: Use this skill for ad-hoc UI testing and visual verification using Chrome DevTools MCP. Invoke when the user asks to "test the UI", "check a page", "verify the login flow", "test the dashboard", "take a screenshot", "check for console errors", "test on mobile", or any request to interact with and verify the live app in a browser. Also use when the user says "/ui-test".
user-invokable: true
---

# UI Test — Chrome DevTools MCP

Perform ad-hoc UI testing against the live AI Evangelizer app using Chrome DevTools MCP tools. For the full test runbook, use `/test-e2e` instead.

## Workflow

### 1. Determine What to Test

Parse the user's request into concrete test steps. If vague, read `references/app-routes.md` to identify the relevant pages and features.

### 2. Ensure Authentication

Read `.claude/skills/_shared/auth-flow.md` and follow the authentication procedure before testing any protected route.

### 3. Execute Tests

Use Chrome DevTools MCP tools (`navigate_page`, `take_snapshot`, `take_screenshot`, `click`, `fill`, `evaluate_script`, etc.) as needed.

### 4. Check for Issues

On every page tested, always:
1. `list_console_messages` filtered to errors — report any unexpected errors
2. `list_network_requests` — flag any 4xx/5xx responses
3. `take_screenshot` — include in your report for visual verification

### 5. Responsive Testing

If the user asks to test on mobile or tablet, see `.claude/skills/_shared/auth-flow.md` for standard viewport sizes.

### 6. Report Results

For each test action, report:
- What was tested
- Pass/fail with evidence (screenshot, DOM content, console output)
- Any issues found (console errors, visual bugs, broken interactions)
