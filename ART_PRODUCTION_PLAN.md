# ═══════════════════════════════════════════════════════════════
# ART PRODUCTION PLAN — execution plan for ART_VISION.md v2.0
# ═══════════════════════════════════════════════════════════════

**Status:** Working plan. Operationalizes ART_VISION.md §10's priority order into
concrete, sequenced, delegatable steps. Update this file's checkboxes/notes as phases
land — it is the durable record of what's shipped vs. pending, so a future session can
resume without re-deriving the whole survey.

**Relationship to other docs:** ART_VISION.md is the binding spec (what "done" looks
like, §12 Acceptance Criteria). ART_ASSET_INVENTORY.md is the raw inventory. This file
is the *how and in what order*.

---

## Baseline (surveyed 2026-07-05)

Pipeline is stable — pixel-string grids, `art/palette.js` named ramps, render-to-texture
at boot, validator scripts (`validate:sprites`, `validate:maps`, region validators). No
toolchain changes needed. Confirmed gaps vs. ART_VISION.md:

| Category | State |
|---|---|
| Exploration walk cycles (4-dir) | 5/5 heroes complete |
| Battle poses per hero (spec: 12, §3.2 B1–B12) | 7/12 present (idle/step/attack/cast/hit/ko/victory). Missing: B2 step-forward-windup, B3 attack windup, B6 signature skill, B8 critical, B10 defend, B12 item use |
| Portraits (spec: 6 expressions) | 5/6 present per character (neutral/happy/sad/angry/surprised). Missing: resolute |
| Standard enemies (16) | Complete, single static pose (per §4 that's spec-correct; idle-alt-frame animation is a §4 upgrade, not required) |
| Bosses (spec: 5 arena + final) | 3/5: Kael, Matriarch, Ignis done. Missing: Vess, Archivist Prime, Unbound Crown (3-body) |
| VFX library (§5.1, 14 primitives) | Not yet built — `art/vfx.js` doesn't exist |
| In-engine preview/screenshot pipeline | Does not exist — required to produce §12.F evidence |

---

## Phase 0 — Infrastructure (blocks all screenshot verification)

- [x] Build `public/src/scenes/GalleryScene.js`: tabs/categories for exploration walks,
      battle poses, portraits, enemies, bosses, VFX; renders at ×3 via existing
      `buildActorTexture` / `buildHeroBattleTexture` / `buildEnemyBattleTexture` helpers.
- [x] Wire a debug entry point (key or query param) from TitleScene. Press `G` on the
      title screen.
- [x] Verify against *existing* assets first (sanity check the viewer before trusting it
      to validate new content). Confirmed 2026-07-05: all 6 tabs (Exploration Walks 5,
      Battle Poses 5, Portraits 25, Standard Enemies 16, Bosses 3, VFX Library 0) render
      without error; screenshotted Lyra exploration sprite, Lyra battle idle pose, and
      Kael boss at ×3.

**Delegation:** Serial, done directly (single new file, needs full pipeline context). DONE.

---

## Phase 1 — Hero battle sheets, Base stage (ART_VISION §10 priority 1)

- [ ] Draft missing poses B2/B3/B6/B8/B10/B12 for all 5 heroes, per each hero's §3.3
      signature-read row (e.g. Lyra B6 = Crown raised + halo ring; Erynn B6 = vanish
      crouch → afterimage silhouette).
- [ ] Splice drafts into `public/src/art/battle/heroes.js` (shared file — serialize
      writes), run `validate:sprites`, screenshot each hero's full 12-pose sheet.
- [ ] Manifest entries in `art/manifest.md` (create if absent) per ART_VISION §11.

**Delegation:** 3 agents draft in parallel, split by hero group (no shared-file edits —
return grids as text): {Lyra, Erynn}, {Brimble, Drakkor}, {Pip (hover-variant rules)}.
Splice/validate/screenshot is serial (me).

---

## Phase 2 — VFX core library (§10 priority 2)

- [ ] Build the 14 primitives from §5.1 in new `public/src/art/vfx.js`: `bolt`,
      `projectile`, `cone`, `ring`, `rain`, `beam`, `shield_dome`, `sparkle_rise`,
      `swarm`, `afterimage`, `slash_arc`, `screen_flash`, `screen_shake`,
      `palette_cycle`.
- [ ] Wire the 7 signature-skill choreographies (§5.2) on top of the primitives.
- [ ] Screenshot/record each effect via Gallery's VFX tab.

**Delegation:** 2 agents in parallel on genuinely independent new files (no shared-file
conflict since `vfx.js` doesn't exist yet): {shape primitives: bolt/projectile/cone/
ring/rain/beam}, {caster/status primitives: shield_dome/sparkle_rise/swarm/afterimage/
slash_arc/screen_flash/screen_shake/palette_cycle}. I merge exports + wire choreography.

---

## Phase 3 — Boss contracts for missing roster (§10 priority 3)

- [ ] Draft Vess (Silk Baroness, 96×112 duelist boss, §4.3), Archivist Prime (128×128
      construct + orbiting glyph ring), Unbound Crown (3-body final: P1 64×80, P2/P3
      192×160).
- [ ] Splice into `public/src/art/battle/enemies.js` (shared file — serialize writes),
      validate, screenshot each including sub-part animation + phase-shift overlays.
- [ ] Manifest entries; note per §4.2 that bosses are never palette-swapped.

**Delegation:** 3 agents draft fully independent bosses in parallel (return grids as
text). Splice/validate/screenshot serial (me).

---

## Phase 4 — UI kit refresh (§10 priority 4)

- [ ] Audit current window frames/gauges/damage-number colors/CTB timeline against §8;
      patch deltas only (don't rebuild what already passes).

**Delegation:** Single agent audit + patch; low parallelism value (small, interdependent
visual system).

---

## Phase 5 — Remaining per-milestone content (§10 priority 5)

- [ ] Exploration extra-poses (interact/surprised/sad/sleep/victory, §3.1) × 5 heroes.
- [ ] Portrait "resolute" expression × 5 heroes (only gap — rest exist).
- [ ] Enemy idle-alternate-frame animation upgrade for 16 standard enemies (optional
      polish per §4, not required for spec compliance).

**Delegation:** 2–3 agents split by character for extra-poses; 1 agent for the portrait
gap (small, uniform task across all 5).

---

## Phase 6 — Cinematic templates (§10 priority 6)

- [ ] Encounter transition (shatter/slide-in), death/dissolve (standard §7.4 + boss
      variant), victory stagger (§7.5), evolution scene (§7.6), shard-memory duotone
      (§7.7) — each a reusable sequence function built on Phase 2's VFX primitives.

**Delegation:** Depends entirely on Phase 2 landing first. Then splits cleanly per
template (5 largely independent sequence functions) — parallelizable once primitives
exist.

---

## Phase 7 — Ambience & polish (§10 priority 7)

- [ ] Per-region exploration ambience (§7.8), void corruption motif (§7.9).

**Delegation:** Deferred until M6+ regions actually ship content (per PLAN.md
milestone status). Not scoped further here.

---

## Execution notes

- `battle/heroes.js` and `battle/enemies.js` are single shared files covering all
  characters/enemies — parallel agents must never `Edit` them directly. Agents draft
  content as text; the orchestrating session splices serially and re-validates after
  each splice.
- Every phase ends with: run relevant `validate:*` script → Gallery screenshot → manifest
  entry. No phase is "done" without the screenshot per ART_VISION §12.F.
- Phase 0 gates everything — no new content should be authored before the viewer exists,
  since there'd be no way to catch silhouette/color/grammar violations before they're
  baked into shared files.
