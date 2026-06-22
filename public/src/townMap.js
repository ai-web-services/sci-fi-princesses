// ═══════════════════════════════════════════════════════════════
// TOWN MAP — Map data, NPCs, signs, chests
// ═══════════════════════════════════════════════════════════════

import { MAP_W, MAP_H, T } from './config.js';

export function createTownMap() {
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

export function isTownSolid(x, y) {
  if (x < 0 || x >= MAP_W || y < 0 || y >= MAP_H) return true;
  const t = townMapData[y][x];
  return t === T.WALL || t === T.COUNTER || t === T.SHELF || t === T.TABLE || t === T.BAR || t === T.BED;
}

// NPCs: [x, y, type, name, dialogue, shop, recruitable]
export const townNPCs = [
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

export const townSigns = [
  [28,13,'<- Crown Spire'],[12,13,'-> Weapon Shop'],[46,13,'-> Armor Shop'],
  [9,25,'v The Nebula Tavern'],[48,25,'v Healer\'s Hall'],[4,13,'-> Material Shop'],
  [5,11,'^ Training Ground'],[28,29,'v Stargate Dock']
];

export const townChests = [
  {x:26,y:4,item:{name:'Plasma Blade',type:'weapon',rarity:'Common',atk:5,level:1}},
  {x:33,y:4,item:{name:'Nano Patch',type:'consumable',rarity:'Common',heal:30,level:1}},
];

// Mutable map data (reset on new game)
export let townMapData = createTownMap();

export function resetTownMap() {
  townMapData = createTownMap();
}
