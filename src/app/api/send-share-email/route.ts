import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { supabaseServer } from '@/lib/supabase-server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { shareId, sharerName, recipientEmail, useCaseTitle } = await request.json();

    if (!shareId || !recipientEmail || !useCaseTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const token = randomBytes(32).toString('hex');

    const { error: updateError } = await supabaseServer
      .from('shares')
      .update({ confirmation_token: token })
      .eq('id', shareId);

    if (updateError) {
      console.error('Failed to set confirmation token:', updateError);
      return NextResponse.json({ error: 'Failed to prepare confirmation' }, { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const confirmUrl = `${baseUrl}/share/respond?token=${token}&action=confirm`;
    const denyUrl = `${baseUrl}/share/respond?token=${token}&action=deny`;

    const displayName = sharerName || 'A colleague';

    await sendEmail({
      to: recipientEmail,
      subject: `${displayName} shared "${useCaseTitle}" with you`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>${displayName} shared an AI skill with you</h2>
          <p><strong>${displayName}</strong> says they taught you <strong>${useCaseTitle}</strong>.</p>
          <p>Did this happen?</p>
          <p style="margin: 24px 0;">
            <a href="${confirmUrl}"
               style="background: #2a9d8f; color: white; padding: 12px 24px;
                      border-radius: 6px; text-decoration: none; font-weight: bold;
                      display: inline-block; margin-right: 12px;">
              Yes, confirm
            </a>
            <a href="${denyUrl}"
               style="background: #e76f51; color: white; padding: 12px 24px;
                      border-radius: 6px; text-decoration: none; font-weight: bold;
                      display: inline-block;">
              No, deny
            </a>
          </p>
          <p style="color: #888; font-size: 13px;">
            If you take no action, the share will remain valid.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('send-share-email error:', err);
    return NextResponse.json({ error: err.message || 'Failed to send email' }, { status: 500 });
  }
}
