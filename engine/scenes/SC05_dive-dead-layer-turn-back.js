import { storyScene, kf, bubbles } from '../lib/cine.js';
import { ease, lerp, clamp } from '../lib/core.js';
export default storyScene({ out: 'scenes/SC05_dive-into-dead-layer-turns-back', T0: 154.3, D: 16.6, era: 'triassic', seed: 12, depth: 0.25, zoom: 1.05,
  cues: { dives: 'so it dives', deeper: 'deeper', dead: 'dead layer', back: 'turns hard back' },
  sfx: C => [{ name: 'whoosh_slow', t: C.dives, gain: -10 }, { name: 'alarm_low', t: C.dead, gain: -12 }, { name: 'whoosh_fast', t: C.back, gain: -9 }],
  pan: (C, t) => [0, kf([[0, 0], [C.dead + 1, 360], [C.back, 380], [C.back + 2.4, 0]], t, ease.inOutCubic)],
  actors: (C, t) => {
    const down = t < C.back; const p = down ? kf([[0, [900, 300, 0.1]], [C.dives + 0.5, [900, 330, 0.5]], [C.deeper + 1.5, [980, 520, 0.9]], [C.dead + 1.5, [1010, 800, 1.1]], [C.back, [1000, 830, 1.0]]], t, ease.inOutCubic) : kf([[C.back, [1000, 830, 1.0]], [C.back + 0.8, [1040, 770, -0.6]], [C.back + 2.6, [1100, 330, -1.25]], [C.D, [1180, 120, -1.2]]], t, ease.inOutCubic);
    return [{ name: 'greatwhite', pal: 'gw', len: 640, pose: p, speed: down ? 3.2 : 8, fog: 0.2 }];
  },
  fx: (ctx, t, C, S, list) => { const g = list[0]; bubbles(ctx, t, [g.pose[0] - 200, g.pose[1] - 20], clamp((t - C.back) / 0.4), { n: 30, spread: 160, rise: 300 }); },
  grade: (ctx, t, C) => { const k = kf([[0, 0], [C.deeper, 0.2], [C.dead + 1.2, 0.72], [C.back, 0.75], [C.back + 2.6, 0.05]], t, ease.inOutQuad); ctx.fillStyle = `rgba(70,8,10,${k * 0.6})`; ctx.fillRect(0, 0, 1920, 1080); const g = ctx.createLinearGradient(0, 0, 0, 1080); g.addColorStop(0, `rgba(0,0,0,0)`); g.addColorStop(1, `rgba(0,0,0,${k * 0.5})`); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); },
});
