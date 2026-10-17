// VO 0:54.19 -> 1:14.7  (2023 study ~3.5 m, short & thick, as heavy as a 4.5 m great white; armor = head & shoulders only)
import { stage, text, measureBar, P, ease, lerp, clamp, C, title } from '../lib/sizecomp.js';
const T0 = 54.19, at = s => s - T0;
let S;
const ppm = 200, X0 = 260;
export default {
  duration: 20.6, out: '04_size-comparisons/Z01_dunkleosteus-vs-greatwhite',
  sfx: [{ name: 'whoosh_water', t: 0.1, gain: -8 }, { name: 'data_blip', t: at(56.26), gain: -8 }, { name: 'whoosh_water', t: at(59.6), gain: -8 }, { name: 'data_blip', t: at(60.4), gain: -8 },
    { name: 'ui_drop', t: at(63.16), gain: -8 }, { name: 'impact_hit', t: at(69.24), gain: -10 }, { name: 'ui_drop', t: at(71.87), gain: -6 }],
  setup() { S = stage('devonian', 21); },
  draw(ctx, t) {
    S.bg(ctx, t, 0.3);
    title(ctx, t, 'SIZE CHECK', 'DUNKLEOSTEUS vs GREAT WHITE');
    const dl = 3.5 * ppm, gl = 4.5 * ppm, dy = 400, gy = 760;
    const dBar = dy + dl * 0.2 + 8, gBar = gy + gl * 0.25 + 6;
    const dIn = P(t, 0.2, 1.4, ease.outCubic);
    ctx.save(); ctx.globalAlpha = dIn;
    S.animal(ctx, 'dunkleosteus', { x: X0 + dl / 2 - (1 - dIn) * 80, y: dy, len: dl, phase: t * 4, colors: { back: '#262c20', flank: '#454e38', belly: '#7c8466', armorTop: 'rgba(58,54,40,0.8)', armorBot: 'rgba(98,92,70,0.6)' }, rim: 'rgba(210,225,170,0.5)' });
    ctx.restore();
    const ax = X0 + dl * 0.738, by = dy - dl * 0.25;
    const kA = P(t, at(69.24), at(69.24) + 0.5), kF = P(t, at(71.87), at(71.87) + 0.5);
    if (kA > 0) { ctx.save(); ctx.globalAlpha = 0.95 * kA; ctx.strokeStyle = C.prey; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ax, by + 12); ctx.lineTo(ax, by); ctx.lineTo(X0 + dl, by); ctx.lineTo(X0 + dl, by + 12); ctx.stroke(); ctx.restore(); text(ctx, 'ARMOR: HEAD & SHOULDERS', X0 + dl + 30, by + 8, { font: '800 24px Inter', ls: 3, color: C.prey, a: kA }); }
    if (kF > 0) { ctx.save(); ctx.globalAlpha = 0.95 * kF; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(X0 + dl * 0.08, by + 12); ctx.lineTo(X0 + dl * 0.08, by); ctx.lineTo(ax - 14, by); ctx.lineTo(ax - 14, by + 12); ctx.stroke(); ctx.restore(); text(ctx, 'NO ARMOR — JUST FISH', (X0 + dl * 0.08 + ax) / 2, by - 16, { font: '800 24px Inter', ls: 3, align: 'center', a: kF }); }
    measureBar(ctx, X0, X0 + dl, dBar, P(t, at(56.1), at(56.1) + 0.9), '', '#ffffff');
    text(ctx, '~3.5 m', X0 + dl + 22, dBar + 11, { font: '800 32px Inter', ls: 2, a: P(t, at(56.5), at(56.9)) });
    text(ctx, 'DUNKLEOSTEUS', X0 + dl + 60, dy - 10, { font: '400 52px Anton', ls: 2, a: dIn * (1 - kA * 0.8) });
    text(ctx, 'SHORT & THICK, LIKE A TUNA', X0 + dl + 62, dy + 30, { font: '700 21px Inter', ls: 3, a: P(t, at(57.8), at(57.8) + 0.4) * (1 - kA), color: C.prey });
    const gIn = P(t, at(59.6), at(59.6) + 1.1, ease.outCubic);
    ctx.save(); ctx.globalAlpha = gIn;
    S.animal(ctx, 'greatwhite', { x: X0 + gl / 2 - (1 - gIn) * 80, y: gy, len: gl, phase: t * 5, rim: 'rgba(200,230,180,0.5)' });
    ctx.restore();
    measureBar(ctx, X0, X0 + gl, gBar, P(t, at(60.2), at(60.2) + 0.9), '', C.gw);
    text(ctx, '4.5 m', X0 + gl + 22, gBar + 11, { font: '800 32px Inter', ls: 2, a: P(t, at(60.7), at(61.1)), color: C.gw });
    text(ctx, 'GREAT WHITE', X0 + gl + 60, gy - 10, { font: '400 52px Anton', ls: 2, a: gIn });
    text(ctx, '≈ SAME WEIGHT', X0 + gl + 62, gy + 30, { font: '800 22px Inter', ls: 4, a: P(t, at(60.6), at(61.1)), color: C.gw });
    // "on paper slightly bigger": highlight the extra metre on the great white's bar
    const kP = P(t, at(63.16), at(63.16) + 0.6);
    if (kP > 0) {
      const x1 = X0 + dl, x2 = X0 + gl;
      ctx.save(); ctx.globalAlpha = kP; ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2; ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.moveTo(x1, dBar); ctx.lineTo(x1, gBar); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.gw; ctx.shadowColor = C.gw; ctx.shadowBlur = 16; ctx.fillRect(x1, gBar - 5, (x2 - x1) * clamp(kP * 1.5), 10); ctx.restore();
      text(ctx, '+1 m', (x1 + x2) / 2, gBar - 20, { font: '800 30px Inter', ls: 2, align: 'center', color: C.gw, a: kP });
    }
    S.front(ctx, t, 0.3);
  }
};
