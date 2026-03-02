# Authentication — Chrome DevTools MCP

## App Info

- **URL:** https://ai-evangelizer.vercel.app
- **Test account:** dafriedman@gmail.com
- **Auth:** Magic link (may auto-redirect if session exists)

## Procedure

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

## React Input Handling

For React controlled inputs, use `evaluate_script` with native value setter:
```js
const input = document.querySelector('input[type="email"]');
const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
nativeInputValueSetter.call(input, 'value-here');
input.dispatchEvent(new Event('input', { bubbles: true }));
```

## Standard Viewports

- Mobile: 375x812
- Tablet: 768x1024
- Desktop: 1280x800
- Always reset to desktop after responsive tests
