// E11 · VO 6:54.9 (full-frame map) "This is the Tethys Sea, along a coastline that's now desert in Egypt. And it's full of exactly what great whites are built to eat."
import { loadVO, rel } from '../lib/vo.js';
import { cap, hair, P, ease, lerp, slow, COL } from '../lib/doc.js';
import { mapBase, sea } from '../lib/docMap.js';
import { pin, geoMercator } from '../lib/maps.js';
import { Water } from '../lib/water.js';
const T0 = 414.8, D = 8.7; const sc = { duration: D, out: '06_doc-style/full-frame/E11_tethys-sea-egypt-map' };
let R, base, proj, tSea, tDesert, tFull, W;
const TETHYS = [[24.5, 31.2], [26.5, 29.9], [28.6, 28.9], [30.4, 28.6], [31.8, 28.9], [33.0, 30.0], [34.4, 31.2], [34.4, 31.8], [34.4, 33.2], [24.5, 33.2], [24.0, 32.0]];
sc.setup = async () => { await loadVO(); R = rel(T0); tSea = R.s('tethys', 414); tDesert = R.s('now desert', 414); tFull = R.s('full of exactly', 414);
  proj = geoMercator().center([29, 31.5]).scale(2300).translate([960, 540]); ({ base } = await mapBase(proj, { atlas: 'countries-50m' })); W = new Water('eocene', 9);
  sc.sfx = [{ name: 'whoosh_slow', t: 0.1, gain: -10 }, { name: 'rumble_bed', t: 0.2, gain: -14 }, { name: 'data_blip', t: tSea, gain: -10 }, { name: 'data_blip', t: tDesert, gain: -10 }]; };
sc.draw = (ctx, t) => {
  const z = lerp(1.05, 1.0, ease.outCubic(P(t, 0, D))); ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
  ctx.drawImage(base, 0, 0);
  sea(ctx, proj, TETHYS, t, P(t, tSea - 0.3, tSea + 2.8, ease.inOutCubic) , { a: '#58c8a8', b: '#1d7a70', edge: 'rgba(210,255,235,0.9)' });
  const e = proj([30.2, 26.9]); pin(ctx, e[0], e[1], P(t, tDesert, tDesert + 0.5), COL.gold, (t * 0.6) % 1);
  ctx.restore();
  W.post(ctx, 3 + t, Math.round(t * 30), { vignette: 0.7, grain: 0.1 });
  const kT = P(t, tSea, tSea + 0.8, slow);
  cap(ctx, 'TETHYS SEA', 120, 150, { font: '500 28px Inter', ls: 14, a: kT }); cap(ctx, 'LATE EOCENE · 37 MILLION YEARS AGO', 120, 192, { font: '400 18px Inter', ls: 10, a: kT * 0.8, color: 'rgba(255,255,255,0.75)' });
  const kd = P(t, tDesert, tDesert + 0.6, slow), ep = proj([30.2, 26.9]);
  if (kd > 0) { hair(ctx, ep[0] + 14, ep[1] + 6, ep[0] + 140, ep[1] + 100, kd, 0.9); cap(ctx, 'EGYPT · NOW DESERT', ep[0] + 152, ep[1] + 112, { font: '500 24px Inter', ls: 10, a: kd, color: COL.gold }); }
  cap(ctx, 'FULL OF EXACTLY WHAT GREAT WHITES EAT', 1800, 980, { align: 'right', font: '500 20px Inter', ls: 9, a: P(t, tFull, tFull + 0.7, slow) });
};
export default sc;
