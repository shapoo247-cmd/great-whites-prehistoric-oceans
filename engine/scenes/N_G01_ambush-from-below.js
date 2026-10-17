// G01 · VO 3:41.2  "The great white comes straight up from below, the way it hits seals today. It connects behind the flipper."
import { loadVO, rel } from '../lib/vo.js';
import { hair, P, ease, lerp, fadeEdges, slow, COL } from '../lib/doc.js';
import { drawCreature, creaturePath } from '../lib/creatures.js';
import { lit } from '../lib/doc.js';
const T0 = 221.2, D = 6.4; const sc = { duration: D, out: '06_doc-style/overlays/G01_ambush-from-below', alpha: true, qscale: 20 };
let R, tUp, tHit;
sc.setup = async () => { await loadVO(); R = rel(T0); tUp = R.s('straight up', 221); tHit = R.s('connects', 221); sc.sfx = [{ name: 'whoosh_water', t: tUp, gain: -10 }, { name: 'impact_hit', t: tHit + 0.1, gain: -9 }]; };
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.5, 0.8);
  const k = P(t, 0.1, 0.8, slow);
  ctx.save(); ctx.globalAlpha *= 0.7 * k; ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2; ctx.beginPath(); for (let x = 1000; x <= 1800; x += 10) { const y = 250 + Math.sin(x / 40 + t * 2) * 5; x === 1000 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); ctx.restore();
  const ich = { x: 1350, y: 330, len: 640, phase: t * 3, flip: true }; ctx.save(); ctx.globalAlpha *= k; drawCreature(ctx, 'ichthyosaur', { ...ich, style: 'shaded', rim: 'rgba(200,230,240,0.5)' }); ctx.restore();
  const { map } = creaturePath('ichthyosaur', ich), fl = map(0.58, 0.07), hitp = map(0.42, 0.045);
  const u = P(t, tUp, tHit + 0.1, ease.inQuad), sy = lerp(900, hitp[1] + 70, u), sx = lerp(1250, hitp[0] - 10, u);
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 2; ctx.setLineDash([9, 9]); ctx.globalAlpha *= P(t, tUp - 0.2, tUp + 0.4); ctx.beginPath(); ctx.moveTo(1250, 900); ctx.lineTo(sx, sy); ctx.stroke(); ctx.restore();
  ctx.save(); ctx.globalAlpha *= P(t, tUp - 0.4, tUp + 0.2); lit(ctx, 'greatwhite', { pal: 'gw', x: sx, y: sy, len: 330, phase: t * 7, angle: -1.2 }); ctx.restore();
  const kh = P(t, tHit, tHit + 0.5, ease.outBack); if (kh > 0) { ctx.save(); ctx.strokeStyle = COL.bad; ctx.lineWidth = 4; ctx.shadowColor = COL.bad; ctx.shadowBlur = 16; ctx.globalAlpha = kh; ctx.beginPath(); ctx.arc(hitp[0], hitp[1], 22 * kh, 0, 7); ctx.stroke(); ctx.restore(); }
  ctx.restore();
};
export default sc;
