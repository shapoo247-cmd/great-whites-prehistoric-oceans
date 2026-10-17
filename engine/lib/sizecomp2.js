// Size-comparison kit, documentary style: rich seascape, shaded animals, hairline measure bars, Anton figures.
import { Seascape } from './seascape.js';
import { drawCreature, humanPath } from './creatures.js';
import { cap, hair, big, P, ease, lerp, clamp, slow, COL } from './doc.js';
export { cap, hair, big, P, ease, lerp, clamp, slow, COL, drawCreature, humanPath };
export function stage(era, seed, depth = 0.3) {
  const s = new Seascape(era, seed);
  return {
    s,
    bg(ctx, t, D) { const z = lerp(1.03, 1, ease.outCubic(clamp(t / (D || 6)))); ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540); s.draw(ctx, t, { depth, camX: t * 22, ridgeShift: 120 }); ctx.restore(); },
    animal(ctx, name, o) { drawCreature(ctx, name, { style: 'shaded', fog: [s.w.e.fog, o.fogA ?? 0.2], rim: o.rim || 'rgba(200,230,230,0.5)', ...o }); },
  };
}
// thin measure bar: end ticks, big figure at the end
export function measure(ctx, x0, x1, y, k, label, color = '#fff', o = {}) {
  if (k <= 0) return; const xe = lerp(x0, x1, ease.outCubic(clamp(k)));
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 2.2; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 8; if (o.dash) ctx.setLineDash(o.dash);
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(xe, y); ctx.stroke(); ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(x0, y - 11); ctx.lineTo(x0, y + 11); ctx.stroke(); if (k >= 0.97) { ctx.beginPath(); ctx.moveTo(x1, y - 11); ctx.lineTo(x1, y + 11); ctx.stroke(); } ctx.restore();
  if (label) big(ctx, label, o.lx ?? x1 + 24, y + (o.ly ?? 18), { size: o.size || 54, a: clamp((k - 0.5) * 2), color: o.lcolor || color, align: o.align || 'left' });
}
