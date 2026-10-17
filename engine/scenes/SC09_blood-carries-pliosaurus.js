import { storyScene, kf, blood } from '../lib/cine.js';
import { ease, lerp, clamp } from '../lib/core.js';
export default storyScene({ out: 'scenes/SC09_pliosaurus-takes-the-kill', T0: 241.5, D: 15.2, era: 'jurassic', seed: 15, depth: 0.34,
  cues: { food: 'full of food', blood: 'blood carries', big: 'much bigger', jaws: 'jaws close', lets: 'lets go' },
  sfx: C => [{ name: 'rumble_bed', t: C.big - 0.5, gain: -8 }, { name: 'impact_deep', t: C.jaws + 0.1, gain: -2 }, { name: 'whoosh_fast', t: C.lets, gain: -8 }],
  actors: (C, t) => {
    const lunge = clamp((t - (C.jaws - 0.6)) / 0.6);
    const pl = kf([[0, [2900, 420, 0.0]], [C.big, [2600, 430, 0.0]], [C.jaws - 0.6, [2050, 440, 0.02]], [C.jaws, [1500, 470, 0.05]], [C.D, [1380, 470, 0.05]]], t, ease.inOutCubic);
    const gwx = t < C.lets ? 700 + Math.sin(t) * 8 : lerp(700, 150, ease.inOutCubic(clamp((t - C.lets) / 1.6)));
    const car = [kf([[0, [900]], [C.jaws + 0.3, [900]], [C.jaws + 1.5, [720]]], t, ease.outCubic)[0] + Math.sin(t * 0.8) * 6, 520 + (t > C.jaws ? 18 : 0), 0.06 + (t > C.jaws ? 0.05 * Math.sin(t * 11) * Math.exp(-(t - C.jaws) * 2) : 0)];
    return [
      { name: 'ichthyosaur', pal: 'dead', len: 380, pose: car, flip: true, speed: 0, amp: 0, fog: 0.1 },
      { name: 'greatwhite', pal: 'gw', len: 560, pose: [gwx, 540, 0.0], flip: t >= C.lets, speed: t < C.lets ? 3 : 7, fog: 0.16 },
      { name: 'pliosaurus', pal: 'plio', len: 1250, pose: pl, flip: true, speed: 2.5, fog: 0.12, open: t > C.big + 1.2 && t < C.jaws - 0.35 ? 0.55 : t >= C.jaws - 0.35 && t < C.jaws + 0.1 ? 0.55 * (1 - (t - C.jaws + 0.35) / 0.45) : (t >= C.jaws + 0.1 && t < C.lets + 1 ? 0.04 : 0) }];
  },
  fx: (ctx, t, C) => { blood(ctx, t, [900, 520], 0.2, { n: 20, life: 30, spread: 1.0, size: 1.5, alpha: 0.26 }); blood(ctx, t, [820, 520], C.jaws, { n: 22, life: 6, spread: 1.6, size: 1.4, alpha: 0.34 }); },
  shake: (C, t) => Math.exp(-Math.abs(t - C.jaws - 0.1) * 5) * 14,
});
