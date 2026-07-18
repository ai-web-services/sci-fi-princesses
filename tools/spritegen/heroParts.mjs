import { PixelCanvas } from './canvas.mjs';
import { poseFor } from './animations.mjs';
import { resolvePose } from './skeleton.mjs';

const HEROES = {
  erynn: { species: 'felidae', body: 'erynnSuit', accent: 'erynnAcc', skin: 'erynnFur', eye: 'lyraTrim', weapon: 'steel', hair: 'erynnFur' },
  brimble: { species: 'anura', body: 'brimbleRobe', accent: 'brimbleBelly', skin: 'brimbleSkin', eye: 'lyraTrim', weapon: 'steel', hair: 'brimbleSkin' },
  drakkor: { species: 'drakonid', body: 'drakkorPlate', accent: 'drakkorHorn', skin: 'drakkorScale', eye: 'lyraTrim', weapon: 'steel', hair: 'drakkorHorn' },
  pip: { species: 'construct', body: 'pipShell', accent: 'pipBrass', skin: 'pipShell', eye: 'pipCore', weapon: 'pipBrass', hair: 'pipShell' }
};

export const HERO_DESCRIPTORS = Object.entries(HEROES).map(([id, style]) => ({
  id, category: 'hero', stage: 'base', species: style.species, source: 'procedural sprite-rig generator; no external pixels', fitScale: 0.64,
  spec: 'ART_VISION.md §3.3 / §11 Route P', postProcessing: ['auto-shade', 'auto-selout', 'nearest-neighbor cell fit', 'declared-ramp validation'],
  license: 'Original generated pixels; no external source material', ramps: [...new Set([style.body, style.accent, style.skin, style.eye, style.weapon, 'starlight'])],
  accentRamps: [style.eye, style.weapon, 'starlight'], actions: ['idle', 'walk'], directions: ['front', 'back', 'side-left', 'side-right'], style
}));

function drawFace(c, desc, cx, y, direction, back) {
  if (back) return;
  const sgn = direction === 'side-left' ? -1 : 1;
  const side = direction.startsWith('side');
  const mat = (name, step, x, yy, w, h) => c.fillRect(x, yy, w, h, name, step);
  const faceX = side ? cx + sgn * 5 : cx;
  c.ellipse(faceX, y + 14, side ? 6 : 8, side ? 6 : 7, desc.style.skin, 3);
  if (side) {
    mat(desc.style.eye, 0, cx + sgn * 4, y + 11, 3, 1);
    mat(desc.style.eye, 4, cx + sgn * 5, y + 13, 2, 2);
    mat(desc.style.eye, 2, cx + sgn * 6, y + 13, 1, 2);
    mat(desc.style.skin, 4, cx + sgn * 10, y + 15, 2, 2);
  } else {
    mat(desc.style.eye, 0, cx - 7, y + 12, 3, 1); mat(desc.style.eye, 0, cx + 5, y + 12, 3, 1);
    mat('starlight', 4, cx - 6, y + 13, 3, 2); mat('starlight', 4, cx + 5, y + 13, 3, 2);
    mat(desc.style.eye, 2, cx - 5, y + 13, 2, 2); mat(desc.style.eye, 2, cx + 6, y + 13, 2, 2);
  }
}

export function drawHero(desc, action, frame, direction) {
  const c = new PixelCanvas(64, 64), style = desc.style;
  const { stride, bob } = poseFor(action, frame), sockets = resolvePose(direction, bob);
  const cx = sockets.head[0], y = sockets.head[1] - 10, side = direction.startsWith('side'), back = direction === 'back', sgn = direction === 'side-left' ? -1 : 1;
  const mat = (name, step, x, yy, w, h) => c.fillRect(x, yy, w, h, name, step);

  if (style.species === 'construct') {
    c.ellipse(cx, y + 13, 11, 11, style.body, 2);
    mat(style.accent, 2, cx - 8, y + 4, 3, 4); mat(style.accent, 3, cx + 5, y + 4, 3, 4);
  } else if (style.species === 'anura') {
    c.ellipse(cx, y + 12, 14, 10, style.skin, 2);
    mat(style.skin, 4, cx - 10, y + 1, 5, 4); mat(style.skin, 4, cx + 5, y + 1, 5, 4);
  } else if (style.species === 'drakonid') {
    c.polygon([[cx - 12, y + 17], [cx - 9, y + 4], [cx, y], [cx + 10, y + 5], [cx + 13, y + 18], [cx + 6, y + 24], [cx - 8, y + 23]], style.skin, 2);
    c.polygon([[cx - 9, y + 6], [cx - 15, y - 3], [cx - 5, y + 2]], style.hair, 2);
    c.polygon([[cx + 9, y + 6], [cx + 15, y - 3], [cx + 5, y + 2]], style.hair, 2);
  } else {
    c.ellipse(cx, y + 12, 11, 11, style.skin, 2);
    c.polygon([[cx - 8, y + 5], [cx - 14, y - 5], [cx - 5, y + 1]], style.hair, 2);
    c.polygon([[cx + 8, y + 5], [cx + 14, y - 5], [cx + 5, y + 1]], style.hair, 2);
  }
  drawFace(c, desc, cx, y, direction, back);

  if (style.species === 'construct') {
    c.ellipse(cx, y + 28, 9, 8, style.body, 2); mat(style.accent, 3, cx - 7, y + 25, 3, 8); mat(style.accent, 3, cx + 5, y + 25, 3, 8);
  } else {
    c.polygon([[cx - (side ? 6 : 9), y + 21], [cx + (side ? 6 : 9), y + 21], [cx + (side ? 7 : 10), y + 35], [cx - (side ? 7 : 10), y + 35]], style.body, 2);
    mat(style.accent, 3, cx - (side ? 4 : 7), y + 24, side ? 4 : 6, 7);
    if (style.species === 'anura') c.ellipse(cx, y + 29, side ? 5 : 7, 5, style.accent, 3);
  }
  mat(style.accent, 2, cx - (side ? 6 : 8), y + 31, side ? 12 : 16, 2);

  if (side) {
    mat(style.body, 1, cx + sgn * 1 - 1, y + 22, 3, 9); mat(style.skin, 3, cx + sgn * 1 - 1, y + 31, 3, 2);
  } else {
    mat(style.body, 1, cx - 10, y + 23, 3, 8); mat(style.body, 3, cx + 7, y + 23, 3, 8);
    mat(style.skin, 3, cx - 10, y + 31, 3, 2); mat(style.skin, 3, cx + 7, y + 31, 3, 2);
  }
  if (style.species === 'construct') {
    mat(style.body, 2, cx - 7, y + 38, 5, 5); mat(style.body, 2, cx + 2, y + 38, 5, 5);
  } else if (side) {
    mat(style.body, 1, cx - sgn * 4, y + 35 + (stride < 0 ? 1 : 0), 4, 8); mat(style.body, 2, cx + sgn * 0, y + 35 + (stride > 0 ? 1 : 0), 4, 8);
  } else {
    mat(style.body, 1, cx - 6, y + 35 + (stride < 0 ? 1 : 0), 4, 8); mat(style.body, 2, cx + 3, y + 35 + (stride > 0 ? 1 : 0), 4, 8);
  }
  if (side) {
    const handX = direction === 'side-left' ? cx - 8 : cx + 7;
    mat(style.skin, 3, handX - 1, y + 27, 3, 3);
    c.line(handX, y + 28, handX + sgn * 7, y + (style.species === 'anura' ? 23 : 17), style.weapon, 2);
  }
  c.autoShade(); c.autoSelout(); return c;
}
