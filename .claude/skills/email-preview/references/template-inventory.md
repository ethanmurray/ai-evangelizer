# Email Template Inventory

All templates in `src/lib/email-templates/`.

## Templates

### 1. `weekly-digest.ts`
- **Function:** `buildWeeklyDigestEmail(data: DigestData)`
- **Data type:** `DigestData` (imported from `@/lib/data/digest`)
- **Returns:** `{ subject: string; html: string }`
- **Purpose:** Weekly summary of activity across the platform
- **Sample data:** Activity stats, top use cases, user progress

### 2. `reply-notification.ts`
- **Function:** `buildReplyNotificationEmail(data: ReplyNotificationData)`
- **Data interface:**
  ```typescript
  interface ReplyNotificationData {
    recipientName: string;
    replierName: string;
    replySnippet: string;
    originalSnippet: string;
    useCaseTitle: string;
    useCaseUrl: string;
  }
  ```
- **Returns:** `{ subject: string; html: string }`
- **Purpose:** Notify user when someone replies to their comment
- **Note:** Already uses `escapeHtml()` for user strings

### 3. `follow-digest.ts`
- **Function:** `buildFollowDigestEmail(data: FollowDigestData)`
- **Data interface:**
  ```typescript
  interface FollowDigestItem {
    useCaseTitle: string;
    useCaseUrl: string;
    comments: Array<{
      authorName: string;
      snippet: string;
      createdAt: string;
    }>;
  }

  interface FollowDigestData {
    recipientName: string;
    items: FollowDigestItem[];
  }
  ```
- **Returns:** `{ subject: string; html: string }`
- **Purpose:** Daily digest of activity on followed use cases

### 4. `follow-notification.ts`
- **Function:** `buildFollowNotificationEmail(data: FollowNotificationData)`
- **Data interface:**
  ```typescript
  interface FollowNotificationData {
    recipientName: string;
    commenterName: string;
    commentSnippet: string;
    useCaseTitle: string;
    useCaseUrl: string;
  }
  ```
- **Returns:** `{ subject: string; html: string }`
- **Purpose:** Instant notification when a followed use case gets a new comment
- **Note:** Uses `escapeHtml()` for user strings

## Shared Patterns

- All templates return `{ subject: string; html: string }`
- Inline CSS styling (no external stylesheets)
- `max-width: 480px` container
- Brand colors: `#2a9d8f`, `#f4a261`
- CTA buttons as styled anchor tags
- `escapeHtml()` helper used in all 4 templates
- `truncate()` helper for snippet content
