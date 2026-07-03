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
    npcs: [],
    exits: [],
    triggers: []
  }
};

export function getMap(id) {
  const m = MAPS[id];
  if (!m) throw new Error('Unknown map: ' + id);
  return m;
}
