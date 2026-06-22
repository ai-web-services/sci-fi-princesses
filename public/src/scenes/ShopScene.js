// ═══════════════════════════════════════════════════════════════
// SHOP SCENE — Overlay for buying/selling items
// ═══════════════════════════════════════════════════════════════

import { GAME_W, GAME_H } from '../config.js';
import { GameData, gameSave } from '../gameData.js';
import { getInput } from '../input.js';
import { AudioSys } from '../audio.js';

export class ShopScene extends Phaser.Scene {
  constructor() { super({ key: 'ShopScene' }); }

  create(data) {
    this.shopType = data.shopType;
    this.mode = 'main';
    this.cursor = 0;
    this.message = '';
    this.messageTimer = 0;

    const catalogs = {
      weapons: [
        {name:'Plasma Blade',price:100},{name:'Void Saber',price:350},
        {name:'Starsteel Katana',price:800},{name:'Pulse Rifle',price:280},{name:'Nova Cannon',price:700}
      ],
      armor: [
        {name:'Cloth Tunic',price:80},{name:'Voidweave Vest',price:300},{name:'Starsteel Plate',price:750}
      ],
      materials: [
        {name:'Scrap Metal',price:30},{name:'Bio Gel',price:30},{name:'Void Essence',price:100},
        {name:'Stellar Crystal',price:250},{name:'Nano Patch',price:40},{name:'Stim Pack',price:120}
      ]
    };
    this.catalog = catalogs[this.shopType] || [];

    this.box = this.add.rectangle(GAME_W/2, GAME_H/2, GAME_W - 60, GAME_H - 30, 0x0a0a1a, 0.95).setDepth(200);
    this.box.setStrokeStyle(2, 0x4488ff);

    const titles = {weapons:'⚔ Edge of Tomorrow',armor:'🛡 Aegis Outfitters',materials:'✨ Void & Spark',healer:'💚 Healer\'s Hall'};
    this.add.text(42, 24, titles[this.shopType] || 'Shop', { fontSize: '14px', fontFamily: 'monospace', color: '#ffcc33' }).setDepth(201);
    this.add.text(GAME_W - 120, 24, 'Gold: ' + GameData.gold + 'g', { fontSize: '11px', fontFamily: 'monospace', color: '#ffcc33' }).setDepth(201);

    this.menuTexts = [];
    this.updateMenu();
  }

  update() {
    if (this.messageTimer > 0) this.messageTimer--;
    const { dy, interact, cancel } = getInput(this);

    if (this.mode === 'main') {
      const opts = this.shopType === 'healer' ? ['Heal Party (50g)','Leave'] : ['Buy','Sell','Upgrade','Leave'];
      if (dy < 0 && this.cursor > 0) this.cursor--;
      if (dy > 0 && this.cursor < opts.length - 1) this.cursor++;
      if (interact) {
        const opt = opts[this.cursor];
        if (opt === 'Leave') { this.endShop(); return; }
        if (opt === 'Heal Party (50g)') {
          if (GameData.gold >= 50) {
            GameData.gold -= 50;
            GameData.party.forEach(c => { c.hp = c.maxHp; c.sp = c.maxSp; });
            this.message = 'Party healed!'; this.messageTimer = 120;
            AudioSys.sfx.heal();
          } else { this.message = 'Not enough gold!'; this.messageTimer = 120; }
        } else if (opt === 'Buy') { this.mode = 'buy'; this.cursor = 0; this.updateMenu(); }
        else if (opt === 'Sell') { this.mode = 'sell'; this.cursor = 0; this.updateMenu(); }
        else if (opt === 'Upgrade') { this.mode = 'upgrade'; this.cursor = 0; this.updateMenu(); }
      }
      if (cancel) this.endShop();
      this.updateMenu();
    } else {
      const items = this.mode === 'buy' ? this.catalog : GameData.inventory;
      if (dy < 0 && this.cursor > 0) this.cursor--;
      if (dy > 0 && this.cursor < items.length - 1) this.cursor++;
      if (cancel) { this.mode = 'main'; this.cursor = 0; this.updateMenu(); }
      if (interact) {
        if (this.mode === 'buy' && this.catalog[this.cursor]) {
          const si = this.catalog[this.cursor];
          if (GameData.gold >= si.price) {
            GameData.gold -= si.price;
            GameData.inventory.push({name:si.name,type:this.shopType==='weapons'?'weapon':this.shopType==='armor'?'armor':si.name==='Nano Patch'||si.name==='Stim Pack'?'consumable':'material',rarity:si.price>=500?'Rare':si.price>=200?'Uncommon':'Common',atk:si.name.includes('Blade')||si.name.includes('Saber')||si.name.includes('Katana')||si.name.includes('Rifle')||si.name.includes('Cannon')?Math.floor(si.price/40):0,def:si.name.includes('Tunic')||si.name.includes('Vest')||si.name.includes('Plate')?Math.floor(si.price/50):0,heal:si.name.includes('Patch')?30:si.name.includes('Stim')?80:0,level:1});
            this.message = 'Bought ' + si.name + '!'; this.messageTimer = 120;
            AudioSys.sfx.buy();
          } else { this.message = 'Not enough gold!'; this.messageTimer = 120; }
        } else if (this.mode === 'sell' && GameData.inventory[this.cursor]) {
          const item = GameData.inventory[this.cursor];
          const price = Math.floor((item.atk || item.def || item.hp || 10) * 2);
          GameData.gold += price;
          GameData.inventory.splice(this.cursor, 1);
          this.message = 'Sold ' + item.name + ' for ' + price + 'g!'; this.messageTimer = 120;
          this.cursor = Math.min(this.cursor, Math.max(0, GameData.inventory.length - 1));
        }
      }
      this.updateMenu();
    }
  }

  updateMenu() {
    this.menuTexts.forEach(t => t.destroy());
    this.menuTexts = [];

    if (this.mode === 'main') {
      const opts = this.shopType === 'healer' ? ['Heal Party (50g)','Leave'] : ['Buy','Sell','Upgrade','Leave'];
      opts.forEach((o, i) => {
        const color = i === this.cursor ? '#ffffff' : '#aaaaaa';
        const prefix = i === this.cursor ? '> ' : '  ';
        this.menuTexts.push(this.add.text(52, 55 + i * 24, prefix + o, { fontSize: '11px', fontFamily: 'monospace', color: color }).setDepth(201));
      });
    } else {
      const items = this.mode === 'buy' ? this.catalog : GameData.inventory;
      items.forEach((item, i) => {
        const color = i === this.cursor ? '#ffffff' : '#aaaaaa';
        const prefix = i === this.cursor ? '> ' : '  ';
        const label = item.name + (this.mode === 'buy' ? ' - ' + item.price + 'g' : '');
        this.menuTexts.push(this.add.text(52, 55 + i * 20, prefix + label, { fontSize: '11px', fontFamily: 'monospace', color: color }).setDepth(201));
      });
    }

    if (this.message && this.messageTimer > 0) {
      this.menuTexts.push(this.add.text(42, GAME_H - 50, this.message, { fontSize: '11px', fontFamily: 'monospace', color: '#ffcc33' }).setDepth(201));
    }
  }

  endShop() {
    gameSave();
    this.scene.stop();
    this.scene.get('TownScene').scene.resume();
  }
}
