// ═══════════════════════════════════════════════════════════════
// MAPS — Authored map registry. Maps are char grids + legend.
// legend entry: { tile, variants?, solid?, anim? }
// This file will grow per region; large regions get their own files
// and register here.
// ═══════════════════════════════════════════════════════════════

const NOVA_LEGEND = {
  '^': { tile: 'wallTop', solid: true },
  '#': { tile: 'wall', variants: 3, solid: true },
  'w': { tile: 'window', solid: true },
  'D': { tile: 'door', solid: true },
  '.': { tile: 'floor', variants: 4 },
  ',': { tile: 'grass', variants: 4 },
  'i': { tile: 'inlay' },
  '=': { tile: 'pathV', variants: 2 },
  'f': { tile: 'fountainRim', solid: true },
  '~': { tile: 'water', variants: 2, solid: true },
  'l': { tile: 'lamp', solid: true },
  'p': { tile: 'planter', solid: true },
  'r': { tile: 'rubble' },
  's': { tile: 'scorch' },
  'x': { tile: 'wallCracked', variants: 2, solid: true },
  'c': { tile: 'counter', solid: true }
};

export const MAPS = {
  nova_plaza: {
    id: 'nova_plaza',
    name: 'Starfall Plaza',
    region: 'Nova Prime',
    tileset: 'nova',
    music: 'nova',
    legend: NOVA_LEGEND,
    spawn: { x: 14, y: 17, dir: 'up' },
    grid: [
      '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
      '#ww###ww###ww#DD#ww###ww###ww#',
      '##############DD##############',
      ',,............ii............,,',
      ',p..........r.ii............p,',
      ',,............ii....s.......,,',
      ',,....l.......ii.......l....,,',
      ',,............ii............,,',
      ',p...........iiii...........p,',
      ',,..........ffffff..........,,',
      ',,..........f~~~~f..........,,',
      ',,..........f~~~~f..........,,',
      ',,..........ffffff..........,,',
      ',p...........iiii...........p,',
      ',,............ii......r.....,,',
      ',,............ii............,,',
      ',,....l.......ii.......l....,,',
      ',p............ii............p,',
      ',,...r........ii............,,',
      ',,............ii............,,',
      ',,,,,,,,,,,,,,ii,,,,,,,,,,,,,,',
      ',,,,,,,,,,,,,,ii,,,,,,,,,,,,,,'
    ],
    npcs: [
      {
        id: 'reyes', actor: 'reyes', x: 14, y: 6, dir: 'down',
        script: [
          { if: state => !!state.flags.reyes_first_briefing, then: [
            { if: state => !!state.flags.gate_diagnostics_complete && !state.flags.stargate_local_relay, then: [
              { say: { speaker: 'Commander Reyes', text: 'Your diagnostic reached us. The relay can carry a local route again.' } },
              { say: { speaker: 'Lyra', text: 'Then open it. Every stable path is another chance to bring someone home.' } },
              { flag: { key: 'stargate_local_relay', value: true } },
              { quest: { id: 'q_fall_aftershock', stage: 4, status: 'done' } },
              { autosave: 'Starfall Plaza' },
              { banner: 'Quest complete: After the Fall' }
            ], else: [
              { say: { speaker: 'Commander Reyes', text: 'The search teams have their orders. Reach Stargate Dock and assess the relay.' } }
            ] }
          ], else: [
          { say: { speaker: 'Commander Reyes', text: 'The shield grid is holding, Your Highness. Barely.' } },
          { say: { speaker: 'Lyra', text: 'Then we use the time it bought us. How many people are still missing?' } },
          { choice: {
            prompt: 'What matters first?',
            options: [
              { label: 'Find the missing', value: 'people' },
              { label: 'Secure the Stargate', value: 'gate' }
            ],
            results: {
              people: [
                { flag: { key: 'leadership_first_priority', value: 'people' } },
                { say: { speaker: 'Commander Reyes', text: 'I hoped you would say that. I will redirect the search teams.' } }
              ],
              gate: [
                { flag: { key: 'leadership_first_priority', value: 'gate' } },
                { say: { speaker: 'Commander Reyes', text: 'A hard answer. A working gate may be the only way to reach them.' } }
              ]
            }
          } },
          { quest: { id: 'q_fall_aftershock', stage: 1, status: 'active' } },
          { flag: { key: 'reyes_first_briefing', value: true } },
          { autosave: 'Starfall Plaza' },
          { banner: 'Quest begun: After the Fall' }
          ] }
        ]
      },
      {
        id: 'citizen_m', actor: 'citizen_m', x: 8, y: 15, dir: 'right',
        script: [
          { say: { speaker: 'Nova Citizen', text: 'I saw the Crown break. The sky went dark in the middle of the morning.' } },
          { say: { speaker: 'Lyra', text: 'The light is not gone. We will find what remains—and decide what it should become.' } }
        ]
      },
      {
        id: 'guard', actor: 'guard', x: 20, y: 16, dir: 'left',
        script: [
          { say: { speaker: 'Palace Guard', text: 'The northern doors are sealed until the structural crews clear the fallen spires.' } }
        ]
      }
    ],
    exits: [
      {
        id: 'plaza_to_dock',
        cells: [{ x: 14, y: 21 }, { x: 15, y: 21 }],
        to: { map: 'stargate_dock', x: 14, y: 2, dir: 'down' }
      }
    ],
    triggers: []
  },

  stargate_dock: {
    id: 'stargate_dock',
    name: 'Stargate Dock',
    region: 'Nova Prime',
    tileset: 'nova',
    music: 'nova',
    legend: NOVA_LEGEND,
    spawn: { x: 14, y: 2, dir: 'down' },
    grid: [
      '##############==##############',
      '##############==##############',
      '##############==##############',
      '..............ii..............',
      '..x...........ii..........x...',
      '..............ii..............',
      '......l.......ii.......l......',
      '.............iiii.............',
      '.........iiiiiiiiiiii.........',
      '.........i..........i.........',
      '....r....i..........i....s....',
      '.........i..........i.........',
      '.........iiiiiiiiiiii.........',
      '.............iiii.............',
      '......l.......ii.......l......',
      '..............ii..............',
      '..x...........ii..........x...',
      '..............ii..............',
      '######........c.........######',
      '##############DD##############',
      '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
      '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^'
    ],
    npcs: [
      {
        id: 'dock_guard', actor: 'guard', x: 9, y: 10, dir: 'right',
        script: [
          { say: { speaker: 'Dock Guard', text: 'The relay chamber is intact. The routes beyond it are another question.' } }
        ]
      },
      {
        id: 'dock_elara', actor: 'elara', x: 20, y: 10, dir: 'left',
        script: [
          { say: { speaker: 'Dr. Elara', text: 'Void residue is threaded through the routing lattice. It behaves less like damage than a message.' } }
        ]
      }
    ],
    interactions: [
      {
        id: 'nova_gate_console',
        x: 14, y: 18,
        script: [
          { if: state => !state.quests.q_fall_aftershock, then: [
            { say: { speaker: 'Relay Console', text: 'LOCAL AUTHORIZATION REQUIRED. Commander Reyes can authorize a diagnostic.' } }
          ], else: [
            { if: state => !state.flags.gate_diagnostics_complete, then: [
              { say: { speaker: 'Relay Console', text: 'Two damaged channels remain: rescue telemetry and route stabilization.' } },
              { choice: {
                prompt: 'Which channel receives priority?',
                options: [
                  { label: 'Rescue telemetry', value: 'rescue' },
                  { label: 'Route stability', value: 'stability' }
                ],
                results: {
                  rescue: [
                    { flag: { key: 'relay_priority', value: 'rescue' } },
                    { say: { speaker: 'Lyra', text: 'Find the missing first. A route means nothing if we abandon who used it.' } }
                  ],
                  stability: [
                    { flag: { key: 'relay_priority', value: 'stability' } },
                    { say: { speaker: 'Lyra', text: 'Stabilize the path. Then every search team can cross safely.' } }
                  ]
                }
              } },
              { flag: { key: 'gate_diagnostics_complete', value: true } },
              { quest: { id: 'q_fall_aftershock', stage: 3, status: 'active' } },
              { autosave: 'Stargate Dock' },
              { banner: 'Objective: Report to Commander Reyes' },
              { run: scene => scene.openTravel() }
            ], else: [
              { run: scene => scene.openTravel() }
            ] }
          ] }
        ]
      }
    ],
    exits: [
      {
        id: 'dock_to_plaza',
        cells: [{ x: 14, y: 0 }, { x: 15, y: 0 }],
        to: { map: 'nova_plaza', x: 14, y: 19, dir: 'up' }
      }
    ],
    triggers: [
      {
        id: 'dock_arrival',
        cells: [{ x: 14, y: 3 }, { x: 15, y: 3 }],
        onceFlag: 'dock_arrival_seen',
        if: state => !!state.quests.q_fall_aftershock && state.quests.q_fall_aftershock.stage === 1,
        script: [
          { say: { speaker: 'Lyra', text: 'The relay still has power. Let us learn what the Crownfall did to its routes.' } },
          { quest: { id: 'q_fall_aftershock', stage: 2, status: 'active' } },
          { autosave: 'Stargate Dock' },
          { banner: 'Objective: Run a Stargate diagnostic' }
        ]
      }
    ]
  },

  shattered_gate: {
    id: 'shattered_gate',
    name: 'Shattered Gate Approach',
    region: 'Fractured Transit Ring',
    tileset: 'nova',
    music: 'nova',
    legend: NOVA_LEGEND,
    spawn: { x: 14, y: 17, dir: 'down' },
    grid: [
      '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      'xx..........ssss..........xxxx',
      'x............ii............xxx',
      'x...r........ii.......r....xxx',
      'x............ii............xxx',
      'x.....l......iiii......l....xx',
      'x...........i....i..........xx',
      'x....r......i.ss.i......r...xx',
      'x...........i.ss.i..........xx',
      'x...........i....i..........xx',
      'x............ii............xxx',
      'x.....l......iiii......l....xx',
      'x............ii............xxx',
      'x...s........ii.......s....xxx',
      'x............ii............xxx',
      'x............ii............xxx',
      'x............ii............xxx',
      'x............ii............xxx',
      '######........c.........######',
      '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
      '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^'
    ],
    npcs: [],
    interactions: [
      {
        id: 'shattered_gate_console',
        x: 14, y: 19,
        script: [
          { say: { speaker: 'Fractured Relay', text: 'The outer ring is silent. Nova Prime remains the only stable return signature.' } },
          { run: scene => scene.openTravel() }
        ]
      }
    ],
    exits: [],
    triggers: [
      {
        id: 'shattered_arrival',
        cells: [{ x: 14, y: 17 }],
        onceFlag: 'shattered_gate_seen',
        script: [
          { say: { speaker: 'Lyra', text: "So this is where the Crown's road broke. Something beyond that silence is waiting." } },
          { banner: 'New location discovered: Shattered Gate' }
        ]
      }
    ]
  }
};

export function getMap(id) {
  const m = MAPS[id];
  if (!m) throw new Error('Unknown map: ' + id);
  return m;
}
