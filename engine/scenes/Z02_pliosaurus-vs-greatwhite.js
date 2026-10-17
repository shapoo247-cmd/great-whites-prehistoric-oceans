// VO 4:17.73 -> 4:23.51: up to 12 m, skull ~2 m (longer than a man is tall)
import { stage, text, measureBar, P, ease, lerp, clamp, C, title, humanPath } from '../lib/sizecomp.js';
const T0 = 257.5, at = s => s - T0;
let S;
const ppm = 115, X0 = 170;
export default {
  duration: 7.6, out: '04_size-comparisons/Z02_pliosaurus-vs-greatwhite',
  sfx: [{ name: 'impact_deep', t: 0.15, gain: -6 }, { name: 'data_blip', t: at(257.73), gain: -8 }, { name: 'whoosh_fast', t: at(259.29), gain: -10 }, { name: 'data_blip', t: at(260.08), gain: -6 }, { name: 'ui_drop', t: at(262.13), gain: -6 }],
  setup() { S = stage('jurassic', 22); },
  draw(ctx, t) {
    S.bg(ctx, t, 0.35);
    title(ctx, t, 'SIZE CHECK', 'PLIOSAURUS vs GREAT WHITE', 0);
    const pl = 12 * ppm, gl = 5 * ppm, py = 345, gx0 = 1150, gy = 870;
    const pIn = P(t, 0.0, 0.9, ease.outCubic), gIn = P(t, 0.4, 1.3, ease.outCubic);
    const kS = P(t, at(259.29), at(259.29) + 0.6), kH = P(t, at(262.13) - 0.25, at(262.13) + 0.35);
    ctx.save(); ctx.globalAlpha = pIn;
    S.animal(ctx, 'pliosaurus', { x: X0 + pl / 2 - (1 - pIn) * 120, y: py, len: pl, phase: t * 3, colors: { back: '#1c2731', flank: '#3a4b58', belly: '#7d8f9a' } });
    ctx.restore();
    ctx.save(); ctx.globalAlpha = gIn;
    S.animal(ctx, 'greatwhite', { x: gx0 + gl / 2 + (1 - gIn) * 120, y: gy, len: gl, phase: t * 5 });
    ctx.restore();
    const pBar = py + pl * 0.27 + 14;
    measureBar(ctx, X0, X0 + pl, pBar, P(t, at(257.73), at(257.73) + 0.9), '', C.threat);
    text(ctx, 'UP TO 12 m', X0 + pl + 22, pBar + 11, { font: '800 32px Inter', ls: 2, color: C.threat, a: P(t, at(258.2), at(258.6)) });
    const gBar = gy + gl * 0.25 + 6;
    measureBar(ctx, gx0, gx0 + gl, gBar, P(t, 0.9, 1.7), '', C.gw);
    text(ctx, '5 m', gx0 + gl + 18, gBar + 11, { font: '800 30px Inter', ls: 2, color: C.gw, a: P(t, 1.4, 1.8) });
    text(ctx, 'GREAT WHITE', gx0 - 30, gy + 12, { font: '400 40px Anton', ls: 2, align: 'right', a: gIn });
    text(ctx, 'PLIOSAURUS', X0, pBar + 62, { font: '400 46px Anton', ls: 2, a: pIn });
    // skull bracket
    const sx0 = X0 + pl * 0.835, sx1 = X0 + pl, sy = py - pl * 0.055;
    if (kS > 0) {
      ctx.save(); ctx.globalAlpha = kS; ctx.strokeStyle = C.prey; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(sx0, sy + 12); ctx.lineTo(sx0, sy); ctx.lineTo(sx0 + (sx1 - sx0) * clamp(kS * 1.4), sy); if (kS > 0.7) ctx.lineTo(sx1, sy + 12); ctx.stroke(); ctx.restore();
      text(ctx, 'SKULL ~2 m', (sx0 + sx1) / 2, sy - 18, { font: '800 30px Inter', ls: 3, align: 'center', color: C.prey, a: kS });
    }
    // person (1.8 m) standing just in front of the snout
    if (kH > 0) {
      const hh = 1.8 * ppm, hx = sx1 + 120, hy = py + 95;
      ctx.save(); ctx.globalAlpha = kH * 0.95; ctx.fillStyle = '#e8f1f4'; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 10; ctx.fill(humanPath(hx, hy, hh)); ctx.restore();
      ctx.save(); ctx.globalAlpha = kH; ctx.strokeStyle = '#e8f1f4'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(hx + 50, hy); ctx.lineTo(hx + 50, hy - hh); ctx.moveTo(hx + 42, hy); ctx.lineTo(hx + 58, hy); ctx.moveTo(hx + 42, hy - hh); ctx.lineTo(hx + 58, hy - hh); ctx.stroke(); ctx.restore();
      text(ctx, '1.8 m', hx + 64, hy - hh / 2 + 8, { font: '800 24px Inter', ls: 2, a: kH });
      text(ctx, 'LONGER THAN A MAN IS TALL', hx + 20, hy + 46, { font: '800 24px Inter', ls: 4, align: 'center', color: C.prey, a: kH });
    }
    S.front(ctx, t, 0.35);
  }
};
