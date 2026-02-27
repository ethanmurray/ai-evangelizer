import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isThemeUnlocked } from '@/lib/theme/themeUnlocks';
import { fetchUserPoints } from '@/lib/data/points';

export async function POST(req: NextRequest) {
  const { userId, themeKey } = await req.json();

  if (!userId || !themeKey) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Fetch user's actual points and validate unlock
  const points = await fetchUserPoints(userId);

  if (!isThemeUnlocked(themeKey, points)) {
    return NextResponse.json(
      { error: 'Theme not yet unlocked' },
      { status: 403 }
    );
  }

  // Update theme preference
  const { data, error } = await supabase
    .from('users')
    .update({ theme_preference: themeKey })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map DB row to User shape expected by the client
  const user = {
    id: data.id,
    name: data.name,
    email: data.email,
    team: data.team,
    isStub: data.is_stub,
    isAdmin: data.is_admin ?? false,
    createdAt: new Date(data.created_at),
    themePreference: data.theme_preference || null,
    emailOptIn: data.email_opt_in ?? true,
  };

  return NextResponse.json({ success: true, user });
}
