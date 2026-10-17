import { storyScene, kf } from '../lib/cine.js';
import { ease, lerp, clamp } from '../lib/core.js';
export default storyScene({ out: 'scenes/SC03_great-white-circles-dunkleosteus-backs-off', T0: 41.6, D: 12.2, era: 'devonian', seed: 9, depth: 0.36,
  cues: { circ: 'circles low', backs: 'backs off' },
  sfx: C => [{ name: 'whoosh_slow', t: C.circ, gain: -10 }, { name: 'whoosh_fast', t: C.circ + 3.0, gain: -10 }, { name: 'impact_dark', t: C.backs, gain: -10 }],
  actors: (C, t) => {
    const dk = kf([[0, [1320, 430, 0.08]], [C.circ + 3.5, [1300, 440, 0.12]], [C.backs - 0.3, [1290, 435, 0.1]], [C.backs + 2.2, [1700, 300, -0.35]], [C.D, [1950, 200, -0.45]]], t, ease.inOutCubic);
    const back = t > C.circ + 3.7;
    const gw = back ? kf([[C.circ + 3.7, [1400, 600, -0.55]], [C.circ + 4.6, [1180, 560, 0.1]], [C.D, [930, 520, 0.05]]], t, ease.inOutCubic) : kf([[0, [380, 470, 0.0]], [C.circ, [500, 560, 0.15]], [C.circ + 1.3, [800, 770, 0.1]], [C.circ + 2.6, [1250, 790, -0.15]], [C.circ + 3.7, [1450, 640, -0.6]]], t, ease.inOutCubic);
    return [
      { name: 'greatwhite', pal: 'gw', len: 640, pose: gw, flip: back, speed: 5, fog: 0.15 },
      { name: 'dunkleosteus', pal: 'dunk', len: 560, pose: dk, flip: true, speed: 2.6, fog: lerp(0.1, 0.5, clamp((t - C.backs) / 3)) }];
  } });
