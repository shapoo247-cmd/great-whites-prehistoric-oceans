// FULL-SCREEN SCENE 02 · VO 0:16.2 -> 0:28.4  "It lunges. Its jaws snap open in about a fiftieth of a second, fast enough to suck prey straight in. The great white twists away, and blades of bone close on empty water."
import { loadVO, rel } from '../lib/vo.js';
import { Seascape } from '../lib/seascape.js';
import { lit } from '../lib/doc.js';
import { kf, jawCreature, suction, bubbles } from '../lib/cine.js';
import { ease, lerp, clamp, noise1 } from '../lib/core.js';
const T0 = 16.2, D = 12.2; const sc = { duration: D, out: 'scenes/SC02_dunkleosteus-lunge' };
let S, R, tLunge, tSnap, tSuck, tTwist, tBlades;
const GWREAL = { colors: { back: '#232d36', flank: '#55656f', belly: '#dfe6e8' }, rim: 'rgba(215,238,248,0.7)' };
const DUNK = { colors: { back: '#1b2216', flank: '#4a5538', belly: '#9aa27c', armorTop: 'rgba(52,48,34,0.85)', armorBot: 'rgba(120,114,88,0.65)' }, rim: 'rgba(225,235,170,0.65)' };
sc.setup = async () => { await loadVO(); R = rel(T0); S = new Seascape('devonian', 8); tLunge = R.s('it lunges', 16); tSnap = R.s('snap open', 17); tSuck = R.s('suck prey', 21); tTwist = R.s('twists away', 24); tBlades = R.s('blades of bone', 25);
  sc.sfx = [{ name: 'rumble_bed', t: 0, gain: -10 }, { name: 'whoosh_fast', t: tLunge, gain: -6 }, { name: 'impact_hit', t: tSnap, gain: -4 }, { name: 'whoosh_water', t: tSuck, gain: -9 }, { name: 'whoosh_fast', t: tTwist, gain: -8 }, { name: 'impact_deep', t: tBlades + 1.0, gain: -6 }]; };
sc.draw = (ctx, t) => {
  // camera: slow push-in, small shake on the lunge and on the miss
  const shake = (e) => Math.exp(-Math.abs(t - e) * 7) * 9, cx = noise1(t * 30, 1) * (shake(tSnap) + shake(tBlades + 1.0)), cy = noise1(t * 30, 2) * (shake(tSnap) + shake(tBlades + 1.0));
  const z = lerp(1.0, 1.08, ease.inOutQuad(clamp(t / D)));
  ctx.save(); ctx.translate(960 + cx, 540 + cy); ctx.scale(z, z); ctx.translate(-960, -540);
  ctx.filter = 'blur(2.5px)'; S.draw(ctx, t, { depth: 0.38, camX: t * 28 }); ctx.filter = 'none';
  // great white: calm, then twists away
  const gw = kf([[0, [900, 410, 0.0]], [tTwist - 0.4, [930, 405, 0.02]], [tTwist + 0.5, [1010, 360, -0.55]], [tTwist + 1.6, [1380, 190, -0.85]], [D, [1900, -60, -0.85]]], t, ease.inOutCubic);
  const gwSpeed = 1 + 6 * clamp((t - tTwist) / 1.2);
  // dunkleosteus: rises, lunges, gapes, misses, closes jaws on empty water
  const dk = kf([[0, [380, 980, -0.30, 520]], [tLunge, [430, 920, -0.34, 520]], [tSnap - 0.1, [700, 640, -0.78, 560]], [tSnap + 0.2, [790, 560, -0.86, 580]], [tTwist, [850, 545, -0.88, 585]], [tBlades + 1.0, [1010, 440, -0.9, 590]], [D, [1060, 400, -0.8, 560]]], t, ease.inOutCubic);
  const open = t < tSnap ? 0 : t < tBlades + 0.9 ? clamp((t - tSnap) / 0.12) * 0.75 : 0.75 * (1 - clamp((t - tBlades - 0.9) / 0.35) ** 0.6);
  const dkO = { x: dk[0], y: dk[1], len: dk[3], angle: dk[2], phase: t * 3.2, flip: false };
  const gwO = { x: gw[0], y: gw[1], len: 700, angle: gw[2], phase: t * 5 * gwSpeed };
  lit(ctx, 'greatwhite', { pal: 'grey', ...GWREAL, ...gwO, caus: S.w.caus, ct: t, fog: ['#142022', 0.18] });
  // suction pulls water toward the mouth while the jaws are open
  
  const info = jawCreature(ctx, 'dunkleosteus', dkO, open, () => lit(ctx, 'dunkleosteus', { pal: 'grey', ...dkO, ...DUNK, caus: S.w.caus, ct: t, fog: ['#142022', 0.10] }));
  if (info) { suction(ctx, t, info.mouth, clamp((t - tSnap) / 0.4) * (1 - clamp((t - tBlades - 0.9) / 0.5)), { R: 520, n: 90 }); bubbles(ctx, t, info.mouth, clamp((t - tSuck) / 0.5) * (1 - clamp((t - tBlades - 2) / 1)), { n: 36 }); }
  // great white's wake bubbles when it bolts
  bubbles(ctx, t, [gw[0] - 300, gw[1] + 30], clamp((t - tTwist) / 0.3) * (1 - clamp((t - tTwist - 2.5) / 1)), { n: 26, seed: 21, spread: 200, rise: 220 });
  // light shafts passing in front of the animals (depth cue)
  ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let i = 0; i < 4; i++) { const x = 300 + i * 450 + noise1(t * 0.2 + i, 4) * 80; const g = ctx.createLinearGradient(x, 0, x + 260, 900); g.addColorStop(0, 'rgba(235,245,190,0.13)'); g.addColorStop(1, 'rgba(235,245,190,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, -50); ctx.lineTo(x + 110, -50); ctx.lineTo(x + 420, 1100); ctx.lineTo(x + 160, 1100); ctx.closePath(); ctx.filter = 'blur(10px)'; ctx.fill(); } ctx.restore(); ctx.filter = 'none';
  ctx.restore();
  // vignette for mood
  const g = ctx.createRadialGradient(960, 540, 420, 960, 540, 1150); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.5)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
  const fi = Math.min(clamp(t / 0.5), clamp((D - t) / 0.6)); ctx.fillStyle = `rgba(0,0,0,${1 - fi})`; ctx.fillRect(0, 0, 1920, 1080);
};
export default sc;
