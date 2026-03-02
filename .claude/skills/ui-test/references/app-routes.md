# AI Evangelizer — App Routes Reference

## Page Routes

### Public (no auth required)

| URL | Feature |
|-----|---------|
| `/` | Root redirect → `/dashboard` if authenticated, `/login` if not |
| `/login` | Magic link login with 3-step onboarding explainer |
| `/auth/verify` | Magic link verification (processes `?token=` param) |
| `/share/respond` | Share confirmation/denial (processes `?token=` param) |
| `/test-email` | Email deliverability tester (dev tool) |

### Protected (auth required)

| URL | Feature |
|-----|---------|
| `/dashboard` | Main hub: rank, points, in-progress, completed, recommendations, trending, activity |
| `/library` | Use case catalog: search, filter by labels, sort by difficulty, submit new |
| `/library/[id]` | Use case detail: description, resources, difficulty, progress, comments, related |
| `/feed` | Activity feed: All / My Team filter |
| `/leaderboard` | Rankings: Individuals, Teams, Team Dashboard, Heatmap views |
| `/profile` | Own profile: edit name/team, theme, dark mode, email prefs, sign out |
| `/profile/[id]` | Other user's profile (read-only) |
| `/badges` | Achievements: 4 categories (Learning, Applying, Sharing, Special) |
| `/admin` | Admin dashboard: metrics, teams, inactive users, export CSV (admin-only) |
| `/getting-started` | Developer onboarding guide |

## API Routes

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/send-magic-link` | POST | No | Send magic link email |
| `/api/auth/verify-magic-link` | POST | No | Verify token, return user |
| `/api/share/respond` | POST | No | Confirm/deny a share |
| `/api/send-share-email` | POST | Yes | Email when teaching |
| `/api/send-learned-email` | POST | Yes | Email on learning milestone |
| `/api/send-reply-email` | POST | Yes | Email on comment reply |
| `/api/notify-followers` | POST | Yes | Notify followers of updates |
| `/api/test-email` | POST | No | Send test emails (dev) |
| `/api/users/search` | GET | No | Search users by name/email |
| `/api/users/theme` | POST | Yes | Update theme preference |
| `/api/cron/weekly-digest` | POST | Cron | Weekly email digest |
| `/api/cron/daily-follow-digest` | POST | Cron | Daily follow digest |

## Navigation Structure

- **Desktop:** 7-item sidebar — Dashboard, Library, Feed, Leaderboard, Badges, Profile, Getting Started
- **Mobile (< 768px):** Bottom nav bar, sidebar hidden
