import { supabase } from '../supabase';
import { createNotification } from './notifications';

export type CommentType = 'discussion' | 'tip' | 'gotcha' | 'playbook_step';

export interface Comment {
  id: string;
  use_case_id: string;
  author_id: string;
  author_name?: string;
  content: string;
  comment_type: CommentType;
  sort_order: number | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  replies?: Comment[];
}

export async function fetchComments(useCaseId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('use_case_id', useCaseId)
    .neq('comment_type', 'playbook_step')
    .is('parent_id', null)
    .order('created_at', { ascending: true });

  if (error || !data) return [];

  // Fetch replies
  const commentIds = data.map((c: any) => c.id);
  const { data: replies } = commentIds.length > 0
    ? await supabase
        .from('comments')
        .select('*')
        .in('parent_id', commentIds)
        .order('created_at', { ascending: true })
    : { data: [] };

  // Fetch author names
  const allAuthorIds = [...new Set([
    ...data.map((c: any) => c.author_id),
    ...(replies || []).map((r: any) => r.author_id),
  ])];

  const { data: users } = await supabase
    .from('users')
    .select('id, name')
    .in('id', allAuthorIds);
  const userMap = new Map((users || []).map((u: any) => [u.id, u.name]));

  const replyMap = new Map<string, Comment[]>();
  for (const r of replies || []) {
    const arr = replyMap.get(r.parent_id) || [];
    arr.push({ ...r, author_name: userMap.get(r.author_id) || 'Unknown' });
    replyMap.set(r.parent_id, arr);
  }

  return data.map((c: any) => ({
    ...c,
    author_name: userMap.get(c.author_id) || 'Unknown',
    replies: replyMap.get(c.id) || [],
  }));
}

export async function fetchPlaybookSteps(useCaseId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('use_case_id', useCaseId)
    .eq('comment_type', 'playbook_step')
    .order('sort_order', { ascending: true });

  if (error || !data) return [];

  const authorIds = [...new Set(data.map((c: any) => c.author_id))];
  const { data: users } = await supabase
    .from('users')
    .select('id, name')
    .in('id', authorIds);
  const userMap = new Map((users || []).map((u: any) => [u.id, u.name]));

  return data.map((c: any) => ({
    ...c,
    author_name: userMap.get(c.author_id) || 'Unknown',
  }));
}

export async function createComment(
  useCaseId: string,
  authorId: string,
  content: string,
  commentType: CommentType = 'discussion',
  parentId?: string
): Promise<Comment> {
  let sortOrder = null;
  if (commentType === 'playbook_step') {
    const { data: maxRow } = await supabase
      .from('comments')
      .select('sort_order')
      .eq('use_case_id', useCaseId)
      .eq('comment_type', 'playbook_step')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();
    sortOrder = (maxRow?.sort_order || 0) + 1;
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({
      use_case_id: useCaseId,
      author_id: authorId,
      content,
      comment_type: commentType,
      sort_order: sortOrder,
      parent_id: parentId || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // --- Notifications (fire-and-forget) ---
  const { data: useCase } = await supabase
    .from('use_cases')
    .select('submitted_by, title')
    .eq('id', useCaseId)
    .single();

  const notifiedUserIds = new Set<string>();

  // 1) Reply notification: notify the parent comment's author
  if (parentId) {
    const { data: parentComment } = await supabase
      .from('comments')
      .select('author_id, content')
      .eq('id', parentId)
      .single();

    if (parentComment && parentComment.author_id !== authorId) {
      notifiedUserIds.add(parentComment.author_id);

      // In-app notification
      createNotification(
        parentComment.author_id,
        'reply_received',
        'New reply to your comment',
        `Someone replied to your comment on "${useCase?.title || 'a use case'}"`,
        { use_case_id: useCaseId, comment_id: data.id, parent_comment_id: parentId }
      ).catch(() => {});

      // Email notification via API route (fire-and-forget)
      fetch('/api/send-reply-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentCommentId: parentId,
          replyContent: content,
          replierAuthorId: authorId,
          useCaseId,
          useCaseTitle: useCase?.title || '',
        }),
      }).catch(() => {});
    }
  }

  // 2) Use case submitter notification (skip if already notified as parent comment author)
  if (useCase?.submitted_by && useCase.submitted_by !== authorId && !notifiedUserIds.has(useCase.submitted_by)) {
    createNotification(
      useCase.submitted_by,
      'comment_received',
      'New comment on your use case',
      `Someone commented on "${useCase.title || 'your use case'}"`,
      { use_case_id: useCaseId, comment_id: data.id }
    ).catch(() => {});
  }

  return data;
}

export async function updateComment(commentId: string, content: string): Promise<void> {
  const { error } = await supabase
    .from('comments')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', commentId);
  if (error) throw new Error(error.message);
}

export async function deleteComment(commentId: string): Promise<void> {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);
  if (error) throw new Error(error.message);
}
