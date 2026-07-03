// ═══════════════════════════════════════════════════════════════
// ENEMIES — Bestiary registry (PRD §10 Combat; GAME_DESIGN_DOC Boss
// Battle Design). Zones: Nova/Stargate (lv 1-4), Mirelight (lv 5-8),
// Ashfall (lv 8-11).
// Schema:
// {
//   id, name, desc, level, hp, atk, mag, def, res, spd,
//   weak: [...], resist: [...], immune: [...],
//   skills: [skillId, ...], ai: 'aggressive'|'defensive'|'support'|'wild',
//   xp, gold, drops: [{ item, chance }],
//   boss?: true, phases?: [{ hpFrac, addSkills, say }],
//   size: 'small'|'medium'|'large'|'boss',
//   palette: { primary, glow }
// }
// ═══════════════════════════════════════════════════════════════

export const ENEMIES = {

  // ─────────────────────────────────────────────────────────
  // NOVA / STARGATE — levels 1-4
  // ─────────────────────────────────────────────────────────
  voidling: {
    id: 'voidling', name: 'Voidling',
    desc: 'A flickering scrap of rift-energy given crude, hungry shape. Weak alone, but rarely alone.',
    level: 1, hp: 38, atk: 7, mag: 6, def: 4, res: 4, spd: 8,
    weak: ['stellar'], resist: ['void'], immune: [],
    skills: ['void_bolt'],
    ai: 'aggressive',
    xp: 18, gold: 8,
    drops: [{ item: 'void_essence', chance: 0.35 }, { item: 'scrap_metal', chance: 0.2 }],
    size: 'small',
    palette: { primary: 0x4b3b6b, glow: 0x9b6bff }
  },
  shade: {
    id: 'shade', name: 'Shade',
    desc: 'A drifting sliver of corrupted shadow that latches onto the unwary.',
    level: 2, hp: 46, atk: 9, mag: 7, def: 5, res: 5, spd: 10,
    weak: ['stellar'], resist: ['void'], immune: [],
    skills: ['void_bolt', 'corrupt_grasp'],
    ai: 'aggressive',
    xp: 24, gold: 10,
    drops: [{ item: 'void_essence', chance: 0.35 }, { item: 'scrap_metal', chance: 0.15 }],
    size: 'small',
    palette: { primary: 0x2e2440, glow: 0x8855dd }
  },
  corrupted_sentry: {
    id: 'corrupted_sentry', name: 'Corrupted Sentry',
    desc: 'A Stargate guardian construct whose logic core was overwritten by void code. Still marches its old patrol route.',
    level: 3, hp: 64, atk: 11, mag: 5, def: 10, res: 6, spd: 6,
    weak: ['stellar'], resist: ['void', 'slash'], immune: [],
    skills: ['void_bolt', 'corrupt_grasp'],
    ai: 'defensive',
    xp: 30, gold: 14,
    drops: [{ item: 'scrap_metal', chance: 0.5 }, { item: 'void_essence', chance: 0.2 }],
    size: 'medium',
    palette: { primary: 0x556070, glow: 0x77aadd }
  },
  void_maw: {
    id: 'void_maw', name: 'Void Maw',
    desc: 'A lamprey-like rift tear that bites into reality itself, chasing warmth and light.',
    level: 3, hp: 58, atk: 13, mag: 4, def: 6, res: 5, spd: 9,
    weak: ['stellar'], resist: ['void'], immune: [],
    skills: ['void_bolt'],
    ai: 'aggressive',
    xp: 28, gold: 12,
    drops: [{ item: 'void_essence', chance: 0.4 }],
    size: 'medium',
    palette: { primary: 0x1c1330, glow: 0xaa44ff }
  },
  gate_wisp: {
    id: 'gate_wisp', name: 'Gate Wisp',
    desc: 'A mote of unstable Stargate energy, drawn to disrupt anyone who nears the gate.',
    level: 1, hp: 32, atk: 6, mag: 9, def: 3, res: 6, spd: 12,
    weak: ['stellar'], resist: ['void'], immune: [],
    skills: ['void_bolt'],
    ai: 'wild',
    xp: 16, gold: 9,
    drops: [{ item: 'stellar_crystal', chance: 0.12 }, { item: 'void_essence', chance: 0.25 }],
    size: 'small',
    palette: { primary: 0x335577, glow: 0x66eeff }
  },
  shard_golem: {
    id: 'shard_golem', name: 'Shard Golem',
    desc: 'Broken Crown shard fragments bound into a lumbering guardian by residual stellar force.',
    level: 4, hp: 76, atk: 14, mag: 3, def: 13, res: 8, spd: 4,
    weak: ['void'], resist: ['stellar', 'blunt'], immune: [],
    skills: ['void_bolt', 'corrupt_grasp'],
    ai: 'defensive',
    xp: 36, gold: 18,
    drops: [{ item: 'stellar_crystal', chance: 0.3 }, { item: 'scrap_metal', chance: 0.4 }],
    size: 'large',
    palette: { primary: 0x8899aa, glow: 0xffee99 }
  },

  // ─────────────────────────────────────────────────────────
  // MIRELIGHT — levels 5-8
  // ─────────────────────────────────────────────────────────
  mire_croaker: {
    id: 'mire_croaker', name: 'Mire Croaker',
    desc: 'A bloated swamp-dweller whose croak curdles the water around it.',
    level: 5, hp: 92, atk: 15, mag: 8, def: 9, res: 8, spd: 7,
    weak: ['fire'], resist: ['water'], immune: [],
    skills: ['tide_crush'],
    ai: 'aggressive',
    xp: 46, gold: 20,
    drops: [{ item: 'bio_gel', chance: 0.45 }, { item: 'mire_pearl', chance: 0.15 }],
    size: 'medium',
    palette: { primary: 0x3a6b4a, glow: 0x88cc66 }
  },
  drowned_one: {
    id: 'drowned_one', name: 'Drowned One',
    desc: 'A sailor claimed by the void-touched flood, still lurching toward the surface it will never reach.',
    level: 6, hp: 105, atk: 16, mag: 9, def: 8, res: 10, spd: 5,
    weak: ['fire', 'stellar'], resist: ['water', 'void'], immune: [],
    skills: ['tide_crush', 'corrupt_grasp'],
    ai: 'aggressive',
    xp: 52, gold: 24,
    drops: [{ item: 'bio_gel', chance: 0.35 }, { item: 'void_essence', chance: 0.25 }],
    size: 'medium',
    palette: { primary: 0x445566, glow: 0x66aabb }
  },
  bog_lurker: {
    id: 'bog_lurker', name: 'Bog Lurker',
    desc: 'A camouflaged predator that waits motionless in the mire for hours at a time.',
    level: 6, hp: 98, atk: 18, mag: 6, def: 10, res: 7, spd: 9,
    weak: ['fire'], resist: ['water'], immune: [],
    skills: ['tide_crush'],
    ai: 'aggressive',
    xp: 50, gold: 22,
    drops: [{ item: 'bio_gel', chance: 0.4 }, { item: 'mire_pearl', chance: 0.12 }],
    size: 'medium',
    palette: { primary: 0x2f4a33, glow: 0x77bb55 }
  },
  tide_witch: {
    id: 'tide_witch', name: 'Tide Witch',
    desc: 'A Mirelight shaman who bent the corrupted currents to her will, and lost herself in the bargain.',
    level: 7, hp: 88, atk: 10, mag: 20, def: 7, res: 14, spd: 10,
    weak: ['stellar'], resist: ['water'], immune: [],
    skills: ['tide_crush', 'dark_pulse'],
    ai: 'support',
    xp: 58, gold: 28,
    drops: [{ item: 'mire_pearl', chance: 0.3 }, { item: 'void_essence', chance: 0.2 }],
    size: 'medium',
    palette: { primary: 0x224466, glow: 0x55ddff }
  },
  coral_crab: {
    id: 'coral_crab', name: 'Coral Crab',
    desc: 'A heavily armored crustacean whose shell has fused with sharp black coral.',
    level: 7, hp: 120, atk: 17, mag: 4, def: 18, res: 9, spd: 4,
    weak: ['fire'], resist: ['water', 'blunt'], immune: [],
    skills: ['tide_crush'],
    ai: 'defensive',
    xp: 56, gold: 26,
    drops: [{ item: 'mire_pearl', chance: 0.35 }, { item: 'bio_gel', chance: 0.3 }],
    size: 'medium',
    palette: { primary: 0x774433, glow: 0xffaa77 }
  },
  void_eel: {
    id: 'void_eel', name: 'Void Eel',
    desc: 'A serpentine hunter that swims through corrupted water as easily as through open air.',
    level: 8, hp: 112, atk: 20, mag: 10, def: 9, res: 10, spd: 13,
    weak: ['stellar'], resist: ['water', 'void'], immune: [],
    skills: ['tide_crush', 'corrupt_grasp'],
    ai: 'aggressive',
    xp: 64, gold: 30,
    drops: [{ item: 'void_essence', chance: 0.3 }, { item: 'mire_pearl', chance: 0.2 }],
    size: 'medium',
    palette: { primary: 0x331155, glow: 0xbb55ff }
  },

  // ─────────────────────────────────────────────────────────
  // ASHFALL — levels 8-11
  // ─────────────────────────────────────────────────────────
  ember_hound: {
    id: 'ember_hound', name: 'Ember Hound',
    desc: 'A pack hunter of the ashfields whose fur smolders but never quite catches.',
    level: 8, hp: 118, atk: 22, mag: 8, def: 11, res: 9, spd: 15,
    weak: ['water'], resist: ['fire'], immune: [],
    skills: ['ember_spit'],
    ai: 'aggressive',
    xp: 66, gold: 30,
    drops: [{ item: 'ash_ingot', chance: 0.4 }, { item: 'dragon_scale', chance: 0.1 }],
    size: 'medium',
    palette: { primary: 0x552211, glow: 0xff6622 }
  },
  ash_revenant: {
    id: 'ash_revenant', name: 'Ash Revenant',
    desc: 'The lingering, burning grudge of a warrior who fell defending the Ashfall passes.',
    level: 9, hp: 130, atk: 19, mag: 16, def: 12, res: 13, spd: 8,
    weak: ['water', 'stellar'], resist: ['fire', 'void'], immune: [],
    skills: ['ember_spit', 'dark_pulse'],
    ai: 'aggressive',
    xp: 74, gold: 34,
    drops: [{ item: 'ash_ingot', chance: 0.35 }, { item: 'void_essence', chance: 0.15 }],
    size: 'medium',
    palette: { primary: 0x443322, glow: 0xffaa44 }
  },
  magma_beetle: {
    id: 'magma_beetle', name: 'Magma Beetle',
    desc: 'An armored insect whose molten-cracked shell radiates heat that warps the air around it.',
    level: 9, hp: 150, atk: 20, mag: 6, def: 20, res: 10, spd: 5,
    weak: ['water'], resist: ['fire', 'blunt'], immune: [],
    skills: ['ember_spit'],
    ai: 'defensive',
    xp: 78, gold: 36,
    drops: [{ item: 'ash_ingot', chance: 0.5 }, { item: 'scrap_metal', chance: 0.2 }],
    size: 'medium',
    palette: { primary: 0x772200, glow: 0xffcc00 }
  },
  drake_whelp: {
    id: 'drake_whelp', name: 'Drake Whelp',
    desc: 'A young, feral drake too wild to be reasoned with, and too dangerous to ignore.',
    level: 11, hp: 145, atk: 24, mag: 12, def: 14, res: 11, spd: 12,
    weak: ['water'], resist: ['fire'], immune: [],
    skills: ['ember_spit', 'corrupt_grasp'],
    ai: 'wild',
    xp: 90, gold: 42,
    drops: [{ item: 'dragon_scale', chance: 0.3 }, { item: 'ash_ingot', chance: 0.3 }],
    size: 'large',
    palette: { primary: 0x883322, glow: 0xff8844 }
  },

  // ─────────────────────────────────────────────────────────
  // BOSSES
  // ─────────────────────────────────────────────────────────
  kael: {
    id: 'kael', name: 'Void Sentinel Kael',
    desc: 'A corrupted guardian of the Stargate, consumed by void energy but still bound to its post. The first true test of the Crown\'s heir.',
    level: 4, hp: 620, atk: 18, mag: 16, def: 12, res: 10, spd: 9,
    weak: ['stellar'], resist: ['void'], immune: [],
    skills: ['void_slash', 'dark_pulse', 'summon_shade'],
    ai: 'aggressive',
    xp: 220, gold: 150,
    drops: [
      { item: 'stellar_crystal', chance: 1.0 },
      { item: 'void_essence', chance: 0.6 }
    ],
    boss: true,
    phases: [
      { hpFrac: 0.5, addSkills: ['void_slash', 'annihilation_beam'], say: 'The gate... will NOT... fall!' }
    ],
    size: 'boss',
    palette: { primary: 0x2a1a44, glow: 0xaa55ff }
  },
  matriarch: {
    id: 'matriarch', name: 'Drowned Matriarch',
    desc: 'The ancient guardian spirit of Mirelight\'s flooded depths, twisted by void corruption into a vengeful tide-mother.',
    level: 8, hp: 980, atk: 22, mag: 24, def: 14, res: 16, spd: 8,
    weak: ['fire', 'stellar'], resist: ['water', 'void'], immune: [],
    skills: ['tide_crush', 'dark_pulse', 'corrupt_grasp'],
    ai: 'aggressive',
    xp: 380, gold: 260,
    drops: [
      { item: 'mire_pearl', chance: 1.0 },
      { item: 'bio_gel', chance: 0.6 },
      { item: 'celestial_shard', chance: 0.3 }
    ],
    boss: true,
    phases: [
      { hpFrac: 0.5, addSkills: ['annihilation_beam'], say: 'The water remembers everything you drowned.' }
    ],
    size: 'boss',
    palette: { primary: 0x0f2a3a, glow: 0x44ccee }
  },
  ignis: {
    id: 'ignis', name: 'Ash Tyrant Ignis',
    desc: 'A dragon-kin warlord whose armor plating must be broken before its true weakness can be exposed. Drakkor\'s personal trial.',
    level: 11, hp: 1250, atk: 26, mag: 14, def: 26, res: 12, spd: 10,
    weak: ['water'], resist: ['fire', 'blunt'], immune: [],
    skills: ['ember_spit', 'void_slash'],
    ai: 'aggressive',
    xp: 480, gold: 340,
    drops: [
      { item: 'dragon_scale', chance: 1.0 },
      { item: 'ash_ingot', chance: 0.6 },
      { item: 'celestial_shard', chance: 0.35 }
    ],
    boss: true,
    phases: [
      { hpFrac: 0.5, addSkills: ['annihilation_beam'], say: 'Break my hide, then. See what waits beneath it.' }
    ],
    size: 'boss',
    palette: { primary: 0x661a0a, glow: 0xffaa22 }
  }
};
