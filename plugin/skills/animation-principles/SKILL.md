---
name: animation-principles
description: The principles of character animation (squash and stretch, anticipation, staging, overlap, arcs, timing, exaggeration, appeal), plus faces, lip sync, walks and acting, as rules for animation drawn in code. Use whenever a film or animation has a character, a mascot or an object that acts (a Lemo-Opuscar film, a canvas/WebGL/Remotion/SVG animation, an animated explainer or ad), when planning or reviewing its motion, or when the user asks why an animation feels stiff, floaty, robotic or lifeless. 动画原理、角色表演、口型、走路、时间节奏。
---

# The principles of animation, for code

Rules distilled from Frank Thomas and Ollie Johnston, *The Illusion of Life: Disney Animation* (1981), rewritten for animation drawn by code. They work with any style and any stack. Use them together with whatever skill is making the film: the style says how it looks, this says how it moves and acts.

**In the Lemo-Opuscar library** (`$LIB`, e.g. `~/lemo-opuscar`, or the clone you stand in): read `$LIB/ANIMATION.md` for the full guide, and import the helpers from `/core/anim.js` in pages (`action`, `poses`, `follow`, `chain`, `arc`, `through`, `squash`, `stretchAlong`, `bounce`, `blink`, `blinkTimes`, `walk`, `movingHold`, `onTwos`, `lead`, `slow`, `silhouette`). Render the reference sheet with `node core/render/still.mjs core/anim-sheet 0`. Outside the library, the rules below are enough; write small stateless helpers like those (each a pure function of `t`).

## When to apply it

1. **Before the model sheet**: write a short *character note* (§6) for every character or acting object.
2. **Before animating a key action**: plan it pose to pose with anticipation, action, follow-through (§2).
3. **Before delivery**: run the animation check (§8) alongside the film's own checks.

Don't let these rules override a style's motion quality: if the style says limited animation, held bodies or on threes, act inside that. The principles still decide *which* poses and *when*.

## 1. The aim

An audience believes a character when it sees it **think**: a change from one expression or attitude to another. Plan at least one visible change of mind per shot. Motion without intention is noise. Personality shows in how a character moves (tempo, weight, what leads) more than in its design. The character must believe its own situation: cut jokes that wink at the audience.

## 2. The twelve principles in code

1. **Squash and stretch, constant volume.** Stretch `s` on one axis, `1/s` on the other (a half-filled flour sack). Squash on impact about the contact point, stretch at the fastest frames along the velocity. Never hold a stretch long enough to be seen. Apply to points, not to the canvas transform, if line widths must stay constant.
2. **Anticipation.** A small opposite move before every important move (crouch before the jump, look before the reach). The reaching hand is in the clear. Bigger or heavier = longer wind-up. A surprise also needs an anticipation, of the thing that *doesn't* happen.
3. **Staging.** One idea at a time; everything else quiet. **Silhouette test**: fill the character with one flat colour. If the pose doesn't read, re-pose it. Camera distance fits the action: full figure for a kick, close for an expression.
4. **Pose to pose / straight ahead.** Acting is planned in key poses, timed, then inbetweened. Wild motion (fire, crowds, scrambles) can be procedural/simulated, seeded and deterministic. Combine them: key the path, let a loose layer run on top. **Pose test first**: render held keys only (4–24 frames each) against the voice and music, and judge the timing there.
5. **Follow-through and overlap.** Parts don't stop together. Appendages (ears, tail, hair, coat) keep going and settle (a damped spring chasing the body). Head, chest and shoulders land together so the pose reads; the rest settles a few frames later: sample the looser parts' curves 2–4 frames late. Flesh drags behind bone. The way an action ends is the character. **Moving hold**: after hitting a pose, drift into a slightly stronger version of it instead of freezing.
6. **Slow in / slow out.** Spend frames near the poses that must be read. Vary it: even spacing everywhere is mechanical, and so is heavy easing everywhere.
7. **Arcs.** Living things move on curves. **Linear interpolation between two poses is the classic way code kills an action.** Interpolate positions along a curve (a bent quadratic, or Catmull-Rom through keys). Check with a dot-path plot of the hand, nose and tail tip.
8. **Secondary action.** Supports, never competes. An expression change is invisible during a big move: change it before or after. Animate the main action first, then layer the secondary.
9. **Timing.** Frames between two poses are the meaning: 0–1 = a hit; 2–4 = a twitch or dodge; 5–8 = a crisp order; 9–12 = friendly; 13–16 = noticing something wonderful; 17–24 = searching; 25+ = weighing it up (24 fps). **Twos** (a new drawing every 2 frames) sparkle; **ones** for fast scrambles, sharp accents, payoffs, and **whenever the camera moves** (a character on twos over a panning background jitters and its feet slip). Heavy = slower to start, stop and recover (≈1.5× a light character). A dead hold goes flat after ~1.5 s: use a moving hold or a blink.
10. **Exaggeration.** Caricature of reality: sadder, brighter, more worried. Push the keys until they feel too much, then watch them move. Exaggerate the essence, not the details. Never break believability.
11. **Solid drawing.** Weight, depth, balance. **No twins**: never mirror paired limbs or run idle loops in phase. The stretched side of a bent form runs straight, the compressed side curves. Build every pose on one line of action. Deform shapes, don't just rotate rigid parts.
12. **Appeal.** Clear, simple, pleasing design and motion, villains included. Don't show angles the design can't do.

## 3. Faces

- Faces are soft **forms** that push each other (a smile lifts the cheek into the lower lid; a frown pushes the brow over the eye), not lines sliding.
- **One thought, one key expression**; change it only on a new thought. The speed of the change is the kind of thought: sudden realisation = fast; scheming or a growing smile = slow.
- The whole body carries the expression; if the body disagrees, the face loses.
- Eyes matter most and change shape. Round eyes with pupils give the most range.
- **Blink** (shut in ~2 frames, 1 closed, open in ~3–4): on every change of eye direction, and inside holds. Never in step with another character.
- Looking up from under the lids reads innocent; chin down and looking up under the brows reads determined or sinister.

## 4. Dialogue

- **Act the phrases, not the words**: one attitude and gesture per phrase, the body settling at the end of each phrase so the face can be read. Never accent every word (the pointing finger on every syllable).
- **Lead the sound**: body and head accents start 3–4 frames before the stressed syllable; mouth shapes sit on the sound; M/B/P closed for at least 2 frames. Impacts, landings and takes read in sync when their extreme is 2–3 frames *before* the sound: write that lead into your cue checks.
- Mouth shapes follow the voice's personality; favour one shape over straight halfway inbetweens; on a held word use a moving hold; at the end of a line keep the last word's shape, softened. Teeth never pure white.
- Alternatives when lip sync fights the design: head and body moves only, a rear or silhouette view, the speaker off screen, or the camera on the listener.
- Test: mute the dialogue. If the scene still plays, the acting is right.
- Voices: natural, spontaneous, with breaths and little sounds; a polished announcer read gives nothing to animate.

## 5. Acting and emotion

- Know what each character feels at every moment and why; the story earns the emotion.
- The strongest feelings often move least: hold strong attitudes nearly still, with small sags, slow blinks, and let music carry it.
- **Show less, imagine more**: the event heard but off screen; a shadow over the watcher; rim light on black; a slow push on still eyes; weather (snow, rain, falling leaves) carrying the mood.
- **Touch** between characters is powerful because it's rare: stage it clearly and slowly.
- Lead the audience through contrasting feelings, giving each enough time and no more.

## 6. Characters, objects, walks

- **Design follows the business**: decide what the character must do and feel, then design an *animatable* shape (pear or bean body, features close enough to push each other). Every detail costs on every frame; keep details that act (a hat that tips with the mood).
- **Character note** (write before drawing): who they are in one line, how they stand, what leads their walk, their tempo, one signature mannerism, what they do when pleased, crossed and scared, their weight.
- **Objects that act**: find the face in the object's own design first; its job suggests its personality; some are better faceless, pure pantomime.
- **Walks**: contact → down (lowest, just after contact) → passing → up (highest). Planted feet never slide. Happy = quicker, bouncier; sad = slow, little lift, hanging head; proud = chest leads; sneaking = high knees, long toe holds; heavy = deep down, slow recovery. Check a cycle over 8+ steps: repetition magnifies flaws.
- **Landings**: front feet then back, sag past rest, slow rebound; ears and jowls lag and sweep.

## 7. Layout, colour, effects, process

- One idea per frame at a glance, like a poster. Keep screen direction consistent; establish geography once in a wide shot.
- Sad or quiet = longer shots, slower moves; excited = shorter shots, quicker cuts.
- Keep the area behind the action quiet; richness goes to the edges. Close-ups get simpler backgrounds. **Contact shadows** anchor every standing figure (transparent, 30–70 %).
- Black is a hole on screen: no large pure black on characters; lighter backgrounds behind dark characters. Soft characters get lines in a darker shade of their own fill, not black.
- Effects (water, smoke, dust, sparkles) are designed in the film's style and stay subordinate to the character; never move a mass of things by the same amount at the same speed.
- The grid first: tempo in frames per beat, action laid on it, but put some accents off the beat. Process per shot: thumbnails → pose test → breakdowns and arcs → overlap → secondary action and polish (moving holds, blinks) → review (contact sheet, 0.2 s strips enlarged, dot paths, silhouette test, full speed with sound).

## 8. The animation check

- [ ] Each character visibly thinks at least once per shot.
- [ ] Every important move has an anticipation; every stop has follow-through.
- [ ] Key paths are arcs; no linear inbetweens on living things.
- [ ] Squash and stretch keep volume; no stretched pose is held.
- [ ] One idea at a time; key poses pass the silhouette test.
- [ ] No twins; idle loops offset.
- [ ] Expression changes happen outside big moves; the body agrees with the face.
- [ ] Dialogue phrased; body leads by 3–4 frames, hits by 2–3; closed consonants hold 2 frames.
- [ ] No dead hold past ~1.5 s.
- [ ] Characters on ones (or held) whenever the camera moves; planted feet don't slide.
- [ ] Contact shadows on every standing figure.
- [ ] Effects never steal the shot.

Report which checks failed and what you changed, in the user's language.
