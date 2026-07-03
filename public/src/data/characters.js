// ═══════════════════════════════════════════════════════════════
// CHARACTERS — Playable party member registry (PRD §11.2 Character
// Growth; GAME_DESIGN_DOC species system, evolution system, and
// progression curve).
// Schema:
// {
//   id, name, species, role, desc,
//   base: { hp, sp, atk, mag, def, res, spd, crit },
//   growth: { hp, sp, atk, mag, def, res, spd },
//   traits: { evade?, critBonus?, hpMult?, healReceived?, fireResist?,
//             physBonus?, magResPenalty?, immunities?, buffDuration? },
//   skillsByLevel: { level: [skillId, ...] },
//   evolutions: [ { stage, name, unlockSkills: [...], statMult } ],
//   palette: 0xRRGGBB
// }
// ═══════════════════════════════════════════════════════════════

export const CHARACTERS = {

  // ─────────────────────────────────────────────────────────
  // LYRA SOLARI — Human, Princess → Warrior → Ascendant
  // ─────────────────────────────────────────────────────────
  lyra: {
    id: 'lyra', name: 'Lyra Solari', species: 'Human', role: 'Leader / Stellar Blade',
    desc: 'Sheltered heir to the shattered Celestial Crown, learning that true power comes from those who stand beside her.',
    base: { hp: 110, sp: 48, atk: 13, mag: 14, def: 10, res: 11, spd: 10, crit: 0.08 },
    growth: { hp: 9, sp: 4, atk: 1.6, mag: 1.7, def: 1.1, res: 1.2, spd: 1.0 },
    traits: {
      // Human: balanced stats, +10% all resistances, unique evolution path
      fireResist: 0.10, magResPenalty: 0
    },
    skillsByLevel: {
      4: ['radiant_blade'],
      8: ['piercing_star'],
      12: ['rally_cry'],
      16: ['crown_ward']
    },
    evolutions: [
      { stage: 1, name: 'Crown Bearer', unlockSkills: ['stellar_command'], statMult: 1.15 },
      { stage: 2, name: 'Starforged', unlockSkills: ['nova_burst'], statMult: 1.30 },
      { stage: 3, name: 'Celestial Ascendant', unlockSkills: ['crown_judgment'], statMult: 1.50 }
    ],
    palette: 0xffd166
  },

  // ─────────────────────────────────────────────────────────
  // ERYNN "ERYX" VEXX — Felidae, Scout / DPS
  // ─────────────────────────────────────────────────────────
  erynn: {
    id: 'erynn', name: 'Erynn "Eryx" Vexx', species: 'Felidae', role: 'Scout / Assassin',
    desc: 'A fast, guarded outcast whose sarcasm protects a strong moral line. Fights with speed, precision, and opportunistic damage.',
    base: { hp: 82, sp: 58, atk: 15, mag: 8, def: 8, res: 8, spd: 16, crit: 0.20 },
    growth: { hp: 6, sp: 4.5, atk: 1.8, mag: 0.8, def: 0.8, res: 0.8, spd: 1.6 },
    traits: {
      // Felidae: +20% evasion, +15% crit rate, -10% max HP
      evade: 0.20, critBonus: 0.15, hpMult: 0.90
    },
    skillsByLevel: {
      3: ['rend'],
      6: ['twin_slash'],
      10: ['feint'],
      14: ['shadow_step']
    },
    evolutions: [
      { stage: 1, name: 'Phantom Queen', unlockSkills: ['phantom_blades'], statMult: 1.35 }
    ],
    palette: 0x9b5de5
  },

  // ─────────────────────────────────────────────────────────
  // BRIMBLE TOADSWORTH — Anura, Tank / Support
  // ─────────────────────────────────────────────────────────
  brimble: {
    id: 'brimble', name: 'Brimble Toadsworth', species: 'Anura', role: 'Tank / Healer',
    desc: 'A gentle survivor whose home was consumed by void-touched waters. Turns danger into safety for those around him.',
    base: { hp: 145, sp: 44, atk: 11, mag: 12, def: 15, res: 13, spd: 6, crit: 0.05 },
    growth: { hp: 12, sp: 3.5, atk: 1.1, mag: 1.3, def: 1.7, res: 1.5, spd: 0.6 },
    traits: {
      // Anura: +30% max HP, +20% healing received, -15% speed
      hpMult: 1.30, healReceived: 0.20
    },
    skillsByLevel: {
      3: ['healing_tide'],
      6: ['guard_wall'],
      9: ['riptide'],
      13: ['cleansing_wave'],
      17: ['bog_grasp']
    },
    evolutions: [
      { stage: 1, name: 'Leviathan Sovereign', unlockSkills: ['leviathan_call'], statMult: 1.35 }
    ],
    palette: 0x4cc9f0
  },

  // ─────────────────────────────────────────────────────────
  // DRAKKOR ASHVEIL — Drakonid, Heavy DPS / Breaker
  // ─────────────────────────────────────────────────────────
  drakkor: {
    id: 'drakkor', name: 'Drakkor Ashveil', species: 'Drakonid', role: 'Heavy DPS / Breaker',
    desc: 'A proud warrior, last of his clutch, who believes he failed to protect them. Brings pressure, armor breaking, and controlled devastation.',
    base: { hp: 132, sp: 40, atk: 17, mag: 10, def: 13, res: 7, spd: 8, crit: 0.10 },
    growth: { hp: 10, sp: 3, atk: 2.0, mag: 1.0, def: 1.4, res: 0.7, spd: 0.8 },
    traits: {
      // Drakonid: +25% physical damage, +15% fire resistance, -20% magic resistance
      physBonus: 0.25, fireResist: 0.15, magResPenalty: 0.20
    },
    skillsByLevel: {
      4: ['sunder'],
      7: ['tail_sweep'],
      11: ['wyrms_roar'],
      15: ['molten_fist']
    },
    evolutions: [
      { stage: 1, name: 'Elder Wyrm', unlockSkills: ['dragons_fury'], statMult: 1.35 }
    ],
    palette: 0xef476f
  },

  // ─────────────────────────────────────────────────────────
  // PIP — Construct, Healer / Buffer
  // ─────────────────────────────────────────────────────────
  pip: {
    id: 'pip', name: 'Pip', species: 'Construct', role: 'Healer / Buffer',
    desc: 'A curious hovering drone whose cheerful literalism masks uncertainty about origin and purpose. Repairs, enhances, analyzes, and recovers from failure.',
    base: { hp: 88, sp: 70, atk: 8, mag: 15, def: 8, res: 12, spd: 12, crit: 0.06 },
    growth: { hp: 6.5, sp: 5.5, atk: 0.7, mag: 1.7, def: 0.8, res: 1.3, spd: 1.1 },
    traits: {
      // Construct: immune to poison/bleed, -25% healing received, +30% buff duration
      immunities: ['poison', 'bleed'], healReceived: -0.25, buffDuration: 0.30
    },
    skillsByLevel: {
      3: ['scan'],
      6: ['overclock'],
      9: ['malfunction'],
      12: ['shield_matrix'],
      16: ['reboot_protocol']
    },
    evolutions: [
      { stage: 1, name: 'Omega Core', unlockSkills: ['omega_core'], statMult: 1.35 }
    ],
    palette: 0x06d6a0
  }
};

// ─────────────────────────────────────────────────────────
// XP CURVE — GAME_DESIGN_DOC Progression Curve: 100 to reach
// level 2, growing by roughly ×1.5 per subsequent level.
// xpForLevel(level) returns the XP required to advance FROM
// (level - 1) TO level (i.e. the cost of that single level-up).
// ─────────────────────────────────────────────────────────
export const LEVEL_CAP = 20;

const XP_TABLE = [
  0,    // level 1 (start, unused)
  0,    // to reach level 1
  100,  // to reach level 2
  150,  // to reach level 3
  225,  // to reach level 4
  340,  // to reach level 5
  510,  // to reach level 6
  765,  // to reach level 7
  1150, // to reach level 8
  1725  // to reach level 9
];

export function xpForLevel(level) {
  if (level <= 1) return 0;
  if (level < XP_TABLE.length) return XP_TABLE[level];
  // Beyond the authored table, continue the ~×1.5 growth curve.
  let value = XP_TABLE[XP_TABLE.length - 1];
  for (let lvl = XP_TABLE.length; lvl <= level; lvl++) {
    value = Math.round(value * 1.5 / 5) * 5;
  }
  return value;
}
