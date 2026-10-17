import { Water } from '../lib/water.js';
import { drawCreature } from '../lib/creatures.js';
const eras = ['devonian', 'triassic', 'jurassic', 'cretaceous', 'eocene', 'pliocene'];
const animals = ['dunkleosteus', 'greatwhite', 'pliosaurus', 'tylosaurus', 'basilosaurus', 'megalodon'];
let waters;
export default {
  duration: 6, out: '_test/water',
  setup() { waters = eras.map((e, i) => new Water(e, i + 1)); },
  draw(ctx, t) {
    const i = Math.min(5, Math.floor(t)); const w = waters[i]; const lt = (t - i) * 3 + 2;
    w.background(ctx, lt, { x: 0, y: 0 }, 0.25);
    w.snowLayer(ctx, lt, { x: 0, y: 0 }, false);
    drawCreature(ctx, animals[i], { x: 1250, y: 640, len: animals[i] === 'basilosaurus' ? 1300 : 900, color: w.subject(0.55), blur: 4, phase: lt * 4 });
    drawCreature(ctx, 'greatwhite', { x: 620, y: 520, len: 520, style: 'shaded', fog: [w.e.fog, 0.45], blur: 1, phase: lt * 5, flip: true });
    w.midground(ctx, lt, { x: 0, y: 0 }, 0.25);
    w.snowLayer(ctx, lt, { x: 0, y: 0 }, true);
    w.post(ctx, lt, Math.round(t * 30));
    ctx.fillStyle = '#fff'; ctx.font = '700 36px Inter'; ctx.fillText(eras[i], 60, 1020);
  }
};
