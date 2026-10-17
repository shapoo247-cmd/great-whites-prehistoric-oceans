// F04 · VO 7:40.8  "One was found with at least two young Dorudon in its stomach, and calf skulls here carry its bite marks."
import { loadVO, rel } from '../lib/vo.js';
import { cap, hair, big, veil, P, ease, lerp, fadeEdges, slow, COL } from '../lib/doc.js';
import { drawCreature, creaturePath } from '../lib/creatures.js';
import { skull, puncture } from '../lib/props.js';
const T0 = 460.7, D = 6.3; const sc = { duration: D, out: '06_doc-style/overlays/F04_basilosaurus-stomach-and-bite-marks', alpha: true, qscale: 20 };
let R, tTwo, tSk;
sc.setup = async () => { await loadVO(); R = rel(T0); tTwo = R.s('two young', 460); tSk = R.s('calf skulls', 460); sc.sfx = [{ name: 'data_blip', t: tTwo, gain: -11 }, { name: 'data_blip', t: tTwo + 0.4, gain: -12 }, { name: 'impact_hit', t: tSk + 0.5, gain: -16 }]; };
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.5, 0.8);
  veil(ctx, 700, 540, 1200, 480, 0.34);
  const o = { x: 1180, y: 700, len: 1100, flip: true, phase: t * 2 }; drawCreature(ctx, 'basilosaurus', { ...o, style: 'shaded', fog: ['#0b1a1c', 0.1], rim: 'rgba(200,230,240,0.5)' });
  const { map } = creaturePath('basilosaurus', o), st = map(0.55, 0.0);
  const kw = P(t, tTwo - 0.4, tTwo + 0.3, slow);
  ctx.save(); ctx.globalAlpha *= kw; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.setLineDash([7, 7]); ctx.beginPath(); ctx.ellipse(st[0], st[1], 120, 46, 0, 0, 7); ctx.stroke(); ctx.restore();
  for (let i = 0; i < 2; i++) { ctx.save(); ctx.globalAlpha *= P(t, tTwo + i * 0.4, tTwo + 0.5 + i * 0.4, slow); drawCreature(ctx, 'dorudon', { x: st[0] - 40 + i * 80, y: st[1] + 2 - i * 3, len: 100, color: 'rgba(255,214,120,0.95)', phase: 0, angle: i ? 0.12 : -0.1 }); ctx.restore(); }
  cap(ctx, 'AT LEAST 2 YOUNG DORUDON INSIDE', st[0], st[1] - 120, { align: 'center', font: '500 22px Inter', ls: 8, a: P(t, tTwo, tTwo + 0.6, slow) * (1 - P(t, tSk - 0.2, tSk + 0.4)), color: COL.gold });
  // calf skulls with bite marks
  const ks = P(t, tSk, tSk + 0.6, slow);
  if (ks > 0) { for (let i = 0; i < 2; i++) { const x = 1330 + i * 230, y = 330 + i * 40; skull(ctx, x, y, 60, ks);
      puncture(ctx, x + 30, y - 38, 8, P(t, tSk + 0.5 + i * 0.1, tSk + 0.8 + i * 0.1)); puncture(ctx, x + 66, y - 28, 8, P(t, tSk + 0.6 + i * 0.1, tSk + 0.9 + i * 0.1)); puncture(ctx, x + 8, y + 32, 8, P(t, tSk + 0.7 + i * 0.1, tSk + 1.0 + i * 0.1)); }
    cap(ctx, 'CALF SKULLS · BITE MARKS', 1480, 450, { align: 'center', font: '500 22px Inter', ls: 8, a: ks, color: COL.gold }); }
  ctx.restore();
};
export default sc;
