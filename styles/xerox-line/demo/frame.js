// Style frame for Xerox Line '60s: a long-eared hound tugs its owner down a morning street. The background is one
// drawing (rough line over offset flat colour); the characters are painted inside their lines and boil on twos.
import { mulberry, lerp, clamp, TAU } from '/core/lib.js';
import { onTwos, walk, follow, blink, breathe } from '/core/anim.js';
import { xline, fillClean, patch, hatch, paper } from './xline.js';

export const DUR = 4;
const DW = 1920, DH = 1080, GROUND = 830;
const ell = (cx, cy, rx, ry, rot = 0, a0 = 0, a1 = TAU, n = 36) => Array.from({ length: n + 1 }, (_, i) => { const a = lerp(a0, a1, i / n), x = Math.cos(a) * rx, y = Math.sin(a) * ry; return [cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]; });
const bez = (p0, p1, p2, p3, n = 18) => Array.from({ length: n + 1 }, (_, i) => { const u = i / n, v = 1 - u; return [0, 1].map(k => v * v * v * p0[k] + 3 * v * v * u * p1[k] + 3 * v * u * u * p2[k] + u * u * u * p3[k]); });
const C = { mustard: '#d4a43a', teal: '#3d7f7a', brick: '#b4553b', olive: '#8c8a4b', slate: '#5d6a78', pale: '#f6d98a', pave: '#cfc6b0', road: '#9a9a8c' };

// ── background: drawn once ──────────────────────────────────────────────────────────────────────────
let BG = null;
function background(W, H) {
  const c = new OffscreenCanvas(W, H), x = c.getContext('2d'), S = W / DW; x.scale(S, S); paper(x, DW, DH);
  const L = (pts, o = {}) => xline(x, pts, { w: 2, passes: 2, search: 0.25, ...o });
  const bld = [ // x0, x1, top-left y, top-right y (a 60s cheat: roofs tilt), colour
    [60, 470, 210, 170, C.mustard], [470, 860, 300, 260, C.brick], [860, 1250, 120, 150, C.teal], [1250, 1600, 320, 290, C.olive], [1600, 1940, 200, 240, C.slate]];
  // colour first, offset from the line it belongs to
  patch(x, [[0, GROUND], [DW, GROUND], [DW, 905], [0, 905]], C.pave, { dx: 0, dy: -8, seed: 2, texture: 'crayon' });
  patch(x, [[0, 905], [DW, 905], [DW, DH], [0, DH]], C.road, { dx: 0, dy: 10, seed: 3, texture: 'dry', alpha: 0.75 });
  patch(x, ell(1700, 130, 90, 90), C.pale, { dx: -26, dy: 18, seed: 4, texture: 'crayon' });
  bld.forEach(([a, b, ya, yb, col], i) => patch(x, [[a + 18, ya + 30], [b - 10, yb + 24], [b - 30, GROUND - 30], [a + 8, GROUND - 60]], col, { dx: i % 2 ? 16 : -14, dy: -12, seed: 10 + i, wobble: 5 }));
  patch(x, [[500, 600], [830, 600], [850, 668], [480, 668]], C.pale, { dx: 18, dy: 10, seed: 20 });     // shop awning
  patch(x, ell(1430, 470, 130, 120), C.olive, { dx: 26, dy: -20, seed: 21, texture: 'crayon' });         // tree crown
  // then the line drawing
  bld.forEach(([a, b, ya, yb], i) => {
    L([[a, GROUND], [a, ya], [b, yb], [b, GROUND]], { seed: 100 + i });
    const side = [[a, ya], [a + 26, ya + 14], [a + 26, GROUND], [a, GROUND]]; L(side.slice(0, 3), { seed: 120 + i, w: 1.5 }); hatch(x, side, { seed: 140 + i * 30, gap: 9 });
    const cols = Math.max(2, Math.floor((b - a) / 110)), rows = Math.floor((GROUND - 160 - Math.max(ya, yb)) / 120);
    for (let cI = 0; cI < cols; cI++) for (let rI = 0; rI < rows; rI++) {
      const wx = lerp(a + 50, b - 50, cols > 1 ? cI / (cols - 1) : 0.5) - 28, wy = lerp(ya, yb, (cI + 0.5) / cols) + 60 + rI * 120;
      if (i === 1 && wy > 520) continue;
      if ((cI + rI + i) % 3 === 0) patch(x, [[wx, wy], [wx + 56, wy], [wx + 56, wy + 74], [wx, wy + 74]], C.pale, { dx: 8, dy: 6, seed: 300 + i * 40 + cI * 7 + rI, texture: 'none' });
      L([[wx, wy], [wx + 56, wy + 2], [wx + 55, wy + 76], [wx - 1, wy + 74]], { seed: 400 + i * 40 + cI * 7 + rI, closed: true, w: 1.6 });
      L([[wx + 28, wy + 2], [wx + 28, wy + 74]], { seed: 500 + i * 40 + cI * 7 + rI, w: 1.1, passes: 1 });
    }
  });
  // shop: awning stripes, door, sign
  L([[500, 600], [830, 600], [850, 668], [480, 668]], { seed: 600, closed: true });
  for (let k = 0; k < 8; k++) L([[520 + k * 42, 602], [508 + k * 46, 666]], { seed: 610 + k, w: 1.4, passes: 1 });
  L([[560, GROUND], [560, 700], [640, 700], [640, GROUND]], { seed: 620 }); L([[690, 700], [820, 700], [820, 790], [690, 790]], { seed: 621, closed: true });
  x.font = '34px "Love Ya Like A Sister"'; x.fillStyle = '#151312'; x.fillText('BAKERY', 572, 585);
  // lamp post, tree, sun, kerb, a bench
  L([[930, GROUND], [934, 420]], { seed: 700, w: 3 }); L(ell(934, 404, 22, 16), { seed: 701 }); L([[912, 420], [956, 420]], { seed: 702 });
  L([[1420, GROUND], [1426, 560], [1440, 520]], { seed: 710, w: 2.6 }); L([[1432, GROUND], [1438, 560]], { seed: 711, w: 1.6 });
  const r = mulberry(9); const crown = []; for (let k = 0; k < 260; k++) { const a = k * 0.16, rr = 95 + Math.sin(k * 0.21) * 28; crown.push([1410 + Math.cos(a) * rr * (0.6 + 0.4 * r()), 470 + Math.sin(a) * rr * 0.9 * (0.6 + 0.4 * r())]); }
  L(crown, { seed: 712, w: 1.5, passes: 1, gaps: 0.03 });
  L(ell(1726, 112, 90, 90), { seed: 720, w: 1.8 });
  L([[0, GROUND], [DW, GROUND - 4]], { seed: 730, w: 2.6 }); L([[0, 905], [DW, 900]], { seed: 731, w: 3 });
  for (let k = 0; k < 260; k++) { const px = r() * DW, py = GROUND + 6 + r() * 92; x.fillStyle = 'rgba(21,19,18,.55)'; x.fillRect(px, py, 2.2, 2); }
  L([[1660, GROUND - 70], [1840, GROUND - 74]], { seed: 740 }); L([[1670, GROUND - 70], [1662, GROUND]], { seed: 741 }); L([[1830, GROUND - 74], [1836, GROUND]], { seed: 742 }); L([[1660, GROUND - 100], [1846, GROUND - 106]], { seed: 743 });
  return c;
}

// ── characters: fill inside the line, line over the fill, reseeded per drawing ─────────────────────
function shape(ctx, pts, fill, seed, o = {}) { if (fill) fillClean(ctx, pts, fill); xline(ctx, pts, { seed, closed: true, w: 3.4, ...o }); }
function hound(ctx, t, ox, d) {
  const g = walk(t, { period: 0.34, stride: 34, bob: 4, lift: 10, x0: 0 }), bx = ox + g.x, by = GROUND - 8 - g.lift;
  const earLag = follow(s => walk(s, { period: 0.34, stride: 34, bob: 4 }).lift, t, { freq: 2.4, damp: 0.25 }) - g.lift;
  const tail = follow(s => Math.sin(s * 9) * 0.3, t, { freq: 3, damp: 0.3 });
  const T = ([lx, ly]) => [bx + lx, by + ly], P = a => a.map(T), s = d * 13;
  // legs: hind pair and front pair from the walk feet (short, sturdy), far legs darker
  const leg = (hx, foot, far, k) => shape(ctx, P([[hx - 14, -70], [hx + 14, -70], [foot.x - g.x + hx + 16 - 17, -foot.y + 2], [foot.x - g.x + hx - 20 - 17, -foot.y + 2]]), far ? '#a8703d' : '#c98a4b', s + k, { w: 3 });
  leg(-90, g.footR, 1, 1); leg(80, g.footL, 1, 2);
  shape(ctx, P(ell(-10, -100, 150, 52, 0.02)), '#c98a4b', s + 3);                                         // long body
  shape(ctx, P(bez([-120, -140], [-60, -168], [40, -166], [90, -138]).concat(bez([90, -138], [40, -120], [-60, -118], [-120, -120]))), '#6b4a35', s + 4, { w: 2.6 }); // saddle
  shape(ctx, P(bez([110, -86], [140, -60], [150, -40], [120, -54]).concat([[96, -70]])), '#f4ecdc', s + 5, { w: 2.6 });  // chest
  leg(-60, g.footL, 0, 6); leg(110, g.footR, 0, 7);
  shape(ctx, P([[-150, -118], [-190 + tail * 30, -190], [-176 + tail * 30, -196], [-140, -130]]), '#c98a4b', s + 8, { w: 2.8 });   // tail up
  // head low and forward, nose to the ground (sniffing), ears dragging
  shape(ctx, P(bez([118, -130], [170, -150], [214, -110], [236, -80]).concat(bez([236, -80], [222, -62], [180, -70], [130, -86]))), '#c98a4b', s + 9);
  shape(ctx, P(bez([196, -96], [226, -96], [250, -82], [252, -70]).concat(bez([252, -70], [236, -58], [210, -62], [196, -72]))), '#f4ecdc', s + 10, { w: 2.8 });
  shape(ctx, P(ell(252, -72, 9, 7)), '#2a2220', s + 11, { w: 2.4 });
  const ed = clamp(earLag * 2.2, -14, 14);
  shape(ctx, P(bez([150, -132], [126, -100], [122, -60 + ed], [146, -30 + ed]).concat(bez([146, -30 + ed], [166, -40 + ed], [178, -90], [170, -128]))), '#6b4a35', s + 12, { w: 2.8 });
  const eo = 1 - blink(t, [1.1, 3.0]);
  if (eo > 0.4) { ctx.fillStyle = '#151312'; ctx.beginPath(); ctx.arc(...T([196, -116]), 4.5, 0, TAU); ctx.fill(); }
  xline(ctx, P([[184, -124], [200, -128], [210, -122]]), { seed: s + 13, w: 2.2 });                       // a heavy, droopy lid
  shape(ctx, P(ell(120, -118, 16, 12)), '#b4553b', s + 14, { w: 2.4 });                                   // collar tag (red)
  return T([120, -118]);
}
function owner(ctx, t, ox, d, hand) {
  const lean = -0.2 + breathe(t, 2, 0.9, 0.015), bx = ox, by = GROUND - 4, s = d * 17 + 500;
  const R = ([lx, ly]) => [bx + lx * Math.cos(lean) - ly * Math.sin(lean), by + lx * Math.sin(lean) + ly * Math.cos(lean)], P = a => a.map(R);
  shape(ctx, P([[-38, -260], [-16, -260], [-60, -10], [-96, -2]]), '#4c5560', s + 1, { w: 3 });            // back leg (braced)
  shape(ctx, P([[-6, -260], [18, -260], [66, -14], [36, -8]]), '#5d6a78', s + 2, { w: 3 });                // front leg digging in
  shape(ctx, P([[-104, 0], [-56, -8], [-50, 6], [-106, 10]]), '#2e2a2a', s + 3, { w: 2.6 }); shape(ctx, P([[32, -10], [82, -16], [86, 0], [30, 4]]), '#2e2a2a', s + 4, { w: 2.6 });
  shape(ctx, P(bez([-50, -470], [-74, -380], [-70, -300], [-60, -230]).concat([[30, -236]]).concat(bez([30, -236], [34, -320], [30, -400], [14, -472]))), '#b4553b', s + 5);   // coat
  xline(ctx, P([[-14, -460], [-10, -250]]), { seed: s + 6, w: 2 }); [-420, -370, -320].forEach((y, i) => { ctx.fillStyle = '#151312'; ctx.beginPath(); ctx.arc(...R([-4, y]), 3.4, 0, TAU); ctx.fill(); });
  shape(ctx, P([[-44, -476], [10, -478], [14, -456], [-48, -452]]), '#d4a43a', s + 7, { w: 2.4 });          // scarf
  shape(ctx, P(ell(-14, -520, 34, 42, 0.1)), '#e9b99b', s + 8);                                              // head
  shape(ctx, P([[18, -526], [38, -512], [16, -504]]), '#e9b99b', s + 9, { w: 2.4 });                          // a long nose
  shape(ctx, P([[-58, -548], [32, -550], [30, -540], [-60, -538]]), '#3a3d45', s + 10, { w: 2.4 });          // hat brim
  shape(ctx, P([[-40, -548], [-36, -590], [18, -592], [16, -550]]), '#3a3d45', s + 11, { w: 2.6 });          // crown
  xline(ctx, P([[4, -530], [10, -527]]), { seed: s + 12, w: 3, search: 0 }); xline(ctx, P([[0, -496], [14, -500]]), { seed: s + 13, w: 2.2, search: 0 }); // eye, worried mouth
  xline(ctx, P([[-6, -542], [12, -548]]), { seed: s + 14, w: 2.2 });                                         // brow up: alarmed
  const sh = R([14, -440]), dir = [hand[0] - sh[0], hand[1] - sh[1]], dl = Math.hypot(...dir);
  hand = [sh[0] + dir[0] / dl * 190, sh[1] + dir[1] / dl * 190];                // the arm is pulled straight toward the dog
  shape(ctx, [[sh[0] - 12, sh[1] - 10], [sh[0] + 10, sh[1] + 8], [hand[0] + 6, hand[1] + 10], [hand[0] - 6, hand[1] - 10]], '#b4553b', s + 15, { w: 3 }); // arm pulled straight
  shape(ctx, ell(hand[0], hand[1], 14, 11), '#e9b99b', s + 16, { w: 2.6 });
  return hand;
}

export function render(ctx, W, H, t) {
  if (!BG || BG.width !== W) BG = background(W, H);
  ctx.drawImage(BG, 0, 0);
  const tt = onTwos(t), d = Math.floor(t * 12 + 1e-6), S = W / DW;
  ctx.save(); ctx.scale(S, S);
  // contact shadows: flat, transparent, no blur
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(80,70,90,.4)';
  ctx.beginPath(); ctx.ellipse(1000 + walk(tt, { period: 0.34, stride: 34 }).x, GROUND + 2, 190, 12, 0, 0, TAU); ctx.ellipse(400, GROUND + 2, 110, 12, 0, 0, TAU); ctx.fill(); ctx.restore();
  const collar = hound(ctx, tt, 1000, d);
  const hand = owner(ctx, tt, 400, d, collar);
  // the leash: taut, a little sag
  xline(ctx, [hand, [lerp(hand[0], collar[0], 0.5), lerp(hand[1], collar[1], 0.5) + 6], collar], { seed: d * 5 + 900, w: 2.4, passes: 1 });
  // subtitle on a loose paper patch
  ctx.font = '44px "Patrick Hand"'; const line = 'Every morning, Rufus decides where they are going.', tw = ctx.measureText(line).width;
  patch(ctx, [[960 - tw / 2 - 30, 952], [960 + tw / 2 + 30, 952], [960 + tw / 2 + 30, 1018], [960 - tw / 2 - 30, 1018]], '#f2ead8', { dx: 10, dy: 6, seed: 33, texture: 'none' });
  ctx.fillStyle = '#151312'; ctx.textAlign = 'center'; ctx.fillText(line, 960, 1000);
  ctx.restore();
}
