// The xerox line and the offset colour patches (STYLE.md §2). Pure functions; line noise is seeded per drawing.
import { mulberry, vnoise, lerp, clamp, TAU } from '/core/lib.js';

const gcache = {};
function toner(hex, seed = 3, size = 192) {
  const k = hex + seed; if (gcache[k]) return gcache[k];
  const c = new OffscreenCanvas(size, size), x = c.getContext('2d'), r = mulberry(seed), img = x.createImageData(size, size);
  const [R, G, B] = hex.match(/\w\w/g).map(h => parseInt(h, 16));
  for (let i = 0; i < size * size; i++) { img.data[i * 4] = R; img.data[i * 4 + 1] = G; img.data[i * 4 + 2] = B; img.data[i * 4 + 3] = r() < 0.86 ? 255 : 90 * r(); }
  x.putImageData(img, 0, 0); return (gcache[k] = c);
}
export function resample(pts, step = 4, closed = false) {
  const src = closed ? [...pts, pts[0]] : pts, out = [src[0]];
  for (let i = 1; i < src.length; i++) { const a = src[i - 1], b = src[i], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step)); for (let k = 1; k <= n; k++) out.push([lerp(a[0], b[0], k / n), lerp(a[1], b[1], k / n)]); }
  return out;
}
const path = (ctx, pts) => { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); };

// The rough copied pencil line: 2–3 passes, pressure, gaps where noise drops, corner overshoot, ragged toner edge.
export function xline(ctx, pts, { seed = 1, w = 3.2, colour = '151312', closed = false, passes = 2, gaps = 0.05, wobble = 1.3, search = 0.3, alpha = 0.95 } = {}) {
  if (pts.length < 2) return;
  const P = resample(pts, 4, closed), r = mulberry(seed * 977 + Math.round(P[0][0] * 5 + P[0][1] * 3)), N = P.length - 1;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = ctx.createPattern(toner(colour), 'repeat');
  const pass = (wMul, aMul, off, over) => {
    const ph = r() * 50, gp = r() * 50; let prev = null;
    for (let i = -over; i <= N + over; i++) {
      const j = clamp(i, 0, N), a = P[Math.max(0, j - 1)], b = P[Math.min(N, j + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1;
      const ext = i < 0 ? i : i > N ? i - N : 0;                                    // overshoot past the ends
      const u = j / Math.max(1, N), wob = (vnoise(ph + u * N * 0.06) - 0.5) * 2 * wobble + off;
      const q = [P[j][0] + dx / d * ext * 4 - dy / d * wob, P[j][1] + dy / d * ext * 4 + dx / d * wob];
      const gap = vnoise(gp + j * 0.11) < gaps * 4 && vnoise(gp * 2 + j * 0.37) < 0.5;
      if (prev && !gap) {
        const pr = 0.65 + 0.55 * vnoise(ph * 3 + j * 0.05);
        ctx.globalAlpha = alpha * aMul; ctx.lineWidth = Math.max(0.8, w * wMul * pr);
        ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
      }
      prev = gap ? null : q;
    }
  };
  for (let p = 0; p < passes; p++) pass(p ? 0.6 : 1, p ? 0.8 : 1, (r() - 0.5) * 1.6, closed ? 0 : 3);
  if (r() < search) pass(0.45, 0.45, (r() < 0.5 ? -1 : 1) * (2.5 + r() * 2.5), 2);
  ctx.restore();
}
// Character paint: clean fill inside the closed line path (paint never leaks).
export function fillClean(ctx, pts, colour) { ctx.save(); ctx.fillStyle = colour; path(ctx, pts); ctx.fill(); ctx.restore(); }
// Background colour: a flat shape with a slightly irregular edge, offset from the drawing it belongs to, with a
// drybrush or crayon texture.
export function patch(ctx, pts, colour, { dx = 12, dy = 6, wobble = 3, seed = 1, texture = 'dry', alpha = 1 } = {}) {
  const P = resample(pts, 10, true).map(([x, y], i) => [x + dx + (vnoise(seed + i * 0.3) - 0.5) * 2 * wobble, y + dy + (vnoise(seed * 2 + i * 0.3) - 0.5) * 2 * wobble]);
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = colour; path(ctx, P); ctx.fill(); ctx.clip();
  const xs = P.map(p => p[0]), ys = P.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), r = mulberry(seed);
  if (texture === 'dry') {                       // light streaks where the brush ran dry
    ctx.strokeStyle = 'rgba(255,250,236,.22)';
    for (let y = y0; y < y1; y += 5) { if (r() < 0.45) continue; ctx.lineWidth = 1 + r() * 2; ctx.beginPath(); const s = lerp(x0, x1, r()); ctx.moveTo(s, y + r() * 3); ctx.lineTo(s + (x1 - x0) * (0.2 + r() * 0.5), y + r() * 3); ctx.stroke(); }
  } else if (texture === 'crayon') {
    ctx.fillStyle = 'rgba(255,250,236,.16)'; for (let i = 0; i < (x1 - x0) * (y1 - y0) / 60; i++) ctx.fillRect(lerp(x0, x1, r()), lerp(y0, y1, r()), 2, 1.2);
  }
  ctx.restore();
}
// Hatching inside a shape (background shadows), in the background line.
export function hatch(ctx, pts, { angle = 0.9, gap = 11, seed = 1, w = 1.3 } = {}) {
  ctx.save(); path(ctx, pts); ctx.clip();
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const L = Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)), c = Math.cos(angle), s = Math.sin(angle);
  for (let k = -L / 2, i = 0; k < L / 2; k += gap, i++) xline(ctx, [[cx - s * k - c * L / 2, cy + c * k - s * L / 2], [cx - s * k + c * L / 2, cy + c * k + s * L / 2]], { seed: seed + i, w, passes: 1, search: 0, gaps: 0.12 });
  ctx.restore();
}
export function paper(ctx, w, h) {
  ctx.fillStyle = '#f2ead8'; ctx.fillRect(0, 0, w, h);
  const r = mulberry(4); ctx.fillStyle = 'rgba(120,100,70,.05)'; for (let i = 0; i < w * h / 900; i++) ctx.fillRect(r() * w, r() * h, 1.5, 1.5);
}
