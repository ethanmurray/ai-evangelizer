'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchComments,
  fetchPlaybookSteps,
  createComment,
  deleteComment as deleteCommentApi,
  Comment,
  CommentType,
} from '@/lib/data/comments';

export function useComments(useCaseId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [playbookSteps, setPlaybookSteps] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [c, p] = await Promise.all([
        fetchComments(useCaseId),
        fetchPlaybookSteps(useCaseId),
      ]);
      setComments(c);
      setPlaybookSteps(p);
    } finally {
      setIsLoading(false);
    }
  }, [useCaseId]);

  useEffect(() => {
    load();
  }, [load]);

  const addComment = useCallback(async (
    authorId: string,
    content: string,
    type: CommentType = 'discussion',
    parentId?: string
  ) => {
    await createComment(useCaseId, authorId, content, type, parentId);
    load();
  }, [useCaseId, load]);

  const removeComment = useCallback(async (commentId: string) => {
    await deleteCommentApi(commentId);
    load();
  }, [load]);

  return { comments, playbookSteps, isLoading, refresh: load, addComment, removeComment };
}
