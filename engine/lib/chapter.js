// Full chapter cards (~2 s): era ocean + threat silhouette + title + rolling date + deep-time ruler.
import { Water } from './water.js';
import { drawCreature } from './creatures.js';
import { P, inv, ease, lerp, clamp, rgba } from './core.js';

export const ERA_MARKS = [370, 250, 150, 85, 37, 4];
const RX0 = 300, RX1 = 1620, RY = 958;
export const rulerX = m => RX0 + (400 - m) / 400 * (RX1 - RX0);

export function drawRuler(ctx, t, cfg, accent) {
  const { mya, prevMya, n } = cfg;
  const a = P(t, 0.05, 0.35, ease.outCubic);
  ctx.save();
  ctx.globalAlpha = a;
  // base line
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(RX0, RY); ctx.lineTo(RX1, RY); ctx.stroke();
  ctx.font = '600 15px Inter'; ctx.letterSpacing = '2px'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,0.55)';
  for (let m = 400; m >= 0; m -= 25) {
    const x = rulerX(m), major = m % 100 === 0;
    ctx.fillRect(x - 1, RY - (major ? 12 : 6), 2, major ? 12 : 6);
    if (major) ctx.fillText(m === 0 ? 'TODAY' : `${m} MYA`, x, RY + 30);
  }
  // era markers
  ERA_MARKS.forEach((m, i) => {
    const x = rulerX(m), done = i < n - 1, cur = i === n - 1;
    ctx.beginPath(); ctx.arc(x, RY, cur ? 0 : 5, 0, 7);
    ctx.fillStyle = done ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)';
    if (!cur) ctx.fill();
  });
  // jump arc from previous position to the current era
  const k = P(t, 0.12, 0.85, ease.inOutCubic);
  const x0 = rulerX(prevMya), x1 = rulerX(mya), xm = lerp(x0, x1, k);
  ctx.strokeStyle = accent; ctx.lineWidth = 3; ctx.shadowColor = accent; ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.moveTo(x0, RY); ctx.lineTo(xm, RY); ctx.stroke();
  ctx.beginPath(); ctx.arc(xm, RY, 9, 0, 7); ctx.fillStyle = '#fff'; ctx.fill();
  ctx.beginPath(); ctx.arc(xm, RY, 16 + 6 * Math.sin(t * 9), 0, 7); ctx.strokeStyle = rgba('#ffffff', 0.35); ctx.lineWidth = 2; ctx.stroke();
  ctx.shadowBlur = 0;
  // jump label
  const la = P(t, 0.55, 0.8);
  if (la > 0) {
    ctx.globalAlpha = a * la; ctx.font = '700 17px Inter'; ctx.letterSpacing = '3px'; ctx.textAlign = 'center'; ctx.fillStyle = accent;
    ctx.fillText(cfg.jump, (x0 + x1) / 2, RY - 26);
  }
  ctx.restore();
}

export function chapterScene(cfg) {
  let water;
  const D = cfg.duration ?? 2.0;
  return {
    duration: D, out: cfg.out,
    sfx: [{ name: 'chapter_hit', t: 0, gain: 0 }, { name: 'data_blip', t: 0.22, gain: -14 }, { name: 'data_blip', t: 0.42, gain: -15 }, { name: 'data_blip', t: 0.62, gain: -16 }, ...(cfg.sfx || [])],
    setup() { water = new Water(cfg.era, cfg.n * 13 + 5, cfg.waterOpts || {}); },
    draw(ctx, t, env) {
      const frame = Math.round(t * 30);
      const lt = 5 + t * 1.4;
      const push = lerp(1.1, 1.0, ease.outCubic(clamp(t / D)));
      const cam = { x: t * 60, y: 0 };
      ctx.save();
      ctx.translate(960, 540); ctx.scale(push, push); ctx.translate(-960, -540);
      water.background(ctx, lt, cam, cfg.depth ?? 0.3);
      water.snowLayer(ctx, lt, cam, false);
      if (cfg.predator) cfg.predator(ctx, water, t, lt);
      water.midground(ctx, lt, cam, cfg.depth ?? 0.3);
      water.snowLayer(ctx, lt, cam, true);
      ctx.restore();
      // legibility scrim
      const g = ctx.createLinearGradient(0, 300, 0, 800); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.5, 'rgba(0,0,0,0.32)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
      water.post(ctx, lt, frame, { vignette: 0.85, grain: 0.14 });
      const accent = cfg.accent || water.e.ray;
      // entry flash
      const fl = 1 - P(t, 0, 0.32, ease.outQuad);
      if (fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = rgba(water.e.ray, 0.85 * fl); ctx.fillRect(0, 0, 1920, 1080); ctx.restore(); }

      ctx.save();
      ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 30;
      // kicker
      const ka = P(t, 0.1, 0.35);
      ctx.globalAlpha = ka; ctx.fillStyle = accent; ctx.font = '700 24px Inter'; ctx.letterSpacing = '10px';
      ctx.fillText(`OCEAN ${cfg.n} OF 6`, 960 + 5, 372 + (1 - ka) * 10);
      // title: tracking-in + blur-in
      const ta = P(t, 0.08, 0.5, ease.outCubic);
      ctx.globalAlpha = ta; ctx.fillStyle = '#ffffff'; ctx.font = '400 168px Anton';
      ctx.letterSpacing = `${lerp(34, 6, ta)}px`;
      ctx.filter = `blur(${(1 - ta) * 10}px)`;
      ctx.fillText(cfg.title.toUpperCase(), 960 + lerp(17, 3, ta), 560);
      ctx.filter = 'none';
      // date with rolling counter
      const da = P(t, 0.18, 0.45);
      const val = Math.round(lerp(cfg.prevMya, cfg.mya, P(t, 0.12, 0.85, ease.inOutCubic)));
      ctx.globalAlpha = da; ctx.font = '600 40px Inter'; ctx.letterSpacing = '8px'; ctx.fillStyle = '#ffffff';
      const dateTxt = `${val} MILLION YEARS AGO`;
      ctx.fillText(dateTxt, 960 + 4, 638);
      const w = ctx.measureText(dateTxt).width;
      ctx.shadowBlur = 0; ctx.fillStyle = rgba('#ffffff', 0.5);
      const lw = 90 * P(t, 0.25, 0.6, ease.outCubic);
      ctx.fillRect(960 - w / 2 - 30 - lw, 624, lw, 2); ctx.fillRect(960 + w / 2 + 30, 624, lw, 2);
      // threat line
      const tha = P(t, 0.5, 0.75);
      if (tha > 0) {
        ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 20;
        ctx.globalAlpha = tha; ctx.font = '700 25px Inter'; ctx.letterSpacing = '5px';
        const label = cfg.threatLabel || 'THREAT', txt = cfg.threat;
        const lwid = ctx.measureText(label + '   ').width, twid = ctx.measureText(txt).width, tot = lwid + twid;
        const x0 = 960 - tot / 2;
        ctx.textAlign = 'left';
        ctx.fillStyle = cfg.threatColor || '#ff6a5c'; ctx.fillText(label, x0, 712 + (1 - tha) * 8);
        ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.fillText(txt, x0 + lwid, 712 + (1 - tha) * 8);
      }
      ctx.restore();
      drawRuler(ctx, t, cfg, accent);
    }
  };
}
