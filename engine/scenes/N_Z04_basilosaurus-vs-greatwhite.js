// Z04 · VO 7:36.08  "A whale too, but serpent-shaped and 15 to 18 meters long." (+ great white and Dorudon for scale)
import { loadVO, rel } from '../lib/vo.js';
import { stage, cap, hair, big, measure, P, ease, lerp, clamp, slow, COL } from '../lib/sizecomp2.js';
const T0 = 455.8, D = 4.9; const sc = { duration: D, out: 'size-comparisons/Z04_basilosaurus-vs-greatwhite-vs-dorudon' };
let S, R, t15; const ppm = 92, X0 = 130;
sc.setup = async () => { await loadVO(); R = rel(T0); S = stage('eocene', 24); t15 = R.s('fifteen', 455);
  sc.sfx = [{ name: 'whoosh_slow', t: 0.1, gain: -8 }, { name: 'impact_deep', t: t15, gain: -9 }, { name: 'data_blip', t: t15 + 0.3, gain: -9 }]; };
sc.draw = (ctx, t) => {
  S.bg(ctx, t, D);
  const bl = 17.5 * ppm, gl = 5 * ppm, by = 470, gy = 800, bIn = P(t, 0.1, 1.6, ease.outCubic), gIn = P(t, 0.6, 1.6, ease.outCubic);
  S.animal(ctx, 'basilosaurus', { x: X0 + bl / 2 - (1 - bIn) * 400, y: by, len: bl, phase: t * 3, alpha: bIn, colors: { back: '#222c2a', flank: '#43524c', belly: '#8b978f' } });
  const k15 = P(t, t15 - 0.3, t15 + 0.8), k18 = P(t, t15 + 0.5, t15 + 1.2);
  measure(ctx, X0, X0 + 15 * ppm, by + 90, k15, '', '#fff'); if (k18 > 0) measure(ctx, X0 + 15 * ppm, X0 + 18 * ppm, by + 90, k18, '', '#fff', { dash: [8, 6] });
  big(ctx, '15–18 m', X0 + 16.5 * ppm, by + 170, { size: 64, align: 'center', a: k15 });
  cap(ctx, 'BASILOSAURUS', 1790, by - 120, { align: 'right', font: '500 26px Inter', ls: 12, a: bIn });   S.animal(ctx, 'greatwhite', { x: X0 + gl / 2, y: gy, len: gl, phase: t * 5, alpha: gIn });
  S.animal(ctx, 'dorudon', { x: X0 + gl + 160 + gl / 2, y: gy + 10, len: gl, phase: t * 4, alpha: gIn, colors: { back: '#2a302c', flank: '#4c5650', belly: '#9aa39a' } });
  measure(ctx, X0, X0 + gl, gy + 110, P(t, 1.2, 2.0), '', COL.gw); big(ctx, '5 m', X0 + gl / 2, gy + 190, { size: 46, align: 'center', color: COL.gw, a: P(t, 1.6, 2.1) });
  measure(ctx, X0 + gl + 160, X0 + 2 * gl + 160, gy + 110, P(t, 1.4, 2.2), '', COL.gold); big(ctx, '~5 m', X0 + gl * 1.5 + 160, gy + 190, { size: 46, align: 'center', color: COL.gold, a: P(t, 1.8, 2.3) });
  cap(ctx, 'GREAT WHITE', X0 + gl / 2, gy - 140, { align: 'center', font: '500 20px Inter', ls: 10, a: gIn, color: COL.gw }); cap(ctx, 'DORUDON', X0 + gl * 1.5 + 160, gy - 140, { align: 'center', font: '500 20px Inter', ls: 10, a: gIn, color: COL.gold });
};
export default sc;
