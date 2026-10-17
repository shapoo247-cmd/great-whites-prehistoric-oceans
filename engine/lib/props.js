import { lit } from './doc.js';
// Simple vector props for evidence / diet graphics (flat, clean silhouettes + a few shaded bits).
export function bone(ctx, x, y, len, ang = 0, a = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.globalAlpha *= a;
  const h = len / 2, w = 17, k = 22;
  const path = new Path2D(); path.roundRect(-h + k, -w, len - 2 * k, 2 * w, w);
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) path.arc(sx * (h - k * 0.55) + k * 0.78, sy * (k * 0.62), k * 0.78, 0, Math.PI * 2);
  ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6;
  const g = ctx.createLinearGradient(0, -k, 0, k); g.addColorStop(0, '#e9e0c6'); g.addColorStop(0.45, '#bdb394'); g.addColorStop(1, '#6f664f'); ctx.fillStyle = g; ctx.fill(path);
  ctx.shadowColor = 'transparent'; ctx.save(); ctx.clip(path);
  for (let i = 0; i < 90; i++) { const px = -h + ((i * 53) % 100) / 100 * len, py = -k + ((i * 37) % 100) / 100 * k * 2; ctx.fillStyle = i % 3 ? 'rgba(60,48,30,0.18)' : 'rgba(255,250,230,0.16)'; ctx.beginPath(); ctx.arc(px, py, 1 + (i % 4) * 0.6, 0, 7); ctx.fill(); }
  const hl = ctx.createLinearGradient(0, -w, 0, w * 0.2); hl.addColorStop(0, 'rgba(255,255,240,0.45)'); hl.addColorStop(1, 'rgba(255,255,240,0)'); ctx.fillStyle = hl; ctx.fillRect(-h, -w, len, w * 1.2);
  const sd = ctx.createLinearGradient(0, 0, 0, w); sd.addColorStop(0, 'rgba(0,0,0,0)'); sd.addColorStop(1, 'rgba(20,14,6,0.45)'); ctx.fillStyle = sd; ctx.fillRect(-h, 0, len, w * 1.4);
  ctx.restore(); ctx.restore();
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
  // a real skull: the head of the shaded Dorudon model, cropped, in bone colours
  ctx.save(); ctx.globalAlpha *= a; const L = s * 5.2; ctx.beginPath(); ctx.rect(x - 0.13 * L, y - 0.14 * L, 0.27 * L, 0.28 * L); ctx.clip();
  lit(ctx, 'dorudon', { pal: 'bone', x: x - 0.39 * L, y, len: L, phase: 0, amp: 0, fog: ['#0b1a1c', 0.0] }); ctx.restore();
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
