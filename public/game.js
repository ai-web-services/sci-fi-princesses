// ═══════════════════════════════════════════════════════════════
// STELLAR PRINCESSES — SCI-FI RPG
// Phaser 4.2.0 — Complete rewrite
// ═══════════════════════════════════════════════════════════════

// ─── CONSTANTS ──────────────────────────────────────────────
const TILE = 16;
const MAP_W = 60;
const MAP_H = 40;
const GAME_W = 960;
const GAME_H = 540;

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
// Key objects created once for performance
const KeyW = Phaser.Input.Keyboard.KeyCodes.W;
const KeyA = Phaser.Input.Keyboard.KeyCodes.A;
const KeyS = Phaser.Input.Keyboard.KeyCodes.S;
const KeyD = Phaser.Input.Keyboard.KeyCodes.D;
const KeyUp = Phaser.Input.Keyboard.KeyCodes.UP;
const KeyDown = Phaser.Input.Keyboard.KeyCodes.DOWN;
const KeyLeft = Phaser.Input.Keyboard.KeyCodes.LEFT;
const KeyRight = Phaser.Input.Keyboard.KeyCodes.RIGHT;
const KeyZ = Phaser.Input.Keyboard.KeyCodes.Z;
const KeySpace = Phaser.Input.Keyboard.KeyCodes.SPACE;
const KeyX = Phaser.Input.Keyboard.KeyCodes.X;
const KeyEsc = Phaser.Input.Keyboard.KeyCodes.ESC;
const KeyEnter = Phaser.Input.Keyboard.KeyCodes.ENTER;
const KeyM = Phaser.Input.Keyboard.KeyCodes.M;

// ─── SOUND SYSTEM (Web Audio API) ───────────────────────────
const AudioSys = {
  ctx: null,
  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) {}
  },
  ensureCtx() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },
  playTone(freq, duration, type, vol) {
    this.ensureCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type || 'square';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime((vol || 0.15), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (duration || 0.1));
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + (duration || 0.1));
  },
  playBGM() {
    // Simple ambient background melody
    this.ensureCtx();
    if (!this.ctx || this.bgmPlaying) return;
    this.bgmPlaying = true;
    this.bgmStep = 0;
    const notes = [262, 294, 330, 349, 392, 349, 330, 294];
    const bass = [131, 165, 196, 175];
    const playNext = () => {
      if (!this.bgmPlaying) return;
      const n = notes[this.bgmStep % notes.length];
      const b = bass[this.bgmStep % bass.length];
      this.playTone(n, 0.4, 'sine', 0.08);
      this.playTone(b, 0.4, 'triangle', 0.06);
      this.bgmStep++;
      this.bgmTimer = setTimeout(playNext, 500);
    };
    playNext();
  },
  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) clearTimeout(this.bgmTimer);
  },
  sfx: {
    interact() { AudioSys.playTone(600, 0.08, 'square', 0.1); AudioSys.playTone(800, 0.06, 'square', 0.08); },
    menu() { AudioSys.playTone(400, 0.05, 'square', 0.08); },
    back() { AudioSys.playTone(300, 0.08, 'square', 0.08); },
    equip() { AudioSys.playTone(500, 0.06, 'square', 0.1); AudioSys.playTone(700, 0.08, 'square', 0.08); AudioSys.playTone(900, 0.06, 'square', 0.06); },
    buy() { AudioSys.playTone(800, 0.05, 'square', 0.1); AudioSys.playTone(1000, 0.08, 'sine', 0.08); },
    heal() { AudioSys.playTone(400, 0.15, 'sine', 0.1); AudioSys.playTone(600, 0.15, 'sine', 0.08); AudioSys.playTone(800, 0.2, 'sine', 0.06); },
    hurt() { AudioSys.playTone(200, 0.15, 'sawtooth', 0.1); AudioSys.playTone(150, 0.2, 'square', 0.08); },
    victory() { AudioSys.playTone(523, 0.1, 'square', 0.1); AudioSys.playTone(659, 0.1, 'square', 0.1); AudioSys.playTone(784, 0.15, 'square', 0.1); },
    recruit() { AudioSys.playTone(440, 0.1, 'square', 0.1); AudioSys.playTone(554, 0.1, 'square', 0.1); AudioSys.playTone(659, 0.1, 'square', 0.1); AudioSys.playTone(880, 0.15, 'sine', 0.1); },
    chest() { AudioSys.playTone(600, 0.05, 'sine', 0.1); AudioSys.playTone(800, 0.05, 'sine', 0.1); AudioSys.playTone(1000, 0.05, 'sine', 0.1); },
  }
};

function getInput(scene) {
  const kb = scene.input.keyboard;
  const gp = scene.input.gamepad ? scene.input.gamepad.getPad(0) : null;
  
  let dx = 0, dy = 0;
  if (kb.addKey(KeyA).isDown || kb.addKey(KeyLeft).isDown) dx = -1;
  if (kb.addKey(KeyD).isDown || kb.addKey(KeyRight).isDown) dx = 1;
  if (kb.addKey(KeyW).isDown || kb.addKey(KeyUp).isDown) dy = -1;
  if (kb.addKey(KeyS).isDown || kb.addKey(KeyDown).isDown) dy = 1;
  
  if (gp) {
    if (gp.left || gp.axes[0] < -0.5) dx = -1;
    if (gp.right || gp.axes[0] > 0.5) dx = 1;
    if (gp.up || gp.axes[1] < -0.5) dy = -1;
    if (gp.down || gp.axes[1] > 0.5) dy = 1;
    // D-pad buttons
    if (gp.buttons[14] && gp.buttons[14].pressed) dx = -1;
    if (gp.buttons[15] && gp.buttons[15].pressed) dx = 1;
    if (gp.buttons[12] && gp.buttons[12].pressed) dy = -1;
    if (gp.buttons[13] && gp.buttons[13].pressed) dy = 1;
  }
  
  const interact = Phaser.Input.Keyboard.JustDown(kb.addKey(KeyZ)) ||
                    Phaser.Input.Keyboard.JustDown(kb.addKey(KeySpace)) ||
                    !!(gp && gp.buttons[0] && Phaser.Input.Gamepad.JustDown(gp.buttons[0]));
  const cancel = Phaser.Input.Keyboard.JustDown(kb.addKey(KeyX)) ||
                  Phaser.Input.Keyboard.JustDown(kb.addKey(KeyEsc)) ||
                  !!(gp && gp.buttons[1] && Phaser.Input.Gamepad.JustDown(gp.buttons[1]));
  const menu = Phaser.Input.Keyboard.JustDown(kb.addKey(KeyEnter)) ||
               !!(gp && gp.buttons[9] && Phaser.Input.Gamepad.JustDown(gp.buttons[9]));
  
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

// ─── TILE TEXTURE GENERATION ─────────────────────────────────
function generateTileTexture(scene, key, color, pattern) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  const T = TILE;
  
  // Base fill
  g.fillStyle(color, 1);
  g.fillRect(0, 0, T, T);
  
  if (pattern === 'wall') {
    // Brick pattern
    g.fillStyle(0x000000, 0.15);
    g.fillRect(0, T - 3, T, 3);
    g.fillRect(0, T/2, T, 2);
    g.fillStyle(0xffffff, 0.05);
    g.fillRect(0, 0, T, 1);
    g.fillRect(0, 0, 1, T);
    // Brick lines
    g.fillStyle(0x000000, 0.1);
    g.fillRect(T/2, 0, 1, T/2);
    g.fillRect(0, T/2, T/2, 1);
    g.fillRect(T/2, T/2+2, T/2, 1);
  } else if (pattern === 'water') {
    // Animated water lines
    g.fillStyle(0xffffff, 0.12);
    g.fillRect(1, 3, 6, 1);
    g.fillRect(8, 7, 6, 1);
    g.fillRect(2, 11, 5, 1);
    g.fillRect(9, 14, 5, 1);
    g.fillStyle(0xffffff, 0.06);
    g.fillRect(4, 5, 3, 1);
    g.fillRect(11, 9, 3, 1);
    g.fillRect(6, 13, 4, 1);
  } else if (pattern === 'chest') {
    // Wooden chest
    g.fillStyle(0x664422, 1);
    g.fillRect(2, 5, 12, 11);
    g.fillStyle(0x553311, 1);
    g.fillRect(2, 5, 12, 3); // lid
    g.fillStyle(0x775533, 1);
    g.fillRect(2, 8, 12, 8); // body
    // Metal bands
    g.fillStyle(0xccaa00, 1);
    g.fillRect(1, 5, 1, 11);
    g.fillRect(14, 5, 1, 11);
    g.fillRect(6, 5, 4, 11); // center band
    // Lock
    g.fillStyle(0xffcc00, 1);
    g.fillRect(7, 9, 2, 3);
    g.fillStyle(0xaa8800, 1);
    g.fillRect(7, 9, 2, 1);
  } else if (pattern === 'door') {
    // Wooden door
    g.fillStyle(0x664422, 1);
    g.fillRect(1, 0, 14, 16);
    g.fillStyle(0x553311, 1);
    g.fillRect(2, 1, 12, 14);
    // Door panels
    g.fillStyle(0x775533, 1);
    g.fillRect(3, 2, 5, 5);
    g.fillRect(8, 2, 5, 5);
    g.fillRect(3, 9, 5, 5);
    g.fillRect(8, 9, 5, 5);
    // Handle
    g.fillStyle(0xccaa00, 1);
    g.fillRect(11, 7, 2, 2);
    g.fillStyle(0xffdd44, 1);
    g.fillRect(11, 7, 1, 1);
  } else if (pattern === 'grass') {
    // Grass detail
    g.fillStyle(0x1a4428, 1);
    g.fillRect(0, 0, T, T);
    g.fillStyle(0x225533, 1);
    g.fillRect(2, 2, 3, 3);
    g.fillRect(8, 5, 4, 3);
    g.fillRect(3, 10, 3, 3);
    g.fillRect(10, 12, 3, 3);
    g.fillStyle(0x336644, 1);
    g.fillRect(5, 3, 2, 2);
    g.fillRect(11, 8, 2, 2);
    g.fillRect(1, 7, 2, 2);
    g.fillRect(7, 13, 2, 2);
    // Grass blades
    g.fillStyle(0x44aa66, 0.6);
    g.fillRect(3, 1, 1, 3);
    g.fillRect(9, 4, 1, 3);
    g.fillRect(5, 9, 1, 3);
    g.fillRect(12, 11, 1, 3);
  } else if (pattern === 'path') {
    // Cobblestone path
    g.fillStyle(0x4a3a2a, 1);
    g.fillRect(0, 0, T, T);
    g.fillStyle(0x554433, 1);
    g.fillRect(1, 1, 6, 6);
    g.fillRect(8, 1, 7, 6);
    g.fillRect(1, 8, 7, 7);
    g.fillRect(9, 8, 6, 7);
    g.fillStyle(0x3a2a1a, 1);
    g.fillRect(0, 7, T, 1);
    g.fillRect(7, 0, 1, 8);
  } else if (pattern === 'floor') {
    // Floor tile with subtle pattern
    g.fillStyle(0x000000, 0.08);
    g.fillRect(0, 0, T, 1);
    g.fillRect(0, 0, 1, T);
    g.fillStyle(0xffffff, 0.04);
    g.fillRect(1, 1, T-1, T-1);
    g.fillStyle(0x000000, 0.06);
    g.fillRect(T-1, 0, 1, T);
    g.fillRect(0, T-1, T, 1);
  } else if (pattern === 'bridge') {
    g.fillStyle(0x553311, 1);
    g.fillRect(0, 4, T, 8);
    g.fillStyle(0x664422, 1);
    g.fillRect(1, 5, T-2, 6);
    g.fillStyle(0x442200, 0.3);
    g.fillRect(0, 7, T, 2);
  } else if (pattern === 'counter') {
    g.fillStyle(0x775533, 1);
    g.fillRect(0, 6, T, 10);
    g.fillStyle(0x886644, 1);
    g.fillRect(1, 4, T-2, 4);
    g.fillStyle(0x664422, 1);
    g.fillRect(0, 14, T, 2);
  } else if (pattern === 'shelf') {
    g.fillStyle(0x553311, 1);
    g.fillRect(1, 1, 14, 14);
    g.fillStyle(0x664422, 1);
    g.fillRect(0, 2, 16, 12);
    g.fillStyle(0x442200, 1);
    g.fillRect(0, 2, 1, 12);
    g.fillRect(15, 2, 1, 12);
    // Items on shelf
    g.fillStyle(0xffcc33, 0.6);
    g.fillRect(3, 4, 2, 3);
    g.fillStyle(0x4488ff, 0.6);
    g.fillRect(7, 3, 3, 3);
    g.fillStyle(0x44ff44, 0.6);
    g.fillRect(11, 5, 2, 2);
  } else if (pattern === 'plant') {
    g.fillStyle(0x225533, 1);
    g.fillRect(4, 10, 8, 6);
    g.fillStyle(0x336644, 1);
    g.fillRect(5, 11, 6, 4);
    g.fillStyle(0x44aa66, 1);
    g.fillRect(6, 3, 4, 10);
    g.fillStyle(0x44cc77, 1);
    g.fillRect(7, 1, 2, 4);
    g.fillStyle(0xff66aa, 0.8);
    g.fillRect(5, 5, 2, 2);
  } else if (pattern === 'sign') {
    g.fillStyle(0x664422, 1);
    g.fillRect(5, 2, 6, 12);
    g.fillStyle(0x775533, 1);
    g.fillRect(6, 1, 4, 13);
    g.fillStyle(0xccaa00, 1);
    g.fillRect(7, 3, 2, 8);
  } else if (pattern === 'gate') {
    g.fillStyle(0x667788, 1);
    g.fillRect(2, 2, 12, 12);
    g.fillStyle(0x8899aa, 1);
    g.fillRect(4, 0, 8, 16);
    g.fillStyle(0x556677, 1);
    g.fillRect(0, 4, 16, 8);
    // Lock
    g.fillStyle(0xffcc00, 1);
    g.fillRect(6, 6, 4, 4);
  } else if (pattern === 'portal') {
    g.fillStyle(0x220044, 1);
    g.fillRect(2, 2, 12, 12);
    g.fillStyle(0xaa44ff, 0.6);
    g.fillRect(3, 3, 10, 10);
    g.fillStyle(0xcc66ff, 0.4);
    g.fillRect(5, 5, 6, 6);
    g.fillStyle(0xffffff, 0.3);
    g.fillRect(7, 7, 2, 2);
  } else if (pattern === 'bed') {
    g.fillStyle(0x664422, 1);
    g.fillRect(1, 8, 14, 8);
    g.fillStyle(0x886644, 1);
    g.fillRect(0, 6, 16, 4);
    g.fillStyle(0x4488ff, 1);
    g.fillRect(2, 10, 12, 5);
    g.fillStyle(0x6699ff, 1);
    g.fillRect(3, 11, 10, 3);
    // Pillow
    g.fillStyle(0xffffff, 0.8);
    g.fillRect(2, 7, 5, 3);
  } else if (pattern === 'table') {
    g.fillStyle(0x775533, 1);
    g.fillRect(1, 4, 14, 3);
    g.fillStyle(0x664422, 1);
    g.fillRect(2, 7, 2, 8);
    g.fillRect(12, 7, 2, 8);
    g.fillStyle(0x886644, 1);
    g.fillRect(0, 3, 16, 2);
  } else if (pattern === 'bar') {
    g.fillStyle(0x553322, 1);
    g.fillRect(0, 4, T, 12);
    g.fillStyle(0x664433, 1);
    g.fillRect(1, 2, T-2, 4);
    g.fillStyle(0x442211, 1);
    g.fillRect(0, 14, T, 2);
    // Bottles
    g.fillStyle(0x44ff44, 0.5);
    g.fillRect(3, 0, 2, 3);
    g.fillStyle(0xff4444, 0.5);
    g.fillRect(7, 0, 2, 3);
    g.fillStyle(0x4488ff, 0.5);
    g.fillRect(11, 0, 2, 3);
  } else if (pattern === 'stairs') {
    g.fillStyle(0x667788, 1);
    for (let i = 0; i < 4; i++) {
      g.fillRect(0, i * 4, T - i * 2, 4);
    }
    g.fillStyle(0x8899aa, 1);
    for (let i = 0; i < 4; i++) {
      g.fillRect(1, i * 4 + 1, T - i * 2 - 2, 2);
    }
  } else if (pattern === 'void') {
    g.fillStyle(0x0a0a1a, 1);
    g.fillRect(0, 0, T, T);
    g.fillStyle(0x1a0a2a, 0.5);
    g.fillRect(2, 2, 12, 12);
    g.fillStyle(0x000000, 0.3);
    g.fillRect(5, 5, 6, 6);
  } else if (pattern === 'ice') {
    g.fillStyle(0x88aadd, 1);
    g.fillRect(0, 0, T, T);
    g.fillStyle(0xaaccff, 0.4);
    g.fillRect(1, 1, 6, 6);
    g.fillRect(8, 7, 6, 6);
    g.fillStyle(0xffffff, 0.2);
    g.fillRect(3, 3, 3, 3);
    g.fillRect(10, 9, 3, 3);
    // Crack lines
    g.fillStyle(0x6688bb, 0.5);
    g.fillRect(7, 0, 1, T);
    g.fillRect(0, 8, T, 1);
  } else if (pattern === 'lava') {
    g.fillStyle(0xcc2200, 1);
    g.fillRect(0, 0, T, T);
    g.fillStyle(0xff4400, 0.6);
    g.fillRect(1, 1, 5, 5);
    g.fillRect(8, 6, 6, 5);
    g.fillRect(3, 10, 5, 5);
    g.fillStyle(0xffaa00, 0.4);
    g.fillRect(2, 2, 3, 3);
    g.fillRect(9, 7, 3, 3);
    g.fillRect(4, 11, 3, 3);
  }
  
  g.generateTexture(key, T, T);
  g.destroy();
}

function generateAllTextures(scene) {
  const tiles = [
    ['tile_floor', COLORS.floor1, 'floor'],
    ['tile_wall', COLORS.wall1, 'wall'],
    ['tile_door', COLORS.wood, 'door'],
    ['tile_water', COLORS.water1, 'water'],
    ['tile_bridge', COLORS.wood, 'bridge'],
    ['tile_grass', COLORS.grass1, 'grass'],
    ['tile_path', COLORS.path1, 'path'],
    ['tile_counter', COLORS.wood, 'counter'],
    ['tile_shelf', COLORS.wood2, 'shelf'],
    ['tile_plant', COLORS.green, 'plant'],
    ['tile_sign', COLORS.wood, 'sign'],
    ['tile_chest', COLORS.brown, 'chest'],
    ['tile_gate', COLORS.metal, 'gate'],
    ['tile_portal', COLORS.purple, 'portal'],
    ['tile_bed', COLORS.wood, 'bed'],
    ['tile_table', COLORS.wood, 'table'],
    ['tile_bar', COLORS.darkBrown, 'bar'],
    ['tile_stairs', COLORS.metal, 'stairs'],
    ['tile_void', COLORS.void1, 'void'],
    ['tile_ice', COLORS.ice1, 'ice'],
    ['tile_lava', COLORS.lava1, 'lava'],
  ];
  tiles.forEach(([key, color, pattern]) => generateTileTexture(scene, key, color, pattern));
}

function getTileKey(type) {
  const map = {[T.FLOOR]:'tile_floor',[T.WALL]:'tile_wall',[T.DOOR]:'tile_door',[T.WATER]:'tile_water',[T.BRIDGE]:'tile_bridge',[T.GRASS]:'tile_grass',[T.PATH]:'tile_path',[T.COUNTER]:'tile_counter',[T.SHELF]:'tile_shelf',[T.PLANT]:'tile_plant',[T.SIGN]:'tile_sign',[T.CHEST]:'tile_chest',[T.GATE]:'tile_gate',[T.PORTAL]:'tile_portal',[T.BED]:'tile_bed',[T.TABLE]:'tile_table',[T.BAR]:'tile_bar',[T.STAIRS]:'tile_stairs',[T.VOID]:'tile_void',[T.ICE]:'tile_ice',[T.LAVA]:'tile_lava'};
  return map[type] || 'tile_floor';
}

// ─── PIXEL ART SPRITE GENERATION ────────────────────────────
// Characters drawn in a 32×40 texture (scale 2), centered properly
// Content area: y=0 to y=32 (head to feet), with 4px padding top and bottom
function generateCharacterTexture(scene, key, species, hairColor, eyeColor, skinColor, outfitColor) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  const s = 2; // pixel scale
  const W = 16 * s; // 32
  const H = 20 * s; // 40
  
  // Offset to center character vertically in texture
  // Character content: head top at ~4px, feet at ~34px
  const CY = 4; // vertical offset to center content
  
  // Shadow
  g.fillStyle(0x000000, 0.3);
  g.fillRect(10, CY + 28, 12, 4);
  
  // Legs
  g.fillStyle(outfitColor, 1);
  g.fillRect(8, CY + 18, 4, 8);
  g.fillRect(20, CY + 18, 4, 8);
  
  // Shoes
  g.fillStyle(0x222222, 1);
  g.fillRect(7, CY + 24, 6, 4);
  g.fillRect(19, CY + 24, 6, 4);
  
  // Body / torso
  g.fillStyle(outfitColor, 1);
  g.fillRect(6, CY + 8, 20, 12);
  
  // Belt / detail
  g.fillStyle(0x000000, 0.2);
  g.fillRect(6, CY + 18, 20, 2);
  
  // Arms
  g.fillStyle(skinColor, 1);
  g.fillRect(2, CY + 10, 4, 10);
  g.fillRect(26, CY + 10, 4, 10);
  
  // Hands
  g.fillStyle(skinColor, 1);
  g.fillRect(2, CY + 18, 4, 3);
  g.fillRect(26, CY + 18, 4, 3);
  
  // Head
  g.fillStyle(skinColor, 1);
  g.fillRect(8, CY + 1, 16, 14);
  
  // Eyes
  g.fillStyle(eyeColor || 0xffffff, 1);
  g.fillRect(11, CY + 6, 3, 3);
  g.fillRect(18, CY + 6, 3, 3);
  
  // Pupil
  g.fillStyle(0x000000, 1);
  g.fillRect(12, CY + 7, 1, 1);
  g.fillRect(19, CY + 7, 1, 1);
  
  // Mouth
  g.fillStyle(0x000000, 0.4);
  g.fillRect(14, CY + 11, 4, 1);
  
  // Hair
  if (hairColor) {
    g.fillStyle(hairColor, 1);
    g.fillRect(7, CY, 18, 5);      // top
    g.fillRect(7, CY + 1, 3, 10);   // left side
    g.fillRect(22, CY + 1, 3, 10);  // right side
    g.fillRect(10, CY + 3, 12, 2);  // bangs
  }
  
  // Species features
  if (species === 'cat') {
    // Ears
    g.fillStyle(hairColor || 0xff8866, 1);
    g.fillRect(6, CY - 4, 5, 6);
    g.fillRect(21, CY - 4, 5, 6);
    g.fillStyle(0xff8866, 1);
    g.fillRect(7, CY - 2, 3, 3);
    g.fillRect(22, CY - 2, 3, 3);
    // Tail
    g.fillStyle(hairColor || 0xff8866, 1);
    g.fillRect(26, CY + 14, 6, 3);
    g.fillRect(30, CY + 10, 3, 6);
  } else if (species === 'frog') {
    // Bulging eyes
    g.fillStyle(0x44aa66, 1);
    g.fillRect(5, CY - 2, 7, 7);
    g.fillRect(20, CY - 2, 7, 7);
    g.fillStyle(0x44ff44, 1);
    g.fillRect(7, CY, 4, 4);
    g.fillRect(21, CY, 4, 4);
    g.fillStyle(0x000000, 1);
    g.fillRect(8, CY + 1, 2, 2);
    g.fillRect(22, CY + 1, 2, 2);
    // Belly
    g.fillStyle(0x55bb77, 1);
    g.fillRect(10, CY + 14, 12, 6);
  } else if (species === 'dragon') {
    // Horns
    g.fillStyle(0xcc3333, 1);
    g.fillRect(6, CY - 4, 3, 6);
    g.fillRect(23, CY - 4, 3, 6);
    // Snout
    g.fillStyle(0xbb3333, 1);
    g.fillRect(12, CY + 10, 8, 4);
    // Tail
    g.fillStyle(0xaa2222, 1);
    g.fillRect(28, CY + 16, 6, 3);
    g.fillRect(32, CY + 12, 3, 6);
    // Wings (small)
    g.fillStyle(0x882222, 0.7);
    g.fillRect(0, CY + 6, 6, 10);
    g.fillRect(26, CY + 6, 6, 10);
  } else if (species === 'robot') {
    // Antenna
    g.fillStyle(0x8899aa, 1);
    g.fillRect(14, CY - 4, 2, 6);
    g.fillStyle(0x44ffff, 1);
    g.fillRect(14, CY - 5, 2, 2);
    // Visor
    g.fillStyle(0x44ffff, 0.8);
    g.fillRect(9, CY + 5, 14, 5);
    g.fillStyle(0x000000, 0.3);
    g.fillRect(9, CY + 5, 14, 5);
    // Panel lines
    g.fillStyle(0x667788, 1);
    g.fillRect(6, CY + 12, 20, 1);
    g.fillRect(6, CY + 16, 20, 1);
  }
  
  g.generateTexture(key, W, H);
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
    
    // Initialize audio on first user interaction
    AudioSys.init();
    
    // Hide loading screen
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
    
    this.scene.start('TitleScene');
  }
}

// ─── TITLE SCENE ────────────────────────────────────────────
class TitleScene extends Phaser.Scene {
  constructor() { super({ key: 'TitleScene' }); this.hasSave = false; }
  
  create() {
    this.hasSave = gameHasSave();
    this.mode = 'title'; // title, menu
    this.cursor = 0;
    
    // Title
    this.titleText = this.add.text(GAME_W/2, 80, 'STELLAR PRINCESSES', { fontSize: '36px', fontFamily: 'monospace', color: '#ffcc33' }).setOrigin(0.5);
    this.add.text(GAME_W/2, 120, '— A Sci-Fi RPG —', { fontSize: '20px', fontFamily: 'monospace', color: '#aa44ff' }).setOrigin(0.5);
    
    // Character sprites parade
    this.spriteY = 240;
    this.charKeys = ['char_lyra', 'char_eryx', 'char_brimble', 'char_drakkor', 'char_pip'];
    this.charLabels = ['Lyra', 'Eryx', 'Brimble', 'Drakkor', 'Pip'];
    this.titleSprites = [];
    this.charKeys.forEach((key, i) => {
      const spr = this.add.image(120 + i * 160, this.spriteY, key).setScale(2).setOrigin(0.5, 0.8);
      this.titleSprites.push(spr);
    });
    
    // Prompt
    this.promptText = this.add.text(GAME_W/2, 380, 'Press Z / SPACE / ENTER', { fontSize: '20px', fontFamily: 'monospace', color: '#ffffff' }).setOrigin(0.5);
    this.tweens.add({ targets: this.promptText, alpha: 0.2, duration: 800, yoyo: true, repeat: -1 });
    
    // Version
    this.add.text(GAME_W/2, GAME_H - 20, 'v3.5 — Phaser 4.2', { fontSize: '14px', fontFamily: 'monospace', color: '#444466' }).setOrigin(0.5);
    
    // Controller status
    this.time.addEvent({ delay: 100, callback: () => updateControllerStatus(this), loop: true });
  }
  
  showMenu() {
    this.mode = 'menu';
    this.cursor = 0;
    this.titleSprites.forEach(s => s.setVisible(false));
    
    const opts = this.hasSave ? ['New Game', 'Continue', 'Settings'] : ['New Game', 'Settings'];
    this.menuTexts = [];
    opts.forEach((o, i) => {
      const isSel = i === this.cursor;
      const txt = this.add.text(GAME_W/2, 220 + i * 44, (isSel ? '▸ ' : '  ') + o, { fontSize: '24px', fontFamily: 'monospace', color: isSel ? '#ffffff' : '#aaaaaa' }).setOrigin(0.5).setDepth(50);
      this.menuTexts.push(txt);
    });
    
    // Erase prompt
    this.promptText.setVisible(false);
  }
  
  startGame(isNew) {
    if (!isNew && this.hasSave) {
      gameLoad();
    } else {
      GameData.party = [{name:'Lyra',species:'human',level:1,xp:0,xpToLevel:100,hp:80,maxHp:80,sp:20,maxSp:20,atk:12,def:8,spd:10,crit:5,equipment:{weapon:null,armor:null,accessory1:null,accessory2:null,implant:null},skills:[{name:'Stellar Slash',cost:5,type:'damage',element:'light',power:1.5}],evolution:0,evolutionName:'Princess'}];
      GameData.inventory = [
        {name:'Plasma Blade',type:'weapon',rarity:'Common',atk:5,level:1},
        {name:'Nano Patch',type:'consumable',rarity:'Common',heal:30,level:1},
        {name:'Nano Patch',type:'consumable',rarity:'Common',heal:30,level:1},
        {name:'Scrap Metal',type:'material',rarity:'Common',level:1},
      ];
      GameData.gold = 500;
      GameData.questFlags = {};
      GameData.playerX = 29;
      GameData.playerY = 20;
      GameData.playerDir = 0;
      townMapData = createTownMap(); // Reset chests
      townChests.forEach(c => c.taken = false);
      gameSave();
    }
    this.scene.start('TownScene');
  }
  
  update() {
    const { dy, interact, cancel, menu } = getInput(this);
    
    // Animate title sprites
    if (this.mode === 'title') {
      this.titleSprites.forEach((spr, i) => {
        const t = (this.time && this.time.now) ? this.time.now : Date.now();
        spr.y = this.spriteY + Math.sin(t * 0.003 + i * 0.8) * 3;
      });
    }
    
    if (this.mode === 'title') {
      if (interact) {
        AudioSys.sfx.interact();
        if (this.hasSave) {
          this.showMenu();
        } else {
          this.startGame(true);
        }
      }
      if (cancel && this.hasSave) {
        // Quick-continue
        this.startGame(false);
      }
    } else if (this.mode === 'menu') {
      const opts = this.hasSave ? ['New Game', 'Continue', 'Settings'] : ['New Game', 'Settings'];
      if (dy < 0 && this.cursor > 0) this.cursor--;
      if (dy > 0 && this.cursor < opts.length - 1) this.cursor++;
      
      opts.forEach((o, i) => {
        const isSel = i === this.cursor;
        if (this.menuTexts[i]) {
          this.menuTexts[i].setText((isSel ? '▸ ' : '  ') + opts[i]);
          this.menuTexts[i].setColor(isSel ? '#ffffff' : '#aaaaaa');
        }
      });
      
      if (cancel) {
        this.mode = 'title';
        this.menuTexts.forEach(t => t.destroy());
        this.menuTexts = [];
        this.titleSprites.forEach(s => s.setVisible(true));
        this.promptText.setVisible(true);
      }
      
      if (interact) {
        AudioSys.sfx.interact();
        if (opts[this.cursor] === 'New Game') {
          this.startGame(true);
        } else if (opts[this.cursor] === 'Continue') {
          this.startGame(false);
        } else if (opts[this.cursor] === 'Settings') {
          // Toggle settings placeholder
        }
      }
    }
  }
}

// ─── TOWN SCENE ─────────────────────────────────────────────
class TownScene extends Phaser.Scene {
  constructor() { super({ key: 'TownScene' }); }
  
  create() {
    this.player = { x: GameData.playerX, y: GameData.playerY, dir: GameData.playerDir, moving: false, frame: 0 };
    this.cameraX = 0;
    this.cameraY = 0;
    this.moveTimer = 0;
    this.npcSprites = [];
    this.chestSprites = [];
    this.signSprites = [];
    this.playerSprite = null;
    this.hudContainer = null;
    this.messageBox = null;
    this.messageTimer = 0;
    
    this.buildMap();
    this.buildNPCs();
    this.buildChests();
    this.buildSigns();
    this.buildPlayer();
    this.buildHUD();
    this.updateCamera();
    
    // Start background music
    AudioSys.playBGM();
    
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
      const img = this.add.image(npc[0] * TILE + TILE/2, npc[1] * TILE + TILE/2, key);
      img.setOrigin(0.5, 0.8); // feet-centered
      img.npcData = { x: npc[0], y: npc[1], type: npc[2], name: npc[3], dialogue: npc[4], shop: npc[5], recruitable: npc[6] };
      // Name label above head
      img.nameLabel = this.add.text(npc[0] * TILE + TILE/2, npc[1] * TILE - 12, npc[3], {
        fontSize: '28px', fontFamily: 'monospace', color: '#aaaacc', backgroundColor: '#0a0a1a88', padding: { x: 2, y: 1 }
      }).setOrigin(0.5).setVisible(false);
      this.npcSprites.push(img);
    });
  }
  
  buildChests() {
    townChests.forEach(c => {
      const img = this.add.image(c.x * TILE + TILE/2, c.y * TILE + TILE/2, 'tile_chest');
      img.setOrigin(0.5, 0.8);
      img.chestData = c;
      this.chestSprites.push(img);
    });
  }
  
  buildSigns() {
    townSigns.forEach(s => {
      const img = this.add.image(s[0] * TILE + TILE/2, s[1] * TILE + TILE/2, 'tile_sign');
      img.setOrigin(0.5, 0.8);
      img.signData = { x: s[0], y: s[1], text: s[2] };
      this.signSprites.push(img);
    });
  }
  
  buildPlayer() {
    this.playerSprite = this.add.image(this.player.x * TILE + TILE/2, this.player.y * TILE + TILE/2, 'char_lyra');
    this.playerSprite.setOrigin(0.5, 0.8); // feet-centered
  }
  
  buildHUD() {
    this.hudContainer = this.add.container(0, 0);
    this.hudContainer.setDepth(100);
    
    const party = GameData.party;
    if (party.length > 0) {
      const leader = party[0];
      // Party panel background
      this.hudContainer.add(this.add.rectangle(70, 30, 140, 56, 0x0a0a1a, 0.85).setOrigin(0).setStrokeStyle(1, 0x4488ff));
      // Name
      this.hudContainer.add(this.add.text(8, 8, leader.name, { fontSize: '14px', fontFamily: 'monospace', color: '#44ddff' }));
      // Level
      this.hudContainer.add(this.add.text(8, 24, 'Lv.' + leader.level, { fontSize: '12px', fontFamily: 'monospace', color: '#aaaacc' }));
      // HP bar
      this.hudContainer.add(this.add.rectangle(56, 12, 100, 8, 0x333333).setOrigin(0));
      this.hudContainer.add(this.hpFill = this.add.rectangle(56, 12, 100, 8, 0x33cc66).setOrigin(0));
      this.hudContainer.add(this.add.text(58, 10, 'HP', { fontSize: '8px', fontFamily: 'monospace', color: '#ffffff' }));
      // HP text
      this.hudContainer.add(this.hpText = this.add.text(154, 8, leader.hp + '/' + leader.maxHp, { fontSize: '10px', fontFamily: 'monospace', color: '#33cc66' }).setOrigin(1, 0));
      // SP bar
      this.hudContainer.add(this.add.rectangle(56, 26, 100, 6, 0x333333).setOrigin(0));
      this.hudContainer.add(this.spFill = this.add.rectangle(56, 26, 100, 6, 0x4488ff).setOrigin(0));
      this.hudContainer.add(this.add.text(58, 24, 'SP', { fontSize: '7px', fontFamily: 'monospace', color: '#ffffff' }));
      // Gold
      this.hudContainer.add(this.add.text(8, 40, GameData.gold + 'g', { fontSize: '12px', fontFamily: 'monospace', color: '#ffcc33' }));
    }
    
    // Controls hint
    this.hudContainer.add(this.add.text(GAME_W/2, GAME_H - 16, 'WASD/Arrows:Move  Z/Space:Interact  X:Esc:Back  M/Enter:Party', {
      fontSize: '11px', fontFamily: 'monospace', color: '#666688'
    }).setOrigin(0.5));
  }
  
  updateHUD() {
    const party = GameData.party;
    if (party.length === 0) return;
    const leader = party[0];
    if (this.hpFill) {
      const hpPct = Math.max(0, leader.hp / leader.maxHp);
      this.hpFill.width = 100 * hpPct;
      this.hpFill.fillColor = hpPct > 0.5 ? 0x33cc66 : hpPct > 0.25 ? 0xffcc33 : 0xff3344;
    }
    if (this.spFill) {
      this.spFill.width = 100 * Math.max(0, leader.sp / leader.maxSp);
    }
    if (this.hpText) {
      this.hpText.setText(leader.hp + '/' + leader.maxHp);
    }
  }
  
  updateCamera() {
    this.cameraX = Phaser.Math.Clamp(this.player.x * TILE - GAME_W/2 + TILE/2, 0, MAP_W * TILE - GAME_W);
    this.cameraY = Phaser.Math.Clamp(this.player.y * TILE - GAME_H/2 + TILE/2, 0, MAP_H * TILE - GAME_H);
    this.mapContainer.setPosition(-this.cameraX, -this.cameraY);
    this.npcSprites.forEach(img => {
      img.setPosition(img.npcData.x * TILE + TILE/2 - this.cameraX, img.npcData.y * TILE + TILE/2 - this.cameraY);
      if (img.nameLabel) {
        img.nameLabel.setPosition(img.npcData.x * TILE + TILE/2 - this.cameraX, img.npcData.y * TILE - 8 - this.cameraY);
        img.nameLabel.setVisible(img.nameLabel.x > 0 && img.nameLabel.x < GAME_W && img.nameLabel.y > 0 && img.nameLabel.y < GAME_H);
      }
    });
    this.chestSprites.forEach(img => img.setPosition(img.chestData.x * TILE + TILE/2 - this.cameraX, img.chestData.y * TILE + TILE/2 - this.cameraY));
    this.signSprites.forEach(img => img.setPosition(img.signData.x * TILE + TILE/2 - this.cameraX, img.signData.y * TILE + TILE/2 - this.cameraY));
    if (this.playerSprite) {
      this.playerSprite.setPosition(this.player.x * TILE + TILE/2 - this.cameraX, this.player.y * TILE + TILE/2 - this.cameraY);
    }
  }
  
  showMessage(text) {
    if (this.messageBox) this.messageBox.destroy();
    this.messageBox = this.add.text(GAME_W/2, 60, text, {
      fontSize: '16px', fontFamily: 'monospace', color: '#ffffff',
      backgroundColor: '#0a0a1aee', padding: { x: 12, y: 6 }, wordWrap: { width: GAME_W - 80 }
    }).setOrigin(0.5).setDepth(150);
    this.messageTimer = 180;
  }
  
  update() {
    const { dx, dy, interact, cancel, menu, gp } = getInput(this);
    
    // Message timer
    if (this.messageTimer > 0) {
      this.messageTimer--;
      if (this.messageTimer <= 0 && this.messageBox) {
        this.messageBox.destroy();
        this.messageBox = null;
      }
    }
    
    // Movement
    if (dx !== 0 || dy !== 0) {
      this.moveTimer++;
      if (this.moveTimer >= 6) {
        this.moveTimer = 0;
        const nx = this.player.x + dx;
        const ny = this.player.y + dy;
        if (!isTownSolid(nx, ny)) {
          const npc = this.npcSprites.find(n => n.npcData.x === nx && n.npcData.y === ny);
          if (!npc) {
            this.player.x = nx;
            this.player.y = ny;
            this.player.dir = dx < 0 ? 1 : dx > 0 ? 2 : dy < 0 ? 3 : 0;
            this.updateCamera();
          }
        }
      }
      // Bob animation
      this.player.frame++;
      if (this.playerSprite) {
        const bob = Math.sin(this.player.frame * 0.3) * 1.5;
        this.playerSprite.y = this.player.y * TILE + TILE/2 - this.cameraY + bob;
      }
    } else {
      this.moveTimer = 0;
      if (this.playerSprite) {
        this.playerSprite.y = this.player.y * TILE + TILE/2 - this.cameraY;
      }
    }
    
    // Interact
    if (interact) {
      const ddx = [0,-1,1,0][this.player.dir];
      const ddy = [1,0,0,-1][this.player.dir];
      const tx = this.player.x + ddx;
      const ty = this.player.y + ddy;
      
      // Check for portal (Stargate)
      if (townMapData[ty] && townMapData[ty][tx] === T.PORTAL) {
        AudioSys.sfx.interact();
        this.scene.launch('DungeonScene', { returnScene: this });
        this.scene.pause();
        return;
      }
      
      const npc = this.npcSprites.find(n => n.npcData.x === tx && n.npcData.y === ty);
      if (npc) {
        AudioSys.sfx.interact();
        if (npc.npcData.shop && !npc.npcData.recruitable) {
          this.scene.launch('ShopScene', { shopType: npc.npcData.shop, npcName: npc.npcData.name });
          this.scene.pause();
        } else {
          this.scene.launch('DialogueScene', { npc: npc.npcData, scene: this });
          this.scene.pause();
        }
        return;
      }
      
      const sign = townSigns.find(s => s[0] === tx && s[1] === ty);
      if (sign) {
        this.scene.launch('DialogueScene', { text: sign[2], scene: this });
        this.scene.pause();
        return;
      }
      
      const chest = townChests.find(c => c.x === tx && c.y === ty && !c.taken);
      if (chest) {
        chest.taken = true;
        GameData.inventory.push(chest.item);
        this.showMessage('Found ' + chest.item.name + '!');
        AudioSys.sfx.chest();
        gameSave();
        return;
      }
    }
    
    // Menu - Party/Inventory screen
    if (menu) {
      AudioSys.sfx.menu();
      this.scene.launch('InventoryScene');
      this.scene.pause();
    }
    
    // Cancel - also opens party screen as a back shortcut
    if (cancel) {
      // Could be used for other things later
    }
    
    // Save position
    GameData.playerX = this.player.x;
    GameData.playerY = this.player.y;
    GameData.playerDir = this.player.dir;
    
    this.updateHUD();
  }
}

// ─── DIALOGUE SCENE (overlay) ──────────────────────────────
class DialogueScene extends Phaser.Scene {
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
      this.nameText = this.add.text(12, this.box.y - 28, data.npc.name, { fontSize: '22px', fontFamily: 'monospace', color: '#44ddff' }).setDepth(201);
    }
    
    this.textText = this.add.text(12, this.box.y - 14, '', { fontSize: '22px', fontFamily: 'monospace', color: '#dddddd', wordWrap: { width: GAME_W - 28 } }).setDepth(201);
  }
  
  update() {
    if (this.done) return;
    
    // Poll input every frame
    const { dy, interact } = getInput(this);
    
    // Text animation — always advance character timer
    this.charTimer++;
    if (this.charTimer >= 2) {
      this.charTimer = 0;
      if (!this.choices && this.curChar < this.lines[this.curLine].length) {
        this.curChar++;
        this.textText.setText(this.lines[this.curLine].substring(0, this.curChar));
      }
    }
    
    if (this.choices) {
      // Choice selection mode
      if (dy < 0 && this.choiceIndex > 0) this.choiceIndex--;
      if (dy > 0 && this.choiceIndex < this.choices.length - 1) this.choiceIndex++;
      
      // Update choice colors
      this.choiceTexts.forEach((t, i) => {
        const isSel = i === this.choiceIndex;
        t.setColor(isSel ? '#ffffff' : '#aaaaaa');
        t.setText((isSel ? '> ' : '  ') + this.choices[i]);
      });
      
      if (interact) {
        if (this.choiceIndex === 0 && this.npcData && this.npcData.recruitable) {
          this.recruit();
        }
        this.done = true;
        this.scene.stop();
        if (this.mainScene) this.mainScene.scene.resume();
      }
    } else {
      // Text advancement mode
      if (interact) {
        if (this.curChar < this.lines[this.curLine].length) {
          // Skip to end of current line
          this.curChar = this.lines[this.curLine].length;
          this.textText.setText(this.lines[this.curLine]);
        } else {
          // Advance to next line
          this.curLine++;
          if (this.curLine >= this.lines.length) {
            if (this.isNPC && this.mainScene) {
              // Show recruit choice
              this.choices = ['Invite ' + this.npcData.name + ' to join', 'Maybe later'];
              this.choiceIndex = 0;
              this.textText.setText('');
              this.choiceTexts.forEach(t => t.destroy());
              this.choiceTexts = [];
              this.choices.forEach((c, i) => {
                const color = i === this.choiceIndex ? '#ffffff' : '#aaaaaa';
                const prefix = i === this.choiceIndex ? '> ' : '  ';
                this.choiceTexts.push(this.add.text(14, this.box.y - 14 + i * 16, prefix + c, { fontSize: '22px', fontFamily: 'monospace', color: color }).setDepth(201));
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
    this.add.text(42, 24, titles[this.shopType] || 'Shop', { fontSize: '28px', fontFamily: 'monospace', color: '#ffcc33' }).setDepth(201);
    this.add.text(GAME_W - 120, 24, 'Gold: ' + GameData.gold + 'g', { fontSize: '22px', fontFamily: 'monospace', color: '#ffcc33' }).setDepth(201);
    
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
        this.menuTexts.push(this.add.text(52, 55 + i * 24, prefix + o, { fontSize: '22px', fontFamily: 'monospace', color: color }).setDepth(201));
      });
    } else {
      const items = this.mode === 'buy' ? this.catalog : GameData.inventory;
      items.forEach((item, i) => {
        const color = i === this.cursor ? '#ffffff' : '#aaaaaa';
        const prefix = i === this.cursor ? '> ' : '  ';
        const label = item.name + (this.mode === 'buy' ? ' - ' + item.price + 'g' : '');
        this.menuTexts.push(this.add.text(52, 55 + i * 20, prefix + label, { fontSize: '22px', fontFamily: 'monospace', color: color }).setDepth(201));
      });
    }
    
    if (this.message && this.messageTimer > 0) {
      this.menuTexts.push(this.add.text(42, GAME_H - 50, this.message, { fontSize: '22px', fontFamily: 'monospace', color: '#ffcc33' }).setDepth(201));
    }
  }
  
  endShop() {
    gameSave();
    this.scene.stop();
    this.scene.get('TownScene').scene.resume();
  }
}

// ─── INVENTORY / PARTY SCENE (overlay) ──────────────────────
class InventoryScene extends Phaser.Scene {
  constructor() { super({ key: 'InventoryScene' }); }
  
  create() {
    this.mode = 'party'; // party, inventory, equip, itemAction, pickChar
    this.cursor = 0;
    this.charIndex = 0;
    this.slotIndex = 0;
    this._itemIdx = 0;
    this.contentTexts = [];
    this.tabTexts = [];
    
    // Background
    this.bg = this.add.rectangle(GAME_W/2, GAME_H/2, GAME_W - 16, GAME_H - 16, 0x050514, 0.96).setDepth(200);
    this.bg.setStrokeStyle(2, 0x4488ff);
    
    // Tabs
    this.tabParty = this.add.text(20, 12, 'PARTY', { fontSize: '36px', fontFamily: 'monospace', color: '#44ddff' }).setDepth(201);
    this.tabInv = this.add.text(80, 12, 'ITEMS', { fontSize: '36px', fontFamily: 'monospace', color: '#666688' }).setDepth(201);
    
    // Gold display
    this.add.text(GAME_W - 20, 12, GameData.gold + 'g', { fontSize: '36px', fontFamily: 'monospace', color: '#ffcc33' }).setDepth(201).setOrigin(1, 0);
    
    // Separator line
    this.add.rectangle(GAME_W/2, 26, GAME_W - 36, 1, 0x4488ff, 0.5).setDepth(201);
    
    this.updateContent();
  }
  
  updateContent() {
    this.contentTexts.forEach(t => t.destroy());
    this.contentTexts = [];
    
    // Update tab colors
    this.tabParty.setColor(this.mode === 'party' ? '#44ddff' : '#666688');
    this.tabInv.setColor(this.mode === 'inventory' || this.mode === 'itemAction' || this.mode === 'pickChar' ? '#44ddff' : '#666688');
    
    if (this.mode === 'party') {
      this.renderParty();
    } else if (this.mode === 'inventory') {
      this.renderInventory();
    } else if (this.mode === 'itemAction') {
      this.renderItemAction();
    } else if (this.mode === 'pickChar') {
      this.renderPickChar();
    } else if (this.mode === 'equip') {
      this.renderEquip();
    }
  }
  
  renderParty() {
    const party = GameData.party;
    if (party.length === 0) {
      this.contentTexts.push(this.add.text(GAME_W/2, GAME_H/2, 'No party members', { fontSize: '24px', fontFamily: 'monospace', color: '#666688' }).setDepth(201).setOrigin(0.5));
      return;
    }
    
    party.forEach((c, i) => {
      const isSel = i === this.charIndex;
      const bg = this.add.rectangle(GAME_W/2, 40 + i * 44, GAME_W - 36, 40, isSel ? 0x1a1a3a : 0x0a0a1a, 0.9).setDepth(201);
      if (isSel) bg.setStrokeStyle(1, 0x44ddff);
      this.contentTexts.push(bg);
      
      // Character sprite
      const charKey = 'char_' + (c.species === 'human' ? 'lyra' : c.species === 'cat' ? 'eryx' : c.species === 'frog' ? 'brimble' : c.species === 'dragon' ? 'drakkor' : c.species === 'robot' ? 'pip' : 'townie1');
      const spr = this.add.image(30, 40 + i * 44, charKey).setDepth(202).setScale(0.8);
      this.contentTexts.push(spr);
      
      // Name and level
      this.contentTexts.push(this.add.text(48, 32 + i * 44, c.name + '  Lv.' + c.level, { fontSize: '36px', fontFamily: 'monospace', color: isSel ? '#ffffff' : '#dddddd' }).setDepth(202));
      
      // HP bar
      const hpPct = c.maxHp > 0 ? c.hp / c.maxHp : 0;
      this.contentTexts.push(this.add.rectangle(48, 44 + i * 44, 60, 5, 0x333333).setDepth(202));
      this.contentTexts.push(this.add.rectangle(48, 44 + i * 44, 60 * hpPct, 5, hpPct > 0.5 ? 0x33cc66 : hpPct > 0.25 ? 0xffcc33 : 0xff3344).setDepth(202));
      this.contentTexts.push(this.add.text(110, 42 + i * 44, 'HP ' + c.hp + '/' + c.maxHp, { fontSize: '28px', fontFamily: 'monospace', color: '#aaaacc' }).setDepth(202));
      
      // Stats
      this.contentTexts.push(this.add.text(170, 34 + i * 44, 'ATK:' + c.atk, { fontSize: '16px', fontFamily: 'monospace', color: '#ff8833' }).setDepth(202));
      this.contentTexts.push(this.add.text(220, 34 + i * 44, 'DEF:' + c.def, { fontSize: '16px', fontFamily: 'monospace', color: '#4488ff' }).setDepth(202));
      this.contentTexts.push(this.add.text(170, 44 + i * 44, 'SPD:' + c.spd, { fontSize: '16px', fontFamily: 'monospace', color: '#44ff44' }).setDepth(202));
      this.contentTexts.push(this.add.text(220, 44 + i * 44, 'CRIT:' + c.crit + '%', { fontSize: '16px', fontFamily: 'monospace', color: '#ffcc33' }).setDepth(202));
      
      // Equipment summary
      const eq = c.equipment;
      const weaponName = eq.weapon ? eq.weapon.name : '-';
      const armorName = eq.armor ? eq.armor.name : '-';
      this.contentTexts.push(this.add.text(280, 34 + i * 44, 'W:' + weaponName, { fontSize: '28px', fontFamily: 'monospace', color: '#cccccc' }).setDepth(202));
      this.contentTexts.push(this.add.text(280, 44 + i * 44, 'A:' + armorName, { fontSize: '28px', fontFamily: 'monospace', color: '#cccccc' }).setDepth(202));
      
      // Selection cursor
      if (isSel) {
        this.contentTexts.push(this.add.text(18, 40 + i * 44, '>', { fontSize: '36px', fontFamily: 'monospace', color: '#44ddff' }).setDepth(202));
      }
    });
    
    // Controls hint
    this.contentTexts.push(this.add.text(GAME_W/2, GAME_H - 20, '↑↓:Select  Z/Enter:Details  X/Esc:Close  Tab:Items', { fontSize: '28px', fontFamily: 'monospace', color: '#666688' }).setDepth(201).setOrigin(0.5));
  }
  
  renderInventory() {
    const inv = GameData.inventory;
    if (inv.length === 0) {
      this.contentTexts.push(this.add.text(GAME_W/2, GAME_H/2, 'Inventory is empty', { fontSize: '24px', fontFamily: 'monospace', color: '#666688' }).setDepth(201).setOrigin(0.5));
      this.contentTexts.push(this.add.text(GAME_W/2, GAME_H/2 + 16, 'Tab:Party  X/Esc:Close', { fontSize: '28px', fontFamily: 'monospace', color: '#666688' }).setDepth(201).setOrigin(0.5));
      return;
    }
    
    inv.forEach((item, i) => {
      const isSel = i === this.cursor;
      const y = 36 + i * 18;
      if (y > GAME_H - 24) return;
      
      const bg = this.add.rectangle(GAME_W/2, y, GAME_W - 36, 16, isSel ? 0x1a1a3a : 0x000000, 0).setDepth(201);
      if (isSel) bg.setStrokeStyle(1, 0x44ddff);
      this.contentTexts.push(bg);
      
      // Type icon
      const typeColors = {weapon: '#ff8833', armor: '#4488ff', consumable: '#44ff44', material: '#aaaacc', accessory: '#ff66aa', implant: '#44ffff'};
      this.contentTexts.push(this.add.text(20, y - 1, item.type.toUpperCase(), { fontSize: '24px', fontFamily: 'monospace', color: typeColors[item.type] || '#aaaacc' }).setDepth(202));
      
      this.contentTexts.push(this.add.text(70, y - 1, (isSel ? '> ' : '  ') + item.name + (item.level > 1 ? ' +' + item.level : ''), { fontSize: '18px', fontFamily: 'monospace', color: isSel ? '#ffffff' : '#dddddd' }).setDepth(202));
      
      // Item stats
      let stats = '';
      if (item.atk) stats += 'ATK+' + item.atk + ' ';
      if (item.def) stats += 'DEF+' + item.def + ' ';
      if (item.heal) stats += 'HEAL+' + item.heal + ' ';
      if (stats) {
        this.contentTexts.push(this.add.text(200, y - 1, stats, { fontSize: '28px', fontFamily: 'monospace', color: '#aaaacc' }).setDepth(202));
      }
      
      // Rarity
      const rarityColors = {Common: '#aaaacc', Uncommon: '#44ff44', Rare: '#4488ff', Epic: '#aa44ff', Legendary: '#ffcc33'};
      if (item.rarity) {
        this.contentTexts.push(this.add.text(280, y - 1, item.rarity, { fontSize: '28px', fontFamily: 'monospace', color: rarityColors[item.rarity] || '#aaaacc' }).setDepth(202));
      }
    });
    
    this.contentTexts.push(this.add.text(GAME_W/2, GAME_H - 20, '↑↓:Select  Z/Enter:Use/Equip  X/Esc:Close  Tab:Party', { fontSize: '28px', fontFamily: 'monospace', color: '#666688' }).setDepth(201).setOrigin(0.5));
  }
  
  renderItemAction() {
    const item = GameData.inventory[this._itemIdx];
    if (!item) { this.mode = 'inventory'; this.updateContent(); return; }
    
    // Item info
    this.contentTexts.push(this.add.text(GAME_W/2, 40, item.name, { fontSize: '24px', fontFamily: 'monospace', color: '#ffffff' }).setDepth(201).setOrigin(0.5));
    this.contentTexts.push(this.add.text(GAME_W/2, 56, item.type.toUpperCase() + (item.rarity ? ' — ' + item.rarity : ''), { fontSize: '18px', fontFamily: 'monospace', color: '#aaaacc' }).setDepth(201).setOrigin(0.5));
    
    let statsY = 72;
    if (item.atk) { this.contentTexts.push(this.add.text(GAME_W/2, statsY, 'Attack: +' + item.atk, { fontSize: '18px', fontFamily: 'monospace', color: '#ff8833' }).setDepth(201).setOrigin(0.5)); statsY += 14; }
    if (item.def) { this.contentTexts.push(this.add.text(GAME_W/2, statsY, 'Defense: +' + item.def, { fontSize: '18px', fontFamily: 'monospace', color: '#4488ff' }).setDepth(201).setOrigin(0.5)); statsY += 14; }
    if (item.heal) { this.contentTexts.push(this.add.text(GAME_W/2, statsY, 'Heal: +' + item.heal + ' HP', { fontSize: '18px', fontFamily: 'monospace', color: '#44ff44' }).setDepth(201).setOrigin(0.5)); statsY += 14; }
    
    statsY += 10;
    const actions = ['Equip', 'Drop', 'Cancel'];
    actions.forEach((a, i) => {
      const isSel = i === this.cursor;
      const bg = this.add.rectangle(GAME_W/2, statsY + i * 20, 80, 16, isSel ? 0x1a1a3a : 0x000000, 0).setDepth(201);
      if (isSel) bg.setStrokeStyle(1, 0x44ddff);
      this.contentTexts.push(bg);
      this.contentTexts.push(this.add.text(GAME_W/2, statsY + i * 20 - 1, (isSel ? '> ' : '  ') + a, { fontSize: '18px', fontFamily: 'monospace', color: isSel ? '#ffffff' : '#aaaaaa' }).setDepth(202).setOrigin(0.5));
    });
  }
  
  renderPickChar() {
    this.contentTexts.push(this.add.text(GAME_W/2, 36, 'Equip to who?', { fontSize: '36px', fontFamily: 'monospace', color: '#ffffff' }).setDepth(201).setOrigin(0.5));
    
    GameData.party.forEach((c, i) => {
      const isSel = i === this.cursor;
      const bg = this.add.rectangle(GAME_W/2, 56 + i * 24, GAME_W - 50, 20, isSel ? 0x1a1a3a : 0x0a0a1a, 0.8).setDepth(201);
      if (isSel) bg.setStrokeStyle(1, 0x44ddff);
      this.contentTexts.push(bg);
      this.contentTexts.push(this.add.text(30, 50 + i * 24, (isSel ? '> ' : '  ') + c.name + ' Lv.' + c.level, { fontSize: '18px', fontFamily: 'monospace', color: isSel ? '#ffffff' : '#dddddd' }).setDepth(202));
    });
  }
  
  update() {
    const { dx, dy, interact, cancel } = getInput(this);
    const gp = this.input.gamepad ? this.input.gamepad.getPad(0) : null;
    
    // Tab switching
    if (gp && gp.buttons[4] && Phaser.Input.Gamepad.JustDown(gp.buttons[4])) {
      this.mode = this.mode === 'party' || this.mode === 'inventory' ? (this.mode === 'party' ? 'inventory' : 'party') : this.mode;
      this.cursor = 0;
      this.updateContent();
    }
    
    if (this.mode === 'party') {
      if (dy < 0 && this.charIndex > 0) this.charIndex--;
      if (dy > 0 && this.charIndex < GameData.party.length - 1) this.charIndex++;
      if (cancel) { this.scene.stop(); this.scene.get('TownScene').scene.resume(); }
      if (interact) { this.mode = 'equip'; this.cursor = 0; }
      this.updateContent();
    } else if (this.mode === 'inventory') {
      if (dy < 0 && this.cursor > 0) this.cursor--;
      if (dy > 0 && this.cursor < GameData.inventory.length - 1) this.cursor++;
      if (cancel) { this.scene.stop(); this.scene.get('TownScene').scene.resume(); }
      if (interact && GameData.inventory[this.cursor]) {
        this.mode = 'itemAction';
        this._itemIdx = this.cursor;
        this.cursor = 0;
      }
      this.updateContent();
    } else if (this.mode === 'itemAction') {
      const actions = ['Equip', 'Drop', 'Cancel'];
      if (dy < 0 && this.cursor > 0) this.cursor--;
      if (dy > 0 && this.cursor < actions.length - 1) this.cursor++;
      if (cancel) { this.mode = 'inventory'; this.cursor = this._itemIdx; }
      if (interact) {
        const act = actions[this.cursor];
        const item = GameData.inventory[this._itemIdx];
        if (act === 'Equip') {
          if (item && (item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory' || item.type === 'implant')) {
            this.mode = 'pickChar'; this.cursor = 0;
          } else {
            // Consumable — use immediately on self
            if (item && item.type === 'consumable' && item.heal) {
              const leader = GameData.party[0];
              if (leader) {
                leader.hp = Math.min(leader.maxHp, leader.hp + item.heal);
              }
              GameData.inventory.splice(this._itemIdx, 1);
              this.mode = 'inventory'; this.cursor = Math.min(this.cursor, Math.max(0, GameData.inventory.length - 1));
            }
          }
        } else if (act === 'Drop') {
          GameData.inventory.splice(this._itemIdx, 1);
          this.mode = 'list'; this.cursor = Math.min(this.cursor, Math.max(0, GameData.inventory.length - 1));
        } else {
          this.mode = 'inventory'; this.cursor = this._itemIdx;
        }
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
        this.mode = 'inventory'; this.cursor = 0;
      }
      this.updateContent();
    } else if (this.mode === 'equip') {
      if (dy < 0 && this.slotIndex > 0) this.slotIndex--;
      if (dy > 0 && this.slotIndex < 4) this.slotIndex++;
      if (dx < 0 && this.charIndex > 0) this.charIndex--;
      if (dx > 0 && this.charIndex < GameData.party.length - 1) this.charIndex++;
      if (cancel) { this.mode = 'party'; }
      if (interact) {
        const ch = GameData.party[this.charIndex];
        const slots = ['weapon', 'armor', 'accessory1', 'accessory2', 'implant'];
        const slot = slots[this.slotIndex];
        if (ch.equipment[slot]) {
          GameData.inventory.push(ch.equipment[slot]);
          ch.equipment[slot] = null;
        }
      }
      this.renderParty();
      // Show equip slots for selected character
      const ch = GameData.party[this.charIndex];
      if (ch) {
        const slots = ['Weapon', 'Armor', 'Acc 1', 'Acc 2', 'Implant'];
        slots.forEach((s, i) => {
          const isSel = i === this.slotIndex;
          const slotKey = ['weapon', 'armor', 'accessory1', 'accessory2', 'implant'][i];
          const item = ch.equipment[slotKey];
          this.contentTexts.push(this.add.text(300, 50 + i * 16, (isSel ? '> ' : '  ') + s + ': ' + (item ? item.name : '-'), { fontSize: '28px', fontFamily: 'monospace', color: isSel ? '#ffffff' : '#aaaaaa' }).setDepth(202));
        });
      }
    }
  }
}

// ─── COMBAT SCENE ────────────────────────────────────────────
class CombatScene extends Phaser.Scene {
  constructor() { super({ key: 'CombatScene' }); }
  
  create(data) {
    this.enemies = data.enemies || [];
    this.party = GameData.party;
    this.turn = 0;
    this.cursor = 0;
    this.mode = 'main'; // main, attack, skill, item, target
    this.selectedSkill = null;
    this.selectedItem = null;
    this.selectedTarget = 0;
    this.combatLog = [];
    this.animating = false;
    this.outcome = null; // 'victory', 'defeat', 'fled'
    
    // Stop BGM during combat
    AudioSys.stopBGM();
    
    // Background
    this.add.rectangle(GAME_W/2, GAME_H/2, GAME_W, GAME_H, 0x0a0520, 1).setDepth(300);
    
    // Combat arena background
    this.add.rectangle(GAME_W/2, GAME_H/2 - 20, GAME_W - 20, GAME_H - 60, 0x1a0a3a, 0.9).setDepth(301).setStrokeStyle(2, 0x4488ff);
    
    this.enemySprites = [];
    this.partySprites = [];
    this.combatTexts = [];
    
    this.renderCombat();
  }
  
  log(msg) {
    this.combatLog.push(msg);
    if (this.combatLog.length > 3) this.combatLog.shift();
  }
  
  renderCombat() {
    this.combatTexts.forEach(t => t.destroy());
    this.combatTexts = [];
    this.enemySprites.forEach(s => s.destroy());
    this.enemySprites = [];
    this.partySprites.forEach(s => s.destroy());
    this.partySprites = [];
    
    const startLogY = 8;
    this.combatLog.forEach((msg, i) => {
      this.combatTexts.push(this.add.text(10, startLogY + i * 10, msg, { fontSize: '28px', fontFamily: 'monospace', color: '#cccccc' }).setDepth(302));
    });
    
    // Render enemies
    this.enemies.forEach((e, i) => {
      if (e.hp <= 0) return;
      const x = GAME_W - 60 - i * 50;
      const y = 70;
      const g = this.add.graphics().setDepth(302);
      // Enemy body
      g.fillStyle(e.color || 0xff3344, 1);
      g.fillRect(x - 10, y - 15, 20, 25);
      // Eyes
      g.fillStyle(0xffffff, 1);
      g.fillRect(x - 5, y - 10, 3, 3);
      g.fillRect(x + 2, y - 10, 3, 3);
      g.fillStyle(0xff0000, 1);
      g.fillRect(x - 4, y - 9, 1, 1);
      g.fillRect(x + 3, y - 9, 1, 1);
      this.enemySprites.push(g);
      // HP bar
      const hpPct = e.hp / e.maxHp;
      this.combatTexts.push(this.add.rectangle(x, y + 12, 20, 3, 0x333333).setDepth(302));
      this.combatTexts.push(this.add.rectangle(x, y + 12, 20 * hpPct, 3, hpPct > 0.5 ? 0x33cc66 : 0xff3344).setDepth(302));
      this.combatTexts.push(this.add.text(x, y + 18, e.name, { fontSize: '24px', fontFamily: 'monospace', color: '#ff8888' }).setDepth(302).setOrigin(0.5));
    });
    
    // Render party
    this.party.forEach((c, i) => {
      const x = 50 + i * 50;
      const y = GAME_H - 50;
      const charKey = 'char_' + (c.species === 'human' ? 'lyra' : c.species === 'cat' ? 'eryx' : c.species === 'frog' ? 'brimble' : c.species === 'dragon' ? 'drakkor' : c.species === 'robot' ? 'pip' : 'townie1');
      const spr = this.add.image(x, y, charKey).setDepth(302).setScale(0.7);
      this.partySprites.push(spr);
      // HP bar
      const hpPct = c.maxHp > 0 ? c.hp / c.maxHp : 0;
      this.combatTexts.push(this.add.rectangle(x, y + 18, 24, 3, 0x333333).setDepth(302));
      this.combatTexts.push(this.add.rectangle(x, y + 18, 24 * hpPct, 3, hpPct > 0.5 ? 0x33cc66 : hpPct > 0.25 ? 0xffcc33 : 0xff3344).setDepth(302));
      this.combatTexts.push(this.add.text(x, y + 24, c.name, { fontSize: '24px', fontFamily: 'monospace', color: '#44ddff' }).setDepth(302).setOrigin(0.5));
    });
    
    // Menu area
    if (this.mode === 'main') {
      const opts = ['Attack', 'Skill', 'Item', 'Flee'];
      opts.forEach((o, i) => {
        const isSel = i === this.cursor;
        this.combatTexts.push(this.add.text(10 + (i % 2) * 80, GAME_H - 30 + Math.floor(i / 2) * 14, (isSel ? '> ' : '  ') + o, { fontSize: '18px', fontFamily: 'monospace', color: isSel ? '#ffffff' : '#aaaaaa' }).setDepth(302));
      });
    } else if (this.mode === 'attack' || this.mode === 'skill' || this.mode === 'item') {
      // Target selection
      const alive = this.enemies.filter(e => e.hp > 0);
      alive.forEach((e, i) => {
        const isSel = i === this.selectedTarget;
        this.combatTexts.push(this.add.text(10, GAME_H - 30 + i * 14, (isSel ? '> ' : '  ') + e.name + ' HP:' + e.hp + '/' + e.maxHp, { fontSize: '16px', fontFamily: 'monospace', color: isSel ? '#ffffff' : '#aaaaaa' }).setDepth(302));
      });
      this.combatTexts.push(this.add.text(10, GAME_H - 10, 'X/Esc: Back', { fontSize: '28px', fontFamily: 'monospace', color: '#666688' }).setDepth(302));
    }
  }
  
  update() {
    if (this.animating || this.outcome) {
      if (this.outcome) {
        const { cancel, interact } = getInput(this);
        if (cancel || interact) {
          if (this.outcome === 'victory') {
            // Award XP and gold
            const xpGain = this.enemies.reduce((s, e) => s + (e.xp || 20), 0);
            const goldGain = this.enemies.reduce((s, e) => s + (e.gold || 10), 0);
            GameData.gold += goldGain;
            this.party.forEach(c => {
              c.xp = (c.xp || 0) + xpGain;
              if (c.xp >= c.xpToLevel) {
                c.xp -= c.xpToLevel;
                c.level++;
                c.maxHp += 10;
                c.hp = c.maxHp;
                c.atk += 2;
                c.def += 1;
                c.xpToLevel = Math.floor(c.xpToLevel * 1.3);
              }
            });
            gameSave();
          }
          AudioSys.playBGM();
          this.scene.stop();
          if (this.returnScene) {
            this.returnScene.scene.resume();
            if (this.returnScene.showMessage) {
              if (this.outcome === 'victory') {
                this.returnScene.showMessage('Victory! Gained ' + this.enemies.reduce((s, e) => s + (e.xp || 20), 0) + ' XP!');
              } else if (this.outcome === 'fled') {
                this.returnScene.showMessage('Escaped safely.');
              } else {
                this.returnScene.showMessage('Defeated...');
              }
            }
          }
        }
      }
      return;
    }
    
    const { dy, interact, cancel } = getInput(this);
    
    if (this.mode === 'main') {
      const opts = ['Attack', 'Skill', 'Item', 'Flee'];
      if (dy < 0 && this.cursor > 0) this.cursor--;
      if (dy > 0 && this.cursor < opts.length - 1) this.cursor++;
      if (cancel) {
        AudioSys.playBGM();
        this.scene.stop();
        if (this.returnScene) this.returnScene.scene.resume();
      }
      if (interact) {
        const opt = opts[this.cursor];
        if (opt === 'Attack') { this.mode = 'attack'; this.selectedTarget = 0; }
        else if (opt === 'Skill') { this.mode = 'skill'; this.selectedTarget = 0; }
        else if (opt === 'Item') { this.mode = 'item'; this.selectedTarget = 0; }
        else if (opt === 'Flee') {
          this.outcome = 'fled';
          this.log('Fled from battle!');
          this.renderCombat();
        }
      }
      this.renderCombat();
    } else if (this.mode === 'attack' || this.mode === 'skill' || this.mode === 'item') {
      const alive = this.enemies.filter(e => e.hp > 0);
      if (dy < 0 && this.selectedTarget > 0) this.selectedTarget--;
      if (dy > 0 && this.selectedTarget < alive.length - 1) this.selectedTarget++;
      if (cancel) { this.mode = 'main'; this.cursor = 0; }
      if (interact) {
        const target = alive[this.selectedTarget];
        if (target) {
          const attacker = this.party[0]; // Leader attacks
          let damage = 0;
          if (this.mode === 'attack') {
            damage = Math.max(1, attacker.atk - (target.def || 0) + Math.floor(Math.random() * 5));
            target.hp -= damage;
            this.log(attacker.name + ' attacks ' + target.name + ' for ' + damage + '!');
            AudioSys.sfx.hurt();
          } else if (this.mode === 'skill') {
            if (attacker.sp >= 5) {
              attacker.sp -= 5;
              damage = Math.max(1, Math.floor(attacker.atk * 1.5) - (target.def || 0) + Math.floor(Math.random() * 8));
              target.hp -= damage;
              this.log(attacker.name + ' uses Stellar Slash on ' + target.name + ' for ' + damage + '!');
              AudioSys.sfx.hurt();
            } else {
              this.log('Not enough SP!');
            }
          } else if (this.mode === 'item') {
            // Use first consumable
            const consumable = GameData.inventory.find(i => i.type === 'consumable' && i.heal);
            if (consumable) {
              attacker.hp = Math.min(attacker.maxHp, attacker.hp + consumable.heal);
              GameData.inventory.splice(GameData.inventory.indexOf(consumable), 1);
              this.log(attacker.name + ' uses ' + consumable.name + '!');
              AudioSys.sfx.heal();
            } else {
              this.log('No consumables!');
            }
          }
          
          // Check if all enemies dead
          if (this.enemies.every(e => e.hp <= 0)) {
            this.outcome = 'victory';
            this.log('Victory!');
            AudioSys.sfx.victory();
            this.renderCombat();
            return;
          }
          
          // Enemy turn
          this.enemyTurn();
          
          // Check if all party dead
          if (this.party.every(c => c.hp <= 0)) {
            this.outcome = 'defeat';
            this.log('Defeated...');
            this.renderCombat();
            return;
          }
          
          this.mode = 'main';
          this.cursor = 0;
        }
      }
      this.renderCombat();
    }
  }
  
  enemyTurn() {
    const aliveParty = this.party.filter(c => c.hp > 0);
    if (aliveParty.length === 0) return;
    
    this.enemies.forEach(e => {
      if (e.hp <= 0) return;
      const target = aliveParty[Math.floor(Math.random() * aliveParty.length)];
      const damage = Math.max(1, (e.atk || 10) - target.def + Math.floor(Math.random() * 4));
      target.hp -= damage;
      this.log(e.name + ' attacks ' + target.name + ' for ' + damage + '!');
      AudioSys.sfx.hurt();
    });
  }
}

// ─── DUNGEON SCENE ──────────────────────────────────────────
class DungeonScene extends Phaser.Scene {
  constructor() { super({ key: 'DungeonScene' }); }
  
  create(data) {
    this.returnScene = data.returnScene;
    this.player = { x: 5, y: 5, dir: 0 };
    this.cameraX = 0;
    this.cameraY = 0;
    this.moveTimer = 0;
    this.playerSprite = null;
    this.mapContainer = null;
    this.enemySprites = [];
    this.enemyContainer = null;
    this.dungeonMap = this.createDungeonMap();
    
    AudioSys.stopBGM();
    
    this.buildMap();
    this.buildPlayer();
    this.buildEnemies();
    this.updateCamera();
    
    this.time.addEvent({ delay: 100, callback: () => updateControllerStatus(this), loop: true });
  }
  
  createDungeonMap() {
    const W = 30, H = 20;
    const map = [];
    for (let y = 0; y < H; y++) { map[y] = []; for (let x = 0; x < W; x++) map[y][x] = T.WALL; }
    
    // Rooms
    const rooms = [
      {x:2,y:2,w:6,h:6}, {x:10,y:2,w:6,h:5}, {x:18,y:2,w:7,h:6},
      {x:2,y:10,w:5,h:5}, {x:10,y:10,w:8,h:6}, {x:20,y:10,w:6,h:5},
      {x:5,y:16,w:8,h:3}, {x:16,y:15,w:6,h:4}
    ];
    
    rooms.forEach(r => {
      for (let y = r.y; y < r.y + r.h; y++)
        for (let x = r.x; x < r.x + r.w; x++)
          if (y >= 0 && y < H && x >= 0 && x < W) map[y][x] = T.FLOOR;
    });
    
    // Corridors
    const corridors = [
      [5,5,10,5], [13,5,13,4], [21,5,21,4],
      [4,10,4,8], [10,12,8,12], [14,12,14,10],
      [22,10,22,8], [8,16,8,14], [16,16,14,16]
    ];
    corridors.forEach(c => {
      const minX = Math.min(c[0], c[2]), maxX = Math.max(c[0], c[2]);
      const minY = Math.min(c[1], c[3]), maxY = Math.max(c[1], c[3]);
      for (let y = minY; y <= maxY; y++)
        for (let x = minX; x <= maxX; x++)
          if (y >= 0 && y < H && x >= 0 && x < W) map[y][x] = T.FLOOR;
    });
    
    // Exit
    map[18][5] = T.STAIRS;
    
    // Portal back
    map[2][2] = T.PORTAL;
    
    return { data: map, w: W, h: H };
  }
  
  isDungeonSolid(x, y) {
    if (x < 0 || x >= this.dungeonMap.w || y < 0 || y >= this.dungeonMap.h) return true;
    return this.dungeonMap.data[y][x] === T.WALL;
  }
  
  buildMap() {
    this.mapContainer = this.add.container(0, 0);
    for (let y = 0; y < this.dungeonMap.h; y++) {
      for (let x = 0; x < this.dungeonMap.w; x++) {
        const key = getTileKey(this.dungeonMap.data[y][x]);
        const img = this.add.image(x * TILE + TILE/2, y * TILE + TILE/2, key);
        img.setCrop(0, 0, TILE, TILE);
        this.mapContainer.add(img);
      }
    }
  }
  
  buildPlayer() {
    this.playerSprite = this.add.image(this.player.x * TILE + TILE/2, this.player.y * TILE + TILE/2, 'char_lyra');
    this.playerSprite.setOrigin(0.5, 0.8);
  }
  
  buildEnemies() {
    this.enemyContainer = this.add.container(0, 0).setDepth(10);
    const enemyPositions = [
      {x:12,y:4,name:'Void Scout',hp:30,maxHp:30,atk:8,def:2,xp:25,gold:15,color:0x8844aa},
      {x:22,y:5,name:'Void Scout',hp:30,maxHp:30,atk:8,def:2,xp:25,gold:15,color:0x8844aa},
      {x:5,y:12,name:'Shadow Lurker',hp:45,maxHp:45,atk:12,def:4,xp:40,gold:25,color:0x442266},
      {x:14,y:13,name:'Shadow Lurker',hp:45,maxHp:45,atk:12,def:4,xp:40,gold:25,color:0x442266},
      {x:22,y:12,name:'Void Knight',hp:70,maxHp:70,atk:16,def:8,xp:80,gold:50,color:0x6622aa},
      {x:7,y:17,name:'Shadow Lurker',hp:45,maxHp:45,atk:12,def:4,xp:40,gold:25,color:0x442266},
    ];
    
    enemyPositions.forEach(e => {
      const g = this.add.graphics();
      g.fillStyle(e.color, 1);
      g.fillRect(-8, -12, 16, 20);
      g.fillStyle(0xffffff, 1);
      g.fillRect(-4, -8, 2, 2);
      g.fillRect(2, -8, 2, 2);
      g.fillStyle(0xff0000, 1);
      g.fillRect(-3, -7, 1, 1);
      g.fillRect(3, -7, 1, 1);
      g.setPosition(e.x * TILE + TILE/2, e.y * TILE + TILE/2);
      g.enemyData = e;
      this.enemyContainer.add(g);
      this.enemySprites.push(g);
    });
  }
  
  updateCamera() {
    this.cameraX = Phaser.Math.Clamp(this.player.x * TILE - GAME_W/2 + TILE/2, 0, this.dungeonMap.w * TILE - GAME_W);
    this.cameraY = Phaser.Math.Clamp(this.player.y * TILE - GAME_H/2 + TILE/2, 0, this.dungeonMap.h * TILE - GAME_H);
    this.mapContainer.setPosition(-this.cameraX, -this.cameraY);
    this.enemyContainer.setPosition(-this.cameraX, -this.cameraY);
    if (this.playerSprite) {
      this.playerSprite.setPosition(this.player.x * TILE + TILE/2 - this.cameraX, this.player.y * TILE + TILE/2 - this.cameraY);
    }
  }
  
  update() {
    const { dx, dy, interact, cancel } = getInput(this);
    
    if (dx !== 0 || dy !== 0) {
      this.moveTimer++;
      if (this.moveTimer >= 6) {
        this.moveTimer = 0;
        const nx = this.player.x + dx;
        const ny = this.player.y + dy;
        if (!this.isDungeonSolid(nx, ny)) {
          // Check for stairs
          if (this.dungeonMap.data[ny] && this.dungeonMap.data[ny][nx] === T.STAIRS) {
            AudioSys.playBGM();
            this.scene.stop();
            if (this.returnScene) this.returnScene.scene.resume();
            return;
          }
          // Check for portal
          if (this.dungeonMap.data[ny] && this.dungeonMap.data[ny][nx] === T.PORTAL) {
            AudioSys.playBGM();
            this.scene.stop();
            if (this.returnScene) this.returnScene.scene.resume();
            return;
          }
          // Check for enemy collision
          const enemy = this.enemySprites.find(g => g.enemyData && g.enemyData.hp > 0 && g.enemyData.x === nx && g.enemyData.y === ny);
          if (enemy) {
            // Start combat!
            this.scene.launch('CombatScene', {
              enemies: [enemy.enemyData],
              returnScene: this
            });
            this.scene.pause();
            return;
          }
          this.player.x = nx;
          this.player.y = ny;
          this.updateCamera();
        }
      }
    } else {
      this.moveTimer = 0;
    }
    
    if (cancel) {
      AudioSys.playBGM();
      this.scene.stop();
      if (this.returnScene) this.returnScene.scene.resume();
    }
    
    if (interact) {
      // Check for adjacent enemy
      const ddx = [0,-1,1,0][this.player.dir];
      const ddy = [1,0,0,-1][this.player.dir];
      const enemy = this.enemySprites.find(g => g.enemyData && g.enemyData.hp > 0 && g.enemyData.x === this.player.x + ddx && g.enemyData.y === this.player.y + ddy);
      if (enemy) {
        this.scene.launch('CombatScene', {
          enemies: [enemy.enemyData],
          returnScene: this
        });
        this.scene.pause();
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
  scene: [BootScene, TitleScene, TownScene, DialogueScene, ShopScene, InventoryScene, CombatScene, DungeonScene]
};

const game = new Phaser.Game(config);
