import { storyScene, kf, blood } from '../lib/cine.js';
import { ease, lerp, clamp } from '../lib/core.js';
export default storyScene({ out: 'scenes/SC14_basilosaurus-slides-past-takes-a-calf', T0: 444.8, D: 11.6, era: 'eocene', seed: 20, depth: 0.36,
  cues: { long: 'something long', slides: 'slides past', clamp: 'clamps down' },
  sfx: C => [{ name: 'rumble_bed', t: C.long, gain: -8 }, { name: 'whoosh_slow', t: C.slides, gain: -9 }, { name: 'impact_deep', t: C.clamp + 0.2, gain: -3 }],
  actors: (C, t) => {
    const ba = kf([[0, [-1500, 520, 0.02]], [C.slides - 0.5, [200, 540, 0.02]], [C.slides + 2.8, [1500, 520, 0.0]], [C.D, [1900, 440, 0.0]]], t, ease.inOutQuad);
    const calf = kf([[0, [1550, 380, 0.1]], [C.clamp, [1560, 400, 0.08]], [C.D, [1700, 470, 0.3]]], t, ease.inOutCubic);
    return [
      { name: 'dorudon', pal: 'doru', len: 330, pose: calf, flip: true, speed: 4, fog: 0.12 },
      { name: 'greatwhite', pal: 'gw', len: 560, pose: [kf([[0, [700]], [C.slides + 1, [700]], [C.D, [560]]], t)[0] + Math.sin(t) * 6, 760, 0.0], speed: 3, fog: 0.2 },
      { name: 'basilosaurus', pal: 'basi', len: 2000, pose: [ba[0], ba[1], ba[2]], speed: 3, fog: 0.14, open: t > C.clamp - 0.7 && t < C.clamp + 0.7 ? 0.35 : 0 }];
  },
  fx: (ctx, t, C) => blood(ctx, t, [900, 760], 0, { n: 20, life: 99, size: 1.6, alpha: 0.24, seed: 2 }),
});
