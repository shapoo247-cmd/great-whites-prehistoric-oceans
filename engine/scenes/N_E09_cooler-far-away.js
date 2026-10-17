// E09 · VO 3:03.7  "Cooler water exists far to the north and south. But it's a long swim through empty sea, and a warm-bodied shark... burns through its reserves fast."
import { loadVO, rel } from '../lib/vo.js';
import { cap, hair, big, veil, P, ease, lerp, fadeEdges, slow, COL } from '../lib/doc.js';
const T0 = 183.6, D = 9.3; const sc = { duration: D, out: '06_doc-style/overlays/E09_cooler-water-far-away', alpha: true, qscale: 20 };
let R, tCool, tSwim, tBurn;
sc.setup = async () => { await loadVO(); R = rel(T0); tCool = R.s('cooler water', 183); tSwim = R.s('long swim', 183); tBurn = R.s('burns through', 183);
  sc.sfx = [{ name: 'data_blip', t: tCool + 0.2, gain: -12 }, { name: 'whoosh_slow', t: tSwim, gain: -14 }, { name: 'alarm_low', t: tBurn + 0.6, gain: -14 }]; };
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.5, 0.8);
  veil(ctx, 1080, 120, 820, 840, 0.34);
  const cx = 1500, cy = 500, Rr = 320;   // meridian view of the planet: pole at top, equator across the middle
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, Rr, 0, 7); ctx.stroke();
  for (const lat of [-60, -30, 0, 30, 60]) { const y = cy - Rr * Math.sin(lat * Math.PI / 180), hw = Rr * Math.cos(lat * Math.PI / 180); ctx.globalAlpha = lat === 0 ? 0.5 : 0.18; ctx.beginPath(); ctx.moveTo(cx - hw, y); ctx.lineTo(cx + hw, y); ctx.stroke(); }
  ctx.restore();
  // hot tropics band
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, Rr - 2, 0, 7); ctx.clip(); const hg = ctx.createLinearGradient(0, cy - 150, 0, cy + 150); hg.addColorStop(0, 'rgba(255,110,80,0)'); hg.addColorStop(0.5, 'rgba(255,110,80,0.55)'); hg.addColorStop(1, 'rgba(255,110,80,0)'); ctx.fillStyle = hg; ctx.fillRect(cx - Rr, cy - 150, Rr * 2, 300); ctx.restore();
    // cool poles glow on "far to the north and south"
  const kc = P(t, tCool, tCool + 0.8, slow);
  for (const s of [-1, 1]) { const g = ctx.createRadialGradient(cx, cy + s * Rr, 0, cx, cy + s * Rr, 170); g.addColorStop(0, `rgba(130,215,255,${0.7 * kc})`); g.addColorStop(1, 'rgba(130,215,255,0)'); ctx.fillStyle = g; ctx.fillRect(cx - 200, cy + s * Rr - 200, 400, 400); }
  // the long swim: shark dot leaves the equator toward the north pole, dashed route; reserves drain
  const kw = P(t, tSwim, D - 1.2, ease.inOutQuad), sy = lerp(cy, cy - Rr + 30, kw), sx = cx - 40 * Math.sin(kw * 3);
  if (kw > 0) { ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2; ctx.setLineDash([9, 9]); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy - Rr + 30); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.fillStyle = '#fff'; ctx.shadowColor = COL.gw; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(cx, sy, 10, 0, 7); ctx.fill(); ctx.restore();
    }
  // reserves bar
  const kb = P(t, tBurn - 0.2, tBurn + 0.5, slow), rv = 1 - P(t, tBurn, D - 1.2, ease.inQuad) * 0.92;
  if (kb > 0) { const bx = 1180, by = 975, bw = 360; ctx.save(); ctx.globalAlpha *= kb; ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, 16); ctx.fillStyle = rv > 0.4 ? COL.ok : COL.bad; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 12; ctx.fillRect(bx, by, bw * rv, 16); ctx.restore(); }
  ctx.restore();
};
export default sc;
