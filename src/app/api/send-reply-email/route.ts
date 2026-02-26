import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { buildReplyNotificationEmail } from '@/lib/email-templates/reply-notification';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { parentCommentId, replyContent, replierAuthorId, useCaseId, useCaseTitle } = await req.json();

    if (!parentCommentId || !replyContent || !replierAuthorId || !useCaseId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch parent comment author
    const { data: parentComment } = await supabase
      .from('comments')
      .select('author_id, content')
      .eq('id', parentCommentId)
      .single();

    if (!parentComment) {
      return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 });
    }

    // Fetch parent author details
    const { data: parentAuthor } = await supabase
      .from('users')
      .select('name, email, email_opt_in')
      .eq('id', parentComment.author_id)
      .single();

    if (!parentAuthor) {
      return NextResponse.json({ error: 'Parent author not found' }, { status: 404 });
    }

    if (parentAuthor.email_opt_in === false) {
      return NextResponse.json({ ok: true, skipped: 'recipient_opted_out' });
    }

    // Fetch replier name
    const { data: replier } = await supabase
      .from('users')
      .select('name')
      .eq('id', replierAuthorId)
      .single();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const { subject, html } = buildReplyNotificationEmail({
      recipientName: parentAuthor.name || 'there',
      replierName: replier?.name || 'Someone',
      replySnippet: replyContent,
      originalSnippet: parentComment.content,
      useCaseTitle: useCaseTitle || 'a use case',
      useCaseUrl: `${baseUrl}/use-cases/${useCaseId}`,
    });

    await sendEmail({ to: parentAuthor.email, subject, html });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('send-reply-email error:', err);
    return NextResponse.json({ error: err.message || 'Failed to send email' }, { status: 500 });
  }
}
