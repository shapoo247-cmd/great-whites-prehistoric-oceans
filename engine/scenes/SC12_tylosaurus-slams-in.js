import { storyScene, kf, blood } from '../lib/cine.js';
import { ease, lerp, clamp } from '../lib/core.js';
export default storyScene({ out: 'scenes/SC12_tylosaurus-slams-the-carcass-sharks-scatter', T0: 360.3, D: 11.4, era: 'cretaceous', seed: 18, depth: 0.34,
  cues: { shared: 'shared meal', slams: 'slams into the carcass', scatter: 'both sharks scatter' },
  sfx: C => [{ name: 'riser', t: C.slams - 1.0, gain: -12 }, { name: 'impact_deep', t: C.slams + 0.4, gain: -2 }, { name: 'whoosh_fast', t: C.scatter, gain: -7 }],
  actors: (C, t) => {
    const hit = clamp((t - (C.slams + 0.3)) / 0.5);
    const car = [950 + hit * 330 + (t > C.slams + 0.3 ? Math.sin((t - C.slams) * 7) * 12 * Math.exp(-(t - C.slams)) : 0), 600 - hit * 120, 0.1 + hit * 0.9];
    const ty = kf([[0, [900, 1500, -1.1]], [C.slams - 0.8, [900, 1300, -1.2]], [C.slams + 0.35, [930, 640, -1.25]], [C.scatter, [1050, 380, -1.0]], [C.D, [1300, -200, -0.8]]], t, ease.inQuad);
    const g1 = t < C.scatter ? [560, 560, 0.0] : kf([[C.scatter, [560, 560, 0.0]], [C.D, [-300, 700, 0.3]]], t, ease.inQuad);
    const g2 = t < C.scatter ? [1330, 560, 0.0] : kf([[C.scatter, [1330, 560, 0.0]], [C.D, [2300, 180, -0.4]]], t, ease.inQuad);
    return [
      { name: 'tylosaurus', pal: 'dead', len: 480, pose: car, flip: true, speed: 0, amp: 0, fog: 0.1 },
      { name: 'greatwhite', pal: 'gw', len: 600, pose: g1, speed: t < C.scatter ? 3 : 8, fog: 0.16 },
      { name: 'cretoxyrhina', pal: 'cret', len: 620, pose: g2, flip: true, speed: t < C.scatter ? 3 : 8, fog: 0.16 },
      { name: 'tylosaurus', pal: 'tylo', len: 1300, pose: ty, speed: 3, fog: 0.12, open: t > C.slams - 0.6 && t < C.slams + 0.5 ? 0.45 : 0, flip: false }];
  },
  fx: (ctx, t, C) => { blood(ctx, t, [950, 560], 0, { n: 18, life: 99, size: 1.4, alpha: 0.24 }); blood(ctx, t, [950, 640], C.slams + 0.3, { n: 24, life: 8, spread: 1.7, size: 1.5, alpha: 0.34, seed: 12 }); },
  shake: (C, t) => Math.exp(-Math.abs(t - C.slams - 0.35) * 5) * 18,
});
