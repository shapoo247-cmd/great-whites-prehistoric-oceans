// Original side-profile silhouettes for every animal in the video.
// Coordinates are normalized: x = 0 (tail tip) .. 1 (snout tip), y relative to body length (down = +).
// A point [x, y, 1] is a sharp corner (fin tips, notches); otherwise the outline is smoothed.

const S = 1;
const GW_BODY = [
  [1.000, 0.012, S], [0.988, -0.018], [0.962, -0.045], [0.918, -0.071], [0.855, -0.096], [0.782, -0.109], [0.700, -0.114],
  [0.600, -0.108], [0.500, -0.090], [0.400, -0.062], [0.300, -0.042], [0.220, -0.030], [0.160, -0.022], [0.126, -0.018],
  [0.096, -0.046], [0.062, -0.104], [0.028, -0.168], [0.000, -0.208, S], [0.020, -0.163], [0.038, -0.104], [0.052, -0.046], [0.063, 0.000, S],
  [0.053, 0.050], [0.041, 0.102], [0.030, 0.158, S], [0.052, 0.118], [0.076, 0.068], [0.101, 0.035], [0.126, 0.019],
  [0.160, 0.024], [0.220, 0.035], [0.300, 0.050], [0.400, 0.070], [0.500, 0.088], [0.600, 0.097], [0.700, 0.098],
  [0.780, 0.091], [0.850, 0.077], [0.900, 0.062], [0.940, 0.049], [0.970, 0.037], [0.990, 0.025],
];
const GW_FINS = [
  [[0.665, -0.106], [0.645, -0.150], [0.626, -0.194], [0.608, -0.222], [0.598, -0.230, S], [0.590, -0.218], [0.585, -0.190], [0.579, -0.150], [0.569, -0.122], [0.545, -0.104]],
  [[0.752, 0.078], [0.702, 0.130], [0.642, 0.188], [0.592, 0.228], [0.566, 0.244, S], [0.580, 0.224], [0.620, 0.176], [0.664, 0.122], [0.692, 0.089]],
  [[0.356, 0.066], [0.336, 0.094], [0.316, 0.111, S], [0.312, 0.094], [0.300, 0.060]],
  [[0.216, -0.029], [0.206, -0.050], [0.199, -0.057, S], [0.193, -0.044], [0.185, -0.027]],
  [[0.201, 0.035], [0.191, 0.054], [0.184, 0.060, S], [0.178, 0.045], [0.170, 0.030]],
];
function scaleY(pts, k) { return pts.map(p => [p[0], p[1] * k, p[2]]); }

const MEG_BODY = [
  [1.000, 0.014, S], [0.990, -0.026], [0.964, -0.060], [0.922, -0.087], [0.862, -0.107], [0.782, -0.119], [0.700, -0.123],
  [0.600, -0.115], [0.500, -0.095], [0.400, -0.071], [0.300, -0.048], [0.220, -0.034], [0.160, -0.025], [0.126, -0.021],
  [0.094, -0.052], [0.060, -0.116], [0.026, -0.184], [0.000, -0.228, S], [0.021, -0.178], [0.039, -0.114], [0.053, -0.050], [0.064, 0.000, S],
  [0.054, 0.055], [0.042, 0.112], [0.028, 0.176, S], [0.052, 0.132], [0.076, 0.076], [0.100, 0.040], [0.126, 0.022],
  [0.160, 0.027], [0.220, 0.039], [0.300, 0.055], [0.400, 0.077], [0.500, 0.096], [0.600, 0.105], [0.700, 0.106],
  [0.780, 0.099], [0.850, 0.085], [0.905, 0.069], [0.945, 0.055], [0.975, 0.040], [0.993, 0.027],
];
const MEG_FINS = [
  [[0.672, -0.118], [0.650, -0.170], [0.628, -0.218], [0.608, -0.248], [0.596, -0.257, S], [0.588, -0.244], [0.583, -0.210], [0.576, -0.165], [0.565, -0.133], [0.540, -0.112]],
  [[0.760, 0.090], [0.705, 0.150], [0.640, 0.215], [0.585, 0.262], [0.552, 0.283, S], [0.568, 0.258], [0.612, 0.204], [0.660, 0.142], [0.694, 0.100]],
  [[0.362, 0.077], [0.340, 0.110], [0.318, 0.130, S], [0.314, 0.110], [0.300, 0.071]],
  [[0.218, -0.033], [0.207, -0.058], [0.200, -0.066, S], [0.194, -0.051], [0.185, -0.031]],
  [[0.203, 0.040], [0.192, 0.062], [0.185, 0.069, S], [0.179, 0.052], [0.170, 0.034]],
];

const DUNK_BODY = [
  [0.986, 0.020], [0.996, -0.010], [0.993, -0.046], [0.976, -0.086], [0.946, -0.119], [0.902, -0.143], [0.842, -0.159], [0.772, -0.165], [0.738, -0.161],
  [0.700, -0.155], [0.640, -0.146], [0.550, -0.126], [0.450, -0.096], [0.350, -0.066], [0.250, -0.041], [0.180, -0.027], [0.140, -0.022],
  [0.102, -0.060], [0.064, -0.128], [0.032, -0.190], [0.000, -0.232, S], [0.030, -0.175], [0.050, -0.110], [0.064, -0.050], [0.075, 0.000, S],
  [0.066, 0.050], [0.051, 0.100], [0.036, 0.148, S], [0.061, 0.108], [0.090, 0.060], [0.115, 0.030], [0.140, 0.021],
  [0.180, 0.027], [0.250, 0.041], [0.350, 0.063], [0.450, 0.086], [0.550, 0.106], [0.650, 0.119], [0.720, 0.123], [0.780, 0.120],
  [0.840, 0.112], [0.900, 0.100], [0.946, 0.088], [0.976, 0.078], [0.994, 0.068, S], [0.982, 0.054, S], [0.972, 0.046], [0.990, 0.034, S],
];
const DUNK_FINS = [
  [[0.622, -0.146], [0.590, -0.190], [0.566, -0.220], [0.556, -0.226, S], [0.548, -0.206], [0.540, -0.168], [0.522, -0.123]],
  [[0.705, 0.121], [0.672, 0.162], [0.640, 0.192, S], [0.645, 0.168], [0.662, 0.126]],
  [[0.405, 0.080], [0.383, 0.108], [0.366, 0.120, S], [0.364, 0.100], [0.352, 0.072]],
];

const ICH_BODY = [
  [1.000, 0.012, S], [0.960, 0.000], [0.905, -0.014], [0.866, -0.034], [0.825, -0.054], [0.760, -0.075], [0.660, -0.092], [0.550, -0.095],
  [0.450, -0.085], [0.350, -0.065], [0.250, -0.042], [0.180, -0.028], [0.140, -0.022],
  [0.110, -0.040], [0.076, -0.098], [0.042, -0.150], [0.015, -0.186, S], [0.036, -0.136], [0.055, -0.080], [0.070, -0.022], [0.076, 0.010, S],
  [0.062, 0.060], [0.042, 0.120], [0.020, 0.176, S], [0.050, 0.128], [0.080, 0.070], [0.110, 0.034], [0.140, 0.022],
  [0.180, 0.028], [0.250, 0.040], [0.350, 0.058], [0.450, 0.072], [0.550, 0.078], [0.650, 0.074], [0.740, 0.062], [0.800, 0.048],
  [0.850, 0.034], [0.900, 0.022], [0.960, 0.016], [0.990, 0.014],
];
const ICH_FINS = [
  [[0.530, -0.093], [0.502, -0.138], [0.482, -0.163, S], [0.468, -0.140], [0.452, -0.110], [0.430, -0.085]],
  [[0.752, 0.058], [0.722, 0.108], [0.684, 0.148], [0.652, 0.165, S], [0.662, 0.140], [0.690, 0.100], [0.712, 0.066]],
  [[0.402, 0.068], [0.382, 0.094], [0.366, 0.105, S], [0.370, 0.088], [0.360, 0.064]],
];

const PLIO_BODY = [
  [1.000, 0.030, S], [0.985, 0.013], [0.960, -0.002], [0.925, -0.016], [0.885, -0.028], [0.848, -0.037], [0.822, -0.038], [0.800, -0.036],
  [0.770, -0.044], [0.720, -0.064], [0.650, -0.086], [0.560, -0.101], [0.470, -0.104], [0.390, -0.094], [0.320, -0.076], [0.250, -0.055],
  [0.180, -0.036], [0.110, -0.021], [0.050, -0.011], [0.024, -0.024], [0.008, -0.034, S], [0.010, -0.010], [0.000, 0.000, S],
  [0.040, 0.010], [0.100, 0.022], [0.180, 0.042], [0.250, 0.062], [0.320, 0.080], [0.390, 0.093], [0.470, 0.099], [0.560, 0.096],
  [0.650, 0.084], [0.720, 0.068], [0.770, 0.054], [0.800, 0.046], [0.830, 0.044], [0.870, 0.044], [0.910, 0.042], [0.950, 0.039], [0.980, 0.036], [0.995, 0.033],
];
const PLIO_FINS = [
  [[0.672, 0.072], [0.632, 0.120], [0.572, 0.180], [0.512, 0.226], [0.462, 0.255], [0.432, 0.266, S], [0.452, 0.246], [0.502, 0.205], [0.552, 0.160], [0.592, 0.110], [0.612, 0.088]],
  [[0.372, 0.082], [0.332, 0.120], [0.272, 0.170], [0.212, 0.205], [0.166, 0.225, S], [0.186, 0.200], [0.242, 0.155], [0.292, 0.110], [0.312, 0.076]],
];

const TYLO_BODY = [
  [1.000, 0.010, S], [0.985, -0.004], [0.950, -0.014], [0.910, -0.024], [0.880, -0.030], [0.840, -0.034], [0.780, -0.044], [0.700, -0.052],
  [0.620, -0.054], [0.540, -0.050], [0.460, -0.044], [0.380, -0.036], [0.300, -0.028], [0.220, -0.020], [0.150, -0.014],
  [0.110, -0.022], [0.070, -0.040], [0.036, -0.060], [0.012, -0.070, S], [0.030, -0.040], [0.048, -0.010], [0.040, 0.030], [0.020, 0.075], [0.000, 0.116, S],
  [0.040, 0.085], [0.080, 0.045], [0.110, 0.022], [0.150, 0.014],
  [0.220, 0.020], [0.300, 0.030], [0.380, 0.040], [0.460, 0.050], [0.540, 0.056], [0.620, 0.058], [0.700, 0.054], [0.780, 0.044],
  [0.840, 0.034], [0.880, 0.030], [0.920, 0.026], [0.960, 0.020], [0.990, 0.014],
];
const TYLO_FINS = [
  [[0.810, 0.038], [0.780, 0.080], [0.745, 0.116], [0.715, 0.136, S], [0.725, 0.110], [0.750, 0.070], [0.765, 0.046]],
  [[0.585, 0.057], [0.555, 0.095], [0.520, 0.126], [0.492, 0.140, S], [0.502, 0.116], [0.525, 0.080], [0.540, 0.057]],
];

const DORU_BODY = [
  [1.000, 0.012, S], [0.970, 0.000], [0.930, -0.012], [0.890, -0.030], [0.850, -0.050], [0.800, -0.068], [0.720, -0.082], [0.620, -0.088],
  [0.520, -0.082], [0.420, -0.066], [0.320, -0.046], [0.220, -0.028], [0.140, -0.016], [0.080, -0.010],
  [0.048, -0.018], [0.000, -0.026, S], [0.012, 0.000], [0.000, 0.024, S], [0.048, 0.016],
  [0.080, 0.010], [0.140, 0.016], [0.220, 0.030], [0.320, 0.050], [0.420, 0.068], [0.520, 0.080], [0.620, 0.082], [0.720, 0.076],
  [0.800, 0.062], [0.860, 0.046], [0.900, 0.034], [0.940, 0.026], [0.970, 0.020], [0.990, 0.016],
];
const DORU_FINS = [
  [[0.762, 0.070], [0.732, 0.110], [0.702, 0.136, S], [0.706, 0.110], [0.722, 0.074]],
  [[0.302, 0.048], [0.296, 0.062], [0.290, 0.068, S], [0.287, 0.056], [0.284, 0.046]],
];

const BASI_BODY = [
  [1.000, 0.004, S], [0.985, -0.004], [0.965, -0.010], [0.945, -0.018], [0.925, -0.024], [0.900, -0.027], [0.850, -0.032], [0.780, -0.034],
  [0.700, -0.034], [0.600, -0.032], [0.500, -0.030], [0.400, -0.027], [0.300, -0.023], [0.200, -0.018], [0.120, -0.013], [0.060, -0.009],
  [0.030, -0.011], [0.000, -0.020, S], [0.010, 0.000], [0.000, 0.020, S], [0.030, 0.011],
  [0.060, 0.009], [0.120, 0.013], [0.200, 0.018], [0.300, 0.023], [0.400, 0.027], [0.500, 0.030], [0.600, 0.032], [0.700, 0.032],
  [0.780, 0.030], [0.850, 0.026], [0.900, 0.022], [0.940, 0.016], [0.970, 0.010], [0.990, 0.006],
];
const BASI_FINS = [
  [[0.872, 0.026], [0.858, 0.044], [0.842, 0.056, S], [0.845, 0.042], [0.852, 0.026]],
  [[0.382, 0.027], [0.377, 0.036, S], [0.371, 0.027]],
];

export const SPECIES = {
  greatwhite: { body: GW_BODY, fins: GW_FINS, eye: [0.915, -0.030, 0.0065], gills: [0.778, 0.723], mouth: [[0.976, 0.031], [0.905, 0.056]], undulate: 'tail', len: 5 },
  megalodon: { body: MEG_BODY, fins: MEG_FINS, eye: [0.912, -0.034, 0.006], gills: [0.785, 0.722], mouth: [[0.982, 0.034], [0.900, 0.066]], undulate: 'tail', len: 16 },
  cretoxyrhina: { body: scaleY(GW_BODY, 0.88), fins: GW_FINS.map(f => scaleY(f, 0.92)), eye: [0.918, -0.026, 0.0062], gills: [0.778, 0.723], mouth: [[0.978, 0.028], [0.905, 0.050]], undulate: 'tail', len: 7 },
  dunkleosteus: { body: DUNK_BODY, fins: DUNK_FINS, eye: [0.915, -0.050, 0.013], armor: 0.738, undulate: 'tail', len: 3.5 },
  ichthyosaur: { body: ICH_BODY, fins: ICH_FINS, eye: [0.835, -0.024, 0.018], undulate: 'tail', len: 5 },
  pliosaurus: { body: PLIO_BODY, fins: PLIO_FINS, eye: [0.868, -0.018, 0.007], mouth: [[0.997, 0.031], [0.850, 0.020]], skull: 0.82, undulate: 'flippers', len: 12 },
  tylosaurus: { body: TYLO_BODY, fins: TYLO_FINS, eye: [0.905, -0.016, 0.006], mouth: [[0.985, 0.008], [0.885, 0.014]], undulate: 'tail', len: 13 },
  dorudon: { body: DORU_BODY, fins: DORU_FINS, eye: [0.875, -0.024, 0.008], mouth: [[0.995, 0.014], [0.905, 0.020]], undulate: 'vertical', len: 5 },
  basilosaurus: { body: BASI_BODY, fins: BASI_FINS, eye: [0.940, -0.008, 0.0035], mouth: [[0.998, 0.004], [0.935, 0.006]], undulate: 'vertical', len: 17 },
};

// Smooth closed path through points (Catmull-Rom -> cubic Bezier), with sharp corners where flagged.
function addSmooth(path, pts, map, closed = true, tension = 0.5) {
  const n = pts.length;
  const P = pts.map(p => map(p[0], p[1]));
  const sharp = pts.map(p => !!p[2]);
  const get = i => P[(i + n) % n];
  path.moveTo(P[0][0], P[0][1]);
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
    const s1 = sharp[i % n], s2 = sharp[(i + 1) % n];
    const k = tension / 3 * 2;
    const c1 = s1 ? p1 : [p1[0] + (p2[0] - p0[0]) * k / 2, p1[1] + (p2[1] - p0[1]) * k / 2];
    const c2 = s2 ? p2 : [p2[0] - (p3[0] - p1[0]) * k / 2, p2[1] - (p3[1] - p1[1]) * k / 2];
    path.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], p2[0], p2[1]);
  }
  path.closePath();
}

// Deformation for swimming. phase in radians.
function deformer(spec, phase, amp) {
  if (!amp) return (x, y) => [x, y];
  if (spec.undulate === 'vertical') {
    return (x, y) => { const e = Math.pow(1 - x, 1.6); return [x, y + amp * 0.025 * e * Math.sin(phase - (1 - x) * 7.5)]; };
  }
  if (spec.undulate === 'flippers') {
    return (x, y) => [x, y + amp * 0.004 * Math.sin(phase)];
  }
  // lateral tail sweep seen from the side: caudal region foreshortens + slight pitch
  return (x, y) => {
    let nx = x;
    if (x < 0.14) { const s = 0.80 + 0.20 * Math.cos(phase); nx = 0.14 - (0.14 - x) * s; }
    const tw = Math.max(0, 0.35 - x) / 0.35;
    return [nx, y + amp * 0.012 * tw * tw * Math.sin(phase + 0.6)];
  };
}

// Build Path2D for a creature. opts: {x, y (center), len (px), flip (face left), angle, phase, amp}
export function creaturePath(name, o) {
  const spec = SPECIES[name];
  const len = o.len, flip = o.flip ? -1 : 1, ang = o.angle || 0;
  const ca = Math.cos(ang), sa = Math.sin(ang);
  const def = deformer(spec, o.phase || 0, o.amp == null ? 1 : o.amp);
  const map = (x, y) => {
    const d = def(x, y);
    const lx = (d[0] - 0.5) * len * flip, ly = d[1] * len;
    return [o.x + lx * ca - ly * sa, o.y + lx * sa + ly * ca];
  };
  const p = new Path2D();
  addSmooth(p, spec.body, map);
  for (const f of spec.fins) addSmooth(p, f, map);
  return { path: p, map, spec };
}

// Inner shadow / rim light along an edge, clipped to path.
function innerGlow(ctx, path, dx, dy, blur, color) {
  ctx.save();
  ctx.clip(path);
  const outer = new Path2D();
  outer.rect(-4000, -4000, 12000, 12000);
  outer.addPath(path);
  ctx.shadowColor = color; ctx.shadowBlur = blur; ctx.shadowOffsetX = dx; ctx.shadowOffsetY = dy;
  ctx.fillStyle = '#000';
  ctx.translate(-20000, 0); ctx.shadowOffsetX = dx + 20000;
  ctx.fill(outer, 'evenodd');
  ctx.restore();
}

// Draw a creature.
// style: 'flat' (single color), 'shaded' (gradient + rim + belly + details)
export function drawCreature(ctx, name, o) {
  const { path, map, spec } = creaturePath(name, o);
  const len = o.len;
  ctx.save();
  if (o.alpha != null) ctx.globalAlpha *= o.alpha;
  if (o.blur) ctx.filter = `blur(${o.blur}px)`;
  if (o.style !== 'shaded') {
    ctx.fillStyle = o.color || '#000';
    ctx.fill(path);
    ctx.restore();
    return path;
  }
  // body gradient (dark back, lighter flank)
  const top = map(0.6, -0.12), bot = map(0.6, 0.12);
  const g = ctx.createLinearGradient(top[0], top[1], bot[0], bot[1]);
  const c = o.colors || { back: '#1c2731', flank: '#3a4a57', belly: '#8d9aa3' };
  g.addColorStop(0, c.back); g.addColorStop(0.55, c.flank); g.addColorStop(1, c.flank);
  ctx.fillStyle = g;
  ctx.fill(path);
  ctx.filter = 'none';
  // countershaded belly
  if (c.belly) {
    ctx.save(); ctx.clip(path);
    const belly = new Path2D();
    const pts = [];
    for (let i = 0; i <= 40; i++) { const x = 0.12 + i / 40 * 0.86; pts.push(map(x, (c.bellyY ?? 0.022) + 0.006 * Math.sin(i * 1.13 + 0.7) + 0.004 * Math.sin(i * 2.71) + (x > 0.86 ? (x - 0.86) * 0.18 : 0))); }
    belly.moveTo(pts[0][0], pts[0][1]); for (const p of pts) belly.lineTo(p[0], p[1]);
    const b2 = map(0.98, 0.3), b3 = map(0.12, 0.3); belly.lineTo(b2[0], b2[1]); belly.lineTo(b3[0], b3[1]); belly.closePath();
    ctx.filter = `blur(${Math.max(1, len * 0.006)}px)`;
    ctx.fillStyle = c.belly; ctx.globalAlpha *= 0.85; ctx.fill(belly);
    ctx.restore();
  }
  // armor plates (Dunkleosteus)
  if (spec.armor) {
    ctx.save(); ctx.clip(path);
    const ar = new Path2D(); const a0 = map(spec.armor, -0.3), a1 = map(1.1, -0.3), a2 = map(1.1, 0.3), a3 = map(spec.armor - 0.02, 0.3);
    ar.moveTo(a0[0], a0[1]); ar.lineTo(a1[0], a1[1]); ar.lineTo(a2[0], a2[1]); ar.lineTo(a3[0], a3[1]); ar.closePath();
    const ag = ctx.createLinearGradient(...map(0.85,-0.17), ...map(0.85,0.12)); ag.addColorStop(0, c.armorTop || 'rgba(92,86,70,0.75)'); ag.addColorStop(1, c.armorBot || 'rgba(140,132,110,0.55)');
    ctx.fillStyle = ag; ctx.fill(ar);
    ctx.strokeStyle = 'rgba(10,10,8,0.45)'; ctx.lineWidth = Math.max(1, len * 0.0025);
    const seam = (pts) => { ctx.beginPath(); pts.forEach((q, i) => { const m = map(q[0], q[1]); i ? ctx.lineTo(m[0], m[1]) : ctx.moveTo(m[0], m[1]); }); ctx.stroke(); };
    seam([[spec.armor, -0.16], [spec.armor + 0.005, -0.05], [spec.armor - 0.005, 0.05], [spec.armor - 0.02, 0.13]]);
    seam([[0.86, -0.155], [0.85, -0.08], [0.84, 0.0], [0.82, 0.10]]);
    seam([[0.975, 0.046], [0.94, 0.050], [0.89, 0.058], [0.83, 0.075]]);
    seam([[0.83, 0.075], [0.80, 0.10], [0.785, 0.12]]);
    ctx.restore();
  }
  // rim light from above + soft shadow below
  innerGlow(ctx, path, 0, len * 0.012, len * 0.02, o.rim || 'rgba(170,215,235,0.55)');
  innerGlow(ctx, path, 0, -len * 0.01, len * 0.03, 'rgba(0,0,0,0.45)');
  // details
  ctx.save(); ctx.clip(path);
  if (spec.gills) {
    ctx.strokeStyle = 'rgba(8,12,16,0.55)'; ctx.lineWidth = Math.max(1, len * 0.0028);
    for (let i = 0; i < 5; i++) { const x = spec.gills[0] - (spec.gills[0] - spec.gills[1]) * i / 4; const a = map(x, -0.032 + i * 0.002), b = map(x - 0.006, 0.05 - i * 0.003); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(...map(x + 0.004, 0.01), b[0], b[1]); ctx.stroke(); }
  }
  if (spec.mouth) {
    const a = map(...spec.mouth[0]), b = map(...spec.mouth[1]);
    ctx.strokeStyle = 'rgba(5,8,10,0.6)'; ctx.lineWidth = Math.max(1, len * 0.003);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(...map((spec.mouth[0][0] + spec.mouth[1][0]) / 2, spec.mouth[1][1] + 0.004), b[0], b[1]); ctx.stroke();
  }
  if (spec.eye) {
    const e = map(spec.eye[0], spec.eye[1]);
    const r = spec.eye[2] * len;
    ctx.fillStyle = '#05080a'; ctx.beginPath(); ctx.arc(e[0], e[1], r, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(200,230,240,0.35)'; ctx.beginPath(); ctx.arc(e[0] - r * 0.3 * (o.flip ? -1 : 1), e[1] - r * 0.35, r * 0.28, 0, 7); ctx.fill();
    if (spec.armor) { ctx.strokeStyle = 'rgba(20,18,12,0.5)'; ctx.lineWidth = Math.max(1, len * 0.003); ctx.beginPath(); ctx.arc(e[0], e[1], r * 1.45, 0, 7); ctx.stroke(); }
  }
  ctx.restore();
  if (o.fog) { ctx.save(); ctx.globalAlpha *= o.fog[1]; ctx.fillStyle = o.fog[0]; if (o.blur) ctx.filter = `blur(${o.blur}px)`; ctx.fill(path); ctx.restore(); }
  ctx.restore();
  return path;
}

// Standing human (1.8 m) for scale. x = center, y = feet, h = height in px.
export function humanPath(x, y, h) {
  const R = [[0.022, -0.865], [0.098, -0.835], [0.122, -0.770], [0.132, -0.640], [0.128, -0.500], [0.118, -0.452], [0.098, -0.455], [0.100, -0.560], [0.094, -0.680],
    [0.080, -0.700], [0.078, -0.560], [0.092, -0.470], [0.090, -0.300], [0.078, -0.060], [0.090, -0.012], [0.086, 0.0], [0.024, 0.0], [0.030, -0.060], [0.026, -0.300], [0.0, -0.440]];
  const p = new Path2D();
  const pts = [...R, ...R.slice().reverse().map(q => [-q[0], q[1]])];
  p.moveTo(x + pts[0][0] * h, y + pts[0][1] * h);
  for (const q of pts) p.lineTo(x + q[0] * h, y + q[1] * h);
  p.closePath();
  p.ellipse(x, y - 0.93 * h, 0.055 * h, 0.068 * h, 0, 0, Math.PI * 2);
  return p;
}
