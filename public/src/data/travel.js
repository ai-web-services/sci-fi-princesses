// ═══════════════════════════════════════════════════════════════
// TRAVEL — Data-driven Stargate destinations and arrival entries.
// Availability remains state-based so future regions can register
// without adding scene branches.
// ═══════════════════════════════════════════════════════════════

export const TRAVEL_DESTINATIONS = [
  {
    id: 'lumenwild',
    name: 'Lumenwild Fracture',
    region: 'Procedural Frontier · Seeded Expedition',
    scene: 'ExpeditionScene',
    unlocked: state => !!state.flags.stargate_local_relay,
    lockedReason: 'Stabilize the local relay first.'
  },
  {
    id: 'nova_plaza',
    name: 'Starfall Plaza',
    region: 'Nova Prime',
    map: 'nova_plaza',
    entry: { x: 14, y: 19, dir: 'up' },
    unlocked: () => true,
    lockedReason: ''
  },
  {
    id: 'shattered_gate',
    name: 'Shattered Gate Approach',
    region: 'Fractured Transit Ring',
    map: 'shattered_gate',
    entry: { x: 14, y: 17, dir: 'down' },
    unlocked: state => !!state.flags.stargate_local_relay,
    lockedReason: 'Report the relay diagnostic to Commander Reyes.'
  },
  {
    id: 'mirelight',
    name: 'Mirelight Deeps',
    region: 'Anura Frontier',
    map: 'mire_landing',
    entry: { x: 14, y: 19, dir: 'up' },
    unlocked: state => state.unlockedDestinations.includes('mirelight'),
    lockedReason: 'No stable gate signature.'
  },
  {
    id: 'ashfall',
    name: 'The Ashfall Gate',
    region: 'Ashfall Dominion',
    map: 'ash_gate',
    entry: { x: 14, y: 19, dir: 'up' },
    unlocked: state => state.unlockedDestinations.includes('ashfall'),
    lockedReason: 'No stable gate signature.'
  },
  {
    id: 'kessari',
    name: 'Kessari Docks',
    region: 'Kessari Reach',
    map: 'kess_docks',
    entry: { x: 14, y: 19, dir: 'up' },
    unlocked: state => state.unlockedDestinations.includes('kessari'),
    lockedReason: 'No stable gate signature.'
  }
];

export function travelRows(state, currentMap) {
  return TRAVEL_DESTINATIONS.map(destination => {
    const available = !!(destination.map || destination.scene) && destination.map !== currentMap && destination.unlocked(state);
    const current = destination.map === currentMap;
    return Object.assign({}, destination, {
      available,
      current,
      reason: current ? 'Current location' : available ? 'Route stable' : destination.lockedReason
    });
  });
}
