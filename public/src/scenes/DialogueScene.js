// ═══════════════════════════════════════════════════════════════
// DIALOGUE — Overlay scene: framed text box, speaker name plate,
// portrait, typewriter reveal, choice menus. Driven by the script
// runner via events; resolves each line/choice back to the runner.
// ═══════════════════════════════════════════════════════════════

import { GAME_W, GAME_H, DEPTH } from '../config.js';
import { pollInput, swallowInput } from '../engine/input.js';
import { drawWindow, MenuList } from '../engine/ui.js';
import { PixelText, wrapText } from '../art/font.js';
import { RAMP } from '../art/palette.js';
import { Settings, textDelayMs } from '../engine/settings.js';
import { uiSfx } from '../engine/audio.js';

const BOX_H = 84;
const BOX_M = 8;          // margin
const PORTRAIT_W = 96;    // portrait display size (48px art at 2x)

export class DialogueScene extends Phaser.Scene {
  constructor() { super({ key: 'DialogueScene' }); }

  create() {
    this.queue = null;
    this.active = false;
    this.box = null;
    this.visibleThisLine = false;
    // Runner talks to us through the game registry event bus
    this.game.events.on('dialogue:say', this.onSay, this);
    this.game.events.on('dialogue:choice', this.onChoice, this);
    this.game.events.on('dialogue:end', this.onEnd, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.onShutdown, this);
  }

  onShutdown() {
    this.game.events.off('dialogue:say', this.onSay, this);
    this.game.events.off('dialogue:choice', this.onChoice, this);
    this.game.events.off('dialogue:end', this.onEnd, this);
  }

  ensureBox() {
    if (this.box) return;
    const y = GAME_H - BOX_H - BOX_M;
    this.boxY = y;
    this.gfx = this.add.graphics().setDepth(DEPTH.UI);
    drawWindow(this.gfx, BOX_M, y, GAME_W - BOX_M * 2, BOX_H);
    this.box = true;
  }

  clearLine() {
    if (this.nameText) { this.nameText.destroy(); this.nameText = null; }
    if (this.nameGfx) { this.nameGfx.destroy(); this.nameGfx = null; }
    if (this.bodyText) { this.bodyText.destroy(); this.bodyText = null; }
    if (this.portrait) { this.portrait.destroy(); this.portrait = null; }
    if (this.advanceCue) { this.advanceCue.destroy(); this.advanceCue = null; }
  }

  // payload: {speaker, portrait, emote, text, resolve}
  onSay(payload) {
    this.ensureBox();
    this.clearLine();
    this.current = payload;
    this.active = true;
    const textScale = Settings.textScale;
    let tx = BOX_M + 12;
    const ty = this.boxY + 10;

    // portrait
    const pKey = payload.portrait ? 'portrait_' + payload.portrait + '_' + (payload.emote || 'neutral') : null;
    if (pKey && this.textures.exists(pKey)) {
      this.portrait = this.add.image(BOX_M + 8, this.boxY + BOX_H - 6, pKey)
        .setOrigin(0, 1).setScale(1).setDepth(DEPTH.UI + 1);
      // portrait art is 48x56; display at 1x inside the box
      tx = BOX_M + 8 + 56;
    }

    // name plate
    if (payload.speaker) {
      this.nameGfx = this.add.graphics().setDepth(DEPTH.UI + 1);
      const nw = payload.speaker.length * 6 * 1 + 16;
      drawWindow(this.nameGfx, tx - 4, this.boxY - 9, nw, 17, { fillAlpha: 1 });
      this.nameText = new PixelText(this, tx + 4, this.boxY - 4, payload.speaker, { scale: 1, color: RAMP.uiGold[3] });
      this.nameText.setDepth(DEPTH.UI + 2);
    }

    // body with typewriter
    this.fullText = payload.text;
    this.textX = tx; this.textY = ty + 8;
    this.maxW = GAME_W - BOX_M - 16 - tx;
    this.charsShown = 0;
    this.lastCharAt = 0;
    this.bodyText = new PixelText(this, this.textX, this.textY, '', {
      scale: textScale, maxWidth: this.maxW, color: 0xe8e8f4, lineH: 11
    });
    this.bodyText.setDepth(DEPTH.UI + 1);
    const delay = textDelayMs();
    if (delay === 0) {
      this.charsShown = this.fullText.length;
      this.bodyText.setText(this.fullText);
      this.showAdvanceCue();
    }
    swallowInput();
  }

  showAdvanceCue() {
    if (this.advanceCue) return;
    this.advanceCue = new PixelText(this, GAME_W - BOX_M - 18, this.boxY + BOX_H - 14, '↓', { scale: 1, color: RAMP.uiGold[3] });
    this.advanceCue.setDepth(DEPTH.UI + 1);
    if (!Settings.reducedMotion) {
      this.tweens.add({ targets: this.advanceCue, y: this.advanceCue.y + 2, duration: 350, yoyo: true, repeat: -1 });
    }
  }

  // payload: {prompt?, options: [{label, value}], resolve}
  onChoice(payload) {
    this.ensureBox();
    this.clearLine();
    this.choicePayload = payload;
    const opts = payload.options;
    if (payload.prompt) {
      this.bodyText = new PixelText(this, BOX_M + 12, this.boxY + 14, payload.prompt, {
        scale: Settings.textScale,
        maxWidth: GAME_W - BOX_M * 2 - 24,
        color: 0xe8e8f4
      });
      this.bodyText.setDepth(DEPTH.UI + 1);
    }
    const w = Math.max(...opts.map(o => o.label.length)) * 6 + 34;
    const h = opts.length * 14 + 18;
    const x = GAME_W - BOX_M - w - 8, y = this.boxY - h - 4;
    this.choiceGfx = this.add.graphics().setDepth(DEPTH.UI + 2);
    drawWindow(this.choiceGfx, x, y, w, h, { fillAlpha: 1 });
    this.choiceMenu = new MenuList(this, x + 6, y + 9, opts.map(o => ({ label: o.label, value: o.value })), {
      width: w - 12, lineH: 14,
      onSelect: (it) => {
        const resolve = payload.resolve;
        this.closeChoice();
        resolve(it.value);
      }
    });
    this.choiceMenu.setDepth(DEPTH.UI + 3);
    swallowInput();
  }

  closeChoice() {
    if (this.choiceGfx) { this.choiceGfx.destroy(); this.choiceGfx = null; }
    if (this.choiceMenu) { this.choiceMenu.destroy(); this.choiceMenu = null; }
    this.choicePayload = null;
  }

  onEnd() {
    this.clearLine();
    this.closeChoice();
    if (this.gfx) { this.gfx.destroy(); this.gfx = null; }
    this.box = null;
    this.active = false;
    this.scene.stop();
  }

  update(time, delta) {
    const inp = pollInput(this, time);

    if (this.choiceMenu) {
      this.choiceMenu.handle(inp);
      return;
    }

    if (!this.active || !this.current) return;

    const delay = textDelayMs();
    if (this.charsShown < this.fullText.length) {
      if (inp.confirmed || inp.cancelled) {
        // instant-complete
        this.charsShown = this.fullText.length;
        this.bodyText.setText(this.fullText);
        this.showAdvanceCue();
        return;
      }
      this.lastCharAt += delta;
      let advanced = false;
      while (this.lastCharAt >= delay && this.charsShown < this.fullText.length) {
        this.lastCharAt -= delay || 1;
        this.charsShown++;
        advanced = true;
      }
      if (advanced) {
        this.bodyText.setText(this.fullText.slice(0, this.charsShown));
        if (this.charsShown >= this.fullText.length) this.showAdvanceCue();
      }
    } else if (inp.confirmed) {
      uiSfx('cursor');
      const resolve = this.current.resolve;
      this.current = null;
      resolve();
    }
  }
}
