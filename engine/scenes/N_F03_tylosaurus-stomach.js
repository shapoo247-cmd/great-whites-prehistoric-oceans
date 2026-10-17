// F03 · VO 6:14.6  "One was found with a plesiosaur in its stomach. Another may have eaten a shark."
import { loadVO, rel } from '../lib/vo.js';
import { cap, hair, big, veil, P, ease, lerp, fadeEdges, slow, COL } from '../lib/doc.js';
import { drawCreature, creaturePath } from '../lib/creatures.js';
import { plesiosaur } from '../lib/props.js';
import { lit } from '../lib/doc.js';
const T0 = 374.4, D = 6.2; const sc = { duration: D, out: 'overlays/F03_tylosaurus-stomach', alpha: true, qscale: 20 };
let R, tP, tS;
sc.setup = async () => { await loadVO(); R = rel(T0); tP = R.s('plesiosaur', 374); tS = R.s('eaten a shark', 374); sc.sfx = [{ name: 'data_blip', t: tP, gain: -11 }, { name: 'impact_dark', t: tS, gain: -14 }]; };
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.5, 0.8);
  veil(ctx, 960, 560, 960, 460, 0.34);
  const o = { x: 1450, y: 760, len: 880, flip: true, phase: t * 2.4 };
  drawCreature(ctx, 'tylosaurus', { ...o, style: 'shaded', fog: ['#0b1a1c', 0.1], rim: 'rgba(200,230,240,0.5)' });
  const { map } = creaturePath('tylosaurus', o), st = map(0.55, 0.0);
  // stomach window
  const kw = P(t, tP - 0.4, tP + 0.4, slow);
  ctx.save(); ctx.globalAlpha *= kw; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.setLineDash([7, 7]); ctx.beginPath(); ctx.ellipse(st[0], st[1], 140, 62, 0, 0, 7); ctx.stroke(); ctx.restore();
  plesiosaur(ctx, st[0], st[1] + 4, 150, 'rgba(255,214,120,0.95)', P(t, tP, tP + 0.5, slow) * (1 - P(t, tS - 0.2, tS + 0.4)));
  // "may have": a dashed shark outline (uncertain)
  const ks = P(t, tS, tS + 0.6, slow); if (ks > 0) { ctx.save(); ctx.globalAlpha *= ks * 0.8; lit(ctx, 'greatwhite', { pal: 'prey', x: st[0], y: st[1] + 4, len: 200, phase: 0, amp: 0 }); ctx.restore(); }
  const l1 = P(t, tP - 0.1, tP + 0.5, slow) * (1 - P(t, tS - 0.2, tS + 0.4));
      ctx.restore();
};
export default sc;
