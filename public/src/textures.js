// ═══════════════════════════════════════════════════════════════
// TEXTURES — Procedural tile texture generation
// ═══════════════════════════════════════════════════════════════

import { TILE, COLORS, T } from './config.js';

export function generateTileTexture(scene, key, color, pattern) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  const T = TILE;

  g.fillStyle(color, 1);
  g.fillRect(0, 0, T, T);

  if (pattern === 'wall') {
    g.fillStyle(0x000000, 0.15);
    g.fillRect(0, T - 3, T, 3);
    g.fillRect(0, T/2, T, 2);
    g.fillStyle(0xffffff, 0.05);
    g.fillRect(0, 0, T, 1);
    g.fillRect(0, 0, 1, T);
    g.fillStyle(0x000000, 0.1);
    g.fillRect(T/2, 0, 1, T/2);
    g.fillRect(0, T/2, T/2, 1);
    g.fillRect(T/2, T/2+2, T/2, 1);
  } else if (pattern === 'water') {
    g.fillStyle(0xffffff, 0.12);
    g.fillRect(1, 3, 6, 1); g.fillRect(8, 7, 6, 1); g.fillRect(2, 11, 5, 1); g.fillRect(9, 14, 5, 1);
    g.fillStyle(0xffffff, 0.06);
    g.fillRect(4, 5, 3, 1); g.fillRect(11, 9, 3, 1); g.fillRect(6, 13, 4, 1);
  } else if (pattern === 'chest') {
    g.fillStyle(0x664422, 1); g.fillRect(2, 5, 12, 11);
    g.fillStyle(0x553311, 1); g.fillRect(2, 5, 12, 3);
    g.fillStyle(0x775533, 1); g.fillRect(2, 8, 12, 8);
    g.fillStyle(0xccaa00, 1); g.fillRect(1, 5, 1, 11); g.fillRect(14, 5, 1, 11); g.fillRect(6, 5, 4, 11);
    g.fillStyle(0xffcc00, 1); g.fillRect(7, 9, 2, 3);
    g.fillStyle(0xaa8800, 1); g.fillRect(7, 9, 2, 1);
  } else if (pattern === 'door') {
    g.fillStyle(0x664422, 1); g.fillRect(1, 0, 14, 16);
    g.fillStyle(0x553311, 1); g.fillRect(2, 1, 12, 14);
    g.fillStyle(0x775533, 1); g.fillRect(3, 2, 5, 5); g.fillRect(8, 2, 5, 5); g.fillRect(3, 9, 5, 5); g.fillRect(8, 9, 5, 5);
    g.fillStyle(0xccaa00, 1); g.fillRect(11, 7, 2, 2);
    g.fillStyle(0xffdd44, 1); g.fillRect(11, 7, 1, 1);
  } else if (pattern === 'grass') {
    g.fillStyle(0x1a4428, 1); g.fillRect(0, 0, T, T);
    g.fillStyle(0x225533, 1); g.fillRect(2, 2, 3, 3); g.fillRect(8, 5, 4, 3); g.fillRect(3, 10, 3, 3); g.fillRect(10, 12, 3, 3);
    g.fillStyle(0x336644, 1); g.fillRect(5, 3, 2, 2); g.fillRect(11, 8, 2, 2); g.fillRect(1, 7, 2, 2); g.fillRect(7, 13, 2, 2);
    g.fillStyle(0x44aa66, 0.6); g.fillRect(3, 1, 1, 3); g.fillRect(9, 4, 1, 3); g.fillRect(5, 9, 1, 3); g.fillRect(12, 11, 1, 3);
  } else if (pattern === 'path') {
    g.fillStyle(0x4a3a2a, 1); g.fillRect(0, 0, T, T);
    g.fillStyle(0x554433, 1); g.fillRect(1, 1, 6, 6); g.fillRect(8, 1, 7, 6); g.fillRect(1, 8, 7, 7); g.fillRect(9, 8, 6, 7);
    g.fillStyle(0x3a2a1a, 1); g.fillRect(0, 7, T, 1); g.fillRect(7, 0, 1, 8);
  } else if (pattern === 'floor') {
    g.fillStyle(0x000000, 0.08); g.fillRect(0, 0, T, 1); g.fillRect(0, 0, 1, T);
    g.fillStyle(0xffffff, 0.04); g.fillRect(1, 1, T-1, T-1);
    g.fillStyle(0x000000, 0.06); g.fillRect(T-1, 0, 1, T); g.fillRect(0, T-1, T, 1);
  } else if (pattern === 'bridge') {
    g.fillStyle(0x553311, 1); g.fillRect(0, 4, T, 8);
    g.fillStyle(0x664422, 1); g.fillRect(1, 5, T-2, 6);
    g.fillStyle(0x442200, 0.3); g.fillRect(0, 7, T, 2);
  } else if (pattern === 'counter') {
    g.fillStyle(0x775533, 1); g.fillRect(0, 6, T, 10);
    g.fillStyle(0x886644, 1); g.fillRect(1, 4, T-2, 4);
    g.fillStyle(0x664422, 1); g.fillRect(0, 14, T, 2);
  } else if (pattern === 'shelf') {
    g.fillStyle(0x553311, 1); g.fillRect(1, 1, 14, 14);
    g.fillStyle(0x664422, 1); g.fillRect(0, 2, 16, 12);
    g.fillStyle(0x442200, 1); g.fillRect(0, 2, 1, 12); g.fillRect(15, 2, 1, 12);
    g.fillStyle(0xffcc33, 0.6); g.fillRect(3, 4, 2, 3);
    g.fillStyle(0x4488ff, 0.6); g.fillRect(7, 3, 3, 3);
    g.fillStyle(0x44ff44, 0.6); g.fillRect(11, 5, 2, 2);
  } else if (pattern === 'plant') {
    g.fillStyle(0x225533, 1); g.fillRect(4, 10, 8, 6);
    g.fillStyle(0x336644, 1); g.fillRect(5, 11, 6, 4);
    g.fillStyle(0x44aa66, 1); g.fillRect(6, 3, 4, 10);
    g.fillStyle(0x44cc77, 1); g.fillRect(7, 1, 2, 4);
    g.fillStyle(0xff66aa, 0.8); g.fillRect(5, 5, 2, 2);
  } else if (pattern === 'sign') {
    g.fillStyle(0x664422, 1); g.fillRect(5, 2, 6, 12);
    g.fillStyle(0x775533, 1); g.fillRect(6, 1, 4, 13);
    g.fillStyle(0xccaa00, 1); g.fillRect(7, 3, 2, 8);
  } else if (pattern === 'gate') {
    g.fillStyle(0x667788, 1); g.fillRect(2, 2, 12, 12);
    g.fillStyle(0x8899aa, 1); g.fillRect(4, 0, 8, 16);
    g.fillStyle(0x556677, 1); g.fillRect(0, 4, 16, 8);
    g.fillStyle(0xffcc00, 1); g.fillRect(6, 6, 4, 4);
  } else if (pattern === 'portal') {
    g.fillStyle(0x220044, 1); g.fillRect(2, 2, 12, 12);
    g.fillStyle(0xaa44ff, 0.6); g.fillRect(3, 3, 10, 10);
    g.fillStyle(0xcc66ff, 0.4); g.fillRect(5, 5, 6, 6);
    g.fillStyle(0xffffff, 0.3); g.fillRect(7, 7, 2, 2);
  } else if (pattern === 'bed') {
    g.fillStyle(0x664422, 1); g.fillRect(1, 8, 14, 8);
    g.fillStyle(0x886644, 1); g.fillRect(0, 6, 16, 4);
    g.fillStyle(0x4488ff, 1); g.fillRect(2, 10, 12, 5);
    g.fillStyle(0x6699ff, 1); g.fillRect(3, 11, 10, 3);
    g.fillStyle(0xffffff, 0.8); g.fillRect(2, 7, 5, 3);
  } else if (pattern === 'table') {
    g.fillStyle(0x775533, 1); g.fillRect(1, 4, 14, 3);
    g.fillStyle(0x664422, 1); g.fillRect(2, 7, 2, 8); g.fillRect(12, 7, 2, 8);
    g.fillStyle(0x886644, 1); g.fillRect(0, 3, 16, 2);
  } else if (pattern === 'bar') {
    g.fillStyle(0x553322, 1); g.fillRect(0, 4, T, 12);
    g.fillStyle(0x664433, 1); g.fillRect(1, 2, T-2, 4);
    g.fillStyle(0x442211, 1); g.fillRect(0, 14, T, 2);
    g.fillStyle(0x44ff44, 0.5); g.fillRect(3, 0, 2, 3);
    g.fillStyle(0xff4444, 0.5); g.fillRect(7, 0, 2, 3);
    g.fillStyle(0x4488ff, 0.5); g.fillRect(11, 0, 2, 3);
  } else if (pattern === 'stairs') {
    g.fillStyle(0x667788, 1);
    for (let i = 0; i < 4; i++) g.fillRect(0, i * 4, T - i * 2, 4);
    g.fillStyle(0x8899aa, 1);
    for (let i = 0; i < 4; i++) g.fillRect(1, i * 4 + 1, T - i * 2 - 2, 2);
  } else if (pattern === 'void') {
    g.fillStyle(0x0a0a1a, 1); g.fillRect(0, 0, T, T);
    g.fillStyle(0x1a0a2a, 0.5); g.fillRect(2, 2, 12, 12);
    g.fillStyle(0x000000, 0.3); g.fillRect(5, 5, 6, 6);
  } else if (pattern === 'ice') {
    g.fillStyle(0x88aadd, 1); g.fillRect(0, 0, T, T);
    g.fillStyle(0xaaccff, 0.4); g.fillRect(1, 1, 6, 6); g.fillRect(8, 7, 6, 6);
    g.fillStyle(0xffffff, 0.2); g.fillRect(3, 3, 3, 3); g.fillRect(10, 9, 3, 3);
    g.fillStyle(0x6688bb, 0.5); g.fillRect(7, 0, 1, T); g.fillRect(0, 8, T, 1);
  } else if (pattern === 'lava') {
    g.fillStyle(0xcc2200, 1); g.fillRect(0, 0, T, T);
    g.fillStyle(0xff4400, 0.6); g.fillRect(1, 1, 5, 5); g.fillRect(8, 6, 6, 5); g.fillRect(3, 10, 5, 5);
    g.fillStyle(0xffaa00, 0.4); g.fillRect(2, 2, 3, 3); g.fillRect(9, 7, 3, 3); g.fillRect(4, 11, 3, 3);
  }

  g.generateTexture(key, T, T);
  g.destroy();
}

export function generateAllTextures(scene) {
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

export function getTileKey(type) {
  const map = {
    [T.FLOOR]:'tile_floor',[T.WALL]:'tile_wall',[T.DOOR]:'tile_door',
    [T.WATER]:'tile_water',[T.BRIDGE]:'tile_bridge',[T.GRASS]:'tile_grass',
    [T.PATH]:'tile_path',[T.COUNTER]:'tile_counter',[T.SHELF]:'tile_shelf',
    [T.PLANT]:'tile_plant',[T.SIGN]:'tile_sign',[T.CHEST]:'tile_chest',
    [T.GATE]:'tile_gate',[T.PORTAL]:'tile_portal',[T.BED]:'tile_bed',
    [T.TABLE]:'tile_table',[T.BAR]:'tile_bar',[T.STAIRS]:'tile_stairs',
    [T.VOID]:'tile_void',[T.ICE]:'tile_ice',[T.LAVA]:'tile_lava'
  };
  return map[type] || 'tile_floor';
}
