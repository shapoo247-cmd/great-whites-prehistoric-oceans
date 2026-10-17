import { storyScene, kf, bubbles } from '../lib/cine.js';
import { ease, lerp, clamp } from '../lib/core.js';
export default storyScene({ out: 'scenes/SC07_new-great-white-drops-in-hunting', T0: 207.4, D: 9.0, era: 'jurassic', seed: 13, depth: 0.3,
  cues: { drops: 'drops in', hunting: 'already hunting' },
  sfx: C => [{ name: 'whoosh_water', t: 0.2, gain: -8 }, { name: 'impact_dark', t: C.hunting, gain: -12 }],
  actors: (C, t) => [{ name: 'greatwhite', pal: 'gw', len: 700, pose: kf([[0, [700, -150, 1.0]], [1.6, [820, 280, 0.3]], [3.2, [900, 450, 0.02]], [C.D, [1250, 430, 0.0]]], t, ease.outCubic), speed: 5, fog: 0.15 }],
  fx: (ctx, t, C, S, l) => { bubbles(ctx, t, [700, 120], clamp(1 - (t - 0.5) / 2.5), { n: 50, spread: 260, rise: 260, seed: 4 }); },
});
