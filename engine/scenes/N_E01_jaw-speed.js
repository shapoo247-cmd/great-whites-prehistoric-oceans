// E01 · VO 0:18.0 -> 0:25.4  "Its jaws snap open in about a fiftieth of a second, fast enough to suck prey straight in."
import { loadVO, rel } from '../lib/vo.js';
import { cap, hair, big, veil, P, ease, lerp, fadeEdges, slow, COL } from '../lib/doc.js';
import { mulberry } from '../lib/core.js';
const T0 = 18.0, D = 7.4; const sc = { duration: D, out: '06_doc-style/overlays/E01_jaw-speed', alpha: true, qscale: 20 };
let R, tSnap, tFifth, tSuck; const rnd = mulberry(3), parts = Array.from({ length: 46 }, () => ({ a: rnd() * 6.28, r: 0.3 + rnd() * 0.7, o: rnd() }));
sc.setup = async () => { await loadVO(); R = rel(T0); tSnap = R.s('snap open'); tFifth = R.s('fiftieth'); tSuck = R.s('suck prey');
  sc.sfx = [{ name: 'impact_hit', t: tSnap, gain: -10 }, { name: 'whoosh_fast', t: tSnap - 0.05, gain: -10 }, { name: 'whoosh_water', t: tSuck, gain: -12 }]; };
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.5, 0.7);
  veil(ctx, 1000, 180, 900, 700, 0.3);
  // jaws: hinge at (1130,540); closed until snap, then opens fast (a fiftieth of a second) and stays open while prey is sucked in
  const open = P(t, tSnap, tSnap + 0.12, ease.outExpo) * (1 - P(t, tSuck + 1.6, tSuck + 1.9, ease.inQuad));
  const hx = 1560, hy = 430, L = 320, ang = 0.5 * open;
  // gape glow (behind jaws)
  if (open > 0.02) { const g = ctx.createRadialGradient(hx - 120, hy, 0, hx - 120, hy, 260); g.addColorStop(0, `rgba(160,235,255,${0.5 * open})`); g.addColorStop(1, 'rgba(160,235,255,0)'); ctx.fillStyle = g; ctx.fillRect(hx - 480, hy - 300, 620, 600); }
  // two bony jaw plates hinged at the right, closing leftwards; teeth-like blades along the edge
  for (const sgn of [-1, 1]) {
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(sgn * ang); ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 14;
    const gr = ctx.createLinearGradient(0, 0, -L, sgn * 40); gr.addColorStop(0, 'rgba(235,240,230,0.95)'); gr.addColorStop(1, 'rgba(160,170,150,0.9)');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-L, sgn * 4); ctx.lineTo(-L, sgn * 34); ctx.quadraticCurveTo(-L * 0.5, sgn * 62, 0, sgn * 46); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.95)'; for (let i = 0; i < 9; i++) { const x = -40 - i * 31; ctx.beginPath(); ctx.moveTo(x, sgn * 5); ctx.lineTo(x - 11, sgn * 5); ctx.lineTo(x - 5, sgn * -14); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  }
  // suction: particles converge into the mouth
  const sk = P(t, tSuck - 0.2, tSuck + 0.5, slow) * (1 - P(t, tSuck + 1.8, tSuck + 2.3));
  if (sk > 0) parts.forEach(p => {
    const u = (((t - tSuck) * 0.7 + p.o) % 1 + 1) % 1, r = (1 - u) ** 1.6 * (150 + 300 * p.r), x = hx - 60 - Math.cos(p.a * 0.5) * r, y = hy + Math.sin(p.a) * r * 0.65 * (0.4 + 0.6 * (1 - u));
    ctx.save(); ctx.globalAlpha *= sk * (0.2 + 0.7 * u); ctx.fillStyle = '#d6f6ff'; ctx.beginPath(); ctx.ellipse(x, y, 2 + 18 * u * 0.5, 1.8, Math.atan2(hy - y, hx - 60 - x), 0, 7); ctx.fill(); ctx.restore();
  });
  // 1/50 s readout
  const ka = P(t, tFifth - 0.1, tFifth + 0.5, slow);
  big(ctx, '1/50 s', 1480, 760, { size: 130, align: 'center', a: ka });
  cap(ctx, 'JAWS SNAP OPEN', 1480, 810, { align: 'center', font: '500 22px Inter', ls: 12, a: ka, color: COL.gw });
  const ks = P(t, tSuck, tSuck + 0.6, slow); cap(ctx, 'PREY SUCKED STRAIGHT IN', 1480, 865, { align: 'center', font: '500 22px Inter', ls: 10, a: ks });
  ctx.restore();
};
export default sc;
