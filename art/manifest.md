# Art Manifest

Per ART_VISION.md §11: every authored asset packet gets an entry here — asset id, spec
section, frame list, palette used, and any documented reuse/palette-swap. This is the
audit trail Acceptance Criteria (§12.F) checks against.

Format per entry:

```
### <asset id>
- Spec: §<section>
- File: <path>
- Frames/poses: <list>
- Palette: <named ramp(s) from art/palette.js, or character palette per §2.1>
- Reuse/swap notes: <none | description>
- Verified: <date> — <screenshot description / Gallery tab+item>
```

---

## Phase 0 — Infrastructure

### GalleryScene
- Spec: §11 (handoff protocol), §12.F (verification evidence)
- File: `public/src/scenes/GalleryScene.js`
- Frames/poses: n/a (viewer, not an asset)
- Palette: n/a
- Reuse/swap notes: none
- Verified: 2026-07-05 — all 6 tabs render without error against existing assets
  (Exploration Walks, Battle Poses, Portraits, Standard Enemies, Bosses, VFX Library).
