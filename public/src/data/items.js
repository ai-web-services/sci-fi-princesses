// ═══════════════════════════════════════════════════════════════
// ITEMS — Consumables, materials, weapons, armor, and accessories
// (PRD §11.3-11.4 Itemization; GAME_DESIGN_DOC Itemization System).
// Schema:
// {
//   id, name, desc, type: 'consumable'|'material'|'weapon'|'armor'|'accessory',
//   price, sell,
//   usableBy?: [characterId, ...],   // weapons only; omitted = anyone
//   slot?: 'weapon'|'armor'|'accessory',
//   stats?: { atk?, mag?, def?, res?, spd?, hp?, sp?, crit? },
//   effect?: { heal?, healFrac?, sp?, revive?, cure?, escape? },
//   passive?: { spRegen?, critBonus?, elementResist?: {fire:0.5}, thorns?, evade? },
//   rarity: 'common'|'uncommon'|'rare'|'epic'|'legendary' (transcended gear becomes a Crown Relic),
//   tier: 1|2|3
// }
// ═══════════════════════════════════════════════════════════════

export const ITEMS = {

  // ─────────────────────────────────────────────────────────
  // CONSUMABLES
  // ─────────────────────────────────────────────────────────
  potion: {
    id: 'potion', name: 'Potion', desc: 'A fizzing restorative tonic. Heals a modest amount of HP.',
    type: 'consumable', price: 30, sell: 12,
    effect: { heal: 60 },
    rarity: 'common', tier: 1
  },
  hi_potion: {
    id: 'hi_potion', name: 'Hi-Potion', desc: 'A concentrated restorative tonic. Heals a large amount of HP.',
    type: 'consumable', price: 110, sell: 44,
    effect: { heal: 200 },
    rarity: 'uncommon', tier: 2
  },
  sp_tonic: {
    id: 'sp_tonic', name: 'SP Tonic', desc: 'A mild stimulant that restores skill energy.',
    type: 'consumable', price: 35, sell: 14,
    effect: { sp: 40 },
    rarity: 'common', tier: 1
  },
  sp_elixir: {
    id: 'sp_elixir', name: 'SP Elixir', desc: 'A refined stimulant that restores a large reserve of skill energy.',
    type: 'consumable', price: 120, sell: 48,
    effect: { sp: 120 },
    rarity: 'uncommon', tier: 2
  },
  revive_spark: {
    id: 'revive_spark', name: 'Revive Spark', desc: 'A crackling charge that jolts a fallen ally back into the fight.',
    type: 'consumable', price: 150, sell: 60,
    effect: { revive: 0.5 },
    rarity: 'rare', tier: 2
  },
  antidote: {
    id: 'antidote', name: 'Antidote', desc: 'A bitter draught that neutralizes poison.',
    type: 'consumable', price: 25, sell: 10,
    effect: { cure: 'poison' },
    rarity: 'common', tier: 1
  },
  clarity_herb: {
    id: 'clarity_herb', name: 'Clarity Herb', desc: 'A pungent herb that clears blinded eyes.',
    type: 'consumable', price: 25, sell: 10,
    effect: { cure: 'blind' },
    rarity: 'common', tier: 1
  },
  smoke_bomb: {
    id: 'smoke_bomb', name: 'Smoke Bomb', desc: 'Bursts into a thick cloud, guaranteeing an escape from battle.',
    type: 'consumable', price: 40, sell: 16,
    effect: { escape: true },
    rarity: 'common', tier: 1
  },
  star_biscuit: {
    id: 'star_biscuit', name: 'Star Biscuit', desc: 'A rare confection baked with stellar honey. Fully restores one ally.',
    type: 'consumable', price: 500, sell: 200,
    effect: { healFrac: 1.0 },
    rarity: 'epic', tier: 3
  },

  // ─────────────────────────────────────────────────────────
  // MATERIALS
  // ─────────────────────────────────────────────────────────
  scrap_metal: {
    id: 'scrap_metal', name: 'Scrap Metal', desc: 'Common salvage used to upgrade weapons.',
    type: 'material', price: 10, sell: 4,
    rarity: 'common', tier: 1
  },
  bio_gel: {
    id: 'bio_gel', name: 'Bio Gel', desc: 'Common organic compound used to reinforce armor.',
    type: 'material', price: 10, sell: 4,
    rarity: 'common', tier: 1
  },
  void_essence: {
    id: 'void_essence', name: 'Void Essence', desc: 'Unstable rift residue that can add dark damage to equipment.',
    type: 'material', price: 45, sell: 18,
    rarity: 'uncommon', tier: 2
  },
  stellar_crystal: {
    id: 'stellar_crystal', name: 'Stellar Crystal', desc: 'A shard of crystallized starlight, prized for adding light damage.',
    type: 'material', price: 90, sell: 36,
    rarity: 'rare', tier: 2
  },
  dragon_scale: {
    id: 'dragon_scale', name: 'Dragon Scale', desc: 'A tough, heat-resistant scale from an Ashfall drake.',
    type: 'material', price: 95, sell: 38,
    rarity: 'rare', tier: 2
  },
  celestial_shard: {
    id: 'celestial_shard', name: 'Celestial Shard', desc: 'A fragment of the Celestial Crown itself. Required for transcendence upgrades.',
    type: 'material', price: 400, sell: 160,
    rarity: 'epic', tier: 3
  },
  mire_pearl: {
    id: 'mire_pearl', name: 'Mire Pearl', desc: 'A lustrous pearl formed in the corrupted waters of Mirelight.',
    type: 'material', price: 55, sell: 22,
    rarity: 'uncommon', tier: 2
  },
  ash_ingot: {
    id: 'ash_ingot', name: 'Ash Ingot', desc: 'Metal tempered in the Ashfall wastes, dense and heat-hardened.',
    type: 'material', price: 50, sell: 20,
    rarity: 'uncommon', tier: 2
  },
  silk_thread: {
    id: 'silk_thread', name: 'Silk Thread', desc: 'Unnaturally strong thread unraveled from a smuggler-baroness\'s veil.',
    type: 'material', price: 60, sell: 24,
    rarity: 'uncommon', tier: 2
  },

  // ─────────────────────────────────────────────────────────
  // WEAPONS — Lyra (blades)
  // ─────────────────────────────────────────────────────────
  starlight_saber: {
    id: 'starlight_saber', name: 'Starlight Saber', desc: 'A basic stellar-forged blade, standard issue for Crown guardians.',
    type: 'weapon', price: 120, sell: 48,
    usableBy: ['lyra'], slot: 'weapon',
    stats: { atk: 8 },
    rarity: 'common', tier: 1
  },
  stellar_lance: {
    id: 'stellar_lance', name: 'Stellar Lance', desc: 'A collapsible Crown-guard lance tuned for committed piercing thrusts.',
    type: 'weapon', price: 140, sell: 56,
    usableBy: ['lyra'], slot: 'weapon', actionFamily: 'lance',
    stats: { atk: 7, def: 2 },
    rarity: 'common', tier: 1
  },
  crown_wand: {
    id: 'crown_wand', name: 'Crown Wand', desc: 'A royal stellar focus that shapes Crown energy into ranged bolts.',
    type: 'weapon', price: 140, sell: 56,
    usableBy: ['lyra'], slot: 'weapon', actionFamily: 'wand',
    stats: { mag: 8, sp: 4 },
    rarity: 'common', tier: 1
  },
  astral_edge: {
    id: 'astral_edge', name: 'Astral Edge', desc: 'A resonant blade that hums faintly with captured starlight.',
    type: 'weapon', price: 450, sell: 180,
    usableBy: ['lyra'], slot: 'weapon',
    stats: { atk: 20, mag: 6 },
    rarity: 'rare', tier: 2
  },
  crownlight_blade: {
    id: 'crownlight_blade', name: 'Crownlight Blade', desc: 'A legendary sword reforged from Crown shard fragments, radiant with royal authority.',
    type: 'weapon', price: 1400, sell: 560,
    usableBy: ['lyra'], slot: 'weapon',
    stats: { atk: 38, mag: 14, crit: 0.05 },
    rarity: 'legendary', tier: 3
  },

  // ─────────────────────────────────────────────────────────
  // WEAPONS — Erynn (claws)
  // ─────────────────────────────────────────────────────────
  duskfang_claws: {
    id: 'duskfang_claws', name: 'Duskfang Claws', desc: 'Simple retractable claw sheaths favored by scouts.',
    type: 'weapon', price: 120, sell: 48,
    usableBy: ['erynn'], slot: 'weapon',
    stats: { atk: 9 },
    rarity: 'common', tier: 1
  },
  shadowlace_talons: {
    id: 'shadowlace_talons', name: 'Shadowlace Talons', desc: 'Claws woven with shadow-thread, quicker and sharper than steel.',
    type: 'weapon', price: 450, sell: 180,
    usableBy: ['erynn'], slot: 'weapon',
    stats: { atk: 22, spd: 4 },
    rarity: 'rare', tier: 2
  },
  phantom_rakes: {
    id: 'phantom_rakes', name: 'Phantom Rakes', desc: 'Claws that seem to strike a half-second before Erynn moves.',
    type: 'weapon', price: 1400, sell: 560,
    usableBy: ['erynn'], slot: 'weapon',
    stats: { atk: 40, spd: 8, crit: 0.08 },
    rarity: 'epic', tier: 3
  },

  // ─────────────────────────────────────────────────────────
  // WEAPONS — Brimble (staves)
  // ─────────────────────────────────────────────────────────
  tidewood_staff: {
    id: 'tidewood_staff', name: 'Tidewood Staff', desc: 'A simple staff carved from waterlogged bog-wood.',
    type: 'weapon', price: 120, sell: 48,
    usableBy: ['brimble'], slot: 'weapon',
    stats: { mag: 8 },
    rarity: 'common', tier: 1
  },
  coralheart_rod: {
    id: 'coralheart_rod', name: 'Coralheart Rod', desc: 'A rod crowned with living coral that pulses with restorative energy.',
    type: 'weapon', price: 450, sell: 180,
    usableBy: ['brimble'], slot: 'weapon',
    stats: { mag: 20, res: 6 },
    rarity: 'rare', tier: 2
  },
  leviathan_crest: {
    id: 'leviathan_crest', name: 'Leviathan Crest', desc: 'A rod set with a fragment of an ancient sea-titan\'s crest.',
    type: 'weapon', price: 1400, sell: 560,
    usableBy: ['brimble'], slot: 'weapon',
    stats: { mag: 38, res: 14, hp: 20 },
    rarity: 'epic', tier: 3
  },

  // ─────────────────────────────────────────────────────────
  // WEAPONS — Drakkor (axes)
  // ─────────────────────────────────────────────────────────
  ashfall_cleaver: {
    id: 'ashfall_cleaver', name: 'Ashfall Cleaver', desc: 'A crude but heavy axe favored by Ashfall clans.',
    type: 'weapon', price: 120, sell: 48,
    usableBy: ['drakkor'], slot: 'weapon',
    stats: { atk: 10 },
    rarity: 'common', tier: 1
  },
  emberbrand_axe: {
    id: 'emberbrand_axe', name: 'Emberbrand Axe', desc: 'An axe whose edge is perpetually wreathed in low flame.',
    type: 'weapon', price: 450, sell: 180,
    usableBy: ['drakkor'], slot: 'weapon',
    stats: { atk: 24, mag: 4 },
    rarity: 'rare', tier: 2
  },
  wyrmfury_maul: {
    id: 'wyrmfury_maul', name: 'Wyrmfury Maul', desc: 'A massive maul said to have been swung by an elder wyrm in mortal form.',
    type: 'weapon', price: 1400, sell: 560,
    usableBy: ['drakkor'], slot: 'weapon',
    stats: { atk: 44, def: 6 },
    rarity: 'epic', tier: 3
  },

  // ─────────────────────────────────────────────────────────
  // WEAPONS — Pip (modules)
  // ─────────────────────────────────────────────────────────
  spark_module: {
    id: 'spark_module', name: 'Spark Module', desc: 'A basic volt-discharge module for Pip\'s chassis.',
    type: 'weapon', price: 120, sell: 48,
    usableBy: ['pip'], slot: 'weapon',
    stats: { mag: 9 },
    rarity: 'common', tier: 1
  },
  pulse_array: {
    id: 'pulse_array', name: 'Pulse Array', desc: 'An upgraded array that channels sharper, more focused volt pulses.',
    type: 'weapon', price: 450, sell: 180,
    usableBy: ['pip'], slot: 'weapon',
    stats: { mag: 21, spd: 4 },
    rarity: 'rare', tier: 2
  },
  omega_lens: {
    id: 'omega_lens', name: 'Omega Lens', desc: 'An experimental lens that taps into Pip\'s deepest, unexplained reserves of power.',
    type: 'weapon', price: 1400, sell: 560,
    usableBy: ['pip'], slot: 'weapon',
    stats: { mag: 40, sp: 20, spd: 6 },
    rarity: 'epic', tier: 3
  },

  // ─────────────────────────────────────────────────────────
  // ARMOR — Light
  // ─────────────────────────────────────────────────────────
  traveler_weave: {
    id: 'traveler_weave', name: 'Traveler\'s Weave', desc: 'A light cloth garment favored by scouts and travelers.',
    type: 'armor', price: 100, sell: 40,
    slot: 'armor',
    stats: { def: 4, res: 4, spd: 1 },
    rarity: 'common', tier: 1
  },
  scoutmesh: {
    id: 'scoutmesh', name: 'Scoutmesh', desc: 'A flexible mesh weave reinforced with hidden plating.',
    type: 'armor', price: 380, sell: 152,
    slot: 'armor',
    stats: { def: 12, res: 10, spd: 3 },
    rarity: 'rare', tier: 2
  },
  starsilk_garb: {
    id: 'starsilk_garb', name: 'Starsilk Garb', desc: 'A garment woven from thread spun with captured starlight.',
    type: 'armor', price: 1200, sell: 480,
    slot: 'armor',
    stats: { def: 22, res: 20, spd: 6 },
    rarity: 'epic', tier: 3
  },

  // ─────────────────────────────────────────────────────────
  // ARMOR — Medium
  // ─────────────────────────────────────────────────────────
  guard_plate: {
    id: 'guard_plate', name: 'Guard Plate', desc: 'Standard-issue plating for Nova Prime militia.',
    type: 'armor', price: 130, sell: 52,
    slot: 'armor',
    stats: { def: 8, res: 5, hp: 10 },
    rarity: 'common', tier: 1
  },
  sovereign_mail: {
    id: 'sovereign_mail', name: 'Sovereign Mail', desc: 'Ornate mail once worn by Stellar Sovereignty officers.',
    type: 'armor', price: 480, sell: 192,
    slot: 'armor',
    stats: { def: 18, res: 12, hp: 30 },
    rarity: 'rare', tier: 2
  },
  astral_aegis: {
    id: 'astral_aegis', name: 'Astral Aegis', desc: 'Mail interwoven with stellar crystal thread, near-impervious to void corruption.',
    type: 'armor', price: 1500, sell: 600,
    slot: 'armor',
    stats: { def: 32, res: 24, hp: 60 },
    rarity: 'epic', tier: 3
  },

  // ─────────────────────────────────────────────────────────
  // ARMOR — Heavy
  // ─────────────────────────────────────────────────────────
  bulwark_shell: {
    id: 'bulwark_shell', name: 'Bulwark Shell', desc: 'A thick, unwieldy plate shell built for pure protection.',
    type: 'armor', price: 150, sell: 60,
    slot: 'armor',
    stats: { def: 14, res: 4, hp: 20, spd: -1 },
    rarity: 'common', tier: 1
  },
  dragonhide_plate: {
    id: 'dragonhide_plate', name: 'Dragonhide Plate', desc: 'Heavy plating reinforced with cured drake hide.',
    type: 'armor', price: 520, sell: 208,
    slot: 'armor',
    stats: { def: 28, res: 10, hp: 45, spd: -1 },
    rarity: 'rare', tier: 2
  },
  titan_carapace: {
    id: 'titan_carapace', name: 'Titan Carapace', desc: 'A monumental suit of armor forged to withstand a dragon\'s full fury.',
    type: 'armor', price: 1600, sell: 640,
    slot: 'armor',
    stats: { def: 46, res: 18, hp: 90, spd: -2 },
    rarity: 'epic', tier: 3
  },

  // ─────────────────────────────────────────────────────────
  // ACCESSORIES
  // ─────────────────────────────────────────────────────────
  swift_anklet: {
    id: 'swift_anklet', name: 'Swift Anklet', desc: 'A light anklet that lightens every step.',
    type: 'accessory', price: 200, sell: 80,
    slot: 'accessory',
    stats: { spd: 5 },
    rarity: 'uncommon', tier: 2
  },
  crit_earring: {
    id: 'crit_earring', name: 'Crit Earring', desc: 'An earring said to sharpen the wearer\'s killer instinct.',
    type: 'accessory', price: 220, sell: 88,
    slot: 'accessory',
    stats: { crit: 0.08 },
    rarity: 'uncommon', tier: 2
  },
  sp_regen_ring: {
    id: 'sp_regen_ring', name: 'SP Regen Ring', desc: 'A ring etched with runes that slowly replenish skill energy.',
    type: 'accessory', price: 260, sell: 104,
    slot: 'accessory',
    passive: { spRegen: 0.05 },
    rarity: 'uncommon', tier: 2
  },
  flame_band: {
    id: 'flame_band', name: 'Flame Band', desc: 'A band warm to the touch, granting resistance to fire.',
    type: 'accessory', price: 240, sell: 96,
    slot: 'accessory',
    passive: { elementResist: { fire: 0.5 } },
    rarity: 'uncommon', tier: 2
  },
  tide_band: {
    id: 'tide_band', name: 'Tide Band', desc: 'A cool band that never quite dries, granting resistance to water.',
    type: 'accessory', price: 240, sell: 96,
    slot: 'accessory',
    passive: { elementResist: { water: 0.5 } },
    rarity: 'uncommon', tier: 2
  },
  void_band: {
    id: 'void_band', name: 'Void Band', desc: 'A band that dampens whispers from beyond the rift, granting resistance to void.',
    type: 'accessory', price: 260, sell: 104,
    slot: 'accessory',
    passive: { elementResist: { void: 0.5 } },
    rarity: 'uncommon', tier: 2
  },
  thorn_pendant: {
    id: 'thorn_pendant', name: 'Thorn Pendant', desc: 'A jagged pendant that returns a portion of harm dealt to its wearer.',
    type: 'accessory', price: 280, sell: 112,
    slot: 'accessory',
    passive: { thorns: 0.15 },
    rarity: 'rare', tier: 2
  },
  evade_charm: {
    id: 'evade_charm', name: 'Evade Charm', desc: 'A charm that seems to nudge incoming attacks just wide of their mark.',
    type: 'accessory', price: 260, sell: 104,
    slot: 'accessory',
    passive: { evade: 0.08 },
    rarity: 'rare', tier: 2
  },
  vitality_locket: {
    id: 'vitality_locket', name: 'Vitality Locket', desc: 'A locket that hums with steady, restorative life-force.',
    type: 'accessory', price: 240, sell: 96,
    slot: 'accessory',
    stats: { hp: 40 },
    rarity: 'uncommon', tier: 2
  },
  focus_circlet: {
    id: 'focus_circlet', name: 'Focus Circlet', desc: 'A circlet that sharpens magical focus and clarity of mind.',
    type: 'accessory', price: 240, sell: 96,
    slot: 'accessory',
    stats: { mag: 10 },
    rarity: 'uncommon', tier: 2
  }
};
