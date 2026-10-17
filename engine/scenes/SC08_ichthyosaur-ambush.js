import { storyScene, kf, blood, bubbles } from '../lib/cine.js';
import { ease, lerp, clamp } from '../lib/core.js';
export default storyScene({ out: 'scenes/SC08_ichthyosaur-breathes-great-white-ambush', T0: 213.0, D: 19.8, era: 'jurassic', seed: 14, depth: 0.3,
  cues: { shape: 'shape breaks', up: 'straight up', conn: 'connects behind', rolls: 'rolls' },
  sfx: C => [{ name: 'whoosh_slow', t: C.shape, gain: -12 }, { name: 'whoosh_fast', t: C.up + 0.3, gain: -7 }, { name: 'impact_hit', t: C.conn + 0.2, gain: -3 }, { name: 'impact_deep', t: C.rolls, gain: -8 }],
  actors: (C, t) => {
    const roll = clamp((t - C.rolls) / 1.4);
    const ich = kf([[0, [1350, 140, 0.05]], [C.conn, [1350, 160, 0.03]], [C.rolls + 1.6, [1300, 260, 0.3]], [C.D, [1250, 520, 0.9]]], t, ease.inOutCubic);
    const sh = t < C.conn + 0.3 ? kf([[0, [900, 900, -0.3]], [C.up - 0.2, [980, 880, -0.5]], [C.up + 0.4, [1050, 760, -1.25]], [C.conn + 0.25, [1285, 235, -1.32]]], t, ease.inQuad) : kf([[C.conn + 0.3, [1285, 235, -1.32]], [C.conn + 1.3, [1180, 320, -0.8]], [C.D, [900, 700, 0.35]]], t, ease.inOutCubic);
    return [
      { name: 'ichthyosaur', pal: 'ichy', len: 520, pose: [ich[0], ich[1], ich[2] + roll * 1.9], flip: true, speed: 4, fog: 0.12 },
      { name: 'greatwhite', pal: 'gw', len: 560, pose: sh, speed: 7, fog: 0.16, open: t > C.conn - 0.15 && t < C.conn + 0.9 ? 0.55 : 0 }];
  },
  fx: (ctx, t, C) => { blood(ctx, t, [1280, 250], C.conn + 0.2, { n: 26, life: 6, spread: 1.4, size: 1.3, alpha: 0.34 }); bubbles(ctx, t, [1340, 120], 1, { n: 14, spread: 80, rise: 90, seed: 2 }); },
  shake: (C, t) => Math.exp(-Math.abs(t - C.conn - 0.25) * 6) * 12,
});
