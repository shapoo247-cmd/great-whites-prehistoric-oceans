import { storyScene, kf, blood, bubbles } from '../lib/cine.js';
import { ease, lerp, clamp } from '../lib/core.js';
export default storyScene({ out: 'scenes/SC13_great-white-takes-the-whale-calf', T0: 398.4, D: 15.6, era: 'eocene', seed: 19, depth: 0.3,
  cues: { calf: 'young whale', hits: 'hits it once', struggles: 'barely struggles', clean: 'clean kill' },
  sfx: C => [{ name: 'whoosh_slow', t: C.calf, gain: -12 }, { name: 'whoosh_fast', t: C.hits - 0.8, gain: -8 }, { name: 'impact_hit', t: C.hits + 0.2, gain: -3 }, { name: 'data_blip', t: C.clean, gain: -12 }],
  actors: (C, t) => {
    const calf = t < C.hits + 0.25 ? kf([[0, [1280, 700, -0.15]], [C.calf + 2.2, [1320, 200, -0.05]], [C.hits, [1330, 170, 0.0]]], t, ease.inOutCubic) : kf([[C.hits + 0.25, [1330, 170, 0.0]], [C.struggles + 0.5, [1330, 240, 0.25]], [C.D, [1300, 470, 0.7]]], t, ease.inOutCubic);
    const sh = t < C.hits + 0.25 ? kf([[0, [850, 1000, -0.2]], [C.hits - 1.1, [960, 950, -0.5]], [C.hits - 0.2, [1180, 520, -1.25]], [C.hits + 0.25, [1235, 230, -1.35]]], t, ease.inQuad) : kf([[C.hits + 0.25, [1235, 230, -1.35]], [C.hits + 1.4, [1100, 330, -0.7]], [C.D, [900, 520, 0.2]]], t, ease.inOutCubic);
    return [
      { name: 'dorudon', pal: 'doru', len: 380, pose: calf, flip: true, speed: 4, fog: 0.1 },
      { name: 'greatwhite', pal: 'gw', len: 560, pose: sh, speed: 7, fog: 0.16, open: t > C.hits - 0.2 && t < C.hits + 0.9 ? 0.5 : 0 }];
  },
  fx: (ctx, t, C) => { blood(ctx, t, [1250, 215], C.hits + 0.25, { n: 22, life: 7, size: 1.3, alpha: 0.32, seed: 3 }); },
  shake: (C, t) => Math.exp(-Math.abs(t - C.hits - 0.25) * 6) * 10,
});
