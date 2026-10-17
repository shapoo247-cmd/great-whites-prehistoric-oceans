import { drawCreature, humanPath, SPECIES } from '../lib/creatures.js';
export default {
  duration: 1, out: '_test/creatures',
  draw(ctx, t) {
    ctx.fillStyle = '#0d1a22'; ctx.fillRect(0, 0, 1920, 1080);
    const names = Object.keys(SPECIES);
    names.forEach((n, i) => {
      const col = i % 3, row = Math.floor(i / 3);
      const x = 330 + col * 630, y = 190 + row * 330;
      drawCreature(ctx, n, { x, y, len: 540, style: 'shaded', phase: t * 6, flip: false });
      ctx.fillStyle = '#fff'; ctx.font = '600 22px Inter'; ctx.fillText(n, x - 260, y + 140);
    });
    ctx.fillStyle = '#ccc'; ctx.fill(humanPath(1850, 1050, 200));
  }
};
