// THE PAYOFF. VO 8:37.40 -> 8:47.78: Belgian skeleton ~16 m = roughly three great whites nose to tail; some estimates go higher.
import { stage, text, measureBar, P, ease, lerp, clamp, C } from '../lib/sizecomp.js';
import { drawCreature } from '../lib/creatures.js';
const T0 = 517.0, at = s => s - T0;
let S;
const X0 = 150, ML = 1450, MY = 540, GL = ML / 16 * 5;
export default {
  duration: 11.6, out: '04_size-comparisons/Z05_MEGALODON-vs-greatwhite',
  sfx: [{ name: 'impact_dark', t: 0.2, gain: -2 }, { name: 'rumble_bed', t: 0.4, gain: -6 }, { name: 'sonar_ping', t: at(519.41), gain: -8 },
    { name: 'impact_deep', t: at(521.03), gain: -4 }, { name: 'riser', t: at(523.26) - 1.4, gain: -12 },
    { name: 'ui_drop', t: at(523.26) + 0.05, gain: -3 }, { name: 'ui_drop', t: at(523.26) + 0.75, gain: -3 }, { name: 'ui_drop', t: at(524.95), gain: -2 }, { name: 'impact_hit', t: at(524.95) + 0.1, gain: -8 },
    { name: 'whoosh_slow', t: at(526.43) - 0.2, gain: -10 }, { name: 'impact_dark', t: at(526.43), gain: -8 }],
  setup() { S = stage('pliocene', 25); },
  draw(ctx, t) {
    const push = lerp(1.0, 1.035, P(t, 0, 11.6, ease.inOutQuad));
    ctx.save(); ctx.translate(960, 560); ctx.scale(push, push); ctx.translate(-960, -560);
    S.bg(ctx, t, 0.45);
    // higher-estimate ghost (behind)
    const kG = P(t, at(526.43), at(526.43) + 0.8);
    if (kG > 0) { drawCreature(ctx, 'megalodon', { x: X0 + ML * 1.12 / 2, y: MY - 4, len: ML * 1.12, color: `rgba(255,211,106,${0.10 * kG})`, phase: t * 2 }); }
    // megalodon emerges from the dark: fog -> shaded
    const mk = P(t, 0.1, 3.0, ease.inOutCubic);
    S.animal(ctx, 'megalodon', { x: X0 + ML / 2 + (1 - mk) * 140, y: MY, len: ML, phase: t * 2, fogA: lerp(0.95, 0.18, mk), blur: lerp(6, 0, mk), colors: { back: '#121a22', flank: '#2a3844', belly: '#6c7c88' }, rim: 'rgba(170,215,240,0.55)' });
    // three great whites, nose to tail, laid along its body
    const starts = [at(523.26), at(523.26) + 0.7, at(524.95)];
    starts.forEach((s, i) => {
      const k = P(t, s, s + 0.45, ease.outCubic);
      if (k <= 0) return;
      const x = X0 + GL * i + GL / 2;
      ctx.save(); ctx.globalAlpha = k;
      const path = drawCreature(ctx, 'greatwhite', { x: x + (1 - k) * 120, y: MY - 6, len: GL * 0.97, color: 'rgba(127,227,255,0.30)', phase: t * 5 + i });
      ctx.strokeStyle = C.gw; ctx.lineWidth = 3; ctx.shadowColor = C.gw; ctx.shadowBlur = 16; ctx.stroke(path);
      ctx.restore();
      text(ctx, `${i + 1}`, x + (1 - k) * 120, MY - GL * 0.27, { font: '400 60px Anton', align: 'center', a: k, color: C.gw });
    });
    // 16 m bar (bottom)
    const by = MY + ML * 0.3 + 2;
    measureBar(ctx, X0, X0 + ML, by, P(t, at(521.03) - 0.2, at(521.03) + 0.8), '', '#ffffff', { lw: 4, tick: 18 });
    if (kG > 0) measureBar(ctx, X0 + ML, X0 + ML * 1.12, by, kG, '', 'rgba(255,211,106,0.85)', { dash: [10, 8], lw: 3 });
    ctx.restore();
    // labels (not zoomed)
    text(ctx, 'MEGALODON', 150, 118, { font: '400 74px Anton', ls: 4, a: P(t, 1.6, 2.2) });
    const kB = P(t, at(519.41), at(519.41) + 0.5);
    text(ctx, 'BASED ON A WELL-STUDIED SKELETON FROM BELGIUM', 154, 166, { font: '800 22px Inter', ls: 4, a: kB, color: C.neutral });
    text(ctx, '~16 m', X0 + ML / 2 * 1.035, 1062, { font: '400 64px Anton', ls: 4, align: 'center', a: P(t, at(521.03), at(521.03) + 0.4) });
    const k3 = P(t, at(524.95) + 0.3, at(524.95) + 0.8);
    text(ctx, '≈ 3 GREAT WHITES, NOSE TO TAIL', 1770, 118, { font: '400 50px Anton', ls: 2, align: 'right', a: k3, color: C.gw });
    if (kG > 0) text(ctx, 'SOME ESTIMATES GO HIGHER', 1770, 166, { font: '800 22px Inter', ls: 4, align: 'right', color: C.prey, a: kG });
    S.front(ctx, t, 0.45);
  }
};
