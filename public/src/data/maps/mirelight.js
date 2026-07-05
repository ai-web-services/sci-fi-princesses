// ═══════════════════════════════════════════════════════════════
// MIRELIGHT DEEPS MAPS — M5 drowned marsh region. Chain: landing →
// shallows → village → deeps (tide-gate puzzle) → throne (boss arena).
// Kept structurally identical to the canonical MIRELIGHT_LEGEND in
// ../maps.js. Region modules cannot import that binding directly because
// maps.js imports this registry, which would create an eager ESM cycle.
// ═══════════════════════════════════════════════════════════════

const MIRELIGHT_MAP_LEGEND = {
  '#': { tile: 'mireWall', variants: 3, solid: true },
  '.': { tile: 'mud', variants: 4 },
  ',': { tile: 'shallows', variants: 3 },
  '~': { tile: 'deepwater', variants: 2, solid: true },
  'd': { tile: 'deepwater', variants: 2 },
  'r': { tile: 'reed', variants: 3 },
  'l': { tile: 'lilypad', variants: 2 },
  'c': { tile: 'coral', variants: 2, solid: true },
  'b': { tile: 'bridge', variants: 2 },
  'u': { tile: 'ruin', variants: 3, solid: true },
  'v': { tile: 'tideLever', solid: true },
  'm': { tile: 'throneStone', solid: true }
};

const MIRE_ENCOUNTERS = {
  shallows: {
    rate: 0.11, minSteps: 6, backdrop: 'mire',
    groups: [
      ['mire_croaker', 'mire_croaker'],
      ['bog_lurker'],
      ['mire_croaker', 'bog_lurker'],
      ['drowned_one']
    ]
  },
  deeps: {
    rate: 0.13, minSteps: 6, backdrop: 'mire',
    groups: [
      ['drowned_one', 'tide_witch'],
      ['coral_crab'],
      ['bog_lurker', 'void_eel'],
      ['void_eel', 'tide_witch']
    ]
  }
};

function mireMap(definition) {
  return Object.assign({
    region: 'Mirelight Deeps',
    tileset: 'mirelight',
    music: 'mirelight',
    legend: MIRELIGHT_MAP_LEGEND,
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

// All grids are 30 cols x 22 rows, following the stargate convention:
// a central 2-wide north/south corridor (cols 14-15) through solid
// border walls, so maps chain vertically top-to-bottom.
export const MIRELIGHT_MAPS = {
  // ── Arrival — flooded shoreline, safe ──────────────────
  // A small open clearing (no trigger authored here) sits at
  // x=11..18, y=13..17, reserved for a sibling arrival cutscene.
  mire_landing: mireMap({
    id: 'mire_landing',
    name: 'Mirelight Shore',
    spawn: { x: 14, y: 19, dir: 'up' },
    grid: [
      '##############..##############',
      '##############..##############',
      '####......................####',
      '####..r................r..####',
      '####........rr............####',
      '####...,,,,,,,,,,,,,,,,...####',
      '####...,,,,,,,,,,,,,,,,...####',
      '####...,,ll,,,,,,,,ll,,...####',
      '####...,,,,,,,,,,,,,,,,...####',
      '####......................####',
      '####......................####',
      '####......................####',
      '####......................####',
      '####......................####',
      '####......................####',
      '####......................####',
      '####......................####',
      '####......................####',
      '####......................####',
      '##############..##############',
      '##############..##############',
      '##############..##############'
    ],
    npcs: [
      ambient('mire_amb_ferryman', 'citizen_m', 11, 15, 'down', 'Old Ferryman',
        'The Deeps took the coast road years ago. We just learned to wade instead of walk.'),
      ambient('mire_amb_scout', 'citizen_f', 18, 16, 'left', 'Marsh Scout',
        'Keep to the lilypads if the mud looks too dark. Some of it never lets go.')
    ],
    interactions: [],
    exits: [
      {
        id: 'landing_to_shallows',
        cells: [{ x: 14, y: 21 }, { x: 15, y: 21 }],
        to: { map: 'mire_shallows', x: 14, y: 2, dir: 'down' }
      }
    ]
  }),

  // ── Wading through the marsh — encounter map ───────────
  mire_shallows: mireMap({
    id: 'mire_shallows',
    name: 'The Wading Shallows',
    spawn: { x: 14, y: 2, dir: 'down' },
    grid: [
      '##############..##############',
      '##############..##############',
      '##############..##############',
      '###........................###',
      '###..r,,,,,,,,,,,,,,,,,,r..###',
      '###...,,ll,,,,,,,,,,ll,,...###',
      '###...,,,,,,,,rr,,,,,,,,...###',
      '###...,,,,,,,,rr,,,,,,,,...###',
      '###...,,ll,,,,,,,,,,ll,,...###',
      '###...,,,,,,,,,,,,,,,,,,...###',
      '###..r,,,,,,,,,,,,,,,,,,r..###',
      '###...,,,,,,,,,,,,,,,,,,...###',
      '###...,,ll,,,,,,,,,,ll,,...###',
      '###...,,,,,,,,rr,,,,,,,,...###',
      '###...,,,,,,,,rr,,,,,,,,...###',
      '###...,,ll,,,,,,,,,,ll,,...###',
      '###...,,,,,,,,,,,,,,,,,,...###',
      '###..r,,,,,,,,,,,,,,,,,,r..###',
      '###........................###',
      '##############..##############',
      '##############..##############',
      '##############..##############'
    ],
    interactions: [],
    exits: [
      {
        id: 'shallows_to_landing',
        cells: [{ x: 14, y: 0 }, { x: 15, y: 0 }],
        to: { map: 'mire_landing', x: 14, y: 19, dir: 'up' }
      },
      {
        id: 'shallows_to_village',
        cells: [{ x: 14, y: 21 }, { x: 15, y: 21 }],
        to: { map: 'mire_village', x: 14, y: 2, dir: 'down' }
      }
    ],
    encounters: MIRE_ENCOUNTERS.shallows
  }),

  // ── Anura survivor village — safe ──────────────────────
  mire_village: mireMap({
    id: 'mire_village',
    name: 'Mirelight Village',
    spawn: { x: 14, y: 2, dir: 'down' },
    grid: [
      '##############..##############',
      '##############..##############',
      '##############..##############',
      '###........................###',
      '###..u..................u..###',
      '###........................###',
      '###...bb.....rr.......bb...###',
      '###...bb.....rr.......bb...###',
      '###........................###',
      '###..r.....l.....l......r..###',
      '###........................###',
      '###........................###',
      '###..u.....................###',
      '###........................###',
      '###..r.....................###',
      '###........................###',
      '###........................###',
      '###........................###',
      '###........................###',
      '##############..##############',
      '##############..##############',
      '##############..##############'
    ],
    npcs: [
      ambient('mire_amb_refugee1', 'citizen_f', 10, 10, 'down', 'Anura Refugee',
        'We came up from the lower channels when the water turned black. It has not gone down since.'),
      ambient('mire_amb_refugee2', 'citizen_m', 19, 11, 'left', 'Anura Refugee',
        'The tide gates used to keep the deep water out. Someone would need to reach the old levers to fix that now.'),
      ambient('mire_amb_elder', 'guard', 14, 13, 'down', 'Village Elder',
        'The Matriarch was gentle, once. The flood changed her the way it changed everything else here.'),
      {
        id: 'mire_shopkeep', actor: 'citizen_m', x: 8, y: 14, dir: 'right',
        script: { shop: 'mire_goods' }
      },
      {
        id: 'mire_healer', actor: 'citizen_f', x: 20, y: 14, dir: 'left',
        script: { rest: { cost: 20, location: 'Mirelight Village' } }
      }
    ],
    interactions: [],
    exits: [
      {
        id: 'village_to_shallows',
        cells: [{ x: 14, y: 0 }, { x: 15, y: 0 }],
        to: { map: 'mire_shallows', x: 14, y: 19, dir: 'up' }
      },
      {
        id: 'village_to_deeps',
        cells: [{ x: 14, y: 21 }, { x: 15, y: 21 }],
        to: { map: 'mire_deeps', x: 14, y: 2, dir: 'down' }
      }
    ]
  }),

  // ── Tide-gate dungeon — puzzle + Brimble's homestead ───
  // Brimble's drowned homestead room occupies x=3..7, y=15..18
  // (5 wide x 4 tall, ruin walls with mud floor interior, empty).
  mire_deeps: mireMap({
    id: 'mire_deeps',
    name: 'The Tide Gates',
    spawn: { x: 14, y: 2, dir: 'down' },
    grid: [
      '##############..##############',
      '##############..##############',
      '##############..##############',
      '###........................###',
      '###..v..................v..###',
      '###........................###',
      '###......~~~~~~~~~~~~......###',
      '###......~~~~~~~~~~~~......###',
      '###......~~~~~~~~~~~~......###',
      '###......~~~~~~~~~~~~......###',
      '###...............v........###',
      '###......~~~~~~~~~~~~......###',
      '###......~~~~~~~~~~~~......###',
      '###......~~~~~~~~~~~~......###',
      '###......~~~~~~~~~~~~......###',
      '###uuuuu...................###',
      '###u...u...................###',
      '###u...u...................###',
      '###uuuuu...................###',
      '###........................###',
      '##############..##############',
      '##############..##############'
    ],
    interactions: [
      {
        id: 'tide_lever_1',
        x: 5, y: 4,
        script: [
          { if: state => !!state.flags.mire_lever_1, then: [
            { say: { speaker: 'Tide Lever', text: 'The corroded mechanism is already thrown. Channel one is open.' } }
          ], else: [
            { say: { speaker: 'Tide Lever', text: 'You wrench the corroded lever. Somewhere below, a gate shudders.' } },
            { flag: { key: 'mire_lever_1', value: true } },
            { sfx: 'confirm' },
            { if: state => !!state.flags.mire_lever_2 && !!state.flags.mire_lever_3, then: [
              { setcell: { x: 10, y: 6, ch: 'd' } },
              { setcell: { x: 11, y: 6, ch: 'd' } },
              { setcell: { x: 12, y: 6, ch: 'd' } },
              { setcell: { x: 13, y: 6, ch: 'd' } },
              { setcell: { x: 14, y: 6, ch: 'd' } },
              { setcell: { x: 15, y: 6, ch: 'd' } },
              { flag: { key: 'mire_tide_gates_open', value: true } },
              { say: { speaker: 'Tide Lever', text: 'All three channels answer at once. The deep water recedes into a passable channel.' } },
              { banner: 'The tide gates are open' }
            ] }
          ] }
        ]
      },
      {
        id: 'tide_lever_2',
        x: 24, y: 4,
        script: [
          { if: state => !!state.flags.mire_lever_2, then: [
            { say: { speaker: 'Tide Lever', text: 'The corroded mechanism is already thrown. Channel two is open.' } }
          ], else: [
            { say: { speaker: 'Tide Lever', text: 'You wrench the corroded lever. Somewhere below, a gate shudders.' } },
            { flag: { key: 'mire_lever_2', value: true } },
            { sfx: 'confirm' },
            { if: state => !!state.flags.mire_lever_1 && !!state.flags.mire_lever_3, then: [
              { setcell: { x: 10, y: 6, ch: 'd' } },
              { setcell: { x: 11, y: 6, ch: 'd' } },
              { setcell: { x: 12, y: 6, ch: 'd' } },
              { setcell: { x: 13, y: 6, ch: 'd' } },
              { setcell: { x: 14, y: 6, ch: 'd' } },
              { setcell: { x: 15, y: 6, ch: 'd' } },
              { flag: { key: 'mire_tide_gates_open', value: true } },
              { say: { speaker: 'Tide Lever', text: 'All three channels answer at once. The deep water recedes into a passable channel.' } },
              { banner: 'The tide gates are open' }
            ] }
          ] }
        ]
      },
      {
        id: 'tide_lever_3',
        x: 18, y: 10,
        script: [
          { if: state => !!state.flags.mire_lever_3, then: [
            { say: { speaker: 'Tide Lever', text: 'The corroded mechanism is already thrown. Channel three is open.' } }
          ], else: [
            { say: { speaker: 'Tide Lever', text: 'You wrench the corroded lever. Somewhere below, a gate shudders.' } },
            { flag: { key: 'mire_lever_3', value: true } },
            { sfx: 'confirm' },
            { if: state => !!state.flags.mire_lever_1 && !!state.flags.mire_lever_2, then: [
              { setcell: { x: 10, y: 6, ch: 'd' } },
              { setcell: { x: 11, y: 6, ch: 'd' } },
              { setcell: { x: 12, y: 6, ch: 'd' } },
              { setcell: { x: 13, y: 6, ch: 'd' } },
              { setcell: { x: 14, y: 6, ch: 'd' } },
              { setcell: { x: 15, y: 6, ch: 'd' } },
              { flag: { key: 'mire_tide_gates_open', value: true } },
              { say: { speaker: 'Tide Lever', text: 'All three channels answer at once. The deep water recedes into a passable channel.' } },
              { banner: 'The tide gates are open' }
            ] }
          ] }
        ]
      }
    ],
    exits: [
      {
        id: 'deeps_to_village',
        cells: [{ x: 14, y: 0 }, { x: 15, y: 0 }],
        to: { map: 'mire_village', x: 14, y: 19, dir: 'up' }
      },
      {
        id: 'deeps_to_throne',
        cells: [{ x: 14, y: 21 }, { x: 15, y: 21 }],
        to: { map: 'mire_throne', x: 14, y: 2, dir: 'down' }
      }
    ],
    encounters: MIRE_ENCOUNTERS.deeps
  }),

  // ── Drowned Matriarch arena — safe, scripted boss room ─
  mire_throne: mireMap({
    id: 'mire_throne',
    name: "The Matriarch's Hollow",
    spawn: { x: 14, y: 19, dir: 'up' },
    grid: [
      '##############..##############',
      '##############..##############',
      '###........................###',
      '###........................###',
      '###...mmmmmmmmmmmmmmmmmm...###',
      '###...mmmmmmmmmmmmmmmmmm...###',
      '###...mm..............mm...###',
      '###...mm..............mm...###',
      '###...mm..............mm...###',
      '###...mm..............mm...###',
      '###...mm..............mm...###',
      '###...mm..............mm...###',
      '###...mmmmmmmmmmmmmmmmmm...###',
      '###...mmmmmmmmmmmmmmmmmm...###',
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
        id: 'throne_to_deeps',
        cells: [{ x: 14, y: 21 }, { x: 15, y: 21 }],
        to: { map: 'mire_deeps', x: 14, y: 19, dir: 'up' }
      }
    ]
  })
};
