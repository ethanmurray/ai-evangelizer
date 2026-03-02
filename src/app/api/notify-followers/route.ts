import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/email';
import { createNotification } from '@/lib/data/notifications';
import { getFollowersForUseCase, addToDigestQueue } from '@/lib/data/follows';
import { buildFollowNotificationEmail } from '@/lib/email-templates/follow-notification';

export async function POST(req: NextRequest) {
  try {
    const {
      commentId,
      useCaseId,
      commentAuthorId,
      useCaseTitle,
      alreadyNotifiedUserIds = [],
    } = await req.json();

    if (!commentId || !useCaseId || !commentAuthorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const alreadyNotified = new Set<string>(alreadyNotifiedUserIds);
    alreadyNotified.add(commentAuthorId); // Never notify the comment author

    // Fetch comment content and author name
    const [{ data: comment }, { data: author }] = await Promise.all([
      supabase.from('comments').select('content').eq('id', commentId).single(),
      supabase.from('users').select('name').eq('id', commentAuthorId).single(),
    ]);

    const commentContent = comment?.content || '';
    const authorName = author?.name || 'Someone';

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const useCaseUrl = `${baseUrl}/library/${useCaseId}`;

    // Get instant followers
    const instantFollowers = await getFollowersForUseCase(useCaseId, 'instant');
    const eligibleFollowerIds = instantFollowers
      .filter((f) => !alreadyNotified.has(f.user_id))
      .map((f) => f.user_id);

    for (const id of eligibleFollowerIds) alreadyNotified.add(id);

    let emailsSent = 0;

    // Batch-fetch all follower user records at once
    const { data: followerUsers } = eligibleFollowerIds.length > 0
      ? await supabase
          .from('users')
          .select('id, name, email, email_opt_in')
          .in('id', eligibleFollowerIds)
      : { data: [] as any[] };

    const followerMap = new Map((followerUsers || []).map((u: any) => [u.id, u]));

    for (const id of eligibleFollowerIds) {
      // In-app notification
      createNotification(
        id,
        'follow_comment',
        'New comment on a use case you follow',
        `${authorName} commented on "${useCaseTitle}"`,
        { use_case_id: useCaseId, comment_id: commentId }
      ).catch(() => {});

      // Email notification
      const follower = followerMap.get(id);
      if (follower && follower.email_opt_in !== false) {
        const { subject, html } = buildFollowNotificationEmail({
          recipientName: follower.name || 'there',
          commenterName: authorName,
          commentSnippet: commentContent,
          useCaseTitle: useCaseTitle || 'a use case',
          useCaseUrl,
        });

        sendEmail({ to: follower.email, subject, html }).catch(() => {});
        emailsSent++;
      }
    }

    // Get daily followers and queue for digest
    const dailyFollowers = await getFollowersForUseCase(useCaseId, 'daily');
    let queued = 0;

    for (const f of dailyFollowers) {
      if (alreadyNotified.has(f.user_id)) continue;
      alreadyNotified.add(f.user_id);

      // In-app notification (still gets it immediately)
      createNotification(
        f.user_id,
        'follow_comment',
        'New comment on a use case you follow',
        `${authorName} commented on "${useCaseTitle}"`,
        { use_case_id: useCaseId, comment_id: commentId }
      ).catch(() => {});

      // Queue for daily digest email
      addToDigestQueue(f.user_id, useCaseId, commentId).catch(() => {});
      queued++;
    }

    return NextResponse.json({ ok: true, emailsSent, queued });
  } catch (err: any) {
    console.error('notify-followers error:', err);
    return NextResponse.json({ error: err.message || 'Failed to notify followers' }, { status: 500 });
  }
}
