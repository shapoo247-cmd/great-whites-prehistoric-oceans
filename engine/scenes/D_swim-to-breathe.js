// E04 · 1:33.3  can't rest / keep swimming to breathe / warm body burns oxygen  Overlay (alpha). Three quiet words, one flowing line.
import { cap, hair, P, ease, fadeEdges, slow } from '../lib/doc.js';
import { mulberry } from '../lib/core.js';
const T0 = 93.3, at = s => s - T0, D = 12.2;
const rnd = mulberry(9), st = Array.from({ length: 22 }, () => ({ y: rnd(), o: rnd(), s: 0.5 + rnd() * 0.9, l: 80 + rnd() * 160 }));
const phrases = [[at(94.12), at(96.8), 'CAN’T REST'], [at(97.2), at(99.0), 'KEEP SWIMMING TO BREATHE'], [at(99.0), at(102.8), 'WARM BODY · MORE OXYGEN USED'], [at(103.0), at(105.5), 'DEAD ZONES SPREAD']];
export default {
  duration: D, out: '06_doc-style/E04_swim-to-breathe', alpha: true, qscale: 20,
  sfx: [{ name: 'whoosh_water', t: at(97.3), gain: -14 }, { name: 'alarm_low', t: at(103.2), gain: -16 }],
  draw(ctx, t) {
    const f = fadeEdges(t, D, 0.6, 0.6);
    ctx.save(); ctx.globalAlpha = f;
    const flow = t < at(94.12) ? 1 : t < at(97.0) ? 1 - P(t, at(94.12), at(94.8)) : P(t, at(97.0), at(97.8));
    // water streaks (breathing) across the lower third, speed follows swimming
    const y0 = 820;
    st.forEach(s => {
      const x = (((s.o - t * 0.16 * s.s * flow) % 1) + 1) % 1, xx = 140 + x * 1640, yy = y0 + s.y * 90 - 45;
      ctx.save(); ctx.strokeStyle = 'rgba(200,240,255,0.55)'; ctx.globalAlpha *= 0.15 + 0.45 * flow; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx + s.l * (0.3 + flow * 0.7), yy); ctx.stroke(); ctx.restore();
    });
    // one phrase at a time
    phrases.forEach(([a, b, s]) => {
      const k = Math.min(P(t, a, a + 0.6, slow), 1 - P(t, b - 0.5, b, slow));
      if (k > 0) cap(ctx, s, 140, 770 - (1 - k) * -8, { a: k, font: '500 24px Inter', ls: 8, color: s === 'DEAD ZONES SPREAD' ? '#ff9a8e' : undefined });
    });
    // oxygen thin line sinking as dead zones spread
    const k = P(t, at(103.0), at(105.4), ease.inOutQuad);
    if (k > 0) { hair(ctx, 140, 900, 140 + 520 * (1 - k * 0.9), 900, 1, 0.8, '#ff9a8e'); cap(ctx, 'OXYGEN', 140, 930, { font: '500 16px Inter', ls: 6, a: 0.7 }); }
    ctx.restore();
  }
};
