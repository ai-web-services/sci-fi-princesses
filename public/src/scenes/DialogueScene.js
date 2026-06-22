// ═══════════════════════════════════════════════════════════════
// DIALOGUE SCENE — Overlay for NPC/sign text, typewriter + choices
// ═══════════════════════════════════════════════════════════════

import { GAME_W, GAME_H } from '../config.js';
import { GameData, gameSave } from '../gameData.js';
import { getInput } from '../input.js';
import { AudioSys } from '../audio.js';

export class DialogueScene extends Phaser.Scene {
  constructor() { super({ key: 'DialogueScene' }); }

  create(data) {
    this.mainScene = data.scene;
    this.npcData = data.npc || null;
    this.lines = data.npc ? data.npc.dialogue : [data.text];
    this.isNPC = !!data.npc;
    this.curLine = 0;
    this.curChar = 0;
    this.charTimer = 0;
    this.done = false;
    this.choices = null;
    this.choiceIndex = 0;
    this.choiceTexts = [];
    this.interactPressed = false;
    this.dyPressed = 0;

    this.box = this.add.rectangle(GAME_W/2, GAME_H - 40, GAME_W - 8, 64, 0x0a0a1a, 0.92).setDepth(200);
    this.box.setStrokeStyle(1, 0x4488ff);

    if (data.npc) {
      this.nameText = this.add.text(12, this.box.y - 28, data.npc.name, { fontSize: '11px', fontFamily: 'monospace', color: '#44ddff' }).setDepth(201);
    }

    this.textText = this.add.text(12, this.box.y - 14, '', { fontSize: '11px', fontFamily: 'monospace', color: '#dddddd', wordWrap: { width: GAME_W - 28 } }).setDepth(201);
  }

  update() {
    if (this.done) return;

    const { dy, interact } = getInput(this);

    this.charTimer++;
    if (this.charTimer >= 2) {
      this.charTimer = 0;
      if (!this.choices && this.curChar < this.lines[this.curLine].length) {
        this.curChar++;
        this.textText.setText(this.lines[this.curLine].substring(0, this.curChar));
      }
    }

    if (this.choices) {
      if (dy < 0 && this.choiceIndex > 0) this.choiceIndex--;
      if (dy > 0 && this.choiceIndex < this.choices.length - 1) this.choiceIndex++;
      this.choiceTexts.forEach((t, i) => {
        const isSel = i === this.choiceIndex;
        t.setColor(isSel ? '#ffffff' : '#aaaaaa');
        t.setText((isSel ? '> ' : '  ') + this.choices[i]);
      });
      if (interact) {
        if (this.choiceIndex === 0 && this.npcData && this.npcData.recruitable) this.recruit();
        this.done = true;
        this.scene.stop();
        if (this.mainScene) this.mainScene.scene.resume();
      }
    } else {
      if (interact) {
        if (this.curChar < this.lines[this.curLine].length) {
          this.curChar = this.lines[this.curLine].length;
          this.textText.setText(this.lines[this.curLine]);
        } else {
          this.curLine++;
          if (this.curLine >= this.lines.length) {
            if (this.isNPC && this.mainScene) {
              this.choices = ['Invite ' + this.npcData.name + ' to join', 'Maybe later'];
              this.choiceIndex = 0;
              this.textText.setText('');
              this.choiceTexts.forEach(t => t.destroy());
              this.choiceTexts = [];
              this.choices.forEach((c, i) => {
                const color = i === this.choiceIndex ? '#ffffff' : '#aaaaaa';
                const prefix = i === this.choiceIndex ? '> ' : '  ';
                this.choiceTexts.push(this.add.text(14, this.box.y - 14 + i * 16, prefix + c, { fontSize: '11px', fontFamily: 'monospace', color: color }).setDepth(201));
              });
            } else {
              this.done = true;
              this.scene.stop();
              if (this.mainScene) this.mainScene.scene.resume();
            }
          } else { this.curChar = 0; this.charTimer = 0; }
        }
      }
    }
  }

  recruit() {
    const npc = this.npcData;
    if (!npc) return;
    AudioSys.sfx.recruit();
    const names = { cat: 'Erynn "Eryx" Vexx', frog: 'Brimble', dragon: 'Drakkor Ashveil', robot: 'Pip' };
    const species = { cat: 'cat', frog: 'frog', dragon: 'dragon', robot: 'robot' };
    const s = species[npc.type] || 'human';
    GameData.party.push({
      name: names[npc.type] || 'Recruit', species: s, level: 1, xp: 0, xpToLevel: 100,
      hp: s==='frog'?120:s==='dragon'?100:s==='robot'?50:60,
      maxHp: s==='frog'?120:s==='dragon'?100:s==='robot'?50:60,
      sp: 25, maxSp: 25, atk: s==='dragon'?18:15, def: s==='frog'?15:5, spd: s==='frog'?6:18, crit: s==='cat'?20:5,
      equipment: {weapon:null,armor:null,accessory1:null,accessory2:null,implant:null},
      skills: [], evolution: 0, evolutionName: s.charAt(0).toUpperCase()+s.slice(1)
    });
    GameData.questFlags['recruited_' + npc.name] = true;
    const npcImg = this.mainScene.npcSprites.find(n => n.npcData.name === npc.name);
    if (npcImg) npcImg.setVisible(false);
    gameSave();
  }
}
