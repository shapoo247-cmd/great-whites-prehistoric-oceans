// Z05 · THE PAYOFF. VO 8:37.40  Belgian skeleton ~16 m = roughly three great whites nose to tail; some estimates go higher.
import { loadVO, rel } from '../lib/vo.js';
import { stage, cap, hair, big, measure, P, ease, lerp, clamp, slow, COL, drawCreature } from '../lib/sizecomp2.js';
const T0 = 517.0, D = 11.6; const sc = { duration: D, out: '06_doc-style/size-comparisons/Z05_MEGALODON-payoff-16m-three-great-whites' };
let S, R, tBel, t16, t3, tNose, tHigh; const X0 = 150, ML = 1450, MY = 560, GL = ML / 16 * 5;
sc.setup = async () => { await loadVO(); R = rel(T0); S = stage('pliocene', 25, 0.45); tBel = R.s('belgium', 517); t16 = R.s('sixteen', 517); t3 = R.s('roughly three', 517); tNose = R.s('nose to tail', 517); tHigh = R.s('estimates go higher', 517);
  sc.sfx = [{ name: 'impact_dark', t: 0.2, gain: -3 }, { name: 'rumble_bed', t: 0.4, gain: -6 }, { name: 'sonar_ping', t: tBel, gain: -8 }, { name: 'impact_deep', t: t16, gain: -4 }, { name: 'riser', t: t3 - 1.2, gain: -12 }, { name: 'ui_drop', t: t3 + 0.05, gain: -4 }, { name: 'ui_drop', t: t3 + 0.75, gain: -4 }, { name: 'ui_drop', t: tNose, gain: -3 }, { name: 'impact_hit', t: tNose + 0.1, gain: -8 }, { name: 'whoosh_slow', t: tHigh - 0.2, gain: -10 }, { name: 'impact_dark', t: tHigh, gain: -8 }]; };
sc.draw = (ctx, t) => {
  const push = lerp(1.0, 1.035, P(t, 0, D, ease.inOutQuad)); ctx.save(); ctx.translate(960, 560); ctx.scale(push, push); ctx.translate(-960, -560);
  S.bg(ctx, t, D);
  const kG = P(t, tHigh, tHigh + 0.8); if (kG > 0) drawCreature(ctx, 'megalodon', { x: X0 + ML * 1.12 / 2, y: MY - 4, len: ML * 1.12, color: `rgba(255,211,106,${0.10 * kG})`, phase: t * 2 });
  const mk = P(t, 0.1, 3.0, ease.inOutCubic);
  S.animal(ctx, 'megalodon', { x: X0 + ML / 2 + (1 - mk) * 140, y: MY, len: ML, phase: t * 2, fogA: lerp(0.95, 0.18, mk), blur: lerp(6, 0, mk), colors: { back: '#121a22', flank: '#2a3844', belly: '#6c7c88' }, rim: 'rgba(170,215,240,0.55)' });
  [t3, t3 + 0.7, tNose].forEach((s, i) => { const k = P(t, s, s + 0.45, ease.outCubic); if (k <= 0) return; const x = X0 + GL * i + GL / 2; ctx.save(); ctx.globalAlpha = k;
    const path = drawCreature(ctx, 'greatwhite', { x: x + (1 - k) * 120, y: MY - 6, len: GL * 0.97, color: 'rgba(127,227,255,0.28)', phase: t * 5 + i }); ctx.strokeStyle = COL.gw; ctx.lineWidth = 3; ctx.shadowColor = COL.gw; ctx.shadowBlur = 16; ctx.stroke(path); ctx.restore();
    big(ctx, `${i + 1}`, x + (1 - k) * 120, MY - GL * 0.27, { size: 60, align: 'center', a: k, color: COL.gw }); });
  const by = MY + ML * 0.3 - 20; measure(ctx, X0, X0 + ML, by, P(t, t16 - 0.2, t16 + 0.8), '', '#fff'); if (kG > 0) measure(ctx, X0 + ML, X0 + ML * 1.12, by, kG, '', 'rgba(255,211,106,0.85)', { dash: [10, 8] });
  ctx.restore();
  cap(ctx, 'MEGALODON', 150, 130, { font: '500 28px Inter', ls: 16, a: P(t, 1.6, 2.2, slow) });
    big(ctx, '~16 m', X0 + ML / 2 * 1.035, 1060, { size: 70, align: 'center', a: P(t, t16, t16 + 0.4) });
  big(ctx, '≈ 3 GREAT WHITES', 1770, 150, { size: 60, align: 'right', a: P(t, tNose + 0.3, tNose + 0.8), color: COL.gw });
};
export default sc;
