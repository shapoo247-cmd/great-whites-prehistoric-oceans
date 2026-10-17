import { renderTileArt, OCEANS, drawTile } from '../lib/tierboard.js';
let arts;
export default { duration: 1, out: '_test/tiles', setup() { arts = OCEANS.map(o => renderTileArt(o.id)); },
  draw(ctx) { ctx.fillStyle = '#1b1b1b'; ctx.fillRect(0, 0, 1920, 1080);
    OCEANS.forEach((o, i) => { ctx.drawImage(arts[i], 20 + i * 315, 40, 300, 300); drawTile(ctx, o, arts[i], 20 + i * 315, 400, 300); drawTile(ctx, o, arts[i], 20 + i * 315, 750, 150); }); } };
