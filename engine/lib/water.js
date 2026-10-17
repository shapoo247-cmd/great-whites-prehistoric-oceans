// Realistic underwater environment: depth gradient, drifting murk, god rays,
// surface caustics, marine snow, vignette and film grain. Each era has its own grade.
import { mulberry, lerp, mix, rgba, hexToRgb, makeCanvas, noise1 } from './core.js';

export const ERAS = {
  devonian:   { top: '#7a8b56', mid: '#33462e', deep: '#081109', fog: '#41543a', ray: '#e1e8b0', rays: 0.30, murk: 0.85, snow: 1.6, caustic: 0.10, tint: '#5d6b3a', label: 'murky, oxygen-poor' },
  triassic:   { top: '#e2b46a', mid: '#80703c', deep: '#1c160a', fog: '#9b8448', ray: '#ffe6a6', rays: 0.55, murk: 0.60, snow: 0.7, caustic: 0.22, tint: '#a07a35', label: 'overheated' },
  jurassic:   { top: '#4ea6cc', mid: '#144d72', deep: '#030f1a', fog: '#205e82', ray: '#c6ecff', rays: 0.60, murk: 0.38, snow: 0.8, caustic: 0.35, tint: '#1f5f86', label: 'open blue' },
  cretaceous: { top: '#72d6c8', mid: '#1c8288', deep: '#04262b', fog: '#2c9a98', ray: '#e2fff6', rays: 0.62, murk: 0.32, snow: 0.8, caustic: 0.50, tint: '#2a9a96', label: 'warm shallow sea' },
  eocene:     { top: '#b5dca8', mid: '#2f8c72', deep: '#07261e', fog: '#40a084', ray: '#fff1c4', rays: 0.70, murk: 0.30, snow: 0.9, caustic: 0.55, tint: '#5aa77e', label: 'warm coastal' },
  pliocene:   { top: '#2c6a8c', mid: '#0d2b42', deep: '#01050a', fog: '#173d58', ray: '#a8d8f2', rays: 0.42, murk: 0.48, snow: 1.1, caustic: 0.18, tint: '#163a55', label: 'cold Pacific' },
  modern:     { top: '#3d88a6', mid: '#123e58', deep: '#020a12', fog: '#1d5470', ray: '#bfe6f7', rays: 0.5, murk: 0.4, snow: 1.0, caustic: 0.3, tint: '#1d5470', label: 'modern' },
};

function fbmCanvas(w, h, seed, octaves = 5, base = 4, contrast = 1.4) {
  const rnd = mulberry(seed);
  const grids = [];
  for (let o = 0; o < octaves; o++) {
    const gw = base << o, gh = Math.max(2, Math.round(base * h / w) << o);
    const g = new Float32Array(gw * gh); for (let i = 0; i < g.length; i++) g[i] = rnd();
    grids.push({ gw, gh, g });
  }
  const c = makeCanvas(w, h), x = c.getContext('2d'), im = x.createImageData(w, h);
  for (let y = 0; y < h; y++) for (let xx = 0; xx < w; xx++) {
    let v = 0, amp = 0.5, tot = 0;
    for (const { gw, gh, g } of grids) {
      const fx = xx / w * gw, fy = y / h * gh; const ix = Math.floor(fx), iy = Math.floor(fy);
      const tx = fx - ix, ty = fy - iy; const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
      const a = g[(iy % gh) * gw + ix % gw], b = g[(iy % gh) * gw + (ix + 1) % gw], c2 = g[((iy + 1) % gh) * gw + ix % gw], d = g[((iy + 1) % gh) * gw + (ix + 1) % gw];
      v += amp * lerp(lerp(a, b, sx), lerp(c2, d, sx), sy); tot += amp; amp *= 0.5;
    }
    v = Math.max(0, Math.min(1, (v / tot - 0.5) * contrast + 0.5));
    const i = (y * w + xx) * 4; im.data[i] = im.data[i + 1] = im.data[i + 2] = 255; im.data[i + 3] = v * 255;
  }
  x.putImageData(im, 0, 0);
  return c;
}

function tint(src, hex) {
  const c = makeCanvas(src.width, src.height), x = c.getContext('2d');
  x.drawImage(src, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = hex; x.fillRect(0, 0, c.width, c.height);
  return c;
}
// texture with a wrapped 6px border so scaled tiling has no seams
function padWrap(src) {
  const P = 6, w = src.width, h = src.height, c = makeCanvas(w + 2 * P, h + 2 * P), x = c.getContext('2d');
  for (const ox of [-w, 0, w]) for (const oy of [-h, 0, h]) x.drawImage(src, P + ox, P + oy);
  c.pad = P; c.iw = w; c.ih = h;
  return c;
}

function raySprite(seed) {
  const w = 160, h = 1200, c = makeCanvas(w, h), x = c.getContext('2d'), im = x.createImageData(w, h), rnd = mulberry(seed);
  const streaks = Array.from({ length: 7 }, () => [rnd() * w, 4 + rnd() * 14, 0.4 + rnd() * 0.6]);
  for (let y = 0; y < h; y++) {
    const fy = Math.pow(1 - y / h, 1.7) * Math.min(1, Math.pow(y / (h * 0.1), 1.5));
    for (let i = 0; i < w; i++) {
      const dx = (i - w / 2) / (w / 2);
      let v = Math.exp(-dx * dx * 3.2);
      let s = 0; for (const [sx, sw, sa] of streaks) { const d = (i - sx) / sw; s += sa * Math.exp(-d * d); }
      v *= 0.55 + 0.45 * Math.min(1, s);
      const k = (y * w + i) * 4; im.data[k] = im.data[k + 1] = im.data[k + 2] = 255; im.data[k + 3] = 255 * v * fy;
    }
  }
  x.putImageData(im, 0, 0);
  return c;
}

function causticCanvas(seed) {
  // Worley (F2-F1) cell network, tileable: the bright web pattern sunlight makes through waves.
  const w = 320, h = 320, c = makeCanvas(w, h), x = c.getContext('2d'), im = x.createImageData(w, h);
  const r = mulberry(seed), N = 7, pts = [];
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) pts.push([(i + 0.15 + r() * 0.7) / N * w, (j + 0.15 + r() * 0.7) / N * h]);
  for (let y = 0; y < h; y++) for (let i = 0; i < w; i++) {
    let f1 = 1e9, f2 = 1e9;
    for (const [px, py] of pts) for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
      const dx = i - (px + ox * w), dy = y - (py + oy * h); const d = Math.sqrt(dx * dx + dy * dy);
      if (d < f1) { f2 = f1; f1 = d; } else if (d < f2) f2 = d;
    }
    const e = (f2 - f1) / (w / N);
    const a = Math.pow(Math.max(0, 1 - e * 3.2), 3.5);
    const k = (y * w + i) * 4; im.data[k] = im.data[k + 1] = im.data[k + 2] = 255; im.data[k + 3] = 255 * a;
  }
  x.putImageData(im, 0, 0);
  const b = makeCanvas(w, h), bx = b.getContext('2d');
  for (const ox of [-w, 0, w]) for (const oy of [-h, 0, h]) { bx.filter = 'blur(1.6px)'; bx.drawImage(c, ox, oy); }
  return b;
}

function dotSprite(blurPx) {
  const s = 64, c = makeCanvas(s, s), x = c.getContext('2d');
  const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  const hard = Math.max(0.02, 0.35 - blurPx * 0.06);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(hard, 'rgba(255,255,255,0.9)'); g.addColorStop(Math.min(0.9, hard + 0.25 + blurPx * 0.05), 'rgba(255,255,255,0.25)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, s, s);
  return c;
}

const GRAIN = [];
function grainTiles() {
  if (GRAIN.length) return GRAIN;
  for (let n = 0; n < 4; n++) {
    const w = 256, c = makeCanvas(w, w), x = c.getContext('2d'), im = x.createImageData(w, w), r = mulberry(99 + n);
    for (let i = 0; i < w * w; i++) { const v = (r() + r() + r()) / 3 * 255; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; }
    x.putImageData(im, 0, 0); GRAIN.push(c);
  }
  return GRAIN;
}

export class Water {
  constructor(era = 'modern', seed = 1, opts = {}) {
    this.e = typeof era === 'string' ? { ...ERAS[era] } : era;
    Object.assign(this.e, opts);
    this.seed = seed;
    const n1 = fbmCanvas(480, 270, seed * 7 + 1, 5, 3, 1.8), n2 = fbmCanvas(480, 270, seed * 7 + 2, 5, 4, 1.6);
    this.murkA = padWrap(tint(n1, this.e.fog)); this.murkB = padWrap(tint(n2, this.e.deep));
    this.murkC = padWrap(tint(n2, this.e.fog));
    this.ray = raySprite(seed * 3 + 5);
    this.caus = causticCanvas(seed * 5 + 3);
    this.dots = [0, 1.5, 3, 5].map(dotSprite);
    const r = mulberry(seed * 11 + 7);
    this.snow = Array.from({ length: Math.round(260 * this.e.snow) }, () => ({ x: r(), y: r(), z: r(), s: r(), p: r() * 6.28 }));
    this.rays = Array.from({ length: 9 }, (_, i) => ({ x: (i + r() * 0.8) / 9, w: 0.5 + r() * 1.3, a: 0.5 + r() * 0.5, s: r() * 100, ang: -0.18 + r() * 0.08 }));
    this.grain = grainTiles();
  }
  fog(d) { return mix(this.e.deep, this.e.fog, Math.max(0, Math.min(1, d))); }
  // color of a subject at distance d (0 near/dark, 1 lost in fog)
  subject(d, base = '#05080a') { return mix(base, this.e.fog, Math.max(0, Math.min(1, d))); }

  // cam: {x, y} parallax offset in px; depth: 0 surface .. 1 deep (darkens & removes rays)
  background(ctx, t, cam = { x: 0, y: 0 }, depth = 0.3) {
    const { e } = this, W = 1920, H = 1080;
    const g = ctx.createLinearGradient(0, 0, 0, H);
    const d = Math.max(0, Math.min(1, depth));
    g.addColorStop(0, mix(e.top, e.mid, d * 0.85));
    g.addColorStop(0.42, mix(e.mid, e.deep, d * 0.6));
    g.addColorStop(1, mix(e.deep, '#000000', d * 0.5));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // far murk (two drifting layers)
    ctx.save();
    ctx.globalAlpha = 0.55 * e.murk;
    this._tile(ctx, this.murkA, -((t * 14 + cam.x * 0.15) % 1920), -cam.y * 0.15, 4);
    ctx.globalAlpha = 0.45 * e.murk;
    this._tile(ctx, this.murkB, -((t * 7 + cam.x * 0.1 + 600) % 1920), 120 - cam.y * 0.1, 4);
    ctx.restore();
    this._rays(ctx, t, cam, d, 0.75);
  }
  _tile(ctx, img, ox, oy, scale) {
    // abutting tiles at integer pixel positions; sampling bleeds into the wrapped padding -> seamless
    const P = img.pad || 0, iw = img.iw || img.width, ih = img.ih || img.height;
    const w = iw * scale, h = ih * scale;
    const x0 = Math.round(((ox % w) + w) % w) - w, y0 = Math.round(((oy % h) + h) % h) - h;
    for (let x = x0; x < 1920; x += w) for (let y = y0; y < 1080; y += h) ctx.drawImage(img, P, P, iw, ih, x, y, w, h);
  }
  _rays(ctx, t, cam, d, k) {
    const { e } = this;
    if (e.rays <= 0) return;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const col = hexToRgb(e.ray);
    for (const r of this.rays) {
      const a = e.rays * k * r.a * (0.55 + 0.45 * noise1(t * 0.35 + r.s, 3)) * (1 - d * 0.8);
      if (a <= 0.01) continue;
      const x = r.x * 2200 - 140 + noise1(t * 0.12 + r.s, 9) * 60 - cam.x * 0.25;
      ctx.save();
      ctx.translate(x, -60 - cam.y * 0.2); ctx.rotate(r.ang);
      ctx.globalAlpha = Math.min(1, a);
      ctx.filter = 'none';
      const spr = this._raySpr || (this._raySpr = tint(this.ray, `rgb(${col.join(',')})`));
      ctx.drawImage(spr, -80 * r.w * 1.6, 0, 160 * r.w * 1.6, 1250);
      ctx.restore();
    }
    ctx.restore();
  }
  // near haze + caustics, drawn after midground subjects
  midground(ctx, t, cam = { x: 0, y: 0 }, depth = 0.3) {
    const { e } = this;
    ctx.save();
    ctx.globalAlpha = 0.28 * e.murk;
    this._tile(ctx, this.murkC, -((t * 22 + cam.x * 0.4 + 300) % 1920), 60 - cam.y * 0.3, 4);
    ctx.restore();
    if (e.caustic > 0 && depth < 0.7) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const a = e.caustic * (1 - depth / 0.7);
      const tmp = this._ctmp || (this._ctmp = makeCanvas(1920, 520));
      const tx = tmp.getContext('2d');
      tx.globalCompositeOperation = 'source-over'; tx.clearRect(0, 0, 1920, 520);
      const s = 1.15, w = this.caus.width * s;
      const ox = -((t * 26 + cam.x * 0.3) % w), oy = -((t * 9) % w);
      tx.globalAlpha = 0.7;
      for (let x = ox - w; x < 1920; x += w) for (let y = oy - w; y < 520; y += w) tx.drawImage(this.caus, x, y, w, w);
      const s2 = 1.6, w2 = this.caus.width * s2, ox2 = ((t * 19) % w2) - w2, oy2 = -((t * 14 + 90) % w2);
      tx.globalCompositeOperation = 'lighter'; tx.globalAlpha = 0.45;
      for (let x = ox2 - w2; x < 1920 + w2; x += w2) for (let y = oy2 - w2; y < 520; y += w2) tx.drawImage(this.caus, x, y, w2, w2);
      tx.globalAlpha = 1;
      tx.globalCompositeOperation = 'destination-in';
      const g = tx.createLinearGradient(0, 0, 0, 520); g.addColorStop(0, 'rgba(0,0,0,0.9)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      tx.fillStyle = g; tx.fillRect(0, 0, 1920, 520);
      ctx.globalAlpha = a * 0.55;
      ctx.drawImage(tmp, 0, -cam.y * 0.2);
      ctx.restore();
    }
  }
  // marine snow in front of everything; z<0.6 far, z>0.85 very near (big + blurred)
  snowLayer(ctx, t, cam = { x: 0, y: 0 }, near = true) {
    const col = this.e.ray;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (const p of this.snow) {
      if (near ? p.z < 0.55 : p.z >= 0.55) continue;
      const par = 0.2 + p.z * 1.4;
      let x = (p.x * 2100 + t * (8 + p.s * 18) * par + Math.sin(t * 0.7 + p.p) * 12 - cam.x * par) % 2100; if (x < 0) x += 2100; x -= 90;
      let y = (p.y * 1260 - t * (4 + p.s * 10) * par + Math.cos(t * 0.5 + p.p) * 10 - cam.y * par) % 1260; if (y < 0) y += 1260; y -= 90;
      const sz = 1.5 + p.z * p.z * 9 * (0.5 + p.s);
      const blur = p.z > 0.9 ? 3 : p.z > 0.75 ? 2 : p.z > 0.5 ? 1 : 0;
      ctx.globalAlpha = (0.12 + 0.35 * p.s) * (p.z > 0.9 ? 0.45 : 1);
      ctx.drawImage(this.dots[blur], x - sz, y - sz, sz * 2, sz * 2);
    }
    ctx.restore();
  }
  // vignette + grain + subtle color grade. frame: integer frame index for grain variation
  post(ctx, t, frame = 0, opts = {}) {
    const vig = opts.vignette ?? 0.75;
    ctx.save();
    const g = ctx.createRadialGradient(960, 540, 300, 960, 540, 1150);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${vig})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
    if (opts.grain !== 0) {
      ctx.globalCompositeOperation = 'overlay';
      ctx.globalAlpha = opts.grain ?? 0.16;
      const tile = this.grain[frame % 4];
      const r = mulberry(frame * 31 + 7); const ox = -Math.floor(r() * 256), oy = -Math.floor(r() * 256);
      for (let x = ox; x < 1920; x += 256) for (let y = oy; y < 1080; y += 256) ctx.drawImage(tile, x, y);
    }
    ctx.restore();
  }
}

// Draw a creature's silhouette softly lost in water: color by distance, blur by distance.
export function fogged(water, d) { return { color: water.subject(d), blur: 0.5 + d * 6 }; }
export { rgba };
