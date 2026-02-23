import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';
  const override = process.env.DEV_EMAIL_OVERRIDE;

  const actualTo = override || to;

  const actualHtml = override
    ? `<div style="background:#fff3cd;padding:8px 12px;margin-bottom:16px;border:1px solid #ffc107;border-radius:4px;font-size:13px;">
        <strong>DEV MODE:</strong> This email was intended for <code>${to}</code>
       </div>${html}`
    : html;

  const actualSubject = override ? `[DEV] ${subject}` : subject;

  const { data, error } = await resend.emails.send({
    from,
    to: actualTo,
    subject: actualSubject,
    html: actualHtml,
  });

  if (error) {
    console.error('Email send failed:', error);
    throw new Error(error.message);
  }

  return data;
}
