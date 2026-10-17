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
