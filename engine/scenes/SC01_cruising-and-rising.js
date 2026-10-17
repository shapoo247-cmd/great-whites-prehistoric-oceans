import { storyScene, kf, blood } from '../lib/cine.js';
import { ease, lerp, clamp } from '../lib/core.js';
export default storyScene({ out: 'scenes/SC01_cruising-and-rising', T0: 0, D: 16.3, era: 'devonian', seed: 8, depth: 0.36, zoom: 1.06,
  cues: { rise: 'something is rising', lunge: 'it lunges' },
  sfx: C => [{ name: 'riser', t: C.rise - 0.4, gain: -12 }, { name: 'impact_deep', t: C.rise + 2.5, gain: -12 }],
  actors: (C, t) => [
    { name: 'greatwhite', pal: 'gw', len: 700, pose: kf([[0, [320, 430, 0.02]], [16.3, [900, 410, 0.0]]], t, ease.linear), speed: 4.2, fog: 0.16 },
    { name: 'dunkleosteus', pal: 'dunk', len: 520, pose: kf([[C.rise - 0.2, [250, 1500, -1.2]], [C.rise + 2.6, [270, 1250, -1.1]], [16.3, [380, 985, -0.32]]], t, ease.inOutQuad), speed: 3, fog: lerp(0.85, 0.12, clamp((t - C.rise) / 5.3)), blur: lerp(8, 0, clamp((t - C.rise) / 5)), amp: 1 }].filter(a => a.name !== 'dunkleosteus' || t > C.rise - 0.3),
});
