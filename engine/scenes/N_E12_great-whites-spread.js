// E12 · VO 8:57.2 (full-frame map) "They show up in the Pacific around six million years ago, and by four million years ago they're in oceans worldwide. Right alongside megalodon."
import { loadVO, rel } from '../lib/vo.js';
import { cap, hair, big, P, ease, lerp, slow, COL } from '../lib/doc.js';
import { mapBase } from '../lib/docMap.js';
import { pin, geoNaturalEarth1 } from '../lib/maps.js';
import { geoContains } from 'd3-geo';
import { mulberry } from '../lib/core.js';
import { Water } from '../lib/water.js';
const T0 = 537.1, D = 9.2; const sc = { duration: D, out: '06_doc-style/full-frame/E12_great-whites-spread-worldwide-map' };
let R, base, proj, atlas, tPac, tSix, tFour, tAlong, W, dots = [];
const ORIGIN = [-122, 33];
sc.setup = async () => { await loadVO(); R = rel(T0); tPac = R.s('pacific', 537); tSix = R.s('six million', 537); tFour = R.s('four million', 537); tAlong = R.s('alongside megalodon', 537);
  proj = geoNaturalEarth1().scale(345).translate([960, 560]); ({ base, atlas } = await mapBase(proj)); W = new Water('modern', 6);
  const r = mulberry(31); const land = atlas.land;
  while (dots.length < 120) { const lo = -175 + r() * 350, la = -62 + r() * 130; if (!geoContains(land, [lo, la])) dots.push({ lo, la, d: Math.hypot((lo - ORIGIN[0]) * 0.6, la - ORIGIN[1]), s: r() }); }
  dots.sort((a, b) => a.d - b.d);
  sc.sfx = [{ name: 'sonar_ping', t: tPac, gain: -9 }, { name: 'riser', t: tFour - 0.5, gain: -14 }, { name: 'data_blip', t: tAlong, gain: -10 }]; };
sc.draw = (ctx, t) => {
  ctx.drawImage(base, 0, 0);
  const o = proj(ORIGIN), k0 = P(t, tPac, tPac + 0.6), spread = P(t, tFour - 0.2, tAlong - 0.2, ease.inOutCubic);
  dots.forEach((d, i) => { const p = proj([d.lo, d.la]), u = i / dots.length; const k = P(spread, u * 0.8, u * 0.8 + 0.2); if (k <= 0) return; ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = '#9fe8ff'; ctx.shadowColor = '#7fe3ff'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(p[0], p[1], 3 + 3 * d.s, 0, 7); ctx.fill(); ctx.restore(); });
  pin(ctx, o[0], o[1], k0, COL.gw, (t * 0.7) % 1);
  W.post(ctx, 3 + t, Math.round(t * 30), { vignette: 0.7, grain: 0.1 });
  cap(ctx, 'GREAT WHITES · THE FOSSIL RECORD', 120, 770, { font: '500 26px Inter', ls: 12, a: P(t, 0.2, 0.9, slow) });
  const yr = t < tFour - 0.4 ? '~6' : '~4', num = t < tSix - 0.3 ? null : yr;
  if (t >= tSix - 0.3) big(ctx, `${num} MYA`, 120, 880, { size: 110, a: P(t, tSix - 0.3, tSix + 0.3) });
  cap(ctx, 'PACIFIC', o[0] + 36, o[1] - 24, { font: '500 20px Inter', ls: 10, color: COL.gw, a: k0 });
  cap(ctx, 'OCEANS WORLDWIDE', 120, 940, { font: '500 22px Inter', ls: 10, a: P(t, tFour, tFour + 0.6, slow) * (1 - P(t, tAlong - 0.1, tAlong + 0.3)), color: COL.gw });
  cap(ctx, 'RIGHT ALONGSIDE MEGALODON', 120, 940, { font: '500 22px Inter', ls: 10, a: P(t, tAlong, tAlong + 0.6, slow), color: COL.rival || '#ffa64d' });
};
export default sc;
