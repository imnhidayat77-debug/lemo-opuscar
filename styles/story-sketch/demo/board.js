// The board, pinned sheets and the sketch media: charcoal, chalk, smudge, pastel on toned paper (STYLE.md §2).
import { mulberry, vnoise, lerp, clamp, TAU } from '/core/lib.js';

const gc = {};
function grain(hex, dens, seed, size = 200) {
  const k = hex + dens + seed; if (gc[k]) return gc[k];
  const c = new OffscreenCanvas(size, size), x = c.getContext('2d'), r = mulberry(seed), img = x.createImageData(size, size);
  const [R, G, B] = hex.match(/\w\w/g).map(h => parseInt(h, 16));
  for (let i = 0; i < size * size; i++) { const v = r(); img.data[i * 4] = R; img.data[i * 4 + 1] = G; img.data[i * 4 + 2] = B; img.data[i * 4 + 3] = v < dens ? 140 + 115 * r() : 0; }
  x.putImageData(img, 0, 0); return (gc[k] = c);
}
const resample = (pts, step = 4) => { const out = [pts[0]]; for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step)); for (let k = 1; k <= n; k++) out.push([lerp(a[0], b[0], k / n), lerp(a[1], b[1], k / n)]); } return out; };
const path = (ctx, pts) => { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); };

// Charcoal: a soft, grainy stroke broken by the paper tooth, with a lighter second pass.
export function charcoal(ctx, pts, { seed = 1, w = 5, hex = '211d1a', dens = 0.7, alpha = 0.95, wobble = 1.6 } = {}) {
  w *= 1.7; const P = resample(pts), r = mulberry(seed);
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = ctx.createPattern(grain(hex, dens, seed % 5 + 1), 'repeat');
  for (let pass = 0; pass < 2; pass++) {
    const ph = r() * 40; ctx.beginPath();
    P.forEach((p, i) => { const u = i / (P.length - 1), q = [p[0] + (vnoise(ph + u * 9) - 0.5) * 2 * wobble, p[1] + (vnoise(ph + 3 + u * 9) - 0.5) * 2 * wobble]; i ? ctx.lineTo(...q) : ctx.moveTo(...q); });
    ctx.globalAlpha = alpha * (pass ? 0.5 : 1); ctx.lineWidth = w * (pass ? 1.7 : 1); ctx.stroke();
  }
  ctx.restore();
}
export const chalk = (ctx, pts, o = {}) => charcoal(ctx, pts, { hex: 'f7f2e8', dens: 0.75, alpha: 1, w: 4, ...o });
// A rubbed tone: a blurred, grainy fill.
export function smudge(ctx, poly, { hex = '221e1b', alpha = 0.45, blur = 6, seed = 1 } = {}) {
  ctx.save(); ctx.filter = `blur(${blur}px)`; ctx.globalAlpha = Math.min(1, alpha * 1.45); ctx.fillStyle = ctx.createPattern(grain(hex, 0.8, seed % 5 + 7), 'repeat'); path(ctx, poly); ctx.fill(); ctx.restore();
}
// Pastel: a broad grainy patch that doesn't quite fit the drawing.
export function pastel(ctx, poly, hex, { alpha = 0.85, seed = 1 } = {}) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = ctx.createPattern(grain(hex, 0.55, seed % 5 + 13), 'repeat');
  const r = mulberry(seed); path(ctx, poly.map(([x, y]) => [x + (r() - 0.5) * 6, y + (r() - 0.5) * 6])); ctx.fill(); ctx.restore();
}

// The board: fibreboard with fibre noise, old pin holes, a soft top light. Painted once.
export function board(w, h, seed = 3) {
  const c = new OffscreenCanvas(w, h), x = c.getContext('2d'), r = mulberry(seed);
  x.fillStyle = '#8f7f6c'; x.fillRect(0, 0, w, h);
  x.globalAlpha = 0.35; x.fillStyle = x.createPattern(grain('5d5044', 0.5, 2, 256), 'repeat'); x.fillRect(0, 0, w, h);
  x.globalAlpha = 0.18; x.fillStyle = x.createPattern(grain('b8a892', 0.4, 4, 230), 'repeat'); x.fillRect(0, 0, w, h);
  x.globalAlpha = 1;
  for (let i = 0; i < w * h / 6000; i++) { const px = r() * w, py = r() * h; x.fillStyle = 'rgba(40,32,26,.7)'; x.beginPath(); x.arc(px, py, 1.6, 0, TAU); x.fill(); x.fillStyle = 'rgba(200,185,160,.25)'; x.beginPath(); x.arc(px + 0.8, py + 0.8, 2.4, 0, Math.PI); x.fill(); }
  return c;
}
// A sheet pinned to the board. img: the sketch canvas. Drawn at (cx, cy) with size sw × sh, rotation rot.
export function pinned(ctx, img, cx, cy, sw, sh, rot, { pins = 'corners', pinHue = '#c8402e', seed = 1, lift = 1 } = {}) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
  ctx.save(); ctx.filter = `blur(${7 * lift}px)`; ctx.fillStyle = 'rgba(20,14,10,.45)'; ctx.fillRect(-sw / 2 + 4, -sh / 2 + 9 * lift, sw, sh); ctx.restore();
  ctx.drawImage(img, -sw / 2, -sh / 2, sw, sh);
  const g = ctx.createLinearGradient(sw / 2 - 30, sh / 2 - 30, sw / 2, sh / 2); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,250,235,.18)');  // a curling corner catches light
  ctx.fillStyle = g; ctx.fillRect(sw / 2 - 40, sh / 2 - 40, 40, 40);
  const pin = (px, py) => {
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(px + 4, py + 6, 9, 7, 0, 0, TAU); ctx.fill();
    const gg = ctx.createRadialGradient(px - 3, py - 3, 1, px, py, 10); gg.addColorStop(0, '#fff1e0'); gg.addColorStop(0.35, pinHue); gg.addColorStop(1, '#3a1410');
    ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(px, py, 9, 0, TAU); ctx.fill();
  };
  if (pins === 'corners') { pin(-sw / 2 + 16, -sh / 2 + 16); pin(sw / 2 - 16, -sh / 2 + 16); } else pin(0, -sh / 2 + 16);
  ctx.restore();
}
// A blank toned sheet to draw a sketch on.
export function sheet(w, h, tone, seed = 1) {
  const c = new OffscreenCanvas(w, h), x = c.getContext('2d');
  x.fillStyle = tone; x.fillRect(0, 0, w, h);
  x.globalAlpha = 0.12; x.fillStyle = x.createPattern(grain('ffffff', 0.3, seed % 5 + 20), 'repeat'); x.fillRect(0, 0, w, h);
  x.globalAlpha = 0.1; x.fillStyle = x.createPattern(grain('000000', 0.25, seed % 5 + 25), 'repeat'); x.fillRect(0, 0, w, h); x.globalAlpha = 1;
  return c;
}
