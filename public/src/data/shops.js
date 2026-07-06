// ═══════════════════════════════════════════════════════════════
// SHOPS — Nova Prime service inventories.
// ═══════════════════════════════════════════════════════════════

export const SHOPS = {
  weapons: {
    id: 'weapons', name: 'EDGE OF TOMORROW',
    keeper: 'Blacksmith Torvin',
    items: ['starlight_saber', 'duskfang_claws', 'spark_module']
  },
  armor: {
    id: 'armor', name: 'AEGIS OUTFITTERS',
    keeper: 'Quartermaster Iona',
    items: ['traveler_weave', 'guard_plate', 'swift_anklet']
  },
  materials: {
    id: 'materials', name: 'VOID & SPARK',
    keeper: 'Merchant Zara',
    items: ['potion', 'sp_tonic', 'antidote', 'clarity_herb', 'smoke_bomb', 'scrap_metal', 'bio_gel']
  },
  healer: {
    id: 'healer', name: "ELARA'S CLINIC",
    keeper: 'Dr. Elara',
    items: ['potion', 'hi_potion', 'sp_tonic', 'revive_spark', 'antidote', 'clarity_herb']
  },
  mire_goods: {
    id: 'mire_goods', name: 'DROWNED MARKET',
    keeper: 'Anura Trader',
    items: ['potion', 'hi_potion', 'antidote', 'clarity_herb', 'smoke_bomb', 'tidewood_staff', 'tide_band']
  },
  ash_goods: {
    id: 'ash_goods', name: 'CINDER MARKET',
    keeper: 'Drakonid Trader',
    items: ['potion', 'hi_potion', 'antidote', 'clarity_herb', 'smoke_bomb', 'emberbrand_axe', 'dragonhide_plate']
  }
};

export function getShop(id) { return SHOPS[id] || null; }
