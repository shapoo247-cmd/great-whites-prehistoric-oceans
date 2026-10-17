import { storyScene, kf, blood } from '../lib/cine.js';
import { ease } from '../lib/core.js';
export default storyScene({ out: 'scenes/SC10_great-white-circles-once-turns-away', T0: 271.5, D: 5.4, era: 'jurassic', seed: 16, depth: 0.34,
  cues: { circles: 'circles once' }, sfx: C => [{ name: 'whoosh_slow', t: 0.3, gain: -11 }],
  actors: (C, t) => { const p = kf([[0, [500, 520, 0.0]], [1.4, [900, 600, 0.35]], [2.6, [1250, 480, -0.7]], [3.6, [1100, 330, -2.6]], [D(C), [500, 260, -3.1]]], t, ease.inOutCubic); return [{ name: 'greatwhite', pal: 'gw', len: 620, pose: p, flip: t > 3.4, speed: 5, fog: 0.16 }]; },
  fx: (ctx, t, C) => blood(ctx, t, [1500, 560], 0, { n: 26, life: 40, size: 1.8, alpha: 0.3, seed: 7 }),
});
function D(C) { return C.D; }
