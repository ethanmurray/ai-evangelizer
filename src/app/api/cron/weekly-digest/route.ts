import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/email';
import { fetchDigestDataForUser } from '@/lib/data/digest';
import { buildWeeklyDigestEmail } from '@/lib/email-templates/weekly-digest';
import { fetchTrendingUseCases } from '@/lib/data/trending';

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch all non-stub users who opted in to emails
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email')
    .eq('is_stub', false)
    .neq('email_opt_in', false);

  if (error || !users) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }

  let sent = 0;
  let failed = 0;

  // Fetch trending once for all users (same data for everyone)
  const trending = await fetchTrendingUseCases(7, 3);

  // Process in batches of 10 to respect Resend rate limits
  for (let i = 0; i < users.length; i += 10) {
    const batch = users.slice(i, i + 10);

    const results = await Promise.allSettled(
      batch.map(async (user) => {
        const digestData = await fetchDigestDataForUser(user.id, trending);
        if (!digestData) return;

        const { subject, html } = buildWeeklyDigestEmail(digestData);
        await sendEmail({ to: user.email, subject, html });
      })
    );

    for (const r of results) {
      if (r.status === 'fulfilled') sent++;
      else failed++;
    }

    // Rate limit: pause between batches if more remain
    if (i + 10 < users.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return NextResponse.json({ sent, failed, total: users.length });
}
