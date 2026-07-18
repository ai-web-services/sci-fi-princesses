import { PixelCanvas } from './canvas.mjs';
import { poseFor } from './animations.mjs';
import { resolvePose } from './skeleton.mjs';

const FAMILY = {
  void: ['voidDeep', 'voidGlow', 'voidGlow'], mire: ['novaGrass', 'pipCore', 'pipCore'],
  ash: ['voidAsh', 'lyraTrim', 'lyraTrim'], trade: ['leather', 'brass', 'brass']
};

export function enemyStyle(id) {
  const family = /void|shade|gate/.test(id) ? 'void' : /mire|drowned|bog|tide|coral|eel/.test(id) ? 'mire' : /ember|ash|magma|drake/.test(id) ? 'ash' : 'trade';
  return { family, ramps: FAMILY[family], kind: /golem|sentry/.test(id) ? 'construct' : /crab|beetle/.test(id) ? 'wide' : /wisp|eel|shade/.test(id) ? 'float' : 'beast' };
}

export function drawEnemy(desc, action, frame, direction) {
  const c = new PixelCanvas(64, 64), { stride, bob } = poseFor(action, frame), sockets = resolvePose(direction, bob);
  const cx = sockets.head[0], y = sockets.head[1] - 8, side = direction.startsWith('side'), sgn = direction === 'side-left' ? -1 : 1;
  const [base, light, glow] = desc.style.ramps, mat = (name, step, x, yy, w, h) => c.fillRect(x, yy, w, h, name, step);
  const kind = desc.style.kind;
  if (kind === 'construct') c.polygon([[cx - 13, y + 8], [cx + 12, y + 8], [cx + 14, y + 31], [cx - 14, y + 31]], base, 2);
  else if (kind === 'wide') c.ellipse(cx, y + 27, 16, 9, base, 2);
  else if (kind === 'float') c.ellipse(cx, y + 19, 11, 14, base, 2);
  else c.ellipse(cx, y + 24, 12, 15, base, 2);
  if (kind !== 'float') mat(base, 1, cx - 8, y + 33, 5, 8); mat(base, 2, cx + 3, y + 33, 5, 8);
  if (direction !== 'back') {
    const ex = side ? cx + sgn * 6 : cx;
    mat(glow, 4, ex - (side ? 1 : 6), y + 17, side ? 2 : 3, 2);
    if (!side) mat(glow, 4, ex + 4, y + 17, 3, 2);
  }
  mat(light, 3, cx - 8, y + 12, 4, 4);
  if (action === 'attack') {
    const sx = side ? cx + sgn * 13 : cx + 12;
    c.line(sx, y + 25, sx + sgn * 9, y + 15 + frame, glow, 2);
  }
  c.autoShade(); c.autoSelout(); return c;
}
