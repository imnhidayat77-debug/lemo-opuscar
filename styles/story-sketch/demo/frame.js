// Style frame for Story-Sketch Board: a lighthouse keeper's storm night told in a row of pinned charcoal sketches.
// The camera reads the board; the fourth sketch comes alive in held poses (a pose test on the board).
import { mulberry, lerp, clamp, TAU } from '/core/lib.js';
import { slow } from '/core/anim.js';
import { charcoal, chalk, smudge, pastel, board, pinned, sheet } from './board.js';

export const DUR = 5;
const SW = 640, SH = 480;
const ell = (cx, cy, rx, ry, a0 = 0, a1 = TAU, n = 30) => Array.from({ length: n + 1 }, (_, i) => { const a = lerp(a0, a1, i / n); return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });
const YEL = 'f2c55c', BLU = '7f97b8', RED = 'c25a3e', PEACH = 'eab48f';

// ── the sketches (each drawn once, except the living one) ───────────────────────────────────────────
function lighthouse(x) {
  smudge(x, [[0, 0], [SW, 0], [SW, 260], [0, 300]], { alpha: 0.5, blur: 10, seed: 1 });
  pastel(x, [[352, 118], [640, 30], [640, 150]], YEL, { alpha: 0.65, seed: 2 });                       // the beam
  smudge(x, [[0, 330], [SW, 300], [SW, 480], [0, 480]], { alpha: 0.35, blur: 8, seed: 3 });
  charcoal(x, [[280, 480], [300, 360], [380, 320], [520, 330], [640, 300]], { seed: 4, w: 6 });          // the cliff
  smudge(x, [[300, 480], [310, 370], [380, 330], [640, 320], [640, 480]], { alpha: 0.7, blur: 4, seed: 5 });
  charcoal(x, [[322, 330], [334, 140], [376, 140], [390, 330]], { seed: 6, w: 4 });                     // the tower
  charcoal(x, [[326, 140], [384, 140], [380, 104], [330, 104], [326, 140]], { seed: 7, w: 3.5 }); charcoal(x, [[330, 104], [355, 82], [380, 104]], { seed: 8, w: 3.5 });
  pastel(x, ell(355, 122, 18, 12), YEL, { seed: 9 });
  chalk(x, [[372, 150], [384, 320]], { seed: 10, w: 5 }); for (let i = 0; i < 6; i++) chalk(x, [[40 + i * 40, 380 + i * 12], [90 + i * 40, 372 + i * 12]], { seed: 11 + i, w: 3 });
}
function stairs(x) {
  smudge(x, [[0, 0], [SW, 0], [SW, SH], [0, SH]], { alpha: 0.4, blur: 14, seed: 20 });
  for (let i = 0; i < 9; i++) { const y = 470 - i * 52, xs = 120 + Math.sin(i * 0.8) * 160; charcoal(x, [[xs, y], [xs + 220, y - 26]], { seed: 21 + i, w: 3.5 }); }
  charcoal(x, [[110, 480], [140, 0]], { seed: 31, w: 5 }); charcoal(x, [[540, 480], [520, 0]], { seed: 32, w: 5 });
  // Tam climbing: a strong diagonal silhouette, lantern held out
  const fig = [[300, 380], [286, 300], [300, 230], [330, 206], [360, 214], [372, 250], [366, 300], [392, 360], [360, 372], [340, 320], [330, 380]];
  smudge(x, fig, { alpha: 0.85, blur: 2, seed: 33 });
  charcoal(x, ell(334, 192, 24, 26), { seed: 34, w: 4 }); smudge(x, ell(334, 192, 22, 24), { alpha: 0.6, blur: 2, seed: 35 });
  charcoal(x, [[310, 172], [356, 170], [362, 160], [314, 158], [310, 172]], { seed: 36, w: 3.5 });       // cap
  chalk(x, [[340, 202], [350, 222], [338, 236]], { seed: 37, w: 6 });                                    // beard
  charcoal(x, [[360, 250], [420, 236], [440, 246]], { seed: 38, w: 4 });
  pastel(x, ell(446, 262, 30, 30), YEL, { seed: 39, alpha: 0.75 }); charcoal(x, [[436, 248], [456, 248], [458, 278], [434, 278], [436, 248]], { seed: 40, w: 3 });
}
function storm(x) {
  pastel(x, [[0, 0], [SW, 0], [SW, 220], [0, 250]], BLU, { alpha: 0.5, seed: 50 });
  smudge(x, [[0, 0], [SW, 0], [SW, 120], [0, 150]], { alpha: 0.5, blur: 12, seed: 51 });
  for (let i = 0; i < 18; i++) charcoal(x, [[i * 38, 0], [i * 38 - 50, 120]], { seed: 70 + i, w: 0.8, alpha: 0.35 });
  // the breaker: a wall of water rising left to right and curling over the boat
  const crest = [[0, 430], [120, 380], [250, 290], [360, 190], [450, 120], [540, 104], [600, 140], [612, 196], [588, 236], [548, 238], [530, 210], [550, 186]];
  smudge(x, [[0, 480], ...crest.slice(0, 8), [600, 300], [640, 420], [640, 480]], { alpha: 0.62, blur: 5, seed: 53 });
  smudge(x, [[548, 238], [588, 236], [600, 300], [560, 290]], { hex: 'e8e4da', alpha: 0.25, blur: 8, seed: 55 });   // the hollow, misted
  charcoal(x, crest, { seed: 52, w: 6 });
  chalk(x, crest.slice(3, 10), { seed: 64, w: 6 });
  for (let i = 0; i < 12; i++) { const p = crest[3 + (i % 7)]; chalk(x, [[p[0] - 10 + i * 3, p[1] - 6 - i % 3 * 6], [p[0] + 8 + i * 3, p[1] - 14 - i % 3 * 6]], { seed: 80 + i, w: 2.5 }); }
  for (let i = 0; i < 5; i++) charcoal(x, [[120 + i * 70, 470 - i * 30], [200 + i * 70, 400 - i * 40]], { seed: 90 + i, w: 2, alpha: 0.5 });
  // the boat under the curl, and the lighthouse far left on its rock
  charcoal(x, [[470, 330], [560, 326], [548, 350], [482, 352], [470, 330]], { seed: 65, w: 3 }); charcoal(x, [[514, 328], [516, 258]], { seed: 66, w: 2.5 });
  pastel(x, [[517, 262], [556, 320], [517, 320]], RED, { seed: 67 });
  charcoal(x, [[20, 300], [30, 190], [62, 190], [72, 300]], { seed: 68, w: 3 }); smudge(x, [[0, 300], [100, 296], [120, 340], [0, 350]], { alpha: 0.8, blur: 2, seed: 69 });
  pastel(x, ell(46, 180, 12, 9), YEL, { seed: 71 }); pastel(x, [[58, 176], [250, 120], [250, 200]], YEL, { seed: 72, alpha: 0.45 });
}
function windowSwing(x, pose) {      // the living sketch: three held poses, each redrawn with fresh strokes
  const s = 100 + pose * 37, ang = [-0.5, 0.15, 0.7][pose];
  smudge(x, [[0, 0], [SW, 0], [SW, SH], [0, SH]], { alpha: 0.3, blur: 14, seed: s });
  charcoal(x, [[60, 40], [600, 40], [600, 450], [60, 450], [60, 40]], { seed: s + 1, w: 6 }); charcoal(x, [[330, 40], [330, 450]], { seed: s + 2, w: 5 }); charcoal(x, [[60, 245], [600, 245]], { seed: s + 3, w: 5 });
  for (let i = 0; i < 14; i++) charcoal(x, [[80 + i * 38, 60], [60 + i * 38, 200]], { seed: s + 4 + i, w: 1.2, alpha: 0.35 });
  // Tam in profile, arm up, swinging the lamp
  smudge(x, [[150, 480], [170, 330], [230, 300], [290, 320], [300, 480]], { alpha: 0.8, blur: 2, seed: s + 20 });
  charcoal(x, ell(236, 262, 42, 46), { seed: s + 21, w: 4.5 }); smudge(x, ell(230, 262, 38, 42, Math.PI * 0.5, Math.PI * 1.5), { alpha: 0.5, blur: 3, seed: s + 22 });
  chalk(x, [[262, 280], [272, 312], [250, 330], [230, 318]], { seed: s + 23, w: 9 });                     // beard
  charcoal(x, [[270, 250], [282, 254]], { seed: s + 24, w: 4 }); charcoal(x, [[262, 238], [284, 232]], { seed: s + 25, w: 3.5 });  // eye, brow
  charcoal(x, [[192, 226], [276, 220], [282, 208], [198, 206], [192, 226]], { seed: s + 26, w: 4 });
  const sh = [280, 340], el = [sh[0] + Math.cos(-1.1 + ang * 0.4) * 90, sh[1] + Math.sin(-1.1 + ang * 0.4) * 90], hd = [el[0] + Math.cos(-1.4 + ang) * 80, el[1] + Math.sin(-1.4 + ang) * 80];
  charcoal(x, [sh, el, hd], { seed: s + 27, w: 9 });
  const lp = [hd[0] + Math.sin(ang * 1.4) * 40, hd[1] + 50];
  pastel(x, ell(lp[0], lp[1], 70, 60), YEL, { seed: s + 28, alpha: 0.55 }); pastel(x, ell(lp[0], lp[1], 26, 30), YEL, { seed: s + 29, alpha: 0.9 });
  charcoal(x, [hd, [lp[0], lp[1] - 24]], { seed: s + 30, w: 2.5 }); charcoal(x, [[lp[0] - 16, lp[1] - 22], [lp[0] + 16, lp[1] - 22], [lp[0] + 18, lp[1] + 22], [lp[0] - 18, lp[1] + 22], [lp[0] - 16, lp[1] - 22]], { seed: s + 31, w: 3 });
  charcoal(x, [[lp[0] - 70, lp[1] - 40], [lp[0] - 90, lp[1] - 60]], { seed: s + 32, w: 2, alpha: 0.6 }); charcoal(x, [[lp[0] + 66, lp[1] - 40], [lp[0] + 88, lp[1] - 62]], { seed: s + 33, w: 2, alpha: 0.6 }); // swing marks
}
function boatAway(x) {
  pastel(x, [[0, 0], [SW, 0], [SW, 220], [0, 240]], BLU, { alpha: 0.35, seed: 200 });
  charcoal(x, [[0, 260], [SW, 250]], { seed: 201, w: 3 }); charcoal(x, [[300, 250], [400, 250], [390, 272], [312, 272], [300, 250]], { seed: 202, w: 3 }); pastel(x, [[352, 178], [400, 240], [352, 240]], RED, { seed: 203 });
}
function dawn(x) {
  pastel(x, [[0, 0], [SW, 0], [SW, 240], [0, 240]], PEACH, { alpha: 0.6, seed: 210 });
  charcoal(x, [[200, 400], [210, 260], [330, 250], [340, 400]], { seed: 211, w: 4 }); smudge(x, ell(270, 230, 40, 36), { alpha: 0.6, seed: 212 });
}

// ── layout on the board (board units), sheets cached ────────────────────────────────────────────────
const TONES = { grey: '#a9a49b', night: '#8a93a3', buff: '#c4b393' };
const ROW1 = [[300, 330, lighthouse, 'grey', -0.018, 'Night falls. The lamp is lit.'], [740, 322, stairs, 'night', 0.012, 'Old Tam climbs: 112 steps.'],
  [1180, 334, storm, 'night', -0.008, 'A boat, too close to the rocks!'], [1620, 326, null, 'night', 0.016, 'He swings the lamp by hand.']];
const ROW2 = [[520, 905, boatAway, 'grey', 0.01], [960, 912, dawn, 'buff', -0.014], [1400, 900, null, 'grey', 0.006]];
let BOARD = null, SHEETS = null; const LIVE = [];
function build() {
  BOARD = board(2400, 1400);
  SHEETS = [...ROW1, ...ROW2].map(([, , fn, tone], i) => { if (!fn) return null; const c = sheet(SW, SH, TONES[tone], i + 3); fn(c.getContext('2d')); return c; });
  for (let p = 0; p < 3; p++) { const c = sheet(SW, SH, TONES.night, 9); windowSwing(c.getContext('2d'), p); LIVE.push(c); }
}
export function render(ctx, W, H, t) {
  if (!BOARD) build();
  const S = W / 1920, u = slow(clamp(t / DUR), 0.6), zoom = lerp(1.42, 1.52, u), camX = lerp(900, 980, u), camY = 420;
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(zoom * S, zoom * S); ctx.translate(-camX, -camY);
  ctx.drawImage(BOARD, -240, -160);
  // index card for the row
  ctx.save(); ctx.translate(140, 95); ctx.rotate(-0.03); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(4, 6, 300, 70); ctx.fillStyle = '#f3eee2'; ctx.fillRect(0, 0, 300, 70);
  ctx.strokeStyle = 'rgba(200,80,70,.5)'; ctx.beginPath(); ctx.moveTo(0, 22); ctx.lineTo(300, 22); ctx.stroke();
  ctx.fillStyle = '#2a2622'; ctx.font = '26px "Courier Prime"'; ctx.fillText('SEQ. 3 · THE STORM', 18, 54); ctx.restore();
  // sheets with a little parallax against the board
  const pose = Math.min(2, Math.floor(clamp((t - 1.0) / 0.5) * 3));          // the living sketch: three held poses
  [...ROW1, ...ROW2].forEach(([bx, by, fn, , rot, cap], i) => {
    const img = i === 3 ? LIVE[pose] : SHEETS[i]; if (!img) return;
    pinned(ctx, img, bx + (bx - camX) * 0.015, by, 400, 300, rot, { seed: i, pinHue: ['#c8402e', '#e0b23a', '#3d6fb0'][i % 3] });
    if (cap) {
      ctx.save(); ctx.translate(bx, by + 190); ctx.rotate(rot * 0.6); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(-176, -22, 360, 50);
      ctx.fillStyle = '#efe9dc'; ctx.fillRect(-180, -26, 360, 50); ctx.fillStyle = '#2b2724'; ctx.font = '27px Kalam'; ctx.textAlign = 'center'; ctx.fillText(cap, 0, 8); ctx.restore();
    }
  });
  ctx.restore();
  // top light falloff on the whole wall
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(255,236,200,.10)'); g.addColorStop(0.55, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(20,12,6,.38)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const v = ctx.createRadialGradient(W / 2, H * 0.45, H * 0.4, W / 2, H * 0.45, W * 0.68); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(20,12,6,.35)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  // the pitcher's line on a typed slip
  const line = '"...and there she is, way too close to the rocks!"';
  ctx.save(); ctx.font = `${40 * S}px "Courier Prime"`; const tw = ctx.measureText(line).width;
  ctx.translate(W / 2, H - 78 * S); ctx.rotate(-0.006); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-tw / 2 - 26 * S + 5, -40 * S + 7, tw + 52 * S, 64 * S);
  ctx.fillStyle = '#f4efe3'; ctx.fillRect(-tw / 2 - 26 * S, -40 * S, tw + 52 * S, 64 * S); ctx.fillStyle = '#1f1c19'; ctx.textAlign = 'center'; ctx.fillText(line, 0, 4 * S); ctx.restore();
}
