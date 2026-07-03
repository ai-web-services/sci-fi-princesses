// ═══════════════════════════════════════════════════════════════
// SAVE — Slot-based persistence with autosave, versioned schema,
// checksums, and double-write corruption protection.
//
// Layout in localStorage:
//   stellar_save_v2_slot0..2   manual slots
//   stellar_save_v2_slotauto   rotating autosave
//   <key>_bak                  previous good write (fallback)
// ═══════════════════════════════════════════════════════════════

import { SAVE_PREFIX, SAVE_SCHEMA_VERSION } from '../config.js';

export const SLOTS = ['0', '1', '2'];
export const AUTO_SLOT = 'auto';

// FNV-1a hash for corruption detection
function checksum(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h.toString(16);
}

function key(slot) { return SAVE_PREFIX + slot; }

// ── Migrations ─────────────────────────────────────────
// Each entry upgrades a payload from version N to N+1.
const MIGRATIONS = {
  1: (data) => {
    const state = data.state || {};
    if (!Array.isArray(state.mapsVisited)) state.mapsVisited = [];
    if (!Array.isArray(state.unlockedDestinations)) {
      state.unlockedDestinations = ['nova_plaza'];
    }
    if (state.trackedQuestId === undefined) state.trackedQuestId = null;
    data.state = state;
    return data;
  },
  2: (data) => {
    const state = data.state || {};
    if (!state.mapChanges || typeof state.mapChanges !== 'object') state.mapChanges = {};
    if (!Array.isArray(state.tutorialsSeen)) {
      state.tutorialsSeen = Object.keys(state.tutorialsSeen || {});
    }
    data.state = state;
    return data;
  }
};

function migrate(data) {
  let v = data.version || 1;
  while (v < SAVE_SCHEMA_VERSION) {
    const fn = MIGRATIONS[v];
    if (!fn) break;
    data = fn(data);
    v++;
    data.version = v;
  }
  return data;
}

// ── Core I/O ───────────────────────────────────────────
export function writeSave(slot, state, meta = {}) {
  const payload = {
    version: SAVE_SCHEMA_VERSION,
    savedAt: Date.now(),
    meta,           // { chapter, location, playtime, partyLine, level }
    state
  };
  const body = JSON.stringify(payload);
  const record = JSON.stringify({ sum: checksum(body), body });
  try {
    const k = key(slot);
    const prev = localStorage.getItem(k);
    if (prev) localStorage.setItem(k + '_bak', prev);   // keep last good copy
    localStorage.setItem(k, record);
    return true;
  } catch (e) {
    return false;
  }
}

function parseRecord(raw) {
  if (!raw) return null;
  try {
    const rec = JSON.parse(raw);
    if (!rec || typeof rec.body !== 'string') return null;
    if (checksum(rec.body) !== rec.sum) return null;    // corrupted
    return migrate(JSON.parse(rec.body));
  } catch (e) { return null; }
}

export function readSave(slot) {
  const k = key(slot);
  let payload = null;
  try { payload = parseRecord(localStorage.getItem(k)); } catch (e) { /* ignore */ }
  if (!payload) {
    // fall back to backup copy
    try { payload = parseRecord(localStorage.getItem(k + '_bak')); } catch (e) { /* ignore */ }
  }
  return payload;   // {version, savedAt, meta, state} | null
}

export function saveExists(slot) {
  try { return !!localStorage.getItem(key(slot)) || !!localStorage.getItem(key(slot) + '_bak'); }
  catch (e) { return false; }
}

export function deleteSave(slot) {
  try {
    localStorage.removeItem(key(slot));
    localStorage.removeItem(key(slot) + '_bak');
  } catch (e) { /* ignore */ }
}

// Summaries for the save/load UI. Returns array of {slot, meta, savedAt} | {slot, empty:true}
export function listSaves() {
  const all = [...SLOTS, AUTO_SLOT];
  return all.map(slot => {
    const p = readSave(slot);
    if (!p) return { slot, empty: true };
    return { slot, meta: p.meta || {}, savedAt: p.savedAt, version: p.version };
  });
}
