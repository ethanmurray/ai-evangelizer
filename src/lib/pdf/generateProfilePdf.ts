import jsPDF from 'jspdf';

export interface ProfilePdfData {
  userName: string;
  userEmail: string;
  userTeams: string[];
  points: number;
  rankName: string;
  rankDesc: string;
  earnedBadges: Array<{ name: string; category: string }>;
  completedUseCases: Array<{ title: string }>;
  inProgressUseCases: Array<{ title: string }>;
  skillRadarData: Array<{ label: string; score: number }>;
}

// Print-friendly color palette
type RGB = [number, number, number];
const C: Record<string, RGB> = {
  primary: [59, 130, 246],    // Blue
  secondary: [99, 102, 241],  // Indigo
  text: [30, 41, 59],         // Slate-800
  muted: [100, 116, 139],     // Slate-500
  border: [226, 232, 240],    // Slate-200
  success: [34, 197, 94],     // Green
  white: [255, 255, 255],
  lightBg: [248, 250, 252],   // Slate-50
};

const PAGE_W = 210; // A4 width in mm
const PAGE_H = 297; // A4 height in mm
const MARGIN = 20;
const CONTENT_W = PAGE_W - MARGIN * 2;
const BOTTOM_LIMIT = PAGE_H - 25;

function checkPageBreak(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > BOTTOM_LIMIT) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

function drawSectionHeading(doc: jsPDF, title: string, y: number): number {
  y = checkPageBreak(doc, y, 12);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.secondary);
  doc.text(title, MARGIN, y);
  y += 2;
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
  return y + 6;
}

function renderRadarToDataUrl(data: Array<{ label: string; score: number }>): string {
  const canvas = document.createElement('canvas');
  const size = 600; // 2x for crisp rendering
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;
  const radius = 200;
  const count = data.length;
  const angleStep = (2 * Math.PI) / count;

  function polarToXY(angle: number, r: number): [number, number] {
    const rad = angle - Math.PI / 2; // Start from top
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }

  // Draw grid rings (4 levels)
  for (let level = 1; level <= 4; level++) {
    const r = (radius / 4) * level;
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      const [x, y] = polarToXY(i * angleStep, r);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Draw axis lines
  for (let i = 0; i < count; i++) {
    const [x, y] = polarToXY(i * angleStep, radius);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Draw data polygon
  const dataPoints = data.map((d, i) => {
    const r = (d.score / 100) * radius;
    return polarToXY(i * angleStep, r);
  });

  ctx.beginPath();
  dataPoints.forEach(([x, y], i) => {
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(59, 130, 246, 0.25)';
  ctx.fill();
  ctx.strokeStyle = 'rgb(59, 130, 246)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Draw data points
  dataPoints.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgb(59, 130, 246)';
    ctx.fill();
  });

  // Draw labels
  ctx.fillStyle = '#475569';
  ctx.font = '600 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  data.forEach((d, i) => {
    const [x, y] = polarToXY(i * angleStep, radius + 40);
    ctx.fillText(d.label, x, y);
  });

  return canvas.toDataURL('image/png');
}

export async function generateProfilePdf(data: ProfilePdfData): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = MARGIN;

  // ── Header ──
  // Avatar circle
  doc.setFillColor(...C.primary);
  doc.circle(MARGIN + 10, y + 10, 10, 'F');
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.white);
  const initial = (data.userName || '?')[0].toUpperCase();
  doc.text(initial, MARGIN + 10, y + 11, { align: 'center' });

  // Name and email
  doc.setTextColor(...C.text);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(data.userName, MARGIN + 25, y + 7);

  doc.setTextColor(...C.muted);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.userEmail, MARGIN + 25, y + 14);

  // Team badges
  if (data.userTeams.length > 0) {
    let tx = MARGIN + 25;
    const ty = y + 20;
    doc.setFontSize(8);
    for (const team of data.userTeams) {
      const tw = doc.getTextWidth(team) + 6;
      doc.setFillColor(...C.lightBg);
      doc.setDrawColor(...C.border);
      doc.roundedRect(tx, ty - 3.5, tw, 5.5, 1.5, 1.5, 'FD');
      doc.setTextColor(...C.muted);
      doc.text(team, tx + 3, ty);
      tx += tw + 3;
    }
  }

  y += 32;
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
  y += 8;

  // ── Rank & Points ──
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.muted);
  doc.text('Current Rank', MARGIN, y);

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.secondary);
  doc.text(data.rankName, MARGIN, y + 9);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.muted);
  doc.text(data.rankDesc, MARGIN, y + 15);

  // Points on the right side
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.primary);
  const pointsStr = data.points.toLocaleString();
  doc.text(pointsStr, MARGIN + CONTENT_W, y + 5, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.muted);
  doc.text('points', MARGIN + CONTENT_W, y + 11, { align: 'right' });

  y += 24;

  // ── Skill Radar Chart ──
  const hasRadarData = data.skillRadarData.some((d) => d.score > 0);
  if (hasRadarData) {
    y = drawSectionHeading(doc, 'Skill Profile', y);
    y = checkPageBreak(doc, y, 75);

    const radarImg = renderRadarToDataUrl(data.skillRadarData);
    const chartSize = 70;
    const chartX = MARGIN + (CONTENT_W - chartSize) / 2;
    doc.addImage(radarImg, 'PNG', chartX, y, chartSize, chartSize);
    y += chartSize + 8;
  }

  // ── Badges Earned ──
  if (data.earnedBadges.length > 0) {
    y = drawSectionHeading(doc, `Badges Earned (${data.earnedBadges.length})`, y);

    const colW = CONTENT_W / 3;
    let col = 0;
    let rowY = y;

    for (const badge of data.earnedBadges) {
      const bx = MARGIN + col * colW;

      // Category color dot
      const catColor = badge.category === 'learning' ? C.primary
        : badge.category === 'applying' ? C.success
        : badge.category === 'sharing' ? C.secondary
        : C.muted;
      doc.setFillColor(...catColor);
      doc.circle(bx + 2, rowY - 1, 1.5, 'F');

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...C.text);
      doc.text(badge.name, bx + 6, rowY);

      col++;
      if (col >= 3) {
        col = 0;
        rowY += 6;
        rowY = checkPageBreak(doc, rowY, 6);
      }
    }

    y = rowY + (col > 0 ? 6 : 0) + 4;
  }

  // ── Completed Use Cases ──
  if (data.completedUseCases.length > 0) {
    y = drawSectionHeading(doc, `Completed (${data.completedUseCases.length})`, y);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    for (const uc of data.completedUseCases) {
      y = checkPageBreak(doc, y, 5);
      // Green checkmark
      doc.setTextColor(...C.success);
      doc.text('\u2713', MARGIN + 1, y);
      doc.setTextColor(...C.text);
      doc.text(uc.title, MARGIN + 6, y);
      y += 5;
    }

    y += 4;
  }

  // ── In-Progress Use Cases ──
  if (data.inProgressUseCases.length > 0) {
    y = drawSectionHeading(doc, `In Progress (${data.inProgressUseCases.length})`, y);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    for (const uc of data.inProgressUseCases) {
      y = checkPageBreak(doc, y, 5);
      doc.setTextColor(...C.muted);
      doc.text('\u25CB', MARGIN + 1, y);
      doc.setTextColor(...C.text);
      doc.text(uc.title, MARGIN + 6, y);
      y += 5;
    }

    y += 4;
  }

  // ── Footer ──
  const lastPage = doc.getNumberOfPages();
  for (let p = 1; p <= lastPage; p++) {
    doc.setPage(p);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.muted);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()} • AI Evangelizer`,
      PAGE_W / 2,
      PAGE_H - 10,
      { align: 'center' }
    );
    if (lastPage > 1) {
      doc.text(`Page ${p} of ${lastPage}`, MARGIN + CONTENT_W, PAGE_H - 10, { align: 'right' });
    }
  }

  doc.save(`${data.userName.replace(/\s+/g, '_')}_Profile.pdf`);
}
