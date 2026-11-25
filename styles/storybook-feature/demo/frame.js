// Style frame for Golden-Age Storybook: a small mole carries a lantern along a forest path at dusk. Five painted levels
// (sky, far trees, the glade, the acting level, a dark foreground), a slow multiplane push, fireflies, a pool of light.
import { mulberry, vnoise, lerp, clamp, TAU } from '/core/lib.js';
import { follow, blink, breathe, slow } from '/core/anim.js';
import { wash, gouache, dryBrush, bloomSpot, level } from './paint.js';
import { cel, shade } from './cel.js';
import { glow, shaft, haze } from './light.js';

export const DUR = 6;
const DW = 1920, DH = 1080, M = 0.06;          // design size, level margin (share of the frame on each side)
const ell = (cx, cy, rx, ry, a0 = 0, a1 = TAU, n = 40, rot = 0) => Array.from({ length: n + 1 }, (_, i) => { const a = lerp(a0, a1, i / n); const x = Math.cos(a) * rx, y = Math.sin(a) * ry; return [cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]; });
const bez = (p0, p1, p2, p3, n = 20) => Array.from({ length: n + 1 }, (_, i) => { const u = i / n, v = 1 - u; return [0, 1].map(k => v * v * v * p0[k] + 3 * v * v * u * p1[k] + 3 * v * u * u * p2[k] + u * u * u * p3[k]); });
const blob = (cx, cy, r, seed, n = 9) => Array.from({ length: 48 }, (_, i) => { const a = i / 48 * TAU, k = 0.72 + 0.32 * vnoise(seed + Math.cos(a) * 1.6 + 3) + 0.18 * vnoise(seed * 2 + a * n * 0.5); return [cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k * 0.85]; });

// ── the levels (painted once) ───────────────────────────────────────────────────────────────────────
function paintSky(x, w, h) {
  const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#56628c'); g.addColorStop(0.35, '#9c8aa6'); g.addColorStop(0.62, '#e2b394'); g.addColorStop(0.8, '#f3d6ad'); g.addColorStop(1, '#efcfa2');
  x.fillStyle = g; x.fillRect(-200, -200, w + 400, h + 400);
  for (let i = 0; i < 7; i++) { const cx = 160 + i * 290, cy = 150 + (i % 3) * 70; wash(x, ell(cx, cy, 190 + (i % 2) * 80, 34, 0, TAU, 24), '#f4c6a6', { alpha: 0.35, seed: 10 + i, amp: 14, gran: 0.15 }); }
  wash(x, [[-200, 640], [200, 540], [520, 590], [900, 520], [1300, 575], [1700, 515], [2120, 570], [2120, 1200], [-200, 1200]], '#8a86ad', { alpha: 0.55, seed: 3, amp: 10 });
  wash(x, [[1450, 548], [1475, 520], [1500, 548]], '#6d6a92', { alpha: 0.8, seed: 4, amp: 2 });      // a far cottage
  bloomSpot(x, 1478, 540, 26, 'rgba(255,230,170,.35)');
}
function paintFarTrees(x, w, h) {
  const r = mulberry(21);
  for (let i = 0; i < 26; i++) { const cx = -100 + i * 90 + r() * 50, cy = 600 + r() * 40, s = 70 + r() * 60; wash(x, blob(cx, cy - s * 0.5, s, 100 + i, 11), i % 2 ? '#56687a' : '#4d6274', { alpha: 0.5, seed: 30 + i, amp: 9 }); }
  wash(x, [[-200, 620], [2120, 620], [2120, 760], [-200, 760]], '#5b6c74', { alpha: 0.45, seed: 9, amp: 12 });
}
function paintGlade(x, w, h) {
  // banks and the path
  wash(x, [[-200, 700], [700, 650], [960, 640], [1300, 650], [2120, 690], [2120, 1300], [-200, 1300]], '#4f6447', { alpha: 0.85, seed: 41, amp: 10 });
  wash(x, [[-200, 760], [500, 720], [800, 760], [700, 1300], [-200, 1300]], '#3f523d', { alpha: 0.6, seed: 42, amp: 14 });
  wash(x, [[2120, 760], [1500, 720], [1180, 770], [1300, 1300], [2120, 1300]], '#3e513c', { alpha: 0.6, seed: 43, amp: 14 });
  wash(x, [[930, 648], [995, 648], [1060, 700], [1150, 800], [1320, 1300], [560, 1300], [760, 820], [880, 700]], '#d2ad7c', { alpha: 0.85, seed: 44, amp: 8 });
  wash(x, [[940, 660], [985, 660], [1020, 720], [1070, 860], [860, 860], [900, 720]], '#e8c995', { alpha: 0.5, seed: 45, amp: 10, gran: 0.35 });
  for (let i = 0; i < 26; i++) { const a = i < 13, bx = a ? 80 + i * 55 : 1300 + (i - 13) * 55, by = 760 + (i % 4) * 60; dryBrush(x, [bx, by + 30], [bx + 8, by - 22], a ? '#2f4a33' : '#33502f', { width: 16, streaks: 5, seed: 60 + i, alpha: 0.55 }); }
  // the two great trees framing the glade
  const trunk = (x0, x1, lean, seed) => {
    wash(x, [[x0 - 70, 1300], [x0 - 10, 980], [x0 + lean * 0.4, 700], [x0 + lean, 300], [x0 + lean - 30, -200], [x1 + lean + 40, -200], [x1 + lean, 300], [x1 + lean * 0.4 + 6, 700], [x1 + 14, 980], [x1 + 80, 1300]], '#4e4040', { alpha: 0.92, seed, amp: 9 });
    for (let k = 0; k < 6; k++) dryBrush(x, [x0 + 20 + k * (x1 - x0 - 40) / 5, 1080], [x0 + lean + 10 + k * (x1 - x0 - 40) / 5, 80], '#3a2f2e', { width: 10, streaks: 3, alpha: 0.45, seed: seed + k });
    wash(x, [[x1 - 40, 1300], [x1 + lean - 30, 200], [x1 + lean, 200], [x1, 1300]], '#e7b47f', { alpha: 0.25, seed: seed + 9, amp: 4 });   // rim of warm sky light
  };
  trunk(170, 360, 40, 51); trunk(1590, 1740, -30, 52);
  [[120, 60, 240], [360, 10, 220], [600, -20, 190], [1350, -10, 200], [1620, 40, 260], [1860, 120, 220]].forEach(([cx, cy, r], i) => wash(x, blob(cx, cy, r, 200 + i, 12), i % 2 ? '#3d5646' : '#435c49', { alpha: 0.88, seed: 70 + i, amp: 16 }));
  // small things at the edges, away from the acting area: mushrooms and flowers in gouache
  [[430, 850], [470, 870], [1470, 880]].forEach(([mx, my], i) => { gouache(x, ell(mx, my, 26 - i * 4, 14, Math.PI, TAU, 16), '#c9653f', { seed: 80 + i }); gouache(x, [[mx - 6, my], [mx + 6, my], [mx + 5, my + 26], [mx - 5, my + 26]], '#efe0c4', { seed: 85 + i }); });
  const r = mulberry(91); for (let i = 0; i < 40; i++) { const side = i % 2, fx = side ? 1350 + r() * 500 : 60 + r() * 520, fy = 800 + r() * 240; gouache(x, ell(fx, fy, 4, 4, 0, TAU, 8), ['#f1e3b5', '#e8b8c4', '#d9e1f0'][i % 3], { seed: 100 + i, amp: 1, chalk: 0 }); }
}
function paintForeground(x, w, h) {
  const r = mulberry(7);
  const frond = (bx, by, len, ang, seed) => { const tip = [bx + Math.cos(ang) * len, by + Math.sin(ang) * len]; for (let k = 1; k < 9; k++) { const u = k / 9, px = lerp(bx, tip[0], u), py = lerp(by, tip[1], u) + Math.sin(u * 3) * 20; [1, -1].forEach(sd => wash(x, ell(px + sd * 26 * (1 - u), py - 10, 34 * (1 - u * 0.6), 12, 0, TAU, 12, ang + sd * 0.9), '#161a29', { alpha: 0.95, seed: seed + k * 3 + sd, amp: 3, gran: 0 })); } };
  frond(-60, 1180, 520, -0.75, 300); frond(60, 1200, 460, -1.05, 330); frond(2000, 1180, 520, -2.35, 360); frond(1880, 1220, 420, -2.0, 390);
  for (let i = 0; i < 9; i++) { const side = i % 2, cx = side ? 1960 - r() * 260 : -40 + r() * 260, cy = 900 + r() * 260; wash(x, blob(cx, cy, 120 + r() * 90, 500 + i, 7), '#151a28', { alpha: 0.96, seed: 520 + i, amp: 8, gran: 0 }); }
  wash(x, [[-200, -200], [700, -200], [620, 40], [380, 120], [120, 150], [-200, 260]], '#141826', { alpha: 0.97, seed: 400, amp: 20, gran: 0 });
  for (let i = 0; i < 14; i++) wash(x, ell(120 + i * 44 + r() * 30, 110 + Math.sin(i) * 50 + r() * 40, 46, 20, 0, TAU, 14, 0.4 + r()), '#171c2c', { alpha: 0.95, seed: 410 + i, amp: 5, gran: 0 });
}

// ── the mole (cel) ──────────────────────────────────────────────────────────────────────────────────
const FUR = '#8a7a86', BELLY = '#c8b3a9', PINK = '#e9a39a', SCARF = '#6f9a6a', LAMP = '#c39a52';
function mole(ctx, t, ox, oy, K, light) {
  const br = breathe(t, 0.3, 0.32, 1), sway = Math.sin(t * 1.6) * 0.03;
  const T = ([lx, ly]) => [ox + lx * K, oy + (ly * (1 + br * 0.012)) * K];
  const P = a => a.map(T);
  const eyeC = 1 - blink(t, [1.3, 4.2]);
  // scarf tail and lantern swing lag the body (follow-through)
  const sc = follow(s => Math.sin(s * 1.6) * 0.25, t, { freq: 1.6, damp: 0.25 });
  const sw = follow(s => Math.sin(s * 1.6) * 0.35, t, { freq: 1.1, damp: 0.2 });
  const shapes = [
    { pts: P(ell(-20, 4, 20, 9, Math.PI, TAU, 14)).concat(P([[0, 4]])), fill: PINK, blend: false },                     // back foot
    { pts: P(bez([-46, -10], [-62, -90], [-30, -150], [12, -156]).concat(bez([12, -156], [52, -158], [62, -110], [54, -60])).concat(bez([54, -60], [50, -14], [20, 2], [-12, 2])).concat(bez([-12, 2], [-32, 2], [-44, -2], [-46, -10]))), fill: FUR },  // pear body
    { pts: P(bez([-18, -30], [-26, -80], [6, -112], [34, -96]).concat(bez([34, -96], [52, -70], [40, -20], [10, -10]))), fill: BELLY, shadeK: 0.1 },      // belly
    { pts: P(bez([40, -138], [70, -138], [96, -128], [106, -118]).concat(bez([106, -118], [92, -106], [70, -102], [42, -108]))), fill: shade(FUR, 1.08) }, // snout
    { pts: P(ell(108, -118, 9, 8)), fill: PINK, shadeK: 0.15 },                                                          // nose
    { pts: P(bez([-30, -126], [-6, -118], [34, -116], [52, -126]).concat(bez([52, -126], [50, -110], [20, -100], [-30, -108]))), fill: SCARF },         // scarf band
    { pts: P([[-26, -118], [-60 - sc * 40, -104 + sc * 30], [-74 - sc * 60, -82 + sc * 50], [-50 - sc * 30, -86 + sc * 30], [-22, -106]]), fill: shade(SCARF, 0.9) }, // scarf tail
    { pts: P(ell(22, 4, 22, 10, Math.PI, TAU, 14)).concat(P([[44, 4]])), fill: PINK, blend: false },                    // front foot
    { pts: P(bez([28, -86], [56, -88], [74, -80], [80, -70]).concat(bez([80, -70], [70, -60], [50, -62], [30, -66]))), fill: FUR },                     // arm
    { pts: P(ell(84, -70, 15, 12, 0, TAU, 20, -0.3)), fill: PINK, shadeK: 0.12 },                                       // paw holding the ring
  ];
  cel(ctx, shapes, light);
  // eye: a small closed-happy curve or a dot, in a deep plum (no black on soft forms)
  ctx.save(); ctx.strokeStyle = '#3a2433'; ctx.fillStyle = '#3a2433'; ctx.lineWidth = 2.6 * K / 2; ctx.lineCap = 'round';
  const e = T([58, -132]);
  if (eyeC > 0.4) { ctx.beginPath(); ctx.ellipse(e[0], e[1], 4.2 * K / 2, 4.8 * K / 2 * eyeC, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#fff4dc'; ctx.beginPath(); ctx.arc(e[0] + 2, e[1] - 2, 1.4, 0, TAU); ctx.fill(); }
  else { ctx.beginPath(); ctx.moveTo(e[0] - 6, e[1]); ctx.quadraticCurveTo(e[0], e[1] + 3, e[0] + 6, e[1]); ctx.stroke(); }
  ctx.restore();
  // the lantern hangs from the paw and swings
  const ring = T([86, -64]), ang = sw, L = 34 * K;
  const lx = ring[0] + Math.sin(ang) * L, ly = ring[1] + Math.cos(ang) * L;
  ctx.save(); ctx.strokeStyle = shade(LAMP, 0.55); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...ring); ctx.lineTo(lx, ly - 14 * K / 2); ctx.stroke();
  ctx.translate(lx, ly); ctx.rotate(-ang * 0.8); const s = K / 2;
  const glass = [[-14 * s, -12 * s], [14 * s, -12 * s], [16 * s, 22 * s], [-16 * s, 22 * s]];
  const gg = ctx.createRadialGradient(0, 6 * s, 2, 0, 6 * s, 22 * s); gg.addColorStop(0, '#fff6d0'); gg.addColorStop(0.5, '#ffd27a'); gg.addColorStop(1, '#e59b45');
  ctx.fillStyle = gg; ctx.beginPath(); glass.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.fill();
  ctx.fillStyle = LAMP; ctx.strokeStyle = shade(LAMP, 0.6); ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(-18 * s, -12 * s); ctx.lineTo(0, -26 * s); ctx.lineTo(18 * s, -12 * s); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillRect(-19 * s, 22 * s, 38 * s, 6 * s); ctx.strokeRect(-19 * s, 22 * s, 38 * s, 6 * s);
  [-15, 0, 15].forEach(bx => { ctx.beginPath(); ctx.moveTo(bx * s, -12 * s); ctx.lineTo(bx * 1.08 * s, 22 * s); ctx.stroke(); });
  ctx.restore();
  return [lx, ly + 6 * K / 2];
}

// ── compositing ─────────────────────────────────────────────────────────────────────────────────────
let LV = null;
function build() {
  const pad = (fn) => level(DW * (1 + 2 * M), DH * (1 + 2 * M), 1.25, (x, w, h) => { x.translate(DW * M, DH * M); fn(x, DW, DH); });
  LV = { sky: pad(paintSky), far: pad(paintFarTrees), glade: pad(paintGlade), fg: pad(paintForeground) };
}
export function render(ctx, W, H, t) {
  if (!LV) build();
  const S = W / DW, u = slow(clamp(t / DUR), 0.5), push = 0.05 * u, pan = -40 * u;
  // one world → screen function per level: parallax f (foreground > 1), blur by distance from the acting plane
  const drawLevel = (img, f, blur) => {
    const z = 1 + push * f, ox = pan * f;
    ctx.save(); if (blur) ctx.filter = `blur(${blur * S}px)`;
    ctx.translate(W / 2 + ox * S, H * 0.62); ctx.scale(z * S, z * S); ctx.translate(-DW / 2, -DH * 0.62);
    ctx.drawImage(img, -DW * M, -DH * M, DW * (1 + 2 * M), DH * (1 + 2 * M)); ctx.restore();
  };
  const toScreen = (p, f) => { const z = 1 + push * f; return [W / 2 + (pan * f + (p[0] - DW / 2) * z) * S, H * 0.62 + (p[1] - DH * 0.62) * z * S]; };
  drawLevel(LV.sky, 0.2, 2.2);
  haze(ctx, W, H, '238,204,170', 0.22, 0.4, 0.8);
  drawLevel(LV.far, 0.45, 1.4);
  haze(ctx, W, H, '232,196,168', 0.16, 0.45, 0.9);
  drawLevel(LV.glade, 0.8, 0);
  shaft(ctx, [W * 0.78, -40], [W * 0.56, H * 0.85], 50 * S, 190 * S, '255,226,180', 0.1);
  // fireflies drifting up, never in step
  const r = mulberry(5);
  for (let i = 0; i < 26; i++) {
    const bx = 250 + r() * 1450, by = 480 + r() * 420, sp = 10 + r() * 16, ph = r() * TAU;
    const p = toScreen([bx + Math.sin(t * 0.7 + ph) * 26, by - ((t * sp + ph * 40) % 160) + Math.cos(t * 1.1 + ph) * 10], 0.9);
    const a = 0.45 + 0.55 * Math.max(0, Math.sin(t * (1.5 + r()) + ph));
    glow(ctx, p[0], p[1], 16 * S, '255,232,150', 0.5 * a); ctx.fillStyle = `rgba(255,248,210,${0.8 * a})`; ctx.beginPath(); ctx.arc(p[0], p[1], 2.2 * S, 0, TAU); ctx.fill();
  }
  // acting level: pool of light, contact shadow, the mole, the lantern's glow
  const feet = toScreen([960, 892], 1), K = 2.15 * S * (1 + push);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const pool = ctx.createRadialGradient(feet[0] + 90 * S, feet[1], 10, feet[0] + 90 * S, feet[1], 330 * S);
  pool.addColorStop(0, 'rgba(255,200,120,.32)'); pool.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = pool; ctx.beginPath(); ctx.ellipse(feet[0] + 90 * S, feet[1], 330 * S, 95 * S, 0, 0, TAU); ctx.fill(); ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.filter = `blur(${3 * S}px)`; ctx.fillStyle = 'rgba(70,45,60,.45)'; ctx.beginPath(); ctx.ellipse(feet[0] - 20 * S, feet[1] + 6 * S, 120 * S, 18 * S, 0, 0, TAU); ctx.fill(); ctx.restore();
  const lamp = mole(ctx, t, feet[0], feet[1], K, [feet[0] + 300 * S, feet[1] - 150 * S]);
  glow(ctx, lamp[0], lamp[1], 260 * S, '255,205,120', 0.42); glow(ctx, lamp[0], lamp[1], 60 * S, '255,240,200', 0.5);
  // foreground level, out of focus
  drawLevel(LV.fg, 1.45, 7);
  // subtitle: cream with a soft dark glow
  ctx.save(); ctx.font = `600 ${48 * S}px "Cormorant Garamond"`; ctx.textAlign = 'center'; ctx.fillStyle = '#f6ecd6'; ctx.shadowColor = 'rgba(20,14,26,.85)'; ctx.shadowBlur = 16 * S;
  ctx.fillText('The path was dark, so Mole brought his own light.', W / 2, H - 70 * S); ctx.restore();
  // print: vignette, warm bloom
  const v = ctx.createRadialGradient(W / 2, H * 0.55, H * 0.35, W / 2, H * 0.55, W * 0.7); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(30,18,30,.42)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
}
