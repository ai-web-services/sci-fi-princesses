// ═══════════════════════════════════════════════════════════════
// SHATTERED STARGATE MAPS — Act 1 dungeon. The route teaches the
// barrier/console language in a safe approach, varies it across two
// halls, provides a checkpoint in the depths, then opens into Kael's
// gate-heart arena.
// ═══════════════════════════════════════════════════════════════

// Kept structurally identical to the canonical STARGATE_LEGEND in
// ../maps.js. Region modules cannot import that binding directly because
// maps.js imports this registry, which would create an eager ESM cycle.
const STARGATE_MAP_LEGEND = {
  '#': { tile: 'wall', variants: 3, solid: true },
  '.': { tile: 'floor', variants: 4 },
  'o': { tile: 'voidpit', variants: 3, solid: true },
  'c': { tile: 'crystal', variants: 3, solid: true },
  'd': { tile: 'debris', variants: 3 },
  'b': { tile: 'bridge', variants: 2 },
  'C': { tile: 'console', solid: true },
  'P': { tile: 'pedestal', solid: true },
  '|': { tile: 'barrier', variants: 2, solid: true },
  'R': { tile: 'ringChunk', solid: true }
};

const STARGATE_ENCOUNTERS = {
  approach: {
    rate: 0.08, minSteps: 7, backdrop: 'stargate',
    groups: [
      ['voidling', 'voidling'],
      ['gate_wisp'],
      ['voidling', 'gate_wisp']
    ]
  },
  halls: {
    rate: 0.11, minSteps: 6, backdrop: 'stargate',
    groups: [
      ['voidling', 'shade'],
      ['corrupted_sentry'],
      ['gate_wisp', 'gate_wisp'],
      ['voidling', 'voidling', 'shade']
    ]
  },
  depths: {
    rate: 0.13, minSteps: 6, backdrop: 'stargate',
    groups: [
      ['corrupted_sentry', 'gate_wisp'],
      ['void_maw'],
      ['shade', 'shade', 'gate_wisp'],
      ['shard_golem']
    ]
  }
};

function gateMap(definition) {
  return Object.assign({
    region: 'Shattered Stargate',
    tileset: 'stargate',
    music: 'nova',
    legend: STARGATE_MAP_LEGEND,
    npcs: [],
    interactions: [],
    exits: [],
    triggers: []
  }, definition);
}

export const STARGATE_MAPS = {
  gate_approach: gateMap({
    id: 'gate_approach',
    name: 'Fractured Causeway',
    spawn: { x: 14, y: 19, dir: 'up' },
    grid: [
      '##############..##############',
      '##############..##############',
      '####......................####',
      '####..c.................c.####',
      '####........dd............####',
      '####.....oooo....oooo.....####',
      '####.....oooo....oooo.....####',
      '####.....oooo....oooo.....####',
      '####.....oooobbbboooo.....####',
      '####.........bbbb.........####',
      '####.........bbbb.........####',
      '####.....oooobbbboooo.....####',
      '####.....oooo....oooo.....####',
      '####.....oooo....oooo.....####',
      '####.....oooo....oooo.....####',
      '####..d.................d.####',
      '####..............c.......####',
      '####......................####',
      '##############..##############',
      '##############..##############',
      '##############..##############',
      '##############..##############'
    ],
    interactions: [
      {
        id: 'approach_warning_console',
        x: 22, y: 16,
        script: [
          { say: { speaker: 'Gate Survey Console', text: 'Transit lattice unstable. Manual barrier controls remain responsive deeper inside.' } }
        ]
      }
    ],
    exits: [
      {
        id: 'approach_to_shattered',
        cells: [{ x: 14, y: 21 }, { x: 15, y: 21 }],
        to: { map: 'shattered_gate', x: 14, y: 18, dir: 'up' }
      },
      {
        id: 'approach_to_west_hall',
        cells: [{ x: 14, y: 0 }, { x: 15, y: 0 }],
        to: { map: 'gate_hall_west', x: 14, y: 19, dir: 'up' }
      }
    ],
    encounters: STARGATE_ENCOUNTERS.approach
  }),

  gate_hall_west: gateMap({
    id: 'gate_hall_west',
    name: 'West Relay Hall',
    spawn: { x: 14, y: 19, dir: 'up' },
    grid: [
      '##############################',
      '##############################',
      '##..........................##',
      '##..c...................c...##',
      '##......oooo......oooo......##',
      '##......oooo......oooo......##',
      '##......oooo......oooo......##',
      '##......oooobbbbbboooo......##',
      '##..........bbbbbb..........##',
      '##..........bb||bb.....C....##',
      '##..........bbbbbb..........##',
      '##......oooobbbbbboooo......##',
      '##......oooo......oooo......##',
      '##......oooo......oooo......##',
      '##......oooo......oooo......##',
      '##..d...................d...##',
      '##..........................##',
      '##..........................##',
      '##############..##############',
      '##############..##############',
      '##############..##############',
      '##############..##############'
    ],
    interactions: [
      {
        id: 'west_barrier_console',
        x: 24, y: 9,
        script: [
          { if: state => !!state.flags.gate_west_barrier_open, then: [
            { say: { speaker: 'Relay Console', text: 'WEST TRANSIT BARRIER: OPEN.' } }
          ], else: [
            { say: { speaker: 'Relay Console', text: 'A surviving control channel hums beneath the void interference.' } },
            { choice: {
              prompt: 'Route power to the west barrier?',
              options: [
                { label: 'Open barrier', value: 'open' },
                { label: 'Leave it closed', value: 'leave' }
              ],
              results: {
                open: [
                  { setcell: { x: 14, y: 9, ch: 'b' } },
                  { setcell: { x: 15, y: 9, ch: 'b' } },
                  { flag: { key: 'gate_west_barrier_open', value: true } },
                  { sfx: 'confirm' },
                  { banner: 'West barrier opened' }
                ],
                leave: [
                  { say: { speaker: 'Lyra', text: 'Not yet. Keep the remaining circuit isolated.' } }
                ]
              }
            } }
          ] }
        ]
      }
    ],
    exits: [
      {
        id: 'west_hall_to_approach',
        cells: [{ x: 14, y: 21 }, { x: 15, y: 21 }],
        to: { map: 'gate_approach', x: 14, y: 2, dir: 'down' }
      },
      {
        id: 'west_hall_to_east_hall',
        cells: [{ x: 27, y: 16 }, { x: 27, y: 17 }],
        to: { map: 'gate_hall_east', x: 2, y: 16, dir: 'right' }
      }
    ],
    encounters: STARGATE_ENCOUNTERS.halls
  }),

  gate_hall_east: gateMap({
    id: 'gate_hall_east',
    name: 'East Relay Hall',
    spawn: { x: 2, y: 16, dir: 'right' },
    grid: [
      '##############################',
      '##############################',
      '##..........................##',
      '##...c..................c...##',
      '##......oooo......oooo......##',
      '##......oooo......oooo......##',
      '##......oooo......oooo......##',
      '##......oooobbbbbboooo......##',
      '##..........bbbbbb..........##',
      '##....C.....bb||bb..........##',
      '##..........bbbbbb..........##',
      '##......oooobbbbbboooo......##',
      '##......oooo......oooo......##',
      '##......oooo......oooo......##',
      '##......oooo......oooo......##',
      '##...d..................d...##',
      '............................##',
      '............................##',
      '##############..##############',
      '##############..##############',
      '##############..##############',
      '##############..##############'
    ],
    interactions: [
      {
        id: 'east_barrier_console',
        x: 6, y: 9,
        script: [
          { if: state => !state.flags.gate_west_barrier_open, then: [
            { say: { speaker: 'Relay Console', text: 'CIRCUIT DESYNCHRONIZED. Restore the west relay first.' } }
          ], else: [
            { if: state => !!state.flags.gate_east_barrier_open, then: [
              { say: { speaker: 'Relay Console', text: 'EAST TRANSIT BARRIER: OPEN.' } }
            ], else: [
              { say: { speaker: 'Relay Console', text: 'The restored west channel can carry one final opening pulse.' } },
              { setcell: { x: 14, y: 9, ch: 'b' } },
              { setcell: { x: 15, y: 9, ch: 'b' } },
              { flag: { key: 'gate_east_barrier_open', value: true } },
              { sfx: 'confirm' },
              { banner: 'East barrier opened' }
            ] }
          ] }
        ]
      }
    ],
    exits: [
      {
        id: 'east_hall_to_west_hall',
        cells: [{ x: 0, y: 16 }, { x: 0, y: 17 }],
        to: { map: 'gate_hall_west', x: 26, y: 16, dir: 'left' }
      },
      {
        id: 'east_hall_to_depths',
        cells: [{ x: 14, y: 21 }, { x: 15, y: 21 }],
        to: { map: 'gate_depths', x: 14, y: 2, dir: 'down' }
      }
    ],
    encounters: STARGATE_ENCOUNTERS.halls
  }),

  gate_depths: gateMap({
    id: 'gate_depths',
    name: 'Stargate Depths',
    spawn: { x: 14, y: 2, dir: 'down' },
    grid: [
      '##############..##############',
      '##############..##############',
      '##############..##############',
      '###........................###',
      '###..c..................c..###',
      '###......oooooooooo........###',
      '###......oooooooooo........###',
      '###......oo......oo........###',
      '###..d...oobbbbbboo...d....###',
      '###......oobbbbbboo........###',
      '###......oo......oo........###',
      '###......oo......oo........###',
      '###......oobbbbbboo........###',
      '###......oobbbbbboo........###',
      '###......oooooooooo........###',
      '###......oooooooooo........###',
      '###..C.....................###',
      '###.....................c..###',
      '##############..##############',
      '##############..##############',
      '##############..##############',
      '##############..##############'
    ],
    interactions: [
      {
        id: 'depths_checkpoint',
        x: 5, y: 16,
        script: [
          { say: { speaker: 'Guardian Waystation', text: 'A clean pocket of gate energy answers the Crown. The route behind you is secured.' } },
          { flag: { key: 'gate_depths_checkpoint', value: true } },
          { autosave: 'Stargate Depths' },
          { banner: 'Checkpoint secured' }
        ]
      }
    ],
    exits: [
      {
        id: 'depths_to_east_hall',
        cells: [{ x: 14, y: 0 }, { x: 15, y: 0 }],
        to: { map: 'gate_hall_east', x: 14, y: 19, dir: 'up' }
      },
      {
        id: 'depths_to_heart',
        cells: [{ x: 14, y: 21 }, { x: 15, y: 21 }],
        to: { map: 'gate_heart', x: 14, y: 2, dir: 'down' }
      }
    ],
    encounters: STARGATE_ENCOUNTERS.depths
  }),

  gate_heart: gateMap({
    id: 'gate_heart',
    name: 'The Gate Heart',
    music: 'nova',
    spawn: { x: 14, y: 2, dir: 'down' },
    grid: [
      '##############..##############',
      '##############..##############',
      '##############..##############',
      '####......................####',
      '####..R................R..####',
      '####.....oooooooooooo.....####',
      '####.....oo........oo.....####',
      '####.....oo..cccc..oo.....####',
      '####.....oo........oo.....####',
      '####.....bbbbbbbbbbbb.....####',
      '####.....bbbbbbbbbbbb.....####',
      '####.....oobb....bboo.....####',
      '####.....oobb.P..bboo.....####',
      '####.....oobb....bboo.....####',
      '####.....oobbbbbbbboo.....####',
      '####.....oobbbbbbbboo.....####',
      '####.....oo........oo.....####',
      '####.....oooooooooooo.....####',
      '####......................####',
      '##############################',
      '##############################',
      '##############################'
    ],
    interactions: [
      {
        id: 'heart_pedestal',
        x: 14, y: 12,
        script: [
          { if: state => !!state.flags.kael_defeated, then: [
            { say: { speaker: 'Shard Pedestal', text: 'The broken gate answers with a single, steady pulse.' } }
          ], else: [
            { say: { speaker: 'Shard Pedestal', text: 'A Crown resonance waits beyond the sentinel.' } }
          ] }
        ]
      }
    ],
    exits: [
      {
        id: 'heart_to_depths',
        cells: [{ x: 14, y: 0 }, { x: 15, y: 0 }],
        to: { map: 'gate_depths', x: 14, y: 19, dir: 'up' }
      }
    ]
  })
};
