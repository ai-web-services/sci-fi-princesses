import { PixelCanvas } from './canvas.mjs';
import { poseFor } from './animations.mjs';
import { resolvePose } from './skeleton.mjs';
import { drawHairTemplate } from './hair.mjs';

export function drawLyra(action, frame, direction) {
  const c = new PixelCanvas(64, 64);
  const { stride, bob } = poseFor(action, frame);
  const side = direction.startsWith('side');
  const back = direction === 'back';
  const sgn = direction === 'side-left' ? -1 : 1; // facing sign for side rows
  const sockets = resolvePose(direction, bob);
  const cx = sockets.head[0];
  const y = sockets.head[1] - 10;
  const mat = (name, step, x, yy, w, h) => c.fillRect(x, yy, w, h, name, step);

  // ── HEAD: each direction is a distinct drawing, not an offset of front ──
  drawHairTemplate(c, 'sweep', { cx, y, side, back, sgn });
  if (back) {
    // Back: hair mass only — no face.
  } else if (side) {
    // Profile: face pushed to the facing edge.
    c.ellipse(cx + sgn * 5, y + 14, 6, 6, 'skinFair', 3);
    mat('skinFair', 3, cx + sgn * 10, y + 13, 1, 3);  // nose step on the outline
    // single profile eye at the facing edge
    mat('lyraEye', 0, cx + sgn * 4, y + 11, 3, 1);     // dark brow/lash row
    mat('lyraEye', 0, cx + sgn * 4, y + 12, 3, 1);
    mat('starlight', 4, cx + sgn * 5, y + 13, 2, 2);
    mat('lyraEye', 2, cx + sgn * 6, y + 13, 1, 2);
  } else {
    // Front: full face, both eyes.
    c.ellipse(cx, y + 13, 9, 7, 'skinFair', 3);
    // lash/brow row → white sclera → 2px cyan iris
    mat('lyraEye', 0, cx - 8, y + 12, 3, 1); mat('lyraEye', 0, cx + 5, y + 12, 3, 1);
    mat('starlight', 4, cx - 7, y + 13, 3, 2); mat('starlight', 4, cx + 5, y + 13, 3, 2);
    mat('lyraEye', 2, cx - 6, y + 13, 2, 2); mat('lyraEye', 2, cx + 6, y + 13, 2, 2);
  }

  // ── TORSO ──
  c.polygon([[cx - (side ? 6 : 9), y + 21], [cx + (side ? 6 : 9), y + 21], [cx + (side ? 7 : 10), y + 35], [cx - (side ? 7 : 10), y + 35]], 'lyraDress', 2);
  if (back) {
    mat('lyraDress', 1, cx - 1, y + 22, 2, 12);            // back seam
  } else if (side) {
    // Gold center trim is a FRONT feature. In profile it appears only as a 1px
    // glimpse at the leading edge on step frames of the cycle.
    if (stride > 0) mat('lyraTrim', 2, cx + sgn * 6, y + 24, 1, 7);
    mat('lyraDress', 1, cx - sgn * 6, y + 22, 3, 12);      // rear shading of torso
  } else {
    mat('lyraDress', 1, cx - 10, y + 26, 4, 8);
    mat('lyraDress', 3, cx + 5, y + 23, 4, 8);
    mat('lyraTrim', 2, cx - 1, y + 23, 3, 10);             // gold center trim (front only)
  }
  mat('lyraTrim', 3, cx - (side ? 6 : 8), y + 31, side ? 12 : 16, 2); // belt wraps all directions

  // ── ARMS: long sleeves, skin only at the hands ──
  if (side) {
    // Near arm occludes the torso; far arm hidden.
    mat('lyraDress', 1, cx + sgn * 1 - 1, y + 22, 3, 9);
    mat('skinFair', 3, cx + sgn * 1 - 1, y + 31, 3, 2);
  } else {
    mat('lyraDress', 1, cx - 10, y + 22, 3, 4);
    mat('lyraDress', 3, cx + 7, y + 22, 3, 4);
    mat('lyraDress', 1, cx - 11, y + 25, 3, 6);
    mat('lyraDress', 2, cx + 9, y + 25, 3, 6);
    mat('skinFair', 2, cx - 11, y + 31, 3, 2);
    mat('skinFair', 3, cx + 9, y + 31, 3, 2);
  }

  // ── LEGS + BOOTS: sides get near-leg-in-front depth ──
  if (side) {
    const farLeg = cx - sgn * 4, nearLeg = cx + sgn * 0;
    mat('lyraDress', 1, farLeg, y + 35 + (stride < 0 ? 1 : 0), 4, 8);
    mat('steel', 1, farLeg - 1, y + 43 + (stride < 0 ? 1 : 0), 6, 3);
    mat('lyraDress', 2, nearLeg, y + 35 + (stride > 0 ? 1 : 0), 4, 8);
    mat('steel', 1, nearLeg - 1, y + 43 + (stride > 0 ? 1 : 0), 6, 3);
  } else {
    const leftLeg = cx - 6, rightLeg = cx + 3;
    mat('lyraDress', 1, leftLeg, y + 35 + (stride < 0 ? 1 : 0), 4, 8);
    mat('lyraDress', 2, rightLeg, y + 35 + (stride > 0 ? 1 : 0), 4, 8);
    mat('steel', 1, leftLeg - 1, y + 43 + (stride < 0 ? 1 : 0), 6, 3);
    mat('steel', 1, rightLeg - 1, y + 43 + (stride > 0 ? 1 : 0), 6, 3);
  }

  // ── WEAPON (profile rows only) ──
  if (side) {
    const handX = direction === 'side-left' ? cx - 8 : cx + 7;
    mat('skinFair', 3, handX - 1, y + 27, 3, 3);
    const weaponX = direction === 'side-left' ? cx - 9 : cx + 8;
    c.line(weaponX, y + 28, weaponX + sgn * 7, y + 17, 'steel', 2);
    mat('lyraTrim', 2, weaponX - 2, y + 27, 5, 2);
  }

  c.autoShade();
  c.autoSelout();
  return c;
}
