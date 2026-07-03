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
  's': { tile: 'scorch' }
};

export const MAPS = {
  nova_plaza: {
    id: 'nova_plaza',
    name: 'Starfall Plaza',
    region: 'Nova Prime',
    tileset: 'nova',
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
            { say: { speaker: 'Commander Reyes', text: 'The search teams have their orders. When you are ready, we will brief the Stargate route.' } }
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
    exits: [],
    triggers: []
  }
};

export function getMap(id) {
  const m = MAPS[id];
  if (!m) throw new Error('Unknown map: ' + id);
  return m;
}
