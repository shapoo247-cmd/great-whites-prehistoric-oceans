// G04 · VO 7:09.67  "Warm-blooded, fat, and it has to surface to breathe. For a great white, it's familiar prey in a bigger package."
import { loadVO, rel } from '../lib/vo.js';
import { P, ease, lerp, fadeEdges, slow, COL } from '../lib/doc.js';
import { drawCreature } from '../lib/creatures.js';
import { lit } from '../lib/doc.js';
const T0 = 429.6, D = 7.2; const sc = { duration: D, out: 'overlays/G04_dorudon-warm-surfaces', alpha: true, qscale: 20 };
let R, tWarm, tSurf, tFam;
sc.setup = async () => { await loadVO(); R = rel(T0); tWarm = R.s('warm blooded', 429); tSurf = R.s('surface to breathe', 429); tFam = R.s('familiar prey', 429); sc.sfx = [{ name: 'data_blip', t: tWarm, gain: -11 }, { name: 'whoosh_slow', t: tSurf, gain: -13 }, { name: 'data_blip', t: tFam, gain: -10 }]; };
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.5, 0.9);
  const Y0 = 260, k = P(t, 0.1, 0.8, slow);
  ctx.save(); ctx.globalAlpha *= 0.7 * k; ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2; ctx.beginPath(); for (let x = 1050; x <= 1800; x += 10) { const y = Y0 + Math.sin(x / 40 + t * 2) * 5; x === 1050 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); ctx.restore();
  const u = P(t, tSurf - 0.2, tSurf + 2.2, ease.inOutCubic), y = lerp(640, Y0 + 40, u), kw = P(t, tWarm - 0.2, tWarm + 0.6, slow);
  if (kw > 0) { const g = ctx.createRadialGradient(1420, y, 20, 1420, y, 260); g.addColorStop(0, `rgba(255,150,80,${0.45 * kw})`); g.addColorStop(1, 'rgba(255,120,60,0)'); ctx.fillStyle = g; ctx.fillRect(1100, y - 280, 640, 560); }
  ctx.save(); ctx.globalAlpha *= k; lit(ctx, 'dorudon', { pal: 'prey', x: 1380, y, len: 560, phase: t * 3, flip: true, angle: -0.25 * (1 - u) }); ctx.restore();
  if (u > 0.85) { ctx.save(); ctx.strokeStyle = 'rgba(220,245,255,0.9)'; ctx.lineWidth = 3; for (let i = 0; i < 5; i++) { const a = (t * 1.5 + i / 5) % 1; ctx.globalAlpha = (1 - a) * 0.85 * fadeEdges(t, D, 0.5, 0.9); ctx.beginPath(); ctx.moveTo(1300 + i * 4, Y0 - 5); ctx.lineTo(1300 + i * 4 + (i - 2) * 8, Y0 - 10 - a * 90); ctx.stroke(); } ctx.restore(); }
  const kf = P(t, tFam, tFam + 0.6, slow);
  if (kf > 0) { ctx.save(); ctx.globalAlpha *= kf; lit(ctx, 'greatwhite', { pal: 'gw', x: 1120, y: 850, len: 260, phase: t * 4 }); lit(ctx, 'dorudon', { pal: 'prey', x: 1560, y: 850, len: 520, phase: t * 3, flip: true }); ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(1270, 850); ctx.lineTo(1300, 850); ctx.stroke(); ctx.restore(); }
  ctx.restore();
};
export default sc;
