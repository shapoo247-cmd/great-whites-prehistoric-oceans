// G08 · VO 4:09.8  "Then jaws close on the carcass, one body-length from the shark. The great white lets go."
import { loadVO, rel } from '../lib/vo.js';
import { P, ease, lerp, fadeEdges, slow, COL } from '../lib/doc.js';
import { lit } from '../lib/doc.js';
const T0 = 249.8, D = 5.6; const sc = { duration: D, out: 'overlays/G08_jaws-close-great-white-lets-go', alpha: true, qscale: 20 };
let R, tJaws, tLet;
sc.setup = async () => { await loadVO(); R = rel(T0); tJaws = R.s('jaws close', 249); tLet = R.s('lets go', 249); sc.sfx = [{ name: 'impact_deep', t: tJaws + 0.15, gain: -4 }, { name: 'impact_hit', t: tJaws + 0.2, gain: -8 }, { name: 'whoosh_water', t: tLet, gain: -11 }]; };
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.4, 0.8);
  const cx = 1340, cy = 600, k = P(t, 0.05, 0.6, slow), ang = lerp(0.62, 0.02, P(t, tJaws - 0.1, tJaws + 0.18, ease.inQuad));
  for (let i = 0; i < 12; i++) { const px = cx - 150 + i * 28, py = cy + Math.sin(t * 1.4 + i * 1.3) * 16, r = 40 + (i % 3) * 14; const g = ctx.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, `rgba(255,70,60,${0.26 * k})`); g.addColorStop(1, 'rgba(255,70,60,0)'); ctx.fillStyle = g; ctx.fillRect(px - r, py - r, r * 2, r * 2); }
  ctx.save(); ctx.globalAlpha *= k; lit(ctx, 'ichthyosaur', { pal: 'prey', x: cx, y: cy + 4, len: 420, phase: 0, amp: 0, flip: true, angle: 0.1 }); ctx.restore();
  // Pliosaurus lunges in from the right and its jaws land on the carcass
  const lunge = P(t, tJaws - 0.5, tJaws + 0.1, ease.inQuad), px = lerp(cx + 1000, cx + 640, lunge);
  lit(ctx, 'pliosaurus', { pal: 'dark', x: px, y: cy - 4, len: 1200, phase: t * 3, flip: true, fog: ['#07161c', 0.12] });
  const fl = Math.exp(-Math.max(0, t - tJaws - 0.1) * 5) * P(t, tJaws, tJaws + 0.05);
  if (fl > 0.02) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(cx + 120, cy, 0, cx + 120, cy, 280); g.addColorStop(0, `rgba(255,120,90,${0.6 * fl})`); g.addColorStop(1, 'rgba(255,90,60,0)'); ctx.fillStyle = g; ctx.fillRect(cx - 200, cy - 300, 640, 600); ctx.restore(); }
  // great white one body-length away, then lets go (backs off)
  const back = P(t, tLet - 0.1, tLet + 1.2, ease.inOutCubic), gx = lerp(cx - 560, cx - 860, back);
  ctx.save(); ctx.globalAlpha *= k; lit(ctx, 'greatwhite', { pal: 'gw', x: gx, y: cy + 4, len: 330, phase: t * 5 }); ctx.restore();
  // one body-length bracket
  const kb = P(t, tJaws + 0.3, tJaws + 0.9, slow) * (1 - back); if (kb > 0) { ctx.save(); ctx.globalAlpha *= kb; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; const x1 = gx + 165, x2 = cx - 165; ctx.beginPath(); ctx.moveTo(x1, cy + 90); ctx.lineTo(x2, cy + 90); ctx.moveTo(x1, cy + 78); ctx.lineTo(x1, cy + 102); ctx.moveTo(x2, cy + 78); ctx.lineTo(x2, cy + 102); ctx.stroke(); ctx.restore(); }
  ctx.restore();
};
export default sc;
