import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim().toLowerCase() || '';
  const userId = req.nextUrl.searchParams.get('userId') || '';

  if (q.length < 2) {
    return NextResponse.json({ users: [] });
  }

  // Search users by email or name (exclude stubs and current user)
  let query = supabase
    .from('users')
    .select('id, email, name')
    .eq('is_stub', false)
    .or(`email.ilike.%${q}%,name.ilike.%${q}%`)
    .limit(20);

  if (userId) {
    query = query.neq('id', userId);
  }

  const { data: users, error } = await query;
  if (error || !users) {
    return NextResponse.json({ users: [] });
  }

  // Determine contacts if userId is provided
  const contactIds = new Set<string>();

  if (userId) {
    // People the user has shared with or who shared with them
    const { data: shareContacts } = await supabase
      .from('shares')
      .select('sharer_id, recipient_id')
      .or(`sharer_id.eq.${userId},recipient_id.eq.${userId}`);

    for (const s of shareContacts || []) {
      if (s.sharer_id !== userId) contactIds.add(s.sharer_id);
      if (s.recipient_id !== userId) contactIds.add(s.recipient_id);
    }

    // People related via attributions (user's email as teacher, or user as learner)
    const { data: currentUser } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();

    if (currentUser?.email) {
      // People who credited this user as teacher
      const { data: learners } = await supabase
        .from('attributions')
        .select('learner_id')
        .eq('teacher_email', currentUser.email);

      for (const a of learners || []) {
        contactIds.add(a.learner_id);
      }

      // Teachers this user credited (need to look up by email)
      const { data: teacherAttributions } = await supabase
        .from('attributions')
        .select('teacher_email')
        .eq('learner_id', userId);

      if (teacherAttributions?.length) {
        const teacherEmails = teacherAttributions.map((a) => a.teacher_email);
        const { data: teachers } = await supabase
          .from('users')
          .select('id')
          .in('email', teacherEmails)
          .eq('is_stub', false);

        for (const t of teachers || []) {
          contactIds.add(t.id);
        }
      }
    }
  }

  // Build result with isContact flag and sort contacts first
  const result = users
    .map((u) => ({
      email: u.email,
      name: u.name,
      isContact: contactIds.has(u.id),
    }))
    .sort((a, b) => {
      if (a.isContact !== b.isContact) return a.isContact ? -1 : 1;
      return a.name.localeCompare(b.name);
    })
    .slice(0, 10);

  return NextResponse.json({ users: result });
}
