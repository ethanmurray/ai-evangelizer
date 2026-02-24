import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { token, action } = await request.json();

    if (!token || !['confirm', 'deny'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { data: share, error: lookupError } = await supabaseServer
      .from('shares')
      .select('id, confirmed_at')
      .eq('confirmation_token', token)
      .maybeSingle();

    if (lookupError || !share) {
      return NextResponse.json({ error: 'invalid_token' }, { status: 404 });
    }

    if (action === 'confirm') {
      if (!share.confirmed_at) {
        const { error } = await supabaseServer
          .from('shares')
          .update({ confirmed_at: new Date().toISOString() })
          .eq('id', share.id);

        if (error) {
          return NextResponse.json({ error: 'Failed to confirm' }, { status: 500 });
        }
      }
      return NextResponse.json({ success: true, action: 'confirmed' });
    }

    // Deny: delete the share row
    const { error: deleteError } = await supabaseServer
      .from('shares')
      .delete()
      .eq('id', share.id);

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to deny' }, { status: 500 });
    }

    return NextResponse.json({ success: true, action: 'denied' });
  } catch (err: any) {
    console.error('share/respond error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
