// ═══════════════════════════════════════════════════════════════
// KESSARI REACH MAPS — M7 Felidae desert trade-colony region. Chain:
// docks → bazaar → underway (smuggler tunnels + evidence) → court
// (verdict) → spire (Silk Baroness Vess arena). Kept structurally
// identical to the canonical KESSARI_LEGEND below. Region modules
// cannot import a shared legend from ../maps.js directly (would
// create an eager ESM cycle) — same convention as ashfall.js/
// mirelight.js.
// ═══════════════════════════════════════════════════════════════

const KESSARI_MAP_LEGEND = {
  '#': { tile: 'kessWall', variants: 3, solid: true },
  '.': { tile: 'sand', variants: 4 },
  ',': { tile: 'packedSand', variants: 3 },
  'a': { tile: 'awning', variants: 2 },
  'l': { tile: 'lanternPost', solid: true },
  'c': { tile: 'crate', variants: 2, solid: true },
  'k': { tile: 'stallCounter', solid: true },
  'd': { tile: 'tunnelDirt', variants: 3 },
  'h': { tile: 'tunnelDirt', variants: 3, hazard: { amount: 6, interval: 900 } },
  'w': { tile: 'tunnelRubble', variants: 3, solid: true },
  'm': { tile: 'marbleFloor', variants: 3 },
  'p': { tile: 'courtPillar', solid: true },
  'b': { tile: 'judgeBench', solid: true },
  's': { tile: 'spireStone', variants: 2, solid: true },
  'g': { tile: 'spireGlow', variants: 2 }
};

const KESS_ENCOUNTERS = {
  underway: {
    rate: 0.12, minSteps: 6, backdrop: 'kessari',
    groups: [
      ['gutter_blade', 'gutter_blade'],
      ['dust_stalker', 'smuggler_enforcer'],
      ['void_hound'],
      ['silk_assassin', 'gutter_blade']
    ]
  }
};

function kessMap(definition) {
  return Object.assign({
    region: 'Kessari Reach',
    tileset: 'kessari',
    music: 'kessari',
    legend: KESSARI_MAP_LEGEND,
    npcs: [],
    interactions: [],
    exits: [],
    triggers: []
  }, definition);
}

const ambient = (id, actor, x, y, dir, speaker, text) => ({
  id, actor, x, y, dir,
  script: [{ say: { speaker, text } }]
});

function evidenceAllFound(state) {
  return !!(state.flags.kess_evidence_1 && state.flags.kess_evidence_2 && state.flags.kess_evidence_3);
}

// Structural evidence-find interactions (same convention as ash_caldera's
// vent puzzle): self-contained here, referenced by act2_kessari.js's
// court trigger via the same flags.kess_evidence_N it sets.
function evidenceScript(num, text) {
  return [
    { if: state => !!state.flags['kess_evidence_' + num], then: [
      { say: { speaker: 'Erynn', portrait: 'erynn', text: 'Already been through this one. Nothing new to squeeze out of it.' } }
    ], else: [
      { say: { speaker: 'Erynn', portrait: 'erynn', text } },
      { flag: { key: 'kess_evidence_' + num, value: true } },
      { sfx: 'confirm' },
      { if: state => evidenceAllFound(state), then: [
        { say: {
          speaker: 'Erynn',
          portrait: 'erynn',
          text: 'That is enough. Ledgers, shipment tags, and a manifest with Magistrate Corvin\'s own seal on it. He knows exactly what she moves.'
        } },
        { banner: 'Objective: Present the evidence to the Kessari Court' }
      ] }
    ] }
  ];
}

// All grids are 30 cols x 22 rows, following the shared convention: a
// central 2-wide north/south corridor (cols 14-15) through solid border
// walls, so maps chain vertically top-to-bottom.
export const KESSARI_MAPS = {
  // ── Arrival — sandstone dock plaza, safe ───────────────
  kess_docks: kessMap({
    id: 'kess_docks',
    name: 'Kessari Docks',
    spawn: { x: 14, y: 19, dir: 'up' },
    grid: [
      '##############..##############',
      '##############..##############',
      '###........................###',
      '###...l................l...###',
      '###.........,,,,,,.........###',
      '###..,,,,,,,,,,,,,,,,,,,,..###',
      '###..,,,,,,,,,,,,,,,,,,,,..###',
      '###..,,,,,,,aa,,,,,aa,,,,..###',
      '###..,,,,,,,,,,,,,,,,,,,,..###',
      '###........................###',
      '###........................###',
      '###........................###',
      '###........................###',
      '###........................###',
      '###........................###',
      '###........................###',
      '###........................###',
      '###........................###',
      '###........................###',
      '##############..##############',
      '##############..##############',
      '##############..##############'
    ],
    npcs: [
      ambient('kess_amb_dock', 'citizen_m', 11, 15, 'down', 'Dockhand',
        'Mind the crates. Half of what comes through here is not what the manifest says it is.'),
      ambient('kess_amb_guard', 'guard', 18, 16, 'left', 'Bazaar Watch',
        'Kessari keeps its own law. The court settles what the street can\'t.')
    ],
    interactions: [],
    exits: [
      {
        id: 'docks_to_bazaar',
        cells: [{ x: 14, y: 21 }, { x: 15, y: 21 }],
        to: { map: 'kess_bazaar', x: 14, y: 2, dir: 'down' }
      }
    ]
  }),

  // ── The Gilded Souk — trade hub, safe ──────────────────
  kess_bazaar: kessMap({
    id: 'kess_bazaar',
    name: 'The Gilded Souk',
    spawn: { x: 14, y: 2, dir: 'down' },
    grid: [
      '##############..##############',
      '##############..##############',
      '##############..##############',
      '###........................###',
      '###..c..................c..###',
      '###........................###',
      '###...kk.....,,.......kk...###',
      '###...kk.....,,.......kk...###',
      '###........................###',
      '###..,.....a.....a......,..###',
      '###........................###',
      '###........................###',
      '###..c.....................###',
      '###........................###',
      '###..,.....................###',
      '###........................###',
      '###........................###',
      '###........................###',
      '###........................###',
      '##############..##############',
      '##############..##############',
      '##############..##############'
    ],
    npcs: [
      ambient('kess_amb_broker', 'citizen_m', 10, 10, 'down', 'Trade Broker',
        'Baroness Vess keeps the tariffs low and the questions lower. Everyone here knows why.'),
      ambient('kess_amb_trader', 'citizen_f', 19, 11, 'left', 'Silk Trader',
        'Erynn Vexx? I remember that name. Not fondly, and not from her side of it.'),
      ambient('kess_amb_watch', 'guard', 14, 13, 'down', 'Souk Watch',
        'The Underway runs beneath half this bazaar. Officially, it does not exist.'),
      {
        id: 'kess_shopkeep', actor: 'citizen_m', x: 8, y: 14, dir: 'right',
        script: { shop: 'kess_bazaar' }
      },
      {
        id: 'kess_healer', actor: 'citizen_f', x: 20, y: 14, dir: 'left',
        script: { rest: { cost: 25, location: 'The Gilded Souk' } }
      }
    ],
    interactions: [],
    exits: [
      {
        id: 'bazaar_to_docks',
        cells: [{ x: 14, y: 0 }, { x: 15, y: 0 }],
        to: { map: 'kess_docks', x: 14, y: 19, dir: 'up' }
      },
      {
        id: 'bazaar_to_underway',
        cells: [{ x: 14, y: 21 }, { x: 15, y: 21 }],
        to: { map: 'kess_underway', x: 14, y: 2, dir: 'down' }
      }
    ]
  }),

  // ── Smuggler tunnels — dungeon, encounters + evidence ──
  kess_underway: kessMap({
    id: 'kess_underway',
    name: 'The Underway',
    spawn: { x: 14, y: 2, dir: 'down' },
    grid: [
      '##############..##############',
      '##############..##############',
      '##############..##############',
      '###dddddddddddddddddddddddd###',
      '###ddcddddddddddddddddddcdd###',
      '###dddddddddddddddddddddddd###',
      '###ddddddwwwwwwwwwwwwdddddd###',
      '###dddhddwwwwwwwwwwwwddhddd###',
      '###ddddddwwwwwwwwwwwwdddddd###',
      '###ddddddwwwwwwwwwwwwdddddd###',
      '###dddddddddddddddcdddddddd###',
      '###ddddddwwwwwwwwwwwwdddhdd###',
      '###ddddddwwwwwwwwwwwwdddddd###',
      '###ddhdddwwwwwwwwwwwwdddddd###',
      '###ddddddwwwwwwwwwwwwdddddd###',
      '###dddddddddddddddddddddddd###',
      '###dddddddddddddddddddddddd###',
      '###dddddddddddddddddddddddd###',
      '###dddddddddddddddddddddddd###',
      '##############..##############',
      '##############..##############',
      '##############..##############'
    ],
    interactions: [
      {
        id: 'kess_evidence_1', x: 6, y: 4,
        script: evidenceScript(1, 'A ledger, half-burned but legible. Shipment weights that don\'t match anything a silk trader should be moving.')
      },
      {
        id: 'kess_evidence_2', x: 23, y: 4,
        script: evidenceScript(2, 'Crate tags stamped for "textiles" stacked beside a crate that hums faintly, wrong, the way Void-touched things always do.')
      },
      {
        id: 'kess_evidence_3', x: 17, y: 10,
        script: evidenceScript(3, 'A manifest with an official Kessari court seal pressed into the wax. Someone in power signed off on every shipment.')
      }
    ],
    exits: [
      {
        id: 'underway_to_bazaar',
        cells: [{ x: 14, y: 0 }, { x: 15, y: 0 }],
        to: { map: 'kess_bazaar', x: 14, y: 19, dir: 'up' }
      },
      {
        id: 'underway_to_court',
        cells: [{ x: 14, y: 21 }, { x: 15, y: 21 }],
        to: { map: 'kess_court', x: 14, y: 2, dir: 'down' }
      }
    ],
    encounters: KESS_ENCOUNTERS.underway
  }),

  // ── Felidae law court — safe, verdict scene ────────────
  kess_court: kessMap({
    id: 'kess_court',
    name: 'The Kessari Court',
    spawn: { x: 14, y: 2, dir: 'down' },
    grid: [
      '##############mm##############',
      '##############mm##############',
      '###mmmmmmmmmmmmmmmmmmmmmmmm###',
      '###mmmmpmmmmmmmmmmmmmmpmmmm###',
      '###mmmmmmmmmmmmmmmmmmmmmmmm###',
      '###mmmmmmmmmmmmmmmmmmmmmmmm###',
      '###mmmmpmmmmmmmmmmmmmmpmmmm###',
      '###mmmmmmmmmmmmmmmmmmmmmmmm###',
      '###mmmmmmmmmbbmmmmmmmmmmmmm###',
      '###mmmmmmmmmbbmmmmmmmmmmmmm###',
      '###mmmmmmmmmmmmmmmmmmmmmmmm###',
      '###mmmmpmmmmmmmmmmmmmmpmmmm###',
      '###mmmmmmmmmmmmmmmmmmmmmmmm###',
      '###mmmmmmmmmmmmmmmmmmmmmmmm###',
      '###mmmmpmmmmmmmmmmmmmmpmmmm###',
      '###mmmmmmmmmmmmmmmmmmmmmmmm###',
      '###mmmmmmmmmmmmmmmmmmmmmmmm###',
      '###mmmmmmmmmmmmmmmmmmmmmmmm###',
      '###mmmmmmmmmmmmmmmmmmmmmmmm###',
      '###mmmmmmmmmmmmmmmmmmmmmmmm###',
      '##############mm##############',
      '##############mm##############'
    ],
    interactions: [],
    exits: [
      {
        id: 'court_to_underway',
        cells: [{ x: 14, y: 0 }, { x: 15, y: 0 }],
        to: { map: 'kess_underway', x: 14, y: 19, dir: 'up' }
      },
      {
        id: 'court_to_spire',
        cells: [{ x: 14, y: 21 }, { x: 15, y: 21 }],
        to: { map: 'kess_spire', x: 14, y: 2, dir: 'down' }
      }
    ]
  }),

  // ── Silk Baroness Vess's spire — safe, scripted boss room ──
  kess_spire: kessMap({
    id: 'kess_spire',
    name: "Vess's Spire",
    spawn: { x: 14, y: 19, dir: 'up' },
    grid: [
      '##############..##############',
      '##############..##############',
      '###........................###',
      '###........................###',
      '###..ssssssssssssssssssss..###',
      '###..ssssssssssssssssssss..###',
      '###..ss................ss..###',
      '###..ss.......gg.......ss..###',
      '###..ss.......gg.......ss..###',
      '###..ss................ss..###',
      '###..ss................ss..###',
      '###..ss................ss..###',
      '###..ssssssssssssssssssss..###',
      '###..ssssssssssssssssssss..###',
      '###........................###',
      '###........................###',
      '###........................###',
      '###........................###',
      '##############..##############',
      '##############..##############',
      '##############..##############',
      '##############..##############'
    ],
    interactions: [],
    exits: [
      {
        id: 'spire_to_court',
        cells: [{ x: 14, y: 21 }, { x: 15, y: 21 }],
        to: { map: 'kess_court', x: 14, y: 19, dir: 'up' }
      }
    ]
  })
};
