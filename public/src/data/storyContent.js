// ═══════════════════════════════════════════════════════════════
// STORY CONTENT — Merges campaign content into authored geometry.
// Map files remain reusable; story predicates decide which actors
// and beats exist for the current save state.
// ═══════════════════════════════════════════════════════════════

import { npcsByMap, triggersByMap, interactionsByMap } from './act1.js';

const SERVICE_SCRIPTS = {
  weapons_smith: [
    { say: { speaker: 'Sunforge Smith', text: 'A balanced edge buys more time than a heroic speech.' } },
    { shop: 'weapons' }
  ],
  armor_tailor: [
    { say: { speaker: 'Aegis Tailor', text: 'Protection should fit the person, not just the danger.' } },
    { shop: 'armor' }
  ],
  materials_broker: [
    { say: { speaker: 'Materials Broker', text: 'Everything here has been screened for Void contamination. Twice.' } },
    { shop: 'materials' }
  ],
  hall_medic: [
    { say: { speaker: 'Hall Medic', text: 'Take what you need, and rest before exhaustion makes the choice for you.' } },
    { shop: 'healer' }
  ],
  tavern_host: [
    { say: { speaker: 'Tavern Host', text: 'Twenty gold buys a room, a hot meal, and a night without alarms.' } },
    { rest: { cost: 20, location: 'The Orbiting Crown' } }
  ]
};

export function mergeStoryContent(map, state) {
  const baseNpcs = (map.npcs || []).map(npc =>
    SERVICE_SCRIPTS[npc.id] ? Object.assign({}, npc, { script: SERVICE_SCRIPTS[npc.id] }) : npc);
  const eligibleNpcs = (npcsByMap[map.id] || []).filter(npc => !npc.if || npc.if(state));
  return Object.assign({}, map, {
    npcs: [...baseNpcs, ...eligibleNpcs],
    triggers: [...(map.triggers || []), ...(triggersByMap[map.id] || [])],
    interactions: [...(map.interactions || []), ...(interactionsByMap[map.id] || [])]
  });
}
