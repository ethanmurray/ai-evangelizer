import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/email';
import { buildFollowDigestEmail, type FollowDigestItem } from '@/lib/email-templates/follow-digest';

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch all unsent digest queue items
  const { data: queueItems, error } = await supabase
    .from('follow_digest_queue')
    .select('id, follower_id, use_case_id, comment_id, created_at')
    .is('sent_at', null)
    .order('created_at', { ascending: true });

  if (error || !queueItems || queueItems.length === 0) {
    return NextResponse.json({ sent: 0, failed: 0, total: 0 });
  }

  // Group by follower_id
  const byFollower = new Map<string, typeof queueItems>();
  for (const item of queueItems) {
    const arr = byFollower.get(item.follower_id) || [];
    arr.push(item);
    byFollower.set(item.follower_id, arr);
  }

  let sent = 0;
  let failed = 0;
  const followerEntries = [...byFollower.entries()];

  // Process in batches of 10
  for (let i = 0; i < followerEntries.length; i += 10) {
    const batch = followerEntries.slice(i, i + 10);

    const results = await Promise.allSettled(
      batch.map(async ([followerId, items]) => {
        // Fetch follower info
        const { data: follower } = await supabase
          .from('users')
          .select('name, email, email_opt_in')
          .eq('id', followerId)
          .single();

        if (!follower || follower.email_opt_in === false) {
          // Mark as sent anyway so they don't accumulate
          await markItemsSent(items.map((i) => i.id));
          return;
        }

        // Fetch comment and use case details
        const commentIds = [...new Set(items.map((i) => i.comment_id))];
        const useCaseIds = [...new Set(items.map((i) => i.use_case_id))];

        const [{ data: comments }, { data: useCases }] = await Promise.all([
          supabase
            .from('comments')
            .select('id, content, author_id, use_case_id, created_at')
            .in('id', commentIds),
          supabase
            .from('use_cases')
            .select('id, title')
            .in('id', useCaseIds),
        ]);

        // Fetch author names
        const authorIds = [...new Set((comments || []).map((c: any) => c.author_id))];
        const { data: authors } = authorIds.length > 0
          ? await supabase.from('users').select('id, name').in('id', authorIds)
          : { data: [] };
        const authorMap = new Map((authors || []).map((a: any) => [a.id, a.name]));
        const useCaseMap = new Map((useCases || []).map((uc: any) => [uc.id, uc.title]));

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        // Group comments by use case
        const byUseCase = new Map<string, FollowDigestItem>();
        for (const c of comments || []) {
          const ucId = c.use_case_id;
          if (!byUseCase.has(ucId)) {
            byUseCase.set(ucId, {
              useCaseTitle: useCaseMap.get(ucId) || 'Unknown use case',
              useCaseUrl: `${baseUrl}/library/${ucId}`,
              comments: [],
            });
          }
          byUseCase.get(ucId)!.comments.push({
            authorName: authorMap.get(c.author_id) || 'Someone',
            snippet: c.content,
            createdAt: c.created_at,
          });
        }

        const digestItems = [...byUseCase.values()];
        if (digestItems.length === 0) {
          await markItemsSent(items.map((i) => i.id));
          return;
        }

        const { subject, html } = buildFollowDigestEmail({
          recipientName: follower.name || 'there',
          items: digestItems,
        });

        await sendEmail({ to: follower.email, subject, html });
        await markItemsSent(items.map((i) => i.id));
      })
    );

    for (const r of results) {
      if (r.status === 'fulfilled') sent++;
      else failed++;
    }

    // Rate limit: pause between batches
    if (i + 10 < followerEntries.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return NextResponse.json({ sent, failed, total: followerEntries.length });
}

async function markItemsSent(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  await supabase
    .from('follow_digest_queue')
    .update({ sent_at: new Date().toISOString() })
    .in('id', ids);
}
