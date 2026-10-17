// E14 · VO 9:15.3  "Megalodon needed enormous meals... A great white can live on seals, fish, dolphins, or a dead whale it finds by smell."
import { loadVO, rel } from '../lib/vo.js';
import { cap, hair, big, veil, P, ease, lerp, fadeEdges, slow, COL } from '../lib/doc.js';
import { lit } from '../lib/doc.js';
const T0 = 555.3, D = 12.6; const sc = { duration: D, out: '06_doc-style/overlays/E14_diet-megalodon-vs-great-white', alpha: true, qscale: 20 };
let R, tBut, tMeg, tGw, tSeal, tFish, tDol, tWhale;
sc.setup = async () => { await loadVO(); R = rel(T0); tBut = R.s('built the same', 555); tMeg = R.s('enormous meals', 555); tGw = R.s('a great white can', 555); tSeal = R.s('seals', 561); tFish = R.s('fish', 562); tDol = R.s('dolphins', 563); tWhale = R.s('dead whale', 564);
  sc.sfx = [{ name: 'impact_deep', t: tMeg, gain: -12 }, { name: 'data_blip', t: tSeal, gain: -12 }, { name: 'data_blip', t: tFish, gain: -12 }, { name: 'data_blip', t: tDol, gain: -12 }, { name: 'sonar_ping', t: tWhale, gain: -12 }]; };
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.5, 0.9);
  veil(ctx, 120, 240, 1700, 700, 0.30);
  // left: megalodon, one huge meal
  const km = P(t, tMeg - 0.3, tMeg + 0.8, slow);
  cap(ctx, 'MEGALODON', 460, 330, { align: 'center', font: '500 24px Inter', ls: 12, a: km, color: '#ffa64d' });
  ctx.save(); ctx.globalAlpha *= km; lit(ctx, 'megalodon', { pal: 'rival', x: 440, y: 560, len: 640, phase: t * 2 }); ctx.restore();
  ctx.save(); ctx.globalAlpha *= km; lit(ctx, 'dorudon', { pal: 'prey', x: 650, y: 700, len: 300, phase: 0, amp: 0, angle: 0.25 }); ctx.restore();
    // divider
  hair(ctx, 960, 300, 960, 860, P(t, tGw - 0.3, tGw + 0.6, ease.outCubic), 0.5);
  // right: great white, many options
  const kg = P(t, tGw - 0.1, tGw + 0.8, slow);
  cap(ctx, 'GREAT WHITE', 1420, 330, { align: 'center', font: '500 24px Inter', ls: 12, a: kg, color: '#7fe3ff' });
  ctx.save(); ctx.globalAlpha *= kg; lit(ctx, 'greatwhite', { pal: 'gw', x: 1420, y: 480, len: 400, phase: t * 4 }); ctx.restore();
  const items = [[tSeal, 'SEALS', 1060, (x, y, a) => { ctx.save(); ctx.globalAlpha *= a; lit(ctx, 'seal', { pal: 'grey', x, y, len: 150, phase: t * 4, fogA: 0.02 }); ctx.restore(); }], [tFish, 'FISH', 1210, (x, y, a) => { ctx.save(); ctx.globalAlpha *= a; lit(ctx, 'fish', { pal: 'grey', x, y, len: 110, phase: t * 6, fogA: 0.02 }); ctx.restore(); }], [tDol, 'DOLPHINS', 1370, (x, y, a) => { ctx.save(); ctx.globalAlpha *= a; lit(ctx, 'dolphin', { pal: 'grey', x, y, len: 190, phase: t * 4, fogA: 0.02 }); ctx.restore(); }]];
  items.forEach(([tt, name, x, draw]) => { const k = P(t, tt - 0.1, tt + 0.5, ease.outBack), ka = P(t, tt - 0.1, tt + 0.5); draw(x, 690 - (1 - Math.min(k, 1)) * 20, ka);  });
  const kw = P(t, tWhale - 0.1, tWhale + 0.6, slow);
  if (kw > 0) { ctx.save(); ctx.globalAlpha *= kw; lit(ctx, 'dorudon', { pal: 'prey', x: 1620, y: 700, len: 210, phase: 0, amp: 0, angle: -0.45 }); ctx.strokeStyle = 'rgba(160,235,255,0.8)'; ctx.lineWidth = 2; for (let i = 0; i < 3; i++) { const a = (t * 0.8 + i / 3) % 1; ctx.globalAlpha = kw * (1 - a) * 0.8; ctx.beginPath(); ctx.arc(1620, 700, 40 + a * 120, -0.9, 0.9); ctx.stroke(); } ctx.restore(); }
  ctx.restore();
};
export default sc;
