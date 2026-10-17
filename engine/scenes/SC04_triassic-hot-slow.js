import { storyScene, kf } from '../lib/cine.js';
import { ease, lerp, clamp, noise1 } from '../lib/core.js';
export default storyScene({ out: 'scenes/SC04_triassic-hot-water-great-white-slows', T0: 119.2, D: 9.4, era: 'triassic', seed: 11, depth: 0.2, zoom: 1.1,
  cues: { tub: 'hot tub', slows: 'the great white slows', gills: 'gills are working' },
  sfx: C => [{ name: 'riser', t: 0.2, gain: -14 }, { name: 'data_blip', t: C.slows, gain: -12 }, { name: 'heartbeat', t: C.gills, gain: -8 }],
  actors: (C, t) => [{ name: 'greatwhite', pal: 'gw', len: 720, pose: [lerp(820, 1000, clamp(t / C.D)), 470 + Math.sin(t * 1.1) * 10, 0.04], speed: lerp(5, 1.1, clamp((t - C.slows + 0.5) / 2.5)), fog: 0.2 }],
  grade: (ctx, t, C) => { ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let i = 0; i < 7; i++) { const y = 120 + i * 140 + Math.sin(t * 1.3 + i) * 12; const g = ctx.createLinearGradient(0, y, 1920, y); g.addColorStop(0, 'rgba(255,210,150,0)'); g.addColorStop(0.5, 'rgba(255,200,130,0.07)'); g.addColorStop(1, 'rgba(255,210,150,0)'); ctx.fillStyle = g; ctx.filter = 'blur(8px)'; ctx.fillRect(0, y, 1920, 26); } ctx.restore(); ctx.filter = 'none'; },
});
