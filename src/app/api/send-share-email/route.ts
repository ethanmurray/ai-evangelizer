import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { shareId, sharerName, recipientEmail, useCaseTitle } = await request.json();

    if (!shareId || !recipientEmail || !useCaseTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: We reduced the "security" of this process by looking up the token
    // server-side by share ID instead of having the client pass the token directly.
    // The original approach (client generates token, includes it in the insert, passes
    // it to this endpoint) was flaking out on OW corporate email — the token in the
    // email consistently didn't match the token in the DB, and we didn't have time to
    // further troubleshoot. This works but means anyone with a share ID can trigger an
    // email. Someday somebody should fix the root cause and restore the original flow.
    const { data: share, error: lookupError } = await supabaseServer
      .from('shares')
      .select('confirmation_token')
      .eq('id', shareId)
      .single();

    if (lookupError || !share?.confirmation_token) {
      console.error('[send-share-email] token lookup failed:', { shareId, error: lookupError?.message });
      return NextResponse.json({ error: 'Share not found or missing token' }, { status: 404 });
    }

    const confirmationToken = share.confirmation_token;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const confirmUrl = `${baseUrl}/share/respond?token=${confirmationToken}&action=confirm`;
    const denyUrl = `${baseUrl}/share/respond?token=${confirmationToken}&action=deny`;

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
