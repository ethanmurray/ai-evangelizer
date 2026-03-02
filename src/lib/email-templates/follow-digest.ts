export interface FollowDigestItem {
  useCaseTitle: string;
  useCaseUrl: string;
  comments: Array<{
    authorName: string;
    snippet: string;
    createdAt: string;
  }>;
}

export interface FollowDigestData {
  recipientName: string;
  items: FollowDigestItem[];
}

import { escapeHtml, truncate } from './utils';

export function buildFollowDigestEmail(data: FollowDigestData): { subject: string; html: string } {
  const totalComments = data.items.reduce((sum, item) => sum + item.comments.length, 0);
  const recipient = escapeHtml(data.recipientName);

  const subject = `Daily digest: ${totalComments} new comment${totalComments !== 1 ? 's' : ''} on use cases you follow`;

  const itemsHtml = data.items
    .map((item) => {
      const title = escapeHtml(item.useCaseTitle);
      const commentsHtml = item.comments
        .map((c) => {
          const author = escapeHtml(c.authorName);
          const snippet = escapeHtml(truncate(c.snippet, 150));
          return `
            <div style="margin:8px 0;padding:8px 12px;background:#f5f5f5;border-radius:4px;">
              <p style="margin:0;font-size:13px;"><strong>${author}</strong></p>
              <p style="margin:4px 0 0;color:#555;font-size:13px;">${snippet}</p>
            </div>
          `;
        })
        .join('');

      return `
        <div style="margin:16px 0;">
          <h3 style="margin:0 0 8px;color:#333;">
            <a href="${item.useCaseUrl}" style="color:#2a9d8f;text-decoration:none;">${title}</a>
          </h3>
          ${commentsHtml}
        </div>
      `;
    })
    .join('<hr style="border:none;border-top:1px solid #eee;margin:16px 0;">');

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
      <h2 style="color:#333;">Your daily follow digest</h2>
      <p>Hi ${recipient},</p>
      <p>Here's what's new on use cases you follow:</p>
      ${itemsHtml}
      <p style="color:#888;font-size:13px;margin-top:24px;">
        You received this because you follow these use cases with daily digest enabled.
        You can change your notification settings on each use case page.
      </p>
    </div>
  `.trim();

  return { subject, html };
}
