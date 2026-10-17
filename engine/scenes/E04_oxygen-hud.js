// VO 1:33.3 -> 1:45.9  can't rest / keep swimming to breathe / warm body burns oxygen / dead zones spread, nowhere to hide  (overlay, alpha)
import { text, scrim, gauge, corners, pill, P, ease, lerp, clamp, C } from '../lib/ui.js';
import { drawCreature } from '../lib/creatures.js';
import { mulberry } from '../lib/core.js';
const T0 = 93.3, at = s => s - T0, D = 12.2;
const PX = 110, PY = 470, PW = 860, PH = 520;           // HUD panel (lower-left)
const rnd = mulberry(5), streaks = Array.from({ length: 26 }, () => ({ y: rnd(), s: 0.6 + rnd() * 0.8, o: rnd(), l: 30 + rnd() * 60 }));
export default {
  duration: D, out: '05_environment/E04_oxygen-hud', alpha: true, qscale: 20,
  sfx: [{ name: 'data_blip', t: 0.15, gain: -12 }, { name: 'alarm_low', t: at(94.43), gain: -12 }, { name: 'whoosh_water', t: at(97.37), gain: -12 }, { name: 'data_blip', t: at(99.75), gain: -10 }, { name: 'alarm_low', t: at(103.3), gain: -10 }, { name: 'impact_dark', t: at(104.9), gain: -8 }],
  draw(ctx, t) {
    const inn = P(t, 0, 0.45, ease.outCubic), out = P(t, D - 0.5, D, ease.inCubic);
    ctx.save(); ctx.globalAlpha = inn * (1 - out);
    scrim(ctx, PX - 40, PY - 20, PW + 80, PH + 40, 0.62);
    corners(ctx, PX, PY, PW, PH, P(t, 0, 0.5), 'rgba(127,227,255,0.55)', 30);
    // ---- phase timing
    const stopA = at(94.12), swimA = at(97.0), burnA = at(98.9), spreadA = at(103.0);
    const swimming = t >= swimA && t < spreadA + 99, stopped = t >= stopA && t < swimA;
    // flow 0..1 (water over gills)
    const flow = t < stopA ? 1 : stopped ? 1 - P(t, stopA, stopA + 0.5) : P(t, swimA, swimA + 0.5);
    // ---- header
    text(ctx, 'RAM VENTILATION', PX + 10, PY + 54, { font: '400 52px Anton', ls: 3, a: P(t, 0.15, 0.6) });
    const stTxt = stopped ? 'STOPPED = NO WATER OVER GILLS' : t >= swimA ? 'SWIMMING = BREATHING' : 'SWIMMING';
    const stCol = stopped ? C.threat : C.ok;
    text(ctx, stTxt, PX + 12, PY + 92, { font: '800 22px Inter', ls: 4, color: stCol, a: P(t, 0.3, 0.7) });
    // ---- shark with water streaks
    const sy = PY + 190, sx = PX + 420, L = 330;
    ctx.save(); ctx.beginPath(); ctx.rect(PX + 10, PY + 110, PW - 20, 160); ctx.clip();
    ctx.strokeStyle = C.gw; ctx.lineWidth = 2.5;
    streaks.forEach(s => {
      const x = (((s.o - t * 0.55 * s.s * flow * 1.0 + 8) % 1) + 1) % 1; const xx = PX + 10 + x * (PW - 20), yy = PY + 114 + s.y * 150;
      const near = Math.abs(yy - sy) < 62 && xx > sx - L * 0.5 && xx < sx + L * 0.5; if (near) return;
      ctx.globalAlpha = 0.18 + 0.5 * flow; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx - s.l * (0.3 + flow), yy); ctx.stroke();
    });
    ctx.restore();
    drawCreature(ctx, 'greatwhite', { x: sx, y: sy, len: L, color: 'rgba(255,255,255,0.9)', phase: t * 6 * (0.15 + flow) });
    // gill glow: arrow flow into gills (on swim) or red X (stopped)
    const gx = sx + L * 0.2, gy = sy - 4;
    if (stopped) { ctx.strokeStyle = C.threat; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(gx - 14, gy - 14); ctx.lineTo(gx + 14, gy + 14); ctx.moveTo(gx + 14, gy - 14); ctx.lineTo(gx - 14, gy + 14); ctx.stroke(); }
    else { ctx.save(); ctx.fillStyle = C.ok; ctx.shadowColor = C.ok; ctx.shadowBlur = 14; ctx.globalAlpha = 0.6 + 0.4 * Math.sin(t * 9); ctx.beginPath(); ctx.arc(gx, gy, 7, 0, 7); ctx.fill(); ctx.restore(); }
    text(ctx, 'GILLS', gx, sy - 74, { font: '800 18px Inter', ls: 4, align: 'center', color: 'rgba(255,255,255,0.7)' });
    // ---- oxygen demand vs most fish (on "warm body burns through oxygen faster than most fish")
    const bk = P(t, burnA, burnA + 0.5);
    const gy2 = PY + 346;
    if (bk > 0) {
      ctx.save(); ctx.globalAlpha *= bk;
      const grow = P(t, at(99.75), at(101.7), ease.outCubic);
      gauge(ctx, PX + 20, gy2, PW - 40, 26, 0.38 * grow, '#9fb7c4', 'MOST FISH', '', { glow: 4, labelColor: C.dim });
      gauge(ctx, PX + 20, gy2 + 64, PW - 40, 26, 0.86 * grow, C.threat, 'GREAT WHITE — WARM BODY', 'BURNS OXYGEN FASTER', { glow: 14, labelColor: C.gw });
      ctx.restore();
      text(ctx, 'OXYGEN USE', PX + 20, gy2 - 52, { font: '700 20px Inter', ls: 4, a: bk, color: C.prey });
    }
    // ---- dead zones spread: horizontal sea strip fills with red, shark has nowhere to hide
    const sk = P(t, spreadA, spreadA + 0.5);
    if (sk > 0) {
      const sp = P(t, spreadA + 0.2, at(105.6), ease.inOutQuad);
      const y0 = PY + 478, x0 = PX + 20, w = PW - 40, h = 30;
      ctx.save(); ctx.globalAlpha *= sk;
      ctx.fillStyle = 'rgba(127,227,255,0.22)'; ctx.fillRect(x0, y0, w, h);
      ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.clip();
      for (let i = 0; i < 6; i++) { const cx = x0 + w * (0.1 + i * 0.17), r = sp * (60 + (i % 3) * 30); const g = ctx.createRadialGradient(cx, y0 + h / 2, 0, cx, y0 + h / 2, r + 1); g.addColorStop(0, 'rgba(255,106,92,0.95)'); g.addColorStop(1, 'rgba(255,106,92,0)'); ctx.fillStyle = g; ctx.fillRect(cx - r, y0, r * 2, h); }
      ctx.restore();
      ctx.save(); ctx.globalAlpha *= sk; ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1.5; ctx.strokeRect(x0, y0, w, h); ctx.restore();
      text(ctx, 'DEAD ZONES SPREAD', x0, y0 - 14, { font: '800 20px Inter', ls: 4, color: C.threat, a: sk });
      const nk = P(t, at(104.72), at(104.72) + 0.4, ease.outBack);
      if (nk > 0) text(ctx, 'NOWHERE TO HIDE', x0 + w, y0 - 14, { font: '800 20px Inter', ls: 4, color: '#fff', a: nk, align: 'right' });
    }
    ctx.restore();
  }
};
