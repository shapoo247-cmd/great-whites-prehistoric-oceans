// G06 · VO 7:46.93  "It hunts calves, not sharks."
import { loadVO, rel } from '../lib/vo.js';
import { P, ease, lerp, fadeEdges, slow, COL } from '../lib/doc.js';
import { drawCreature } from '../lib/creatures.js';
const T0 = 466.8, D = 3.4; const sc = { duration: D, out: '06_doc-style/overlays/G06_hunts-calves-not-sharks', alpha: true, qscale: 20 };
let R, tCalf, tShark;
sc.setup = async () => { await loadVO(); R = rel(T0); tCalf = R.s('calves', 466); tShark = R.s('not sharks', 466); sc.sfx = [{ name: 'data_blip', t: tCalf, gain: -10 }, { name: 'impact_dark', t: tShark, gain: -10 }]; };
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.4, 0.6);
  const kc = P(t, tCalf - 0.2, tCalf + 0.5, ease.outBack), ks = P(t, tShark - 0.1, tShark + 0.5, ease.outBack), ka = P(t, 0.05, 0.6, slow);
  drawCreature(ctx, 'dorudon', { x: 1180, y: 540, len: 230, color: 'rgba(255,214,120,0.95)', phase: t * 3, flip: true, alpha: kc });
  drawCreature(ctx, 'greatwhite', { x: 1620, y: 540, len: 230, color: 'rgba(127,227,255,0.95)', phase: t * 4, alpha: ks });
  const mark = (x, y, ok, k) => { if (k <= 0) return; ctx.save(); ctx.globalAlpha *= Math.min(1, k); ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = ok ? COL.ok : COL.bad; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 16; ctx.beginPath(); if (ok) { ctx.moveTo(x - 30, y); ctx.lineTo(x - 8, y + 24); ctx.lineTo(x + 34, y - 26); } else { ctx.moveTo(x - 28, y - 28); ctx.lineTo(x + 28, y + 28); ctx.moveTo(x + 28, y - 28); ctx.lineTo(x - 28, y + 28); } ctx.stroke(); ctx.restore(); };
  mark(1180, 720, true, kc); mark(1620, 720, false, ks);
  ctx.restore();
};
export default sc;
