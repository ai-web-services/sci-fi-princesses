// ═══════════════════════════════════════════════════════════════
// SKILLS — Player and enemy ability registry.
// Schema (see PRD §10 Combat, §11.2 Character Growth):
// {
//   id, name, desc, cost, target, power, kind, element, tags,
//   status?, buff?, crit?, hits?, drainSp?, shield?, revive?, cleanse?
// }
// target: 'enemy' | 'allEnemies' | 'ally' | 'allAllies' | 'self' | 'koAlly'
// kind:   'physical' | 'magic' | 'heal' | 'buff' | 'debuff' | 'utility'
// power:  multiplier vs user atk/mag (1.0 = 100%); 0 for pure utility
// ═══════════════════════════════════════════════════════════════

export const SKILLS = {

  // ─────────────────────────────────────────────────────────
  // LYRA SOLARI — Stellar sword + light magic + party command
  // ─────────────────────────────────────────────────────────
  lyra_strike: {
    id: 'lyra_strike', name: 'Sword Strike',
    desc: 'A basic stellar-forged blade slash.',
    cost: 0, target: 'enemy', power: 1.0, kind: 'physical',
    element: 'slash', tags: ['sword', 'basic']
  },
  stellar_slash: {
    id: 'stellar_slash', name: 'Stellar Slash',
    desc: 'Lyra channels starlight into her blade for a radiant cut. Her signature technique.',
    cost: 12, target: 'enemy', power: 1.6, kind: 'physical',
    element: 'stellar', tags: ['sword', 'stellar', 'signature'],
    crit: 1.3
  },
  radiant_blade: {
    id: 'radiant_blade', name: 'Radiant Blade',
    desc: 'A wide arc of light that scorches multiple foes.',
    cost: 16, target: 'allEnemies', power: 0.9, kind: 'magic',
    element: 'stellar', tags: ['sword', 'stellar', 'aoe']
  },
  guiding_light: {
    id: 'guiding_light', name: 'Guiding Light',
    desc: 'Soothing starlight mends an ally’s wounds.',
    cost: 14, target: 'ally', power: 1.2, kind: 'heal',
    element: 'stellar', tags: ['light', 'heal']
  },
  piercing_star: {
    id: 'piercing_star', name: 'Piercing Star',
    desc: 'A focused lance of starlight that punches through defenses.',
    cost: 18, target: 'enemy', power: 1.4, kind: 'magic',
    element: 'stellar', tags: ['stellar', 'armor-ignore'],
    buff: { stat: 'def', amount: -0.15, turns: 2 }
  },
  rally_cry: {
    id: 'rally_cry', name: 'Rally Cry',
    desc: 'Lyra’s voice steadies the whole party, raising their resolve.',
    cost: 15, target: 'allAllies', power: 0, kind: 'buff',
    element: null, tags: ['command', 'buff'],
    buff: { stat: 'atk', amount: 0.2, turns: 3 }
  },
  crown_ward: {
    id: 'crown_ward', name: 'Crown Ward',
    desc: 'A shimmering barrier of stellar light shields an ally from harm.',
    cost: 14, target: 'ally', power: 0, kind: 'buff',
    element: 'stellar', tags: ['shield', 'stellar'],
    shield: 0.25
  },
  // Evolution 1 — Crown Bearer
  stellar_command: {
    id: 'stellar_command', name: 'Stellar Command',
    desc: 'Crown Bearer technique. Lyra issues a decisive command, empowering all allies’ attack and speed.',
    cost: 24, target: 'allAllies', power: 0, kind: 'buff',
    element: 'stellar', tags: ['command', 'stellar', 'evolution'],
    buff: { stat: 'atk', amount: 0.25, turns: 3 }
  },
  // Evolution 2 — Starforged
  nova_burst: {
    id: 'nova_burst', name: 'Nova Burst',
    desc: 'Starforged technique. Lyra detonates a collapsing star across the battlefield.',
    cost: 30, target: 'allEnemies', power: 1.8, kind: 'magic',
    element: 'stellar', tags: ['stellar', 'aoe', 'evolution'],
    crit: 1.2
  },
  // Evolution 3 — Celestial Ascendant
  crown_judgment: {
    id: 'crown_judgment', name: 'Crown Judgment',
    desc: 'Celestial Ascendant ultimate. The full weight of the restored Crown descends upon her enemies.',
    cost: 40, target: 'allEnemies', power: 2.4, kind: 'magic',
    element: 'stellar', tags: ['stellar', 'aoe', 'ultimate', 'evolution'],
    crit: 1.5
  },

  // ─────────────────────────────────────────────────────────
  // ERYNN "ERYX" VEXX — Fast claw crits, evasion, shadow steps
  // ─────────────────────────────────────────────────────────
  erynn_claw: {
    id: 'erynn_claw', name: 'Claw Swipe',
    desc: 'A quick swipe with retractable claws.',
    cost: 0, target: 'enemy', power: 1.0, kind: 'physical',
    element: 'slash', tags: ['claw', 'basic']
  },
  shadow_pounce: {
    id: 'shadow_pounce', name: 'Shadow Pounce',
    desc: 'Erynn teleports through shadow to strike an unseen angle. Always a critical hit. Her signature technique.',
    cost: 16, target: 'enemy', power: 1.3, kind: 'physical',
    element: 'slash', tags: ['claw', 'shadow', 'signature'],
    crit: 3.0
  },
  rend: {
    id: 'rend', name: 'Rend',
    desc: 'Erynn tears into a wound, leaving the target bleeding.',
    cost: 10, target: 'enemy', power: 1.1, kind: 'physical',
    element: 'slash', tags: ['claw'],
    status: { id: 'poison', chance: 0.7, turns: 3 }
  },
  twin_slash: {
    id: 'twin_slash', name: 'Twin Slash',
    desc: 'Two lightning-fast claw strikes in quick succession.',
    cost: 14, target: 'enemy', power: 0.75, kind: 'physical',
    element: 'slash', tags: ['claw', 'multi'],
    hits: 2
  },
  feint: {
    id: 'feint', name: 'Feint',
    desc: 'Erynn reads her opponent and slips into a defensive crouch, ready to dodge.',
    cost: 10, target: 'self', power: 0, kind: 'buff',
    element: null, tags: ['evasion', 'shadow'],
    buff: { stat: 'spd', amount: 0.3, turns: 3 }
  },
  shadow_step: {
    id: 'shadow_step', name: 'Shadow Step',
    desc: 'Erynn melts into darkness, slipping past an enemy’s guard.',
    cost: 12, target: 'enemy', power: 1.2, kind: 'physical',
    element: 'slash', tags: ['claw', 'shadow'],
    buff: { stat: 'def', amount: -0.2, turns: 2 }
  },
  // Evolution — Phantom Queen
  phantom_blades: {
    id: 'phantom_blades', name: 'Phantom Blades',
    desc: 'Phantom Queen technique. Afterimages of Erynn strike from every side at once.',
    cost: 26, target: 'allEnemies', power: 1.1, kind: 'physical',
    element: 'slash', tags: ['claw', 'shadow', 'aoe', 'evolution'],
    hits: 2, crit: 1.4
  },

  // ─────────────────────────────────────────────────────────
  // BRIMBLE TOADSWORTH — Water tank / heal / guard
  // ─────────────────────────────────────────────────────────
  brimble_slam: {
    id: 'brimble_slam', name: 'Slam',
    desc: 'A heavy body slam powered by strong hind legs.',
    cost: 0, target: 'enemy', power: 1.0, kind: 'physical',
    element: 'blunt', tags: ['basic']
  },
  tidal_shield: {
    id: 'tidal_shield', name: 'Tidal Shield',
    desc: 'A living wall of water rises around the party, absorbing damage and mending wounds. His signature technique.',
    cost: 20, target: 'allAllies', power: 0.5, kind: 'heal',
    element: 'water', tags: ['water', 'shield', 'heal'],
    shield: 0.2
  },
  healing_tide: {
    id: 'healing_tide', name: 'Healing Tide',
    desc: 'Brimble calls forth restorative waters to mend an ally.',
    cost: 14, target: 'ally', power: 1.4, kind: 'heal',
    element: 'water', tags: ['water', 'heal']
  },
  guard_wall: {
    id: 'guard_wall', name: 'Guard Wall',
    desc: 'Brimble plants himself between his allies and harm, raising the party’s defense.',
    cost: 12, target: 'allAllies', power: 0, kind: 'buff',
    element: null, tags: ['water', 'guard'],
    buff: { stat: 'def', amount: 0.25, turns: 3 }
  },
  riptide: {
    id: 'riptide', name: 'Riptide',
    desc: 'A crashing wave sweeps across all enemies.',
    cost: 18, target: 'allEnemies', power: 1.0, kind: 'magic',
    element: 'water', tags: ['water', 'aoe']
  },
  cleansing_wave: {
    id: 'cleansing_wave', name: 'Cleansing Wave',
    desc: 'Pure water washes away ailments and steadies an ally’s spirit.',
    cost: 12, target: 'ally', power: 0.6, kind: 'heal',
    element: 'water', tags: ['water', 'cleanse'],
    cleanse: true
  },
  bog_grasp: {
    id: 'bog_grasp', name: 'Bog Grasp',
    desc: 'Brimble drags an enemy off balance with sudden, powerful legs.',
    cost: 10, target: 'enemy', power: 1.0, kind: 'physical',
    element: 'blunt', tags: ['water'],
    status: { id: 'slow', chance: 0.6, turns: 2 }
  },
  // Evolution — Leviathan Sovereign
  leviathan_call: {
    id: 'leviathan_call', name: 'Leviathan’s Call',
    desc: 'Leviathan Sovereign technique. Brimble summons a titanic water construct to crush his foes.',
    cost: 28, target: 'allEnemies', power: 1.7, kind: 'magic',
    element: 'water', tags: ['water', 'aoe', 'evolution'],
    status: { id: 'slow', chance: 0.5, turns: 2 }
  },

  // ─────────────────────────────────────────────────────────
  // DRAKKOR ASHVEIL — Fire breaker, armor destruction
  // ─────────────────────────────────────────────────────────
  drakkor_cleave: {
    id: 'drakkor_cleave', name: 'Axe Cleave',
    desc: 'A heavy axe swing driven by draconic strength.',
    cost: 0, target: 'enemy', power: 1.0, kind: 'physical',
    element: 'slash', tags: ['axe', 'basic']
  },
  inferno_breath: {
    id: 'inferno_breath', name: 'Inferno Breath',
    desc: 'Drakkor exhales a cone of dragonfire, scorching all who stand before him. His signature technique.',
    cost: 20, target: 'allEnemies', power: 1.3, kind: 'magic',
    element: 'fire', tags: ['fire', 'breath', 'signature', 'aoe'],
    status: { id: 'burn', chance: 0.75, turns: 3 }
  },
  sunder: {
    id: 'sunder', name: 'Sunder',
    desc: 'A crushing overhead blow aimed squarely at an enemy’s armor plating.',
    cost: 16, target: 'enemy', power: 1.3, kind: 'physical',
    element: 'blunt', tags: ['axe', 'armor-break'],
    buff: { stat: 'def', amount: -0.25, turns: 3 }
  },
  tail_sweep: {
    id: 'tail_sweep', name: 'Tail Sweep',
    desc: 'Drakkor’s powerful tail sweeps low, staggering nearby foes.',
    cost: 12, target: 'allEnemies', power: 0.8, kind: 'physical',
    element: 'blunt', tags: ['tail', 'aoe'],
    status: { id: 'slow', chance: 0.4, turns: 2 }
  },
  wyrms_roar: {
    id: 'wyrms_roar', name: 'Wyrm’s Roar',
    desc: 'A bone-shaking roar that hardens Drakkor’s resolve for the fight ahead.',
    cost: 10, target: 'self', power: 0, kind: 'buff',
    element: 'fire', tags: ['fire', 'roar'],
    buff: { stat: 'atk', amount: 0.3, turns: 3 }
  },
  molten_fist: {
    id: 'molten_fist', name: 'Molten Fist',
    desc: 'A searing punch wreathed in dragonfire.',
    cost: 14, target: 'enemy', power: 1.5, kind: 'physical',
    element: 'fire', tags: ['fire', 'melee'],
    status: { id: 'burn', chance: 0.5, turns: 2 }
  },
  // Evolution — Elder Wyrm
  dragons_fury: {
    id: 'dragons_fury', name: 'Dragon’s Fury',
    desc: 'Elder Wyrm technique. Drakkor briefly manifests his true draconic form to unleash devastation.',
    cost: 28, target: 'allEnemies', power: 1.9, kind: 'magic',
    element: 'fire', tags: ['fire', 'aoe', 'evolution'],
    status: { id: 'burn', chance: 0.8, turns: 3 }
  },

  // ─────────────────────────────────────────────────────────
  // PIP — Repair heal/buff/debuff/scan
  // ─────────────────────────────────────────────────────────
  pip_zap: {
    id: 'pip_zap', name: 'Static Zap',
    desc: 'A small discharge of stored volt energy.',
    cost: 0, target: 'enemy', power: 1.0, kind: 'magic',
    element: 'volt', tags: ['volt', 'basic']
  },
  nano_swarm: {
    id: 'nano_swarm', name: 'Nano Swarm',
    desc: 'Pip releases a cloud of repair nanites that mend the whole party over time. Their signature technique.',
    cost: 18, target: 'allAllies', power: 0.8, kind: 'heal',
    element: null, tags: ['repair', 'heal', 'signature'],
    status: { id: 'regen', chance: 1.0, turns: 3 }
  },
  reboot_protocol: {
    id: 'reboot_protocol', name: 'Reboot Protocol',
    desc: 'Pip channels emergency power into a fallen ally, restarting their systems.',
    cost: 30, target: 'koAlly', power: 0.5, kind: 'heal',
    element: null, tags: ['repair', 'revive'],
    revive: 0.5
  },
  scan: {
    id: 'scan', name: 'Scan',
    desc: 'Pip analyzes an enemy, revealing its weaknesses and resistances.',
    cost: 6, target: 'enemy', power: 0, kind: 'utility',
    element: null, tags: ['scan', 'analysis']
  },
  overclock: {
    id: 'overclock', name: 'Overclock',
    desc: 'Pip pushes an ally’s systems past safe limits, boosting their speed.',
    cost: 12, target: 'ally', power: 0, kind: 'buff',
    element: 'volt', tags: ['volt', 'buff'],
    buff: { stat: 'spd', amount: 0.3, turns: 3 }
  },
  malfunction: {
    id: 'malfunction', name: 'Malfunction',
    desc: 'Pip overloads an enemy’s systems, or simply confuses biological targets, lowering their attack.',
    cost: 12, target: 'enemy', power: 0, kind: 'debuff',
    element: 'volt', tags: ['volt', 'debuff'],
    buff: { stat: 'atk', amount: -0.25, turns: 3 }
  },
  shield_matrix: {
    id: 'shield_matrix', name: 'Shield Matrix',
    desc: 'Pip projects a personal energy barrier around an ally.',
    cost: 14, target: 'ally', power: 0, kind: 'buff',
    element: null, tags: ['shield', 'repair'],
    shield: 0.3
  },
  // Evolution — Omega Core
  omega_core: {
    id: 'omega_core', name: 'Omega Core',
    desc: 'Omega Core technique. Pip taps a hidden reserve of power to fully restore and shield the party.',
    cost: 32, target: 'allAllies', power: 1.5, kind: 'heal',
    element: null, tags: ['repair', 'heal', 'shield', 'evolution'],
    shield: 0.25
  },

  // ─────────────────────────────────────────────────────────
  // ENEMY-ONLY SKILLS
  // ─────────────────────────────────────────────────────────
  void_bolt: {
    id: 'void_bolt', name: 'Void Bolt',
    desc: 'A crackling bolt of unmaking hurled from the rift.',
    cost: 0, target: 'enemy', power: 1.1, kind: 'magic',
    element: 'void', tags: ['void', 'enemy']
  },
  corrupt_grasp: {
    id: 'corrupt_grasp', name: 'Corrupt Grasp',
    desc: 'Void-warped claws latch onto a victim, spreading corruption.',
    cost: 0, target: 'enemy', power: 0.9, kind: 'physical',
    element: 'void', tags: ['void', 'enemy'],
    status: { id: 'corrupt', chance: 0.6, turns: 3 }
  },
  tide_crush: {
    id: 'tide_crush', name: 'Tide Crush',
    desc: 'A crushing wave of black water slams into its target.',
    cost: 0, target: 'enemy', power: 1.2, kind: 'physical',
    element: 'water', tags: ['water', 'enemy']
  },
  ember_spit: {
    id: 'ember_spit', name: 'Ember Spit',
    desc: 'A gout of burning cinders spat at a foe.',
    cost: 0, target: 'enemy', power: 1.0, kind: 'magic',
    element: 'fire', tags: ['fire', 'enemy'],
    status: { id: 'burn', chance: 0.5, turns: 2 }
  },
  dark_pulse: {
    id: 'dark_pulse', name: 'Dark Pulse',
    desc: 'An expanding ring of void energy that batters all who stand nearby.',
    cost: 0, target: 'allEnemies', power: 0.9, kind: 'magic',
    element: 'void', tags: ['void', 'enemy', 'aoe']
  },
  void_slash: {
    id: 'void_slash', name: 'Void Slash',
    desc: 'A telegraphed arc of black energy, cleaving the ground itself.',
    cost: 0, target: 'enemy', power: 1.4, kind: 'physical',
    element: 'void', tags: ['void', 'enemy', 'boss']
  },
  annihilation_beam: {
    id: 'annihilation_beam', name: 'Annihilation Beam',
    desc: 'A charged lance of pure void that scours everything in its line.',
    cost: 0, target: 'allEnemies', power: 2.0, kind: 'magic',
    element: 'void', tags: ['void', 'enemy', 'boss', 'ultimate']
  },
  summon_shade: {
    id: 'summon_shade', name: 'Summon Shade',
    desc: 'Tears open a small rift, calling forth lesser voidlings to fight.',
    cost: 0, target: 'self', power: 0, kind: 'utility',
    element: 'void', tags: ['void', 'enemy', 'boss', 'summon'],
    summonId: 'shade'
  },
  summon_drowned: {
    id: 'summon_drowned', name: 'Call the Drowned',
    desc: 'The Matriarch calls the sunken dead up from the silt to fight at her side.',
    cost: 0, target: 'self', power: 0, kind: 'utility',
    element: 'water', tags: ['water', 'enemy', 'boss', 'summon'],
    summonId: 'drowned_one'
  },
  undertow: {
    id: 'undertow', name: 'Undertow',
    desc: 'A telegraphed flood that engulfs the whole arena — Defend or a raised Tidal Shield blunts the tide.',
    cost: 0, target: 'allEnemies', power: 1.8, kind: 'magic',
    element: 'water', tags: ['water', 'enemy', 'boss'],
    telegraph: 2
  }
};
