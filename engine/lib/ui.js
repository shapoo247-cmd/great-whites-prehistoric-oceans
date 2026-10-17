// Shared documentary-HUD components (Anton for names, Inter for data), used by overlays and full-frame graphics.
import { P, inv, ease, lerp, clamp, rgba } from './core.js';

export const C = { white: '#ffffff', gw: '#7fe3ff', threat: '#ff6a5c', prey: '#ffd36a', rival: '#ffa64d', neutral: '#cfe6ee', dim: 'rgba(255,255,255,0.6)', ok: '#8dffa0' };

export function text(ctx, s, x, y, o = {}) {
  ctx.save();
  ctx.font = o.font || '600 28px Inter';
  ctx.letterSpacing = o.ls != null ? `${o.ls}px` : '0px';
  ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'alphabetic';
  ctx.globalAlpha *= o.a ?? 1;
  if (o.shadow !== false) { ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = o.shadowBlur ?? 14; ctx.shadowOffsetY = 2; }
  ctx.fillStyle = o.color || '#fff';
  ctx.fillText(s, x, y);
  const w = ctx.measureText(s).width;
  ctx.restore();
  return w;
}
export function measure(ctx, s, font, ls = 0) { ctx.save(); ctx.font = font; ctx.letterSpacing = `${ls}px`; const w = ctx.measureText(s).width; ctx.restore(); return w; }

// Left-to-right wipe reveal of anything drawn in fn (k: 0..1)
export function wipe(ctx, k, x, y, w, h, fn, dir = 1) {
  if (k <= 0) return; ctx.save(); ctx.beginPath();
  if (dir > 0) ctx.rect(x, y, w * k, h); else ctx.rect(x + w * (1 - k), y, w * k, h);
  ctx.clip(); fn(); ctx.restore();
}

export function pill(ctx, label, x, y, color, k = 1, font = '800 20px Inter') {
  if (k <= 0) return 0;
  ctx.save();
  const w = measure(ctx, label, font, 4) + 30, h = 34;
  ctx.globalAlpha *= clamp(k * 2);
  ctx.translate(x, y); ctx.scale(lerp(0.7, 1, ease.outBack(k)), lerp(0.7, 1, ease.outBack(k)));
  ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(0, -h / 2, w, h, 4); ctx.fill();
  ctx.font = font; ctx.letterSpacing = '4px'; ctx.fillStyle = '#0b1114'; ctx.textBaseline = 'middle'; ctx.fillText(label, 15, 1);
  ctx.restore();
  return w;
}

// soft dark scrim (for overlays on busy footage)
export function scrim(ctx, x, y, w, h, a = 0.55) {
  // soft elliptical darkening centred on the block; fades fully to zero (no hard edges)
  ctx.save();
  const cx = x + w * 0.4, cy = y + h * 0.55, r = h * 1.1;
  ctx.translate(cx, cy); ctx.scale((w * 0.75) / r, 1);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
  g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(0.55, `rgba(0,0,0,${a * 0.6})`); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(-r * 1.05, -r * 1.05, r * 2.1, r * 2.1);
  ctx.restore();
}

// measurement bar with end ticks and label; k draws progressively
export function measureBar(ctx, x0, x1, y, k, label, color = '#fff', o = {}) {
  if (k <= 0) return;
  const xe = lerp(x0, x1, ease.outCubic(clamp(k)));
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = o.lw || 3; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 8;
  if (o.dash) ctx.setLineDash(o.dash);
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(xe, y); ctx.stroke();
  ctx.setLineDash([]);
  const th = o.tick || 16;
  ctx.beginPath(); ctx.moveTo(x0, y - th); ctx.lineTo(x0, y + th); ctx.stroke();
  if (k >= 0.98) { ctx.beginPath(); ctx.moveTo(x1, y - th); ctx.lineTo(x1, y + th); ctx.stroke(); }
  ctx.restore();
  if (label) text(ctx, label, (x0 + x1) / 2, y + (o.below ? 46 : -20), { font: o.font || '700 30px Inter', ls: 3, align: 'center', a: clamp((k - 0.5) * 2), color });
}

// rounded label box with leader line pointing to (px,py)
export function callout(ctx, k, px, py, bx, by, lines, color = '#fff', o = {}) {
  if (k <= 0) return;
  const lk = P(k, 0, 0.45, ease.outCubic), bk = P(k, 0.35, 1, ease.outCubic);
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(px, py, 7 * lk, 0, 7); ctx.fillStyle = color; ctx.fill();
  ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(lerp(px, bx, lk), lerp(py, by, lk)); ctx.stroke();
  ctx.restore();
  if (bk > 0) lines.forEach((l, i) => text(ctx, l.t, bx + (o.align === 'right' ? -12 : 12), by + 8 + i * (l.lh || 40), { font: l.font || '700 30px Inter', ls: l.ls ?? 2, color: l.color || '#fff', a: bk, align: o.align || 'left' }));
}

// check row (✓ + text) with pop-in
export function checkRow(ctx, k, x, y, label, color = C.ok, font = '700 40px Inter') {
  if (k <= 0) return;
  ctx.save();
  const s = lerp(0.6, 1, ease.outBack(clamp(k * 1.4)));
  ctx.globalAlpha *= clamp(k * 3);
  ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = color; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.arc(0, -14, 24, 0, 7); ctx.stroke();
  const ck = clamp(k * 2 - 0.3);
  ctx.beginPath(); ctx.moveTo(-11, -14); ctx.lineTo(-3, -5); if (ck > 0.4) ctx.lineTo(lerp(-3, 12, clamp((ck - 0.4) / 0.6)), lerp(-5, -25, clamp((ck - 0.4) / 0.6))); ctx.stroke();
  ctx.restore();
  text(ctx, label, x + 46, y, { font, ls: 3, a: clamp(k * 2) });
}

// typewriter: reveals characters progressively
export function typewriter(ctx, s, k, x, y, o = {}) {
  const n = Math.floor(s.length * clamp(k));
  const shown = s.slice(0, n);
  const w = text(ctx, shown, x, y, o);
  if (k > 0 && k < 1.15 && Math.floor(k * 12) % 2 === 0) { ctx.save(); ctx.fillStyle = o.color || '#fff'; const fs = parseInt((o.font || '28px').match(/(\d+)px/)[1]); ctx.fillRect(x + w + 4, y - fs * 0.8, fs * 0.45, fs * 0.9); ctx.restore(); }
}

// HUD gauge (horizontal bar) value 0..1
export function gauge(ctx, x, y, w, h, v, color, label, valueText, o = {}) {
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = o.glow ?? 12; ctx.fillRect(x, y, w * clamp(v), h);
  ctx.shadowBlur = 0; ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, w, h);
  for (let i = 1; i < 10; i++) { ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(x + w * i / 10 - 1, y, 2, h); }
  ctx.restore();
  if (label) text(ctx, label, x, y - 14, { font: '700 22px Inter', ls: 4, color: o.labelColor || C.dim });
  if (valueText) text(ctx, valueText, x + w, y - 14, { font: '700 22px Inter', ls: 2, align: 'right', color });
}

export function corners(ctx, x, y, w, h, k, color = 'rgba(255,255,255,0.8)', len = 26) {
  if (k <= 0) return; ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.globalAlpha *= k;
  const L = len * ease.outCubic(k);
  for (const [cx, cy, sx, sy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) { ctx.beginPath(); ctx.moveTo(cx + sx * L, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + sy * L); ctx.stroke(); }
  ctx.restore();
}
export { P, inv, ease, lerp, clamp, rgba };
