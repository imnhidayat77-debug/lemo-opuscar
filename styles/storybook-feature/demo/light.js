// Light passes in screen space: glows around sources, volumetric shafts, haze between levels.
export function glow(ctx, x, y, r, colour = '255,214,140', a = 0.55) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${colour},${a})`); g.addColorStop(0.25, `rgba(${colour},${a * 0.45})`); g.addColorStop(1, `rgba(${colour},0)`);
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
}
export function shaft(ctx, from, to, w0, w1, colour = '255,226,180', a = 0.1) {
  const dx = to[0] - from[0], dy = to[1] - from[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(18px)';
  const g = ctx.createLinearGradient(from[0], from[1], to[0], to[1]); g.addColorStop(0, `rgba(${colour},${a})`); g.addColorStop(1, `rgba(${colour},0)`);
  ctx.fillStyle = g; ctx.beginPath();
  ctx.moveTo(from[0] + nx * w0, from[1] + ny * w0); ctx.lineTo(to[0] + nx * w1, to[1] + ny * w1); ctx.lineTo(to[0] - nx * w1, to[1] - ny * w1); ctx.lineTo(from[0] - nx * w0, from[1] - ny * w0);
  ctx.fill(); ctx.restore();
}
export function haze(ctx, w, h, colour = '232,200,170', a = 0.18, y0 = 0.35, y1 = 1) {
  const g = ctx.createLinearGradient(0, h * y0, 0, h * y1); g.addColorStop(0, `rgba(${colour},0)`); g.addColorStop(0.5, `rgba(${colour},${a})`); g.addColorStop(1, `rgba(${colour},0)`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
}
