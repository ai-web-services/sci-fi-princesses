// ═══════════════════════════════════════════════════════════════
// RECIPES — Forge crafting (D22, unlocked at novaStage 2). Consumes
// regional materials for top-tier equipment and each companion's
// signature relic. No RNG, no farming walls: every material here is
// either purchasable in a shop or a guaranteed (chance: 1.0) drop
// from the named boss called out in its description.
// Schema: { id, name, desc, result: itemId, materials: [{id, qty}], gold }
// ═══════════════════════════════════════════════════════════════

export const RECIPES = {
  crownlight_blade: {
    id: 'crownlight_blade', result: 'crownlight_blade',
    name: 'Crownlight Blade',
    desc: "Lyra's signature relic. Requires the Stellar Crystal guaranteed from Void Sentinel Kael.",
    materials: [{ id: 'stellar_crystal', qty: 1 }, { id: 'scrap_metal', qty: 3 }],
    gold: 300
  },
  phantom_rakes: {
    id: 'phantom_rakes', result: 'phantom_rakes',
    name: 'Phantom Rakes',
    desc: "Erynn's signature relic. Requires Silk Thread guaranteed from Silk Baroness Vess.",
    materials: [{ id: 'silk_thread', qty: 1 }, { id: 'scrap_metal', qty: 3 }],
    gold: 300
  },
  leviathan_crest: {
    id: 'leviathan_crest', result: 'leviathan_crest',
    name: 'Leviathan Crest',
    desc: "Brimble's signature relic. Requires the Mire Pearl guaranteed from the Drowned Matriarch.",
    materials: [{ id: 'mire_pearl', qty: 1 }, { id: 'bio_gel', qty: 3 }],
    gold: 300
  },
  wyrmfury_maul: {
    id: 'wyrmfury_maul', result: 'wyrmfury_maul',
    name: 'Wyrmfury Maul',
    desc: "Drakkor's signature relic. Requires the Dragon Scale guaranteed from Ash Tyrant Ignis.",
    materials: [{ id: 'dragon_scale', qty: 1 }, { id: 'ash_ingot', qty: 3 }],
    gold: 300
  },
  omega_lens: {
    id: 'omega_lens', result: 'omega_lens',
    name: 'Omega Lens',
    desc: "Pip's signature relic. Requires Void Essence drawn from corrupted rift enemies across the campaign.",
    materials: [{ id: 'void_essence', qty: 2 }, { id: 'scrap_metal', qty: 3 }],
    gold: 300
  },
  astral_aegis: {
    id: 'astral_aegis', result: 'astral_aegis',
    name: 'Astral Aegis',
    desc: "A unity ward tempered from every region's crowning trophy: Stellar Crystal, Mire Pearl, and Dragon Scale.",
    materials: [{ id: 'stellar_crystal', qty: 1 }, { id: 'mire_pearl', qty: 1 }, { id: 'dragon_scale', qty: 1 }],
    gold: 500
  }
};

export function getRecipe(id) { return RECIPES[id] || null; }
export function allRecipes() { return RECIPES; }
