// G03 · VO 5:34.4  "Both sharks peel away, bleeding, and settle at opposite ends of the carcass. Neither one wins. They split it."
import { loadVO, rel } from '../lib/vo.js';
import { P, ease, lerp, fadeEdges, slow, COL } from '../lib/doc.js';
import { drawCreature } from '../lib/creatures.js';
const T0 = 333.4, D = 4.4; const sc = { duration: D, out: '06_doc-style/overlays/G03_split-the-carcass', alpha: true, qscale: 20 };
let R, tNeither, tSplit;
sc.setup = async () => { await loadVO(); R = rel(T0); tNeither = R.s('neither one', 333); tSplit = R.s('they split', 333); sc.sfx = [{ name: 'data_blip', t: tNeither, gain: -11 }, { name: 'ui_drop', t: tSplit, gain: -8 }]; };
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.4, 0.7);
  const cx = 1460, cy = 760, k = P(t, 0.05, 0.6, slow), ks = P(t, tSplit, tSplit + 0.5, ease.outCubic);
  ctx.save(); ctx.globalAlpha *= k; ctx.fillStyle = 'rgba(255,150,130,0.85)'; ctx.shadowColor = 'rgba(255,90,70,0.8)'; ctx.shadowBlur = 20; ctx.beginPath(); ctx.roundRect(cx - 170, cy - 24, 340, 48, 24); ctx.fill(); ctx.restore();
  ctx.save(); ctx.globalAlpha *= ks; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(cx, cy - 70); ctx.lineTo(cx, cy + 70); ctx.stroke(); ctx.restore();
  const m = P(t, tNeither - 0.3, tNeither + 0.8, ease.outCubic);
  drawCreature(ctx, 'greatwhite', { x: lerp(cx - 420, cx - 330, m), y: cy, len: 230, color: 'rgba(127,227,255,0.95)', phase: t * 3, alpha: k });
  drawCreature(ctx, 'cretoxyrhina', { x: lerp(cx + 420, cx + 330, m), y: cy, len: 225, color: 'rgba(255,166,77,0.95)', phase: t * 3 + 1, flip: true, alpha: k });
  ctx.restore();
};
export default sc;
