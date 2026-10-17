// O01 · VO 0:01.2  "...370 million years before its species should exist."  Top-left era stamp.
import { loadVO, rel } from '../lib/vo.js';
import { cap, hair, big, veil, P, ease, fadeEdges, slow } from '../lib/doc.js';
const T0 = 1.2, D = 5.4; const sc = { duration: D, out: '06_doc-style/overlays/O01_stamp-late-devonian', alpha: true, qscale: 20 };
let tYears;
sc.setup = async () => { await loadVO(); tYears = rel(T0).s('seventy million'); sc.sfx = [{ name: 'stamp', t: 0.15, gain: -12 }]; };
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.5, 0.8);
  veil(ctx, 60, 60, 760, 240, 0.35);
  const w = P(t, 0.1, 0.8, ease.outCubic);
  ctx.save(); ctx.beginPath(); ctx.rect(100, 70, 760 * w, 120); ctx.clip(); big(ctx, 'LATE DEVONIAN', 120, 150, { size: 72 }); ctx.restore();
  hair(ctx, 120, 176, 540, 176, P(t, 0.4, 1.2, ease.outCubic), 0.75);
  cap(ctx, '370 MILLION YEARS AGO', 120, 224, { font: '500 26px Inter', ls: 9, a: P(t, tYears - 0.1, tYears + 0.5, slow) });
  ctx.restore();
};
export default sc;
