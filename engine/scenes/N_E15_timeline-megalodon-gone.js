// E15 · VO 9:28.0  "As the oceans cooled and prey shifted, that flexibility mattered. By about 3.6 million years ago, megalodon was gone. Whether great whites helped push it out is still debated. Cooling seas and changing prey likely played a part too."
import { loadVO, rel } from '../lib/vo.js';
import { cap, hair, big, veil, P, ease, lerp, fadeEdges, slow, COL } from '../lib/doc.js';
const T0 = 568.0, D = 16.3; const sc = { duration: D, out: 'overlays/E15_timeline-megalodon-gone-3-6-mya', alpha: true, qscale: 20 };
let R, tCool, tGone, tDebate, tAlso;
sc.setup = async () => { await loadVO(); R = rel(T0); tCool = R.s('oceans cooled', 568); tGone = R.s('megalodon was gone', 572); tDebate = R.s('still debated', 576); tAlso = R.s('cooling seas', 579);
  sc.sfx = [{ name: 'whoosh_slow', t: tCool, gain: -14 }, { name: 'impact_deep', t: tGone, gain: -9 }, { name: 'data_blip', t: tDebate, gain: -12 }]; };
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.6, 1.0);
  veil(ctx, 160, 300, 1600, 700, 0.34);
  const X0 = 300, X1 = 1620, Y = 860, mya = m => lerp(X0, X1, (7 - m) / 7);          // 7 MYA ... today
  // axis
  const ka = P(t, 0.3, 1.2, slow); ctx.save(); ctx.globalAlpha *= ka; ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X0, Y); ctx.lineTo(X1, Y); ctx.stroke(); ctx.restore();
  for (let m = 7; m >= 0; m--) { ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.globalAlpha = ka; ctx.fillRect(mya(m) - 1, Y, 2, 10); cap(ctx, m === 0 ? 'TODAY' : `${m}`, mya(m), Y + 40, { align: 'center', font: '500 16px Inter', ls: 4, a: ka * 0.85 }); }
    // oceans cooled gradient strip
  const kc = P(t, tCool, tCool + 2.5, ease.inOutQuad);
  if (kc > 0) { const g = ctx.createLinearGradient(X0, 0, X1, 0); g.addColorStop(0, 'rgba(255,170,110,0.0)'); g.addColorStop(1, 'rgba(120,210,255,0.55)'); ctx.save(); ctx.globalAlpha *= kc; ctx.fillStyle = g; ctx.fillRect(X0, Y - 8, (X1 - X0), 6); ctx.restore(); }
  // bars: great white from ~6 MYA to today; megalodon until ~3.6 MYA
  const kg = P(t, tCool + 0.5, tCool + 2.4, ease.outCubic), km = P(t, 0.8, 2.2, ease.outCubic);
  const rowG = Y - 120, rowM = Y - 200;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = 16;
  ctx.strokeStyle = '#ffa64d'; ctx.shadowColor = '#ffa64d'; ctx.shadowBlur = 14; ctx.beginPath(); ctx.moveTo(mya(7), rowM); ctx.lineTo(lerp(mya(7), mya(3.6), km), rowM); ctx.stroke();
  ctx.strokeStyle = '#7fe3ff'; ctx.shadowColor = '#7fe3ff'; ctx.beginPath(); ctx.moveTo(mya(6), rowG); ctx.lineTo(lerp(mya(6), mya(0), kg), rowG); ctx.stroke(); ctx.restore();
  cap(ctx, 'MEGALODON', mya(7) - 12, rowM + 8, { align: 'right', font: '500 20px Inter', ls: 8, color: '#ffa64d', a: km }); cap(ctx, 'GREAT WHITE', mya(6) - 18, rowG + 8, { align: 'right', font: '500 20px Inter', ls: 8, color: '#7fe3ff', a: kg });
  // megalodon ends at 3.6
  const ke = P(t, tGone - 0.2, tGone + 0.5, ease.outBack);
  if (ke > 0) { const x = mya(3.6); ctx.save(); ctx.globalAlpha *= ke; ctx.strokeStyle = COL.bad; ctx.lineWidth = 3; ctx.shadowColor = COL.bad; ctx.shadowBlur = 14; ctx.setLineDash([8, 7]); ctx.beginPath(); ctx.moveTo(x, rowM - 40); ctx.lineTo(x, Y); ctx.stroke(); ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(x - 16, rowM - 16); ctx.lineTo(x + 16, rowM + 16); ctx.moveTo(x + 16, rowM - 16); ctx.lineTo(x - 16, rowM + 16); ctx.stroke(); ctx.restore();
    big(ctx, '~3.6 MYA', x, rowM - 62, { size: 66, align: 'center', a: ke }); }
  // cause debated: just a question mark
  const kd = P(t, tDebate - 0.1, tDebate + 0.6, slow); if (kd > 0) big(ctx, '?', mya(3.6) + 330, rowM + 28, { size: 110, align: 'center', a: kd * (0.7 + 0.3 * Math.sin(t * 3)), color: '#ffd36a' });
  ctx.restore();
};
export default sc;
