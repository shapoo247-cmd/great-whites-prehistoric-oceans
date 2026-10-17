// F02 · VO 5:50.0  "Its teeth have been found embedded in mosasaur backbones."
import { loadVO, rel } from '../lib/vo.js';
import { cap, hair, big, veil, P, ease, fadeEdges, slow, COL } from '../lib/doc.js';
import { vertebra, tooth } from '../lib/props.js';
const T0 = 349.9, D = 4.6; const sc = { duration: D, out: '06_doc-style/overlays/F02_teeth-in-mosasaur-backbones', alpha: true, qscale: 20 };
let R, tT, tB;
sc.setup = async () => { await loadVO(); R = rel(T0); tT = R.s('its teeth', 349); tB = R.s('mosasaur backbones', 349); sc.sfx = [{ name: 'data_blip', t: tT, gain: -12 }, { name: 'impact_hit', t: tB - 0.1, gain: -16 }]; };
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.5, 0.7);
  veil(ctx, 1000, 280, 900, 560, 0.34);
  const kb = P(t, 0.1, 0.8, ease.outCubic);
  for (let i = 0; i < 6; i++) vertebra(ctx, 1160 + i * 120, 600 + Math.sin(i * 0.6) * 24, 52, Math.sin(i * 0.6 - 0.4) * 0.3, kb);
  const kt = P(t, tT, tT + 0.5, ease.outBack), x = 1160 + 3 * 120, y = 600 + Math.sin(1.8) * 24;
  tooth(ctx, x + 6, y - 18, 78 * kt, -0.3, 1, P(t, tB - 0.3, tB + 0.4) * (0.7 + 0.3 * Math.sin(t * 6)));
      ctx.restore();
};
export default sc;
