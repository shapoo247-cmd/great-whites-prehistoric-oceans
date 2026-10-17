// Premise reveal on the board (VO 0:29.2 - 0:40.5):
// "This is the first of six prehistoric oceans. Some it rules. One it can't survive at all.
//  And in the last, it meets the only shark that ever made a great white look small."
import { Board, L, poolXY, OCEANS } from '../lib/tierboard.js';
import { Water } from '../lib/water.js';
import { drawCreature } from '../lib/creatures.js';
import { P, inv, ease, lerp, makeCanvas } from '../lib/core.js';
let board, water, full, tile;
const ids = OCEANS.map(o => o.id);
export default {
  duration: 11.3, ambience: false, bloom: false, out: 'tier-system/T00_premise-board',
  sfx: [
    ...ids.map((_, i) => ({ name: 'ui_tick', t: 0.35 + i * 0.2, gain: -6 })),
    { name: 'ui_drop', t: 2.98, gain: -4 }, { name: 'data_blip', t: 3.0, gain: -10 },
    { name: 'impact_hit', t: 4.59, gain: -9 },
    { name: 'whoosh_slow', t: 6.85, gain: -10 }, { name: 'rumble_bed', t: 7.6, gain: -6 },
    { name: 'whoosh_water', t: 8.6, gain: -6 }, { name: 'impact_dark', t: 9.35, gain: -4 },
  ],
  async setup() {
    board = new Board(); await board.init();
    water = new Water('pliocene', 31); full = makeCanvas(1920, 1080); tile = makeCanvas(1080, 1080);
  },
  draw(ctx, t) {
    // live art for the last tile once we zoom in: small great white, then a megalodon shadow passes beneath
    let liveArt = null;
    if (t > 6.6) {
      const fx = full.getContext('2d'); const lt = t;
      water.background(fx, lt, { x: 0, y: 0 }, 0.35); water.snowLayer(fx, lt, { x: 0, y: 0 }, false);
      const k = inv(7.4, 10.9, t);
      drawCreature(fx, 'megalodon', { x: lerp(2000, 0, ease.inOutQuad(k)), y: 760, len: 1300, color: water.subject(0.14), blur: 3, phase: lt * 2.2, flip: true });
      drawCreature(fx, 'greatwhite', { x: 900 + (t - 7) * 22, y: 430 - P(t, 8.6, 10, ease.inOutCubic) * 40, len: 360, style: 'shaded', fog: [water.e.fog, 0.4], blur: 1, phase: lt * 6 });
      water.midground(fx, lt, { x: 0, y: 0 }, 0.35); water.snowLayer(fx, lt, { x: 0, y: 0 }, true);
      water.post(fx, lt, Math.round(t * 30), { vignette: 0.5, grain: 0.1 });
      const tx = tile.getContext('2d'); tx.drawImage(full, 600, 210, 740, 740, 0, 0, 1080, 1080); liveArt = tile;
    }
    const pool = ids.map((id, i) => {
      const k = inv(0.35 + i * 0.2, 0.6 + i * 0.2, t);
      const last = i === 5;
      const dim = !last ? P(t, 6.94, 7.5) : 0;
      return { id, slot: i, s: 0.6 + 0.4 * ease.outBack(k), a: k, dim, glow: last ? 0.8 * P(t, 6.94, 7.4) * (1 - P(t, 8.3, 9.0)) : 0, textA: last ? 1 - P(t, 8.2, 9.0) : 1, art: last && liveArt ? liveArt : null };
    });
    const pulse = (a, b) => (t < a ? 0 : Math.max(0, 1 - inv(a, b, t))) * Math.min(1, inv(a, a + 0.08, t));
    const st = { placed: {}, pool, labelPulse: { thrives: pulse(2.98, 3.9), dies: pulse(4.59, 5.5) }, rowGlow: { thrives: pulse(2.98, 4.2), dies: pulse(4.59, 5.8) } };
    const [px, py] = poolXY(5);
    const z = P(t, 6.9, 8.9, ease.inOutCubic), z2 = P(t, 8.9, 11.3, ease.inOutQuad);
    const cam = { s: lerp(1, 4.6, z) * lerp(1, 7.6 / 4.6, z2), fx: lerp(960, px + L.tile / 2, z), fy: lerp(540, py + L.tile / 2, z) };
    board.draw(ctx, st, cam);
    const fade = 1 - P(t, 0, 0.45, ease.outQuad);
    if (fade > 0) { ctx.fillStyle = `rgba(0,0,0,${fade})`; ctx.fillRect(0, 0, 1920, 1080); }
  }
};
