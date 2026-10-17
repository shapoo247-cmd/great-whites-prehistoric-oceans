// VO 5:09.27 same torpedo body / 5:10.69 same slicing teeth / 5:12.37 close to the same size
import { stage, text, P, ease, lerp, C, title } from '../lib/sizecomp.js';
import { checkRow } from '../lib/ui.js';
const T0 = 309.0, at = s => s - T0;
let S;
export default {
  duration: 5.4, out: '04_size-comparisons/Z03_greatwhite-vs-cretoxyrhina',
  sfx: [{ name: 'whoosh_water', t: 0.0, gain: -8 }, { name: 'ui_drop', t: at(309.27), gain: -6 }, { name: 'ui_drop', t: at(310.69), gain: -6 }, { name: 'ui_drop', t: at(312.37), gain: -6 }],
  setup() { S = stage('cretaceous', 23); },
  draw(ctx, t) {
    S.bg(ctx, t, 0.3);
    const k = P(t, 0, 0.8, ease.outCubic);
    const L = 700;
    S.animal(ctx, 'greatwhite', { x: lerp(260, 520, k), y: 400, len: L, phase: t * 5, alpha: k });
    S.animal(ctx, 'cretoxyrhina', { x: lerp(1660, 1400, k), y: 400, len: L * 0.98, phase: t * 5 + 1, flip: true, alpha: k, colors: { back: '#232a2e', flank: '#45535a', belly: '#8e9a9c' } });
    text(ctx, 'GREAT WHITE', 520, 610, { font: '400 46px Anton', ls: 2, align: 'center', a: k, color: '#fff' });
    text(ctx, 'CRETOXYRHINA', 1400, 610, { font: '400 46px Anton', ls: 2, align: 'center', a: k, color: '#fff' });
    text(ctx, 'MODERN', 520, 645, { font: '700 20px Inter', ls: 4, align: 'center', a: k, color: C.gw });
    text(ctx, '85 MILLION YEARS AGO', 1400, 645, { font: '700 20px Inter', ls: 4, align: 'center', a: k, color: C.rival });
    const rows = [['SAME TORPEDO BODY', 309.27], ['SAME SLICING TEETH', 310.69], ['CLOSE TO THE SAME SIZE', 312.37]];
    rows.forEach(([s, w], i) => checkRow(ctx, P(t, at(w), at(w) + 0.45), 700, 770 + i * 78, s));
    S.front(ctx, t, 0.3);
  }
};
