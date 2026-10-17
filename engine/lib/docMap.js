// Documentary map look: clean dark relief (no speckle), glowing coastline, soft depth shading, smooth shaded sea polygons.
import { loadAtlas, geoPath } from './maps.js';
import { makeCanvas, noise1 } from './core.js';
export async function mapBase(proj, o = {}) {
  const atlas = await loadAtlas(o.atlas || 'countries-50m');
  const c = makeCanvas(1920, 1080), x = c.getContext('2d'), path = geoPath(proj, x), land = atlas.land || atlas.countries;
  const og = x.createRadialGradient(960, 520, 80, 960, 540, 1250); og.addColorStop(0, o.ocean0 || '#134059'); og.addColorStop(1, o.ocean1 || '#041019'); x.fillStyle = og; x.fillRect(0, 0, 1920, 1080);
  x.beginPath(); path(land); x.shadowColor = 'rgba(0,0,0,0.65)'; x.shadowBlur = 40; x.shadowOffsetY = 10; x.fillStyle = '#23251f'; x.fill(); x.shadowBlur = 0; x.shadowOffsetY = 0;
  x.save(); x.beginPath(); path(land); x.clip();
  const lg = x.createLinearGradient(0, 0, 1920, 1080); lg.addColorStop(0, o.landHi || '#4b4a3b'); lg.addColorStop(1, o.landLo || '#25261f'); x.fillStyle = lg; x.fillRect(0, 0, 1920, 1080);
  // large soft tonal variation (terrain feel) – smooth noise, no speckle
  for (let i = 0; i < 28; i++) { const px = (i * 331) % 1920, py = (i * 197) % 1080, r = 160 + (i % 5) * 70; const g = x.createRadialGradient(px, py, 0, px, py, r); const lite = noise1(i * 1.7, 4) > 0; g.addColorStop(0, lite ? 'rgba(210,200,160,0.10)' : 'rgba(0,0,0,0.16)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(px - r, py - r, r * 2, r * 2); }
  x.restore();
  x.lineJoin = 'round'; x.beginPath(); path(land); x.strokeStyle = 'rgba(0,0,0,0.45)'; x.lineWidth = 3; x.stroke();
  x.save(); x.beginPath(); path(land); x.shadowColor = 'rgba(150,225,240,0.85)'; x.shadowBlur = 16; x.strokeStyle = 'rgba(190,235,245,0.55)'; x.lineWidth = 1.4; x.stroke(); x.restore();
  return { atlas, base: c };
}
// smooth closed lon/lat ring (Catmull-Rom)
export function smoothRing(ctx, proj, ring) {
  const P = ring.map(p => proj(p)), n = P.length; ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]);
  for (let i = 0; i < n; i++) { const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n]; ctx.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]); }
  ctx.closePath();
}
// shaded sea polygon: gradient fill, bright inner edge, drifting shimmer; reveal 0..1 sweeps bottom->top
export function sea(ctx, proj, ring, t, reveal = 1, c = { a: '#38b8b0', b: '#136a78', edge: 'rgba(200,255,245,0.9)' }) {
  if (reveal <= 0) return; ctx.save(); const yTop = 1080 - 1180 * reveal; ctx.beginPath(); ctx.rect(0, yTop, 1920, 1200); ctx.clip();
  smoothRing(ctx, proj, ring); const g = ctx.createLinearGradient(0, 0, 0, 1080); g.addColorStop(0, c.a); g.addColorStop(1, c.b); ctx.globalAlpha = 0.78; ctx.fillStyle = g; ctx.fill(); ctx.globalAlpha = 1;
  ctx.save(); smoothRing(ctx, proj, ring); ctx.clip(); ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 5; i++) { const x = ((t * 40 + i * 420) % 2300) - 300; const lg = ctx.createLinearGradient(x, 0, x + 260, 300); lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(0.5, 'rgba(210,255,245,0.12)'); lg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = lg; ctx.fillRect(x - 100, 0, 500, 1080); }
  ctx.restore();
  smoothRing(ctx, proj, ring); ctx.lineWidth = 14; ctx.strokeStyle = 'rgba(160,255,235,0.18)'; ctx.stroke();
  ctx.lineWidth = 2; ctx.strokeStyle = c.edge; ctx.shadowColor = 'rgba(150,255,230,0.9)'; ctx.shadowBlur = 16; ctx.stroke(); ctx.restore();
}
