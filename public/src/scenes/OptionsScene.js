// ═══════════════════════════════════════════════════════════════
// OPTIONS — Volumes, text, accessibility, difficulty.
// Left/right adjusts; changes persist immediately.
// ═══════════════════════════════════════════════════════════════

import { GAME_W, GAME_H } from '../config.js';
import { pollInput, swallowInput } from '../engine/input.js';
import { Win, MenuList } from '../engine/ui.js';
import { PixelText } from '../art/font.js';
import { RAMP } from '../art/palette.js';
import { Settings, saveSettings } from '../engine/settings.js';
import { applyVolumes, uiSfx } from '../engine/audio.js';
import { transition } from '../engine/fx.js';

const TEXT_SPEEDS = ['slow', 'normal', 'fast', 'instant'];
const DIFFICULTIES = ['story', 'adventurer', 'veteran'];

function volBar(v) {
  const n = Math.round(v * 10);
  return '●'.repeat(n) + '○'.repeat(10 - n);
}
function onOff(b) { return b ? 'On' : 'Off'; }
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

export class OptionsScene extends Phaser.Scene {
  constructor() { super({ key: 'OptionsScene' }); }

  init(data) {
    this.backScene = (data && data.back) || 'TitleScene';
  }

  create() {
    this.add.image(0, 0, 'starfield').setOrigin(0, 0).setAlpha(0.5);
    this.win = new Win(this, GAME_W / 2 - 190, 24, 380, GAME_H - 48);
    this.win.addText(14, 12, 'OPTIONS', { scale: 2, color: RAMP.uiGold[3] });
    this.hint = this.win.addText(14, this.win.h - 22, '←/→ adjust · Confirm toggle · Cancel back', { scale: 1, color: 0x8888aa });
    this.savedIndex = 0;
    this.buildMenu();
    swallowInput();
  }

  rows() {
    return [
      { label: 'Master Volume', value: 'masterVol', right: volBar(Settings.masterVol) },
      { label: 'Music Volume', value: 'musicVol', right: volBar(Settings.musicVol) },
      { label: 'Sound Volume', value: 'sfxVol', right: volBar(Settings.sfxVol) },
      { label: 'Menu Volume', value: 'uiVol', right: volBar(Settings.uiVol) },
      { label: 'Text Speed', value: 'textSpeed', right: cap(Settings.textSpeed) },
      { label: 'Reduced Motion', value: 'reducedMotion', right: onOff(Settings.reducedMotion) },
      { label: 'Reduced Flashing', value: 'reducedFlash', right: onOff(Settings.reducedFlash) },
      { label: 'High Contrast UI', value: 'highContrast', right: onOff(Settings.highContrast) },
      { label: 'Combat Info Icons', value: 'showCombatIcons', right: onOff(Settings.showCombatIcons) },
      { label: 'Difficulty', value: 'difficulty', right: cap(Settings.difficulty) },
      { label: 'Back', value: 'back', right: '' }
    ];
  }

  buildMenu() {
    if (this.menu) this.menu.destroy();
    const items = this.rows();
    this.menu = new MenuList(this, this.win.x + 14, this.win.y + 40, items, {
      width: 350, lineH: 18, visible: 11,
      rightTexts: items.map(i => i.right),
      onSelect: (it) => this.activate(it.value),
      onCancel: () => this.goBack()
    });
    this.menu.index = Math.min(this.savedIndex, items.length - 1);
    this.menu.positionCursor();
  }

  adjust(value, dir) {
    switch (value) {
      case 'masterVol': case 'musicVol': case 'sfxVol': case 'uiVol': {
        Settings[value] = Math.max(0, Math.min(1, Math.round((Settings[value] + dir * 0.1) * 10) / 10));
        applyVolumes();
        uiSfx('cursor');
        break;
      }
      case 'textSpeed': {
        const i = TEXT_SPEEDS.indexOf(Settings.textSpeed);
        Settings.textSpeed = TEXT_SPEEDS[(i + dir + TEXT_SPEEDS.length) % TEXT_SPEEDS.length];
        break;
      }
      case 'difficulty': {
        const i = DIFFICULTIES.indexOf(Settings.difficulty);
        Settings.difficulty = DIFFICULTIES[(i + dir + DIFFICULTIES.length) % DIFFICULTIES.length];
        break;
      }
      case 'reducedMotion': Settings.reducedMotion = !Settings.reducedMotion; break;
      case 'reducedFlash': Settings.reducedFlash = !Settings.reducedFlash; break;
      case 'highContrast': Settings.highContrast = !Settings.highContrast; break;
      case 'showCombatIcons': Settings.showCombatIcons = !Settings.showCombatIcons; break;
      default: return;
    }
    saveSettings();
    this.savedIndex = this.menu.index;
    this.buildMenu();
  }

  activate(value) {
    if (value === 'back') { this.goBack(); return; }
    this.adjust(value, 1);
  }

  goBack() {
    transition(this, this.backScene, {});
  }

  update(time) {
    const inp = pollInput(this, time);
    const sel = this.menu.selected;
    if (sel && sel.value !== 'back') {
      if (inp.leftRepeat) { this.adjust(sel.value, -1); return; }
      if (inp.rightRepeat) { this.adjust(sel.value, 1); return; }
    }
    this.menu.handle(inp);
  }
}
