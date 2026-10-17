// F05 · VO 7:52.8  "Mixed in with its bones were shark teeth. When this giant died, sharks ate it."
import { loadVO, rel } from '../lib/vo.js';
import { cap, hair, big, veil, P, ease, fadeEdges, slow, COL } from '../lib/doc.js';
import { bone, vertebra, tooth } from '../lib/props.js';
import { mulberry } from '../lib/core.js';
const T0 = 472.7, D = 5.4; const sc = { duration: D, out: '06_doc-style/overlays/F05_shark-teeth-among-bones', alpha: true, qscale: 20 };
let R, tTeeth, tAte; const r = mulberry(12);
const bones = Array.from({ length: 6 }, (_, i) => ({ x: 1180 + (i % 3) * 260 + r() * 40, y: 430 + Math.floor(i / 3) * 210 + r() * 40, l: 300 + r() * 120, a: -0.5 + r() * 1.0 }));
const teeth = Array.from({ length: 5 }, () => ({ x: 1220 + r() * 560, y: 400 + r() * 330, rot: r() * 6.28, h: 62 + r() * 20 }));
sc.setup = async () => { await loadVO(); R = rel(T0); tTeeth = R.s('shark teeth', 472); tAte = R.s('sharks ate', 472); sc.sfx = [{ name: 'data_blip', t: tTeeth, gain: -12 }, ...teeth.map((_, i) => ({ name: 'ui_tick', t: tTeeth + 0.1 + i * 0.16, gain: -14 }))]; };
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.5, 0.7);
  veil(ctx, 1000, 280, 900, 560, 0.34);
  bones.forEach((b, i) => bone(ctx, b.x, b.y, b.l, b.a, P(t, 0.1 + i * 0.07, 0.7 + i * 0.07, ease.outCubic)));
  vertebra(ctx, 1560, 700, 62, 0.4, P(t, 0.4, 1.0)); vertebra(ctx, 1400, 780, 58, -0.3, P(t, 0.5, 1.1));
  teeth.forEach((x, i) => tooth(ctx, x.x, x.y, x.h, x.rot, P(t, tTeeth + i * 0.16, tTeeth + 0.35 + i * 0.16, ease.outBack), 0.6 + 0.4 * Math.sin(t * 5 + i)));
      ctx.restore();
};
export default sc;
