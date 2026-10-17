// Simple vector props for evidence / diet graphics (flat, clean silhouettes + a few shaded bits).
export function bone(ctx, x, y, len, ang = 0, a = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.globalAlpha *= a; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 14;
  const g = ctx.createLinearGradient(0, -34, 0, 34); g.addColorStop(0, '#f3ecd8'); g.addColorStop(1, '#a9a086'); ctx.fillStyle = g;
  const h = len / 2, w = 17, k = 21;
  ctx.beginPath(); ctx.roundRect(-h + k, -w, len - 2 * k, 2 * w, w); ctx.fill();
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * (h - k * 0.55), sy * (k * 0.62), k * 0.78, 0, 7); ctx.fill(); }
  ctx.restore();
}
// a bite puncture: dark pit with a lit rim; k = 0..1 press-in animation
export function puncture(ctx, x, y, r, k) {
  if (k <= 0) return; ctx.save(); const s = 0.4 + 0.6 * Math.min(1, k * 1.5); ctx.globalAlpha *= Math.min(1, k * 3);
  ctx.fillStyle = '#2b2418'; ctx.beginPath(); ctx.ellipse(x, y, r * s, r * 0.72 * s, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,240,0.55)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(x, y + 1, r * s + 1.5, r * 0.72 * s + 1.5, 0, Math.PI * 0.1, Math.PI * 0.9); ctx.stroke(); ctx.restore();
}
export function tooth(ctx, x, y, h, rot = 0, a = 1, glow = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha *= a; ctx.shadowColor = glow ? 'rgba(255,255,230,0.9)' : 'rgba(0,0,0,0.5)'; ctx.shadowBlur = glow ? 24 * glow : 8;
  const g = ctx.createLinearGradient(0, -h, 0, 0); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#cfc7ad'); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(-h * 0.36, 0); ctx.quadraticCurveTo(-h * 0.2, -h * 0.55, 0, -h); ctx.quadraticCurveTo(h * 0.2, -h * 0.55, h * 0.36, 0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(80,70,50,0.4)'; ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore();
}
export function vertebra(ctx, x, y, s, ang = 0, a = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.globalAlpha *= a; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 12;
  const g = ctx.createLinearGradient(0, -s, 0, s); g.addColorStop(0, '#f0e8d2'); g.addColorStop(1, '#a89f86'); ctx.fillStyle = g;
  ctx.beginPath(); ctx.roundRect(-s * 0.55, -s * 0.8, s * 1.1, s * 1.6, s * 0.35); ctx.fill(); ctx.fillRect(-s * 0.12, -s * 1.5, s * 0.24, s * 0.8);
  ctx.strokeStyle = 'rgba(70,60,40,0.35)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-s * 0.55, -s * 0.2); ctx.lineTo(s * 0.55, -s * 0.2); ctx.moveTo(-s * 0.55, s * 0.3); ctx.lineTo(s * 0.55, s * 0.3); ctx.stroke(); ctx.restore();
}
export function skull(ctx, x, y, s, a = 1) {
  ctx.save(); ctx.translate(x, y); ctx.globalAlpha *= a; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 12;
  const g = ctx.createLinearGradient(0, -s, 0, s); g.addColorStop(0, '#f1ead6'); g.addColorStop(1, '#aca388'); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(-s, -s * 0.2); ctx.quadraticCurveTo(-s * 0.6, -s * 0.9, -s * 0.05, -s * 0.7); ctx.lineTo(s * 1.3, -s * 0.12); ctx.lineTo(s * 1.3, s * 0.12); ctx.lineTo(s * 0.1, s * 0.35); ctx.quadraticCurveTo(-s * 0.7, s * 0.6, -s, -s * 0.2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2b2418'; ctx.beginPath(); ctx.arc(-s * 0.05, -s * 0.18, s * 0.17, 0, 7); ctx.fill(); ctx.restore();
}
export function plesiosaur(ctx, x, y, s, color, a = 1, dash = false) {
  ctx.save(); ctx.translate(x, y); ctx.globalAlpha *= a; ctx.fillStyle = color; ctx.strokeStyle = color; ctx.lineWidth = 2.5; if (dash) ctx.setLineDash([8, 6]);
  const p = new Path2D(); p.ellipse(0, 0, s * 0.5, s * 0.22, 0, 0, 7);
  p.moveTo(s * 0.4, -s * 0.1); p.bezierCurveTo(s * 0.7, -s * 0.2, s * 0.62, -s * 0.62, s * 0.86, -s * 0.74); p.lineTo(s * 0.96, -s * 0.7); p.bezierCurveTo(s * 0.8, -s * 0.5, s * 0.8, -s * 0.12, s * 0.5, s * 0.02); p.closePath();
  p.moveTo(s * 0.15, s * 0.14); p.lineTo(s * 0.32, s * 0.5); p.lineTo(s * 0.4, s * 0.4); p.lineTo(s * 0.28, s * 0.1); p.moveTo(-s * 0.28, s * 0.14); p.lineTo(-s * 0.18, s * 0.5); p.lineTo(-s * 0.1, s * 0.42); p.lineTo(-s * 0.16, s * 0.1);
  p.moveTo(-s * 0.48, 0); p.lineTo(-s * 0.7, -s * 0.05); p.lineTo(-s * 0.48, s * 0.07);
  dash ? ctx.stroke(p) : ctx.fill(p); ctx.restore();
}
export function fishIcon(ctx, x, y, L, color, a = 1, flip = false, ph = 0) {
  ctx.save(); ctx.translate(x, y); if (flip) ctx.scale(-1, 1); ctx.globalAlpha *= a; ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(L / 2, 0); ctx.bezierCurveTo(L * 0.2, -L * 0.22, -L * 0.25, -L * 0.2, -L * 0.42, 0); ctx.bezierCurveTo(-L * 0.25, L * 0.2, L * 0.2, L * 0.22, L / 2, 0); ctx.fill();
  const sw = Math.sin(ph) * L * 0.05; ctx.beginPath(); ctx.moveTo(-L * 0.4, 0); ctx.lineTo(-L * 0.62, -L * 0.2 + sw); ctx.lineTo(-L * 0.62, L * 0.2 + sw); ctx.closePath(); ctx.fill(); ctx.restore();
}
export function sealIcon(ctx, x, y, L, color, a = 1, ph = 0) {
  ctx.save(); ctx.translate(x, y); ctx.globalAlpha *= a; ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(L / 2, -L * 0.05); ctx.bezierCurveTo(L * 0.42, -L * 0.2, L * 0.25, -L * 0.2, L * 0.1, -L * 0.17); ctx.bezierCurveTo(-L * 0.2, -L * 0.2, -L * 0.38, -L * 0.1, -L * 0.5, L * 0.04);
  ctx.lineTo(-L * 0.62, L * 0.0 + Math.sin(ph) * 4); ctx.lineTo(-L * 0.62, L * 0.12 + Math.sin(ph) * 4); ctx.lineTo(-L * 0.46, L * 0.1); ctx.bezierCurveTo(-L * 0.2, L * 0.2, L * 0.2, L * 0.2, L * 0.45, L * 0.06); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(L * 0.05, L * 0.1); ctx.lineTo(-L * 0.04, L * 0.36); ctx.lineTo(L * 0.1, L * 0.32); ctx.closePath(); ctx.fill(); ctx.restore();
}
export function dolphinIcon(ctx, x, y, L, color, a = 1, ph = 0) {
  ctx.save(); ctx.translate(x, y); ctx.globalAlpha *= a; ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(L * 0.5, 0); ctx.lineTo(L * 0.36, -L * 0.03); ctx.bezierCurveTo(L * 0.3, -L * 0.17, L * 0.05, -L * 0.17, -L * 0.1, -L * 0.1); ctx.lineTo(-L * 0.14, -L * 0.25); ctx.lineTo(-L * 0.2, -L * 0.1);
  ctx.bezierCurveTo(-L * 0.35, -L * 0.04, -L * 0.45, 0, -L * 0.5, L * 0.04 + Math.sin(ph) * 5); ctx.lineTo(-L * 0.62, -L * 0.1 + Math.sin(ph) * 5); ctx.lineTo(-L * 0.6, L * 0.14 + Math.sin(ph) * 5); ctx.lineTo(-L * 0.48, L * 0.06);
  ctx.bezierCurveTo(-L * 0.2, L * 0.16, L * 0.2, L * 0.15, L * 0.36, L * 0.04); ctx.closePath(); ctx.fill(); ctx.restore();
}
