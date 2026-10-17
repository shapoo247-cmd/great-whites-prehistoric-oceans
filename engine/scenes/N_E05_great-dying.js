// E05 · VO 2:08.5  "This is the ocean after the Great Dying. Somewhere between 80 and 90 percent of marine species are gone..."
import { loadVO, rel } from '../lib/vo.js';
import { cap, hair, big, veil, P, ease, lerp, fadeEdges, slow, COL } from '../lib/doc.js';
import { mulberry } from '../lib/core.js';
const T0 = 128.5, D = 6.8; const sc = { duration: D, out: 'overlays/E05_great-dying-80-90', alpha: true, qscale: 20 };
let R, t80, t90, tGone, tTitle; const rnd = mulberry(8); const order = Array.from({ length: 100 }, (_, i) => i).sort(() => rnd() - 0.5);
sc.setup = async () => { await loadVO(); R = rel(T0); tTitle = R.s('great dying'); t80 = R.s('eighty'); t90 = R.s('ninety'); tGone = R.s('gone', 128);
  sc.sfx = [{ name: 'impact_dark', t: 0.1, gain: -12 }, { name: 'data_blip', t: t80, gain: -10 }, { name: 'impact_deep', t: tGone, gain: -10 }]; };
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.5, 0.7);
  veil(ctx, 1000, 150, 900, 800, 0.32);
    // 10x10 field: each dot = 1 in 100 marine species. Dots go dark between "eighty" and "ninety"
  const gx = 1460, gy = 330, sp = 36, dying = lerp(0, 90, P(t, t80, t90 + 0.5, ease.inOutQuad));
  const kIn = P(t, 0.2, 1.0, slow);
  order.forEach((idx, rank) => {
    const c = idx % 10, r = Math.floor(idx / 10), x = gx - 4.5 * sp + c * sp, y = gy + r * sp;
    const gone = rank < dying ? Math.min(1, dying - rank) : 0;
    ctx.save(); ctx.globalAlpha *= kIn * (1 - 0.88 * gone); ctx.fillStyle = gone > 0.5 ? '#7a8a90' : '#bff2ff'; ctx.shadowColor = 'rgba(160,235,255,0.8)'; ctx.shadowBlur = gone > 0.5 ? 0 : 10;
    ctx.beginPath(); ctx.arc(x, y, 8 - 4 * gone, 0, 7); ctx.fill(); ctx.restore();
  });
  const ka = P(t, t80 - 0.1, t80 + 0.5, slow); big(ctx, '80–90%', 1460, 780, { size: 150, align: 'center', a: ka });
    ctx.restore();
};
export default sc;
