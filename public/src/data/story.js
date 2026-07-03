// ═══════════════════════════════════════════════════════════════
// STORY — Chapter registry and top-level campaign structure.
// Chapters map to the PRD dramatic arc (§6.3). Content per chapter
// lives in dialogue/cutscene/quest data added per milestone.
// ═══════════════════════════════════════════════════════════════

export const CHAPTERS = {
  c1_fall:        { name: 'The Fall',                ordinal: 1 },
  c2_first_claim: { name: 'The First Claim',         ordinal: 2 },
  c3_gathering:   { name: 'The Gathering',           ordinal: 3 },
  c4_cost:        { name: 'The Cost of Restoration', ordinal: 4 },
  c5_fracture:    { name: 'The Party Tested',        ordinal: 5 },
  c6_reckoning:   { name: 'The Void Answered',       ordinal: 6 },
  c7_decision:    { name: 'The Future Crown',        ordinal: 7 },
  c8_epilogue:    { name: 'A Changed Galaxy',        ordinal: 8 }
};

export function chapterLabel(id) {
  const c = CHAPTERS[id];
  return c ? 'Ch.' + c.ordinal + ' ' + c.name : id;
}
