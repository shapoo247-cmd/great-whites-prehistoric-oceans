// E08 · VO 2:34.3  "So it dives, looking for cooler water. Deeper. Then deeper still. It doesn't get cooler. It gets worse... dead layer... turns hard back toward the light... heat reaches far below..."
import { loadVO, rel } from '../lib/vo.js';
import { cap, hair, big, veil, P, ease, lerp, fadeEdges, slow, COL } from '../lib/doc.js';
import { drawCreature } from '../lib/creatures.js';
const T0 = 154.3, D = 22.3; const sc = { duration: D, out: '06_doc-style/overlays/E08_dive-profile-dead-layer', alpha: true, qscale: 20 };
let R, tDive, tDeeper, tStill, tCool, tWorse, tDead, tBack, tHeat;
sc.setup = async () => { await loadVO(); R = rel(T0); tDive = R.s('so it dives', 154); tDeeper = R.s('deeper', 157); tStill = R.s('deeper still', 158); tCool = R.s('doesn\'t get cooler', 160); tWorse = R.s('it gets worse', 161); tDead = R.s('dead layer', 163); tBack = R.s('turns hard back', 166); tHeat = R.s('heat reaches', 170);
  sc.sfx = [{ name: 'whoosh_slow', t: tDive, gain: -14 }, { name: 'data_blip', t: tDeeper, gain: -12 }, { name: 'data_blip', t: tStill, gain: -12 }, { name: 'alarm_low', t: tWorse, gain: -13 }, { name: 'impact_dark', t: tDead, gain: -9 }, { name: 'whoosh_fast', t: tBack, gain: -12 }, { name: 'rumble_bed', t: tHeat, gain: -14 }]; };
sc.draw = (ctx, t) => {
  ctx.save(); ctx.globalAlpha = fadeEdges(t, D, 0.6, 0.9);
  const X0 = 1330, X1 = 1630, Y0 = 130, Y1 = 960, cxs = (X0 + X1) / 2;   // water column on the right
  veil(ctx, 1050, 60, 860, 960, 0.30);
  const yAt = d => lerp(Y0, Y1, d);                                         // d: 0 surface .. 1 deep
  // column: hot at the top fading to dead layer at depth
  const inT = P(t, 0.2, 1.2, slow);
  ctx.save(); ctx.globalAlpha *= inT;
  const g = ctx.createLinearGradient(0, Y0, 0, Y1); g.addColorStop(0, 'rgba(255,130,90,0.55)'); g.addColorStop(0.45, 'rgba(235,90,70,0.45)'); g.addColorStop(0.62, 'rgba(60,10,16,0.75)'); g.addColorStop(1, 'rgba(8,2,6,0.9)');
  ctx.fillStyle = g; ctx.fillRect(X0, Y0, X1 - X0, Y1 - Y0);
  ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2; ctx.strokeRect(X0, Y0, X1 - X0, Y1 - Y0); ctx.restore();
    // heat flood deeper at the end ("heat reaches far below")
  const kh = P(t, tHeat, tHeat + 3.5, ease.inOutQuad);
  if (kh > 0) { ctx.save(); ctx.beginPath(); ctx.rect(X0, Y0, X1 - X0, Y1 - Y0); ctx.clip(); const hg = ctx.createLinearGradient(0, Y0, 0, Y1); hg.addColorStop(0, 'rgba(255,100,70,0.45)'); hg.addColorStop(Math.min(1, kh), 'rgba(255,100,70,0.35)'); hg.addColorStop(Math.min(1, kh + 0.001), 'rgba(255,100,70,0)'); ctx.fillStyle = hg; ctx.fillRect(X0, Y0, X1 - X0, Y1 - Y0); ctx.restore(); }
  // dead layer band appears
  const kd = P(t, tDead - 0.3, tDead + 0.8, slow), bandD0 = 0.62, bandD1 = 0.78 + 0.18 * kh;
  if (kd > 0) { ctx.save(); ctx.globalAlpha *= kd; ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(X0, yAt(bandD0), X1 - X0, yAt(bandD1) - yAt(bandD0)); ctx.strokeStyle = COL.bad; ctx.lineWidth = 2; ctx.setLineDash([10, 8]); ctx.strokeRect(X0, yAt(bandD0), X1 - X0, yAt(bandD1) - yAt(bandD0)); ctx.restore();
    cap(ctx, 'DEAD LAYER', X0 - 24, yAt(bandD0) + 36, { align: 'right', font: '500 22px Inter', ls: 10, color: COL.bad, a: kd }); }
  // shark path: dive in steps, hold, turn back up
  const d = t < tDive ? 0 : t < tDeeper ? lerp(0, 0.18, P(t, tDive, tDeeper, ease.inOutQuad)) : t < tStill ? lerp(0.18, 0.38, P(t, tDeeper, tStill - 0.05, ease.inOutQuad)) : t < tDead ? lerp(0.38, 0.55, P(t, tStill, tCool - 0.2, ease.inOutQuad)) : t < tBack ? lerp(0.55, 0.72, P(t, tDead, tBack - 0.3, ease.inOutQuad)) : lerp(0.72, 0.03, P(t, tBack, tBack + 2.6, ease.inOutCubic));
  const up = t >= tBack && t < tBack + 2.8;
  const sx = cxs + Math.sin(t * 0.9) * 28, sy = yAt(d), ang = up ? -1.25 : (t > tDive && t < tBack ? 0.9 : 0.1);
  drawCreature(ctx, 'greatwhite', { x: sx, y: sy, len: 160, color: 'rgba(255,255,255,0.95)', phase: t * 5, angle: ang, flip: false });
  // depth trail
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 2; ctx.setLineDash([6, 8]); ctx.beginPath(); ctx.moveTo(cxs, Y0); ctx.lineTo(cxs, Math.max(Y0, sy - 60)); ctx.stroke(); ctx.restore();
  // one caption at a time on the left of the column
  const L = [[tDive, tDeeper - 0.1, 'SO IT DIVES', '#ffffff'], [tDeeper, tCool - 0.2, 'DEEPER', '#ffffff'], [tCool, tWorse - 0.1, 'NOT COOLER', COL.warm], [tWorse, tDead - 0.1, 'WORSE', COL.bad], [tBack, tHeat - 0.2, 'BACK TOWARD THE LIGHT', COL.gold], [tHeat, D - 0.8, 'HEAT REACHES FAR BELOW', COL.hot]];
  ctx.restore();
};
export default sc;
