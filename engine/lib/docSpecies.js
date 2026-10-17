// Species ID lower-third (transparent overlay): role, name, one descriptor, one fact line. Quiet and clean.
import { cap, hair, P, ease, slow, fadeEdges } from './doc.js';
import { scrim } from './ui.js';
export function speciesScene(c) {
  const D = c.duration ?? 5.0;
  return {
    duration: D, out: c.out, alpha: true, qscale: 20,
    sfx: [{ name: 'sonar_ping', t: 0.1, gain: -12 }, { name: 'whoosh_slow', t: 0.15, gain: -18 }],
    draw(ctx, t) {
      const f = fadeEdges(t, D, 0.5, 0.7); ctx.save(); ctx.globalAlpha = f;
      scrim(ctx, 70, 760, 1000, 260, 0.35);
      const x = 120, y = 900;
      cap(ctx, c.role, x, y - 120, { font: '500 20px Inter', ls: 10, a: P(t, 0.1, 0.7, slow), color: c.color || '#ff9a8e' });
      const w = P(t, 0.2, 1.0, ease.outCubic);
      ctx.save(); ctx.beginPath(); ctx.rect(x - 10, y - 110, 1300 * w, 140); ctx.clip();
      ctx.font = '400 96px Anton'; ctx.letterSpacing = '4px'; ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 24; ctx.fillText(c.name, x, y); ctx.restore();
      hair(ctx, x, y + 22, x + 420, y + 22, P(t, 0.5, 1.4, ease.outCubic), 0.7, c.color || '#fff');
      cap(ctx, c.sub, x, y + 66, { font: '400 24px Inter', ls: 3, a: P(t, 0.7, 1.4, slow), color: 'rgba(255,255,255,0.85)' });
      if (c.fact) cap(ctx, c.fact, x, y + 106, { font: '500 22px Inter', ls: 6, a: P(t, 1.2, 1.9, slow), color: c.color || '#9fe8ff' });
      ctx.restore();
    }
  };
}
