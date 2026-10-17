// E13 · VO 9:06.3  "Chemistry in their teeth shows the two sharks fed at overlapping levels of the food chain. Same seas. Same kinds of prey. Competitors."
import { loadVO, rel } from '../lib/vo.js';
import { cap, hair, big, veil, P, ease, lerp, fadeEdges, slow, COL } from '../lib/doc.js';
import { tooth } from '../lib/props.js';
const T0 = 546.2, D = 8.9; const sc = { duration: D, out: '06_doc-style/overlays/E13_tooth-chemistry-overlap', alpha: true, qscale: 20 };
let R, tChem, tOver, tSeas, tPrey, tComp;
sc.setup = async () => { await loadVO(); R = rel(T0); tChem = R.s('chemistry', 546); tOver = R.s('overlapping', 546); tSeas = R.s('same seas', 546); tPrey = R.s('same kinds', 546); tComp = R.s('competitors', 546);
  sc.sfx = [{ name: 'data_blip', t: tChem, gain: -11 }, { name: 'data_blip', t: tOver, gain: -11 }, { name: 'impact_hit', t: tComp, gain: -12 }]; };
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.5, 0.8);
  veil(ctx, 1000, 150, 900, 780, 0.34);
  // vertical food-chain axis (higher = higher up the food chain)
  const ax = 1180, yT = 260, yB = 800;
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ax, yB); ctx.lineTo(ax, yT); ctx.stroke(); ctx.beginPath(); ctx.moveTo(ax - 8, yT + 14); ctx.lineTo(ax, yT); ctx.lineTo(ax + 8, yT + 14); ctx.stroke();
  cap(ctx, 'FOOD CHAIN LEVEL', ax, yT - 26, { font: '500 18px Inter', ls: 8, a: P(t, 0.3, 1, slow), color: 'rgba(255,255,255,0.85)' });
  tooth(ctx, 1480, 190 + 0, 70, 0, P(t, tChem - 0.1, tChem + 0.5, ease.outBack), 0.3);
  cap(ctx, 'TOOTH CHEMISTRY', 1550, 160, { font: '500 20px Inter', ls: 8, a: P(t, tChem, tChem + 0.6, slow) });
  // two ranges: great white (cyan), megalodon (orange) overlapping
  const gw = [0.30, 0.78], mg = [0.45, 0.92], Y = u => yB - (yB - yT) * u;
  const kg = P(t, tChem + 0.4, tChem + 1.4, ease.outCubic), km = P(t, tOver - 0.2, tOver + 0.9, ease.outCubic);
  const bar = (x, r, k, col, name) => { const y1 = Y(r[0]), y2 = lerp(y1, Y(r[1]), k); ctx.save(); ctx.fillStyle = col; ctx.globalAlpha *= 0.85; ctx.shadowColor = col; ctx.shadowBlur = 18; ctx.beginPath(); ctx.roundRect(x - 36, y2, 72, y1 - y2, 36); ctx.fill(); ctx.restore(); cap(ctx, name, x, yB + 56, { align: 'center', font: '500 20px Inter', ls: 8, a: k, color: col }); };
  bar(1310, gw, kg, '#7fe3ff', 'GREAT WHITE'); bar(1570, mg, km, '#ffa64d', 'MEGALODON');
  const ko = P(t, tOver + 0.5, tOver + 1.2, slow);
  if (ko > 0) { ctx.save(); ctx.globalAlpha *= ko; ctx.strokeStyle = COL.gold; ctx.lineWidth = 2.5; ctx.setLineDash([8, 6]); ctx.strokeRect(1260, Y(gw[1]), 360, Y(mg[0]) - Y(gw[1])); ctx.restore(); cap(ctx, 'OVERLAP', 1650, (Y(gw[1]) + Y(mg[0])) / 2 + 8, { font: '500 20px Inter', ls: 8, a: ko, color: COL.gold }); }
  // one phrase at a time
  [[tSeas, tPrey - 0.1, 'SAME SEAS'], [tPrey, tComp - 0.1, 'SAME KINDS OF PREY'], [tComp, D - 0.8, 'COMPETITORS']].forEach(([a, b, s]) => { const k = Math.min(P(t, a, a + 0.4, slow), 1 - P(t, b - 0.3, b, slow)); if (k > 0) cap(ctx, s, 1440, 940, { align: 'center', font: '500 28px Inter', ls: 10, a: k }); });
  ctx.restore();
};
export default sc;
