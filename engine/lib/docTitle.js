// Ocean title card (full-frame): era seascape, slow push, predator looming in the fog, bold name + counting date.
import { Seascape } from './seascape.js';
import { cap, hair, P, ease, lerp, fadeEdges, slow } from './doc.js';
import { drawCreature } from './creatures.js';
export function titleScene(c) {
  let S; const D = c.duration ?? 2.4, DI = 4.2, K = DI / D;   // designed at 4.2 s, played at ~2.4 s (a ~2 s window before the next VO line)
  return {
    duration: D, out: c.out,
    sfx: [{ name: 'impact_deep', t: 0.3, gain: -9 }, { name: 'rumble_bed', t: 0, gain: -12 }, { name: 'whoosh_slow', t: 0.1, gain: -14 }, ...(c.sfx || [])],
    setup() { S = new Seascape(c.era, c.seed ?? 5); },
    draw(ctx, tr) {
      const t = tr * K, D = DI;
      const z = lerp(1.09, 1, ease.outCubic(P(t, 0, D)));
      ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540); S.draw(ctx, t, { depth: c.depth ?? 0.32 }); ctx.restore();
      const k = P(t, 0, D, ease.outQuad);
      ctx.save(); ctx.globalAlpha = P(t, 0.2, 1.4, slow) * (1 - P(t, D - 0.7, D, slow)) * 0.92;
      for (const a of c.animals) drawCreature(ctx, a.name, { x: lerp(a.x0, a.x1, k), y: a.y, len: lerp(a.l0, a.l1, k), phase: t * (a.sp ?? 2.2), flip: a.flip !== false, angle: a.angle || 0, color: S.w.subject(a.fog0 - (a.fog0 - a.fog1) * k) });
      ctx.restore();
      const g = ctx.createLinearGradient(0, 300, 0, 800); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.5, 'rgba(0,0,0,0.38)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
      ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.4, 0.6);
      const w = P(t, 0.35, 1.3, ease.outCubic);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 420, 1920 * w, 230); ctx.clip();
      ctx.font = `400 ${c.size ?? 180}px Anton`; ctx.letterSpacing = '10px'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 30;
      ctx.fillText(c.title.toUpperCase(), 965, 600); ctx.restore();
      hair(ctx, 560, 650, 1360, 650, P(t, 0.9, 1.7, ease.outCubic), 0.75);
      const n = Math.round(lerp(c.prev, c.mya, P(t, 0.9, 2.2, ease.outCubic)));
      cap(ctx, `${n} MILLION YEARS AGO`, 960, 716, { font: '500 34px Inter', ls: 12, align: 'center', a: P(t, 0.9, 1.6, slow) });
      ctx.restore();
    }
  };
}
