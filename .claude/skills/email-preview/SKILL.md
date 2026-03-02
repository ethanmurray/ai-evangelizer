---
name: email-preview
description: Use this skill to render and visually preview email templates using Chrome DevTools MCP. Invoke when the user says "/preview-email", "preview the email", "test the email template", "check email rendering", "how does the email look", or wants to see how an email template renders. Also use when modifying email templates to verify the visual output.
user-invokable: true
---

# Email Template Preview — Chrome DevTools MCP

Render email templates from the AI Evangelizer project and preview them visually in Chrome.

## Email Templates

Read `references/template-inventory.md` for the full list of templates and their data interfaces.

**Template location:** `src/lib/email-templates/`

## Workflow

### 1. Identify the Template

Determine which template to preview based on the user's request. If unclear, list available templates from the inventory.

### 2. Generate Sample Data

Create realistic sample data matching the template's TypeScript interface. Use plausible values:
- Names: "David Friedman", "Ethan Murray"
- Emails: test@example.com
- Use case titles: "Code Review with AI", "Automated Testing"
- URLs: `https://ai-evangelizer.vercel.app/library/abc-123`

### 3. Render the Template

Write a temp script to invoke the template's build function with the sample data, then run it with `npx tsx`:

```bash
npx tsx -e "
import { buildXxxEmail } from './src/lib/email-templates/xxx';
const data = { /* sample data */ };
const { subject, html } = buildXxxEmail(data);
import { writeFileSync } from 'fs';
writeFileSync('/tmp/email-preview.html', html);
console.log('Subject:', subject);
"
```

### 4. Preview in Chrome

1. `navigate_page` → `file:///tmp/email-preview.html`
2. `take_screenshot` for visual review
3. `take_snapshot` to verify text content

### 5. Test Responsive Rendering

Email clients vary in width. Test at common widths:
1. `resize_page` to 600px wide (standard email width)
2. `take_screenshot`
3. `resize_page` to 375px wide (mobile)
4. `take_screenshot`

### 6. Check for Issues

Inspect the rendered HTML for:

- **Missing escaping:** Search template source for raw string interpolation of user data without `escapeHtml()`. User-derived fields (names, titles, snippets) must be escaped.
- **Broken HTML:** Check `list_console_messages` for parse errors
- **Inline CSS:** Email clients strip `<style>` tags — all styles should be inline
- **Image references:** Check for broken image links
- **Link validity:** Verify all `<a href>` point to valid app URLs

### 7. Report

Show the user:
- Screenshot at desktop and mobile widths
- The email subject line
- Any issues found (escaping, broken HTML, missing styles)
- Suggestions for improvement
