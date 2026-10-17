// Title card: LATE DEVONIAN · 370 MYA (full-frame, 4.5 s). Camera pushes through murk; Dunkleosteus looms from the fog behind the title.
import { Seascape } from '../lib/seascape.js';
import { cap, hair, P, ease, fadeEdges, slow, lerp } from '../lib/doc.js';
import { drawCreature } from '../lib/creatures.js';
let S; const D = 4.5;
export default {
  duration: D, out: '06_doc-style/TITLE_01_late-devonian',
  sfx: [{ name: 'impact_deep', t: 0.55, gain: -8 }, { name: 'rumble_bed', t: 0, gain: -12 }, { name: 'whoosh_slow', t: 0.2, gain: -14 }],
  setup() { S = new Seascape('devonian', 5); },
  draw(ctx, t) {
    { const z = lerp(1.09, 1, ease.outCubic(P(t, 0, D))); ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540); S.draw(ctx, t, { depth: 0.32 }); ctx.restore(); }
    // looming predator: starts tiny/blurred/far, drifts closer, stays a silhouette in the fog
    const k = P(t, 0, D, ease.outQuad), cx = lerp(1560, 1250, k), len = lerp(380, 760, k);
    ctx.save(); ctx.globalAlpha = P(t, 0.2, 1.4, slow) * (1 - P(t, D - 0.7, D, slow)) * 0.9;
    drawCreature(ctx, 'dunkleosteus', { x: cx, y: 860, len, phase: t * 2.2, flip: true, color: S.w.subject(0.62 - 0.3 * k), });
    ctx.restore();
    const g = ctx.createLinearGradient(0, 300, 0, 800); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.5, 'rgba(0,0,0,0.38)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
    const f = fadeEdges(t, D, 0.4, 0.6);
    ctx.save(); ctx.globalAlpha = f;
    // title wipes in left to right, bold
    const w = P(t, 0.35, 1.3, ease.outCubic);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 380, 1920 * w, 260); ctx.clip();
    ctx.font = '400 190px Anton'; ctx.letterSpacing = '10px'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 30;
    ctx.fillText('LATE DEVONIAN', 960 + 5, 600); ctx.restore();
    hair(ctx, 560, 650, 1360, 650, P(t, 0.9, 1.7, ease.outCubic), 0.75);
    const n = Math.round(lerp(0, 370, P(t, 0.9, 2.2, ease.outCubic)));
    cap(ctx, `${n} MILLION YEARS AGO`, 960, 716, { font: '500 34px Inter', ls: 12, align: 'center', a: P(t, 0.9, 1.6, slow) });
    ctx.restore();
  }
};
