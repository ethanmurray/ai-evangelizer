export interface FollowNotificationData {
  recipientName: string;
  commenterName: string;
  commentSnippet: string;
  useCaseTitle: string;
  useCaseUrl: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '...' : str;
}

export function buildFollowNotificationEmail(data: FollowNotificationData): { subject: string; html: string } {
  const snippet = escapeHtml(truncate(data.commentSnippet, 200));
  const commenter = escapeHtml(data.commenterName);
  const recipient = escapeHtml(data.recipientName);
  const title = escapeHtml(data.useCaseTitle);

  const subject = `New comment on "${data.useCaseTitle}" (you follow this)`;

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
      <h2 style="color:#333;">New comment on a use case you follow</h2>
      <p>Hi ${recipient},</p>
      <p><strong>${commenter}</strong> posted a new comment on <strong>${title}</strong>:</p>

      <div style="margin:16px 0;padding:12px 16px;background:#f0f9f0;border-left:3px solid #2a9d8f;border-radius:4px;">
        <p style="margin:0;color:#333;">${snippet}</p>
      </div>

      <p style="margin:24px 0;">
        <a href="${data.useCaseUrl}"
           style="background:#2a9d8f;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">
          View Discussion
        </a>
      </p>

      <p style="color:#888;font-size:13px;">
        You received this because you follow this use case. You can change your notification settings on the use case page.
      </p>
    </div>
  `.trim();

  return { subject, html };
}
