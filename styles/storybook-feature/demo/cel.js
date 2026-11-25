// Cel characters: flat paint, self-coloured lines (a darker shade of the fill), a soft blend shade on the edge away from
// the key light, gouache highlights. No black outlines on soft forms (STYLE.md §2, §9).
const path = (ctx, pts) => { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); };
export function shade(hex, k) {                     // darken (k < 1) or lighten (k > 1) a #rrggbb colour
  const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(k < 1 ? v * k : v + (255 - v) * (k - 1)))));
  return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
}
// shapes: [{pts, fill, line?, lw?, open?, shadeK?}], drawn in order. light: [x, y] of the key light in the same space.
export function cel(ctx, shapes, light, { blend = 0.22 } = {}) {
  for (const s of shapes) {
    if (s.open) { ctx.save(); ctx.strokeStyle = s.line || shade(s.fill, 0.55); ctx.lineWidth = s.lw || 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); s.pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore(); continue; }
    ctx.save(); path(ctx, s.pts); ctx.fillStyle = s.fill; ctx.fill();
    if (blend && s.blend !== false) {                                    // turning-edge shade away from the light
      ctx.clip();
      const xs = s.pts.map(p => p[0]), ys = s.pts.map(p => p[1]);
      const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2, R = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) * 0.75;
      const dx = light[0] - cx, dy = light[1] - cy, d = Math.hypot(dx, dy) || 1;
      const g = ctx.createRadialGradient(cx + dx / d * R * 0.35, cy + dy / d * R * 0.35, R * 0.35, cx + dx / d * R * 0.2, cy + dy / d * R * 0.2, R * 1.1);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(40,20,50,${s.shadeK ?? blend})`);
      ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = g; ctx.fillRect(cx - R * 2, cy - R * 2, R * 4, R * 4);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();
    ctx.save(); path(ctx, s.pts); ctx.strokeStyle = s.line || shade(s.fill, 0.6); ctx.lineWidth = s.lw || 2.2; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
  }
}
