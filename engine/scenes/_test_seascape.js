import { Seascape } from '../lib/seascape.js';
let S; const eras = ['devonian','jurassic','cretaceous','pliocene'];
export default { duration: 3, out: 'x', setup() { S = eras.map((e, i) => new Seascape(e, i + 2)); },
  draw(ctx, t) { ctx.save(); ctx.scale(0.5, 0.5);
    S.forEach((s, i) => { ctx.save(); ctx.translate((i % 2) * 1920, Math.floor(i / 2) * 1080); ctx.beginPath(); ctx.rect(0, 0, 1920, 1080); ctx.clip(); s.draw(ctx, t + 1); ctx.restore(); });
    ctx.restore(); } };
