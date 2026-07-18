// ═══ RUN SUMMARY — victory, extraction, or defeat settlement.

import { GAME_W, GAME_H } from '../config.js';
import { PixelText } from '../art/font.js';
import { RAMP } from '../art/palette.js';
import { Win, MenuList, uiDimColor } from '../engine/ui.js';
import { pollInput, swallowInput } from '../engine/input.js';
import { GameState } from '../game/state.js';
import { submitSharedRun } from '../expedition/leaderboardClient.js';
import { sharedSubmissionUrl } from '../expedition/leaderboardClient.js';

function duration(ms) {
  const seconds = Math.floor((ms || 0) / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

export class RunSummaryScene extends Phaser.Scene {
  constructor() { super({ key: 'RunSummaryScene' }); }

  init(data) { this.summary = data.summary || GameState.runHistory.at(-1); }

  create() {
    this.add.image(0, 0, 'starfield').setOrigin(0);
    const result = (this.summary?.result || 'extracted').toUpperCase();
    const color = result === 'VICTORY' ? RAMP.uiGold[4] : result === 'DEFEAT' ? 0xff6b7d : 0x66e8e0;
    const title = new PixelText(this, 0, 18, `EXPEDITION ${result}`, { scale: 2, color, align: 'center' });
    title.x = Math.round((GAME_W - title.textW) / 2);
    this.win = new Win(this, 48, 52, GAME_W - 96, 142);
    const boss = this.summary?.bossesDefeated?.length ? this.summary.bossesDefeated.join(', ').toUpperCase() : 'None';
    const mastery = this.summary?.weaponMastery || {};
    const rows = [
      ['Level', this.summary?.finalLevel || 1],
      ['Lifetime XP', this.summary?.lifetimeXp || 0],
      ['Duration', duration(this.summary?.durationMs)],
      ['Objective', boss],
      ['Seed', this.summary?.seed ?? '—'],
      ['Mastery', `B${mastery.blade || 0}  L${mastery.lance || 0}  W${mastery.wand || 0}`]
    ];
    rows.forEach(([label, value], index) => {
      this.win.addText(18, 12 + index * 19, label, { scale: 1, color: uiDimColor() });
      const text = this.win.addText(0, 12 + index * 19, String(value), { scale: 1, color: 0xe8e8f4 });
      text.x = this.win.w - 20 - text.textW;
    });
    this.menu = new MenuList(this, GAME_W / 2 - 90, 206, [
      { label: 'Return to Nova Prime', value: 'return' },
      { label: 'View Local Records', value: 'leaderboard' },
      { label: 'Open Shared Board', value: 'shared' }
    ], { width: 180, lineH: 17, onSelect: item => this.choose(item.value) });
    submitSharedRun(this.summary).catch(() => {});
    swallowInput();
  }

  choose(value) {
    if (value === 'leaderboard') this.scene.start('LeaderboardScene', { back: 'RunSummaryScene', summary: this.summary });
    else if (value === 'shared') globalThis.open(sharedSubmissionUrl(this.summary), '_blank', 'noopener,noreferrer');
    else this.scene.start('MapScene');
  }

  update(time) { this.menu.handle(pollInput(this, time)); }
}
