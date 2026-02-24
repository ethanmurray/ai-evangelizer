import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  cc?: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, cc, subject, html }: SendEmailParams) {
  const from = process.env.EMAIL_FROM || 'noreply@murraymusics.com';
  const override = process.env.DEV_EMAIL_OVERRIDE;

  const actualTo = override || to;
  const actualCc = cc ? (override || cc) : undefined;

  const devNote = override
    ? `<div style="background:#fff3cd;padding:8px 12px;margin-bottom:16px;border:1px solid #ffc107;border-radius:4px;font-size:13px;">
        <strong>DEV MODE:</strong> To: <code>${to}</code>${cc ? ` | Cc: <code>${cc}</code>` : ''}
       </div>`
    : '';

  const actualHtml = devNote + html;
  const actualSubject = override ? `[DEV] ${subject}` : subject;

  const { data, error } = await resend.emails.send({
    from,
    to: actualTo,
    ...(actualCc ? { cc: actualCc } : {}),
    subject: actualSubject,
    html: actualHtml,
  });

  if (error) {
    console.error('Email send failed:', error);
    throw new Error(error.message);
  }

  return data;
}
