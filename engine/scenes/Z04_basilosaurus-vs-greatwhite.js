// VO 7:36.08 "A whale too, but serpent-shaped and 15 to 18 meters long."
import { stage, text, measureBar, P, ease, lerp, clamp, C, title } from '../lib/sizecomp.js';
const T0 = 455.8, at = s => s - T0;
let S;
const ppm = 92, X0 = 130;
export default {
  duration: 6.2, out: '04_size-comparisons/Z04_basilosaurus-vs-greatwhite',
  sfx: [{ name: 'whoosh_slow', t: 0.1, gain: -6 }, { name: 'impact_deep', t: at(458.45), gain: -8 }, { name: 'data_blip', t: at(458.45) + 0.3, gain: -8 }],
  setup() { S = stage('eocene', 24); },
  draw(ctx, t) {
    S.bg(ctx, t, 0.3);
    title(ctx, t, 'SIZE CHECK', 'BASILOSAURUS vs GREAT WHITE vs DORUDON', 0);
    const bl = 17.5 * ppm, gl = 5 * ppm, by = 470, gy = 810;
    const bIn = P(t, 0.1, 1.6, ease.outCubic);
    S.animal(ctx, 'basilosaurus', { x: X0 + bl / 2 - (1 - bIn) * 400, y: by, len: bl, phase: t * 3, alpha: bIn, colors: { back: '#222c2a', flank: '#43524c', belly: '#8b978f' } });
    const k15 = P(t, at(458.45), at(458.45) + 0.8), k18 = P(t, at(458.45) + 0.5, at(458.45) + 1.2);
    measureBar(ctx, X0, X0 + 15 * ppm, by + 70, k15, '', '#ffffff');
    if (k18 > 0) measureBar(ctx, X0 + 15 * ppm, X0 + 18 * ppm, by + 70, k18, '', '#ffffff', { dash: [8, 6] });
    text(ctx, '15–18 m', X0 + 16.5 * ppm, by + 130, { font: '800 40px Inter', ls: 3, align: 'center', a: k15 });
    const gIn = P(t, 0.6, 1.6, ease.outCubic);
    S.animal(ctx, 'greatwhite', { x: X0 + gl / 2, y: gy, len: gl, phase: t * 5, alpha: gIn });
    S.animal(ctx, 'dorudon', { x: X0 + gl + 140 + gl / 2, y: gy + 10, len: gl, phase: t * 4, alpha: gIn, colors: { back: '#2a302c', flank: '#4c5650', belly: '#9aa39a' } });
    measureBar(ctx, X0, X0 + gl, gy + 120, P(t, 1.2, 2.0), '5 m', C.gw, { below: true });
    measureBar(ctx, X0 + gl + 140, X0 + 2 * gl + 140, gy + 120, P(t, 1.4, 2.2), '~5 m', C.prey, { below: true });
    text(ctx, 'GREAT WHITE', X0 + gl / 2, gy - 90, { font: '400 34px Anton', ls: 2, align: 'center', a: gIn });
    text(ctx, 'DORUDON', X0 + gl * 1.5 + 140, gy - 90, { font: '400 34px Anton', ls: 2, align: 'center', a: gIn });
    text(ctx, 'BASILOSAURUS', 1790, by - 100, { font: '400 46px Anton', ls: 2, align: 'right', a: bIn });
    S.front(ctx, t, 0.3);
  }
};
