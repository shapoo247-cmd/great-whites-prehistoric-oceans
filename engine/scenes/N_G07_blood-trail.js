// G07 · VO 4:04.4  "But blood carries. Something much bigger is coming up the trail."
import { loadVO, rel } from '../lib/vo.js';
import { P, ease, lerp, fadeEdges, slow, COL } from '../lib/doc.js';
import { lit } from '../lib/doc.js';
import { mulberry } from '../lib/core.js';
const T0 = 244.3, D = 5.2; const sc = { duration: D, out: '06_doc-style/overlays/G07_blood-carries-something-bigger', alpha: true, qscale: 20 };
let R, tBlood, tBig; const r = mulberry(7), puffs = Array.from({ length: 26 }, () => ({ u: r(), y: r() - 0.5, s: 0.6 + r() * 0.8 }));
sc.setup = async () => { await loadVO(); R = rel(T0); tBlood = R.s('blood carries', 244); tBig = R.s('much bigger', 244); sc.sfx = [{ name: 'data_blip', t: tBlood, gain: -11 }, { name: 'rumble_bed', t: tBig - 0.3, gain: -9 }, { name: 'impact_deep', t: tBig + 1.2, gain: -9 }]; };
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.5, 0.8);
  const y0 = 600, kb = P(t, tBlood - 0.1, tBlood + 1.4, ease.outCubic);   // blood trail drifts from the shark's carcass (left) to the right
  puffs.forEach(p => { const x = 1000 + p.u * 800 * kb, y = y0 + p.y * 120 + Math.sin(t * 1.3 + p.u * 9) * 14; const rr = 30 + 55 * p.s * kb; const g = ctx.createRadialGradient(x, y, 0, x, y, rr); g.addColorStop(0, `rgba(255,70,60,${0.30 * (1 - p.u * 0.5)})`); g.addColorStop(1, 'rgba(255,70,60,0)'); ctx.fillStyle = g; ctx.fillRect(x - rr, y - rr, rr * 2, rr * 2); });
  // something much bigger: a huge silhouette slides in along the trail from the far right, lost in the fog
  const u = P(t, tBig - 0.2, D - 0.6, ease.inOutQuad);
  ctx.save(); ctx.globalAlpha *= P(t, tBig - 0.3, tBig + 0.6, slow) * 0.85; lit(ctx, 'pliosaurus', { pal: 'dark', x: lerp(2250, 1500, u), y: y0 - 20, len: 1000, phase: t * 3, flip: true, blur: 2, fog: ['#07161c', 0.35] }); ctx.restore();
  ctx.save(); ctx.globalAlpha *= P(t, 0.1, 0.7, slow); lit(ctx, 'greatwhite', { pal: 'gw', x: 1060, y: y0 + 6, len: 280, phase: t * 4 }); ctx.restore();
  ctx.restore();
};
export default sc;
