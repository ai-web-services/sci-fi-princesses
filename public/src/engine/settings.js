// ═══════════════════════════════════════════════════════════════
// SETTINGS — Options, accessibility, difficulty. Persisted
// independently of save slots so preferences survive playthroughs.
// ═══════════════════════════════════════════════════════════════

import { SETTINGS_KEY, DIFFICULTY_PRESETS } from '../config.js';

export const DEFAULT_BINDINGS = {
  keyboard: {
    up: ['W', 'UP'], down: ['S', 'DOWN'], left: ['A', 'LEFT'], right: ['D', 'RIGHT'],
    confirm: ['Z', 'SPACE', 'ENTER'], cancel: ['X', 'ESC'],
    menu: ['C'], pageL: ['Q'], pageR: ['E'],
    actionSkill: ['F'], companion: ['R']
  },
  gamepad: {
    up: [12], down: [13], left: [14], right: [15],
    confirm: [0], cancel: [1], menu: [9], pageL: [4], pageR: [5],
    actionSkill: [2], companion: [3]
  }
};

export const Settings = {
  // audio
  masterVol: 0.8, musicVol: 0.7, sfxVol: 0.8, uiVol: 0.8,
  // text
  textSpeed: 'normal',        // slow | normal | fast | instant
  textScale: 1,               // 1 | 2 (dialogue text)
  // visual accessibility
  reducedMotion: false,       // dampens shake/parallax/idle bobbing
  reducedFlash: false,        // removes full-screen flashes, dims bursts
  screenShake: 1,            // 0..1 intensity multiplier
  flashIntensity: 1,         // 0..1 alpha multiplier
  reducedParticles: false,   // lower transient effect budgets
  damageNumbers: true,       // combat damage flyouts
  hitStop: true,             // brief impact pauses on critical hits
  highContrast: false,        // stronger UI contrast + selection markers
  showCombatIcons: true,      // element/status icons beside colors (colorblind-safe)
  // difficulty
  difficulty: 'adventurer',   // story | adventurer | veteran
  assists: {},                // per-field overrides of preset values
  // controls
  bindings: JSON.parse(JSON.stringify(DEFAULT_BINDINGS)),
  // meta
  seenTutorials: {}
};

export function textDelayMs() {
  return { slow: 55, normal: 28, fast: 12, instant: 0 }[Settings.textSpeed] ?? 28;
}

// Effective difficulty values = preset + assist overrides.
export function difficultyValues() {
  const preset = DIFFICULTY_PRESETS[Settings.difficulty] || DIFFICULTY_PRESETS.adventurer;
  return Object.assign({}, preset, Settings.assists);
}

export function saveSettings() {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(Settings)); } catch (e) { /* private mode */ }
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    // shallow merge known keys only — forward compatible
    for (const k of Object.keys(Settings)) {
      if (d[k] !== undefined) Settings[k] = d[k];
    }
    // ensure all binding actions exist (new actions added in updates)
    for (const dev of ['keyboard', 'gamepad']) {
      Settings.bindings[dev] = Object.assign(
        JSON.parse(JSON.stringify(DEFAULT_BINDINGS[dev])),
        Settings.bindings[dev] || {}
      );
    }
  } catch (e) { /* corrupted settings → defaults */ }
}

export function resetBindings() {
  Settings.bindings = JSON.parse(JSON.stringify(DEFAULT_BINDINGS));
  saveSettings();
}
