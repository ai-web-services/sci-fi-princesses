// ═══════════════════════════════════════════════════════════════
// STORY CONTENT — Merges campaign content into authored geometry.
// Map files remain reusable; story predicates decide which actors
// and beats exist for the current save state.
// ═══════════════════════════════════════════════════════════════

import { npcsByMap as ACT1_NPCS, triggersByMap as ACT1_TRIGGERS, interactionsByMap as ACT1_INTERACTIONS } from './act1.js';
import { npcsByMap as ACT2_NPCS, triggersByMap as ACT2_TRIGGERS, interactionsByMap as ACT2_INTERACTIONS } from './act2_mirelight.js';

function mergeRegistries(...registries) {
  const merged = {};
  for (const registry of registries) {
    for (const [mapId, entries] of Object.entries(registry)) {
      merged[mapId] = [...(merged[mapId] || []), ...entries];
    }
  }
  return merged;
}

const npcsByMap = mergeRegistries(ACT1_NPCS, ACT2_NPCS);
const triggersByMap = mergeRegistries(ACT1_TRIGGERS, ACT2_TRIGGERS);
const interactionsByMap = mergeRegistries(ACT1_INTERACTIONS, ACT2_INTERACTIONS);

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
