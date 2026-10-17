// G02 · VO 3:52.96  "Ichthyosaurs breathe air. Sooner or later, every one of them has to come up, and a shark waiting in the dark below gets the first strike."
import { loadVO, rel } from '../lib/vo.js';
import { P, ease, lerp, fadeEdges, slow, COL } from '../lib/doc.js';
import { lit } from '../lib/doc.js';
const T0 = 232.9, D = 8.6; const sc = { duration: D, out: '06_doc-style/overlays/G02_air-breathers-must-surface', alpha: true, qscale: 20 };
let R, tAir, tUp, tWait;
sc.setup = async () => { await loadVO(); R = rel(T0); tAir = R.s('breathe air', 232); tUp = R.s('has to come up', 232); tWait = R.s('waiting in the dark', 232); sc.sfx = [{ name: 'data_blip', t: tAir, gain: -11 }, { name: 'whoosh_slow', t: tUp, gain: -13 }, { name: 'impact_dark', t: tWait + 0.5, gain: -11 }]; };
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.5, 0.9);
  const X0 = 1250, X1 = 1800, Y0 = 170, Y1 = 900;
  const g = ctx.createLinearGradient(0, Y0, 0, Y1); g.addColorStop(0, 'rgba(120,200,255,0.18)'); g.addColorStop(1, 'rgba(0,0,0,0.55)'); ctx.fillStyle = g; ctx.globalAlpha *= P(t, 0.1, 0.8, slow); ctx.fillRect(X0, Y0, X1 - X0, Y1 - Y0);
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X0 - 30, Y0); ctx.lineTo(X1 + 30, Y0); ctx.stroke(); ctx.globalAlpha = 1;
  // shark waits in the dark at the bottom (eye glint)
  const ks = P(t, tWait - 0.3, tWait + 0.6, slow); ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.5, 0.9) * ks; lit(ctx, 'greatwhite', { pal: 'gw', x: 1520, y: Y1 - 80, len: 350, phase: t * 3 }); ctx.restore();
  // ichthyosaur rises to the surface, takes a breath
  const u = P(t, tUp - 0.2, tUp + 2.6, ease.inOutCubic), ky = lerp(Y1 - 360, Y0 + 60, u), kin = P(t, tAir - 0.3, tAir + 0.5, slow);
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.5, 0.9) * kin; lit(ctx, 'ichthyosaur', { pal: 'prey', x: 1520, y: ky, len: 300, phase: t * 4, angle: -0.9 * (1 - u) - 0.2 }); ctx.restore();
  if (u > 0.9) { ctx.save(); ctx.strokeStyle = 'rgba(220,245,255,0.85)'; ctx.lineWidth = 2.5; for (let i = 0; i < 4; i++) { const a = (t * 1.4 + i / 4) % 1; ctx.globalAlpha = (1 - a) * 0.8 * fadeEdges(t, D, 0.5, 0.9); ctx.beginPath(); ctx.arc(1590 + i * 6, Y0 - 10 - a * 60, 5 + a * 8, 0, 7); ctx.stroke(); } ctx.restore(); }
  ctx.restore();
};
export default sc;
