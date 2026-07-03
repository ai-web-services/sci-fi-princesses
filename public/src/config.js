// ═══════════════════════════════════════════════════════════════
// CONFIG — Resolution, tiles, global constants
// ═══════════════════════════════════════════════════════════════

// Internal resolution: 640×360 (16:9). Integer-scales to 720p (×2), 1080p (×3), 4K (×6).
export const GAME_W = 640;
export const GAME_H = 360;
export const TILE = 16;

// Sprite dimensions
export const SPR_W = 24;   // exploration sprite width
export const SPR_H = 32;   // exploration sprite height

// Save keys
export const SAVE_PREFIX = 'stellar_save_v2_slot';   // + 0..2, 'auto'
export const LEGACY_SAVE_KEY = 'stellar_save';
export const SETTINGS_KEY = 'stellar_settings_v2';
export const SAVE_SCHEMA_VERSION = 2;

// Depth layers (MapScene)
export const DEPTH = {
  GROUND: 0,
  DECO: 10,
  BELOW: 20,      // objects behind actors
  ACTOR: 30,      // y-sorted actors add y*0.01
  ABOVE: 500,     // overhangs, roofs
  WEATHER: 700,
  UI: 900,
  FADE: 1000
};

// Elements & damage types
export const ELEMENTS = ['fire', 'water', 'ice', 'volt', 'stellar', 'void', 'slash', 'pierce', 'blunt'];

export const ELEMENT_INFO = {
  fire:    { name: 'Fire',    color: 0xff7733, icon: 'elFire' },
  water:   { name: 'Water',   color: 0x44aaff, icon: 'elWater' },
  ice:     { name: 'Ice',     color: 0xaaddff, icon: 'elIce' },
  volt:    { name: 'Volt',    color: 0xffee44, icon: 'elVolt' },
  stellar: { name: 'Stellar', color: 0xffd97a, icon: 'elStellar' },
  void:    { name: 'Void',    color: 0xbb66ee, icon: 'elVoid' },
  slash:   { name: 'Slash',   color: 0xcccccc, icon: 'elSlash' },
  pierce:  { name: 'Pierce',  color: 0xbbbbcc, icon: 'elPierce' },
  blunt:   { name: 'Blunt',   color: 0xccbbaa, icon: 'elBlunt' }
};

// Difficulty presets — modular assist values (multipliers)
export const DIFFICULTY_PRESETS = {
  story:      { name: 'Story',      enemyHp: 0.7, enemyDmg: 0.6, spRegen: 1.5, reviveOnDefeat: true },
  adventurer: { name: 'Adventurer', enemyHp: 1.0, enemyDmg: 1.0, spRegen: 1.0, reviveOnDefeat: false },
  veteran:    { name: 'Veteran',    enemyHp: 1.3, enemyDmg: 1.25, spRegen: 0.8, reviveOnDefeat: false }
};
