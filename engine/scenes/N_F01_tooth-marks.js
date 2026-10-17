// F01 · VO 4:24.1  "Fossil bones from this sea carry its tooth marks: ichthyosaurs, plesiosaurs, even other pliosaurs."
import { loadVO, rel } from '../lib/vo.js';
import { cap, hair, big, veil, P, ease, fadeEdges, slow } from '../lib/doc.js';
import { bone, puncture } from '../lib/props.js';
const T0 = 264.1, D = 7.6; const sc = { duration: D, out: '06_doc-style/overlays/F01_pliosaurus-tooth-marks', alpha: true, qscale: 20 };
let R, tc;
sc.setup = async () => { await loadVO(); R = rel(T0); tc = [R.s('ichthyosaurs', 264), R.s('plesiosaurs', 264), R.s('other pliosaurs', 264)];
  sc.sfx = [{ name: 'data_blip', t: 0.2, gain: -12 }, ...tc.flatMap((x, i) => [0, 0.25, 0.5].map(d => ({ name: 'impact_hit', t: x + 0.15 + d, gain: -22 + i }))) ]; };
const names = ['ICHTHYOSAURS', 'PLESIOSAURS', 'OTHER PLIOSAURS'];
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.5, 0.8);
  veil(ctx, 1040, 160, 880, 780, 0.34);
    tc.forEach((tt, i) => {
    const y = 420 + i * 190, kb = P(t, tt - 0.5, tt + 0.2, ease.outCubic);
    bone(ctx, 1480, y, 520, -0.04 + i * 0.05, kb);
    for (let j = 0; j < 5; j++) puncture(ctx, 1370 + j * 52 + (j % 2) * 4, y - 8 + (j % 2) * 20 + i * 3, 9, P(t, tt + 0.15 + j * 0.08, tt + 0.4 + j * 0.08));
    cap(ctx, names[i], 1480, y + 72, { align: 'center', font: '500 20px Inter', ls: 10, a: P(t, tt - 0.1, tt + 0.5, slow) });
  });
  ctx.restore();
};
export default sc;
