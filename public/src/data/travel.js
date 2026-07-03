// ═══════════════════════════════════════════════════════════════
// TRAVEL — Data-driven Stargate destinations and arrival entries.
// Availability remains state-based so future regions can register
// without adding scene branches.
// ═══════════════════════════════════════════════════════════════

export const TRAVEL_DESTINATIONS = [
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
    map: null,
    entry: null,
    unlocked: state => state.unlockedDestinations.includes('mirelight'),
    lockedReason: 'No stable gate signature.'
  }
];

export function travelRows(state, currentMap) {
  return TRAVEL_DESTINATIONS.map(destination => {
    const available = !!destination.map && destination.map !== currentMap && destination.unlocked(state);
    const current = destination.map === currentMap;
    return Object.assign({}, destination, {
      available,
      current,
      reason: current ? 'Current location' : available ? 'Route stable' : destination.lockedReason
    });
  });
}
