// E06 · VO 2:15.4  "...fossil teeth record tropical surface water near 40°C — 104°F. That's far hotter than any sea it has ever swum."
import { loadVO, rel } from '../lib/vo.js';
import { cap, hair, big, veil, P, ease, lerp, fadeEdges, slow, COL } from '../lib/doc.js';
const T0 = 135.3, D = 9.7; const sc = { duration: D, out: '06_doc-style/overlays/E06_heat-40C-104F', alpha: true, qscale: 20 };
let R, t40, tF, tFar, tTeeth;
sc.setup = async () => { await loadVO(); R = rel(T0); tTeeth = R.s('fossil teeth', 135); t40 = R.s('forty', 135); tF = R.s('fahrenheit', 135); tFar = R.s('far hotter', 140);
  sc.sfx = [{ name: 'riser', t: t40 - 1.2, gain: -14 }, { name: 'data_blip', t: t40, gain: -9 }, { name: 'data_blip', t: R.s('one hundred', 135), gain: -11 }, { name: 'alarm_low', t: tFar, gain: -14 }]; };
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.5, 0.8);
  veil(ctx, 1200, 120, 700, 860, 0.34);
  const x = 1500, yT = 230, yB = 880, w = 46;     // thermometer tube
  const k = P(t, tTeeth + 0.5, t40 + 0.3, ease.inOutCubic);         // mercury level 0..1 reaches the 40°C mark
  const known = 0.55;                                              // unlabeled mark: warmest sea the shark has known
  const yLevel = yB - (yB - yT) * k * 0.92;
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(x - w / 2, yT, w, yB - yT, w / 2); ctx.stroke();
  const g = ctx.createLinearGradient(0, yB, 0, yT); g.addColorStop(0, '#ffb06a'); g.addColorStop(1, '#ff5a42'); ctx.fillStyle = g; ctx.shadowColor = '#ff6a4a'; ctx.shadowBlur = 24;
  ctx.beginPath(); ctx.roundRect(x - w / 2 + 6, yLevel, w - 12, yB - yLevel - 6, 14); ctx.fill(); ctx.restore();
  ctx.beginPath(); ctx.arc(x, yB + 36, 54, 0, 7); ctx.fillStyle = '#ff6a4a'; ctx.shadowColor = '#ff5a42'; ctx.shadowBlur = 30; ctx.fill(); ctx.shadowBlur = 0;
  for (let i = 0; i <= 8; i++) { const y = yB - (yB - yT) * i / 8; ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(x + w / 2 + 8, y, i % 2 ? 12 : 22, 2); }
  // unlabeled "every sea it has known" mark
  const kk = P(t, tFar - 0.1, tFar + 0.7, slow);
  if (kk > 0) { const y = yB - (yB - yT) * known * 0.92 + 40; ctx.save(); ctx.globalAlpha *= kk; ctx.strokeStyle = COL.gw; ctx.lineWidth = 2; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(x - w / 2 - 20, y); ctx.lineTo(x - 300, y); ctx.stroke(); ctx.restore();
    cap(ctx, 'ANY SEA IT HAS EVER SWUM', x - 320, y + 8, { align: 'right', font: '500 20px Inter', ls: 6, a: kk, color: COL.gw });
    ctx.save(); ctx.globalAlpha *= kk; ctx.strokeStyle = COL.bad; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 190, y - 20); ctx.lineTo(x - 190, y - (y - yLevel) + 16); ctx.stroke(); ctx.restore(); }
  // readout: 40°C then 104°F
  const aC = P(t, t40 - 0.1, t40 + 0.4, slow), aF = P(t, tF - 0.9, tF - 0.4, slow);
  big(ctx, '40°C', 1180, 470, { size: 170, align: 'center', a: aC });
  big(ctx, '104°F', 1180, 620, { size: 100, align: 'center', a: aF, color: COL.warm });
  cap(ctx, 'TROPICAL SURFACE WATER', 1180, 300, { align: 'center', font: '500 20px Inter', ls: 10, a: aC * 0.9 });
  ctx.restore();
};
export default sc;
