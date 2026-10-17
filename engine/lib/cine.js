// Full-screen cinematic helpers: keyframes, camera, particles, gape jaws, suction. All timed in VO seconds.
import { lerp, clamp, ease, mulberry, noise1 } from './core.js';
import { creaturePath } from './creatures.js';
// keyframes: [[t, v], ...] with easing between; v can be number or array
export function kf(frames, t, e = ease.inOutCubic) {
  if (t <= frames[0][0]) return frames[0][1]; if (t >= frames[frames.length - 1][0]) return frames[frames.length - 1][1];
  for (let i = 0; i < frames.length - 1; i++) { const [a, va] = frames[i], [b, vb] = frames[i + 1]; if (t >= a && t <= b) { const u = e((t - a) / (b - a)); return Array.isArray(va) ? va.map((x, k) => lerp(x, vb[k], u)) : lerp(va, vb, u); } }
}
// bone jaw that opens: pivot at the hinge, lower jaw rotates; drawn after the creature (same transform via creaturePath)
export function gape(ctx, name, o, open, col = { bone: '#e4ddc6', dark: '#2a0d0f' }, geom = { hinge: [0.80, 0.045], upper: [1.0, 0.02], lower: [0.985, 0.17] }) {
  if (open <= 0.001) return; const { map } = creaturePath(name, o); const h = map(...geom.hinge), up = map(...geom.upper), lo = map(...geom.lower);
  const dir = o.flip ? -1 : 1, a = open * dir * (o.flip ? -1 : 1);
  const rot = (p, ang) => { const dx = p[0] - h[0], dy = p[1] - h[1], c = Math.cos(ang), s = Math.sin(ang); return [h[0] + dx * c - dy * s, h[1] + dx * s + dy * c]; };
  const lo2 = rot(lo, Math.abs(open) * (o.flip ? -1 : 1));
  ctx.save(); ctx.fillStyle = col.dark; ctx.beginPath(); ctx.moveTo(h[0], h[1]); ctx.lineTo(up[0], up[1]); ctx.lineTo(lo2[0], lo2[1]); ctx.closePath(); ctx.fill();
  const g = ctx.createLinearGradient(h[0], h[1], lo2[0], lo2[1]); g.addColorStop(0, '#8e866f'); g.addColorStop(1, col.bone); ctx.fillStyle = g; ctx.strokeStyle = 'rgba(20,16,10,0.55)'; ctx.lineWidth = Math.max(2, o.len * 0.004);
  const w = Math.hypot(lo2[0] - h[0], lo2[1] - h[1]) * 0.1; const nx = -(lo2[1] - h[1]) / Math.hypot(lo2[0] - h[0], lo2[1] - h[1]), ny = (lo2[0] - h[0]) / Math.hypot(lo2[0] - h[0], lo2[1] - h[1]);
  ctx.beginPath(); ctx.moveTo(h[0] - nx * w * 0.3, h[1] - ny * w * 0.3); ctx.lineTo(lo2[0] - nx * w * 0.2, lo2[1] - ny * w * 0.2); ctx.lineTo(lo2[0] + nx * w, lo2[1] + ny * w); ctx.lineTo(h[0] + nx * w * 1.6, h[1] + ny * w * 1.6); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore(); return { mouth: [(up[0] + lo2[0]) / 2, (up[1] + lo2[1]) / 2], hinge: h };
}
// streaming particles drawn toward a point (suction / current)
export function suction(ctx, t, at, k, o = {}) {
  if (k <= 0) return; const n = o.n || 70, R = o.R || 420, r = mulberry(o.seed || 3);
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < n; i++) {
    const ph = r(), ang = r() * 6.28, spd = 0.35 + r() * 0.5, u = ((t * spd * (o.speed || 0.5) + ph) % 1), rad = R * (1 - u) ** 1.7, x = at[0] + Math.cos(ang) * rad * 1.1, y = at[1] + Math.sin(ang) * rad * 0.7;
    const a = k * (0.15 + 0.65 * u) * (o.alpha || 1); ctx.strokeStyle = `rgba(215,245,255,${a})`; ctx.lineWidth = 1.5 + 2 * u; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (at[0] - x) * 0.1, y + (at[1] - y) * 0.1); ctx.stroke();
  }
  ctx.restore();
}
// rising bubbles from a source
export function bubbles(ctx, t, src, k, o = {}) {
  if (k <= 0) return; const r = mulberry(o.seed || 9), n = o.n || 40;
  ctx.save(); for (let i = 0; i < n; i++) { const u = ((t * (0.25 + r() * 0.3) + r()) % 1), x = src[0] + (r() - 0.5) * (o.spread || 120) + Math.sin(t * 2 + i) * 8, y = src[1] - u * (o.rise || 380), rad = 2 + r() * 7 * (0.5 + u); ctx.globalAlpha = k * (1 - u) * 0.8; ctx.strokeStyle = 'rgba(225,248,255,0.9)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, rad, 0, 7); ctx.stroke(); ctx.fillStyle = 'rgba(225,248,255,0.12)'; ctx.fill(); }
  ctx.restore();
}

// Realistic jaw opening: the creature is drawn twice, split along its mouth line; the lower half rotates about the hinge,
// a dark mouth interior shows in the gap and blades/teeth line both edges.
export const JAWS = {
  dunkleosteus: { line: [[1.0, 0.040], [0.985, 0.046], [0.955, 0.050], [0.915, 0.056], [0.87, 0.066], [0.83, 0.078]], hinge: [0.83, 0.078], teeth: { n: 7, size: 0.020, color: '#f3efe0' } },
  greatwhite: { line: [[0.998, 0.030], [0.976, 0.035], [0.94, 0.046], [0.905, 0.056]], hinge: [0.905, 0.056], teeth: { n: 9, size: 0.009, color: '#ffffff' } },
};
export function jawCreature(ctx, name, o, open, draw, J = JAWS[name]) {
  const { map } = creaturePath(name, o); const pt = p => map(p[0], p[1]); const line = J.line.map(pt), h = pt(J.hinge);
  const ang = (o.flip ? -1 : 1) * open; const rot = (p, a = ang) => { const dx = p[0] - h[0], dy = p[1] - h[1], c = Math.cos(a), s = Math.sin(a); return [h[0] + dx * c - dy * s, h[1] + dx * s + dy * c]; };
  const poly = new Path2D(); poly.moveTo(line[0][0], line[0][1]); line.forEach(p => poly.lineTo(p[0], p[1])); const a = pt([J.hinge[0], 0.7]), b = pt([1.3, 0.7]), c = pt([1.3, J.line[0][1]]); [a, b, c].forEach(p => poly.lineTo(p[0], p[1])); poly.closePath();
  if (open > 0.01) { // mouth interior
    const tip = rot(line[0]); ctx.save(); const g = ctx.createRadialGradient(h[0], h[1], 4, h[0], h[1], Math.hypot(tip[0] - h[0], tip[1] - h[1])); g.addColorStop(0, '#12060a'); g.addColorStop(0.6, '#3c1218'); g.addColorStop(1, '#6a2a2e');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(h[0], h[1]); line.forEach(p => ctx.lineTo(p[0], p[1])); rot(line[0]); ctx.lineTo(tip[0], tip[1]); for (let i = line.length - 1; i >= 0; i--) { const r = rot(line[i]); ctx.lineTo(r[0], r[1]); } ctx.closePath(); ctx.fill(); ctx.restore(); }
  ctx.save(); const outside = new Path2D(); outside.rect(-4000, -4000, 12000, 12000); outside.addPath(poly); ctx.clip(outside, 'evenodd'); draw(); ctx.restore();       // static upper body
  ctx.save(); ctx.translate(h[0], h[1]); ctx.rotate(ang); ctx.translate(-h[0], -h[1]); ctx.clip(poly); draw(); ctx.restore();                                  // rotating lower jaw
  const tt = J.teeth; if (tt && open > 0.04) { ctx.save(); ctx.fillStyle = tt.color; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 4; const sz = tt.size * o.len; const row = (pts, sgn, rotate) => { for (let i = 0; i < tt.n; i++) { const u = i / (tt.n - 1), k = u * (pts.length - 1), i0 = Math.floor(k), f = k - i0, p0 = pts[i0], p1 = pts[Math.min(i0 + 1, pts.length - 1)]; const x = lerp(p0[0], p1[0], f), y = lerp(p0[1], p1[1], f); const q = rotate ? rot([x, y]) : [x, y]; ctx.save(); ctx.translate(q[0], q[1]); ctx.rotate((rotate ? ang : 0) + (o.angle || 0)); ctx.beginPath(); ctx.moveTo(-sz * 0.5 * (o.flip ? -1 : 1), 0); ctx.lineTo(sz * 0.5 * (o.flip ? -1 : 1), 0); ctx.lineTo(0, sgn * sz * 1.5); ctx.closePath(); ctx.fill(); ctx.restore(); } }; row(line, 1, false); row(line, -1, true); ctx.restore(); }
  const tipU = line[0], tipL = rot(line[0]); return { mouth: [(tipU[0] + tipL[0]) / 2, (tipU[1] + tipL[1]) / 2], hinge: h };
}

// ---- story-scene factory -------------------------------------------------------------------------------------
import { loadVO as _loadVO, rel as _rel } from './vo.js';
import { Seascape } from './seascape.js';
import { lit as _lit } from './doc.js';
export const REAL = {
  gw:   { colors: { back: '#232d36', flank: '#55656f', belly: '#dfe6e8' }, rim: 'rgba(215,238,248,0.7)' },
  cret: { colors: { back: '#2b2a26', flank: '#625f52', belly: '#d6d4c6' }, rim: 'rgba(235,225,190,0.65)' },
  dunk: { colors: { back: '#1b2216', flank: '#4a5538', belly: '#9aa27c', armorTop: 'rgba(52,48,34,0.85)', armorBot: 'rgba(120,114,88,0.65)' }, rim: 'rgba(225,235,170,0.65)' },
  plio: { colors: { back: '#0f1a1d', flank: '#2c4047', belly: '#7e9296' }, rim: 'rgba(170,215,225,0.55)' },
  tylo: { colors: { back: '#1f2418', flank: '#4d5538', belly: '#a3a98a' }, rim: 'rgba(220,230,170,0.55)' },
  ichy: { colors: { back: '#10202c', flank: '#3a5a6e', belly: '#b9c9cf' }, rim: 'rgba(190,225,240,0.6)' },
  doru: { colors: { back: '#2a2118', flank: '#5f4c38', belly: '#c9b79d' }, rim: 'rgba(255,225,190,0.55)' },
  basi: { colors: { back: '#1f2422', flank: '#4b5652', belly: '#a9b2ad' }, rim: 'rgba(210,230,220,0.5)' },
  meg:  { colors: { back: '#10161c', flank: '#2a3844', belly: '#6c7c88' }, rim: 'rgba(170,215,240,0.5)' },
  dead: { colors: { back: '#3a2b28', flank: '#7a5a52', belly: '#c9a79c' }, rim: 'rgba(255,200,190,0.4)' },
};
export function blood(ctx, t, at, t0, o = {}) {
  const a = t - t0; if (a < 0) return; const r = mulberry(o.seed || 5), n = o.n || 18, life = o.life || 5; ctx.save();
  for (let i = 0; i < n; i++) { const ang = r() * 6.28, sp = (20 + r() * 80) * (o.spread || 1), x = at[0] + Math.cos(ang) * sp * a * 0.9 + (o.drift || 0) * a * 12, y = at[1] + Math.sin(ang) * sp * a * 0.6 - a * 6, rr = (70 + r() * 70) * (0.5 + Math.min(1, a * 0.6)) * (o.size || 1); const al = (o.alpha || 0.30) * 0.6 * Math.min(1, a * 1.6) * Math.max(0, 1 - a / life);
    const g = ctx.createRadialGradient(x, y, 0, x, y, rr); g.addColorStop(0, `rgba(175,20,16,${al})`); g.addColorStop(0.5, `rgba(175,20,16,${al * 0.45})`); g.addColorStop(1, 'rgba(175,20,16,0)'); ctx.fillStyle = g; ctx.fillRect(x - rr, y - rr, rr * 2, rr * 2); } ctx.restore();
}
// cfg: { out, T0, D, era, seed, depth, cues: {key:'phrase'|[phrase, after]}, sfx(R,C)->[...], actors: (C,t)=>[{name,pal,len,pose:[x,y,ang],flip,speed,open,fog,jaw}], fx(ctx,t,C,S), camX, grade }
export function storyScene(cfg) {
  let S, R, C = {}; const sc = { duration: cfg.D, out: cfg.out, bloom: false };
  sc.setup = async () => { await _loadVO(); R = _rel(cfg.T0); S = new Seascape(cfg.era, cfg.seed || 8); for (const [k, v] of Object.entries(cfg.cues || {})) C[k] = Array.isArray(v) ? R.s(v[0], v[1]) : R.s(v, Math.floor(cfg.T0) - 1); C.D = cfg.D; sc.sfx = [{ name: 'rumble_bed', t: 0, gain: -11 }, ...(cfg.sfx ? cfg.sfx(C) : [])]; };
  sc.draw = (ctx, t) => {
    const sh = cfg.shake ? cfg.shake(C, t) : 0, cx = noise1(t * 30, 1) * sh, cy = noise1(t * 30, 2) * sh, z = lerp(1.0, cfg.zoom || 1.07, ease.inOutQuad(clamp(t / cfg.D))), pan = cfg.pan ? cfg.pan(C, t) : [0, 0];
    ctx.save(); ctx.translate(960 + cx, 540 + cy); ctx.scale(z, z); ctx.translate(-960, -540);
    ctx.filter = 'blur(2.5px)'; S.draw(ctx, t, { depth: cfg.depth ?? 0.38, camX: t * 26 + pan[0] * 0.3, ridgeShift: cfg.ridge || 0 }); ctx.filter = 'none';
    if (cfg.fxBack) cfg.fxBack(ctx, t, C, S);
    ctx.save(); ctx.translate(-pan[0], -pan[1]);
    const list = cfg.actors(C, t); for (const a of list) {
      const o = { x: a.pose[0], y: a.pose[1], len: a.len, angle: a.pose[2] || 0, phase: t * (a.speed ?? 4), flip: !!a.flip, amp: a.amp ?? 1 };
      const P = REAL[a.pal]; const draw = () => _lit(ctx, a.name, { pal: 'grey', colors: P.colors, rim: P.rim, ...o, caus: S.w.caus, ct: t, fog: [S.w.e.fog, (a.fog ?? 0.14) * 0.5], blur: a.blur });
      if (a.open > 0.01 && JAWS[a.name]) { const info = jawCreature(ctx, a.name, o, a.open, draw); a.info = info; } else draw();
    }
    if (cfg.fx) cfg.fx(ctx, t, C, S, list);
    ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let i = 0; i < 4; i++) { const x = 250 + i * 470 + noise1(t * 0.2 + i, 4) * 80; const g = ctx.createLinearGradient(x, 0, x + 260, 900); g.addColorStop(0, `rgba(235,245,200,${0.12 * (cfg.beams ?? 1)})`); g.addColorStop(1, 'rgba(235,245,190,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, -50); ctx.lineTo(x + 110, -50); ctx.lineTo(x + 420, 1100); ctx.lineTo(x + 160, 1100); ctx.closePath(); ctx.filter = 'blur(10px)'; ctx.fill(); } ctx.restore(); ctx.filter = 'none';
    ctx.restore();
    if (cfg.grade) cfg.grade(ctx, t, C);
    const g = ctx.createRadialGradient(960, 540, 420, 960, 540, 1150); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.5)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
    const fi = Math.min(clamp(t / 0.5), clamp((cfg.D - t) / 0.6)); ctx.fillStyle = `rgba(0,0,0,${1 - fi})`; ctx.fillRect(0, 0, 1920, 1080);
  };
  return sc;
}
JAWS.pliosaurus = { line: [[0.997, 0.031], [0.96, 0.028], [0.92, 0.025], [0.88, 0.022], [0.85, 0.020]], hinge: [0.85, 0.020], teeth: { n: 11, size: 0.006, color: '#f2efe4' } };
JAWS.tylosaurus = { line: [[0.985, 0.008], [0.95, 0.011], [0.915, 0.013], [0.885, 0.014]], hinge: [0.885, 0.014], teeth: { n: 10, size: 0.005, color: '#f2efe4' } };
JAWS.cretoxyrhina = { line: [[0.978, 0.028], [0.955, 0.034], [0.93, 0.042], [0.905, 0.050]], hinge: [0.905, 0.050], teeth: { n: 9, size: 0.008, color: '#ffffff' } };
JAWS.megalodon = { line: [[0.982, 0.034], [0.95, 0.042], [0.92, 0.056], [0.900, 0.066]], hinge: [0.900, 0.066], teeth: { n: 10, size: 0.008, color: '#ffffff' } };
JAWS.basilosaurus = { line: [[0.998, 0.004], [0.975, 0.005], [0.955, 0.006], [0.935, 0.006]], hinge: [0.935, 0.006], teeth: { n: 9, size: 0.003, color: '#f2efe4' } };
JAWS.dorudon = { line: [[0.995, 0.014], [0.96, 0.017], [0.93, 0.019], [0.905, 0.020]], hinge: [0.905, 0.020], teeth: { n: 7, size: 0.004, color: '#f2efe4' } };
