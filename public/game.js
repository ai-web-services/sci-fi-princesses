// ═══════════════════════════════════════════════════════════════
// STELLAR PRINCESSES — SCI-FI RPG
// Phaser 4.2.0 — Complete rewrite
// ═══════════════════════════════════════════════════════════════

// ─── CONSTANTS ──────────────────────────────────────────────
const TILE = 16;
const MAP_W = 60;
const MAP_H = 40;
const GAME_W = 480;
const GAME_H = 270;

const COLORS = {
  floor1: 0x2a2a4a, floor2: 0x252545, wall1: 0x444466, wall2: 0x3a3a5a,
  wood: 0x664422, wood2: 0x553311, gold: 0xffaa00,
  water1: 0x2244aa, water2: 0x1a33aa,
  grass1: 0x225533, grass2: 0x1a4428,
  path1: 0x554433, path2: 0x4a3a2a,
  void1: 0x1a0a2a, void2: 0x0a0a1a,
  ice1: 0xaaccff, ice2: 0x88aadd,
  lava1: 0xff4400, lava2: 0xcc2200,
  skin: 0xffccaa, skin2: 0xddaa88,
  hair1: 0xffdd44, hair2: 0xcc8833, hair3: 0x333333, hair4: 0xff6633,
  eye1: 0x44ddff, eye2: 0xff4444, eye3: 0x44ff44, eye4: 0xffaa00,
  purple: 0xaa44ff, blue: 0x3344aa, red: 0xff3344, green: 0x33cc66,
  darkRed: 0x881122, darkGreen: 0x116633, brown: 0x886644,
  white: 0xffffff, gray: 0x666688, lightGray: 0xaaaacc,
  yellow: 0xffcc33, orange: 0xff8833, pink: 0xff66aa,
  robot: 0x8899aa, robotEye: 0x44ffff,
  frog: 0x44aa66, dragon: 0xcc3333, catEar: 0xff8866,
  metal: 0x778899, darkBrown: 0x553322
};

// Tile types
const T = {FLOOR:0,WALL:1,DOOR:2,WATER:3,BRIDGE:4,GRASS:5,PATH:6,COUNTER:7,SHELF:8,PLANT:9,SIGN:10,CHEST:11,GATE:12,PORTAL:13,BED:14,TABLE:15,BAR:16,STAIRS:17,VOID:18,ICE:19,LAVA:20};

// ─── GAME DATA ──────────────────────────────────────────────
const GameData = {
  gold: 50000,
  inventory: [],
  party: [],
  questFlags: {},
  playerX: 29, playerY: 20, playerDir: 0,
  bossDefeated: [false, false]
};

// ─── SAVE / LOAD ────────────────────────────────────────────
function gameSave() {
  try { localStorage.setItem('stellar_save', JSON.stringify(GameData)); } catch(e) {}
}
function gameLoad() {
  try {
    const raw = localStorage.getItem('stellar_save');
    if (!raw) return false;
    const d = JSON.parse(raw);
    Object.assign(GameData, d);
    return true;
  } catch(e) { return false; }
}
function gameHasSave() { try { return !!localStorage.getItem('stellar_save'); } catch(e) { return false; } }

// ─── INPUT HELPERS ──────────────────────────────────────────
function getInput(scene) {
  const kb = scene.input.keyboard;
  const gp = scene.input.gamepad ? scene.input.gamepad.getPad(0) : null;
  
  let dx = 0, dy = 0;
  if (kb.isDown(Phaser.Input.Keyboard.KeyCodes.A) || kb.isDown(Phaser.Input.Keyboard.KeyCodes.LEFT)) dx = -1;
  if (kb.isDown(Phaser.Input.Keyboard.KeyCodes.D) || kb.isDown(Phaser.Input.Keyboard.KeyCodes.RIGHT)) dx = 1;
  if (kb.isDown(Phaser.Input.Keyboard.KeyCodes.W) || kb.isDown(Phaser.Input.Keyboard.KeyCodes.UP)) dy = -1;
  if (kb.isDown(Phaser.Input.Keyboard.KeyCodes.S) || kb.isDown(Phaser.Input.Keyboard.KeyCodes.DOWN)) dy = 1;
  
  if (gp) {
    if (gp.left || gp.axes[0] < -0.5) dx = -1;
    if (gp.right || gp.axes[0] > 0.5) dx = 1;
    if (gp.up || gp.axes[1] < -0.5) dy = -1;
    if (gp.down || gp.axes[1] > 0.5) dy = -1;
    // D-pad buttons
    if (gp.buttons[14] && gp.buttons[14].pressed) dx = -1;
    if (gp.buttons[15] && gp.buttons[15].pressed) dx = 1;
    if (gp.buttons[12] && gp.buttons[12].pressed) dy = -1;
    if (gp.buttons[13] && gp.buttons[13].pressed) dy = 1;
  }
  
  const interact = Phaser.Input.Keyboard.JustDown(kb.addKey(Phaser.Input.Keyboard.KeyCodes.Z)) ||
                    Phaser.Input.Keyboard.JustDown(kb.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)) ||
                    (gp && gp.buttons[0] && Phaser.Input.Gamepad.JustDown(gp.buttons[0]));
  const cancel = Phaser.Input.Keyboard.JustDown(kb.addKey(Phaser.Input.Keyboard.KeyCodes.X)) ||
                  Phaser.Input.Keyboard.JustDown(kb.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)) ||
                  (gp && gp.buttons[1] && Phaser.Input.Gamepad.JustDown(gp.buttons[1]));
  const menu = Phaser.Input.Keyboard.JustDown(kb.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)) ||
               (gp && gp.buttons[9] && Phaser.Input.Gamepad.JustDown(gp.buttons[9]));
  
  return { dx, dy, interact, cancel, menu, gp };
}

function updateControllerStatus(scene) {
  const el = document.getElementById('controller-status');
  if (!el) return;
  const gp = scene.input.gamepad ? scene.input.gamepad.getPad(0) : null;
  if (gp) {
    el.textContent = '🎮 Controller: Connected';
    el.style.color = '#4f4';
  } else {
    el.textContent = '🎮 Controller: Disconnected';
    el.style.color = '#4af';
  }
}

// ─── TOWN MAP DATA ──────────────────────────────────────────
function createTownMap() {
  const data = [];
  for (let y = 0; y < MAP_H; y++) { data[y] = []; for (let x = 0; x < MAP_W; x++) data[y][x] = T.FLOOR; }
  
  // Crown Spire
  for (let y = 2; y < 12; y++) for (let x = 24; x < 36; x++) data[y][x] = T.WALL;
  for (let y = 3; y < 11; y++) for (let x = 25; x < 35; x++) data[y][x] = T.FLOOR;
  data[11][29] = T.DOOR; data[11][30] = T.DOOR;
  data[4][27] = T.BED; data[4][32] = T.TABLE;
  data[6][26] = T.SHELF; data[6][34] = T.SHELF;
  data[9][28] = T.STAIRS; data[9][29] = T.STAIRS;
  
  // Weapon Shop
  for (let y = 14; y < 22; y++) for (let x = 8; x < 18; x++) data[y][x] = T.WALL;
  for (let y = 15; y < 21; y++) for (let x = 9; x < 17; x++) data[y][x] = T.FLOOR;
  data[21][12] = T.DOOR; data[21][13] = T.DOOR;
  data[16][10] = T.COUNTER; data[16][11] = T.COUNTER;
  data[16][14] = T.COUNTER; data[16][15] = T.COUNTER;
  data[18][10] = T.SHELF; data[18][11] = T.SHELF;
  data[18][14] = T.SHELF; data[18][15] = T.SHELF;
  
  // Armor Shop
  for (let y = 14; y < 22; y++) for (let x = 42; x < 52; x++) data[y][x] = T.WALL;
  for (let y = 15; y < 21; y++) for (let x = 43; x < 51; x++) data[y][x] = T.FLOOR;
  data[21][46] = T.DOOR; data[21][47] = T.DOOR;
  data[16][44] = T.COUNTER; data[16][45] = T.COUNTER;
  data[16][48] = T.COUNTER; data[16][49] = T.COUNTER;
  data[18][44] = T.SHELF; data[18][45] = T.SHELF;
  data[18][48] = T.SHELF; data[18][49] = T.SHELF;
  
  // Tavern
  for (let y = 26; y < 36; y++) for (let x = 4; x < 16; x++) data[y][x] = T.WALL;
  for (let y = 27; y < 35; y++) for (let x = 5; x < 15; x++) data[y][x] = T.FLOOR;
  data[35][9] = T.DOOR; data[35][10] = T.DOOR;
  data[28][7] = T.BAR; data[28][8] = T.BAR;
  data[30][6] = T.TABLE; data[30][10] = T.TABLE;
  data[32][6] = T.TABLE; data[32][10] = T.TABLE;
  
  // Healer's Hall
  for (let y = 26; y < 34; y++) for (let x = 44; x < 54; x++) data[y][x] = T.WALL;
  for (let y = 27; y < 33; y++) for (let x = 45; x < 53; x++) data[y][x] = T.FLOOR;
  data[33][48] = T.DOOR; data[33][49] = T.DOOR;
  data[28][47] = T.BED; data[28][50] = T.BED;
  data[30][46] = T.TABLE;
  
  // Material Shop
  for (let y = 14; y < 20; y++) for (let x = 2; x < 7; x++) data[y][x] = T.WALL;
  for (let y = 15; y < 19; y++) for (let x = 3; x < 6; x++) data[y][x] = T.FLOOR;
  data[19][4] = T.DOOR; data[16][4] = T.COUNTER;
  
  // Stargate Dock
  for (let y = 30; y < 36; y++) for (let x = 24; x < 36; x++) data[y][x] = T.WALL;
  for (let y = 31; y < 35; y++) for (let x = 25; x < 35; x++) data[y][x] = T.FLOOR;
  data[35][29] = T.DOOR; data[35][30] = T.DOOR;
  data[32][28] = T.GATE; data[32][29] = T.GATE; data[32][30] = T.GATE; data[32][31] = T.GATE;
  data[33][29] = T.PORTAL; data[33][30] = T.PORTAL;
  
  // Paths
  for (let x = 0; x < MAP_W; x++) { data[22][x] = T.PATH; data[23][x] = T.PATH; }
  for (let y = 0; y < MAP_H; y++) { data[y][17] = T.PATH; data[y][42] = T.PATH; }
  for (let y = 12; y < 22; y++) for (let x = 26; x < 34; x++) data[y][x] = T.PATH;
  
  // Gardens
  for (let y = 12; y < 18; y++) for (let x = 2; x < 8; x++) data[y][x] = T.GRASS;
  for (let y = 12; y < 18; y++) for (let x = 50; x < 58; x++) data[y][x] = T.GRASS;
  data[14][3] = T.PLANT; data[15][5] = T.PLANT;
  data[14][55] = T.PLANT; data[15][53] = T.PLANT;
  
  // Training
  for (let y = 2; y < 8; y++) for (let x = 2; x < 10; x++) data[y][x] = T.WALL;
  for (let y = 3; y < 7; y++) for (let x = 3; x < 9; x++) data[y][x] = T.FLOOR;
  data[8][5] = T.DOOR;
  
  return data;
}

function isTownSolid(x, y) {
  if (x < 0 || x >= MAP_W || y < 0 || y >= MAP_H) return true;
  const t = townMapData[y][x];
  return t === T.WALL || t === T.COUNTER || t === T.SHELF || t === T.TABLE || t === T.BAR || t === T.BED;
}

// NPCs: [x, y, type, name, dialogue, shop, recruitable]
const townNPCs = [
  [28,16,'townie1','Citizen Milo',['The stars have been dimming lately...','They say the Voidborn are getting closer.','Nova Prime has stood for a thousand years.'],null,false],
  [31,18,'townie2','Citizen Ada',['I heard the Stargate is active again!','The Princess trains every day now.'],null,false],
  [12,17,'merchant','Zara',['Welcome to Void & Spark!','Looking for something specific?'],'materials',false],
  [46,17,'blacksmith','Torvin',['Need an edge? I\'ll give you one.','My forge burns hot enough for starsteel.'],'weapons',false],
  [12,19,'merchant','Shopkeep',['Aegis Outfitters - protection you can trust.'],'armor',false],
  [9,29,'tavernkeeper','Old Corvus',['Sit down, friend. Let me tell you about the Crown...','The Celestial Crown was forged from a dying star.'],null,false],
  [7,31,'cat','Erynn "Eryx" Vexx',['...You\'re staring. Got something to say?','I used to run with the Felidae colony.','If you\'re heading into the void zones... I might tag along.'],null,true],
  [48,29,'healer','Dr. Elara',['Welcome to the Healer\'s Hall.','The Voidborn corruption rewrites living tissue.'],'healer',false],
  [27,5,'commander','Commander Reyes',['Princess. The Stargate is operational.','You\'ve trained hard. But battle is different.'],null,false],
  [5,5,'townie1','Trainer Kade',['Ready to spar?','Focus on fundamentals. Speed and precision win.'],null,false],
  [27,32,'commander','Gate Guard',['The Stargate leads to the Void Scar.','Make sure you\'re equipped before you go.'],null,false],
  [28,8,'robot','Pip',['*BEEP* Oh! A visitor!','I\'ve been down here as long as I can remember.','If you\'re going out there... could I come?'],null,true],
];

const townSigns = [
  [28,13,'<- Crown Spire'],[12,13,'-> Weapon Shop'],[46,13,'-> Armor Shop'],
  [9,25,'v The Nebula Tavern'],[48,25,'v Healer\'s Hall'],[4,13,'-> Material Shop'],
  [5,11,'^ Training Ground'],[28,29,'v Stargate Dock']
];

const townChests = [
  {x:26,y:4,item:{name:'Plasma Blade',type:'weapon',rarity:'Common',atk:5,level:1}},
  {x:33,y:4,item:{name:'Nano Patch',type:'consumable',rarity:'Common',heal:30,level:1}},
];

let townMapData = createTownMap();

// ─── SPRITE GENERATION ──────────────────────────────────────
function generateTileTexture(scene, key, color, pattern) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(color, 1);
  g.fillRect(0, 0, TILE, TILE);
  if (pattern === 'wall') {
    g.fillStyle(0x000000, 0.2);
    g.fillRect(0, TILE - 3, TILE, 3);
  } else if (pattern === 'water') {
    g.fillStyle(0xffffff, 0.15);
    g.fillRect(2, 2, 4, 4);
  } else if (pattern === 'chest') {
    g.fillStyle(COLORS.wood, 1);
    g.fillRect(2, 6, 12, 10);
    g.fillStyle(COLORS.wood2, 1);
    g.fillRect(2, 6, 12, 3);
    g.fillStyle(COLORS.gold, 1);
    g.fillRect(6, 9, 4, 3);
  } else if (pattern === 'door') {
    g.fillStyle(COLORS.wood, 1);
    g.fillRect(0, 0, TILE, TILE);
    g.fillStyle(COLORS.wood2, 1);
    g.fillRect(2, 2, TILE-4, TILE-4);
    g.fillStyle(COLORS.gold, 1);
    g.fillRect(TILE-6, TILE/2-2, 4, 4);
  }
  g.generateTexture(key, TILE, TILE);
  g.destroy();
}

function generateAllTextures(scene) {
  const tiles = [
    ['tile_floor', COLORS.floor1, 'floor'],
    ['tile_wall', COLORS.wall1, 'wall'],
    ['tile_door', COLORS.wood, 'door'],
    ['tile_water', COLORS.water1, 'water'],
    ['tile_bridge', COLORS.wood, ''],
    ['tile_grass', COLORS.grass1, ''],
    ['tile_path', COLORS.path1, ''],
    ['tile_counter', COLORS.wood, ''],
    ['tile_shelf', COLORS.wood2, ''],
    ['tile_plant', COLORS.green, ''],
    ['tile_sign', COLORS.wood, ''],
    ['tile_chest', COLORS.brown, 'chest'],
    ['tile_gate', COLORS.metal, ''],
    ['tile_portal', COLORS.purple, ''],
    ['tile_bed', COLORS.wood, ''],
    ['tile_table', COLORS.wood, ''],
    ['tile_bar', COLORS.darkBrown, ''],
    ['tile_stairs', COLORS.metal, ''],
    ['tile_void', COLORS.void1, ''],
    ['tile_ice', COLORS.ice1, ''],
    ['tile_lava', COLORS.lava1, ''],
  ];
  tiles.forEach(([key, color, pattern]) => generateTileTexture(scene, key, color, pattern));
}

function getTileKey(type) {
  const map = {[T.FLOOR]:'tile_floor',[T.WALL]:'tile_wall',[T.DOOR]:'tile_door',[T.WATER]:'tile_water',[T.BRIDGE]:'tile_bridge',[T.GRASS]:'tile_grass',[T.PATH]:'tile_path',[T.COUNTER]:'tile_counter',[T.SHELF]:'tile_shelf',[T.PLANT]:'tile_plant',[T.SIGN]:'tile_sign',[T.CHEST]:'tile_chest',[T.GATE]:'tile_gate',[T.PORTAL]:'tile_portal',[T.BED]:'tile_bed',[T.TABLE]:'tile_table',[T.BAR]:'tile_bar',[T.STAIRS]:'tile_stairs',[T.VOID]:'tile_void',[T.ICE]:'tile_ice',[T.LAVA]:'tile_lava'};
  return map[type] || 'tile_floor';
}

// ─── PIXEL ART SPRITE GENERATION ────────────────────────────
function generateCharacterTexture(scene, key, species, hairColor, eyeColor, skinColor, outfitColor) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  const s = 2; // pixel scale
  
  // Shadow
  g.fillStyle(0x000000, 0.3);
  g.fillRect(5, 8, 12, 4);
  
  // Legs
  g.fillStyle(outfitColor, 1);
  g.fillRect(4, 2, 3, 5);
  g.fillRect(9, 2, 3, 5);
  
  // Shoes
  g.fillStyle(0x222222, 1);
  g.fillRect(3, 6, 4, 2);
  g.fillRect(10, 6, 4, 2);
  
  // Body
  g.fillStyle(outfitColor, 1);
  g.fillRect(3, -6, 8, 8);
  
  // Arms
  g.fillStyle(skinColor, 1);
  g.fillRect(-1, -5, 2, 5);
  g.fillRect(13, -5, 2, 5);
  
  // Head
  g.fillStyle(skinColor, 1);
  g.fillRect(3, -13, 8, 8);
  
  // Eyes
  g.fillStyle(eyeColor, 1);
  g.fillRect(4, -10, 2, 2);
  g.fillRect(9, -10, 2, 2);
  
  // Hair
  g.fillStyle(hairColor, 1);
  g.fillRect(2, -14, 10, 3);
  g.fillRect(2, -13, 2, 5);
  g.fillRect(10, -13, 2, 5);
  
  // Species features
  if (species === 'cat') {
    g.fillStyle(hairColor, 1);
    g.fillRect(2, -18, 3, 5);
    g.fillRect(10, -18, 3, 5);
    g.fillStyle(COLORS.catEar, 1);
    g.fillRect(3, -17, 1, 3);
    g.fillRect(11, -17, 1, 3);
  } else if (species === 'frog') {
    g.fillStyle(COLORS.frog, 1);
    g.fillRect(1, -16, 4, 5);
    g.fillRect(10, -16, 4, 5);
    g.fillStyle(COLORS.eye3, 1);
    g.fillRect(2, -15, 2, 2);
    g.fillRect(11, -15, 2, 2);
    g.fillStyle(0x55bb77, 1);
    g.fillRect(5, -6, 4, 2);
  } else if (species === 'dragon') {
    g.fillStyle(COLORS.dragon, 1);
    g.fillRect(2, -18, 2, 5);
    g.fillRect(11, -18, 2, 5);
    g.fillStyle(0xbb3333, 1);
    g.fillRect(4, -7, 4, 2);
    g.fillStyle(0xaa2222, 1);
    g.fillRect(13, 2, 5, 2);
    g.fillRect(17, -1, 2, 4);
  } else if (species === 'robot') {
    g.fillStyle(COLORS.robotEye, 1);
    g.fillRect(5, -11, 4, 4);
    g.fillStyle(COLORS.robot, 1);
    g.fillRect(2, -14, 10, 3);
    g.fillRect(6, -18, 1, 5);
    g.fillStyle(COLORS.robotEye, 1);
    g.fillRect(6, -17, 1, 1);
  }
  
  g.generateTexture(key, 16 * s, 20 * s);
  g.destroy();
}

// ─── BOOT SCENE ─────────────────────────────────────────────
class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }
  
  create() {
    generateAllTextures(this);
    
    // Generate character textures
    const chars = [
      ['char_lyra', 'human', COLORS.hair1, COLORS.eye1, COLORS.skin, COLORS.purple],
      ['char_eryx', 'cat', COLORS.hair2, COLORS.eye3, COLORS.skin, COLORS.purple],
      ['char_brimble', 'frog', null, COLORS.eye3, COLORS.frog, COLORS.darkGreen],
      ['char_drakkor', 'dragon', null, COLORS.eye4, COLORS.dragon, COLORS.darkRed],
      ['char_pip', 'robot', null, null, COLORS.robot, COLORS.metal],
      ['char_merchant', 'human', COLORS.hair3, COLORS.eye4, COLORS.skin2, COLORS.brown],
      ['char_blacksmith', 'human', COLORS.hair3, COLORS.eye2, COLORS.skin2, COLORS.gray],
      ['char_healer', 'human', COLORS.hair1, COLORS.eye3, COLORS.skin, COLORS.white],
      ['char_commander', 'human', COLORS.hair3, COLORS.eye2, COLORS.skin2, COLORS.blue],
      ['char_tavernkeeper', 'human', COLORS.hair3, COLORS.eye4, COLORS.skin2, COLORS.darkBrown],
      ['char_townie1', 'human', COLORS.hair4, COLORS.eye1, COLORS.skin, COLORS.green],
      ['char_townie2', 'human', COLORS.hair2, COLORS.eye2, COLORS.skin2, COLORS.pink],
    ];
    chars.forEach(([key, species, hair, eye, skin, outfit]) => {
      generateCharacterTexture(this, key, species, hair, eye, skin, outfit);
    });
    
    this.scene.start('TitleScene');
  }
}

// ─── TITLE SCENE ────────────────────────────────────────────
class TitleScene extends Phaser.Scene {
  constructor() { super({ key: 'TitleScene' }); }
  
  create() {
    this.add.text(GAME_W/2, 60, 'STELLAR PRINCESSES', { fontSize: '24px', fontFamily: 'monospace', color: '#ffcc33' }).setOrigin(0.5);
    this.add.text(GAME_W/2, 90, 'A Sci-Fi RPG', { fontSize: '12px', fontFamily: 'monospace', color: '#aa44ff' }).setOrigin(0.5);
    
    // Character sprite
    this.add.image(GAME_W/2, 150, 'char_lyra').setScale(2);
    
    this.add.text(GAME_W/2, 210, 'Press A / Z / SPACE', { fontSize: '12px', fontFamily: 'monospace', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(GAME_W/2, GAME_H - 12, 'v3.0 — Phaser 4', { fontSize: '10px', fontFamily: 'monospace', color: '#666666' }).setOrigin(0.5);
    
    this.time.addEvent({ delay: 500, callback: () => {
      const { interact } = getInput(this);
      if (interact) {
        if (gameHasSave() && gameLoad()) {
          this.scene.start('TownScene');
        } else {
          GameData.party = [{name:'Lyra',species:'human',level:1,xp:0,xpToLevel:100,hp:80,maxHp:80,sp:20,maxSp:20,atk:12,def:8,spd:10,crit:5,equipment:{weapon:null,armor:null,accessory1:null,accessory2:null,implant:null},skills:[{name:'Stellar Slash',cost:5,type:'damage',element:'light',power:1.5}],evolution:0,evolutionName:'Princess'}];
          GameData.inventory = [
            {name:'Plasma Blade',type:'weapon',rarity:'Common',atk:5,level:1},
            {name:'Nano Patch',type:'consumable',rarity:'Common',heal:30,level:1},
            {name:'Scrap Metal',type:'material',rarity:'Common',level:1},
          ];
          GameData.gold = 500;
          gameSave();
          this.scene.start('TownScene');
        }
      }
    }, loop: true });
    
    this.time.addEvent({ delay: 100, callback: () => updateControllerStatus(this), loop: true });
  }
}

// ─── TOWN SCENE ─────────────────────────────────────────────
class TownScene extends Phaser.Scene {
  constructor() { super({ key: 'TownScene' }); }
  
  create() {
    this.player = { x: GameData.playerX, y: GameData.playerY, dir: GameData.playerDir };
    this.cameraX = 0;
    this.cameraY = 0;
    this.frame = 0;
    this.moveTimer = 0;
    this.npcSprites = [];
    this.chestSprites = [];
    this.signSprites = [];
    this.playerSprite = null;
    this.hudTexts = [];
    
    this.buildMap();
    this.buildNPCs();
    this.buildPlayer();
    this.buildHUD();
    this.updateCamera();
    
    this.time.addEvent({ delay: 100, callback: () => updateControllerStatus(this), loop: true });
  }
  
  buildMap() {
    this.mapContainer = this.add.container(0, 0);
    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const key = getTileKey(townMapData[y][x]);
        const img = this.add.image(x * TILE + TILE/2, y * TILE + TILE/2, key);
        img.setCrop(0, 0, TILE, TILE);
        this.mapContainer.add(img);
      }
    }
  }
  
  buildNPCs() {
    townNPCs.forEach(npc => {
      const key = 'char_' + npc[2];
      const img = this.add.image(npc[0] * TILE + TILE/2, npc[1] * TILE + TILE/2, key).setScale(1);
      img.npcData = { x: npc[0], y: npc[1], type: npc[2], name: npc[3], dialogue: npc[4], shop: npc[5], recruitable: npc[6] };
      this.npcSprites.push(img);
    });
  }
  
  buildPlayer() {
    this.playerSprite = this.add.image(this.player.x * TILE + TILE/2, this.player.y * TILE + TILE/2, 'char_lyra').setScale(1);
  }
  
  buildHUD() {
    this.hudContainer = this.add.container(0, 0);
    this.hudContainer.setDepth(100);
    
    GameData.party.forEach((c, i) => {
      const bg = this.add.rectangle(50, 10 + i*32, 90, 28, 0x0a0a1a, 0.8).setOrigin(0);
      const name = this.add.text(6, 4 + i*32, c.name, { fontSize: '10px', fontFamily: 'monospace', color: '#44ddff' });
      const hpBar = this.add.rectangle(6, 16 + i*32, 56, 4, 0x333333).setOrigin(0);
      const hpFill = this.add.rectangle(6, 16 + i*32, 56, 4, 0x33cc66).setOrigin(0);
      this.hudContainer.add([bg, name, hpBar, hpFill]);
    });
    
    const goldText = this.add.text(GAME_W - 74, 6, GameData.gold + 'g', { fontSize: '10px', fontFamily: 'monospace', color: '#ffcc33' });
    this.hudContainer.add(goldText);
    
    const controlsText = this.add.text(10, GAME_H - 18, 'D-Pad:Move A:Interact X:Menu', { fontSize: '8px', fontFamily: 'monospace', color: '#888888' });
    this.hudContainer.add(controlsText);
  }
  
  updateCamera() {
    this.cameraX = Phaser.Math.Clamp(this.player.x * TILE - GAME_W/2 + TILE/2, 0, MAP_W * TILE - GAME_W);
    this.cameraY = Phaser.Math.Clamp(this.player.y * TILE - GAME_H/2 + TILE/2, 0, MAP_H * TILE - GAME_H);
    this.mapContainer.setPosition(-this.cameraX, -this.cameraY);
    this.npcSprites.forEach(img => img.setPosition(img.npcData.x * TILE + TILE/2 - this.cameraX, img.npcData.y * TILE + TILE/2 - this.cameraY));
    this.chestSprites.forEach(img => img.setPosition(img.chestData.x * TILE + TILE/2 - this.cameraX, img.chestData.y * TILE + TILE/2 - this.cameraY));
    this.signSprites.forEach(img => img.setPosition(img.signData.x * TILE + TILE/2 - this.cameraX, img.signData.y * TILE + TILE/2 - this.cameraY));
    if (this.playerSprite) {
      this.playerSprite.setPosition(this.player.x * TILE + TILE/2 - this.cameraX, this.player.y * TILE + TILE/2 - this.cameraY);
    }
  }
  
  update() {
    const { dx, dy, interact, cancel, menu, gp } = getInput(this);
    
    // Movement
    if (dx !== 0 || dy !== 0) {
      this.moveTimer++;
      if (this.moveTimer >= 6) {
        this.moveTimer = 0;
        const nx = this.player.x + dx;
        const ny = this.player.y + dy;
        if (!isTownSolid(nx, ny)) {
          // Check NPC collision
          const npc = this.npcSprites.find(n => n.npcData.x === nx && n.npcData.y === ny);
          if (!npc) {
            this.player.x = nx;
            this.player.y = ny;
            this.player.dir = dx < 0 ? 1 : dx > 0 ? 2 : dy < 0 ? 3 : 0;
            this.updateCamera();
          }
        }
      }
    } else {
      this.moveTimer = 0;
    }
    
    // Interact
    if (interact) {
      const ddx = [0,-1,1,0][this.player.dir];
      const ddy = [1,0,0,-1][this.player.dir];
      const tx = this.player.x + ddx;
      const ty = this.player.y + ddy;
      
      // Check NPC
      const npc = this.npcSprites.find(n => n.npcData.x === tx && n.npcData.y === ty);
      if (npc) {
        if (npc.npcData.shop && !npc.npcData.recruitable) {
          this.scene.launch('ShopScene', { shopType: npc.npcData.shop, npcName: npc.npcData.name });
          this.scene.pause();
        } else {
          this.scene.launch('DialogueScene', { npc: npc.npcData, scene: this });
          this.scene.pause();
        }
        return;
      }
      
      // Check sign
      const sign = townSigns.find(s => s[0] === tx && s[1] === ty);
      if (sign) {
        this.scene.launch('DialogueScene', { text: sign[2], scene: this });
        this.scene.pause();
        return;
      }
      
      // Check chest
      const chest = townChests.find(c => c.x === tx && c.y === ty && !c.taken);
      if (chest) {
        chest.taken = true;
        GameData.inventory.push(chest.item);
        this.scene.launch('DialogueScene', { text: 'Found ' + chest.item.name + '!', scene: this });
        this.scene.pause();
        return;
      }
    }
    
    // Menu
    if (menu) {
      this.scene.launch('InventoryScene');
      this.scene.pause();
    }
    
    // Save position
    GameData.playerX = this.player.x;
    GameData.playerY = this.player.y;
    GameData.playerDir = this.player.dir;
  }
}

// ─── DIALOGUE SCENE (overlay) ──────────────────────────────
class DialogueScene extends Phaser.Scene {
  constructor() { super({ key: 'DialogueScene' }); }
  
  create(data) {
    this.mainScene = data.scene;
    this.lines = data.npc ? data.npc.dialogue : [data.text];
    this.isNPC = !!data.npc;
    this.curLine = 0;
    this.curChar = 0;
    this.charTimer = 0;
    this.done = false;
    this.choices = null;
    this.choiceIndex = 0;
    
    this.box = this.add.rectangle(GAME_W/2, GAME_H - 40, GAME_W - 8, 64, 0x0a0a1a, 0.92).setDepth(200);
    this.box.setStrokeStyle(1, 0x4488ff);
    
    if (data.npc) {
      this.nameText = this.add.text(12, this.box.y - 28, data.npc.name, { fontSize: '11px', fontFamily: 'monospace', color: '#44ddff' }).setDepth(201);
    }
    
    this.textText = this.add.text(12, this.box.y - 14, '', { fontSize: '11px', fontFamily: 'monospace', color: '#dddddd', wordWrap: { width: GAME_W - 28 } }).setDepth(201);
    
    this.time.addEvent({ delay: 30, callback: () => {
      if (this.done) return;
      if (this.choices) return;
      
      this.charTimer++;
      if (this.charTimer >= 2) {
        this.charTimer = 0;
        if (this.curChar < this.lines[this.curLine].length) {
          this.curChar++;
          this.textText.setText(this.lines[this.curLine].substring(0, this.curChar));
        }
      }
      
      const { interact } = getInput(this);
      if (interact) {
        if (this.curChar < this.lines[this.curLine].length) {
          this.curChar = this.lines[this.curLine].length;
          this.textText.setText(this.lines[this.curLine]);
        } else {
          this.curLine++;
          if (this.curLine >= this.lines.length) {
            if (this.isNPC && this.mainScene) {
              // Show recruit choice
              this.choices = ['Invite ' + data.npc.name + ' to join', 'Maybe later'];
              this.choiceIndex = 0;
              this.textText.setText('');
              this.choices.forEach((c, i) => {
                const color = i === this.choiceIndex ? '#ffffff' : '#aaaaaa';
                const prefix = i === this.choiceIndex ? '> ' : '  ';
                this.add.text(14, this.box.y - 14 + i * 16, prefix + c, { fontSize: '11px', fontFamily: 'monospace', color: color }).setDepth(201);
              });
            } else {
              this.done = true;
              this.scene.stop();
              if (this.mainScene) this.mainScene.scene.resume();
            }
          } else {
            this.curChar = 0;
            this.charTimer = 0;
          }
        }
      }
    }, loop: true });
    
    // Handle choice selection
    this.time.addEvent({ delay: 100, callback: () => {
      if (!this.choices) return;
      const { dy, interact } = getInput(this);
      if (dy < 0 && this.choiceIndex > 0) this.choiceIndex--;
      if (dy > 0 && this.choiceIndex < this.choices.length - 1) this.choiceIndex++;
      if (interact) {
        if (this.choiceIndex === 0 && data.npc && data.npc.recruitable) {
          // Recruit
          const recruits = { cat: 'Erynn', frog: 'Brimble', dragon: 'Drakkor', robot: 'Pip' };
          const names = { cat: 'Erynn "Eryx" Vexx', frog: 'Brimble', dragon: 'Drakkor Ashveil', robot: 'Pip' };
          const species = { cat: 'cat', frog: 'frog', dragon: 'dragon', robot: 'robot' };
          const s = species[data.npc.type];
          GameData.party.push({
            name: names[data.npc.type], species: s, level: 1, xp: 0, xpToLevel: 100,
            hp: s==='frog'?120:s==='dragon'?100:s==='robot'?50:60,
            maxHp: s==='frog'?120:s==='dragon'?100:s==='robot'?50:60,
            sp: 25, maxSp: 25, atk: s==='dragon'?18:15, def: s==='frog'?15:5, spd: s==='frog'?6:18, crit: s==='cat'?20:5,
            equipment: {weapon:null,armor:null,accessory1:null,accessory2:null,implant:null},
            skills: [], evolution: 0, evolutionName: s.charAt(0).toUpperCase()+s.slice(1)
          });
          GameData.questFlags['recruited_' + data.npc.name] = true;
          // Remove NPC from map
          const npcImg = this.mainScene.npcSprites.find(n => n.npcData.name === data.npc.name);
          if (npcImg) npcImg.setVisible(false);
          gameSave();
        }
        this.done = true;
        this.scene.stop();
        if (this.mainScene) this.mainScene.scene.resume();
      }
    }, loop: true });
  }
}

// ─── SHOP SCENE (overlay) ──────────────────────────────────
class ShopScene extends Phaser.Scene {
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
    
    this.time.addEvent({ delay: 100, callback: () => {
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
    }, loop: true });
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

// ─── INVENTORY SCENE (overlay) ──────────────────────────────
class InventoryScene extends Phaser.Scene {
  constructor() { super({ key: 'InventoryScene' }); }
  
  create() {
    this.mode = 'list';
    this.cursor = 0;
    this.charIndex = 0;
    this.slotIndex = 0;
    
    this.box = this.add.rectangle(GAME_W/2, GAME_H/2, GAME_W - 30, GAME_H - 20, 0x050514, 0.95).setDepth(200);
    this.box.setStrokeStyle(2, 0x4488ff);
    
    this.add.text(25, 16, 'Inventory', { fontSize: '11px', fontFamily: 'monospace', color: '#4488ff' }).setDepth(201);
    this.add.text(125, 16, 'Equipment', { fontSize: '11px', fontFamily: 'monospace', color: '#666666' }).setDepth(201);
    this.add.text(GAME_W - 100, 16, 'Gold: ' + GameData.gold + 'g', { fontSize: '10px', fontFamily: 'monospace', color: '#aaaaaa' }).setDepth(201);
    
    this.contentTexts = [];
    this.updateContent();
    
    this.time.addEvent({ delay: 100, callback: () => {
      const { dy, interact, cancel } = getInput(this);
      
      if (this.mode === 'list') {
        if (dy < 0 && this.cursor > 0) this.cursor--;
        if (dy > 0 && this.cursor < GameData.inventory.length - 1) this.cursor++;
        if (cancel) { this.scene.stop(); this.scene.get('TownScene').scene.resume(); }
        if (interact && GameData.inventory[this.cursor]) {
          this.mode = 'itemAction';
          this._itemIdx = this.cursor;
          this.cursor = 0;
        }
        // Tab to equip
        const gp = this.input.gamepad ? this.input.gamepad.getPad(0) : null;
        if (gp && gp.buttons[4] && Phaser.Input.Gamepad.JustDown(gp.buttons[4])) {
          this.mode = 'equip'; this.charIndex = 0; this.slotIndex = 0;
        }
        this.updateContent();
      } else if (this.mode === 'itemAction') {
        const actions = ['Equip','Drop','Cancel'];
        if (dy < 0 && this.cursor > 0) this.cursor--;
        if (dy > 0 && this.cursor < actions.length - 1) this.cursor++;
        if (cancel) { this.mode = 'list'; this.cursor = this._itemIdx; }
        if (interact) {
          const act = actions[this.cursor];
          if (act === 'Equip') { this.mode = 'pickChar'; this.cursor = 0; }
          else if (act === 'Drop') { GameData.inventory.splice(this._itemIdx, 1); this.mode = 'list'; this.cursor = Math.min(this.cursor, Math.max(0, GameData.inventory.length - 1)); }
          else { this.mode = 'list'; this.cursor = this._itemIdx; }
        }
        this.updateContent();
      } else if (this.mode === 'pickChar') {
        if (dy < 0 && this.cursor > 0) this.cursor--;
        if (dy > 0 && this.cursor < GameData.party.length - 1) this.cursor++;
        if (cancel) { this.mode = 'itemAction'; this.cursor = 0; }
        if (interact) {
          const ch = GameData.party[this.cursor];
          const item = GameData.inventory[this._itemIdx];
          if (ch && item) {
            const slot = item.type === 'weapon' ? 'weapon' : item.type === 'armor' ? 'armor' : item.type === 'accessory' ? (ch.equipment.accessory1 ? 'accessory2' : 'accessory1') : item.type === 'implant' ? 'implant' : null;
            if (slot) {
              const old = ch.equipment[slot];
              ch.equipment[slot] = item;
              GameData.inventory.splice(this._itemIdx, 1);
              if (old) GameData.inventory.push(old);
            }
          }
          this.mode = 'list'; this.cursor = 0;
        }
        this.updateContent();
      } else if (this.mode === 'equip') {
        if (dy < 0 && this.slotIndex > 0) this.slotIndex--;
        if (dy > 0 && this.slotIndex < 4) this.slotIndex++;
        const dx = getInput(this);
        if (dx.dx < 0 && this.charIndex > 0) this.charIndex--;
        if (dx.dx > 0 && this.charIndex < GameData.party.length - 1) this.charIndex++;
        if (cancel) { this.mode = 'list'; this.cursor = 0; }
        if (interact) {
          const ch = GameData.party[this.charIndex];
          const slots = ['weapon','armor','accessory1','accessory2','implant'];
          const slot = slots[this.slotIndex];
          if (ch.equipment[slot]) {
            GameData.inventory.push(ch.equipment[slot]);
            ch.equipment[slot] = null;
          }
        }
        this.updateContent();
      }
    }, loop: true });
  }
  
  updateContent() {
    this.contentTexts.forEach(t => t.destroy());
    this.contentTexts = [];
    
    if (this.mode === 'list') {
      GameData.inventory.forEach((item, i) => {
        const color = i === this.cursor ? '#ffffff' : '#aaaaaa';
        const prefix = i === this.cursor ? '> ' : '  ';
        this.contentTexts.push(this.add.text(28, 40 + i * 16, prefix + item.name + (item.level > 1 ? ' +' + item.level : ''), { fontSize: '10px', fontFamily: 'monospace', color: color }).setDepth(201));
      });
      if (GameData.inventory.length === 0) {
        this.contentTexts.push(this.add.text(80, GAME_H/2, 'Inventory is empty', { fontSize: '11px', fontFamily: 'monospace', color: '#666666' }).setDepth(201));
      }
    } else if (this.mode === 'itemAction') {
      ['Equip','Drop','Cancel'].forEach((a, i) => {
        const color = i === this.cursor ? '#ffffff' : '#aaaaaa';
        const prefix = i === this.cursor ? '> ' : '  ';
        this.contentTexts.push(this.add.text(GAME_W - 110, 60 + i * 18, prefix + a, { fontSize: '10px', fontFamily: 'monospace', color: color }).setDepth(201));
      });
    } else if (this.mode === 'pickChar') {
      GameData.party.forEach((c, i) => {
        const color = i === this.cursor ? '#ffffff' : '#aaaaaa';
        const prefix = i === this.cursor ? '> ' : '  ';
        this.contentTexts.push(this.add.text(GAME_W - 130, 60 + i * 18, prefix + c.name + ' Lv' + c.level, { fontSize: '10px', fontFamily: 'monospace', color: color }).setDepth(201));
      });
    } else if (this.mode === 'equip') {
      const ch = GameData.party[this.charIndex];
      if (ch) {
        GameData.party.forEach((c, i) => {
          const color = i === this.charIndex ? '#ffffff' : '#666666';
          this.contentTexts.push(this.add.text(25 + i * 80, 42, c.name, { fontSize: '10px', fontFamily: 'monospace', color: color }).setDepth(201));
        });
        const slots = ['Weapon','Armor','Acc 1','Acc 2','Implant'];
        slots.forEach((s, i) => {
          const color = i === this.slotIndex ? '#ffffff' : '#aaaaaa';
          const prefix = i === this.slotIndex ? '> ' : '  ';
          const item = ch.equipment[['weapon','armor','accessory1','accessory2','implant'][i]];
          this.contentTexts.push(this.add.text(28, 58 + i * 18, prefix + s + ': ' + (item ? item.name : '[empty]'), { fontSize: '10px', fontFamily: 'monospace', color: color }).setDepth(201));
        });
      }
    }
  }
}

// ─── GAME CONFIG ────────────────────────────────────────────
const config = {
  type: Phaser.CANVAS,
  width: GAME_W,
  height: GAME_H,
  parent: 'game-container',
  pixelArt: true,
  backgroundColor: '#0a0a1a',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_W,
    height: GAME_H
  },
  input: {
    gamepads: true,
    keyboard: true
  },
  scene: [BootScene, TitleScene, TownScene, DialogueScene, ShopScene, InventoryScene]
};

const game = new Phaser.Game(config);
