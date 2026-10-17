// VO 1:18.6 -> 1:24.0  "Sensors in its snout pick up the electrical pulse of a beating heart."  (overlay, alpha)
import { text, scrim, corners, P, ease, lerp, clamp, C } from '../lib/ui.js';
import { drawCreature } from '../lib/creatures.js';
const T0 = 78.6, at = s => s - T0, D = 5.4;
const HX = 1480, HY = 520;            // heart (source)
const SX = 560, SY = 520;             // great white snout (receiver)
const BEAT = 0.9;
const ecg = u => { // one heartbeat shape, u 0..1
  const g = (c, w, a) => a * Math.exp(-((u - c) ** 2) / (2 * w * w));
  return g(0.18, 0.035, 0.18) - g(0.36, 0.012, 0.22) + g(0.4, 0.014, 1.0) - g(0.44, 0.014, 0.35) + g(0.66, 0.05, 0.28);
};
export default {
  duration: D, out: '05_environment/E02_electroreception', alpha: true, qscale: 20,
  sfx: [{ name: 'sonar_ping', t: 0.1, gain: -9 }, { name: 'data_blip', t: at(79.62), gain: -12 }, { name: 'heartbeat', t: at(80.9), gain: -9 }, { name: 'data_blip', t: at(81.46), gain: -10 }],
  draw(ctx, t) {
    const out = P(t, D - 0.45, D, ease.inCubic), inn = P(t, 0, 0.4, ease.outCubic);
    ctx.save(); ctx.globalAlpha = inn * (1 - out);
    scrim(ctx, 150, 330, 1650, 420, 0.5 * inn);
    // heart pulses start on "electrical pulse"
    const hOn = at(80.41);
    const beats = []; for (let b = hOn; b < D; b += BEAT) beats.push(b);
    // receiver: great white head (large, cropped) on the left
    const gk = P(t, 0.1, 0.7, ease.outCubic);
    ctx.save(); ctx.globalAlpha *= gk;
    drawCreature(ctx, 'greatwhite', { x: SX - 120 + (1 - gk) * -40, y: SY + 76, len: 520, color: 'rgba(255,255,255,0.88)', phase: t * 4 });
    ctx.restore();
    // snout electro-pore dots (appear on "sensors in its snout")
    const kS = P(t, at(79.2), at(79.9));
    if (kS > 0) {
      const sx = SX + 60, sy = SY + 74;
      for (let i = 0; i < 9; i++) {
        const px = sx + 28 + i * 10, py = sy + 4 - Math.sin(i / 8 * 1.6) * 16 + (i % 2) * 5;
        ctx.beginPath(); ctx.arc(px, py, 3.2 * kS, 0, 7); ctx.fillStyle = C.gw; ctx.shadowColor = C.gw; ctx.shadowBlur = 12; ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.strokeStyle = C.gw; ctx.lineWidth = 2.5; ctx.globalAlpha *= kS;
      ctx.beginPath(); ctx.moveTo(SX + 128, SY + 84); ctx.lineTo(SX + 190, SY + 170); ctx.lineTo(SX + 440, SY + 170); ctx.stroke();
      text(ctx, 'SENSORS IN THE SNOUT', SX + 200, SY + 158, { font: '800 24px Inter', ls: 4, color: C.gw });
    }
    ctx.restore();
    ctx.save(); ctx.globalAlpha = inn * (1 - out);
    // rings travelling from heart to snout
    if (t > hOn) {
      for (const b of beats) {
        const age = t - b; if (age < 0 || age > 2.2) continue;
        for (let r = 0; r < 3; r++) {
          const a2 = age - r * 0.18; if (a2 < 0) continue;
          const R = a2 * 330;
          ctx.beginPath(); ctx.arc(HX, HY, R, Math.PI * 0.62, Math.PI * 1.38);
          ctx.strokeStyle = `rgba(127,227,255,${0.8 * (1 - a2 / 2.0) * (r === 0 ? 1 : 0.6)})`; ctx.lineWidth = 3; ctx.stroke();
        }
      }
    }
    // heart (prey-coloured), pulsing on beats
    const hk = P(t, at(80.9), at(81.3), ease.outBack);
    if (hk > 0) {
      const ph = ((t - hOn) % BEAT) / BEAT, pulse = 1 + 0.18 * Math.exp(-ph * 7);
      ctx.save(); ctx.translate(HX, HY); ctx.scale(pulse * hk, pulse * hk);
      ctx.fillStyle = C.threat; ctx.shadowColor = C.threat; ctx.shadowBlur = 26;
      ctx.beginPath(); ctx.moveTo(0, 26); ctx.bezierCurveTo(-52, -6, -30, -46, 0, -20); ctx.bezierCurveTo(30, -46, 52, -6, 0, 26); ctx.fill();
      ctx.restore();
      text(ctx, 'BEATING HEART', HX, HY + 90, { font: '800 24px Inter', ls: 4, align: 'center', color: C.threat, a: hk });
    }
    // ECG strip + traveling pulse label
    const ex0 = 960, ex1 = 1380, ey = 800;
    const ek = P(t, at(80.6), at(81.2));
    if (ek > 0) {
      ctx.save(); ctx.globalAlpha *= ek; ctx.beginPath(); ctx.rect(ex0, ey - 80, ex1 - ex0, 160); ctx.clip();
      ctx.strokeStyle = C.threat; ctx.lineWidth = 3; ctx.shadowColor = C.threat; ctx.shadowBlur = 10; ctx.beginPath();
      for (let x = 0; x <= ex1 - ex0; x += 3) {
        const tt = t - (ex1 - ex0 - x) / 220; const ph = (((tt - hOn) % BEAT) + BEAT) % BEAT / BEAT;
        const y = tt < hOn ? 0 : ecg(ph) * -60;
        x === 0 ? ctx.moveTo(ex0 + x, ey + y) : ctx.lineTo(ex0 + x, ey + y);
      }
      ctx.stroke(); ctx.restore();
    }
    text(ctx, 'ELECTRORECEPTION', 150, 392, { font: '400 74px Anton', ls: 3, a: P(t, 0.25, 0.7) });
    text(ctx, 'FEELS A HEARTBEAT — NO LIGHT NEEDED', 152, 438, { font: '700 24px Inter', ls: 4, a: P(t, 0.45, 0.9), color: C.gw });
    // dark "murky" fog hint
    text(ctx, 'MURKY WATER', 150, 720, { font: '700 20px Inter', ls: 5, a: P(t, 0.8, 1.2) * 0.8, color: C.prey });
    corners(ctx, 140, 330, 1670, 420, P(t, 0, 0.5), 'rgba(127,227,255,0.55)', 30);
    ctx.restore();
  }
};
