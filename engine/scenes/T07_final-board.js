// Completed board for the ending (VO 9:54.3 -> end). Slow cinematic push, row-by-row highlight.
import { Board, TIERS } from '../lib/tierboard.js';
import { P, inv, ease, lerp } from '../lib/core.js';
let board;
const placed = { thrives: ['eocene'], survives: ['devonian', 'jurassic', 'pliocene'], barely: ['cretaceous'], dies: ['triassic'] };
export function finalScene(duration, out) {
  return {
    duration, out, ambience: false, bloom: false,
    sfx: [{ name: 'whoosh_slow', t: 0.0, gain: -12 }, ...TIERS.map((_, i) => ({ name: 'ui_tick', t: 0.5 + i * 0.32, gain: -7 })), { name: 'impact_deep', t: 0.5 + 4 * 0.32 + 0.1, gain: -12 }],
    async setup() { board = new Board(); await board.init(); },
    draw(ctx, t) {
      const labelPulse = {}, rowGlow = {}, tileGlow = {};
      TIERS.forEach((tier, i) => { const a = 0.5 + i * 0.32; const v = t < a ? 0 : Math.max(0, 1 - inv(a, a + 0.9, t)) * Math.min(1, inv(a, a + 0.06, t)); labelPulse[tier.id] = v * 0.8; rowGlow[tier.id] = v; for (const id of placed[tier.id]) tileGlow[id] = v * 0.8; });
      const k = duration > 6 ? P(t, 0, duration, ease.inOutQuad) : 0;
      const cam = { s: lerp(1, 1.16, k), fx: lerp(960, 760, k), fy: lerp(540, 420, k) };
      board.draw(ctx, { placed, pool: [], labelPulse, rowGlow, tileGlow }, cam);
      const fade = 1 - P(t, 0, 0.4, ease.outQuad); if (fade > 0) { ctx.fillStyle = `rgba(0,0,0,${fade * 0.85})`; ctx.fillRect(0, 0, 1920, 1080); }
      if (duration > 6) { const g = ctx.createRadialGradient(960, 540, 400, 960, 540, 1200); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${0.45 * k})`); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); }
    }
  };
}
export default finalScene(14.0, '01_tier-board/T07_final-board_ENDING-14s');
