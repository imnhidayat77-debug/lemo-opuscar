// Pencil engine: graphite and construction pencil on animation paper. Pure functions of their inputs; strokes are
// seeded by the drawing number, so a held drawing holds and every new drawing boils (STYLE.md §2).
import { mulberry, vnoise, clamp, lerp, TAU } from '/core/lib.js';

export const DRAW_FPS = 12;                                     // on twos at 24 fps
export const drawingSeed = (t, fps = DRAW_FPS) => Math.floor(t * fps + 1e-6);

// ── grain textures (built once) ───────────────────────────────────────────────────────────────────────
const grainCache = {};
function grain(colour, density = 0.55, size = 256, seed = 7) {
  const k = colour + density;
  if (grainCache[k]) return grainCache[k];
  const c = new OffscreenCanvas(size, size), x = c.getContext('2d'), r = mulberry(seed), img = x.createImageData(size, size);
  const [R, G, B] = colour.match(/\w\w/g).map(h => parseInt(h, 16));
  for (let i = 0; i < size * size; i++) {
    const v = r(), a = v < density ? 255 * (0.55 + 0.45 * r()) : 255 * 0.25 * r();
    img.data[i * 4] = R; img.data[i * 4 + 1] = G; img.data[i * 4 + 2] = B; img.data[i * 4 + 3] = a;
  }
  x.putImageData(img, 0, 0); return (grainCache[k] = c);
}

// ── geometry ─────────────────────────────────────────────────────────────────────────────────────────
export function ellipsePts(cx, cy, rx, ry, rot = 0, a0 = 0, a1 = TAU, n = 48) {
  const out = [], c = Math.cos(rot), s = Math.sin(rot);
  for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n), px = Math.cos(a) * rx, py = Math.sin(a) * ry; out.push([cx + px * c - py * s, cy + px * s + py * c]); }
  return out;
}
export function bezierPts(p0, p1, p2, p3, n = 24) {
  const out = [];
  for (let i = 0; i <= n; i++) { const u = i / n, v = 1 - u; out.push([v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]]); }
  return out;
}
export const transform = (pts, f) => pts.map(f);
// Even spacing (≤ step px) so short and sparse paths still get pressure and wobble along their length.
export function resample(pts, step = 5) {
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
    for (let k = 1; k <= n; k++) out.push([lerp(a[0], b[0], k / n), lerp(a[1], b[1], k / n)]);
  }
  if (out.length < 8) { const o2 = []; for (let i = 0; i < 8; i++) { const f = i / 7 * (out.length - 1), j = Math.min(out.length - 2, Math.floor(f)), k = f - j; o2.push([lerp(out[j][0], out[j + 1][0], k), lerp(out[j][1], out[j + 1][1], k)]); } return o2; }
  return out;
}

// ── the stroke ───────────────────────────────────────────────────────────────────────────────────────
// pts: the path. Several slightly different passes, each a chain of short segments with pressure (thick in the middle,
// light at the ends), a wobble, and a start/end that over- or under-shoots. Graphite texture comes from a grain pattern.
export function stroke(ctx, pts, { seed = 1, w = 2.4, colour = '2c2a28', alpha = 0.85, passes = 2, wobble = 1.4, search = 0.33, taper = 0.6, dash = 0 } = {}) {
  if (pts.length < 2) return;
  pts = resample(pts, 5);
  const r = mulberry(seed * 7919 + Math.round(pts[0][0] * 3 + pts[0][1] * 7));
  const pat = ctx.createPattern(grain(colour, 0.5), 'repeat');
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = pat;
  const len = pts.length - 1;
  const doPass = (p, wMul, aMul, off) => {
    const ph = r() * 100, ph2 = r() * 100, s0 = -0.04 + r() * 0.08, s1 = 1 - 0.05 + r() * 0.1;
    let prev = null;
    for (let i = 0; i <= len; i++) {
      const u = i / len; if (u < s0 || u > s1) continue;
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(len, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1;
      const nx = -dy / d, ny = dx / d, wob = (vnoise(ph + u * 6) - 0.5) * 2 * wobble + off;
      const q = [pts[i][0] + nx * wob, pts[i][1] + ny * wob];
      if (prev) {
        if (dash && Math.floor(u * dash) % 2) { prev = q; continue; }
        const pressure = Math.pow(Math.sin(Math.PI * clamp((u - s0) / (s1 - s0))), taper) * (0.75 + 0.5 * vnoise(ph2 + u * 9));
        ctx.globalAlpha = alpha * aMul * clamp(0.35 + pressure);
        ctx.lineWidth = Math.max(0.6, w * wMul * pressure);
        ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
      }
      prev = q;
    }
  };
  for (let p = 0; p < passes; p++) doPass(p, p ? 0.75 : 1, p ? 0.75 : 1, (r() - 0.5) * 1.2);
  if (r() < search) doPass(9, 0.55, 0.4, (r() < 0.5 ? -1 : 1) * (2 + r() * 3));   // a search line a little off
  ctx.restore();
}
// Construction pencil: lighter, longer, looser.
export const BLUE = '5f8fcf';
export const blue = (ctx, pts, seed, o = {}) => stroke(ctx, pts, { seed, w: 1.8, colour: BLUE, alpha: 0.5, passes: 1, wobble: 2.2, search: 0.15, ...o });

// Side-of-the-pencil tone: parallel hatch strokes clipped to a shape.
export function tone(ctx, pts, { seed = 1, angle = -0.9, gap = 5, alpha = 0.32, w = 1.6 } = {}) {
  ctx.save(); ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.clip();
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), x0 = Math.min(...xs) - 20, x1 = Math.max(...xs) + 20, y0 = Math.min(...ys) - 20, y1 = Math.max(...ys) + 20;
  const L = Math.hypot(x1 - x0, y1 - y0), c = Math.cos(angle), s = Math.sin(angle), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  for (let k = -L / 2, i = 0; k < L / 2; k += gap, i++) {
    const ax = cx - s * k - c * L / 2, ay = cy + c * k - s * L / 2;
    stroke(ctx, [[ax, ay], [ax + c * L, ay + s * L]], { seed: seed + i, w, alpha, passes: 1, wobble: 0.8, search: 0 });
  }
  ctx.restore();
}

// ── the sheet ────────────────────────────────────────────────────────────────────────────────────────
// Paper with tooth, a light-table glow from behind, and three peg holes (round, slot, round) at the bottom edge.
let paperCache = null;
export function paper(w, h) {
  if (paperCache && paperCache.width === w) return paperCache;
  const c = new OffscreenCanvas(w, h), x = c.getContext('2d');
  x.fillStyle = '#efe9dc'; x.fillRect(0, 0, w, h);
  const g = x.createRadialGradient(w * 0.5, h * 0.45, h * 0.1, w * 0.5, h * 0.5, w * 0.7);
  g.addColorStop(0, 'rgba(255,253,246,.55)'); g.addColorStop(1, 'rgba(190,176,150,.35)'); x.fillStyle = g; x.fillRect(0, 0, w, h);
  x.globalAlpha = 0.09; x.fillStyle = x.createPattern(grain('6d5f48', 0.35, 256, 3), 'repeat'); x.fillRect(0, 0, w, h);
  x.globalAlpha = 0.05; x.fillStyle = x.createPattern(grain('3a332a', 0.2, 173, 11), 'repeat'); x.fillRect(0, 0, w, h);
  x.globalAlpha = 1;
  return (paperCache = c);
}
export function pegHoles(ctx, cx, y, s = 1) {
  ctx.save(); ctx.fillStyle = '#2a2622';
  const hole = (px, rx) => { ctx.beginPath(); ctx.ellipse(px, y, rx, 13 * s, 0, 0, TAU); ctx.fill(); };
  hole(cx - 200 * s, 13 * s); hole(cx + 200 * s, 13 * s);
  ctx.beginPath(); ctx.roundRect(cx - 40 * s, y - 9 * s, 80 * s, 18 * s, 9 * s); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 1.5;               // the punched edge catches the light
  [[cx - 200 * s, 13 * s], [cx + 200 * s, 13 * s]].forEach(([px, rx]) => { ctx.beginPath(); ctx.ellipse(px, y - 1, rx + 1, 14 * s, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); });
  ctx.restore();
}
