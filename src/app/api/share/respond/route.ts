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
      .select('id, status')
      .eq('confirmation_token', token)
      .maybeSingle();

    if (lookupError || !share) {
      return NextResponse.json({ error: 'invalid_token' }, { status: 404 });
    }

    const previousStatus = share.status;

    if (action === 'confirm') {
      const newStatus = 'confirmed';
      const { error } = await supabaseServer
        .from('shares')
        .update({ status: newStatus, confirmed_at: new Date().toISOString() })
        .eq('id', share.id);

      if (error) {
        return NextResponse.json({ error: 'Failed to confirm' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        action: 'confirmed',
        previousStatus,
        changed: previousStatus !== newStatus,
      });
    }

    // Deny: update status instead of deleting
    const newStatus = 'denied';
    const { error: denyError } = await supabaseServer
      .from('shares')
      .update({ status: newStatus })
      .eq('id', share.id);

    if (denyError) {
      return NextResponse.json({ error: 'Failed to deny' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      action: 'denied',
      previousStatus,
      changed: previousStatus !== newStatus,
    });
  } catch (err: any) {
    console.error('share/respond error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
