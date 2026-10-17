// E02 · 1:18.6  "Sensors in its snout pick up the electrical pulse of a beating heart."  Overlay (alpha).
// Explains: hidden prey in murk -> its heartbeat sends an electric field -> shark snout picks it up.
import { cap, hair, P, ease, fadeEdges, slow, lerp } from '../lib/doc.js';
import { creaturePath, drawCreature } from '../lib/creatures.js';
import { lit } from '../lib/doc.js';
const T0 = 78.6, at = s => s - T0, D = 5.6, BEAT = 0.95;
const GL = 900, GX = 640, GY = 520;                  // shark length / centre
const HX = 1470, HY = 640;                           // prey heart
function fish(ctx, x, y, L, a, phase) {
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.fillStyle = 'rgba(8,14,16,0.9)';
  ctx.beginPath(); ctx.moveTo(-L / 2, 0); ctx.bezierCurveTo(-L * 0.25, -L * 0.2, L * 0.25, -L * 0.2, L / 2, 0);
  ctx.bezierCurveTo(L * 0.25, L * 0.2, -L * 0.25, L * 0.2, -L / 2, 0); ctx.fill();
  const sw = Math.sin(phase) * L * 0.05; ctx.beginPath(); ctx.moveTo(L / 2 - 4, 0); ctx.lineTo(L / 2 + L * 0.2, -L * 0.17 + sw); ctx.lineTo(L / 2 + L * 0.2, L * 0.17 + sw); ctx.closePath(); ctx.fill();
  ctx.restore();
}
export default {
  duration: D, out: 'overlays/E02_electroreception', alpha: true, qscale: 20,
  sfx: [{ name: 'sonar_ping', t: at(79.4), gain: -14 }, { name: 'heartbeat', t: at(80.9), gain: -8 }, { name: 'data_blip', t: at(81.5), gain: -14 }],
  draw(ctx, t) {
    const f = fadeEdges(t, D, 0.7, 0.8);
    const sx = GX + lerp(-40, 40, t / D);
    ctx.save(); ctx.globalAlpha = f;
    // shark (museum shading), gently swimming
    const sh = { x: sx, y: GY, len: GL, phase: t * 3.2 };
    drawCreature(ctx, 'greatwhite', { ...sh, style: 'shaded', fog: ['#0b1a1c', 0.18], rim: 'rgba(190,235,245,0.55)' });
    const { map } = creaturePath('greatwhite', sh);
    const snout = map(0.985, 0.012), nose = map(0.95, -0.012);
    // prey fish, nearly lost in murk, appears faintly
    const pk = P(t, at(79.6), at(80.6), slow);
    ctx.save(); ctx.globalAlpha *= 0.8 * pk; lit(ctx, 'fish', { pal: 'dark', x: HX, y: HY, len: 230, phase: t * 5, flip: true, fog: ['#142022', 0.35] }); ctx.restore();
    // heartbeat pulse
    const on = at(80.41), ph = ((t - on) % BEAT + BEAT) % BEAT, pulse = t > on ? Math.exp(-ph * 5.5) : 0;
    const hk = P(t, at(80.3), at(80.9), slow);
    // electric field lines from heart to snout (curved, flowing dashes)
    const lines = [-120, -60, 0, 60, 120];
    lines.forEach((off, i) => {
      const k = P(t, at(80.45) + i * 0.05, at(81.5) + i * 0.05, ease.outCubic); if (k <= 0) return;
      const cx = (HX + snout[0]) / 2, cy = (HY + snout[1]) / 2 + off * 1.2;
      ctx.save(); ctx.strokeStyle = `rgba(150,230,255,${(0.35 + 0.4 * pulse) * k})`; ctx.lineWidth = 2.2 - Math.abs(off) / 140; ctx.shadowColor = 'rgba(110,220,255,0.9)'; ctx.shadowBlur = 14;
      ctx.setLineDash([22, 16]); ctx.lineDashOffset = -t * 90; ctx.beginPath(); ctx.moveTo(HX - 50, HY); ctx.quadraticCurveTo(cx, cy, lerp(HX - 50, snout[0] + 8, k), lerp(HY, snout[1], k)); ctx.stroke(); ctx.restore();
    });
    // heart glow
    if (hk > 0) {
      ctx.save(); ctx.globalAlpha *= hk; const r = 60 + 50 * pulse; const g = ctx.createRadialGradient(HX - 20, HY, 0, HX - 20, HY, r);
      g.addColorStop(0, `rgba(255,140,120,${0.55 + 0.4 * pulse})`); g.addColorStop(1, 'rgba(255,90,80,0)'); ctx.fillStyle = g; ctx.fillRect(HX - 200, HY - 200, 400, 400);
      ctx.restore();
    }
    // snout sensors light up as the field arrives
    const sk = P(t, at(79.3), at(80.2), slow), arrive = P(t, at(81.3), at(81.9), slow);
    ctx.save(); ctx.fillStyle = '#bff2ff'; ctx.shadowColor = '#8fe6ff'; ctx.shadowBlur = 16;
    for (let i = 0; i < 12; i++) { const p = map(0.90 + (i % 6) * 0.015, -0.006 + (i > 5 ? 0.02 : 0) + 0.004 * Math.sin(i * 2)); ctx.globalAlpha = f * sk * (0.35 + 0.65 * arrive * (0.6 + 0.4 * pulse)); ctx.beginPath(); ctx.arc(p[0], p[1], 3.2, 0, 7); ctx.fill(); }
    ctx.restore();
    // two quiet labels
    const l1 = P(t, at(79.0), at(79.8), slow);
    if (l1 > 0) { const p = map(0.93, -0.03); hair(ctx, p[0], p[1], p[0] + 60, p[1] - 110, l1, 0.7); }
    const l2 = P(t, at(81.2), at(81.9), slow);
        ctx.restore();
  }
};
