// ═══════════════════════════════════════════════════════════════
// RESONANCE — Party synergy combos (PRD §10.5). A skill "primes"
// its tags on the target; a follow-up ally skill whose tag pairs
// with a primed tag triggers a named Resonance: bonus damage and a
// rider effect. Discovered resonances are recorded and reviewable.
// ═══════════════════════════════════════════════════════════════

export const RESONANCES = [
  {
    id: 'steam_burst', name: 'Steam Burst',
    pair: ['fire', 'water'],
    bonus: 1.5,
    effect: { status: 'blind', chance: 0.8, turns: 2 },
    desc: 'Fire meets water in a scalding veil that blinds the target.'
  },
  {
    id: 'conduction', name: 'Conduction',
    pair: ['water', 'volt'],
    bonus: 1.6,
    effect: { status: 'stun', chance: 0.5, turns: 1 },
    desc: 'Charged water carries the current straight through armor.'
  },
  {
    id: 'shatterfrost', name: 'Shatterfrost',
    pair: ['ice', 'blunt'],
    bonus: 1.8,
    effect: null,
    desc: 'Frozen matter fractures under a crushing blow.'
  },
  {
    id: 'flash_fire', name: 'Flash Fire',
    pair: ['fire', 'wind_or_speed'],  // matched via 'swift' tag
    pairTags: ['fire', 'swift'],
    bonus: 1.4,
    effect: { status: 'burn', chance: 1.0, turns: 3 },
    desc: 'A swift strike fans the flames into a firestorm.'
  },
  {
    id: 'precision_strike', name: 'Precision Strike',
    pairTags: ['mark', 'claw'],
    bonus: 1.5,
    effect: { ignoreDef: true },
    desc: 'Marked weak points guide claws past every defense.'
  },
  {
    id: 'starfall_edge', name: 'Starfall Edge',
    pairTags: ['stellar', 'sword'],
    bonus: 1.45,
    effect: null,
    desc: 'Starlight gathers along the blade into a falling star.'
  },
  {
    id: 'purifying_tide', name: 'Purifying Tide',
    pairTags: ['stellar', 'water'],
    bonus: 1.4,
    effect: { vsVoidBonus: 0.5 },
    desc: 'Blessed waters burn away corruption.'
  },
  {
    id: 'ember_quake', name: 'Ember Quake',
    pairTags: ['fire', 'break'],
    bonus: 1.6,
    effect: { defDown: 0.25, turns: 3 },
    desc: 'Superheated armor splits open under the breaker\'s blow.'
  },
  {
    id: 'overload', name: 'Overload',
    pairTags: ['volt', 'tech'],
    bonus: 1.5,
    effect: { status: 'stun', chance: 0.35, turns: 1 },
    desc: 'Pip\'s systems supercharge the current beyond tolerance.'
  },
  {
    id: 'void_backlash', name: 'Void Backlash',
    pairTags: ['void', 'stellar'],
    bonus: 1.7,
    effect: { vsVoidBonus: 0.75 },
    desc: 'Void and starlight annihilate on contact.'
  }
];

// Normalize: prefer pairTags, fall back to pair
export function resonanceFor(primedTags, incomingTags) {
  for (const r of RESONANCES) {
    const [a, b] = r.pairTags || r.pair;
    if ((primedTags.has(a) && incomingTags.includes(b)) ||
        (primedTags.has(b) && incomingTags.includes(a))) {
      return r;
    }
  }
  return null;
}
