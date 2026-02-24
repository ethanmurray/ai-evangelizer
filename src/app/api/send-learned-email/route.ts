import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { learnerId, learnerEmail, learnerName, teacherEmail, useCaseTitle, useCaseId } = await req.json();

    if (!learnerEmail || !teacherEmail || !useCaseTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Record the attribution in the database
    if (learnerId && useCaseId) {
      const { error: insertError } = await supabase
        .from('attributions')
        .insert({
          learner_id: learnerId,
          teacher_email: teacherEmail,
          use_case_id: useCaseId,
        });

      if (insertError) {
        console.error('Attribution insert failed:', insertError);
      }
    }

    const displayName = learnerName || learnerEmail;

    // Send email to the teacher, cc the learner
    await sendEmail({
      to: teacherEmail,
      cc: learnerEmail,
      subject: `${displayName} says you taught them "${useCaseTitle}"`,
      html: `<p><strong>${displayName}</strong> logged that you taught them <strong>${useCaseTitle}</strong>.</p>
<p>Thanks for spreading the knowledge!</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('send-learned-email error:', err);
    return NextResponse.json({ error: err.message || 'Failed to send emails' }, { status: 500 });
  }
}
