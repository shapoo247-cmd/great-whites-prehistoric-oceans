// E04 · 1:33.3  can't rest / keep swimming to breathe / warm body burns oxygen / dead zones spread. Overlay (alpha).
// Explains: swimming forces water in the mouth and out the gills. Stop = no flow. Warm body = high oxygen use. Dead zones close in.
import { cap, hair, P, ease, fadeEdges, slow, lerp } from '../lib/doc.js';
import { creaturePath, drawCreature } from '../lib/creatures.js';
import { mulberry } from '../lib/core.js';
const T0 = 93.3, at = s => s - T0, D = 12.2;
const GL = 980, GX = 960, GY = 500;
const rnd = mulberry(4), pts = Array.from({ length: 70 }, () => ({ o: rnd(), y: rnd(), s: 0.7 + rnd() * 0.6 }));
const stopA = at(94.12), swimA = at(97.0), warmA = at(99.0), deadA = at(103.0);
export default {
  duration: D, out: '06_doc-style/overlays/E04_swim-to-breathe', alpha: true, qscale: 20,
  sfx: [{ name: 'alarm_low', t: stopA, gain: -14 }, { name: 'whoosh_water', t: swimA + 0.1, gain: -12 }, { name: 'data_blip', t: warmA + 0.6, gain: -14 }, { name: 'impact_dark', t: at(104.9), gain: -9 }],
  draw(ctx, t) {
    const f = fadeEdges(t, D, 0.7, 0.8);
    // swim speed 1 -> 0 (stopped) -> 1
    const v = t < stopA ? 1 : t < swimA ? 1 - P(t, stopA, stopA + 0.7) : P(t, swimA, swimA + 0.8);
    swim.pos += 0; // (placeholder to keep module simple)
    ctx.save(); ctx.globalAlpha = f;
    // heat glow (warm body) behind shark
    const hk = P(t, warmA, warmA + 0.8, slow) * (1 - P(t, deadA, deadA + 0.6));
    const pulse = 0.6 + 0.4 * Math.sin(t * 5);
    const sh = { x: GX, y: GY, len: GL, phase: swim.phase(t, v) };
    if (hk > 0) { const g = ctx.createRadialGradient(GX, GY, 40, GX, GY, 620); g.addColorStop(0, `rgba(255,140,70,${0.30 * hk * pulse})`); g.addColorStop(1, 'rgba(255,120,60,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); }
    drawCreature(ctx, 'greatwhite', { ...sh, style: 'shaded', fog: ['#0b1a1c', 0.12], rim: hk > 0 ? `rgba(255,${190 - 40 * hk},${160 - 80 * hk},0.7)` : 'rgba(190,235,245,0.55)' });
    const { map } = creaturePath('greatwhite', sh);
    const mouth = map(0.985, 0.035), gill0 = map(0.80, -0.03), gillOut = [map(0.78, 0.02), map(0.755, 0.025), map(0.73, 0.03)];
    // water particles: stream in from the right, enter the mouth, leave through gills, others slip past the body
    const showFlow = P(t, 0.4, 1.2, slow);
    ctx.save(); ctx.globalAlpha *= showFlow;
    pts.forEach((p, i) => {
      const spd = 0.12 * p.s * v, u = (((p.o - swim.dist(t, v) * spd * 0.0 - swim.tt(t, v) * 0.18 * p.s) % 1) + 1) % 1;
      const x = 1920 - u * 1920, lane = (p.y - 0.5) * 360 + GY + 70;
      let y = lane, a = 0.5;
      const inRange = Math.abs(lane - mouth[1]) < 34 && i % 3 === 0;
      if (inRange && x < mouth[0] + 30 && x > gill0[0]) { const q = (mouth[0] + 30 - x) / (mouth[0] - gill0[0]); y = lerp(lane, mouth[1], 1 - q * 0.0) ; a = 0.9; }
      if (x < mouth[0] && x > mouth[0] - 600 && Math.abs(lane - GY) < 70 && !inRange) return;   // keep body area clean
      ctx.fillStyle = inRange ? '#aee9ff' : 'rgba(200,235,245,0.7)'; ctx.globalAlpha = f * showFlow * a * (0.25 + 0.75 * v);
      ctx.beginPath(); ctx.ellipse(x, y, 2 + 22 * v * (inRange ? 0.7 : 1), 1.7, 0, 0, 7); ctx.fill();
    });
    ctx.restore();
    // gills: green flow when swimming, red when stopped
    const stopped = t >= stopA && t < swimA + 0.2 ? 1 - P(t, swimA, swimA + 0.5) : 0;
    ctx.save(); ctx.lineCap = 'round';
    gillOut.forEach((g, i) => { ctx.strokeStyle = stopped > 0.01 ? `rgba(255,106,92,${0.5 + 0.4 * Math.sin(t * 8)})` : `rgba(140,255,170,${0.35 + 0.5 * v})`; ctx.lineWidth = 3.5; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 12; ctx.beginPath(); ctx.moveTo(g[0], g[1] - 18); ctx.lineTo(g[0] - 6, g[1] + 22); ctx.stroke(); });
    ctx.restore();
    // quiet labels: one at a time
    const L = [[stopA + 0.1, swimA - 0.2, 'STOP SWIMMING  =  NO WATER OVER THE GILLS', '#ff9a8e'], [swimA + 0.3, warmA - 0.2, 'SWIM  =  BREATHE', '#9fffbb'], [warmA + 0.2, deadA - 0.2, 'WARM BODY  =  MORE OXYGEN BURNED', '#ffc18a']];
    L.forEach(([a, b, s, c]) => { const k = Math.min(P(t, a, a + 0.5, slow), 1 - P(t, b - 0.4, b, slow)); if (k > 0) cap(ctx, s, 960, 880, { align: 'center', font: '500 26px Inter', ls: 6, a: k, color: c }); });
    // dead zones close in from both edges
    const dk = P(t, deadA, at(105.4), ease.inOutQuad);
    if (dk > 0) {
      for (const side of [0, 1]) { const w = 760 * dk; const x0 = side ? 1920 : 0, dir = side ? -1 : 1; const g = ctx.createLinearGradient(x0, 0, x0 + dir * w, 0); g.addColorStop(0, 'rgba(140,30,24,0.75)'); g.addColorStop(1, 'rgba(140,30,24,0)'); ctx.fillStyle = g; ctx.fillRect(Math.min(x0, x0 + dir * w), 0, w, 1080); }
      cap(ctx, 'DEAD ZONES SPREAD', 960, 880, { align: 'center', font: '500 26px Inter', ls: 8, a: P(t, deadA, deadA + 0.5, slow), color: '#ff9a8e' });
    }
    ctx.restore();
  }
};
// swim state: tail phase integrates with speed (so the tail stops when the shark stops)
const swim = {
  cache: new Map(),
  tt(t, v) { return this.integ(t); },
  integ(t) { const k = Math.round(t * 30); if (this.cache.has(k)) return this.cache.get(k); let s = 0; for (let i = 0; i < k; i++) { const tt = i / 30; const vv = tt < stopA ? 1 : tt < swimA ? 1 - P(tt, stopA, stopA + 0.7) : P(tt, swimA, swimA + 0.8); s += vv / 30; } this.cache.set(k, s); return s; },
  phase(t) { return this.integ(t) * 3.2; }, dist() { return 0; }, pos: 0
};
