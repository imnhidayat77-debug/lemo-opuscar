// Style frame for Pencil Test: a sparrow's hop, anticipation → stretch → arc → landing squash → settle → look back.
// Animated with core/anim.js so every drawing obeys ANIMATION.md; render(t) draws the drawing that is on screen at t.
import { clamp, lerp, TAU, mulberry } from '/core/lib.js';
import { poses, onTwos, squash, arc, follow, blink, slow, movingHold } from '/core/anim.js';
import { stroke, blue, tone, ellipsePts, bezierPts, paper, pegHoles, drawingSeed, DRAW_FPS } from './pencil.js';

export const DUR = 3.2;
const GROUND = 800, X0 = 600, X1 = 1250;
// key poses (s = squash/stretch of the body, lean = rotation, wing 0 folded → 1 up, legs 1 standing → 0 tucked)
const KEYS = [
  { t: 0.00, v: { s: 1.00, lean: 0.00, wing: 0.0, legs: 1.0, head: 0.0, air: 0 } },
  { t: 0.30, v: { s: 0.76, lean: 0.22, wing: 0.1, legs: 0.8, head: 0.12, air: 0 }, ease: 'in' },      // crouch: anticipation
  { t: 0.42, v: { s: 0.74, lean: 0.24, wing: 0.15, legs: 0.78, head: 0.14, air: 0 }, ease: 'out', fa: 0.9 }, // hold the crouch
  { t: 0.54, v: { s: 1.30, lean: -0.35, wing: 0.9, legs: 1.15, head: -0.1, air: 0 }, ease: 'lin' },  // spring: stretch
  { t: 0.66, v: { s: 1.10, lean: -0.15, wing: 1.0, legs: 0.2, head: -0.05, air: 1 } },
  { t: 0.95, v: { s: 0.98, lean: 0.10, wing: 0.6, legs: 0.3, head: 0.05, air: 1 } },
  { t: 1.08, v: { s: 1.12, lean: 0.20, wing: 0.95, legs: 1.1, head: 0.0, air: 1 }, ease: 'lin' },    // reach for the ground
  { t: 1.16, v: { s: 0.70, lean: 0.30, wing: 0.7, legs: 0.7, head: 0.25, air: 0 } },                // land: squash
  { t: 1.42, v: { s: 1.06, lean: -0.04, wing: 0.15, legs: 1.0, head: -0.06, air: 0 } },              // overshoot
  { t: 1.70, v: { s: 1.00, lean: 0.00, wing: 0.0, legs: 1.0, head: 0.0, air: 0 } },                  // settle
  { t: 2.10, v: { s: 1.00, lean: 0.00, wing: 0.0, legs: 1.0, head: 0.0, air: 0 } },
  { t: 2.40, v: { s: 1.02, lean: -0.05, wing: 0.0, legs: 1.0, head: -0.5, air: 0 } },                // looks back at where it was
];
const T_OFF = 0.54, T_LAND = 1.16;
function pose(t) {
  const p = poses(KEYS, t);
  const u = clamp((t - T_OFF) / (T_LAND - T_OFF));
  const [x, y] = arc([X0, GROUND], [X1, GROUND], slow(u, 0.25, 0.15), -0.5);   // the path of action is an arc
  p.x = t < T_OFF ? X0 : t > T_LAND ? X1 : x; p.y = t < T_OFF || t > T_LAND ? GROUND : Math.min(GROUND, y);
  // the tail drags behind the body's rotation (follow-through), the hold drifts (moving hold)
  p.tail = follow(s => poses(KEYS, s).lean, t, { freq: 3.2, damp: 0.3 }) - p.lean;
  p.s += movingHold(t, 1.7, 2.1, 0.02);
  p.blink = blink(t, [2.12, 2.9]);
  return p;
}

// The sparrow, in local units (feet at the origin, facing right), transformed to the frame point by point.
function sparrow(ctx, p, seed, { alpha = 1, construct = false, onion = false } = {}) {
  const { sx, sy } = squash(p.s), c = Math.cos(p.lean), sn = Math.sin(p.lean), K = 1.75;
  const T = ([lx, ly]) => { const ax = lx * sx * K, ay = ly * sy * K; return [p.x + ax * c - ay * sn, p.y + ax * sn + ay * c]; };
  const P = pts => pts.map(T);
  const g = { seed, alpha: (onion ? 0.2 : 0.95) * alpha, w: onion ? 2 : 3.4, passes: onion ? 1 : 2, search: onion ? 0 : 0.35 };
  const hc = [60, -150], hr = 40, ht = p.head;                                  // head centre (turns with p.head)
  const H = ([lx, ly]) => { const dx = lx - hc[0], dy = ly - hc[1], cc = Math.cos(ht), ss = Math.sin(ht); return [hc[0] + dx * cc - dy * ss, hc[1] + dx * ss + dy * cc]; };
  const look = p.head < -0.3 ? -1 : 1;                                          // the head turns back: beak flips

  if (construct) {                                                               // blue pencil first: the shapes it's built on
    blue(ctx, P(ellipsePts(0, -84, 80, 54, -0.25)), seed + 1);
    blue(ctx, P(ellipsePts(hc[0], hc[1], hr + 2, hr + 2)), seed + 2);
    blue(ctx, P(ellipsePts(hc[0], hc[1], hr, 4, 0.1)), seed + 3, { alpha: 0.35 });
    blue(ctx, P(bezierPts([-150, -84], [-40, -40], [20, -160], [hc[0] + 30 * look, hc[1] - 30])), seed + 4, { alpha: 0.45, w: 2.2 }); // line of action
    blue(ctx, P([[2, -30], [-4, 0]]), seed + 5); blue(ctx, P([[18, -30], [14, 0]]), seed + 6);
  }
  // body
  stroke(ctx, P(ellipsePts(0, -84, 78, 52, -0.25, 0.2, 2.95, 40)), { ...g, seed: seed + 10 });          // belly
  stroke(ctx, P(bezierPts([-76, -66], [-60, -120], [-10, -136], [30, -128])), { ...g, seed: seed + 11 }); // back
  // tail (follows through)
  const ta = p.tail * 1.4, tip = [Math.cos(Math.PI + 0.25 + ta), Math.sin(Math.PI + 0.25 + ta)];
  const tb = [-70, -80], tl = [tb[0] + tip[0] * 52, tb[1] + tip[1] * 52 - 8];
  stroke(ctx, P([[-60, -100], tl, [tl[0] + 4, tl[1] + 14], [tl[0] + 14, tl[1] + 24], [-56, -68]]), { ...g, seed: seed + 12 });
  stroke(ctx, P([[-70, -84], [tl[0] + 10, tl[1] + 8]]), { ...g, seed: seed + 13, alpha: g.alpha * 0.45, w: 1.4 });
  // wing: folded along the body; opening, it lifts and fans out (leading edge, scalloped primaries)
  const wu = p.wing, sh = [-6, -112];
  const wtip = [lerp(-96, -60, wu), lerp(-76, -236, wu)], wmid = [lerp(-50, -10, wu), lerp(-124, -210, wu)];
  stroke(ctx, P(bezierPts(sh, [lerp(-30, 4, wu), lerp(-128, -170, wu)], wmid, wtip)), { ...g, seed: seed + 14 });           // leading edge
  const back = [lerp(-70, -46, wu), lerp(-72, -104, wu)];
  const fan = [];                                                                                                          // trailing edge, scalloped
  for (let i = 0; i <= 4; i++) { const u = i / 4; fan.push([lerp(wtip[0], back[0], u) + Math.sin(u * Math.PI * 4) * 5 * wu, lerp(wtip[1], back[1], u) + Math.abs(Math.sin(u * Math.PI * 4)) * 8 * wu]); }
  stroke(ctx, P([...fan, [lerp(-40, -30, wu), lerp(-90, -104, wu)], sh]), { ...g, seed: seed + 15 });
  if (!onion) for (let i = 1; i < 4; i++) { const u = i / 4, a2 = [lerp(wtip[0], back[0], u), lerp(wtip[1], back[1], u)]; stroke(ctx, P([a2, [lerp(a2[0], sh[0], 0.45), lerp(a2[1], sh[1], 0.45)]]), { ...g, seed: seed + 16 + i, w: 1.6, alpha: g.alpha * 0.5, search: 0 }); }
  // head
  stroke(ctx, P(ellipsePts(hc[0], hc[1], hr, hr * 0.96, 0, look > 0 ? -2.3 : -0.9, look > 0 ? 2.0 : 3.6, 36).map(H)), { ...g, seed: seed + 20 });
  const bk = look > 0 ? [[94, -160], [128, -146], [94, -134]] : [[26, -160], [-8, -146], [26, -134]];
  stroke(ctx, P(bk.map(H)), { ...g, seed: seed + 21, w: g.w * 0.9 });
  stroke(ctx, P([bk[0], [lerp(bk[0][0], bk[1][0], 0.55), -147], bk[2]].map(H)), { ...g, seed: seed + 22, w: 1.2, alpha: g.alpha * 0.5 });
  // eye (blinks)
  const ex = look > 0 ? 76 : 44, eyeOpen = 1 - p.blink;
  if (eyeOpen > 0.15) { stroke(ctx, P(ellipsePts(ex, -156, 7, 7 * eyeOpen).map(H)), { ...g, seed: seed + 23, w: 2.2 }); if (!onion) tone(ctx, P(ellipsePts(ex + 1, -155, 5, 5 * eyeOpen).map(H)), { seed: seed + 24, gap: 2.2, alpha: 0.7 }); }
  else stroke(ctx, P([[ex - 8, -155], [ex, -152], [ex + 8, -155]].map(H)), { ...g, seed: seed + 23, w: 2.2 });
  if (!onion) {                                                                  // the cap: side-of-the-pencil tone
    tone(ctx, P(ellipsePts(hc[0] - 4 * look, hc[1] - 12, 34, 22, 0, Math.PI, TAU).map(H)), { seed: seed + 25, angle: -0.8, gap: 4.5, alpha: 0.28 });
    stroke(ctx, P([[hc[0] - 32 * look, -140], [hc[0] - 6 * look, -132], [hc[0] + 18 * look, -138]].map(H)), { ...g, seed: seed + 26, w: 1.5, alpha: g.alpha * 0.55 });
    for (let i = 0; i < 4; i++) stroke(ctx, P([[18 + i * 10, -70 + i * 4], [24 + i * 10, -62 + i * 4]]), { ...g, seed: seed + 30 + i, w: 1.3, alpha: g.alpha * 0.45, search: 0 });
  }
  // legs: standing → tucked
  const L = p.legs, ly = lerp(-40, 0, clamp(L)), lx = lerp(14, 0, clamp(L));
  [[2, 0], [20, 6]].forEach(([fx, o], i) => {
    const hip = [fx - 4, -34], knee = [fx + lx * 0.6 - 6, lerp(-26, -16, clamp(L))], foot = [fx - lx + (L > 1 ? -8 : 0), ly + (L > 1 ? 6 : 0)];
    stroke(ctx, P([hip, knee, foot]), { ...g, seed: seed + 40 + i, w: g.w * 0.75 });
    stroke(ctx, P([[foot[0] - 10, foot[1] + 1], [foot[0] + 16, foot[1] + 2]]), { ...g, seed: seed + 42 + i, w: g.w * 0.7 });
  });
}

export function render(ctx, W, H, t) {
  const tt = onTwos(t), d = drawingSeed(t), S = H / 1080;
  const r = mulberry(d * 31 + 5), jx = (r() - 0.5) * 1.2, jy = (r() - 0.5) * 1.2, rot = (r() - 0.5) * 0.001;
  ctx.save();
  ctx.translate(W / 2 + jx, H / 2 + jy); ctx.rotate(rot); ctx.translate(-W / 2, -H / 2);         // the sheet sits on the pegs
  ctx.drawImage(paper(W, H), 0, 0);
  ctx.scale(S, S);
  pegHoles(ctx, 960, 1040);
  // eraser smudge and a ghost of an erased line, anchored to the paper
  ctx.save(); ctx.filter = 'blur(14px)'; ctx.globalAlpha = 0.045; ctx.fillStyle = '#5a5248';
  ctx.beginPath(); ctx.ellipse(1420, 640, 90, 26, -0.35, 0, TAU); ctx.ellipse(1470, 610, 60, 20, -0.2, 0, TAU); ctx.fill(); ctx.restore();
  stroke(ctx, bezierPts([1360, 660], [1400, 600], [1450, 590], [1500, 615]), { seed: 3, alpha: 0.1, w: 2, passes: 1 });
  // slate and frame number
  ctx.fillStyle = 'rgba(44,42,40,.8)'; ctx.font = '22px "Courier Prime"'; ctx.fillText('SEQ 04 · SC 12 · "HOP"', 70, 70);
  ctx.font = '600 52px Caveat'; const fn = String(Math.floor(tt * 24) + 1);
  ctx.fillText(fn, 1790 - ctx.measureText(fn).width / 2, 98);
  stroke(ctx, ellipsePts(1790, 82, 46, 36, 0.1, -0.3, TAU - 0.1), { seed: d + 900, w: 2.2, passes: 1 });
  // ground: a quick line and a twig
  stroke(ctx, [[260, GROUND + 2], [800, GROUND + 4], [1300, GROUND], [1640, GROUND + 3]], { seed: 77, w: 2.2, passes: 1, wobble: 1.2 });
  stroke(ctx, bezierPts([1380, GROUND - 1], [1420, GROUND - 14], [1470, GROUND - 22], [1520, GROUND - 30]), { seed: 78, w: 2, passes: 1 });
  // path of action and the timing chart: written on the key drawing, in blue
  for (let i = 0; i <= 26; i++) { const u = i / 26, p = arc([X0, GROUND - 120], [X1, GROUND - 120], u, -0.42); blue(ctx, [[p[0] - 4, p[1]], [p[0] + 4, p[1] + 1]], 500 + i, { w: 2.4, alpha: 0.55, wobble: 0.6 }); }
  blue(ctx, [[1560, 210], [1560, 470]], 601, { w: 1.6 });
  const marks = [0, 0.08, 0.22, 0.42, 0.62, 0.8, 0.93, 1]; marks.forEach((u, i) => blue(ctx, [[1546 - (i % 7 === 0 ? 10 : 0), 210 + u * 260], [1574 + (i % 7 === 0 ? 10 : 0), 210 + u * 260]], 610 + i, { w: 1.5 }));
  ctx.font = '600 30px Caveat'; ctx.fillStyle = 'rgba(80,120,190,.75)'; ctx.fillText('13', 1590, 220); ctx.fillText('25', 1590, 482); ctx.fillText('ease in →', 1590, 380);
  // onion skin (the drawings before, through the paper), then the drawing
  [4, 2].forEach((k, i) => { const s = Math.max(0, tt - k / DRAW_FPS); sparrow(ctx, pose(s), drawingSeed(s), { onion: true, alpha: i ? 0.9 : 0.6 }); });
  const p = pose(tt);
  sparrow(ctx, p, d, { construct: true });
  // the note in the accent pencil, and the masking-tape subtitle
  ctx.save(); ctx.translate(820, 330); ctx.rotate(-0.05); ctx.fillStyle = 'rgba(200,70,50,.8)'; ctx.font = '600 40px Caveat'; ctx.fillText('hold the crouch!', 0, 0);
  stroke(ctx, bezierPts([150, 16], [170, 80], [140, 160], [60, 250]), { seed: 950, colour: 'c84632', alpha: 0.7, w: 2.2, passes: 1 }); ctx.restore();
  ctx.save(); ctx.translate(960, 960); ctx.rotate(-0.012);
  ctx.fillStyle = 'rgba(214,196,150,.85)'; ctx.beginPath(); ctx.moveTo(-430, -36); ctx.lineTo(432, -38); ctx.lineTo(424, -30); ctx.lineTo(436, -18); ctx.lineTo(428, 6); ctx.lineTo(438, 30); ctx.lineTo(-428, 34); ctx.lineTo(-436, 10); ctx.lineTo(-426, -12); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(40,36,32,.92)'; ctx.font = '600 46px Caveat'; ctx.textAlign = 'center'; ctx.fillText('Small birds don’t jump. They decide, then they go.', 0, 14); ctx.restore();
  ctx.restore();
  // exposure flicker and vignette (screen space, per drawing)
  ctx.fillStyle = `rgba(255,250,240,${0.02 + r() * 0.03})`; ctx.fillRect(0, 0, W, H);
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, W * 0.62); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(40,30,20,.22)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
}
