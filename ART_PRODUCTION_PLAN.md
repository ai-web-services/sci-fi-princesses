# ═══════════════════════════════════════════════════════════════
# ART PRODUCTION PLAN — execution plan for ART_VISION.md v3.0
# ═══════════════════════════════════════════════════════════════

**Status:** Working plan, rewritten 2026-07-09 (third revision). Standing decisions:
1. VISION v3.0 style ("Reference-Anchored Chibi"); the Craftpix swordsman pack is
   **reference only** — style ground truth for side-by-side acceptance, never a source
   of shipped pixels.
2. Sprites are **PNG spritesheet assets** (`public/assets/sprites/`), not text grids.
3. **Zero art budget, no human artists, forever.** Nothing in this pipeline may cost
   money: no asset purchases, no AI subscriptions, no commissions.

---

## Strategy decision: procedural sprite-rig generator is the PRIMARY route

Two candidate routes were evaluated against "free forever + no artists":

- **AI image generation** fails as a primary route at zero cost: free/local models
  (Stable Diffusion + pixel-art LoRAs) cannot reliably hold a character consistent
  across 30+ frames × 4 directions at 64px, and the tools that can (PixelLab etc.)
  are paid. AI is retained only as an optional *secondary* route for single images
  (portraits, concept exploration) where consistency across frames doesn't apply —
  and only via free/local tooling (Route F below).
- **Procedural generation** (Route P) — a code-based character generator that
  composes parametric body parts over a skeleton and poses them from shared animation
  tables — is deterministic, gives 4-direction and frame-to-frame consistency *by
  construction*, makes every new character inherit every animation for free, and
  costs nothing. This is NOT hand-typed pixel grids: no human ever places individual
  pixels; parts are drawn by parameterized code and all frames are computed.

**Route P builds the game's sprites. Route F is garnish.**

---

## Route P — The procedural sprite-rig generator (`tools/spritegen/`)

An offline Node project (never shipped to the browser) that renders finished PNG
sheets into `public/assets/sprites/`. Five layers, bottom to top:

### P1. Drawing kernel
Tiny pixel-canvas library: set/fill/line/ellipse/arc/polygon on an RGBA buffer,
palette-indexed (draw with ramp *names*, resolve hexes from `art/palette.js` at
render). Includes the two automatic style passes that implement VISION §1:
- **Auto-shade:** light from upper-left — for each material region, pixels near
  lower/right boundaries step down the ramp (shade), a 1px upper-left rim steps up
  (highlight). Parameterized per part (round parts get curved shade boundaries).
- **Auto-selout:** after compositing, every exterior edge pixel is replaced with the
  darkest ramp step of *its own* material. This mechanically guarantees the single
  most important style rule (no uniform outline) on every frame ever generated.

### P2. Part library
Parametric part functions, each returning a small pixel buffer + anchor points:
- `head(species, size)` — face shape per species (human oval, Felidae wedge, Anura
  dome, Drakonid heavy jaw, Construct geometry), with eye placement per VISION §1
  (lash row / white / 2px iris) as a parameterized sub-function.
- `hairOrCrest(template, params)` — the identity mass: template shapes (sweep, spikes,
  twin-tail, mane, dome-crest…) with volume/length/asymmetry parameters. Ears, horns,
  antennae are parts in the same slot family.
- `torso(costume, params)`, `limb(kind, length)`, `weapon(kind)`, `accessory(kind)`.
- Parts declare their material ramps, so shading/selout/palette-swaps are automatic.

### P3. Skeleton + directions
A character is a JSON **descriptor**: species, part choices + params, ramp bindings.
The skeleton defines anchor sockets (head, shoulders, hips, grip, tail-root…) with
per-direction (front/back/side-L/side-R) socket positions and part z-order. Side
views are authored socket layouts, not mirrors — weapons stay in the correct hand
(VISION §1). Direction consistency is therefore structural, not hoped-for.

**Direction readability requirement (added 2026-07-09):** each direction row must
look like the character is actually facing that way — a shared drawing path with
x-offset tweaks is not sufficient. Per direction, part functions must change what is
*drawn*, not just where: **front** = full face (both eyes, bangs); **back** = no face
at all, hair/back-of-costume detail dominates (hair fall, jacket back seam/belt);
**side** = true profile — one eye at the profile edge, visible nose/brow step in the
head outline, torso narrowed with one arm mostly occluding the body, near leg in
front of far leg, hair mass swept behind the face. Review test: crop any single
frame with the row label hidden — the facing must be identifiable instantly. This is
checked in the ×6 review strip for every action before a rig ships.

### P4. Animation tables (written ONCE, shared by every character)
Each action (idle 4–6f, walk 6f, run 8f, attack 6–8f, cast 6f, hurt 3–4f, KO 6f,
victory 6f, interact 2f — VISION §3.3) is a keyframe table: per-frame socket offsets,
part rotations/swaps (e.g. leg part `stride_fwd` vs `stride_back`), squash/stretch
pixels, and secondary-motion rules (hair/tail lag 1 frame behind torso, ±1px bob).
Attack tables include the smear frames — weapon part swapped for the element-tinted
`smear_arc` crescent. New characters get the entire animation set for zero marginal
work; character-specific tables (Pip's hover set, victory flourishes) override per
descriptor.

### P5. Renderer + packer
For each descriptor × action × direction × frame: pose parts on skeleton → composite
in z-order → auto-shade → quantize to declared ramps → auto-selout → anchor into
64×64 cell (feet 4px above bottom) → pack 8-col × 4-row sheets → write PNG +
`manifest.json` entry. Also emits ×6 review strips and the side-by-side
reference-compare image for §12.C/F.

### Why this scales
- 5 heroes × 3 stages = 15 descriptors, not 15 art projects. Stages are descriptor
  deltas (costume/palette/part swaps).
- The 6 NPC archetypes × region palettes × species = descriptor combinatorics; the
  whole world population falls out of the same part library.
- Quality lives in ~30 part functions + ~10 animation tables — small, reviewable,
  iteratively improvable code. Improving `hair()` once upgrades every character
  retroactively. The review loop (me, at ×6, against the Craftpix reference) iterates
  on part functions instead of on individual images.
- Enemies: same kernel/renderer with their own part families (VISION §4 tiers);
  bosses are bespoke descriptor + custom parts, animated engine-side via sub-part
  motion as already specced.

## Engine wiring (how rigs reach the game — implemented 2026-07-09)

Rigs flow into the game through three pieces, and adding a future rig requires ZERO
engine changes — regenerate, and the manifest drives everything:

1. **Manifest-driven loading (BootScene):** `preload()` loads
   `assets/sprites/manifest.json`, then queues every sheet the manifest lists onto the
   in-flight loader (`queueRigSheets`). No hardcoded sheet paths.
2. **Rig registry (`public/src/engine/rigs.js`):** after load, `registerRigs()`
   creates one Phaser animation per asset × action × direction
   (`rig_<id>_<action>_<row>`, frame range = directionRow × 8 columns, fps from the
   manifest; idle/walk/run loop, others play once). An id counts as rigged when it
   has at least idle + walk. Game directions map down/up/left/right →
   front/back/side-left/side-right; no flipX (sides are authored).
3. **`ActorSprite` (art/actors.js) prefers rigs:** if `hasRig(id)`, it becomes an
   animated Phaser sprite (origin y = 60/64 so feet sit on the same ground point as
   legacy art) and face()/update() switch animations; otherwise it falls back to the
   legacy baked-grid texture unchanged. MapScene needed no changes — player and every
   NPC construct ActorSprite, so each character upgrades automatically the moment its
   sheets + manifest entry exist.

Rollout order per rig: generate sheets → manifest entry appears → engine picks it up.
Legacy grid art for a character is deleted only when its rig covers ALL uses
(exploration + battle + gallery); until then both coexist and the rig wins wherever
it applies. Battle (CombatScene ×2 rendering, VISION §3.4) is wired the same way once
rigs gain battle actions (attack/cast/hurt/KO/victory).

## Route F — Free/local AI (secondary; single images only)

Use only where frame-consistency doesn't matter, and only at zero cost (local
Stable Diffusion + pixel-art LoRA via ComfyUI if a capable GPU is available;
otherwise skip — no paid fallback):
- **Portraits (80×96):** generate at ~640×768, downscale 8:1 nearest, quantize to
  ramps, hand-off to conform/validate like any asset.
- **Concept exploration** for part-function design (hair shapes, costume ideas).
- **Never for animation frames.**

If used, every generation records this prompt block in the manifest so results are
reproducible:

```
SUBJECT: <character id> — <species, silhouette keys from VISION §3.2/§3.5>
IMAGE: <portrait expression | concept>, facing <dir/angle>
STYLE: SNES-era pixel art portrait, soft hue-shifted ramps, dark same-hue edge
       (selout), no black outline, no anti-aliasing, no gradient, flat transparent bg
PALETTE (exact, exclusive): <hex list from art/palette.js ramps>
COMPOSITION: subject fills ~85% of frame, centered, light from upper-left
NEGATIVE: uniform black outline, gradients, extra limbs, background scenery, text
POST: downscale to <target> nearest-neighbor, quantize to declared ramps
```

CC0/public-domain assets (OpenGameArt etc.) may be mined for *tiles and props* if
they pass §12 after conforming — free ≠ paid — but characters stay Route P so the
cast is unique and consistent.

---

## Phases

### Phase A — spritegen foundation (gates everything)
- [x] `tools/spritegen/` scaffold: drawing kernel (P1) incl. auto-shade + auto-selout;
      ramp definitions in `art/palette.js` (VISION §2.1).
- [x] Skeleton/direction system (P3) + renderer/packer (P5) + `manifest.json` schema;
      Phaser loader path in BootScene (coexists with legacy procedural bake during
      transition).
- [x] Rewritten `scripts/validate_sprites.mjs` (PNG-based, VISION §12.A/B).
- [x] `scripts/compare_ref.mjs` (×6 side-by-side vs local reference extraction) +
      GalleryScene Reference-Compare tab. Reference pixels remain local-only.
- [x] Smoke test: Lyra descriptor with parametric humanoid parts and idle/walk sheets,
      end-to-end to an in-engine Gallery render.

### Phase B — part library + animation tables to "Lyra idle/walk" quality
- [x] Core humanoid parts (P2): head+eyes, 3 hair templates (`sweep`, `spikes`,
      `twin-tail`), torso/costume, limbs, and saber. Lyra currently exercises the
      `sweep` template; the other templates are descriptor-ready for companion rigs.
- [x] Idle + walk animation tables (P4) with secondary motion.
- [x] **Per-direction reads (P3 requirement above):** `drawLyra` uses distinct
      front/back/profile details (profile nose/brow step + single eye, occluding arm
      on sides, face-free back with jacket seam/belt). Blind-crop test remains part of
      the pending reference-strip review.
- [ ] **Lyra pilot:** descriptor → idle+walk ×4 directions in-engine, past §12.
      The generated pilot and validator are in place; reference comparison remains
      pending with `compare_ref.mjs`.

### Phase C — full action set + full hero cast
- [ ] Remaining animation tables: run, attack (+`smear_arc` part), cast, hurt, KO,
      victory, interact; Pip hover override set.
- [x] Species part families: Felidae (Erynn), Anura (Brimble), Drakonid (Drakkor),
      Construct (Pip).
- [x] 5 hero Base descriptors complete; Partial/Evolved as descriptor deltas
      (Erynn/Drakkor Act-3 = larger deltas + new parts).
- [ ] Delete legacy grid hero art as each rig ships (swap+delete same commit).

### Phase D — VFX library (independent; can run parallel with B/C)
- [ ] `public/src/art/vfx.js`: 14 primitives + `smear_arc` + 7 signature
      choreographies (VISION §5); Gallery VFX tab evidence.

### Phase E — world cast
- [ ] NPC archetype descriptors × species × region palettes (the cheapest big win —
      pure descriptor combinatorics).
- [x] Existing non-boss enemy roster regenerated via descriptor-driven family
      renderers (21 current entries); 15 new D18 enemies remain pending.
- [ ] Bosses: bespoke descriptors + custom parts at §4 canvases (Kael/Matriarch/Ignis
      regenerated; Vess, Archivist Prime, Unbound Crown per v2.0 §4.3 designs);
      sub-part animation stays engine-side.

### Phase F — portraits & UI
- [ ] Portraits: Route F if local GPU available, else procedural portrait parts
      (bigger canvas, same kernel — decide after a Route F feasibility check).
- [ ] UI kit audit vs. §8 (stays procedural; patch deltas only).

### Phase G — cinematics & ambience
- [ ] Cinematic templates on Phase D primitives; region ambience + void corruption
      motif deferred until M6+ regions ship.

---

## Execution notes

- Repo accepts binaries under `public/assets/` (generated outputs are committed;
  `tools/spritegen` is the source of truth — regenerating must be deterministic, so
  descriptors + tables are versioned and any RNG is seeded).
- Update PLAN.md D2 to record this supersession.
- Delegation: part functions and animation tables parallelize cleanly across agents
  (independent files, integrator reviews renders); descriptor authoring is cheap and
  serial.
- Every phase ends with validators → Gallery screenshot (with reference panel for
  characters) → manifest entry → sequential vN.N commit. Never commit failing
  validators.
- Craftpix extraction stays local-only, used exclusively by `compare_ref.mjs`.
