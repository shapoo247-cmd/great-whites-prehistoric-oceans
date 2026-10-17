// G05 · VO 7:17.0  "No mosasaurs. No pliosaurs. The giant marine reptiles are gone, and nothing has taken their place yet."
import { loadVO, rel } from '../lib/vo.js';
import { P, ease, lerp, fadeEdges, slow, COL } from '../lib/doc.js';
import { lit } from '../lib/doc.js';
const T0 = 436.2, D = 7.9; const sc = { duration: D, out: '06_doc-style/overlays/G05_no-mosasaurs-no-pliosaurs', alpha: true, qscale: 20 };
let R, tM, tP, tGone;
sc.setup = async () => { await loadVO(); R = rel(T0); tM = R.s('no mosasaurs', 436); tP = R.s('no pliosaurs', 436); tGone = R.s('are gone', 436); sc.sfx = [{ name: 'impact_dark', t: tM + 0.1, gain: -12 }, { name: 'impact_dark', t: tP + 0.1, gain: -12 }, { name: 'whoosh_slow', t: tGone, gain: -14 }];
};
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.5, 0.9);
  const one = (name, x, y, len, tt, flip) => { const k = P(t, tt - 0.7, tt - 0.1, slow), gone = P(t, tt + 0.1, tt + 1.4, ease.inOutQuad); if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k * (1 - gone); lit(ctx, name, { pal: 'grey', x, y, len, phase: t * 3, flip, fog: ['#0b1a1c', 0.1 + gone * 0.5], blur: gone * 5 }); ctx.restore();
    if (gone > 0) for (let i = 0; i < 46; i++) { const u = (i * 0.137) % 1, px = x - len / 2 + u * len + gone * (30 + 60 * ((i * 7) % 5) / 5), py = y - 40 + ((i * 53) % 80) - gone * (60 + 80 * u), a = (1 - gone) * 0.8 * (0.4 + 0.6 * ((i * 13) % 7) / 7); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#d9ecf0'; ctx.beginPath(); ctx.arc(px, py, 2.2 + (i % 3), 0, 7); ctx.fill(); ctx.restore(); } };
  one('tylosaurus', 1350, 380, 560, tM, true); one('pliosaurus', 1350, 700, 560, tP, true);
  ctx.restore();
};
export default sc;
