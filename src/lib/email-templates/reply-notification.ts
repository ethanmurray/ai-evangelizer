export interface ReplyNotificationData {
  recipientName: string;
  replierName: string;
  replySnippet: string;
  originalSnippet: string;
  useCaseTitle: string;
  useCaseUrl: string;
}

import { escapeHtml, truncate } from './utils';

export function buildReplyNotificationEmail(data: ReplyNotificationData): { subject: string; html: string } {
  const reply = escapeHtml(truncate(data.replySnippet, 200));
  const original = escapeHtml(truncate(data.originalSnippet, 100));
  const replierName = escapeHtml(data.replierName);
  const recipientName = escapeHtml(data.recipientName);
  const title = escapeHtml(data.useCaseTitle);

  const subject = `${data.replierName} replied to your comment on "${data.useCaseTitle}"`;

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
      <h2 style="color:#333;">New reply to your comment</h2>
      <p>Hi ${recipientName},</p>
      <p><strong>${replierName}</strong> replied to your comment on <strong>${title}</strong>:</p>

      <div style="margin:16px 0;padding:12px 16px;background:#f5f5f5;border-left:3px solid #ccc;border-radius:4px;">
        <p style="color:#666;font-size:13px;margin:0 0 8px 0;">Your comment:</p>
        <p style="margin:0;color:#555;">${original}</p>
      </div>

      <div style="margin:16px 0;padding:12px 16px;background:#f0f9f0;border-left:3px solid #2a9d8f;border-radius:4px;">
        <p style="color:#666;font-size:13px;margin:0 0 8px 0;">${replierName}&rsquo;s reply:</p>
        <p style="margin:0;color:#333;">${reply}</p>
      </div>

      <p style="margin:24px 0;">
        <a href="${data.useCaseUrl}"
           style="background:#2a9d8f;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">
          View Discussion
        </a>
      </p>

      <p style="color:#888;font-size:13px;">
        You received this because someone replied to your comment.
      </p>
    </div>
  `.trim();

  return { subject, html };
}
