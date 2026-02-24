import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'INVALID_TOKEN' }, { status: 400 });
    }

    // Look up the magic link
    const { data: magicLink, error: lookupError } = await supabaseServer
      .from('magic_links')
      .select('*')
      .eq('token', token)
      .maybeSingle();

    if (lookupError || !magicLink) {
      return NextResponse.json({ error: 'INVALID_TOKEN' }, { status: 400 });
    }

    if (magicLink.used_at) {
      return NextResponse.json({ error: 'ALREADY_USED' }, { status: 400 });
    }

    if (new Date(magicLink.expires_at) < new Date()) {
      return NextResponse.json({ error: 'EXPIRED' }, { status: 400 });
    }

    // Mark as used
    await supabaseServer
      .from('magic_links')
      .update({ used_at: new Date().toISOString() })
      .eq('id', magicLink.id);

    // Fetch the user
    const { data: user, error: userError } = await supabaseServer
      .from('users')
      .select('*')
      .eq('id', magicLink.user_id)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'USER_NOT_FOUND' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        team: user.team,
        isStub: user.is_stub,
        isAdmin: user.is_admin ?? false,
        createdAt: user.created_at,
        themePreference: user.theme_preference || null,
      },
    });
  } catch (err: any) {
    console.error('Verify magic link error:', err);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
