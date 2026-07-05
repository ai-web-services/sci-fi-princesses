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
        equipment: { weapon: 'starlight_saber', armor: 'traveler_weave' },
        skillsKnown: ['lyra_strike', 'stellar_slash', 'guiding_light'],
        evolution: 0, build: {}
      }
    },                        // id → persistent character progression
    // resources
    gold: 120,
    inventory: [
      { id: 'potion', qty: 3 },
      { id: 'sp_tonic', qty: 1 },
      { id: 'revive_spark', qty: 1 }
    ],                        // [{id, qty}]
    // story
    flags: {},                // string → value
    decisions: {},            // major decision id → choice
    quests: {},               // questId → {stage, status:'active'|'done'|'failed'}
    relationships: {},        // charId → {bond, scenes:[], battles}
    world: {},                // consequence-flag namespace, string → value (D21)
    shards: [],               // shard ids collected
    novaStage: 0,             // home-base growth stage 0..3
    investments: [],          // home-base projects completed
    // location
    map: 'nova_plaza',
    x: 14, y: 17, dir: 'up',
    // records
    bestiary: {},             // enemyId → {seen, defeated, scanned}
    lore: [],                 // lore ids discovered
    tutorialsSeen: [],
    resonancesFound: [],
    mapsVisited: [],
    unlockedDestinations: ['nova_plaza'],
    trackedQuestId: null,
    mapChanges: {}
  };
  return GameState;
}

export function normalizeGameState(s) {
  if (!s) return s;
  if (!Array.isArray(s.mapsVisited)) s.mapsVisited = [];
  if (!Array.isArray(s.unlockedDestinations)) s.unlockedDestinations = ['nova_plaza'];
  if (s.trackedQuestId === undefined) s.trackedQuestId = null;
  if (!s.quests) s.quests = {};
  if (!s.flags) s.flags = {};
  if (!s.mapChanges || typeof s.mapChanges !== 'object') s.mapChanges = {};
  if (!Array.isArray(s.tutorialsSeen)) s.tutorialsSeen = Object.keys(s.tutorialsSeen || {});
  if (!s.world || typeof s.world !== 'object') s.world = {};
  if (!s.relationships || typeof s.relationships !== 'object') s.relationships = {};
  for (const id of Object.keys(s.relationships)) {
    const rel = s.relationships[id];
    if (rel && typeof rel.bond !== 'number') rel.bond = 0;
    if (rel && !Array.isArray(rel.scenes)) rel.scenes = [];
    if (rel && typeof rel.battles !== 'number') rel.battles = 0;
  }
  return s;
}

// World-flag helpers (D21) — single namespace consumed by dialogue/epilogue.
export function setWorldFlag(k, v = true) { GameState.world[k] = v; }
export function getWorldFlag(k) { return GameState ? GameState.world[k] : undefined; }

export function setGameState(s) { GameState = normalizeGameState(s); }

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
  GameState = normalizeGameState(payload.state);
  return true;
}

// Flag helpers
export function setFlag(k, v = true) { GameState.flags[k] = v; }
export function getFlag(k) { return GameState ? GameState.flags[k] : undefined; }

export function formatPlaytime(sec) {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60);
  return h + 'h ' + String(m).padStart(2, '0') + 'm';
}
