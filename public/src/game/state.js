// ═══════════════════════════════════════════════════════════════
// STATE — Runtime game state: party, inventory, flags, quests,
// relationships, world condition. Serialized into save slots.
// ═══════════════════════════════════════════════════════════════

import { writeSave, readSave, AUTO_SLOT } from '../engine/save.js';

export let GameState = null;

// Create a fresh new-game state. Character/stat details are built by
// game/party.js from data definitions; this holds pure progress data.
export function newGameState() {
  GameState = {
    // meta
    playtime: 0,              // seconds
    chapter: 'c1_fall',       // story chapter id
    slot: null,               // last manual slot used
    // party & growth
    roster: ['lyra'],         // characterIds in recruit order
    active: ['lyra'],         // up to 3 active characterIds
    chars: {
      lyra: {
        level: 1, xp: 0, hp: 110, maxHp: 110, sp: 48, maxSp: 48,
        equipment: {}, skillsKnown: ['lyra_strike', 'stellar_slash', 'guiding_light'],
        evolution: 0, build: {}
      }
    },                        // id → persistent character progression
    // resources
    gold: 120,
    inventory: [],            // [{id, qty}]
    // story
    flags: {},                // string → value
    decisions: {},            // major decision id → choice
    quests: {},               // questId → {stage, status:'active'|'done'|'failed'}
    relationships: {},        // charId → {bond, scenes:[]}
    shards: [],               // shard ids collected
    novaStage: 0,             // home-base growth stage 0..3
    investments: [],          // home-base projects completed
    // location
    map: 'nova_plaza',
    x: 10, y: 8, dir: 'down',
    // records
    bestiary: {},             // enemyId → {seen, defeated, scanned}
    lore: [],                 // lore ids discovered
    tutorialsSeen: {},
    resonancesFound: [],
    mapsVisited: []
  };
  return GameState;
}

export function setGameState(s) { GameState = s; }

// Build save meta shown in slot UI.
export function saveMeta(locationName) {
  const lead = GameState.roster[0];
  const leadLevel = lead && GameState.chars[lead] ? GameState.chars[lead].level : 1;
  return {
    chapter: GameState.chapter,
    location: locationName || GameState.map,
    playtime: Math.floor(GameState.playtime),
    party: GameState.roster.slice(0, 4),
    level: leadLevel,
    shards: GameState.shards.length
  };
}

export function saveToSlot(slot, locationName) {
  if (!GameState) return false;
  GameState.slot = slot;
  return writeSave(slot, GameState, saveMeta(locationName));
}

export function autoSave(locationName) {
  if (!GameState) return false;
  return writeSave(AUTO_SLOT, GameState, saveMeta(locationName));
}

export function loadFromSlot(slot) {
  const payload = readSave(slot);
  if (!payload) return false;
  GameState = payload.state;
  return true;
}

// Flag helpers
export function setFlag(k, v = true) { GameState.flags[k] = v; }
export function getFlag(k) { return GameState ? GameState.flags[k] : undefined; }

export function formatPlaytime(sec) {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60);
  return h + 'h ' + String(m).padStart(2, '0') + 'm';
}
