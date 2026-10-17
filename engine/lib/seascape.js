// Rich documentary seascape: bright surface light, volumetric beams, layered seabed ridges lost in fog, depth haze, bokeh, caustics.
import { Water } from './water.js';
import { mulberry, noise1, mix, rgba, lerp, clamp, ease } from './core.js';

const LOOK = { // per-era seabed + light grading on top of water.js ERAS
  devonian:   { seabed: '#1a2314', lit: '#8a9a58', glow: 'rgba(225,235,160,0.55)', sun: 0.62 },
  triassic:   { seabed: '#2a1f0f', lit: '#d9a64f', glow: 'rgba(255,220,140,0.6)', sun: 0.7 },
  jurassic:   { seabed: '#06223a', lit: '#4aa6d6', glow: 'rgba(190,235,255,0.6)', sun: 0.7 },
  cretaceous: { seabed: '#06312f', lit: '#5fd1c0', glow: 'rgba(210,255,240,0.6)', sun: 0.72 },
  eocene:     { seabed: '#0b3326', lit: '#8fd3a0', glow: 'rgba(255,240,190,0.6)', sun: 0.74 },
  pliocene:   { seabed: '#06182a', lit: '#3d86b0', glow: 'rgba(170,215,240,0.5)', sun: 0.55 },
};
export class Seascape {
  constructor(era, seed = 1, o = {}) {
    this.era = era; this.look = LOOK[era] || LOOK.jurassic; this.w = new Water(era, seed, o.water || {}); this.seed = seed;
    const r = mulberry(seed * 17 + 3);
    this.bokeh = Array.from({ length: 34 }, () => ({ x: r(), y: r(), z: r(), s: r(), p: r() * 6.28 }));
    this.beams = Array.from({ length: 11 }, (_, i) => ({ x: 0.08 + i * 0.085 + r() * 0.05, w: 40 + r() * 120, a: 0.35 + r() * 0.65, s: r() * 50 }));
    this.sources = o;
  }
  // t seconds, cam {x}, depth 0..1
  draw(ctx, t, o = {}) {
    const { w, look } = this, e = w.e, W = 1920, H = 1080, cam = { x: (o.camX ?? t * 38), y: 0 }, depth = o.depth ?? 0.3, lt = 5 + t * 0.9;
    // 1. water body from water.js (gradient + drifting murk)
    w.background(ctx, lt, cam, depth);
    // 2. bright surface glow top-left-ish, strong beams
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    const gx = 1300 - cam.x * 0.05, g = ctx.createRadialGradient(gx, -120, 40, gx, -120, 1250);
    g.addColorStop(0, look.glow); g.addColorStop(0.35, rgba(e.ray, 0.16)); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (const b of this.beams) {
      const x = b.x * 2300 - 200 + noise1(t * 0.1 + b.s, 4) * 70 - cam.x * 0.12, sway = noise1(t * 0.18 + b.s, 8) * 0.04;
      const a = look.sun * b.a * (0.6 + 0.4 * noise1(t * 0.4 + b.s, 5)) * (1 - depth * 0.7);
      ctx.save(); ctx.translate(x, -80); ctx.rotate(-0.22 + sway);
      const bg = ctx.createLinearGradient(0, 0, 0, 1500); bg.addColorStop(0, rgba(e.ray, a * 0.55)); bg.addColorStop(0.55, rgba(e.ray, a * 0.18)); bg.addColorStop(1, rgba(e.ray, 0));
      ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(-b.w * 0.25, 0); ctx.lineTo(b.w * 0.25, 0); ctx.lineTo(b.w * 1.6, 1500); ctx.lineTo(-b.w * 1.6, 1500); ctx.closePath(); ctx.filter = 'blur(14px)'; ctx.fill(); ctx.restore();
    }
    ctx.restore(); ctx.filter = 'none';
    w.snowLayer(ctx, lt, cam, false);
    // 3. seabed ridges: far -> near, fog-mixed, lit from above
    const layers = [{ par: 0.22, base: 700, amp: 150, f: 0.0011, fog: 0.80 }, { par: 0.42, base: 800, amp: 140, f: 0.0016, fog: 0.60 }, { par: 0.75, base: 925, amp: 120, f: 0.0022, fog: 0.34 }];
    layers.forEach((L, li) => {
      ctx.save();
      const col = mix(look.seabed, e.fog, L.fog), litc = mix(look.lit, e.fog, L.fog + 0.1);
      const y = x => L.base + (o.ridgeShift || 0) + noise1(x * L.f + cam.x * L.par * L.f + li * 7 + this.seed, li) * L.amp + noise1(x * L.f * 3.3 + cam.x * L.par * L.f * 3.3, li + 3) * L.amp * 0.3;
      ctx.beginPath(); ctx.moveTo(-10, H); for (let x = -10; x <= W + 10; x += 12) ctx.lineTo(x, y(x)); ctx.lineTo(W + 10, H); ctx.closePath();
      const gr = ctx.createLinearGradient(0, L.base - L.amp, 0, H); gr.addColorStop(0, litc); gr.addColorStop(0.25, col); gr.addColorStop(1, mix(col, '#000', 0.55));
      ctx.fillStyle = gr; ctx.globalAlpha = o.seabedAlpha ?? 1; ctx.fill();
      ctx.restore();
      // haze between layers
      const hz = ctx.createLinearGradient(0, L.base - L.amp - 60, 0, L.base + 120); hz.addColorStop(0, rgba(e.fog, 0)); hz.addColorStop(0.6, rgba(e.fog, 0.22 + 0.1 * li)); hz.addColorStop(1, rgba(e.fog, 0));
      ctx.fillStyle = hz; ctx.fillRect(0, L.base - L.amp - 60, W, L.amp + 200);
    });
    w.midground(ctx, lt, cam, depth);
    // 4. bokeh drifting at different depths
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    for (const b of this.bokeh) {
      const par = 0.15 + b.z * 1.2; let x = (b.x * 2000 - cam.x * par + t * 6 * b.s) % 2000; if (x < 0) x += 2000; const y = ((b.y * 1100 - t * (3 + 5 * b.s)) % 1100 + 1100) % 1100;
      const r = 6 + b.z * b.z * 38; ctx.globalAlpha = (0.05 + 0.1 * b.s) * (1 - b.z * 0.4);
      const bg = ctx.createRadialGradient(x - 40, y, 0, x - 40, y, r); bg.addColorStop(0, rgba(e.ray, 0.9)); bg.addColorStop(0.7, rgba(e.ray, 0.35)); bg.addColorStop(1, rgba(e.ray, 0));
      ctx.fillStyle = bg; ctx.fillRect(x - 40 - r, y - r, r * 2, r * 2);
    }
    ctx.restore();
    w.snowLayer(ctx, lt, cam, true);
    w.post(ctx, lt, Math.round(t * 30), { vignette: o.vignette ?? 0.7, grain: 0.11 });
  }
}
