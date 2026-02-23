import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { supabaseServer } from '@/lib/supabase-server';
import { sendEmail } from '@/lib/email';

const EXPIRY_MINUTES = 15;

export async function POST(request: Request) {
  try {
    const { userId, email, name } = await request.json();

    if (!userId || !email) {
      return NextResponse.json({ error: 'userId and email are required' }, { status: 400 });
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);

    // Invalidate any existing unused magic links for this user
    await supabaseServer
      .from('magic_links')
      .update({ used_at: new Date().toISOString() })
      .eq('user_id', userId)
      .is('used_at', null);

    // Insert new magic link
    const { error: insertError } = await supabaseServer
      .from('magic_links')
      .insert({
        user_id: userId,
        token,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error('Failed to create magic link:', insertError);
      return NextResponse.json({ error: 'Failed to create verification link' }, { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verifyUrl = `${baseUrl}/auth/verify?token=${token}`;

    await sendEmail({
      to: email,
      subject: 'Verify your account',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Welcome${name ? `, ${name}` : ''}!</h2>
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

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Send magic link error:', err);
    return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
  }
}
