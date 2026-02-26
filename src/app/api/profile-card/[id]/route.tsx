import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await params;

  // Fetch user info
  const { data: user } = await supabase
    .from('users')
    .select('name, team')
    .eq('id', userId)
    .single();

  if (!user) {
    return new Response('User not found', { status: 404 });
  }

  // Fetch points
  const { data: pointsRow } = await supabase
    .from('user_total_points')
    .select('total_points')
    .eq('user_id', userId)
    .single();

  const points = pointsRow?.total_points || 0;

  // Fetch top 3 badges
  const { data: badges } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false })
    .limit(3);

  const badgeNames = (badges || []).map((b: any) => b.badge_id);

  // Determine rank
  const ranks = [
    { min: 0, name: 'Curious' },
    { min: 50, name: 'Acolyte' },
    { min: 150, name: 'Devotee' },
    { min: 300, name: 'Evangelist' },
    { min: 500, name: 'High Priest' },
  ];
  let rank = ranks[0].name;
  for (const r of ranks) {
    if (points >= r.min) rank = r.name;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '600px',
          height: '315px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          color: '#e0e0e0',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#e63946',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#fff',
              marginRight: '16px',
            }}
          >
            {(user.name || '?')[0].toUpperCase()}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f4a261' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '14px', color: '#a0a0a0' }}>
              {user.team} &middot; {rank}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '32px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f4a261' }}>
              {points}
            </div>
            <div style={{ fontSize: '12px', color: '#a0a0a0' }}>Points</div>
          </div>
        </div>

        {badgeNames.length > 0 && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {badgeNames.map((badge) => (
              <div
                key={badge}
                style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  background: 'rgba(244, 162, 97, 0.2)',
                  color: '#f4a261',
                  fontSize: '12px',
                  border: '1px solid rgba(244, 162, 97, 0.4)',
                }}
              >
                {badge.replace(/_/g, ' ')}
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    {
      width: 600,
      height: 315,
    }
  );
}
