// Realistic dark-relief map renderer (world-atlas land/countries + d3-geo).
import { geoPath, geoMercator, geoNaturalEarth1, geoOrthographic, geoGraticule10, geoConicConformal } from 'd3-geo';
import { feature } from 'topojson-client';
import { makeCanvas, mulberry } from './core.js';
export { geoMercator, geoNaturalEarth1, geoOrthographic, geoConicConformal, geoPath, geoGraticule10 };
const cache = {};
export async function loadAtlas(name = 'countries-50m') {
  if (cache[name]) return cache[name];
  const topo = await (await fetch(`node_modules/world-atlas/${name}.json`)).json();
  const out = { topo };
  if (topo.objects.countries) out.countries = feature(topo, topo.objects.countries);
  if (topo.objects.land) out.land = feature(topo, topo.objects.land);
  return (cache[name] = out);
}
// Paint a static base map (ocean gradient + land relief + coastline glow) into an offscreen canvas.
export function baseMap(proj, atlas, o = {}) {
  const c = makeCanvas(1920, 1080), x = c.getContext('2d');
  const g = x.createRadialGradient(960, 480, 100, 960, 540, 1300);
  g.addColorStop(0, o.ocean0 || '#163a52'); g.addColorStop(1, o.ocean1 || '#06121c');
  x.fillStyle = g; x.fillRect(0, 0, 1920, 1080);
  // subtle bathymetry noise
  const r = mulberry(5); x.globalAlpha = 0.05;
  for (let i = 0; i < 900; i++) { x.fillStyle = r() > 0.5 ? '#ffffff' : '#000000'; x.beginPath(); x.arc(r() * 1920, r() * 1080, 30 + r() * 120, 0, 7); x.fill(); }
  x.globalAlpha = 1;
  const path = geoPath(proj, x);
  // graticule
  x.beginPath(); path(geoGraticule10()); x.strokeStyle = 'rgba(255,255,255,0.06)'; x.lineWidth = 1; x.stroke();
  const landGeo = atlas.land || atlas.countries;
  // land shadow/glow
  x.save(); x.shadowColor = 'rgba(0,0,0,0.6)'; x.shadowBlur = 24; x.shadowOffsetY = 6;
  x.beginPath(); path(landGeo); x.fillStyle = o.land || '#3a3a30'; x.fill(); x.restore();
  // relief: inner light from top-left
  x.save(); x.beginPath(); path(landGeo); x.clip();
  const lg = x.createLinearGradient(0, 0, 1920, 1080); lg.addColorStop(0, o.landHi || '#5e5a48'); lg.addColorStop(1, o.landLo || '#2a2a22');
  x.fillStyle = lg; x.fillRect(0, 0, 1920, 1080);
  x.globalAlpha = 0.18; for (let i = 0; i < 1400; i++) { x.fillStyle = r() > 0.5 ? '#d8cfae' : '#0d0d08'; x.beginPath(); x.arc(r() * 1920, r() * 1080, 4 + r() * 26, 0, 7); x.fill(); }
  x.restore();
  if (atlas.countries && o.borders !== false) { x.beginPath(); path(atlas.countries); x.strokeStyle = 'rgba(255,255,255,0.10)'; x.lineWidth = 0.8; x.stroke(); }
  x.beginPath(); path(landGeo); x.strokeStyle = 'rgba(190,230,240,0.45)'; x.lineWidth = 1.4; x.stroke();
  return c;
}
export function pin(ctx, x, y, k, color = '#ff6a5c', pulse = 0) {
  if (k <= 0) return;
  ctx.save();
  for (let i = 0; i < 2; i++) { const pk = (pulse + i * 0.5) % 1; ctx.globalAlpha = k * (1 - pk) * 0.7; ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, 10 + pk * 46, 0, 7); ctx.stroke(); }
  ctx.globalAlpha = k; ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.shadowBlur = 0; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, 7); ctx.fill();
  ctx.restore();
}
