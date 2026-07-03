// ═══════════════════════════════════════════════════════════════
// NOVA PRIME MAPS — Home-base districts and service interiors.
// These maps are deliberately story-neutral: named/story NPCs are
// merged by storyContent while this package owns spatial flow.
// ═══════════════════════════════════════════════════════════════

// Kept local to avoid a maps.js ↔ maps/nova.js module cycle. This is
// the exact Nova legend contract exported by maps.js.
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
  'c': { tile: 'counter', solid: true },
  'W': { tile: 'wallInner', variants: 3, solid: true },
  'F': { tile: 'floorWood', variants: 4 },
  'K': { tile: 'carpet', variants: 3 },
  'S': { tile: 'shelf', variants: 3, solid: true },
  'B': { tile: 'bed', solid: true },
  'T': { tile: 'table', solid: true },
  'k': { tile: 'stool' }
};

const ambient = (id, actor, x, y, dir, speaker, text) => ({
  id, actor, x, y, dir,
  script: [{ say: { speaker, text } }]
});

const serviceInterior = ({
  id, name, grid, spawn, npcs = [], exitId, marketEntry
}) => ({
  id,
  name,
  region: 'Nova Prime',
  tileset: 'nova',
  music: 'nova',
  legend: NOVA_LEGEND,
  spawn,
  grid,
  npcs,
  interactions: [],
  exits: [{
    id: exitId,
    cells: [{ x: 11, y: 15 }, { x: 12, y: 15 }],
    to: { map: 'nova_market', ...marketEntry }
  }],
  triggers: []
});

export const NOVA_MAPS = {
  nova_market: {
    id: 'nova_market',
    name: 'Comet Market',
    region: 'Nova Prime',
    tileset: 'nova',
    music: 'nova',
    legend: NOVA_LEGEND,
    spawn: { x: 2, y: 10, dir: 'right' },
    grid: [
      '##############==##############',
      '#wwDwww#wwDwww==wwDwww#wwDwww#',
      '##############==##############',
      '.....i........ii........i.....',
      '.....i........ii........i.....',
      '..l..i...p....ii....p...i..l..',
      '.....i........ii........i.....',
      'iiiiiiiiiiiiiiiiiiiiiiiiiiiiii',
      '.....i.....ffffff.....i.......',
      '.....i.....f~~~~f.....i.......',
      '==iiii.....f~~~~f.....iiiiiiii',
      '==iiii.....ffffff.....iiiiiiii',
      '.....i........ii........i.....',
      '..l..i...p....ii....p...i..l..',
      '.....i........ii........i.....',
      'iiiiiiiiiiiiiiiiiiiiiiiiiiiiii',
      '..i..........iiii..........i..',
      '..i....T.....iiii.....T....i..',
      '..i..........iiii..........i..',
      '..............ii..............',
      '##############==##############',
      '##############==##############'
    ],
    npcs: [
      ambient('market_vendor', 'citizen_f', 9, 6, 'down', 'Market Vendor',
        'Fresh moonfruit, reactor tea, and three kinds of emergency candle.'),
      ambient('market_porter', 'citizen_m', 21, 13, 'left', 'Market Porter',
        'The stalls reopened before the dust settled. Nova Prime is stubborn that way.'),
      ambient('market_guard', 'guard', 4, 17, 'right', 'Market Watch',
        'Keep the inlay clear. Supply carts need a clean route to the plaza.')
    ],
    interactions: [],
    exits: [
      {
        id: 'market_to_plaza',
        cells: [{ x: 0, y: 10 }, { x: 1, y: 10 }, { x: 0, y: 11 }, { x: 1, y: 11 }],
        to: { map: 'nova_plaza', x: 27, y: 10, dir: 'left' }
      },
      {
        id: 'market_to_gardens',
        cells: [{ x: 14, y: 0 }, { x: 15, y: 0 }],
        to: { map: 'nova_gardens', x: 14, y: 19, dir: 'up' }
      },
      {
        id: 'market_to_residential',
        cells: [{ x: 14, y: 21 }, { x: 15, y: 21 }],
        to: { map: 'nova_residential', x: 14, y: 2, dir: 'down' }
      },
      {
        id: 'market_to_weapons',
        cells: [{ x: 5, y: 3 }, { x: 5, y: 4 }],
        to: { map: 'nova_shop_weapons', x: 11, y: 13, dir: 'up' }
      },
      {
        id: 'market_to_armor',
        cells: [{ x: 10, y: 3 }, { x: 10, y: 4 }],
        to: { map: 'nova_shop_armor', x: 11, y: 13, dir: 'up' }
      },
      {
        id: 'market_to_materials',
        cells: [{ x: 19, y: 3 }, { x: 19, y: 4 }],
        to: { map: 'nova_shop_materials', x: 11, y: 13, dir: 'up' }
      },
      {
        id: 'market_to_healers',
        cells: [{ x: 24, y: 3 }, { x: 24, y: 4 }],
        to: { map: 'nova_healers_hall', x: 11, y: 13, dir: 'up' }
      },
      {
        id: 'market_to_tavern',
        cells: [{ x: 28, y: 15 }, { x: 29, y: 15 }],
        to: { map: 'nova_tavern', x: 11, y: 13, dir: 'up' }
      }
    ],
    triggers: []
  },

  nova_residential: {
    id: 'nova_residential',
    name: 'Aurora Ward',
    region: 'Nova Prime',
    tileset: 'nova',
    music: 'nova',
    legend: NOVA_LEGEND,
    spawn: { x: 14, y: 2, dir: 'down' },
    grid: [
      '##############==##############',
      '##############==##############',
      '..............ii..............',
      '..p...........ii...........p..',
      '..####D###....ii....###D####..',
      '..#wwwwww#....ii....#wwwwww#..',
      '..########....ii....########..',
      '..............ii..............',
      '...l......iiiiiiii......l.....',
      '..........i......i............',
      '==iiiiiiiii..pp..iiiiiiiiiiiii',
      '==iiiiiiiii..pp..iiiiiiiiiiiii',
      '..........i......i............',
      '...l......iiiiiiii......l.....',
      '..########....ii....########..',
      '..#wwwwww#....ii....#wwwwww#..',
      '..####D###....ii....###D####..',
      '..p...........ii...........p..',
      '..............ii..............',
      '..............ii..............',
      '##############==##############',
      '##############==##############'
    ],
    npcs: [
      ambient('ward_parent', 'citizen_f', 8, 9, 'right', 'Ward Resident',
        'The children count every repair light as a new star.'),
      ambient('ward_caretaker', 'citizen_m', 21, 12, 'left', 'Ward Caretaker',
        'West block has water again. East block is next.'),
      ambient('ward_patrol', 'guard', 5, 18, 'right', 'Ward Patrol',
        'The shelter route runs west to the plaza and north to the market.')
    ],
    interactions: [],
    exits: [
      {
        id: 'residential_to_market',
        cells: [{ x: 14, y: 0 }, { x: 15, y: 0 }],
        to: { map: 'nova_market', x: 14, y: 19, dir: 'up' }
      },
      {
        id: 'residential_to_plaza',
        cells: [{ x: 0, y: 10 }, { x: 1, y: 10 }, { x: 0, y: 11 }, { x: 1, y: 11 }],
        to: { map: 'nova_plaza', x: 2, y: 15, dir: 'right' }
      }
    ],
    triggers: []
  },

  nova_gardens: {
    id: 'nova_gardens',
    name: 'Constellation Gardens',
    region: 'Nova Prime',
    tileset: 'nova',
    music: 'nova',
    legend: NOVA_LEGEND,
    spawn: { x: 14, y: 19, dir: 'up' },
    grid: [
      '##############==##############',
      '##############==##############',
      ',,,,,,,,,,,,,,ii,,,,,,,,,,,,,,',
      ',p....l.......ii.......l....p,',
      ',,,,,,,,,.....ii.....,,,,,,,,,',
      ',,,,pp,,,.....ii.....,,,pp,,,,',
      ',,,,,,,,,iiiiiiiiiiii,,,,,,,,,',
      ',,,,,,,,,i..ffffff..i,,,,,,,,,',
      ',,l......i..f~~~~f..i......l,,',
      '==iiiiiiii..f~~~~f..iiiiiiiiii',
      '==iiiiiiii..ffffff..iiiiiiiiii',
      ',,l......i..........i......l,,',
      ',,,,,,,,,iiiiiiiiiiii,,,,,,,,,',
      ',,,,pp,,,.....ii.....,,,pp,,,,',
      ',,,,,,,,,.....ii.....,,,,,,,,,',
      ',p....l.......ii.......l....p,',
      ',,,,,,,,,,,,,,ii,,,,,,,,,,,,,,',
      ',,,,,,,,,,,,,,ii,,,,,,,,,,,,,,',
      ',,,,,,,,,,,,,,ii,,,,,,,,,,,,,,',
      ',,,,,,,,,,,,,,ii,,,,,,,,,,,,,,',
      '##############==##############',
      '##############==##############'
    ],
    npcs: [
      ambient('garden_keeper', 'citizen_f', 8, 11, 'right', 'Garden Keeper',
        'These blooms close around Void ash. We are learning which roots endure.'),
      ambient('garden_visitor', 'citizen_m', 21, 7, 'left', 'Garden Visitor',
        'The fountain still traces the old constellations, even with the Crown gone.')
    ],
    interactions: [],
    exits: [
      {
        id: 'gardens_to_palace',
        cells: [{ x: 14, y: 0 }, { x: 15, y: 0 }],
        to: { map: 'nova_palace', x: 14, y: 19, dir: 'up' }
      },
      {
        id: 'gardens_to_market',
        cells: [{ x: 14, y: 21 }, { x: 15, y: 21 }],
        to: { map: 'nova_market', x: 14, y: 2, dir: 'down' }
      },
      {
        id: 'gardens_to_plaza',
        cells: [{ x: 0, y: 9 }, { x: 1, y: 9 }, { x: 0, y: 10 }, { x: 1, y: 10 }],
        to: { map: 'nova_plaza', x: 27, y: 16, dir: 'left' }
      }
    ],
    triggers: []
  },

  nova_palace: {
    id: 'nova_palace',
    name: 'Solar Palace',
    region: 'Nova Prime',
    tileset: 'nova',
    music: 'nova',
    legend: NOVA_LEGEND,
    spawn: { x: 14, y: 19, dir: 'up' },
    grid: [
      'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
      'WwwwwwWwwwwwWwwwwwWwwwwwWwwwwW',
      'WFFFFFWFFFFFWFFKKFFWFFFFFWFFFW',
      'WFFFFFWFFFFFWFFKKFFWFFFFFWFFFW',
      'WFFFFFWWWWWWFFKKFFWWWWWWFFFFFW',
      'WFFFFFFFFFFFFKKFFFFFFFFFFFFFFW',
      'WFFFFTFFFFFFiiiiiiFFFFFFTFFFFW',
      'WFFFFFFFFFFFiKKKKiFFFFFFFFFFFW',
      'WKKKKKKKKKKKiKKKKiKKKKKKKKKKKW',
      'WKKKKKKKKKKKiKKKKiKKKKKKKKKKKW',
      'WFFFFFFFFFFFiKKKKiFFFFFFFFFFFW',
      'WFFFFTFFFFFFiiiiiiFFFFFFTFFFFW',
      'WFFFFFFFFFFFFKKFFFFFFFFFFFFFFW',
      'WFFFFFWWWWWWFFKKFFWWWWWWFFFFFW',
      'WFFFFFWFFFFFWFFKKFFWFFFFFWFFFW',
      'WFFFFFWFFFFFWFFKKFFWFFFFFWFFFW',
      'WwwwwwWwwwwwWFFKKFFWwwwwwWwwwW',
      'WWWWWWWWWWWWWFFKKFFWWWWWWWWWWW',
      'WWWWWWWWWWWWWFFKKFFWWWWWWWWWWW',
      'WWWWWWWWWWWWWW==WWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWW==WWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW'
    ],
    npcs: [
      ambient('palace_attendant', 'citizen_f', 10, 10, 'right', 'Palace Attendant',
        'The audience hall is serving as a relief registry until the west wing reopens.'),
      ambient('palace_guard', 'guard', 19, 12, 'left', 'Palace Guard',
        'The gardens remain the safest public approach to the palace.')
    ],
    interactions: [],
    exits: [{
      id: 'palace_to_gardens',
      cells: [{ x: 14, y: 20 }, { x: 15, y: 20 }],
      to: { map: 'nova_gardens', x: 14, y: 2, dir: 'down' }
    }],
    triggers: []
  },

  nova_tavern: serviceInterior({
    id: 'nova_tavern',
    name: 'The Orbiting Crown',
    spawn: { x: 11, y: 13, dir: 'up' },
    grid: [
      'WWWWWWWWWWWWWWWWWWWWWWWW',
      'WwwwwwwWWwwwwwwWWwwwwwwW',
      'WFFFFFFWWFFFFFFWWFFFFFFW',
      'WFFTFFFFWFFFFFFFWFFFTFFW',
      'WFFkFFFFWFFFFFFFWFFFkFFW',
      'WFFFFFFFFFFFFFFFFFFFFFFW',
      'WFFFFFFTTFFFFTTFFFFFFFFW',
      'WFFFFFFkkFFFFkkFFFFFFFFW',
      'WFFFFFFFFFFFFFFFFFFFFFFW',
      'WFFFFFccccccccccccFFFFFW',
      'WFFFFFkkkkkkkkkkkkFFFFFW',
      'WFFFFFFFFFFFFFFFFFFFFFFW',
      'WFFFFFFFFFFKKFFFFFFFFFFW',
      'WFFFFFFFFFFKKFFFFFFFFFFW',
      'WWWWWWWWWWWFFWWWWWWWWWWW',
      'WWWWWWWWWWW==WWWWWWWWWWW'
    ],
    npcs: [
      ambient('tavern_host', 'citizen_m', 12, 10, 'up', 'Tavern Host',
        'A warm cup is free for repair crews. Everyone else pays when the stars settle.'),
      ambient('tavern_regular', 'citizen_f', 5, 7, 'right', 'Tavern Regular',
        'Every table has a different story about where the Crown shards fell.')
    ],
    exitId: 'tavern_to_market',
    marketEntry: { x: 27, y: 15, dir: 'left' }
  }),

  nova_shop_weapons: serviceInterior({
    id: 'nova_shop_weapons',
    name: 'Sunforge Arms',
    spawn: { x: 11, y: 13, dir: 'up' },
    grid: [
      'WWWWWWWWWWWWWWWWWWWWWWWW',
      'WwwwwwwwwwwwwwwwwwwwwwwW',
      'WSSSFFFFFFFFFFFFFFFFSSSW',
      'WSSSFFFFKKKKFFFFFFFFSSSW',
      'WFFFFFFFKKKKFFFFFFFFFFFW',
      'WFTFFFFFKKKKFFFFFFTFFFFW',
      'WFFFFFFFKKKKFFFFFFFFFFFW',
      'WFFFFFFFKKKKFFFFFFFFFFFW',
      'WFFFFFFFFFFFFFFFFFFFFFFW',
      'WccccccccccccccccccccccW',
      'WkkkkkkkkkkkkkkkkkkkkkkW',
      'WFFFFFFFFFFFFFFFFFFFFFFW',
      'WFFFFFFFFFFKKFFFFFFFFFFW',
      'WFFFFFFFFFFKKFFFFFFFFFFW',
      'WWWWWWWWWWWFFWWWWWWWWWWW',
      'WWWWWWWWWWW==WWWWWWWWWWW'
    ],
    npcs: [
      ambient('weapons_smith', 'citizen_f', 11, 10, 'up', 'Sunforge Smith',
        'Ceremonial edges are being reforged into tools that can survive the dark.')
    ],
    exitId: 'weapons_to_market',
    marketEntry: { x: 5, y: 5, dir: 'down' }
  }),

  nova_shop_armor: serviceInterior({
    id: 'nova_shop_armor',
    name: 'Aegis Atelier',
    spawn: { x: 11, y: 13, dir: 'up' },
    grid: [
      'WWWWWWWWWWWWWWWWWWWWWWWW',
      'WwwwwwWWwwwwwwwwWWwwwwwW',
      'WSSSFFFFFFFFFFFFFFFFSSSW',
      'WSSSFFFFFFKKFFFFFFFFSSSW',
      'WFFFFFFFFKKFFFFFFFFFFFFW',
      'WFFTFFFFFKKFFFFFFTFFFFFW',
      'WFFFFFFFFKKFFFFFFFFFFFFW',
      'WFFFFFFFFKKFFFFFFFFFFFFW',
      'WFFFFFFFFFFFFFFFFFFFFFFW',
      'WccccccccccccccccccccccW',
      'WkkkkkkkkkkkkkkkkkkkkkkW',
      'WFFFFFFFFFFFFFFFFFFFFFFW',
      'WFFFFFFFFFFKKFFFFFFFFFFW',
      'WFFFFFFFFFFKKFFFFFFFFFFW',
      'WWWWWWWWWWWFFWWWWWWWWWWW',
      'WWWWWWWWWWW==WWWWWWWWWWW'
    ],
    npcs: [
      ambient('armor_tailor', 'citizen_m', 12, 10, 'up', 'Aegis Tailor',
        'A shield should let you move toward danger, not merely hide from it.')
    ],
    exitId: 'armor_to_market',
    marketEntry: { x: 10, y: 5, dir: 'down' }
  }),

  nova_shop_materials: serviceInterior({
    id: 'nova_shop_materials',
    name: 'Nebula Exchange',
    spawn: { x: 11, y: 13, dir: 'up' },
    grid: [
      'WWWWWWWWWWWWWWWWWWWWWWWW',
      'WwwwwwwwwwwwwwwwwwwwwwwW',
      'WSSSFFFSSSFFFFSSSFFFSSSW',
      'WSSSFFFSSSFFFFSSSFFFSSSW',
      'WFFFFFFFFFFFFFFFFFFFFFFW',
      'WFFTFFFTFFFFTFFFFTFFFFFW',
      'WFFFFFFFFFFFFFFFFFFFFFFW',
      'WSSSFFFSSSFFFFSSSFFFSSSW',
      'WFFFFFFFFFFFFFFFFFFFFFFW',
      'WccccccccccccccccccccccW',
      'WkkkkkkkkkkkkkkkkkkkkkkW',
      'WFFFFFFFFFFFFFFFFFFFFFFW',
      'WFFFFFFFFFFKKFFFFFFFFFFW',
      'WFFFFFFFFFFKKFFFFFFFFFFW',
      'WWWWWWWWWWWFFWWWWWWWWWWW',
      'WWWWWWWWWWW==WWWWWWWWWWW'
    ],
    npcs: [
      ambient('materials_broker', 'citizen_f', 11, 10, 'up', 'Materials Broker',
        'Salvage is weighed twice now: once for mass, once for Void contamination.')
    ],
    exitId: 'materials_to_market',
    marketEntry: { x: 19, y: 5, dir: 'down' }
  }),

  nova_healers_hall: serviceInterior({
    id: 'nova_healers_hall',
    name: 'Astral Healers Hall',
    spawn: { x: 11, y: 13, dir: 'up' },
    grid: [
      'WWWWWWWWWWWWWWWWWWWWWWWW',
      'WwwwwwwwwwwwwwwwwwwwwwwW',
      'WBFFFFFBFFFFFFBFFFFFFBFW',
      'WFFFFFFFKKKKKKFFFFFFFFFW',
      'WFFFFFFFKKKKKKFFFFFFFFFW',
      'WBFFFFFBFFFFFFBFFFFFFBFW',
      'WFFFFFFFFFFFFFFFFFFFFFFW',
      'WFFFFTTFFFFFFFFTTFFFFFFW',
      'WFFFFFFFFFFFFFFFFFFFFFFW',
      'WccccccccccccccccccccccW',
      'WkkkkkkkkkkkkkkkkkkkkkkW',
      'WFFFFFFFFFFFFFFFFFFFFFFW',
      'WFFFFFFFFFFKKFFFFFFFFFFW',
      'WFFFFFFFFFFKKFFFFFFFFFFW',
      'WWWWWWWWWWWFFWWWWWWWWWWW',
      'WWWWWWWWWWW==WWWWWWWWWWW'
    ],
    npcs: [
      ambient('hall_medic', 'citizen_f', 12, 10, 'up', 'Hall Medic',
        'We treat exhaustion before heroics. Sit, breathe, then decide what comes next.'),
      ambient('hall_orderly', 'citizen_m', 4, 7, 'right', 'Hall Orderly',
        'The quiet beds are for anyone who needs them. Titles stay at the door.')
    ],
    exitId: 'healers_to_market',
    marketEntry: { x: 24, y: 5, dir: 'down' }
  })
};

// Integrator-owned reciprocal edges for the shared nova_plaza map.
// Arrival cells sit two tiles inside each district, clear of exits.
export const NOVA_PLAZA_EXIT_CONTRACTS = [
  {
    id: 'plaza_to_market',
    cells: [{ x: 29, y: 10 }, { x: 29, y: 11 }],
    to: { map: 'nova_market', x: 2, y: 10, dir: 'right' }
  },
  {
    id: 'plaza_to_residential',
    cells: [{ x: 0, y: 15 }, { x: 0, y: 16 }],
    to: { map: 'nova_residential', x: 2, y: 10, dir: 'right' }
  },
  {
    id: 'plaza_to_gardens',
    cells: [{ x: 29, y: 15 }, { x: 29, y: 16 }],
    to: { map: 'nova_gardens', x: 2, y: 9, dir: 'right' }
  }
];
