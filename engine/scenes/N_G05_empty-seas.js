// G05 · VO 7:17.0  "No mosasaurs. No pliosaurs. The giant marine reptiles are gone, and nothing has taken their place yet."
import { loadVO, rel } from '../lib/vo.js';
import { P, ease, lerp, fadeEdges, slow, COL } from '../lib/doc.js';
import { drawCreature } from '../lib/creatures.js';
const T0 = 436.9, D = 7.2; const sc = { duration: D, out: '06_doc-style/overlays/G05_no-mosasaurs-no-pliosaurs', alpha: true, qscale: 20 };
let R, tM, tP, tGone;
sc.setup = async () => { await loadVO(); R = rel(T0); tM = R.s('no mosasaurs', 436); tP = R.s('no pliosaurs', 436); tGone = R.s('are gone', 436); sc.sfx = [{ name: 'impact_dark', t: tM + 0.1, gain: -12 }, { name: 'impact_dark', t: tP + 0.1, gain: -12 }, { name: 'whoosh_slow', t: tGone, gain: -14 }];
};
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.5, 0.9);
  const one = (name, x, y, len, tt, flip) => { const k = P(t, tt - 0.7, tt - 0.1, slow), gone = P(t, tt + 0.1, tt + 0.9, slow); if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k * (1 - gone * 0.92); drawCreature(ctx, name, { x, y, len, color: 'rgba(255,255,255,0.85)', phase: t * 3, flip }); ctx.restore();
    if (gone > 0) { ctx.save(); ctx.globalAlpha *= gone; ctx.strokeStyle = COL.bad; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.shadowColor = COL.bad; ctx.shadowBlur = 14; ctx.beginPath(); ctx.moveTo(x - 50, y - 50); ctx.lineTo(x + 50, y + 50); ctx.moveTo(x + 50, y - 50); ctx.lineTo(x - 50, y + 50); ctx.stroke(); ctx.restore(); } };
  one('tylosaurus', 1350, 380, 560, tM, true); one('pliosaurus', 1350, 700, 560, tP, true);
  ctx.restore();
};
export default sc;
