// ═══ LEADERBOARD — privacy-safe local fallback and ranking contract.

import { GAME_W, GAME_H } from '../config.js';
import { PixelText } from '../art/font.js';
import { RAMP } from '../art/palette.js';
import { Win, MenuList, uiDimColor } from '../engine/ui.js';
import { pollInput, swallowInput } from '../engine/input.js';
import { GameState } from '../game/state.js';
import { rankRuns } from '../expedition/runModel.js';
import { fetchSharedRuns, isSharedLeaderboardConfigured, leaderboardEndpoint } from '../expedition/leaderboardClient.js';

export class LeaderboardScene extends Phaser.Scene {
  constructor() { super({ key: 'LeaderboardScene' }); }
  init(data) { this.backScene = data.back || 'RunSummaryScene'; this.summary = data.summary || GameState.runHistory.at(-1); }

  create() {
    this.add.image(0, 0, 'starfield').setOrigin(0);
    const title = new PixelText(this, 0, 16, 'EXPEDITION LEADERBOARD', { scale: 2, color: RAMP.uiGold[4], align: 'center' });
    title.x = Math.round((GAME_W - title.textW) / 2);
    this.note = new PixelText(this, 0, 42, isSharedLeaderboardConfigured() ? 'Contacting the Crown Network…' : 'Local history · shared board available from run summary', { scale: 1, color: uiDimColor(), align: 'center' });
    this.centerNote();
    this.win = new Win(this, 24, 58, GAME_W - 48, 166);
    this.renderLocal();
    this.abort = new AbortController();
    if (isSharedLeaderboardConfigured()) this.loadShared();
    this.events.once('shutdown', () => this.abort.abort());
    this.menu = new MenuList(this, GAME_W / 2 - 56, 238, [{ label: 'Back', value: 'back' }], { width: 112, onSelect: () => this.goBack() });
    swallowInput();
  }

  centerNote() { this.note.x = Math.round((GAME_W - this.note.textW) / 2); }

  renderLocal() {
    this.clearRows();
    this.win.addText(16, 12, '#  RESULT       XP       LV  BOSSES  SEED', { scale: 1, color: RAMP.uiGold[3] });
    const ranked = rankRuns(GameState.runHistory).slice(0, 6);
    ranked.forEach((run, index) => {
      const latest = run.timestamp === this.summary?.timestamp && run.seed === this.summary?.seed;
      const line = `${String(index + 1).padStart(2)} ${String(run.result || '').toUpperCase().padEnd(10)} ${String(run.lifetimeXp || 0).padStart(7)}  ${String(run.finalLevel || 1).padStart(2)}  ${String(run.bossesDefeated?.length || 0).padStart(3)}    ${run.seed}`;
      this.win.addText(16, 38 + index * 20, line, { scale: 1, color: latest ? 0x66e8e0 : 0xe8e8f4 });
    });
    if (!ranked.length) this.win.addText(16, 42, 'No completed expeditions yet.', { scale: 1, color: uiDimColor() });
  }

  async loadShared() {
    try {
      const runs = await fetchSharedRuns(this.abort.signal);
      if (!this.scene.isActive()) return;
      this.clearRows();
      this.win.addText(16, 12, '#  PRINCESS      XP       LV  BOSSES  TIME', { scale: 1, color: RAMP.uiGold[3] });
      runs.slice(0, 6).forEach((run, index) => {
        const name = String(run.displayName || 'Princess').slice(0, 10).padEnd(10);
        const seconds = Math.floor((run.durationMs || 0) / 1000);
        const time = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
        const line = `${String(index + 1).padStart(2)} ${name} ${String(run.xp || 0).padStart(7)}  ${String(run.level || 1).padStart(2)}  ${String(run.bosses || 0).padStart(3)}    ${time}`;
        this.win.addText(16, 38 + index * 20, line, { scale: 1, color: 0xe8e8f4 });
      });
      if (!runs.length) this.win.addText(16, 42, 'No shared expeditions yet.', { scale: 1, color: uiDimColor() });
      this.note.setText('Shared Crown Network · ChatGPT-authenticated submissions');
    } catch {
      if (!this.scene.isActive()) return;
      this.note.setText(`Offline · showing local history · ${leaderboardEndpoint()}`);
    }
    this.centerNote();
  }

  clearRows() {
    this.win.list.slice(1).forEach(child => { this.win.remove(child); child.destroy(); });
  }

  goBack() { this.scene.start(this.backScene, { summary: this.summary }); }
  update(time) {
    const input = pollInput(this, time);
    if (input.cancelled || input.menued) this.goBack();
    else this.menu.handle(input);
  }
}
