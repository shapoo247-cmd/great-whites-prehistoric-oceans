// Documentary-style minimal kit: hairlines, quiet small caps, slow eases, soft light. Less is more.
import { Water } from './water.js';
import { P, ease, lerp, clamp, rgba } from './core.js';
export { P, ease, lerp, clamp, rgba };
export const slow = ease.inOutQuad;
export function cap(ctx, s, x, y, o = {}) {
  ctx.save();
  ctx.font = o.font || '500 22px Inter'; ctx.letterSpacing = `${o.ls ?? 7}px`;
  ctx.textAlign = o.align || 'left'; ctx.globalAlpha *= o.a ?? 1;
  ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 18;
  ctx.fillStyle = o.color || 'rgba(255,255,255,0.92)';
  const dx = o.align === 'center' ? (o.ls ?? 7) / 2 : 0; // balance trailing letter-spacing
  ctx.fillText(s, x + dx, y); ctx.restore();
}
export function hair(ctx, x0, y0, x1, y1, k = 1, a = 0.6, color = '#fff') {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = color; ctx.lineWidth = 1.5;
  ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, x1, k), lerp(y0, y1, k)); ctx.stroke(); ctx.restore();
}
export const fadeEdges = (t, D, fi = 0.8, fo = 0.8) => Math.min(P(t, 0, fi, slow), 1 - P(t, D - fo, D, slow));
// full-frame era water with slow drift (for title cards / full-frame graphics)
export function seaStage(era, seed) {
  const w = new Water(era, seed);
  return {
    w,
    draw(ctx, t, depth = 0.3, push = 0.04, D = 4) {
      const lt = 5 + t * 0.9, cam = { x: t * 30, y: 0 }, s = lerp(1 + push, 1, ease.outCubic(clamp(t / D)));
      ctx.save(); ctx.translate(960, 540); ctx.scale(s, s); ctx.translate(-960, -540);
      w.background(ctx, lt, cam, depth); w.snowLayer(ctx, lt, cam, false); w.midground(ctx, lt, cam, depth); w.snowLayer(ctx, lt, cam, true);
      ctx.restore();
      w.post(ctx, lt, Math.round(t * 30), { vignette: 0.85, grain: 0.12 });
    }
  };
}
export { scrim as veil } from './ui.js';
// bold Anton figure/word with soft shadow
export function big(ctx, s, x, y, o = {}) {
  ctx.save(); ctx.font = `400 ${o.size || 120}px Anton`; ctx.letterSpacing = `${o.ls ?? 4}px`; ctx.textAlign = o.align || 'left'; ctx.globalAlpha *= o.a ?? 1;
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 26; ctx.fillStyle = o.color || '#fff'; ctx.fillText(s, x, y); ctx.restore();
}
export const COL = { hot: '#ff7a5c', warm: '#ffb06a', cold: '#8fd8ff', gw: '#7fe3ff', bad: '#ff6a5c', ok: '#9fffbb', gold: '#ffd36a' };

// lit, shaded animals tinted to a role colour (no flat clip-art silhouettes)
import { drawCreature as _dc } from './creatures.js';
export const PAL = {
  gw:    { colors: { back: '#142a38', flank: '#2f6f8a', belly: '#b6e8f6' }, rim: 'rgba(160,235,255,0.85)' },
  prey:  { colors: { back: '#4a3512', flank: '#a9822f', belly: '#f1d98f' }, rim: 'rgba(255,225,150,0.85)' },
  rival: { colors: { back: '#3d200c', flank: '#b86a22', belly: '#f2c58f' }, rim: 'rgba(255,190,120,0.85)' },
  threat:{ colors: { back: '#1c1214', flank: '#5a2a2c', belly: '#a9877f' }, rim: 'rgba(255,140,120,0.7)' },
  bone:  { colors: { back: '#7c7766', flank: '#c9c2aa', belly: '#f1ecda' }, rim: 'rgba(255,255,240,0.7)' },
  dark:  { colors: { back: '#05090c', flank: '#0d171d', belly: '#1c2a33' }, rim: 'rgba(120,170,190,0.4)' },
  grey:  { colors: { back: '#1c2731', flank: '#3a4a57', belly: '#8d9aa3' }, rim: 'rgba(200,230,240,0.55)' },
};
export function lit(ctx, name, o) { const p = PAL[o.pal || 'grey']; return _dc(ctx, name, { style: 'shaded', real: true, colors: p.colors, rim: p.rim, fog: o.fog || ['#0b1a1c', o.fogA ?? 0.08], ...o }); }
