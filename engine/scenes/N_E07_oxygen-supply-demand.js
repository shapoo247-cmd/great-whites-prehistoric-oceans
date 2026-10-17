// E07 · VO 2:25.4  "built for cold water... warm water holds less oxygen while a warm body demands more."
import { loadVO, rel } from '../lib/vo.js';
import { cap, hair, big, veil, P, ease, lerp, fadeEdges, slow, COL } from '../lib/doc.js';
const T0 = 145.4, D = 8.8; const sc = { duration: D, out: '06_doc-style/overlays/E07_oxygen-supply-vs-demand', alpha: true, qscale: 20 };
let R, tCold, tLess, tMore;
sc.setup = async () => { await loadVO(); R = rel(T0); tCold = R.s('built for cold', 145); tLess = R.s('holds less', 145); tMore = R.s('demands more', 145);
  sc.sfx = [{ name: 'data_blip', t: tCold, gain: -12 }, { name: 'whoosh_slow', t: tLess, gain: -16 }, { name: 'alarm_low', t: tMore + 0.9, gain: -14 }]; };
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.5, 0.8);
  veil(ctx, 960, 200, 900, 700, 0.34);
  const X0 = 1040, X1 = 1760, Y0 = 760, Y1 = 330, W = X1 - X0;
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X0, Y1 - 20); ctx.lineTo(X0, Y0); ctx.lineTo(X1 + 20, Y0); ctx.stroke(); ctx.restore();
  // gradient cold -> warm along the x axis
  const ag = ctx.createLinearGradient(X0, 0, X1, 0); ag.addColorStop(0, 'rgba(120,210,255,0.8)'); ag.addColorStop(1, 'rgba(255,110,80,0.9)');
  ctx.fillStyle = ag; ctx.fillRect(X0, Y0 + 14, W, 6);
    const sup = u => lerp(Y1 + 60, Y0 - 70, ease.inOutQuad(u)), dem = u => lerp(Y0 - 160, Y1 + 20, ease.inQuad(u));   // supply falls, demand climbs
  const kS = P(t, tLess - 0.3, tLess + 2.6, ease.inOutQuad), kD = P(t, tMore - 0.2, tMore + 1.8, ease.inOutQuad), kBase = P(t, tCold - 0.2, tCold + 0.8, slow);
  const curve = (f, k, col, u0 = 0) => { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 14; ctx.beginPath(); for (let i = 0; i <= 60; i++) { const u = i / 60; if (u > k) break; const x = X0 + W * u, y = f(u); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore(); };
  // balanced start: both lines flat near the left ("built for cold water")
  curve(u => sup(u * 0.0 + 0), Math.min(0.12, kBase * 0.12), '#9fe8ff'); curve(u => dem(0), Math.min(0.12, kBase * 0.12), '#ffb06a');
  curve(sup, kS, '#9fe8ff'); curve(dem, kD, '#ffb06a');
      // red gap once the lines cross
  const gapK = Math.min(kS, kD);
  if (gapK > 0.55) { ctx.save(); ctx.globalAlpha *= P(gapK, 0.55, 1); ctx.fillStyle = 'rgba(255,90,70,0.28)'; ctx.beginPath(); for (let i = 0; i <= 60; i++) { const u = i / 60 * gapK; const x = X0 + W * u, y = sup(u); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } for (let i = 60; i >= 0; i--) { const u = i / 60 * gapK; ctx.lineTo(X0 + W * u, dem(u)); } ctx.fill(); ctx.restore();
    }
  ctx.restore();
};
export default sc;
