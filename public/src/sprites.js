// ═══════════════════════════════════════════════════════════════
// SPRITES — Procedural pixel art character sprite generation
// ═══════════════════════════════════════════════════════════════

export function generateCharacterTexture(scene, key, species, hairColor, eyeColor, skinColor, outfitColor) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  const s = 2; // pixel scale
  const W = 16 * s; // 32
  const H = 20 * s; // 40
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
    g.fillRect(7, CY, 18, 5);
    g.fillRect(7, CY + 1, 3, 10);
    g.fillRect(22, CY + 1, 3, 10);
    g.fillRect(10, CY + 3, 12, 2);
  }

  // Species features
  if (species === 'cat') {
    g.fillStyle(hairColor || 0xff8866, 1);
    g.fillRect(6, CY - 4, 5, 6); g.fillRect(21, CY - 4, 5, 6);
    g.fillStyle(0xff8866, 1);
    g.fillRect(7, CY - 2, 3, 3); g.fillRect(22, CY - 2, 3, 3);
    g.fillStyle(hairColor || 0xff8866, 1);
    g.fillRect(26, CY + 14, 6, 3); g.fillRect(30, CY + 10, 3, 6);
  } else if (species === 'frog') {
    g.fillStyle(0x44aa66, 1); g.fillRect(5, CY - 2, 7, 7); g.fillRect(20, CY - 2, 7, 7);
    g.fillStyle(0x44ff44, 1); g.fillRect(7, CY, 4, 4); g.fillRect(21, CY, 4, 4);
    g.fillStyle(0x000000, 1); g.fillRect(8, CY + 1, 2, 2); g.fillRect(22, CY + 1, 2, 2);
    g.fillStyle(0x55bb77, 1); g.fillRect(10, CY + 14, 12, 6);
  } else if (species === 'dragon') {
    g.fillStyle(0xcc3333, 1); g.fillRect(6, CY - 4, 3, 6); g.fillRect(23, CY - 4, 3, 6);
    g.fillStyle(0xbb3333, 1); g.fillRect(12, CY + 10, 8, 4);
    g.fillStyle(0xaa2222, 1); g.fillRect(28, CY + 16, 6, 3); g.fillRect(32, CY + 12, 3, 6);
    g.fillStyle(0x882222, 0.7); g.fillRect(0, CY + 6, 6, 10); g.fillRect(26, CY + 6, 6, 10);
  } else if (species === 'robot') {
    g.fillStyle(0x8899aa, 1); g.fillRect(14, CY - 4, 2, 6);
    g.fillStyle(0x44ffff, 1); g.fillRect(14, CY - 5, 2, 2);
    g.fillStyle(0x44ffff, 0.8); g.fillRect(9, CY + 5, 14, 5);
    g.fillStyle(0x000000, 0.3); g.fillRect(9, CY + 5, 14, 5);
    g.fillStyle(0x667788, 1); g.fillRect(6, CY + 12, 20, 1); g.fillRect(6, CY + 16, 20, 1);
  }

  g.generateTexture(key, W, H);
  g.destroy();
}
