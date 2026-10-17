// Z03 · VO 5:09.27  "Same torpedo body. Same slicing teeth. Close to the same size."
import { loadVO, rel } from '../lib/vo.js';
import { stage, cap, hair, big, P, ease, lerp, slow, COL } from '../lib/sizecomp2.js';
const T0 = 308.9, D = 5.5; const sc = { duration: D, out: '06_doc-style/size-comparisons/Z03_greatwhite-vs-cretoxyrhina' };
let S, R, tb, tt, ts;
sc.setup = async () => { await loadVO(); R = rel(T0); S = stage('cretaceous', 23); tb = R.s('same torpedo', 308); tt = R.s('same slicing', 308); ts = R.s('close to', 308);
  sc.sfx = [{ name: 'whoosh_water', t: 0, gain: -9 }, { name: 'ui_drop', t: tb, gain: -8 }, { name: 'ui_drop', t: tt, gain: -8 }, { name: 'ui_drop', t: ts, gain: -8 }]; };
sc.draw = (ctx, t) => {
  S.bg(ctx, t, D);
  const k = P(t, 0, 0.8, ease.outCubic), L = 720;
  S.animal(ctx, 'greatwhite', { x: lerp(260, 520, k), y: 400, len: L, phase: t * 5, alpha: k });
  S.animal(ctx, 'cretoxyrhina', { x: lerp(1660, 1400, k), y: 400, len: L * 0.98, phase: t * 5 + 1, flip: true, alpha: k, colors: { back: '#232a2e', flank: '#45535a', belly: '#8e9a9c' } });
  cap(ctx, 'GREAT WHITE', 520, 640, { align: 'center', font: '500 26px Inter', ls: 12, a: k, color: COL.gw });   cap(ctx, 'CRETOXYRHINA', 1400, 640, { align: 'center', font: '500 26px Inter', ls: 12, a: k, color: '#ffa64d' });   [['SAME BODY', tb], ['SAME TEETH', tt], ['SAME SIZE', ts]].forEach(([s, w], i) => { const a = P(t, w, w + 0.5, slow); big(ctx, s, 960, 820 + i * 80 + (1 - a) * 10, { size: 54, align: 'center', a, ls: 6 }); });
};
export default sc;
