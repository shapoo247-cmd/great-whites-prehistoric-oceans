// Z01 · VO 0:54.19  Dunkleosteus ~3.5 m, short and thick, as heavy as a 4.5 m great white; on paper GW slightly bigger; armor only head & shoulders; behind that, just fish.
import { loadVO, rel } from '../lib/vo.js';
import { stage, cap, hair, big, measure, P, ease, lerp, clamp, slow, COL } from '../lib/sizecomp2.js';
const T0 = 54.19, D = 20.6; const sc = { duration: D, out: '06_doc-style/size-comparisons/Z01_dunkleosteus-vs-greatwhite' };
let S, R, tD, tTuna, tG, tHeavy, tPaper, tArmor, tFish;
const ppm = 200, X0 = 300;
sc.setup = async () => { await loadVO(); R = rel(T0); S = stage('devonian', 21);
  tD = R.s('three and a half', 54); tTuna = R.s('tuna', 54); tG = R.s('four and a half', 55); tHeavy = R.s('about as heavy', 55); tPaper = R.s('slightly bigger', 60); tArmor = R.s('covers only', 66); tFish = R.s('just fish', 70);
  sc.sfx = [{ name: 'whoosh_water', t: 0.1, gain: -9 }, { name: 'data_blip', t: tD, gain: -9 }, { name: 'whoosh_water', t: tG - 0.5, gain: -10 }, { name: 'data_blip', t: tG, gain: -9 }, { name: 'ui_drop', t: tPaper, gain: -8 }, { name: 'impact_hit', t: tArmor, gain: -10 }, { name: 'ui_drop', t: tFish, gain: -8 }]; };
sc.draw = (ctx, t) => {
  S.bg(ctx, t, D);
  const dl = 3.5 * ppm, gl = 4.5 * ppm, dy = 380, gy = 760, dBar = dy + dl * 0.2 + 18, gBar = gy + gl * 0.25 + 16;
  const dIn = P(t, 0.2, 1.4, ease.outCubic), gIn = P(t, tG - 0.6, tG + 0.6, ease.outCubic);
  ctx.save(); ctx.globalAlpha = dIn; S.animal(ctx, 'dunkleosteus', { x: X0 + dl / 2 - (1 - dIn) * 90, y: dy, len: dl, phase: t * 4, colors: { back: '#262c20', flank: '#454e38', belly: '#7c8466', armorTop: 'rgba(58,54,40,0.8)', armorBot: 'rgba(98,92,70,0.6)' } }); ctx.restore();
  measure(ctx, X0, X0 + dl, dBar, P(t, tD - 0.2, tD + 0.9), '~3.5 m', '#fff');
  cap(ctx, 'DUNKLEOSTEUS', X0, dy - 150, { font: '500 24px Inter', ls: 12, a: dIn });
    ctx.save(); ctx.globalAlpha = gIn; S.animal(ctx, 'greatwhite', { x: X0 + gl / 2 - (1 - gIn) * 90, y: gy, len: gl, phase: t * 5 }); ctx.restore();
  measure(ctx, X0, X0 + gl, gBar, P(t, tG - 0.2, tG + 0.9), '4.5 m', COL.gw);
  cap(ctx, 'GREAT WHITE', X0, gBar + 56, { font: '500 24px Inter', ls: 12, a: gIn, color: COL.gw });
    // on paper: the extra metre
  const kP = P(t, tPaper, tPaper + 0.7);
  if (kP > 0) { const x1 = X0 + dl, x2 = X0 + gl; ctx.save(); ctx.globalAlpha = kP; ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(x1, dBar); ctx.lineTo(x1, gBar); ctx.stroke(); ctx.setLineDash([]); ctx.strokeStyle = COL.gw; ctx.lineWidth = 7; ctx.shadowColor = COL.gw; ctx.shadowBlur = 14; ctx.beginPath(); ctx.moveTo(x1, gBar - 8); ctx.lineTo(lerp(x1, x2, clamp(kP * 1.4)), gBar - 8); ctx.stroke(); ctx.restore(); }
  // armor span vs just fish
  const ax = X0 + dl * 0.738, by = dy - dl * 0.25 - 10, kA = P(t, tArmor, tArmor + 0.6), kF = P(t, tFish, tFish + 0.6);
  if (kA > 0) { ctx.save(); ctx.globalAlpha = kA; ctx.strokeStyle = COL.gold; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(ax, by + 12); ctx.lineTo(ax, by); ctx.lineTo(X0 + dl, by); ctx.lineTo(X0 + dl, by + 12); ctx.stroke(); ctx.restore(); }
  if (kF > 0) { ctx.save(); ctx.globalAlpha = kF; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.setLineDash([9, 7]); ctx.beginPath(); ctx.moveTo(X0 + dl * 0.08, by + 12); ctx.lineTo(X0 + dl * 0.08, by); ctx.lineTo(ax - 14, by); ctx.lineTo(ax - 14, by + 12); ctx.stroke(); ctx.restore(); }
};
export default sc;
