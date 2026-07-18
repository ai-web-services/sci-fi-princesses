// ═══════════════════════════════════════════════════════════════
// RIGS — runtime registry for generated PNG sprite rigs
// (tools/spritegen output). Reads assets/sprites/manifest.json,
// creates Phaser animations per asset × action × direction, and
// answers whether an actor id has a rig so ActorSprite can prefer
// it over legacy baked textures.
// Sheet grammar: 8 columns × 4 direction rows of 64px cells;
// rows are front/back/side-left/side-right; feet 4px above the
// cell bottom (ART_VISION.md §1/§11).
// ═══════════════════════════════════════════════════════════════

const ROW_NAMES = ['front', 'back', 'side-left', 'side-right'];
const DIR_TO_ROW = { down: 0, up: 1, left: 2, right: 3 };
const LOOPING = { idle: true, walk: true, run: true };

const rigActions = new Map(); // id -> Set(action)
const rigAssetActions = new Map(); // id -> Set(action), including enemy idle/attack rigs

export function rigTextureKey(id, action) { return 'rig_' + id + '_' + action; }

// Queue every sheet listed in the manifest onto an in-flight loader.
// Called from BootScene's filecomplete handler for the manifest json.
export function queueRigSheets(loader, manifest) {
  if (!manifest || !manifest.assets) return;
  for (const asset of manifest.assets) {
    for (const [action, a] of Object.entries(asset.actions)) {
      loader.spritesheet(rigTextureKey(asset.id, action), 'assets/sprites/' + a.file, {
        frameWidth: manifest.cell.width, frameHeight: manifest.cell.height,
      });
    }
  }
}

// After load: create animations and register available rigs.
export function registerRigs(scene) {
  const manifest = scene.cache.json.get('rigManifest');
  if (!manifest || !manifest.assets) return;
  const cols = manifest.layout.columns;
  for (const asset of manifest.assets) {
    const actions = new Set();
    for (const [action, a] of Object.entries(asset.actions)) {
      const texKey = rigTextureKey(asset.id, action);
      if (!scene.textures.exists(texKey)) continue;
      for (const dirName of asset.directions) {
        const row = ROW_NAMES.indexOf(dirName);
        if (row < 0) continue;
        const animKey = texKey + '_' + dirName;
        if (!scene.anims.exists(animKey)) {
          scene.anims.create({
            key: animKey,
            frames: scene.anims.generateFrameNumbers(texKey, { start: row * cols, end: row * cols + a.frames - 1 }),
            frameRate: a.fps,
            repeat: LOOPING[action] ? -1 : 0,
          });
        }
      }
      actions.add(action);
    }
    rigAssetActions.set(asset.id, actions);
    // A usable exploration rig needs at least idle + walk.
    if (actions.has('idle') && actions.has('walk')) rigActions.set(asset.id, actions);
  }
}

export function hasRig(id) { return rigActions.has(id); }

export function hasRigAction(id, action) { return rigAssetActions.get(id)?.has(action) ?? false; }

export function rigAnim(id, action, gameDir) {
  const acts = rigActions.get(id);
  const act = acts && acts.has(action) ? action : 'idle';
  return rigTextureKey(id, act) + '_' + ROW_NAMES[DIR_TO_ROW[gameDir] ?? 0];
}

// Feet sit 4px above the 64px cell bottom (VISION §1 anchor).
export const RIG_FOOT_ORIGIN_Y = 60 / 64;
