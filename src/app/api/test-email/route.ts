import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { to } = await request.json();

    if (!to) {
      return NextResponse.json({ error: 'to is required' }, { status: 400 });
    }

    await sendEmail({
      to,
      subject: 'Test email from Cult of AI',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>It works!</h2>
          <p>This is a test email from the Cult of AI app.</p>
          <p style="color: #888; font-size: 13px;">
            Sent from: <code>${process.env.EMAIL_FROM || 'onboarding@resend.dev'}</code><br>
            DEV_EMAIL_OVERRIDE: <code>${process.env.DEV_EMAIL_OVERRIDE || '(none)'}</code><br>
            Timestamp: ${new Date().toISOString()}
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('test-email error:', err);
    return NextResponse.json({ error: err.message || 'Failed to send' }, { status: 500 });
  }
}
