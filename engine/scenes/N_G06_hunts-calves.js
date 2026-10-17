// G06 · VO 7:46.93  "It hunts calves, not sharks."
import { loadVO, rel } from '../lib/vo.js';
import { P, ease, lerp, fadeEdges, slow, COL } from '../lib/doc.js';
import { lit } from '../lib/doc.js';
const T0 = 466.8, D = 3.4; const sc = { duration: D, out: 'overlays/G06_hunts-calves-not-sharks', alpha: true, qscale: 20 };
let R, tCalf, tShark;
sc.setup = async () => { await loadVO(); R = rel(T0); tCalf = R.s('calves', 466); tShark = R.s('not sharks', 466); sc.sfx = [{ name: 'data_blip', t: tCalf, gain: -10 }, { name: 'impact_dark', t: tShark, gain: -10 }]; };
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.4, 0.6);
  const kc = P(t, tCalf - 0.2, tCalf + 0.5, ease.outBack), ks = P(t, tShark - 0.1, tShark + 0.5, ease.outBack), ka = P(t, 0.05, 0.6, slow);
  lit(ctx, 'dorudon', { pal: 'prey', x: 1150, y: 540, len: 380, phase: t * 3, flip: true, alpha: kc });
  lit(ctx, 'greatwhite', { pal: 'gw', x: 1640, y: 540, len: 380, phase: t * 4, alpha: ks * (1 - 0.55 * P(t, tShark + 0.3, tShark + 0.9)), fog: ['#0b1a1c', 0.1 + 0.5 * P(t, tShark + 0.3, tShark + 0.9)] });
  // target reticle locks on the calf, not on the shark
  if (kc > 0) { ctx.save(); ctx.globalAlpha *= Math.min(1, kc); ctx.strokeStyle = 'rgba(255,220,140,0.95)'; ctx.lineWidth = 2.5; ctx.shadowColor = '#ffd36a'; ctx.shadowBlur = 16; const r = 150 - 20 * Math.min(1, kc); ctx.beginPath(); ctx.arc(1180, 540, r, 0, 7); ctx.stroke(); for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + t * 0.6; ctx.beginPath(); ctx.moveTo(1180 + Math.cos(a) * (r - 14), 540 + Math.sin(a) * (r - 14)); ctx.lineTo(1180 + Math.cos(a) * (r + 16), 540 + Math.sin(a) * (r + 16)); ctx.stroke(); } ctx.restore(); }
  ctx.restore();
};
export default sc;
