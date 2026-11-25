// Watercolour and gouache for painted levels (STYLE.md §2). Painting is done once per level into a cached canvas.
import { mulberry, vnoise, lerp, clamp, TAU } from '/core/lib.js';

const grainCache = {};
function grain(size = 256, seed = 5) {
  if (grainCache[seed]) return grainCache[seed];
  const c = new OffscreenCanvas(size, size), x = c.getContext('2d'), r = mulberry(seed), img = x.createImageData(size, size);
  for (let i = 0; i < size * size; i++) { const v = r(); img.data[i * 4 + 3] = v < 0.5 ? 255 * v * 0.9 : 0; }
  x.putImageData(img, 0, 0); return (grainCache[seed] = c);
}
// A polygon with a soft, irregular watercolour edge.
export function wobble(poly, seed, amp = 6, freq = 0.045) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 8));
    for (let k = 0; k < n; k++) {
      const x = lerp(a[0], b[0], k / n), y = lerp(a[1], b[1], k / n);
      const n1 = vnoise(seed + x * freq + y * freq * 0.7) - 0.5 + 0.45 * (vnoise(seed * 3.1 + x * freq * 4 - y * freq * 3) - 0.5), n2 = vnoise(seed * 1.7 + y * freq - x * freq * 0.4) - 0.5 + 0.45 * (vnoise(seed * 5.3 + y * freq * 4 + x * freq * 3) - 0.5);
      out.push([x + n1 * 2 * amp, y + n2 * 2 * amp]);
    }
  }
  return out;
}
const path = (ctx, pts) => { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); };

// A transparent wash: several layered passes, a darker pooled edge, granulation in the pigment.
export function wash(ctx, poly, colour, { alpha = 0.55, passes = 3, edge = 0.45, gran = 0.3, seed = 1, amp = 7 } = {}) {
  ctx.save();
  for (let p = 0; p < passes; p++) {
    const pts = wobble(poly, seed + p * 13.1, amp * (1 - p * 0.18));
    ctx.globalAlpha = alpha / passes * (p ? 1 : 1.25); ctx.fillStyle = colour; path(ctx, pts); ctx.fill();
    if (p === 0 && edge > 0) { ctx.globalAlpha = edge * 0.5; ctx.strokeStyle = colour; ctx.lineWidth = 3; ctx.filter = 'blur(1.2px)'; ctx.stroke(); ctx.filter = 'none'; }
  }
  {                                                                          // wet-in-wet: pigment settles unevenly
    ctx.save(); path(ctx, wobble(poly, seed, amp)); ctx.clip();
    const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]), r = mulberry(seed * 3 + 1);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), R = Math.max(x1 - x0, y1 - y0);
    for (let i = 0; i < 5; i++) { const cx = lerp(x0, x1, r()), cy = lerp(y0, y1, r()), rr = R * (0.15 + r() * 0.3); const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr);
      const dark = r() < 0.6; g.addColorStop(0, dark ? colour : 'rgba(255,245,225,1)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.globalAlpha = dark ? alpha * 0.35 : 0.1; ctx.fillStyle = g; ctx.fillRect(cx - rr, cy - rr, 2 * rr, 2 * rr); }
    ctx.restore();
  }
  if (gran > 0) {
    path(ctx, wobble(poly, seed, amp)); ctx.clip();
    ctx.globalAlpha = gran; ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = ctx.createPattern(grain(256, seed % 7 + 2), 'repeat'); ctx.fillRect(-4000, -4000, 8000, 8000);
  }
  ctx.restore();
}
// Opaque gouache (lights, highlights, near leaves): flatter, with a slightly chalky top.
export function gouache(ctx, poly, colour, { seed = 1, amp = 3, chalk = 0.12 } = {}) {
  ctx.save(); ctx.fillStyle = colour; path(ctx, wobble(poly, seed, amp)); ctx.fill();
  if (chalk) { ctx.clip(); ctx.globalAlpha = chalk; ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = ctx.createPattern(grain(128, 3), 'repeat'); ctx.fillRect(-4000, -4000, 8000, 8000); }
  ctx.restore();
}
// Dry-brush: broken parallel streaks along a direction (bark, grass, stone).
export function dryBrush(ctx, a, b, colour, { width = 18, streaks = 9, alpha = 0.5, seed = 1 } = {}) {
  const r = mulberry(seed), dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  ctx.save(); ctx.strokeStyle = colour; ctx.lineCap = 'round';
  for (let i = 0; i < streaks; i++) {
    const o = (i / (streaks - 1) - 0.5) * width, s0 = r() * 0.25, s1 = 0.7 + r() * 0.3;
    ctx.globalAlpha = alpha * (0.4 + 0.6 * r()); ctx.lineWidth = 1 + r() * 2.2;
    let on = false; ctx.beginPath();
    for (let k = s0; k <= s1; k += 0.02) {
      const gap = vnoise(seed + i * 7 + k * 14) > 0.32;
      const x = a[0] + dx * k + nx * o, y = a[1] + dy * k + ny * o;
      if (gap && !on) { ctx.moveTo(x, y); on = true; } else if (gap) ctx.lineTo(x, y); else on = false;
    }
    ctx.stroke();
  }
  ctx.restore();
}
// A soft lighter ring where a drop of water landed in a wet wash.
export function bloomSpot(ctx, cx, cy, r, colour = 'rgba(255,248,230,.18)') {
  const g = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r); g.addColorStop(0, colour); g.addColorStop(0.8, colour); g.addColorStop(0.92, 'rgba(120,90,60,.08)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
}
// A painted level, cached at `scale` × the frame size so push-ins stay crisp. paintFn(ctx, w, h) paints in frame units.
export function level(w, h, scale, paintFn) {
  const c = new OffscreenCanvas(Math.round(w * scale), Math.round(h * scale)), x = c.getContext('2d');
  x.scale(scale, scale); paintFn(x, w, h); return c;
}
