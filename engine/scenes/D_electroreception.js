// E02 · 1:18.6  "Sensors in its snout pick up the electrical pulse of a beating heart."  Overlay (alpha). One idea: a pulse travels through dark water.
import { cap, hair, P, ease, fadeEdges, slow } from '../lib/doc.js';
const T0 = 78.6, at = s => s - T0, D = 5.4, BEAT = 1.0;
const HX = 1320, HY = 560, TX = 560;   // heart (right) -> snout point (left)
export default {
  duration: D, out: '06_doc-style/E02_electroreception', alpha: true, qscale: 20,
  sfx: [{ name: 'heartbeat', t: at(80.9), gain: -9 }, { name: 'sonar_ping', t: at(79.6), gain: -14 }],
  draw(ctx, t) {
    const f = fadeEdges(t, D, 0.6, 0.7);
    ctx.save(); ctx.globalAlpha = f;
    // quiet label, bottom-left
    cap(ctx, 'ELECTRORECEPTION', 140, 900, { a: P(t, 0.3, 1.2, slow), font: '500 22px Inter' });
    hair(ctx, 140, 918, 140 + 220, 918, P(t, 0.4, 1.6, ease.outCubic), 0.6);
    const on = at(80.41);
    // receiving point (snout) : a still dot with a faint halo
    const rk = P(t, at(79.2), at(80.0), slow);
    ctx.save(); ctx.globalAlpha *= rk; ctx.fillStyle = '#9fe8ff'; ctx.shadowColor = '#9fe8ff'; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(TX, HY, 5, 0, 7); ctx.fill(); ctx.restore();
    // rings, one per beat, thin and soft
    for (let b = on; b < D + 3; b += BEAT) {
      const age = t - b; if (age < 0 || age > 2.8) continue;
      const R = age * 300, a = (1 - age / 2.8) ** 1.6;
      ctx.save(); ctx.strokeStyle = `rgba(190,240,255,${0.5 * a})`; ctx.lineWidth = 1.5; ctx.shadowColor = 'rgba(120,220,255,0.6)'; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(HX, HY, R, 0, 7); ctx.stroke(); ctx.restore();
    }
    // heart source: warm glow dot that pulses on the beat
    const hk = P(t, at(80.3), at(81.0), slow);
    if (hk > 0) {
      const ph = ((t - on) % BEAT + BEAT) % BEAT, pulse = Math.exp(-ph * 6);
      ctx.save(); ctx.globalAlpha *= hk;
      const g = ctx.createRadialGradient(HX, HY, 0, HX, HY, 70 + 30 * pulse); g.addColorStop(0, `rgba(255,130,110,${0.55 + 0.4 * pulse})`); g.addColorStop(1, 'rgba(255,100,90,0)');
      ctx.fillStyle = g; ctx.fillRect(HX - 120, HY - 120, 240, 240);
      ctx.fillStyle = '#ffb3a6'; ctx.beginPath(); ctx.arc(HX, HY, 5 + 2 * pulse, 0, 7); ctx.fill(); ctx.restore();
    }
    ctx.restore();
  }
};
