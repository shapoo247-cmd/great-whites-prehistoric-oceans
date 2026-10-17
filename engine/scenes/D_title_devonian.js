// Documentary title card: LATE DEVONIAN · 370 million years ago  (full-frame, 4 s)
import { seaStage, cap, hair, P, ease, fadeEdges, slow } from '../lib/doc.js';
let S; const D = 4.2;
export default {
  duration: D, out: '06_doc-style/TITLE_01_late-devonian',
  sfx: [{ name: 'rumble_bed', t: 0, gain: -14 }, { name: 'whoosh_slow', t: 0.3, gain: -16 }],
  setup() { S = seaStage('devonian', 5); },
  draw(ctx, t) {
    S.draw(ctx, t, 0.3, 0.05, D);
    const f = fadeEdges(t, D, 0.5, 0.7);
    ctx.save(); ctx.globalAlpha = f;
    const g = ctx.createRadialGradient(960, 540, 100, 960, 540, 800); g.addColorStop(0, 'rgba(0,0,0,0.28)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
    const k = P(t, 0.3, 1.6, ease.outCubic);
    cap(ctx, 'LATE DEVONIAN', 960, 548, { font: '500 84px Inter', ls: 26, align: 'center', a: P(t, 0.3, 1.5, slow) });
    hair(ctx, 960 - 120 * k, 590, 960 + 120 * k, 590, 1, 0.7);
    cap(ctx, '370 MILLION YEARS AGO', 960, 646, { font: '400 26px Inter', ls: 12, align: 'center', a: P(t, 1.0, 2.0, slow), color: 'rgba(255,255,255,0.8)' });
    ctx.restore();
  }
};
