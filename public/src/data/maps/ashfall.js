// ═══════════════════════════════════════════════════════════════
// ASHFALL DOMINION MAPS — M6 Drakkor homeland region. Chain: gate →
// wastes → hold → caldera (vent puzzle + ember hazard) → throne
// (Ash Tyrant Ignis boss arena). Kept structurally identical to the
// canonical ASHFALL_LEGEND in ../maps.js. Region modules cannot import
// that binding directly because maps.js imports this registry, which
// would create an eager ESM cycle.
// ═══════════════════════════════════════════════════════════════

const ASHFALL_MAP_LEGEND = {
  '#': { tile: 'ashWall', variants: 3, solid: true },
  '.': { tile: 'ash', variants: 4 },
  ',': { tile: 'cinder', variants: 3 },
  'h': { tile: 'ember', variants: 2, hazard: { amount: 8, interval: 900 } },
  'k': { tile: 'emberCooled', variants: 2 },
  'r': { tile: 'slag', variants: 3, solid: true },
  'g': { tile: 'geyser', variants: 2 },
  'n': { tile: 'ventValve', solid: true },
  'b': { tile: 'bannerPost', solid: true },
  'u': { tile: 'ruinedHold', variants: 3, solid: true },
  'm': { tile: 'throneAsh', solid: true }
};

const ASH_ENCOUNTERS = {
  wastes: {
    rate: 0.11, minSteps: 6, backdrop: 'ash',
    groups: [
      ['ember_hound', 'ember_hound'],
      ['magma_beetle'],
      ['ember_hound', 'drake_whelp'],
      ['magma_beetle', 'magma_beetle']
    ]
  },
  caldera: {
    rate: 0.13, minSteps: 6, backdrop: 'ash',
    groups: [
      ['ash_revenant', 'ember_hound'],
      ['magma_beetle'],
      ['ember_hound', 'ember_hound'],
      ['ash_revenant', 'magma_beetle']
    ]
  }
};

function ashMap(definition) {
  return Object.assign({
    region: 'Ashfall Dominion',
    tileset: 'ashfall',
    music: 'ashfall',
    legend: ASHFALL_MAP_LEGEND,
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

// All grids are 30 cols x 22 rows, following the shared convention: a
// central 2-wide north/south corridor (cols 14-15) through solid border
// walls, so maps chain vertically top-to-bottom.
export const ASHFALL_MAPS = {
  // ── Arrival — scorched flatland, safe ──────────────────
  ash_gate: ashMap({
    id: 'ash_gate',
    name: 'The Ashfall Gate',
    spawn: { x: 14, y: 19, dir: 'up' },
    grid: [
      '##############..##############',
      '##############..##############',
      '###........................###',
      '###...b................b...###',
      '###.........,,,,,,.........###',
      '###..,,,,,,,,,,,,,,,,,,,,..###',
      '###..,,,,,,,,,,,,,,,,,,,,..###',
      '###..,,,,,,,gg,,,,,gg,,,,..###',
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
      ambient('ash_amb_sentry', 'guard', 11, 15, 'down', 'Ashfall Sentry',
        'The Gate has held since the mountain first cracked open. Mind the cinder drifts past here.'),
      ambient('ash_amb_wanderer', 'citizen_m', 18, 16, 'left', 'Soot-Streaked Wanderer',
        'Drakkor\'s kin used to patrol this flat. Fewer of them do, these days.')
    ],
    interactions: [],
    exits: [
      {
        id: 'gate_to_wastes',
        cells: [{ x: 14, y: 21 }, { x: 15, y: 21 }],
        to: { map: 'ash_wastes', x: 14, y: 2, dir: 'down' }
      }
    ]
  }),

  // ── Scorched flats — encounter map ─────────────────────
  ash_wastes: ashMap({
    id: 'ash_wastes',
    name: 'The Ashen Wastes',
    spawn: { x: 14, y: 2, dir: 'down' },
    grid: [
      '##############..##############',
      '##############..##############',
      '##############..##############',
      '###........................###',
      '###......gg........gg......###',
      '###,,,,,,,,,,,,,,,,,,,,,,,,###',
      '###...........rr...........###',
      '###...........rr...........###',
      '###......gg........gg......###',
      '###,,,,,,,,,,,,,,,,,,,,,,,,###',
      '###,,,,,,,,,,,,,,,,,,,,,,,,###',
      '###......gg........gg......###',
      '###...........rr...........###',
      '###...........rr...........###',
      '###,,,,,,,,,,,,,,,,,,,,,,,,###',
      '###......gg........gg......###',
      '###,,,,,,,,,,,,,,,,,,,,,,,,###',
      '###,,,,,,,,,,,,,,,,,,,,,,,,###',
      '###........................###',
      '##############..##############',
      '##############..##############',
      '##############..##############'
    ],
    interactions: [],
    exits: [
      {
        id: 'wastes_to_gate',
        cells: [{ x: 14, y: 0 }, { x: 15, y: 0 }],
        to: { map: 'ash_gate', x: 14, y: 19, dir: 'up' }
      },
      {
        id: 'wastes_to_hold',
        cells: [{ x: 14, y: 21 }, { x: 15, y: 21 }],
        to: { map: 'ash_hold', x: 14, y: 2, dir: 'down' }
      }
    ],
    encounters: ASH_ENCOUNTERS.wastes
  }),

  // ── Last Drakonid village — safe ───────────────────────
  ash_hold: ashMap({
    id: 'ash_hold',
    name: 'Ashfall Hold',
    spawn: { x: 14, y: 2, dir: 'down' },
    grid: [
      '##############..##############',
      '##############..##############',
      '##############..##############',
      '###........................###',
      '###..u..................u..###',
      '###........................###',
      '###...bb.....,,.......bb...###',
      '###...bb.....,,.......bb...###',
      '###........................###',
      '###..,.....g.....g......,..###',
      '###........................###',
      '###........................###',
      '###..u.....................###',
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
      ambient('ash_amb_elder', 'citizen_m', 10, 10, 'down', 'Hold Elder',
        'We are what is left of Drakkor\'s people. The mountain took the rest when it woke.'),
      ambient('ash_amb_smith', 'citizen_f', 19, 11, 'left', 'Hold Armorer',
        'Every blade here is quenched in cinder-water. It is the only way steel holds against the Tyrant\'s heat.'),
      ambient('ash_amb_guard', 'guard', 14, 13, 'down', 'Hold Guard',
        'The Caldera path is open, if you\'ve the nerve. The vents down there answer to no one anymore.'),
      {
        id: 'ash_shopkeep', actor: 'citizen_m', x: 8, y: 14, dir: 'right',
        script: { shop: 'ash_goods' }
      },
      {
        id: 'ash_healer', actor: 'citizen_f', x: 20, y: 14, dir: 'left',
        script: { rest: { cost: 20, location: 'Ashfall Hold' } }
      }
    ],
    interactions: [],
    exits: [
      {
        id: 'hold_to_wastes',
        cells: [{ x: 14, y: 0 }, { x: 15, y: 0 }],
        to: { map: 'ash_wastes', x: 14, y: 19, dir: 'up' }
      },
      {
        id: 'hold_to_caldera',
        cells: [{ x: 14, y: 21 }, { x: 15, y: 21 }],
        to: { map: 'ash_caldera', x: 14, y: 2, dir: 'down' }
      }
    ]
  }),

  // ── Vent-puzzle dungeon + Drakkor's fortress-corner room ───────
  // Drakkor's reserved fortress-corner room occupies x=22..26, y=15..18
  // (5 wide x 4 tall, ruinedHold walls with ash floor interior, empty).
  // A single door gap sits at (22,16); a banner post marks the top wall
  // at (24,15) without blocking the doorway.
  ash_caldera: ashMap({
    id: 'ash_caldera',
    name: 'The Ashfall Caldera',
    spawn: { x: 14, y: 2, dir: 'down' },
    grid: [
      '##############..##############',
      '##############..##############',
      '##############..##############',
      '###........................###',
      '###..n..................n..###',
      '###........................###',
      '###......rrrrrrrrrrrr......###',
      '###...h..rrrrrrrrrrrr..h...###',
      '###......rrrrrrrrrrrr......###',
      '###......rrrrrrrrrrrr......###',
      '###...............n........###',
      '###......rrrrrrrrrrrr..h...###',
      '###......rrrrrrrrrrrr......###',
      '###..h...rrrrrrrrrrrr......###',
      '###......rrrrrrrrrrrr......###',
      '###...................uubuu###',
      '###.......................u###',
      '###...................u...u###',
      '###...................uuuuu###',
      '###........................###',
      '##############..##############',
      '##############..##############'
    ],
    interactions: [
      {
        id: 'ash_vent_1',
        x: 5, y: 4,
        script: [
          { if: state => !!state.flags.ash_vent_1, then: [
            { say: { speaker: 'Vent Valve', text: 'The pressure valve is already open. The first vent breathes freely.' } }
          ], else: [
            { say: { speaker: 'Vent Valve', text: 'You heave the scorched valve wheel. Somewhere below, pressure screams free.' } },
            { flag: { key: 'ash_vent_1', value: true } },
            { sfx: 'confirm' },
            { if: state => !!state.flags.ash_vent_2 && !!state.flags.ash_vent_3, then: [
              { setcell: { x: 9, y: 6, ch: 'k' } },
              { setcell: { x: 10, y: 6, ch: 'k' } },
              { setcell: { x: 11, y: 6, ch: 'k' } },
              { setcell: { x: 12, y: 6, ch: 'k' } },
              { setcell: { x: 13, y: 6, ch: 'k' } },
              { setcell: { x: 14, y: 6, ch: 'k' } },
              { flag: { key: 'ash_slag_cleared', value: true } },
              { say: { speaker: 'Vent Valve', text: 'All three vents vent as one. The slag blockage cracks and cools into passable ground.' } },
              { banner: 'The slag blockage has cooled' }
            ] }
          ] }
        ]
      },
      {
        id: 'ash_vent_2',
        x: 24, y: 4,
        script: [
          { if: state => !!state.flags.ash_vent_2, then: [
            { say: { speaker: 'Vent Valve', text: 'The pressure valve is already open. The second vent breathes freely.' } }
          ], else: [
            { say: { speaker: 'Vent Valve', text: 'You heave the scorched valve wheel. Somewhere below, pressure screams free.' } },
            { flag: { key: 'ash_vent_2', value: true } },
            { sfx: 'confirm' },
            { if: state => !!state.flags.ash_vent_1 && !!state.flags.ash_vent_3, then: [
              { setcell: { x: 9, y: 6, ch: 'k' } },
              { setcell: { x: 10, y: 6, ch: 'k' } },
              { setcell: { x: 11, y: 6, ch: 'k' } },
              { setcell: { x: 12, y: 6, ch: 'k' } },
              { setcell: { x: 13, y: 6, ch: 'k' } },
              { setcell: { x: 14, y: 6, ch: 'k' } },
              { flag: { key: 'ash_slag_cleared', value: true } },
              { say: { speaker: 'Vent Valve', text: 'All three vents vent as one. The slag blockage cracks and cools into passable ground.' } },
              { banner: 'The slag blockage has cooled' }
            ] }
          ] }
        ]
      },
      {
        id: 'ash_vent_3',
        x: 18, y: 10,
        script: [
          { if: state => !!state.flags.ash_vent_3, then: [
            { say: { speaker: 'Vent Valve', text: 'The pressure valve is already open. The third vent breathes freely.' } }
          ], else: [
            { say: { speaker: 'Vent Valve', text: 'You heave the scorched valve wheel. Somewhere below, pressure screams free.' } },
            { flag: { key: 'ash_vent_3', value: true } },
            { sfx: 'confirm' },
            { if: state => !!state.flags.ash_vent_1 && !!state.flags.ash_vent_2, then: [
              { setcell: { x: 9, y: 6, ch: 'k' } },
              { setcell: { x: 10, y: 6, ch: 'k' } },
              { setcell: { x: 11, y: 6, ch: 'k' } },
              { setcell: { x: 12, y: 6, ch: 'k' } },
              { setcell: { x: 13, y: 6, ch: 'k' } },
              { setcell: { x: 14, y: 6, ch: 'k' } },
              { flag: { key: 'ash_slag_cleared', value: true } },
              { say: { speaker: 'Vent Valve', text: 'All three vents vent as one. The slag blockage cracks and cools into passable ground.' } },
              { banner: 'The slag blockage has cooled' }
            ] }
          ] }
        ]
      }
    ],
    exits: [
      {
        id: 'caldera_to_hold',
        cells: [{ x: 14, y: 0 }, { x: 15, y: 0 }],
        to: { map: 'ash_hold', x: 14, y: 19, dir: 'up' }
      },
      {
        id: 'caldera_to_throne',
        cells: [{ x: 14, y: 21 }, { x: 15, y: 21 }],
        to: { map: 'ash_throne', x: 14, y: 2, dir: 'down' }
      }
    ],
    encounters: ASH_ENCOUNTERS.caldera
  }),

  // ── Ash Tyrant Ignis arena — safe, scripted boss room ──
  ash_throne: ashMap({
    id: 'ash_throne',
    name: "The Ash Tyrant's Dais",
    spawn: { x: 14, y: 19, dir: 'up' },
    grid: [
      '##############..##############',
      '##############..##############',
      '###........................###',
      '###........................###',
      '###..mmmmmmmmmmmmmmmmmmmm..###',
      '###..mmmmmmmmmmmmmmmmmmmm..###',
      '###..mm................mm..###',
      '###..mm................mm..###',
      '###..mm................mm..###',
      '###..mm................mm..###',
      '###..mm................mm..###',
      '###..mm................mm..###',
      '###..mmmmmmmmmmmmmmmmmmmm..###',
      '###..mmmmmmmmmmmmmmmmmmmm..###',
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
        id: 'throne_to_caldera',
        cells: [{ x: 14, y: 21 }, { x: 15, y: 21 }],
        to: { map: 'ash_caldera', x: 14, y: 19, dir: 'up' }
      }
    ]
  })
};
