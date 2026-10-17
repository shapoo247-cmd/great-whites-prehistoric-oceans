// G03 · VO 5:34.4  "Both sharks peel away, bleeding, and settle at opposite ends of the carcass. Neither one wins. They split it."
import { loadVO, rel } from '../lib/vo.js';
import { P, ease, lerp, fadeEdges, slow, COL } from '../lib/doc.js';
import { lit } from '../lib/doc.js';
const T0 = 333.4, D = 4.4; const sc = { duration: D, out: 'overlays/G03_split-the-carcass', alpha: true, qscale: 20 };
let R, tNeither, tSplit;
sc.setup = async () => { await loadVO(); R = rel(T0); tNeither = R.s('neither one', 333); tSplit = R.s('they split', 333); sc.sfx = [{ name: 'data_blip', t: tNeither, gain: -11 }, { name: 'ui_drop', t: tSplit, gain: -8 }]; };
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.4, 0.7);
  const cx = 1330, cy = 720, k = P(t, 0.05, 0.6, slow), ks = P(t, tSplit, tSplit + 0.5, ease.outCubic);
  for (let i = 0; i < 14; i++) { const px = cx - 170 + i * 26 + Math.sin(t * 1.2 + i) * 10, py = cy + Math.sin(t * 1.6 + i * 1.7) * 18, r = 40 + (i % 4) * 14; const g = ctx.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, `rgba(255,70,60,${0.28 * k})`); g.addColorStop(1, 'rgba(255,70,60,0)'); ctx.fillStyle = g; ctx.fillRect(px - r, py - r, r * 2, r * 2); }
  ctx.save(); ctx.globalAlpha *= k; lit(ctx, 'tylosaurus', { pal: 'threat', x: cx, y: cy + 6, len: 560, phase: 0, amp: 0, angle: 0.07, flip: true }); ctx.restore();
  ctx.save(); ctx.globalAlpha *= ks; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(cx, cy - 70); ctx.lineTo(cx, cy + 70); ctx.stroke(); ctx.restore();
  const m = P(t, tNeither - 0.3, tNeither + 0.8, ease.outCubic);
  lit(ctx, 'greatwhite', { pal: 'gw', x: lerp(cx - 560, cx - 470, m), y: cy, len: 330, phase: t * 3, alpha: k });
  lit(ctx, 'cretoxyrhina', { pal: 'rival', x: lerp(cx + 560, cx + 470, m), y: cy, len: 320, phase: t * 3 + 1, flip: true, alpha: k });
  ctx.restore();
};
export default sc;
