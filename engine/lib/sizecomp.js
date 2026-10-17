// Shared pieces for full-frame size comparisons on a realistic era-water background.
import { Water } from './water.js';
import { drawCreature, humanPath, SPECIES } from './creatures.js';
import { text, measureBar, P, ease, lerp, clamp, C } from './ui.js';
export { text, measureBar, P, ease, lerp, clamp, C, drawCreature, humanPath, SPECIES };

export function stage(era, seed = 3) {
  const w = new Water(era, seed);
  return {
    water: w,
    bg(ctx, t, depth = 0.35) { const cam = { x: t * 25, y: 0 }; w.background(ctx, 4 + t, cam, depth); w.snowLayer(ctx, 4 + t, cam, false); },
    front(ctx, t, depth = 0.35) {
      const cam = { x: t * 25, y: 0 };
      w.midground(ctx, 4 + t, cam, depth); w.snowLayer(ctx, 4 + t, cam, true);
      w.post(ctx, 4 + t, Math.round(t * 30), { vignette: 0.8, grain: 0.13 });
    },
    // animal in 'museum' shading, tinted slightly by the water
    animal(ctx, name, o) { drawCreature(ctx, name, { style: 'shaded', fog: [w.e.fog, o.fogA ?? 0.22], rim: o.rim, colors: o.colors, blur: o.blur, ...o }); },
  };
}
// creature drawn so its tail tip is at x0 (facing right) or snout at x0 (flip)
export const placeLeft = (x0, lenPx) => x0 + lenPx / 2;
export function title(ctx, t, s, sub, a0 = 0.1) {
  const a = P(t, a0, a0 + 0.4);
  text(ctx, s, 110, 120, { font: '400 64px Anton', ls: 3, a });
  if (sub) text(ctx, sub, 112, 168, { font: '600 24px Inter', ls: 4, a, color: 'rgba(255,255,255,0.75)' });
}
