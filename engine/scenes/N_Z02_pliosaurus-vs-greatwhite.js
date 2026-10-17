// Z02 · VO 4:17.5  Pliosaurus up to 12 m, skull ~2 m from snout to back, longer than a man is tall.
import { loadVO, rel } from '../lib/vo.js';
import { stage, cap, hair, big, measure, P, ease, lerp, clamp, slow, COL, drawCreature, humanPath } from '../lib/sizecomp2.js';
const T0 = 257.5, D = 7.8; const sc = { duration: D, out: '06_doc-style/size-comparisons/Z02_pliosaurus-vs-greatwhite' };
let S, R, t12, tSkull, tMan; const ppm = 115, X0 = 170;
sc.setup = async () => { await loadVO(); R = rel(T0); S = stage('jurassic', 22); t12 = R.s('twelve', 257); tSkull = R.s('skull', 257); tMan = R.s('longer than', 258);
  sc.sfx = [{ name: 'impact_deep', t: 0.15, gain: -7 }, { name: 'data_blip', t: t12, gain: -9 }, { name: 'whoosh_fast', t: tSkull, gain: -11 }, { name: 'ui_drop', t: tMan, gain: -8 }]; };
sc.draw = (ctx, t) => {
  S.bg(ctx, t, D);
  const pl = 12 * ppm, gl = 5 * ppm, py = 345, gx0 = 1180, gy = 800, pIn = P(t, 0, 0.9, ease.outCubic), gIn = P(t, 0.4, 1.3, ease.outCubic);
  ctx.save(); ctx.globalAlpha = pIn; S.animal(ctx, 'pliosaurus', { x: X0 + pl / 2 - (1 - pIn) * 120, y: py, len: pl, phase: t * 3 }); ctx.restore();
  ctx.save(); ctx.globalAlpha = gIn; S.animal(ctx, 'greatwhite', { x: gx0 + gl / 2 + (1 - gIn) * 120, y: gy, len: gl, phase: t * 5 }); ctx.restore();
  const pBar = 110, gBar = gy + gl * 0.25 + 12;
  measure(ctx, X0, X0 + pl, pBar, P(t, t12 - 0.1, t12 + 1.0), 'UP TO 12 m', COL.bad, { lx: X0 + pl + 24 });
  cap(ctx, 'PLIOSAURUS', X0, pBar - 34, { font: '500 24px Inter', ls: 12, a: pIn });
  measure(ctx, gx0, gx0 + gl, gBar, P(t, 0.9, 1.7), '5 m', COL.gw, { lx: gx0 + gl + 24 }); cap(ctx, 'GREAT WHITE', gx0 - 30, gy + 8, { align: 'right', font: '500 24px Inter', ls: 12, a: gIn, color: COL.gw }); void ( {});
  const sx0 = X0 + pl * 0.835, sx1 = X0 + pl, sy = py - pl * 0.055, kS = P(t, tSkull, tSkull + 0.6);
  if (kS > 0) { ctx.save(); ctx.globalAlpha = kS; ctx.strokeStyle = COL.gold; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(sx0, sy + 12); ctx.lineTo(sx0, sy); ctx.lineTo(sx0 + (sx1 - sx0) * clamp(kS * 1.4), sy); if (kS > 0.7) ctx.lineTo(sx1, sy + 12); ctx.stroke(); ctx.restore(); big(ctx, 'SKULL ~2 m', (sx0 + sx1) / 2, sy - 22, { size: 48, align: 'center', a: kS, color: COL.gold }); }
  const kH = P(t, tMan - 0.1, tMan + 0.6);
  if (kH > 0) { const hh = 1.8 * ppm, hx = sx1 + 130, hy = py + 100; ctx.save(); ctx.globalAlpha = kH * 0.95; ctx.fillStyle = '#e8f1f4'; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 10; ctx.fill(humanPath(hx, hy, hh)); ctx.strokeStyle = '#e8f1f4'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(hx + 50, hy); ctx.lineTo(hx + 50, hy - hh); ctx.moveTo(hx + 42, hy); ctx.lineTo(hx + 58, hy); ctx.moveTo(hx + 42, hy - hh); ctx.lineTo(hx + 58, hy - hh); ctx.stroke(); ctx.restore();
    cap(ctx, '1.8 m', hx + 70, hy - hh / 2 + 8, { font: '500 20px Inter', ls: 6, a: kH }); }
};
export default sc;
