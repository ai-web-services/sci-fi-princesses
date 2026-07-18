// ═══════════════════════════════════════════════════════════════
// QUEST JOURNAL — Active objectives, completed history, and
// multi-stage progress. Launched as an overlay above MapScene.
// ═══════════════════════════════════════════════════════════════

import { GAME_W, GAME_H } from '../config.js';
import { PixelText } from '../art/font.js';
import { RAMP } from '../art/palette.js';
import { pollInput, swallowInput } from '../engine/input.js';
import { Win, MenuList, uiDimColor, uiTextColor } from '../engine/ui.js';
import { uiSfx } from '../engine/audio.js';
import { GameState } from '../game/state.js';
import { getQuestDefinition, questObjective, questTitle } from '../data/quests.js';

const TABS = ['active', 'done'];
const TAB_LABELS = { active: 'ACTIVE', done: 'COMPLETED' };

function statusMatches(progress, tab) {
  const status = progress.status || 'active';
  return tab === 'done' ? status === 'done' || status === 'failed' : status === 'active';
}

function typeLabel(type) {
  if (type === 'companion') return 'COMPANION QUEST';
  if (type === 'side') return 'SIDE QUEST';
  return 'MAIN QUEST';
}

export class QuestJournalScene extends Phaser.Scene {
  constructor() { super({ key: 'QuestJournalScene' }); }

  init(data) {
    this.parentScene = (data && data.parentScene) || 'MapScene';
    this.tab = (data && data.tab) === 'done' ? 'done' : 'active';
    this.savedIndices = { active: 0, done: 0 };
  }

  create() {
    const shade = this.add.graphics();
    shade.fillStyle(0x070510, 0.78);
    shade.fillRect(0, 0, GAME_W, GAME_H);

    this.win = new Win(this, 18, 16, GAME_W - 36, GAME_H - 32);
    this.win.addText(16, 12, 'QUEST JOURNAL', { scale: 2, color: RAMP.uiGold[3] });
    this.tabText = this.win.addText(0, 16, '', { scale: 1, color: RAMP.uiGold[4] });
    this.hint = this.win.addText(16, this.win.h - 19,
      'Page/Left-Right section · Confirm track · Cancel close',
      { scale: 1, color: uiDimColor() });

    this.buildTab();
    swallowInput();
  }

  questRows() {
    if (!GameState || !GameState.quests) return [];
    return Object.entries(GameState.quests)
      .filter(([, progress]) => progress && statusMatches(progress, this.tab))
      .map(([id, progress]) => ({ id, progress, definition: getQuestDefinition(id) }))
      .sort((a, b) => questTitle(a.id).localeCompare(questTitle(b.id)));
  }

  clearContent() {
    if (this.menu) { this.menu.destroy(); this.menu = null; }
    if (this.detail) { this.detail.destroy(); this.detail = null; }
    if (this.emptyText) { this.emptyText.destroy(); this.emptyText = null; }
  }

  buildTab() {
    this.clearContent();
    const tabIndex = TABS.indexOf(this.tab);
    this.tabText.setText(
      (tabIndex === 0 ? '◆ ' : '○ ') + TAB_LABELS.active +
      '     ' + (tabIndex === 1 ? '◆ ' : '○ ') + TAB_LABELS.done
    );
    this.tabText.x = this.win.w - this.tabText.textW - 16;

    const rows = this.questRows();
    if (!rows.length) {
      const message = this.tab === 'done'
        ? 'No completed quests yet.\nYour finished journeys will be recorded here.'
        : 'No active quests.\nExplore Nova Prime and speak with its people.';
      this.emptyText = new PixelText(this, 0, 142, message, {
        scale: 1, color: uiDimColor(), align: 'center', lineH: 14
      });
      this.emptyText.x = Math.round((GAME_W - this.emptyText.textW) / 2);
      return;
    }

    const items = rows.map(row => ({
      label: (GameState.trackedQuestId === row.id ? '▶ ' : '  ') + questTitle(row.id),
      value: row.id,
      row,
      color: row.definition && row.definition.type === 'main' ? RAMP.uiGold[4] : uiTextColor()
    }));
    this.menu = new MenuList(this, this.win.x + 16, this.win.y + 50, items, {
      width: 194,
      lineH: 18,
      visible: 8,
      onChange: item => this.showDetail(item.row),
      onSelect: item => this.toggleTracked(item.row),
      onCancel: () => this.close()
    });
    this.menu.index = Math.min(this.savedIndices[this.tab] || 0, items.length - 1);
    this.menu.positionCursor();
    this.showDetail(items[this.menu.index].row);
  }

  toggleTracked(row) {
    if (this.tab !== 'active' || !row) {
      uiSfx('error');
      return;
    }
    GameState.trackedQuestId = GameState.trackedQuestId === row.id ? null : row.id;
    this.savedIndices[this.tab] = this.menu ? this.menu.index : 0;
    this.buildTab();
  }

  showDetail(row) {
    if (this.detail) this.detail.destroy();
    this.detail = new Win(this, this.win.x + 224, this.win.y + 48, this.win.w - 240, this.win.h - 82, {
      gemColor: this.tab === 'done' ? RAMP.xp[3] : RAMP.uiGold[3]
    });

    const definition = row.definition;
    const progress = row.progress;
    const title = questTitle(row.id);
    this.detail.addText(14, 12, title, { scale: 1, color: RAMP.uiGold[4], maxWidth: this.detail.w - 28 });
    this.detail.addText(14, 28, typeLabel(definition && definition.type), {
      scale: 1, color: uiDimColor()
    });

    let y = 48;
    if (definition && definition.summary) {
      const summary = this.detail.addText(14, y, definition.summary, {
        scale: 1, color: uiTextColor(), maxWidth: this.detail.w - 28, lineH: 10
      });
      y += summary.textH + 12;
    }

    this.detail.addText(14, y, this.tab === 'done' ? 'FINAL OBJECTIVE' : 'CURRENT OBJECTIVE', {
      scale: 1, color: this.tab === 'done' ? RAMP.xp[3] : RAMP.uiGold[3]
    });
    y += 14;
    const objective = this.detail.addText(
      14, y,
      (this.tab === 'done' ? '◆ ' : '▶ ') + questObjective(row.id, progress.stage),
      { scale: 1, color: uiTextColor(), maxWidth: this.detail.w - 28, lineH: 10 }
    );
    y += objective.textH + 12;

    if (definition && definition.stages.length > 1 && y < this.detail.h - 24) {
      this.detail.addText(14, y, 'PROGRESS', { scale: 1, color: uiDimColor() });
      y += 14;
      const current = Math.max(1, Number(progress.stage) || 1);
      const lines = definition.stages.map((stage, index) => {
        const number = index + 1;
        const complete = this.tab === 'done' || number < current;
        const marker = complete ? '◆' : number === current ? '▶' : '○';
        return marker + ' ' + stage;
      }).join('\n');
      this.detail.addText(14, y, lines, {
        scale: 1, color: uiDimColor(), maxWidth: this.detail.w - 28, lineH: 11
      });
    }
  }

  changeTab(dir) {
    if (this.menu) this.savedIndices[this.tab] = this.menu.index;
    const index = TABS.indexOf(this.tab);
    this.tab = TABS[(index + dir + TABS.length) % TABS.length];
    uiSfx('cursor');
    this.buildTab();
  }

  close() {
    uiSfx('cancel');
    swallowInput();
    this.scene.stop();
    const parent = this.scene.get(this.parentScene);
    if (parent && parent.scene) {
      parent.modalOpen = false;
      parent.scene.resume();
    }
  }

  update(time) {
    const inp = pollInput(this, time);
    if (inp.pageLd || inp.leftRepeat) { this.changeTab(-1); return; }
    if (inp.pageRd || inp.rightRepeat) { this.changeTab(1); return; }
    if (inp.cancelled || inp.menued) { this.close(); return; }
    if (this.menu) this.menu.handle(inp);
  }
}
