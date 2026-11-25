// core/anim.js — character-animation helpers for render(t) pages. Every function is pure: same t, same answer.
// The rules behind them are in ANIMATION.md (the principles of animation, written for code). Import with an absolute URL:
//   import { action, squash, follow, poses, blink, walk } from '/core/anim.js';
import { clamp, lerp, TAU } from './lib.js';

export const FPS = 24;

// ─── Timing ──────────────────────────────────────────────────────────────────────────────────────────
// Step a time to drawings: on ones (n=1), twos (n=2), threes… Sample a pose with stepped(t); move the camera with t.
export const onN = (t, n = 2, fps = FPS) => Math.floor(t * fps / n + 1e-6) * n / fps;
export const onTwos = (t, fps = FPS) => onN(t, 2, fps);
export const fr = (n, fps = FPS) => n / fps;                 // frames → seconds
// The picture reads late if its accent lands on the sound. Sample the animation `n` frames later than the clock, so a
// key authored at the cue time is seen n frames before it (2–3 for hits and takes, 3–4 for a body move that leads a word).
export const lead = (t, n = 3, fps = FPS) => t + n / fps;

// ─── Slow in / slow out ─────────────────────────────────────────────────────────────────────────────
// favour 0 = even spacing (mechanical), ~0.6 = drawings bunch near both extremes, 1 = strong. Asymmetric: favour the
// pose the audience must read (fa = start, fb = end). Too much on everything is mechanical too: vary it.
export function slow(u, fa = 0.6, fb = fa) {
  u = clamp(u);
  const pa = 1 + 2 * fa, pb = 1 + 2 * fb;
  const a = Math.pow(u, pa), b = Math.pow(1 - u, pb);
  return a / (a + b);
}
export const slowIn = (u, f = 0.7) => slow(u, 0, f);         // eases into the end pose
export const slowOut = (u, f = 0.7) => slow(u, f, 0);        // eases out of the start pose
// The spacing chart an animator writes on an extreme: n inbetweens between two keys, as positions 0..1.
export const chart = (n, fa = 0.6, fb = fa) => Array.from({ length: n + 2 }, (_, i) => slow(i / (n + 1), fa, fb));

// ─── Squash and stretch ─────────────────────────────────────────────────────────────────────────────
// Volume stays constant: stretch s along one axis, 1/s across it (a half-filled flour sack). s > 1 stretch, s < 1 squash.
export const squash = s => ({ sx: 1 / s, sy: s });
// Stretch along the direction of travel. Returns the angle and factor; apply with stretchCtx().
export function stretchAlong(vx, vy, k = 0.0009, max = 0.45) {
  const sp = Math.hypot(vx, vy);
  return { angle: Math.atan2(vy, vx), s: 1 + Math.min(max, sp * k) };
}
// ctx at the object's centre: stretch s along `angle` (canvas 2D), area kept.
export function stretchCtx(ctx, angle, s) { ctx.rotate(angle); ctx.scale(s, 1 / s); ctx.rotate(-angle); }

// The bouncing ball, the first exercise and a good recipe for any thrown or dropped object.
// h0 first drop height (px), each bounce keeps `keep` of its height, g in px/s², vx in px/s. Ground at y = 0, up is +.
// Returns {x, y, vy, n (bounce index), contact (0..1 squash amount near the ground), s (velocity stretch)}.
export function bounce(t, { h0 = 400, keep = 0.55, g = 4200, vx = 260, x0 = 0, squashFrames = 2, minH = 4 } = {}) {
  let h = h0, tt = t, n = 0;
  let T = Math.sqrt(2 * h / g);                            // first segment: a drop from rest, takes T to land
  if (tt < T) { const y = h - 0.5 * g * tt * tt; return out(y, -g * tt); }
  tt -= T;
  for (;;) {
    h *= keep; n++;
    if (h < minH) return { x: x0 + vx * (t - tt), y: 0, vy: 0, n, contact: 0, s: 1 };
    const up = Math.sqrt(2 * g * h), Tb = 2 * up / g;
    if (tt < Tb) return out(up * tt - 0.5 * g * tt * tt, up - g * tt);
    tt -= Tb;
  }
  function out(y, vy) {
    const c = clamp(1 - y / Math.max(1, Math.abs(vy) * squashFrames / FPS));   // inside the last frames above the floor
    const s = 1 + Math.min(0.4, Math.abs(vy) / g * 0.5);
    return { x: x0 + vx * t, y: Math.max(0, y), vy, n, contact: c * Math.min(1, Math.abs(vy) / 1200), s };
  }
}

// ─── Anticipation → action → follow-through ─────────────────────────────────────────────────────────
// One meaningful move, timed in seconds from t0. Returns progress: dips to −back (the wind-up), holds, snaps past 1 by
// `over`, settles to 1. Use it for any reach, jump, throw, take or turn: value = lerp(from, to, action(t, t0, …)).
export function action(t, t0, { antic = 0.25, hold = 0.06, move = 0.14, settle = 0.3, back = 0.18, over = 0.1 } = {}) {
  let u = t - t0;
  if (u <= 0) return 0;
  if (u < antic) return -back * slow(u / antic, 0.5, 0.8);
  u -= antic;
  if (u < hold) return -back;
  u -= hold;
  if (u < move) { const k = u / move; return lerp(-back, 1 + over, 1 - Math.pow(1 - k, 2.2)); }
  u -= move;
  if (u < settle) return lerp(1 + over, 1, slow(u / settle, 0.3, 0.8));
  return 1;
}
export const actionDur = o => { o = { antic: 0.25, hold: 0.06, move: 0.14, settle: 0.3, ...o }; return o.antic + o.hold + o.move + o.settle; };

// ─── Overlap, drag and follow-through ───────────────────────────────────────────────────────────────
// Parts don't stop together. Evaluate a part's curve a little later than the part that drives it.
export const lag = (fn, t, delay) => fn(t - delay);
// A damped spring chasing target(t): ears, tails, hair, a coat, a belly. Stateless: it re-runs a short window each call,
// so any frame renders alone. freq in Hz (lower = heavier, looser), damp 0..1 (lower = more wobble).
export function follow(target, t, { freq = 2.2, damp = 0.35, window = 1.6, dt = 1 / 240 } = {}) {
  const w = TAU * freq;
  let t0 = t - window, x = target(t0), v = 0;
  for (let s = t0; s < t; s += dt) {
    const a = w * w * (target(s) - x) - 2 * damp * w * v;
    v += a * dt; x += v * dt;
  }
  return x;
}
// A chain (tail, antenna, ribbon, a row of fingers): each joint follows the one before it, later and looser.
export function chain(target, t, n, { delay = 0.05, freq = 2.6, damp = 0.4, loosen = 0.85 } = {}) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(follow(s => target(s - i * delay), t, { freq: freq * Math.pow(loosen, i), damp }));
  return out;
}

// ─── Holds ──────────────────────────────────────────────────────────────────────────────────────────
// A pose held dead goes flat after about 1.5 s. A moving hold hits the pose, then drifts a little further in the same
// direction (cheeks up, hands higher, eyes wider). Returns 0 → drift across the hold; add it to the pose's values.
export const movingHold = (t, t0, t1, drift = 0.12) => t <= t0 ? 0 : drift * slowIn(clamp((t - t0) / Math.max(0.01, t1 - t0)), 0.8);
// Idle breath, never in phase across characters (pass a different seed).
export const breathe = (t, seed = 0, rate = 0.28, amt = 1) => amt * Math.sin(TAU * (t * rate + seed * 0.618));

// ─── Arcs ───────────────────────────────────────────────────────────────────────────────────────────
// Living things move on arcs. A straight inbetween between two keys kills the action: bend it.
// bend: sideways offset as a share of the distance (+ = left of a→b). Points are [x, y].
export function arc(a, b, u, bend = 0.25) {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1];
  const cx = mx - dy * bend, cy = my + dx * bend;
  const v = 1 - u;
  return [v * v * a[0] + 2 * v * u * cx + u * u * b[0], v * v * a[1] + 2 * v * u * cy + u * u * b[1]];
}
// A smooth path through key positions (Catmull-Rom), u 0..1 over the whole path.
export function through(pts, u) {
  const n = pts.length - 1; if (n < 1) return pts[0];
  const f = clamp(u) * n, i = Math.min(n - 1, Math.floor(f)), k = f - i;
  const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n, i + 2)];
  const c = (a, b, c2, d) => 0.5 * (2 * b + (-a + c2) * k + (2 * a - 5 * b + 4 * c2 - d) * k * k + (-a + 3 * b - 3 * c2 + d) * k * k * k);
  return [c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])];
}

// ─── Pose to pose ───────────────────────────────────────────────────────────────────────────────────
// keys: [{t, v: {name: number…}, ease?, fa?, fb?}], sorted by t. Between two keys the outgoing key's ease applies:
// 'slow' (default, fa/fb favour the extremes), 'in', 'out', 'lin', 'hold' (no inbetweens: a cut to the next pose), or a
// function u → u. Options: step (draw on ones/twos: 1, 2…), fps. Values missing from a key carry over from the last one.
// Overlap = the same keys sampled later for looser parts: poses(keys, t - 0.06) for the arms, t - 0.1 for the hat.
export function poses(keys, t, { step = 0, fps = FPS } = {}) {
  if (step) t = onN(t, step, fps);
  const acc = {}; let i = 0;
  for (; i < keys.length; i++) { if (keys[i].t > t) break; Object.assign(acc, keys[i].v); }
  if (i === 0) return { ...keys[0].v };
  if (i >= keys.length) return acc;
  const a = keys[i - 1], b = keys[i], u = (t - a.t) / Math.max(1e-6, b.t - a.t);
  const e = a.ease || 'slow';
  const k = typeof e === 'function' ? e(u) : e === 'hold' ? 0 : e === 'lin' ? u : e === 'in' ? slowIn(u, a.fb ?? 0.7)
    : e === 'out' ? slowOut(u, a.fa ?? 0.7) : slow(u, a.fa ?? 0.6, a.fb ?? 0.6);
  const res = { ...acc };
  for (const n in b.v) if (n in acc) res[n] = lerp(acc[n], b.v[n], k); else res[n] = b.v[n];
  return res;
}

// ─── Eyes ───────────────────────────────────────────────────────────────────────────────────────────
// A blink, frame by frame: shut fast, one frame closed, open slower, favouring the extremes (never a half-open eye held).
// Returns lid closure 0 (open) .. 1 (shut). times: blink start times (s). Blink on every change of eye direction and to
// keep a hold alive; a slow or squinting blink for disbelief; flutter = two quick blinks (pass both times).
const BLINK = [0, 0.55, 1, 1, 0.6, 0.25, 0.08, 0];
export function blink(t, times, { slowBy = 1, fps = FPS } = {}) {
  let c = 0;
  for (const b of times) {
    const f = Math.floor((t - b) * fps / slowBy + 1e-6);
    if (f >= 0 && f < BLINK.length) c = Math.max(c, BLINK[f]);
  }
  return c;
}
// Natural blink times for a shot, seeded so a character never blinks in step with another.
export function blinkTimes(dur, seed = 1, mean = 3.2) {
  let s = seed * 9301 + 49297, t = 0.4 + (seed % 7) * 0.17; const out = [];
  while (t < dur) { out.push(t); s = (s * 9301 + 49297) % 233280; t += mean * (0.5 + s / 233280); }
  return out;
}

// ─── Walks ──────────────────────────────────────────────────────────────────────────────────────────
// A biped walk in world units, feet locked to the ground (no sliding). period = seconds per step, stride = distance
// between footfalls, bob = body rise, lift = foot clearance, x0 = start. Returns body x and lift, both feet, arm swing
// (-1..1, opposite to the legs), and `contact` (0..1 around each footfall: hit the step sound there).
// The body is lowest just after a contact (the down) and highest after the passing position (the up).
export function walk(t, { period = 0.5, stride = 60, bob = 6, lift = 14, x0 = 0, lean = 0 } = {}) {
  const v = stride / period, bodyX = x0 + v * t, u = (t / period) % 1;
  const bodyLift = -bob * Math.cos(TAU * (u - 0.15));
  const foot = phase => {
    const T = 2 * period, p = ((t - phase) / T) % 1 + ((t - phase) < 0 ? 1 : 0), k = Math.floor((t - phase) / T);
    const plant = x0 + v * (k * T + phase) + stride * 0.5;
    if (p < 0.5) return { x: plant, y: 0, planted: true };
    const s = slow((p - 0.5) / 0.5, 0.4, 0.5);
    return { x: plant + 2 * stride * s, y: lift * Math.sin(Math.PI * s), planted: false };
  };
  const L = foot(0), R = foot(period);
  const contact = Math.max(0, 1 - Math.min(u, 1 - u) * period * FPS / 2);
  return { x: bodyX, lift: bodyLift, lean, footL: L, footR: R, armL: Math.sin(TAU * t / (2 * period)), armR: -Math.sin(TAU * t / (2 * period)), contact, step: Math.floor(t / period) };
}

// ─── Staging check ──────────────────────────────────────────────────────────────────────────────────
// Silhouette test: draw the character's shapes in one flat colour into an offscreen canvas and look at it. If the action
// doesn't read there, it won't read in the frame. Returns the canvas; draw(ctx) must draw the character only.
export function silhouette(w, h, draw, colour = '#000') {
  const c = new OffscreenCanvas(w, h), x = c.getContext('2d');
  draw(x); x.globalCompositeOperation = 'source-in'; x.fillStyle = colour; x.fillRect(0, 0, w, h);
  return c;
}
