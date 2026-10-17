// Species ID card overlay (transparent): role pill, name, descriptor, stats, mini silhouette with scale bar.
import { text, measure, pill, scrim, wipe, P, ease, lerp, clamp, C } from './ui.js';
import { drawCreature, SPECIES } from './creatures.js';
const maxY = n => Math.max(...SPECIES[n].body.map(p => p[1]), ...SPECIES[n].fins.flat().map(p => p[1]));
export function speciesScene(cfg) {
  const D = cfg.duration ?? 5.0;
  const statT = cfg.statTimes || cfg.stats.map((_, i) => 0.75 + i * 0.35);
  return {
    duration: D, out: cfg.out, alpha: true,
    sfx: [{ name: 'sonar_ping', t: 0.05, gain: -9 }, { name: 'whoosh_fast', t: 0.08, gain: -16 }, ...statT.map(t => ({ name: 'data_blip', t, gain: -12 }))],
    draw(ctx, t) {
      const out = P(t, D - 0.45, D, ease.inCubic);
      ctx.save();
      ctx.globalAlpha = 1 - out; ctx.translate(-30 * out, 0);
      const x0 = 110;
      const nameFont = '400 104px Anton';
      const nw = measure(ctx, cfg.name, nameFont, 3);
      scrim(ctx, 60, 740, Math.max(nw, 900) + 380, 280, 0.6 * P(t, 0, 0.3));
      pill(ctx, cfg.role, x0, 742, cfg.roleColor || C.threat, P(t, 0.05, 0.3));
      wipe(ctx, P(t, 0.12, 0.55, ease.outCubic), x0 - 10, 740, nw + 40, 160, () => text(ctx, cfg.name, x0, 870, { font: nameFont, ls: 3 }));
      ctx.save(); ctx.fillStyle = cfg.roleColor || C.threat; ctx.fillRect(x0, 892, (nw) * P(t, 0.3, 0.75, ease.outCubic), 4); ctx.restore();
      text(ctx, cfg.sub, x0, 940, { font: '600 28px Inter', ls: 2, a: P(t, 0.45, 0.75), color: 'rgba(255,255,255,0.88)' });
      let sx = x0;
      cfg.stats.forEach(([k, v], i) => {
        const a = P(t, statT[i], statT[i] + 0.3);
        const kw = text(ctx, k, sx, 996, { font: '700 20px Inter', ls: 4, a, color: cfg.roleColor || C.threat });
        const vw = text(ctx, v, sx + kw + 14, 996, { font: '700 30px Inter', ls: 1, a });
        sx += kw + 14 + vw + 56;
      });
      // mini silhouette + scale bar
      if (cfg.creature) {
        const a = P(t, 0.35, 0.8);
        const L = cfg.iconLen || 260, cx = x0 + nw + 80 + L / 2, cy = 806;
        ctx.save(); ctx.globalAlpha *= a * 0.92;
        drawCreature(ctx, cfg.creature, { x: cx + (1 - a) * 30, y: cy, len: L, color: '#ffffff', phase: t * 5, flip: cfg.flip });
        ctx.restore();
        if (cfg.scale) {
          const k = P(t, 0.6, 1.1, ease.outCubic);
          ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 2;
          const y = cy + L * maxY(cfg.creature) + 14;
          ctx.beginPath(); ctx.moveTo(cx - L / 2, y); ctx.lineTo(cx - L / 2 + L * k, y); ctx.moveTo(cx - L / 2, y - 8); ctx.lineTo(cx - L / 2, y + 8); if (k > 0.98) { ctx.moveTo(cx + L / 2, y - 8); ctx.lineTo(cx + L / 2, y + 8); } ctx.stroke(); ctx.restore();
          text(ctx, cfg.scale, cx, y + 34, { font: '700 22px Inter', ls: 3, align: 'center', a: a * k });
        }
      }
      ctx.restore();
    }
  };
}
