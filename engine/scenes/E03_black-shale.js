// VO 1:26.9 -> 1:33.3  "Late Devonian rocks are full of black shale, the record of repeated dead zones where oxygen collapsed." (full frame)
import { text, scrim, corners, P, ease, lerp, clamp, C } from '../lib/ui.js';
import { mulberry, noise1, rgba } from '../lib/core.js';
import { Water } from '../lib/water.js';
const T0 = 86.9, at = s => s - T0, D = 6.4;
// strata: [thickness, kind] kind: 0 pale mudstone/limestone, 1 black shale
const rnd = mulberry(12);
const strata = []; let y = 0;
for (let i = 0; i < 22; i++) { const black = [2, 5, 8, 12, 16].includes(i) || i === 3; const th = black ? 70 + rnd() * 70 : 50 + rnd() * 70; strata.push({ y0: y, y1: y + th, black, seed: rnd() * 50 }); y += th; }
const TOTAL = y;
let W;
function layerPath(ctx, x0, x1, ya, yb, seed) {
  ctx.beginPath(); ctx.moveTo(x0, ya + noise1(seed, 1) * 8);
  for (let x = x0; x <= x1; x += 20) ctx.lineTo(x, ya + noise1(x / 160 + seed, seed) * 10);
  for (let x = x1; x >= x0; x -= 20) ctx.lineTo(x, yb + noise1(x / 160 + seed + 9, seed) * 10);
  ctx.closePath();
}
export default {
  duration: D, out: '05_environment/E03_black-shale',
  sfx: [{ name: 'whoosh_slow', t: 0.05, gain: -8 }, { name: 'rumble_bed', t: 0.2, gain: -10 }, { name: 'stamp', t: at(88.76), gain: -8 }, { name: 'alarm_low', t: at(90.98), gain: -12 }, { name: 'impact_dark', t: at(91.74), gain: -7 }],
  setup() { W = new Water('devonian', 31); },
  draw(ctx, t) {
    // backdrop: dark murk (water) fading to rock
    ctx.fillStyle = '#0b0e09'; ctx.fillRect(0, 0, 1920, 1080);
    const cut = P(t, 0, 0.8, ease.outCubic);
    const scroll = lerp(0, 330, P(t, 0, D, ease.linear)) + 0;
    const X0 = 660, X1 = 1440;
    ctx.save();
    ctx.globalAlpha = cut;
    // rock column
    ctx.beginPath(); ctx.rect(X0, 0, X1 - X0, 1080); ctx.clip();
    const ofs = 120 - scroll;
    const deadK = P(t, at(90.98), at(91.8));
    strata.forEach((s, i) => {
      const ya = s.y0 + ofs, yb = s.y1 + ofs; if (yb < -20 || ya > 1100) return;
      layerPath(ctx, X0 - 10, X1 + 10, ya, yb + 2, s.seed);
      const g = ctx.createLinearGradient(0, ya, 0, yb);
      if (s.black) { g.addColorStop(0, '#0a0b0b'); g.addColorStop(0.5, '#151819'); g.addColorStop(1, '#090a0a'); }
      else { g.addColorStop(0, '#615f50'); g.addColorStop(0.5, '#767360'); g.addColorStop(1, '#575646'); }
      ctx.fillStyle = g; ctx.fill();
      // laminations
      ctx.strokeStyle = s.black ? 'rgba(90,100,105,0.22)' : 'rgba(40,36,28,0.25)'; ctx.lineWidth = 1.2;
      const nl = s.black ? 9 : 4; for (let k = 1; k < nl; k++) { const yy = lerp(ya, yb, k / nl); ctx.beginPath(); for (let x = X0; x <= X1; x += 20) { const yv = yy + noise1(x / 130 + s.seed + k, k) * 4; x === X0 ? ctx.moveTo(x, yv) : ctx.lineTo(x, yv); } ctx.stroke(); }
    });
    // light vignette on the rock column
    const lg = ctx.createLinearGradient(X0, 0, X1, 0); lg.addColorStop(0, 'rgba(0,0,0,0.65)'); lg.addColorStop(0.2, 'rgba(0,0,0,0)'); lg.addColorStop(0.8, 'rgba(0,0,0,0)'); lg.addColorStop(1, 'rgba(0,0,0,0.65)');
    ctx.fillStyle = lg; ctx.fillRect(X0, 0, X1 - X0, 1080);
    // red wash on black layers when dead zones are called out
    strata.forEach(s => { if (!s.black || deadK <= 0) return; const ya = s.y0 + ofs, yb = s.y1 + ofs; layerPath(ctx, X0 - 10, X1 + 10, ya, yb, s.seed); ctx.fillStyle = `rgba(255,106,92,${0.22 * deadK * (0.7 + 0.3 * Math.sin(t * 6 + s.seed))})`; ctx.fill(); });
    ctx.restore();
    // frame edges
    ctx.save(); ctx.globalAlpha = cut; ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 2; ctx.strokeRect(X0, 0, X1 - X0, 1080); ctx.restore();

    W.post(ctx, 4 + t, Math.round(t * 30), { vignette: 0.9, grain: 0.14 });
    // depth/time ruler (left)
    const rk = P(t, 0.15, 0.7);
    ctx.save(); ctx.globalAlpha = rk * 0.9;
    for (let m = 0; m < TOTAL; m += 100) { const yy = m + ofs; if (yy < 40 || yy > 1040) continue; ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(X0 - 40, yy, 28, 2); }
    ctx.restore();
    text(ctx, 'LATE DEVONIAN ROCKS', 110, 150, { font: '400 56px Anton', ls: 3, a: P(t, at(87.08), at(87.08) + 0.5), color: '#fff' });
    text(ctx, 'ROCK RECORD · 370 MILLION YEARS OLD', 112, 192, { font: '700 20px Inter', ls: 4, a: P(t, at(87.4), at(87.9)), color: 'rgba(255,255,255,0.75)' });

    // BLACK SHALE callout pointing at the first visible black layer
    const bs = strata.find(s => s.black && s.y1 + ofs > 380 && s.y0 + ofs < 760) || strata[5];
    const kB = P(t, at(88.76), at(88.76) + 0.55);
    if (kB > 0) {
      const by = (bs.y0 + bs.y1) / 2 + ofs;
      ctx.save(); ctx.globalAlpha = kB; ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.moveTo(X1 - 30, by); ctx.lineTo(X1 + 70 * kB, by); ctx.stroke(); ctx.beginPath(); ctx.arc(X1 - 30, by, 7, 0, 7); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
      text(ctx, 'BLACK SHALE', X1 + 86, by + 14, { font: '400 54px Anton', ls: 3, a: kB });
    }
    // DEAD ZONE tags + oxygen gauge
    const kD = P(t, at(90.98), at(90.98) + 0.5);
    strata.forEach((s, i) => {
      if (!s.black || kD <= 0) return; const yc = (s.y0 + s.y1) / 2 + ofs; if (yc < 60 || yc > 1020) return;
      const k = P(t, at(90.98) + i * 0.0, at(90.98) + 0.5, ease.outBack);
      text(ctx, 'DEAD ZONE', X0 + 36, yc + 9, { font: '800 26px Inter', ls: 5, color: C.threat, a: kD, shadow: true });
    });
    // oxygen meter (left column) -> collapses to zero on "oxygen collapsed"
    const mk = P(t, at(91.2), at(91.7));
    if (mk > 0) {
      const o2 = 1 - P(t, at(91.74), at(92.6), ease.inCubic);
      const x = 110, yy = 330, w = 180, h = 440; // vertical tube
      ctx.save(); ctx.globalAlpha = mk;
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(x - 12, yy - 50, w + 24, h + 120);
      ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2; ctx.strokeRect(x + w / 2 - 36, yy, 72, h);
      ctx.fillStyle = o2 > 0.35 ? C.gw : C.threat; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 14; ctx.fillRect(x + w / 2 - 36, yy + h * (1 - o2), 72, h * o2); ctx.shadowBlur = 0;
      ctx.restore();
      text(ctx, 'OXYGEN', x + w / 2, yy - 18, { font: '800 24px Inter', ls: 5, align: 'center', a: mk, color: C.dim });
      text(ctx, o2 < 0.04 ? 'COLLAPSED' : 'FALLING…', x + w / 2, yy + h + 44, { font: '800 22px Inter', ls: 4, align: 'center', a: mk, color: C.threat });
    }
    // "repeated" tick marks flashing on each dead layer as the VO says "repeated dead zones"
  }
};
