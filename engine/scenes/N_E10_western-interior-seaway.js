// E10 · VO 5:37.5 (full-frame map) "This warm, shallow sea runs straight through the middle of North America, and the other shark is Cretoxyrhina. Nearly complete skeletons from Kansas..."
import { loadVO, rel } from '../lib/vo.js';
import { cap, hair, big, P, ease, lerp, slow, COL } from '../lib/doc.js';
import { geoConicConformal } from '../lib/maps.js';
import { mapBase, sea } from '../lib/docMap.js';
import { pin } from '../lib/maps.js';
import { Water } from '../lib/water.js';
const T0 = 337.4, D = 12.7; const sc = { duration: D, out: '06_doc-style/full-frame/E10_western-interior-seaway-map' };
let R, base, proj, tSea, tCreto, tKansas, W;
const SEA = [[-100, 28], [-103, 31], [-107, 34], [-110, 38], [-112, 42], [-114, 47], [-117, 52], [-121, 58], [-126, 64], [-131, 69], [-118, 71], [-104, 69], [-96, 62], [-96, 55], [-95, 49], [-95, 43], [-93, 37], [-92, 31], [-95, 27]];
sc.setup = async () => { await loadVO(); R = rel(T0); tSea = R.s('this warm shallow', 337); tCreto = R.s('cretoxyrhina', 337); tKansas = R.s('kansas', 337);
  proj = geoConicConformal().rotate([98, 0]).center([0, 46]).parallels([30, 60]).scale(1150).translate([960, 560]); ({ base } = await mapBase(proj)); W = new Water('cretaceous', 14);
  sc.sfx = [{ name: 'whoosh_slow', t: 0.1, gain: -10 }, { name: 'rumble_bed', t: 0.2, gain: -14 }, { name: 'data_blip', t: tSea + 0.9, gain: -10 }, { name: 'sonar_ping', t: tCreto, gain: -8 }, { name: 'data_blip', t: tKansas, gain: -9 }]; };
sc.draw = (ctx, t) => {
  const z = lerp(1.06, 1.0, ease.outCubic(P(t, 0, D))); ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
  ctx.drawImage(base, 0, 0);
  sea(ctx, proj, SEA, t, P(t, tSea, tSea + 3.5, ease.inOutCubic));
  ctx.restore();
  // soft vignette
  W.post(ctx, 3 + t, Math.round(t * 30), { vignette: 0.7, grain: 0.1 });
  const kT = P(t, tSea, tSea + 0.8, slow);
  cap(ctx, 'WESTERN INTERIOR SEAWAY', 120, 150, { font: '500 28px Inter', ls: 14, a: kT });
  cap(ctx, 'LATE CRETACEOUS · NORTH AMERICA', 120, 192, { font: '400 18px Inter', ls: 10, a: kT * 0.8, color: 'rgba(255,255,255,0.75)' });
  const c = proj([-103, 46]), kC = P(t, tCreto, tCreto + 0.7, slow);
  if (kC > 0) { hair(ctx, c[0] + 20, c[1] + 10, c[0] + 140, c[1] - 110, kC, 0.9); cap(ctx, 'CRETOXYRHINA', c[0] + 152, c[1] - 104, { font: '500 24px Inter', ls: 10, a: kC, color: COL.gw }); }
  const kk = P(t, tKansas, tKansas + 0.6, slow), kp = proj([-98, 38.7]); pin(ctx, kp[0], kp[1], kk, COL.gold, (t * 0.6) % 1);
  if (kk > 0) { hair(ctx, kp[0] + 14, kp[1] + 10, kp[0] + 130, kp[1] + 120, kk, 0.9); cap(ctx, 'KANSAS', kp[0] + 142, kp[1] + 134, { font: '500 24px Inter', ls: 10, a: kk, color: COL.gold }); cap(ctx, 'NEARLY COMPLETE SKELETONS', kp[0] + 142, kp[1] + 168, { font: '400 17px Inter', ls: 8, a: kk * 0.85 }); }
};
export default sc;
