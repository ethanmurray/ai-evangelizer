import type { DigestData } from '@/lib/data/digest';

export function buildWeeklyDigestEmail(data: DigestData): { subject: string; html: string } {
  const badgesHtml = data.newBadges.length > 0
    ? `<div style="margin:16px 0;padding:12px;background:#f0f9f0;border-radius:8px;">
        <strong>New Badges:</strong> ${data.newBadges.join(', ')}
       </div>`
    : '';

  const teamRankHtml = data.teamRank
    ? `<p>You're ranked <strong>#${data.teamRank}</strong> on the ${data.teamName} team.</p>`
    : '';

  const trendingHtml = data.trending.length > 0
    ? `<div style="margin:16px 0;">
        <strong>Trending This Week:</strong>
        <ul style="margin:8px 0;padding-left:20px;">
          ${data.trending.map(t => `<li>${t.title} (${t.recentUpvotes} upvotes)</li>`).join('')}
        </ul>
       </div>`
    : '';

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
      <h2 style="color:#333;">Weekly Digest</h2>
      <p>Hi ${data.userName},</p>
      <p>Here's your weekly summary:</p>

      <div style="margin:16px 0;padding:16px;background:#f5f5f5;border-radius:8px;">
        <div style="display:flex;gap:24px;">
          <div>
            <div style="font-size:24px;font-weight:bold;color:#f4a261;">${data.pointsThisWeek}</div>
            <div style="font-size:12px;color:#666;">Points this week</div>
          </div>
          <div>
            <div style="font-size:24px;font-weight:bold;color:#333;">${data.totalPoints}</div>
            <div style="font-size:12px;color:#666;">Total points</div>
          </div>
        </div>
      </div>

      ${badgesHtml}
      ${teamRankHtml}
      ${trendingHtml}

      <p style="color:#666;font-size:13px;margin-top:24px;">Keep learning and sharing!</p>
    </div>
  `.trim();

  const subject = data.pointsThisWeek > 0
    ? `You earned ${data.pointsThisWeek} points this week!`
    : 'Your Weekly Digest';

  return { subject, html };
}
