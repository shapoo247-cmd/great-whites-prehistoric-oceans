import { storyScene, kf, blood } from '../lib/cine.js';
import { ease, lerp, clamp } from '../lib/core.js';
export default storyScene({ out: 'scenes/SC11_great-white-vs-cretoxyrhina-over-the-carcass', T0: 297.4, D: 39.4, era: 'cretaceous', seed: 17, depth: 0.32, zoom: 1.05,
  cues: { tear: 'tearing into', second: 'second shark', collide: 'they collide', snap: 'jaws snap inches', rake: 'rakes a flank', pass2: 'second pass', drag: 'teeth drag', peel: 'peel away', neither: 'neither one wins' },
  sfx: C => [{ name: 'impact_hit', t: C.tear + 1, gain: -8 }, { name: 'impact_deep', t: C.second + 1.3, gain: -4 }, { name: 'impact_hit', t: C.collide, gain: -5 }, { name: 'impact_hit', t: C.snap, gain: -6 }, { name: 'whoosh_fast', t: C.rake, gain: -8 }, { name: 'impact_hit', t: C.pass2, gain: -6 }, { name: 'whoosh_slow', t: C.peel, gain: -9 }],
  actors: (C, t) => {
    const car = [950 + Math.sin(t * 0.7) * 10 + (t > C.second + 1.2 && t < C.second + 2.4 ? 22 * Math.sin((t - C.second) * 12) : 0), 640 + clamp((t - C.neither) / 4) * 20, 0.1];
    const gw = kf([[0, [250, 380, 0.05]], [C.tear - 1.0, [620, 540, 0.25]], [C.tear + 0.4, [690, 600, 0.3]], [C.collide - 0.4, [740, 560, 0.1]], [C.snap, [830, 540, 0.0]], [C.rake, [760, 600, 0.3]], [C.rake + 2.4, [500, 380, -0.5]], [C.pass2 - 0.4, [640, 560, 0.15]], [C.drag, [800, 580, 0.05]], [C.peel + 0.2, [740, 600, 0.0]], [C.peel + 3.2, [420, 740, 0.1]], [C.D, [330, 760, 0.06]]], t, ease.inOutCubic);
    const cr = kf([[0, [2300, 380, 0.0]], [C.second - 0.5, [2000, 300, 0.1]], [C.second + 1.3, [1250, 600, 0.0]], [C.collide, [1150, 550, 0.05]], [C.snap, [1080, 545, 0.02]], [C.rake + 0.2, [1150, 570, 0.2]], [C.rake + 2.4, [1500, 330, -0.5]], [C.pass2 - 0.2, [1280, 540, 0.15]], [C.drag, [1100, 575, 0.05]], [C.peel + 0.2, [1160, 590, 0.0]], [C.peel + 3.2, [1500, 700, -0.1]], [C.D, [1600, 720, -0.05]]], t, ease.inOutCubic);
    const bite = (a, b) => t > a && t < b ? 0.5 : 0;
    return [
      { name: 'tylosaurus', pal: 'dead', len: 520, pose: car, flip: true, speed: 0, amp: 0, fog: 0.1 },
      { name: 'greatwhite', pal: 'gw', len: 620, pose: gw, speed: 5, fog: 0.16, open: Math.max(bite(C.tear + 0.1, C.tear + 1.3), bite(C.snap - 0.3, C.snap + 0.6), bite(C.drag - 0.4, C.drag + 0.7)) },
      { name: 'cretoxyrhina', pal: 'cret', len: 640, pose: cr, flip: true, speed: 5, fog: 0.16, open: Math.max(bite(C.second + 1.0, C.second + 2.0), bite(C.snap - 0.2, C.snap + 0.7), bite(C.drag - 0.3, C.drag + 0.8)) }];
  },
  fx: (ctx, t, C) => { blood(ctx, t, [900, 620], C.tear + 0.5, { n: 18, life: 60, size: 1.5, alpha: 0.26 }); blood(ctx, t, [1000, 560], C.collide, { n: 24, life: 12, spread: 1.5, size: 1.5, alpha: 0.32, seed: 6 }); blood(ctx, t, [800, 600], C.rake, { n: 20, life: 12, size: 1.3, alpha: 0.3, seed: 8 }); blood(ctx, t, [1100, 580], C.drag, { n: 22, life: 14, size: 1.4, alpha: 0.32, seed: 10 }); },
  shake: (C, t) => (Math.exp(-Math.abs(t - C.collide) * 6) + Math.exp(-Math.abs(t - C.snap) * 6) + Math.exp(-Math.abs(t - C.second - 1.3) * 6)) * 11,
});
