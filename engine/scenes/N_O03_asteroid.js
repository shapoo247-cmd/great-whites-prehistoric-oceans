// O03 · VO 6:23.6  "Then the asteroid hits. The mosasaurs vanish."
import { loadVO, rel } from '../lib/vo.js';
import { cap, hair, big, P, ease, lerp, fadeEdges, slow, COL } from '../lib/doc.js';
import { lit } from '../lib/doc.js';
const T0 = 383.4, D = 4.6; const sc = { duration: D, out: 'overlays/O03_asteroid-impact', alpha: true, qscale: 20 };
let R, tHit, tVan;
sc.setup = async () => { await loadVO(); R = rel(T0); tHit = R.s('asteroid hits', 383) + 0.25; tVan = R.s('mosasaurs vanish', 383);
  sc.sfx = [{ name: 'riser', t: tHit - 1.2, gain: -12 }, { name: 'whoosh_fast', t: tHit - 0.7, gain: -8 }, { name: 'impact_deep', t: tHit, gain: -2 }, { name: 'rumble_bed', t: tHit, gain: -6 }]; };
sc.draw = (ctx, t) => {
  ctx.save();
  const fall = P(t, tHit - 0.7, tHit, ease.inQuad), x0 = 1800, y0 = -60, x1 = 1150, y1 = 640;
  if (t < tHit) { const x = lerp(x0, x1, fall), y = lerp(y0, y1, fall);
    const g = ctx.createLinearGradient(x, y, x0 + 300, y0 - 300); g.addColorStop(0, 'rgba(255,230,170,0.95)'); g.addColorStop(0.3, 'rgba(255,140,60,0.6)'); g.addColorStop(1, 'rgba(255,90,40,0)');
    ctx.strokeStyle = g; ctx.lineWidth = 26; ctx.lineCap = 'round'; ctx.shadowColor = '#ff8a3a'; ctx.shadowBlur = 40; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (x0 + 300 - x) * 0.6, y + (y0 - 300 - y) * 0.6); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.shadowBlur = 60; ctx.beginPath(); ctx.arc(x, y, 18, 0, 7); ctx.fill(); }
  const a = t - tHit;
  if (a >= 0) { const fl = Math.exp(-a * 3.2); ctx.globalCompositeOperation = 'screen';
    const g = ctx.createRadialGradient(x1, y1, 0, x1, y1, 900); g.addColorStop(0, `rgba(255,236,190,${0.95 * fl})`); g.addColorStop(0.4, `rgba(255,150,70,${0.5 * fl})`); g.addColorStop(1, 'rgba(255,100,40,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 3; i++) { const aa = a - i * 0.18; if (aa < 0) continue; ctx.strokeStyle = `rgba(255,220,170,${0.7 * Math.exp(-aa * 1.6)})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x1, y1, aa * 900, aa * 330, 0, 0, 7); ctx.stroke(); } }
  // mosasaurs vanish
  const v = P(t, tVan, tVan + 1.0, slow);
  if (t > tHit) { ctx.globalAlpha = (1 - v) * P(t, tHit + 0.1, tHit + 0.5); lit(ctx, 'tylosaurus', { pal: 'grey', x: 600, y: 860, len: 700, flip: true, phase: t * 2, fog: ['#0b1a1c', 0.15 + 0.6 * v] }); }
      ctx.restore();
};
export default sc;
