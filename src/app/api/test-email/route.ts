import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { sendEmail } from '@/lib/email';
import { supabaseServer } from '@/lib/supabase-server';

const EXPIRY_MINUTES = 15;

const FLAVORS: Record<string, (verifyUrl: string) => { subject: string; html: string }> = {
  'hello-world': () => ({
    subject: 'Hello from dev server',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <p>Hello world! This is a plain test email with no links or buttons.</p>
        <p style="color: #888; font-size: 13px;">
          Sent at: ${new Date().toISOString()}
        </p>
      </div>
    `,
  }),
  'magic-link-no-links': () => ({
    subject: 'Verify your account',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Welcome!</h2>
        <p>Click the button below to verify your account and sign in:</p>
        <p style="margin: 24px 0; background: #e76f51; color: white; padding: 12px 24px;
                  border-radius: 6px; font-weight: bold; display: inline-block;">
          Verify &amp; Sign In
        </p>
        <p style="color: #888; font-size: 13px;">
          This link expires in 15 minutes. If you didn't create an account, you can ignore this email.
        </p>
      </div>
    `,
  }),
  'david-to-ethan': (verifyUrl: string) => ({
    subject: 'Confirm the development site is working ok',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <p>Hey Ethan,</p>
        <p>This is you writing from your dev server to check if you can have an email pass through
        for you to use in the AI Evangelizer application you're building.</p>
        <p>If you don't receive this, drop me a chat on Teams and we'll figure something out.</p>
        <p>Here's the link for you to validate:<br>
          <a href="${verifyUrl}">${verifyUrl}</a>
        </p>
        <p>Thanks,<br>David</p>
      </div>
    `,
  }),
};

async function createRealMagicLink(email: string): Promise<string> {
  const { data: user, error: userError } = await supabaseServer
    .from('users')
    .select('id, name')
    .eq('email', email)
    .maybeSingle();

  if (userError || !user) {
    throw new Error(`No user found for ${email}`);
  }

  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);

  const { error: insertError } = await supabaseServer
    .from('magic_links')
    .insert({ user_id: user.id, token, expires_at: expiresAt.toISOString() });

  if (insertError) {
    throw new Error('Failed to create magic link');
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/auth/verify?token=${token}`;
}

export async function POST(request: Request) {
  try {
    const { to, flavor } = await request.json();

    if (!to) {
      return NextResponse.json({ error: 'to is required' }, { status: 400 });
    }

    // Special case: real magic link needs DB access to create a token
    if (flavor === 'real-magic-link') {
      const verifyUrl = await createRealMagicLink(to);
      await sendEmail({
        to,
        subject: 'Verify your account',
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2>Welcome!</h2>
            <p>Click the button below to verify your account and sign in:</p>
            <p style="margin: 24px 0;">
              <a href="${verifyUrl}"
                 style="background: #e76f51; color: white; padding: 12px 24px;
                        border-radius: 6px; text-decoration: none; font-weight: bold;
                        display: inline-block;">
                Verify &amp; Sign In
              </a>
            </p>
            <p style="color: #888; font-size: 13px;">
              This link expires in ${EXPIRY_MINUTES} minutes. If you didn't create an account, you can ignore this email.
            </p>
            <p style="color: #aaa; font-size: 12px;">
              Or copy this URL: ${verifyUrl}
            </p>
          </div>
        `,
      });
      return NextResponse.json({ success: true, flavor });
    }

    const flavorFn = FLAVORS[flavor || 'hello-world'];
    if (!flavorFn) {
      return NextResponse.json({ error: `Unknown flavor: ${flavor}. Options: ${[...Object.keys(FLAVORS), 'real-magic-link'].join(', ')}` }, { status: 400 });
    }

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/verify?token=test-token-placeholder`;
    const { subject, html } = flavorFn(verifyUrl);

    await sendEmail({ to, subject, html });

    return NextResponse.json({ success: true, flavor });
  } catch (err: any) {
    console.error('test-email error:', err);
    return NextResponse.json({ error: err.message || 'Failed to send' }, { status: 500 });
  }
}
