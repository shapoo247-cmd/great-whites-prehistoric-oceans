import { storyScene, kf, blood } from '../lib/cine.js';
import { ease, lerp, clamp } from '../lib/core.js';
export default storyScene({ out: 'scenes/SC15_megalodon-rises-into-the-blood', T0: 492.2, D: 24.6, era: 'pliocene', seed: 21, depth: 0.42, zoom: 1.05,
  cues: { shadow: 'a shadow passes', long: 'takes a long time', leaves: 'leaves the carcass', rises: 'megalodon rises', jerks: 'jerks sideways' },
  sfx: C => [{ name: 'impact_dark', t: C.shadow, gain: -6 }, { name: 'rumble_bed', t: C.shadow, gain: -4 }, { name: 'whoosh_fast', t: C.leaves, gain: -6 }, { name: 'impact_deep', t: C.rises + 1.6, gain: -2 }, { name: 'impact_hit', t: C.jerks, gain: -4 }],
  actors: (C, t) => {
    const flee = clamp((t - C.leaves) / 1.2);
    const gw = t < C.leaves ? [820 + Math.sin(t * 5) * 6, 520 + Math.sin(t * 6) * 4, 0.12] : kf([[C.leaves, [820, 520, 0.12]], [C.leaves + 1.2, [300, 380, -0.5]], [C.D, [-400, 200, -0.5]]], t, ease.inQuad);
    const sh = kf([[C.shadow - 0.6, [-1200, 880, 0.0]], [C.shadow + 3.8, [1200, 880, 0.0]], [C.shadow + 6.8, [3200, 880, 0.0]]], t, ease.inOutQuad);
    const rise = kf([[C.leaves + 4, [900, 1500, -1.2]], [C.rises, [980, 1050, -1.2]], [C.rises + 1.8, [1040, 640, -1.3]], [C.jerks, [1070, 560, -1.1]], [C.jerks + 2.4, [1170, 330, -0.7]], [C.D, [1300, 240, -0.6]]], t, ease.inOutCubic);
    const car = t < C.jerks ? [900, 600, 0.1] : kf([[C.jerks, [900, 600, 0.1]], [C.jerks + 0.5, [1130, 540, -0.2]], [C.D, [1230, 480, -0.3]]], t, ease.outCubic);
    return [
      { name: 'basilosaurus', pal: 'dead', len: 760, pose: car, flip: true, speed: 0, amp: 0, fog: 0.12 },
      { name: 'greatwhite', pal: 'gw', len: 600, pose: gw, speed: t < C.leaves ? 3 : 9, fog: 0.16, open: t < C.leaves - 0.2 ? (Math.sin(t * 2) > 0.4 ? 0.3 : 0) : 0 },
      ...(t > C.shadow - 0.8 && t < C.shadow + 7 ? [{ name: 'megalodon', pal: 'meg', len: 2300, pose: sh, speed: 1.5, fog: 0.5, blur: 4 }] : []),
      ...(t > C.rises - 2 ? [{ name: 'megalodon', pal: 'meg', len: 1400, pose: rise, speed: 2.2, fog: lerp(0.5, 0.1, clamp((t - C.rises) / 3)), open: t > C.rises + 1.2 && t < C.jerks + 2 ? 0.5 : 0 }] : [])];
  },
  fx: (ctx, t, C) => { blood(ctx, t, [900, 600], 0, { n: 24, life: 99, size: 1.7, alpha: 0.26, seed: 5 }); blood(ctx, t, [1080, 540], C.jerks, { n: 24, life: 9, size: 1.5, alpha: 0.34, seed: 14 }); },
  shake: (C, t) => (Math.exp(-Math.abs(t - C.jerks) * 5) * 18 + Math.exp(-Math.abs(t - C.rises - 1.7) * 4) * 10),
});
