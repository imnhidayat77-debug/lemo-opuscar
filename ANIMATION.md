# Animating characters: the principles, for code

How to make anything in a film look alive: a person, an animal, a teacup, a logo. Pair it with [`DIRECTOR.md`](DIRECTOR.md) §9 *Performance* (what a performance must do) and [`TECHNIQUE.md`](TECHNIQUE.md) §10 *Characters drawn in code* (rigs). Every style's `STYLE.md` sets the look and the motion quality (on ones or twos, how much boils). This guide is how the moves are *acted* inside those limits. The helpers in [`core/anim.js`](core/anim.js) do the arithmetic; [`core/anim-sheet/`](core/anim-sheet/) renders a reference sheet of them.

Distilled from Frank Thomas and Ollie Johnston, *The Illusion of Life: Disney Animation* (1981), the record of how a studio of hand animators learned to make drawings seem to think. Everything here is paraphrased and rewritten as rules for pages that draw `render(t)`. No text or drawings from the book are reproduced, and no character, design or film from it is to be copied (DIRECTOR.md §12).

**When to read it**: before the model sheet (DIRECTOR.md §5) of any film with a character, and again before you animate a key action. Styles without characters still use §2–§5 for anything that moves: a product turning, a map pin landing, a line of type bouncing in.

---

## 1. The aim: show the character thinking

An audience believes a character when it sees the character **decide**. One expression held is a picture. A change from one expression to another is a thought. The change is what tells them something happened inside.

- **Every shot with a character needs at least one visible change of mind**: a frown that eases, a glance away and back, a pause before reaching. Plan it in the treatment's shot list.
- **Motion without thought is noise.** Movement that doesn't come from an intention (head bobbing on every word, arms waving to "keep it alive") hides the expression it should show.
- **Personality is how they move, more than how they look.** Two characters with the same design are told apart by tempo, weight and what they do with their hands. Write that down before drawing (§9).
- **Sincerity.** The character must believe its own situation, however broad the gag. A joke that winks at the audience breaks the film's trust. Cut it even if it's funny.

## 2. The twelve principles, as rules for code

Each principle: what it is, how to build it, and how it fails.

### 2.1 Squash and stretch

Living matter changes shape as it moves; only rigid things (a chair, a pan) don't. The **volume stays the same**: think of a half-filled flour sack. Dropped, it spreads; lifted by the corners, it hangs long; it never gains or loses flour.

- Build: `squash(s)` gives `sx = 1/s, sy = s`; `stretchAlong(vx, vy)` stretches along the direction of travel. Apply about the contact point for a landing (feet stay on the floor), about the centre in the air.
- Strong squash on impact, stretch at the fastest frames, round in between. A stretched pose is a passing drawing: **never hold it long enough to be seen**.
- Squash and stretch the parts too: cheeks swell when the mouth closes in a smile and pull long when it opens; an arm's flesh bunches on the bent side.
- Fails as: a shape that scales up and down (volume changes: it looks inflated); rubbery wobble on something meant to be solid; a stretch that is visible as a held frame.

### 2.2 Anticipation

Before every important move, a smaller move the opposite way tells the audience what's coming: crouch before the jump, draw back before the throw, look at the thing before reaching for it. Then they watch *how* it's done instead of wondering *what* happened.

- Build: `action(t, t0, {antic, hold, move, settle, back, over})`: wind-up, a short hold, a fast move, overshoot, settle. Bigger or heavier = longer wind-up.
- **Aim**: before reaching, the eyes and head go to the target first, and the reaching hand is out in the clear where it can be seen, not in front of the body.
- Size scales with the action: a blink can anticipate a small look; a whole-body crouch anticipates a leap.
- **A surprise needs an anticipation too**: the audience must be led to expect one thing before the other one can surprise them.
- Fails as: a move that starts from dead stillness at full speed (missed, or reads as a glitch); an anticipation so long the moment dies.

### 2.3 Staging

Present one idea at a time, so it can't be misread: an action so it's understood, a personality so it's recognised, an expression so it's seen, a mood so it's felt.

- **One thing at a time.** While the important action happens, everything else is quiet. Then the next thing.
- **Silhouette test**: fill the character with one flat colour (`silhouette()` in `anim.js`). If the pose still reads (the reach, the shrug, the slump), it's staged. Hands off the face, arms away from the body, profile or three-quarter for gestures.
- **The camera's distance fits the action**: a kick needs the full figure, an expression needs a close shot. Never play a face in a long shot or a kick in a waist shot.
- **The setting says the mood** before anyone moves (bare branches and a wind for unease, warm light for safety). A prop that argues with the mood goes.
- Fails as: two actions at once; a gesture crossing the face; the subject lost in a busy background.

### 2.4 Straight ahead and pose to pose

Two ways to animate:

- **Pose to pose**: decide the key poses, time them, then fill in. Clear and controllable; most acting is built this way. In code: `poses(keys, t)` with eased keys and holds.
- **Straight ahead**: one frame after another from the start, finding it as you go. Fresh and wild, good for scrambles, fire, water, crowds, debris. In code: a simulation or a procedure stepped through time (deterministically: seeded, no state carried between frames).
- **Combine them**: plan the path and the key positions, then let a procedural layer (follow-through, noise, a sim) run loose inside that plan.
- **Texture**: a scene where every move has the same speed and size has no punch. Mix smooth flowing moves with short sharp ones and the odd unexpected timing. Pose to pose is how you plan that variety.
- **Pose test first.** Render only the key poses, held 4 to 24 frames each (`ease: 'hold'`), cut to the voice or music. If the scene doesn't play in poses it won't play in full animation (§10).

### 2.5 Follow through and overlapping action

Things don't stop all at once. Parts arrive at different times:

1. **Appendages keep moving** after the body stops: ears, tail, hair, a coat, a scarf, a ribbon. Each at the speed its weight allows. `follow(target, t, {freq, damp})` and `chain()`.
2. **The body doesn't move as one block.** It stretches, catches up, twists. The parts that carry the attitude (head, chest, shoulders) arrive together so the pose reads; the rest settles a few frames later, not all on the same frame. Sample each looser part later: `poses(keys, t - 0.06)` for the arms, `t - 0.1` for the hat.
3. **Drag**: loose flesh (cheeks, a belly, jowls) trails the bones and catches up. Done well, nobody notices it; they just feel weight.
4. **How the action ends tells you who they are.** The swing takes a few frames; what happens after it (graceful recovery or a knot) is the joke and the character. Plan the ending before you animate the action.
5. **The moving hold**: a pose held dead goes flat. Hit the pose, then drift into a slightly stronger version of it (cheeks higher, eyes wider, hands up a little) while the loose parts settle. `movingHold(t, t0, t1, drift)`.

Fails as: every part landing on the same frame (a puppet); a tail that moves like a stiff stick; follow-through so big it upstages the face.

### 2.6 Slow in and slow out

Spend the frames near the poses the audience must read, and pass quickly between them. `slow(u, fa, fb)` favours the start (`fa`) and the end (`fb`); `chart(n)` shows where n inbetweens fall.

- Favour the pose that matters. A move *out* of a hold can start fast; a move *into* the important pose slows in.
- **Too much of it everywhere is mechanical.** Vary it: some moves even, some snapped, some with a long ease into the hold.

### 2.7 Arcs

Almost nothing alive moves in a straight line. A head turning dips or lifts as it goes; a pointing hand sweeps along a curve; a walk arcs over the top of each step and under the bottom.

- Build: `arc(a, b, u, bend)` between two keys; `through(points, u)` for a path through several. Animate positions along the curve, not x and y on separate eases.
- **Linear interpolation between two poses is the most common way to kill an action in code.** Check: plot the path of the hand, the nose and the tip of the tail over the shot (a dot per frame). Straight lines and sharp corners are wrong unless the action is a mechanical one (a punch can be straight; its wind-up and follow-through curve).

### 2.8 Secondary action

Small actions that support the main one: the sad character wipes a tear as he turns away; the flustered one straightens her glasses as she recovers.

- It is **always subordinate**. If it competes with the main action, or is more interesting, it's the wrong choice.
- **An expression change is not visible during a big move.** Change it before the move or after it, while the body is slow.
- Build in layers: animate the main action first and make it work, then add the secondary action, then adjust both until they read as one.

### 2.9 Timing

How many frames a move takes is what it means. The same two poses (head tilted right, then left with the chin up) say completely different things at different speeds:

| Frames between the poses | Reads as |
|---|---|
| 0–1 (a cut or one inbetween) | hit by something: a blow, a slap |
| 2–4 | a twitch or nervous tic; a dodge |
| 5–8 | a crisp order: "go!", "now!" |
| 9–12 | a friendly "over here" |
| 13–16 | noticing something wonderful |
| 17–20 | straining to see it better |
| 21–24 | searching for something |
| 25 and more | weighing it up; a slow stretch of a sore neck |

(Numbers at 24 fps; on twos each inbetween is two frames.)

- **Ones or twos.** Twos (a new drawing every 2 frames) has more sparkle and is the default for most cartoon motion; ones is smoother and slower-feeling. Use ones for fast scrambles, sharp accents, the payoff after a big anticipation and any delicate change. `onN(t, 2)`.
- **When the camera moves, the moving character goes on ones.** A character stepped on twos over a background panning on ones jitters against it, and planted feet slip. Either animate the character on ones during camera moves, or keep the camera still while it acts. At minimum, compute the character's world position every frame and keep planted feet locked to the background.
- **Weight is timing.** Heavy things take longer to start, longer to stop, longer to recover: a heavy dog takes about half as long again as a light one for the same run, needs a bigger anticipation and sags further on landing.
- **Hold for understanding, not the clock.** Give gags and failures time to be read (DIRECTOR.md §7). A dead hold goes flat after about 1.5–1.7 s; past that, use a moving hold or a blink.

### 2.10 Exaggeration

Caricature of reality, not distortion for its own sake. If it's sad, make it sadder; bright, brighter; worried, more worried. The aim is something more convincing than real, not something stranger.

- Push the key poses until you're sure they're too much, then look at them moving. They usually aren't.
- Exaggerate the essence (the slump of disappointment), not the details (a wilder mouth shape).
- Never at the cost of believability: a gag that breaks the character's reality is cut (§1, *Sincerity*).

### 2.11 Solid drawing

Even a flat style needs forms with **weight, depth and balance**.

- **No twins**: arms or legs doing exactly the same thing in parallel, or a face mirrored perfectly. Offset the timing (`lag`), the angle and the pose of paired parts; vary the seed of idle loops (`breathe(t, seed)`).
- **Straight against curve**: in a bent limb or torso, the stretched (bony) side runs straight and the compressed (fleshy) side curves. That contrast gives a drawn form tension and direction.
- **Line of action**: one clear curve runs through the whole pose. Build poses on it.
- Forms are **plastic**: soft, round and ready to move, never stiff cut-outs. In a code rig, avoid hard part seams (TECHNIQUE.md §10) and let shapes deform, not just rotate.

### 2.12 Appeal

Something the audience likes looking at: clear design, simple shapes, pleasing proportions, readable motion. Villains need it as much as heroes; repulsive gets a look but not attention.

- Simple beats intricate: a drawing that is hard to read has no appeal.
- **Don't show the angle the design can't do.** If a view makes the character look wrong (top of the head, dead side-on for a front-designed face), stage around it.
- Varied shapes and proportions (big against small, straight against curve) beat even, symmetrical ones.

## 3. Faces and expressions

- **The face is made of forms, not lines.** Cheeks, lids, brows and mouth are soft masses that push on each other: a broad smile lifts the cheeks into the lower lid and squeezes the eye; raised brows bunch the forehead; a frown pushes the brow down over the eye. Animate those pushes.
- **One thought, one key expression.** It can grow or soften, but it doesn't change feeling until the character has a new thought. Then it changes to the next key expression.
- **The speed of the change is the kind of thought**: a sudden realisation changes fast; a scheme, a growing smile or slow puzzlement moves gradually across the face and stays.
- **The whole body has the expression.** Defiance in the face with relaxed shoulders reads as nothing. If the body disagrees, the face loses.
- **Eyes matter most.** They change shape, not only where they look; spend your care there. A round eye with a pupil gives the widest range; tiny or decorative eyes need other strengths (body, head angle) to make up for it.
- **Blinks** (`blink(t, times)`): fast shut, a frame closed, slower open. Put one on every change of eye direction (it marks the change and lets you swing the eyes further) and inside any hold to keep it alive. Puzzlement and disbelief get a slow, slightly squinting blink; a stunned look gets a flutter. Never blink in step with another character (`blinkTimes(dur, seed)`).
- **Looking up out of the tops of the eyes** reads as innocent, hopeful, vulnerable; chin down and looking from under the brows reads as determined or sinister. Avoid looking up while frowning unless the character is meant to look sinister.
- Check every expression at final size; eyebrow direction is the most common error (DIRECTOR.md §9).

## 4. Dialogue

- **Act the phrases, not the words.** Give each phrase of a line one body attitude and gesture. At the end of the phrase the body comes to rest so the expression can be read. The next phrase brings a new attitude. Don't accent every word (the pointing finger on every syllable is the classic failure).
- **Lead the sound.** The head, body or gesture starts **3–4 frames before** the strong syllable it accents; the **mouth shape is on the sound**. A closed-mouth consonant (M, B, P) stays shut at least 2 frames so it's seen. In this library, sample the body's curve with `lead(t, 3)` and keep the mouth on the voice's word timings.
- **Impacts and big accents read late if they land on the beat.** Put the extreme drawing of a hit, land or take **2–3 frames ahead of the sound**. There's no fixed rule: shift and look until it feels in sync. Expect that lead in your cue check (TECHNIQUE.md §3).
- **Mouth shapes have the voice's personality**: a grinning character's closed mouth is wide, a sulking one's is pushed out. Vowels open, F/V tuck the lower lip, E sounds show teeth. Draw a small set per character from the actual recording.
- **Favour one shape.** Few mouth inbetweens are straight halfway drawings; hold one shape a little, then move quickly to the next.
- **On a held word**, treat it as a moving hold: a shape, then a slightly stronger one to slow into (weaker if the voice is fading). At the end of a line, keep the shape of the last word, softened; don't snap to neutral.
- **Teeth are never pure white** (they flash).
- **Other ways to carry a line** when the design or staging fights lip sync: head and body moves alone; a rear or silhouette view; the speaker off screen while the camera is on something meaningful; the camera on the listener (often the best choice: we see two feelings at once).
- **The test**: play the sequence with the dialogue muted. If it still plays, the acting is right. If a line needs no physical expression at all, rewrite it or cut it.
- **Voices**: a natural, spontaneous read gives the animation life; a polished "announcer" read gives nothing to animate. Little sounds (a breath, a grunt, a sigh) are worth more than extra words (TECHNIQUE.md §4).

## 5. Acting and emotion

- **Know what the character feels at every moment, and why.** The audience feels it only if the story has built it. Most emotional scenes work because of what came before them.
- **The strongest emotion often moves least.** For grief, hold strong body attitudes almost still, with tiny sags, slow blinks and moist eyes, and let the music carry it. Don't break the spell with "keeping it alive" motion.
- **Show less, imagine more.** The event off screen, heard but not seen; a shadow passing over the watcher's face; a fight drawn only in rim light against black; a character half hidden by branches; the camera slowly pushing in on still eyes instead of a moving face; the place they long for, seen from where they are; weather and nature (falling snow, rain, leaves) carrying the feeling. Each saves animation and often plays stronger.
- **Touch** between characters is powerful because it's rare: a hand on a shoulder, two heads leaning together. Stage it clearly and slowly.
- **Warmth can't be written on a shot list.** It comes from the specific care in how a small action is done. Give the key moment of warmth the most careful timing in the film.
- **Lead the audience through contrasting feelings**, giving each one enough time and no more: fear, then the release of a laugh.
- **Time to savour**: don't take a moment away just as they start to enjoy it, and don't drag it.

## 6. Characters and objects

- **Design follows the business.** First decide what the character must do and feel in the film, then design the shape that can do it. An *animatable* shape has volume and flexibility: a pear or bean body squashes and stretches; a rigid circle only slides.
- **Features close together** react to each other (mouth pushes cheek, cheek pushes eye); features spread far apart can't make one expression.
- **Every detail costs** every frame it's on: buttons, stripes, extra colours, patterns. Keep the details that do acting (a hat that tips with the mood, ears that show the feeling) and drop the rest.
- **Write a character note**, like a studio's model-sheet analysis: who they are in one line; how they stand; what leads their walk (chest, nose, belly, knees); their tempo; one signature mannerism; what they do when pleased, crossed, scared; their weight. Every animator of the film reads it.
- **Objects as characters**: find the face in the object's own design (headlights, a keyhole, a lid, a spout) before adding one on. Its job suggests its personality (a whistle is loud and bossy, a rocking chair is a gossip). Some objects are better with no face at all: pure pantomime of the whole shape.
- **Real humans are the hardest to animate.** Give a person as much caricature as the role allows; keep the sincere, realistic treatment for the character whose feelings carry the film.

## 7. Walks, runs and weight

- **A walk is a personality.** Many actors find a character by finding the walk. Decide what leads: a proud chest, a sneaking nose, a tired head.
- **The positions**: contact (heel strikes), down (lowest, weight lands), passing (one leg passes the other), up (highest, pushing off). `walk(t, {period, stride, bob, lift})` keeps planted feet locked and gives the body's rise and fall; hit the step sound on `contact`.
- **Directions, not numbers**: happy = shorter period, more bob, springy up; sad = longer period, little lift, head and arms hanging, feet dragging; proud = chest leads, long stride, small bob; sneaking = high knees, long holds on the toes, big arcs; heavy = long period, deep down, slow recovery, feet plopped flat.
- **Weight shows on landings**: front feet first, then back; the body sags past the rest pose and comes back up slowly with a slight rebound. Ears and jowls lag on the way up and sweep down after the body lands.
- **A repeated cycle magnifies every flaw.** A tiny limp or a foot lifting too high becomes obvious after five steps. Check a cycle over at least eight steps before using it.

## 8. Layout, backgrounds and effects

- **The frame sells one idea at a glance**, like a poster. Fancy rendering later can't save a weak layout.
- **Keep screen direction consistent**: who is left and who is right, which way the journey goes. Establish the place once in a wide master shot, then keep every closer shot true to it.
- **Mood through timing**: sad or quiet = longer shots and slow camera and character moves; happy or excited = shorter shots, quicker cuts, quicker moves.
- **The background stages the actor.** Keep the area behind the action quiet (close values, little detail, no strong shapes); put the richness at the edges and the top. A pool of light is the safe choice. The ground under the feet must be solid and readable, but not busy.
- **A close-up gets a simpler background** than the wide shot it cuts from: a plain toned card, or the barest hint of what was there.
- **Contact shadows anchor figures to the ground.** Without one, a character floats however much weight its motion has. Use a transparent shadow (multiply at 30–70 % density) so the ground shows through, and give a group one consistent shadow density.
- **Scale**: from time to time show a "pictorial" shot that reminds the audience how big the characters are in their world.
- **Effects** (water, smoke, fire, dust, rain, leaves) are designed in the style of the film, observed from nature, and **subordinate to the character**: an effect that steals the scene is wrong however beautiful. In a large mass (a sea, a crowd of leaves) never move everything by the same amount at the same speed. Speed is shown with a few drawn blur shapes or lines, never a trail of copies of the limb. Each kind of rain or snow carries its own mood (drizzle, steady downpour, driving storm).

## 9. Colour

- **Colour carries feeling** from scene to scene as the music does; plan a colour key per sequence.
- **Black is a hole on screen.** Large pure black areas on a character suck the life out of it and vanish against dark backgrounds. Use a deep coloured dark; keep the background lighter behind a dark character.
- **Few colours per character**, related to every other character they appear with. Moderate, muted characters give the backgrounds room for mood; one loud flat colour limits every setting it enters.
- **Soft characters don't need black outlines.** A line drawn in a slightly darker version of the fill it borders (a *self-coloured line*) makes a face gentle; keep black or dark lines for hard, comic or mechanical things. Where a mechanical object comes to life, the line can soften with it.
- **Turning edges**: a soft rubbed shade along a form's edge rounds a flat fill. Use it sparingly and keep it in the same place on every frame, or it crawls.

## 10. Music, timing and the process

- **The grid first.** Write the beat in frames (a tempo where one beat is 8, 10, 12, 16 or 20 frames at 24 fps) and lay the action on it before animating (TECHNIQUE.md §3). Working to a fixed beat forces the essence of each action, nothing extra.
- **Not everything hits the beat.** Locking every move to the downbeat is mechanical; put some accents on the off-beat or mid-bar where they're least expected. Acting scenes often want free tempo under them; save strict beat-locking for dance, routines and comic business.
- **Songs and themes must move the story**, never stop it for a performance.
- **The process for each shot**, in this library's terms:
  1. **Thumbnails**: small pose ideas, several stagings, before any code.
  2. **Pose test**: the key poses only, held (`ease: 'hold'`), cut into the timeline with the voice and music. Judge the timing here; it's cheap to change.
  3. **Breakdowns**: eases and arcs between the keys (`poses`, `arc`, `through`).
  4. **Overlap**: looser parts sampled later, follow-through on appendages (`lag`, `follow`, `chain`).
  5. **Secondary action and polish**: expressions timed outside the big moves, moving holds, blinks.
  6. **Review**: a contact sheet, 0.2 s strips of key actions enlarged (DIRECTOR.md §9), the dot path of key points (arcs), the silhouette test, and a full-speed viewing with sound.
- **Story reel before animation**: the key drawings held at their real timings against the voice and temp music, run at full speed. Things that seemed funny on the board turn out too long or too fast; fix it here.
- **Build on what works.** When the reel shows that a minor character or a quiet moment is landing, give it more; cut what isn't landing, even if you loved it.

## 11. Before you deliver: the animation check

Add these to DIRECTOR.md §11 for any film with characters or acting objects:

- [ ] Each character visibly thinks at least once per shot (a change of expression or attitude).
- [ ] Every important move has an anticipation; every stop has follow-through; nothing stops on one frame unless it's meant to be a hit.
- [ ] Key paths are arcs (dot-path check); no linear inbetweens on living things.
- [ ] Volume is kept in squash and stretch; no stretched pose is held.
- [ ] One idea at a time; key poses pass the silhouette test.
- [ ] No twins: paired limbs and idle loops are offset.
- [ ] Expression changes happen outside big moves; the body agrees with the face.
- [ ] Dialogue is phrased; body leads the accent by 3–4 frames; hits lead the sound by 2–3 frames; closed consonants hold 2 frames.
- [ ] No dead hold longer than about 1.5 s; holds are moving holds or have a blink.
- [ ] Characters on ones (or held) whenever the camera moves; planted feet don't slide.
- [ ] Contact shadows anchor every standing figure.
- [ ] Effects support the character and never steal the shot.

---

Tools: [`core/anim.js`](core/anim.js) (every helper named above) · [`core/anim-sheet/`](core/anim-sheet/) (a rendered reference: `node core/render/still.mjs core/anim-sheet 0 --out <dir>`).
