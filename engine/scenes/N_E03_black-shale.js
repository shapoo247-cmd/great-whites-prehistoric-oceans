// E03 · VO 1:26.9 (full-frame)  "Late Devonian rocks are full of black shale, the record of repeated dead zones where oxygen collapsed."
import { loadVO, rel } from '../lib/vo.js';
import { cap, hair, big, P, ease, lerp, slow, COL } from '../lib/doc.js';
import { mulberry, noise1, mix } from '../lib/core.js';
import { Water } from '../lib/water.js';
const T0 = 86.9, D = 6.5; const sc = { duration: D, out: 'full-frame/E03_black-shale-dead-zones' };
let R, tRocks, tShale, tDead, tOx, W;
const rnd = mulberry(21), strata = []; let yy = 0;
for (let i = 0; i < 26; i++) { const black = [2, 5, 8, 12, 15, 19].includes(i); const th = black ? 70 + rnd() * 70 : 55 + rnd() * 80; strata.push({ y0: yy, y1: yy + th, black, seed: rnd() * 50 }); yy += th; }
sc.setup = async () => { await loadVO(); R = rel(T0); tRocks = R.s('late devonian', 86); tShale = R.s('black shale', 86); tDead = R.s('dead zones', 86); tOx = R.s('oxygen collapsed', 86); W = new Water('devonian', 31);
  sc.sfx = [{ name: 'whoosh_slow', t: 0.05, gain: -10 }, { name: 'rumble_bed', t: 0.2, gain: -10 }, { name: 'stamp', t: tShale, gain: -9 }, { name: 'alarm_low', t: tDead, gain: -12 }, { name: 'impact_dark', t: tOx, gain: -8 }]; };
function layer(ctx, x0, x1, ya, yb, seed) { ctx.beginPath(); ctx.moveTo(x0, ya); for (let x = x0; x <= x1; x += 20) ctx.lineTo(x, ya + noise1(x / 170 + seed, seed) * 10); for (let x = x1; x >= x0; x -= 20) ctx.lineTo(x, yb + noise1(x / 170 + seed + 9, seed) * 10); ctx.closePath(); }
sc.draw = (ctx, t) => {
  ctx.fillStyle = '#080a07'; ctx.fillRect(0, 0, 1920, 1080);
  const ofs = 120 - lerp(0, 330, t / D);
  const dead = P(t, tDead, tOx + 0.7, slow);
  strata.forEach(s => {
    const ya = s.y0 + ofs, yb = s.y1 + ofs; if (yb < -20 || ya > 1100) return;
    layer(ctx, -10, 1930, ya, yb + 2, s.seed);
    const g = ctx.createLinearGradient(0, ya, 0, yb);
    if (s.black) { g.addColorStop(0, '#0a0b0b'); g.addColorStop(0.5, '#151819'); g.addColorStop(1, '#090a0a'); } else { g.addColorStop(0, '#6d6a56'); g.addColorStop(0.5, '#827e68'); g.addColorStop(1, '#5f5d4c'); }
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = s.black ? 'rgba(110,120,125,0.18)' : 'rgba(35,32,24,0.28)'; ctx.lineWidth = 1.2;
    for (let k = 1; k < (s.black ? 10 : 5); k++) { const y = lerp(ya, yb, k / (s.black ? 10 : 5)); ctx.beginPath(); for (let x = 0; x <= 1920; x += 20) { const yv = y + noise1(x / 140 + s.seed + k, k) * 4; x ? ctx.lineTo(x, yv) : ctx.moveTo(x, yv); } ctx.stroke(); }
    if (s.black && dead > 0) { layer(ctx, -10, 1930, ya, yb, s.seed); ctx.fillStyle = `rgba(190,40,30,${0.34 * dead * (0.75 + 0.25 * Math.sin(t * 5 + s.seed))})`; ctx.fill(); }
  });
  // raking light from the left + vignette so the layers read as real rock
  const lg = ctx.createLinearGradient(0, 0, 1920, 0); lg.addColorStop(0, 'rgba(255,240,200,0.10)'); lg.addColorStop(0.5, 'rgba(0,0,0,0)'); lg.addColorStop(1, 'rgba(0,0,0,0.55)'); ctx.fillStyle = lg; ctx.fillRect(0, 0, 1920, 1080);
  W.post(ctx, 4 + t, Math.round(t * 30), { vignette: 0.75, grain: 0.14 });
  // quiet labels
    const bs = strata.find(s => s.black && s.y1 + ofs > 380 && s.y0 + ofs < 760) || strata[5];
  const kB = P(t, tShale, tShale + 0.6, slow), by = (bs.y0 + bs.y1) / 2 + ofs;
  if (kB > 0) { hair(ctx, 1080, by, 1380, by, kB, 0.9); cap(ctx, 'BLACK SHALE', 1400, by + 18, { font: '400 54px Inter', ls: 6, a: kB }); }
  const kD = P(t, tDead, tDead + 0.6, slow);
};
export default sc;
