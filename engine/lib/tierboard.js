// Tier board in the same TierMaker-style design as the primate video (colors, panel, rows, "Pin Images" pool,
// drag-and-drop with a pointing-hand cursor), adapted to THRIVES / SURVIVES / BARELY / DIES.
import { Water } from './water.js';
import { drawCreature } from './creatures.js';
import { clamp, lerp, inv, ease, P, makeCanvas } from './core.js';

export const TIERS = [
  { id: 'thrives', label: 'THRIVES', color: '#7fff7f' },
  { id: 'survives', label: 'SURVIVES', color: '#bfff7f' },
  { id: 'barely', label: 'BARELY', color: '#ffdf7f' },
  { id: 'dies', label: 'DIES', color: '#ff7f7f' },
];
export const OCEANS = [
  { id: 'devonian', name: 'Late Devonian', lines: ['Late', 'Devonian'], verdict: 'survives' },
  { id: 'triassic', name: 'Early Triassic', lines: ['Early', 'Triassic'], verdict: 'dies' },
  { id: 'jurassic', name: 'Late Jurassic', lines: ['Late', 'Jurassic'], verdict: 'survives' },
  { id: 'cretaceous', name: 'Late Cretaceous', lines: ['Late', 'Cretaceous'], verdict: 'barely' },
  { id: 'eocene', name: 'Late Eocene', lines: ['Late', 'Eocene'], verdict: 'thrives' },
  { id: 'pliocene', name: 'Early Pliocene', lines: ['Early', 'Pliocene'], verdict: 'survives' },
];
// Layout (board space = screen space at zoom 1)
export const L = { panel: [30, 24, 1860, 1032], x0: 150, labelW: 240, x1: 1790, y0: 40, rh: 150, tile: 150, poolGap: 75 };
L.rowsEnd = L.y0 + TIERS.length * L.rh;
L.pinY = L.rowsEnd + 50;
L.poolY = L.rowsEnd + L.poolGap;

export function rowY(tierId) { return L.y0 + TIERS.findIndex(t => t.id === tierId) * L.rh; }
export function slotXY(tierId, index) { return [L.x0 + L.labelW + index * L.tile, rowY(tierId)]; }
export function poolXY(index) { return [L.x0 + index * L.tile, L.poolY]; }

// ---- tile artwork: an original underwater scene per ocean (rendered once) ----
const TILE_ART = {
  devonian: (ctx, w, t) => { drawCreature(ctx, 'dunkleosteus', { x: 990, y: 590, len: 640, style: 'shaded', colors: { back: '#232a1d', flank: '#3f4a33', belly: '#6f7759', armorTop: 'rgba(52,50,38,0.75)', armorBot: 'rgba(92,88,68,0.55)' }, fog: [w.e.fog, 0.35], blur: 1, phase: t * 4, flip: true, rim: 'rgba(210,220,160,0.45)' }); },
  triassic: (ctx, w, t) => { drawCreature(ctx, 'greatwhite', { x: 960, y: 600, len: 640, style: 'shaded', fog: [w.e.fog, 0.45], blur: 1.5, phase: t * 2, angle: 0.18, rim: 'rgba(255,230,160,0.5)' }); },
  jurassic: (ctx, w, t) => { drawCreature(ctx, 'pliosaurus', { x: 1000, y: 560, len: 900, style: 'shaded', colors: { back: '#1b2630', flank: '#3a4c58', belly: '#7f909a' }, fog: [w.e.fog, 0.3], blur: 1, phase: t * 3, flip: true }); },
  cretaceous: (ctx, w, t) => { drawCreature(ctx, 'tylosaurus', { x: 990, y: 470, len: 900, color: w.subject(0.45), blur: 3, phase: t * 3 }); drawCreature(ctx, 'cretoxyrhina', { x: 940, y: 650, len: 480, style: 'shaded', fog: [w.e.fog, 0.3], blur: 1, phase: t * 5, flip: true }); },
  eocene: (ctx, w, t) => { drawCreature(ctx, 'dorudon', { x: 1180, y: 720, len: 300, color: w.subject(0.5), blur: 2, phase: t * 3, flip: true }); drawCreature(ctx, 'basilosaurus', { x: 1170, y: 560, len: 1000, angle: -0.1, style: 'shaded', colors: { back: '#202a28', flank: '#41504a', belly: '#8a968c' }, fog: [w.e.fog, 0.3], blur: 1, phase: t * 3, flip: true }); },
  pliocene: (ctx, w, t) => { drawCreature(ctx, 'megalodon', { x: 1010, y: 600, len: 1000, style: 'shaded', colors: { back: '#141c24', flank: '#2c3a46', belly: '#6f7f8a' }, fog: [w.e.fog, 0.25], blur: 1, phase: t * 3, flip: true }); },
};
export function renderTileArt(era, t = 2, size = 300) {
  const full = makeCanvas(1920, 1080), fx = full.getContext('2d');
  const w = new Water(era, OCEANS.findIndex(o => o.id === era) + 11);
  w.background(fx, t, { x: 0, y: 0 }, 0.2);
  w.snowLayer(fx, t, { x: 0, y: 0 }, false);
  TILE_ART[era](fx, w, t);
  w.midground(fx, t, { x: 0, y: 0 }, 0.2);
  w.snowLayer(fx, t, { x: 0, y: 0 }, true);
  w.post(fx, t, 3, { vignette: 0.55, grain: 0.1 });
  const c = makeCanvas(size, size), x = c.getContext('2d');
  x.drawImage(full, 600, 210, 740, 740, 0, 0, size, size);
  return c;
}

function fitFont(ctx, lines, maxW, size) {
  let s = size;
  for (;;) { ctx.font = `400 ${s}px Anton`; if (lines.every(l => ctx.measureText(l).width <= maxW) || s < 12) return s; s -= 1; }
}
export function drawTile(ctx, ocean, art, x, y, size = L.tile, opts = {}) {
  ctx.save();
  if (opts.alpha != null) ctx.globalAlpha *= opts.alpha;
  ctx.drawImage(art, x, y, size, size);
  if (opts.textAlpha === 0) { ctx.restore(); return; }
  if (opts.textAlpha != null) ctx.globalAlpha *= opts.textAlpha;
  const lines = ocean.lines;
  const fs = fitFont(ctx, lines, size * 0.9, size * 0.27);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = size * 0.05; ctx.shadowOffsetY = size * 0.01;
  ctx.fillStyle = '#ffffff';
  const lh = fs * 1.02, y0 = y + size / 2 - (lines.length - 1) * lh / 2 + fs * 0.04;
  lines.forEach((l, i) => ctx.fillText(l, x + size / 2, y0 + i * lh));
  ctx.restore();
}

// macOS-style pointing hand, hotspot at index fingertip. scale ~ px per unit (32-unit grid)
const HAND = new Path2D('M12 3C12 1.6 13.1 .5 14.5 .5C15.9 .5 17 1.6 17 3L17 12C17.3 11.3 18.1 10.8 19 10.8C20.1 10.8 21 11.7 21 12.8L21 13.5C21.3 12.9 22 12.5 22.8 12.5C23.9 12.5 24.8 13.4 24.8 14.5L24.8 15.2C25.1 14.7 25.7 14.3 26.4 14.3C27.5 14.3 28.3 15.2 28.3 16.3L28.3 22C28.3 26.5 25.5 30.5 20.5 30.5L17 30.5C13.8 30.5 11.8 29 10.2 26.6L5.2 19.2C4.6 18.3 4.8 17.1 5.7 16.5C6.6 15.9 7.8 16.1 8.5 17L12 21Z');
export function drawHand(ctx, x, y, s = 1.45, pressed = 0) {
  ctx.save();
  ctx.translate(x, y); ctx.scale(s * (1 - pressed * 0.08), s * (1 - pressed * 0.08)); ctx.translate(-14.5, -0.5);
  ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 4; ctx.shadowOffsetY = 1.5;
  ctx.fillStyle = '#ffffff'; ctx.fill(HAND);
  ctx.shadowColor = 'transparent';
  ctx.lineWidth = 1.5; ctx.strokeStyle = '#000'; ctx.lineJoin = 'round'; ctx.stroke(HAND);
  ctx.lineWidth = 1.1; ctx.beginPath();
  ctx.moveTo(17, 12); ctx.lineTo(17, 18.5); ctx.moveTo(21, 13.5); ctx.lineTo(21, 19); ctx.moveTo(24.8, 15.2); ctx.lineTo(24.8, 19.5);
  ctx.stroke();
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function pinIcon(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#de4168';
  ctx.beginPath(); ctx.moveTo(0, 9); ctx.bezierCurveTo(-1, 6, -7, 1.5, -7, -2.5); ctx.arc(0, -2.5, 7, Math.PI, 0); ctx.bezierCurveTo(7, 1.5, 1, 6, 0, 9); ctx.fill();
  ctx.restore();
}

// state: { placed: {tierId: [oceanId...]}, pool: [oceanId...] (+ optional poolOffsets), highlight: {...} }
export class Board {
  constructor() { this.art = {}; }
  async init(tileT = 2) { for (const o of OCEANS) this.art[o.id] = renderTileArt(o.id, tileT); }
  ocean(id) { return OCEANS.find(o => o.id === id); }

  // cam: {s, fx, fy} -> board point (fx,fy) appears at screen center; s=1,fx=960,fy=540 = full view
  apply(ctx, cam) { ctx.translate(960, 540); ctx.scale(cam.s, cam.s); ctx.translate(-cam.fx, -cam.fy); }

  draw(ctx, st, cam = { s: 1, fx: 960, fy: 540 }) {
    ctx.fillStyle = '#262626'; ctx.fillRect(0, 0, 1920, 1080);
    ctx.save();
    this.apply(ctx, cam);
    // outer extends beyond frame when zoomed
    ctx.fillStyle = '#262626'; ctx.fillRect(-2000, -2000, 6000, 6000);
    ctx.fillStyle = '#1b1b1b'; roundRect(ctx, L.panel[0], L.panel[1], L.panel[2], L.panel[3], 14); ctx.fill();
    // rows
    TIERS.forEach((tier, i) => {
      const y = L.y0 + i * L.rh;
      ctx.fillStyle = '#1a1a1a'; ctx.fillRect(L.x0 + L.labelW, y, L.x1 - L.x0 - L.labelW, L.rh);
      ctx.fillStyle = '#000'; ctx.fillRect(L.x0 + L.labelW, y + L.rh - 1.5, L.x1 - L.x0 - L.labelW, 1.5);
      const hl = (st.labelPulse && st.labelPulse[tier.id]) || 0;
      ctx.save();
      ctx.fillStyle = tier.color; ctx.fillRect(L.x0, y, L.labelW, L.rh);
      if (hl > 0) { ctx.fillStyle = `rgba(255,255,255,${0.45 * hl})`; ctx.fillRect(L.x0, y, L.labelW, L.rh); }
      ctx.fillStyle = '#1a1a1a'; ctx.font = '500 36px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const sc = 1 + 0.06 * hl; ctx.translate(L.x0 + L.labelW / 2, y + L.rh / 2 + 1); ctx.scale(sc, sc);
      ctx.fillText(tier.label, 0, 0);
      ctx.restore();
      if (st.rowGlow && st.rowGlow[tier.id]) {
        const a = st.rowGlow[tier.id];
        ctx.save(); ctx.globalAlpha = a * 0.5; ctx.strokeStyle = tier.color; ctx.lineWidth = 4; ctx.strokeRect(L.x0 + 2, y + 2, L.x1 - L.x0 - 4, L.rh - 4); ctx.restore();
      }
    });
    // dim overlay for focus moments
    // placed tiles
    for (const tier of TIERS) {
      (st.placed[tier.id] || []).forEach((oid, i) => {
        const [x, y] = slotXY(tier.id, i);
        const sc = (st.tileScale && st.tileScale[oid]) || 1;
        ctx.save(); ctx.translate(x + L.tile / 2, y + L.tile / 2); ctx.scale(sc, sc);
        drawTile(ctx, this.ocean(oid), this.art[oid], -L.tile / 2, -L.tile / 2);
        const g = st.tileGlow && st.tileGlow[oid];
        if (g) { ctx.globalAlpha = g; ctx.strokeStyle = tier.color; ctx.lineWidth = 5; ctx.shadowColor = tier.color; ctx.shadowBlur = 24; ctx.strokeRect(-L.tile / 2 + 2.5, -L.tile / 2 + 2.5, L.tile - 5, L.tile - 5); }
        ctx.restore();
      });
    }
    // pool
    ctx.save();
    ctx.fillStyle = '#ffffff'; ctx.font = '500 34px Inter'; ctx.textBaseline = 'middle';
    pinIcon(ctx, L.x0 + 8, L.pinY + 3, 1.15);
    ctx.fillText('Pin Images', L.x0 + 32, L.pinY);
    ctx.restore();
    (st.pool || []).forEach((p) => {
      const o = typeof p === 'string' ? { id: p, x: null, a: 1, s: 1 } : p;
      const idx = o.slot != null ? o.slot : st.pool.indexOf(p);
      const [x, y] = poolXY(idx);
      const sc = o.s ?? 1;
      ctx.save(); ctx.translate(x + L.tile / 2, y + L.tile / 2); ctx.scale(sc, sc);
      if (o.dim) { ctx.globalAlpha *= 1 - o.dim * 0.7; }
      drawTile(ctx, this.ocean(o.id), o.art || this.art[o.id], -L.tile / 2, -L.tile / 2, L.tile, { alpha: o.a ?? 1, textAlpha: o.textA ?? 1 });
      if (o.glow) { ctx.globalAlpha = o.glow; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4; ctx.shadowColor = '#fff'; ctx.shadowBlur = 20; ctx.strokeRect(-L.tile / 2 + 2, -L.tile / 2 + 2, L.tile - 4, L.tile - 4); }
      ctx.restore();
    });
    // dragged tile
    if (st.drag) {
      const d = st.drag;
      ctx.save(); ctx.translate(d.x + L.tile / 2, d.y + L.tile / 2); ctx.scale(d.s || 1, d.s || 1);
      drawTile(ctx, this.ocean(d.id), this.art[d.id], -L.tile / 2, -L.tile / 2, L.tile, { alpha: d.a ?? 0.8 });
      ctx.restore();
    }
    if (st.hand) drawHand(ctx, st.hand.x, st.hand.y, 1.45, st.hand.pressed || 0);
    ctx.restore();
  }
}

// Build a standard placement animation. returns function(t) -> {state, cam}
// opts: before: {tierId: [ids]}, pool: [ids], oceanId, target tier, tDrop, hover: {tier, tArrive} for fake-out,
export function placement(opts) {
  const { before, pool, oceanId, target } = opts;
  const tPick = opts.tPick ?? 0.62, tDrop = opts.tDrop ?? 1.6, tOutA = opts.tOutA ?? (tDrop + 1.9), tOutB = tOutA + 1.0;
  const srcIdx = pool.indexOf(oceanId);
  const [sx, sy] = poolXY(srcIdx);
  const tgtIdx = (before[target] || []).length;
  const [tx, ty] = slotXY(target, tgtIdx);
  const hover = opts.hover; // {tier, tArrive, tLeave}
  const [hx, hy] = hover ? slotXY(hover.tier, (before[hover.tier] || []).length) : [tx, ty];
  const bx0 = L.x0, bx1 = Math.max(sx, tx, hx) + L.tile + 60;
  const by0 = Math.min(sy, ty, hy) - 30, by1 = Math.max(sy, ty, hy) + L.tile + 30;
  const zoom = Math.min(opts.zoom ?? 1.6, 1920 / (bx1 - bx0 + 160), 1080 / (by1 - by0));
  const focusX = (bx0 + bx1) / 2, focusY = (by0 + by1) / 2;
  const camAt = t => {
    const zin = P(t, 0.0, tPick + 0.45, ease.inOutCubic), zout = P(t, tOutA, tOutB, ease.inOutCubic);
    const k = zin * (1 - zout);
    return { s: lerp(1, zoom, k), fx: lerp(960, clamp(focusX, 960 / zoom, 1920 - 960 / zoom), k), fy: lerp(540, clamp(focusY, 540 / zoom, 1080 - 540 / zoom), k) };
  };
  return (t) => {
    const placed = {}; for (const k in before) placed[k] = before[k].slice();
    const st = { placed, pool: [], labelPulse: {}, tileGlow: {}, tileScale: {}, rowGlow: {} };
    // pool with reflow after pick
    const picked = t >= tPick;
    const reflow = P(t, tPick + 0.05, tPick + 0.35, ease.outCubic);
    let slot = 0;
    pool.forEach((id, i) => {
      if (id === oceanId) { if (!picked) st.pool.push({ id, slot: i }); return; }
      const from = i, to = picked ? slot : i; slot++;
      st.pool.push({ id, slot: lerp(from, to, picked ? reflow : 0) });
    });
    // hand + drag path
    const handOff = [L.tile * 0.62, L.tile * 0.66];
    const enter = P(t, tPick - 0.5, tPick - 0.05, ease.outCubic);
    let hxp = lerp(1500, sx + handOff[0], enter), hyp = lerp(1080, sy + handOff[1], enter);
    let pressed = P(t, tPick - 0.06, tPick, ease.outQuad);
    if (t >= tPick) {
      let px, py;
      const toA = hover ? hover.tArrive : tDrop - 0.05;
      const k1 = P(t, tPick + 0.05, toA, ease.inOutCubic);
      const ax = hover ? hx : tx, ay = hover ? hy : ty;
      px = lerp(sx, ax, k1); py = lerp(sy, ay, k1) - Math.sin(k1 * Math.PI) * 40;
      if (hover) {
        const wig = t > hover.tArrive && t < hover.tLeave ? Math.sin((t - hover.tArrive) * 9) * 4 : 0;
        px += wig;
        const k2 = P(t, hover.tLeave, tDrop - 0.05, ease.inOutCubic);
        px = lerp(px, tx, k2); py = lerp(py, ty, k2);
      }
      if (t < tDrop) {
        const lift = P(t, tPick, tPick + 0.1, ease.outQuad);
        st.drag = { id: oceanId, x: px, y: py, s: 1 + 0.06 * lift, a: 1 - 0.22 * lift };
        hxp = px + handOff[0]; hyp = py + handOff[1];
      } else {
        placed[target] = (placed[target] || []).concat([oceanId]);
        const b = inv(tDrop, tDrop + 0.22, t);
        st.tileScale[oceanId] = 1 + 0.06 * (1 - ease.outBack(b, 3));
        st.tileGlow[oceanId] = Math.max(0, 1 - inv(tDrop, tDrop + 1.4, t)) * 0.9;
        st.labelPulse[target] = Math.max(0, 1 - inv(tDrop, tDrop + 0.7, t)) * (t < tDrop + 0.08 ? inv(tDrop, tDrop + 0.08, t) : 1);
        st.rowGlow[target] = Math.max(0, 1 - inv(tDrop, tDrop + 1.0, t));
        const away = P(t, tDrop + 0.25, tDrop + 0.9, ease.inOutCubic);
        hxp = tx + handOff[0] + away * 160; hyp = ty + handOff[1] + away * 70;
        pressed = 1 - P(t, tDrop, tDrop + 0.08);
      }
      if (hover && t > hover.tArrive && t < tDrop) st.labelPulse[hover.tier] = 0.35 * Math.max(0, 1 - inv(hover.tArrive, hover.tArrive + 0.5, t));
    }
    const handVis = t < tOutA + 0.4;
    if (handVis) st.hand = { x: hxp, y: hyp, pressed };
    return { st, cam: camAt(t) };
  };
}
