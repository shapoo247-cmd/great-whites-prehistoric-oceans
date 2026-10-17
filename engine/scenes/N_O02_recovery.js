// O02 · VO 3:20.1  "The seas take about 5 million years to recover."  Lower-centre timeline fill.
import { loadVO, rel } from '../lib/vo.js';
import { cap, hair, big, veil, P, ease, lerp, fadeEdges, slow, COL } from '../lib/doc.js';
const T0 = 200.0, D = 3.6; const sc = { duration: D, out: 'overlays/O02_five-million-years-recovery', alpha: true, qscale: 20 };
let tFive;
sc.setup = async () => { await loadVO(); tFive = rel(T0).s('5 million'.replace('5', 'five'), 200); sc.sfx = [{ name: 'riser', t: tFive - 1.0, gain: -16 }, { name: 'data_blip', t: tFive + 1.2, gain: -12 }]; };
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.4, 0.6);
  veil(ctx, 460, 790, 1000, 240, 0.32);
  const x0 = 560, x1 = 1360, y = 930, k = P(t, tFive, tFive + 2.2, ease.inOutQuad);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
  ctx.strokeStyle = COL.ok; ctx.lineWidth = 5; ctx.shadowColor = COL.ok; ctx.shadowBlur = 14; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(lerp(x0, x1, k), y); ctx.stroke(); ctx.shadowBlur = 0;
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(lerp(x0, x1, k), y, 7, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(x0, y, 5, 0, 7); ctx.fill();
  big(ctx, `~${(5 * k).toFixed(1)} MILLION YEARS`, 960, 880, { size: 64, align: 'center', a: P(t, tFive - 0.1, tFive + 0.4, slow) });
    ctx.restore();
};
export default sc;
