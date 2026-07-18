// ═══════════════════════════════════════════════════════════════
// INPUT — Action-mapped keyboard + gamepad with remappable
// bindings, per-frame cached polling, and key-repeat for menus.
//
// Usage per scene update:
//   const inp = pollInput(scene, time);
//   if (inp.confirmed) ...        // JustDown semantics
//   if (inp.upRepeat) ...         // JustDown + hold-repeat (menus)
//   inp.dx / inp.dy               // held movement axes
// ═══════════════════════════════════════════════════════════════

import { Settings } from './settings.js';

function KC(name) { return Phaser.Input.Keyboard.KeyCodes[name]; }

const keyCache = new Map();   // per-game key objects, keyed by scene.sys id + key name
function getKey(scene, name) {
  const id = scene.sys.settings.key + ':' + name;
  let k = keyCache.get(id);
  if (!k || k.plugin !== scene.input.keyboard) {
    const code = KC(name);
    if (code === undefined) return null;
    k = scene.input.keyboard.addKey(code, false);   // don't capture — we filter in HTML
    keyCache.set(id, k);
  }
  return k;
}

const ACTIONS = ['up', 'down', 'left', 'right', 'confirm', 'cancel', 'menu', 'pageL', 'pageR', 'actionSkill', 'companion'];

// repeat state per action (module-level; single local player)
const repeatState = {};
const REPEAT_DELAY = 320, REPEAT_RATE = 90;

function axisValue(axis) { return typeof axis?.getValue === 'function' ? axis.getValue() : Number(axis?.value ?? axis ?? 0); }

export function gamepadActionDown(gp, action, bindings = Settings.bindings.gamepad) {
  if (!gp) return false;
  for (const idx of bindings[action] || []) if (gp.buttons[idx]?.pressed) return true;
  if (action === 'left' && gp.axes.length && axisValue(gp.axes[0]) < -0.5) return true;
  if (action === 'right' && gp.axes.length && axisValue(gp.axes[0]) > 0.5) return true;
  if (action === 'up' && gp.axes.length > 1 && axisValue(gp.axes[1]) < -0.5) return true;
  if (action === 'down' && gp.axes.length > 1 && axisValue(gp.axes[1]) > 0.5) return true;
  return false;
}

function actionDown(scene, gp, action) {
  const kb = Settings.bindings.keyboard[action] || [];
  for (const name of kb) {
    const k = getKey(scene, name);
    if (k && k.isDown) return true;
  }
  return gamepadActionDown(gp, action);
}

// JustDown + auto-repeat while held (for menu navigation)
function edgeRepeat(action, down, time) {
  let st = repeatState[action];
  if (!st) st = repeatState[action] = { down: false, next: 0 };
  let fired = false;
  if (down && !st.down) { fired = true; st.next = time + REPEAT_DELAY; }
  else if (down && time >= st.next) { fired = true; st.next = time + REPEAT_RATE; }
  st.down = down;
  return fired;
}

// Pure edge (no repeat) — for confirm/cancel/menu
const edgeState = {};
function edge(action, down) {
  const was = edgeState[action];
  edgeState[action] = down;
  return down && !was;
}

export function pollInput(scene, time) {
  const gp = scene.input.gamepad ? scene.input.gamepad.getPad(0) : null;

  const held = {};
  for (const a of ACTIONS) held[a] = actionDown(scene, gp, a);

  const dx = (held.right ? 1 : 0) - (held.left ? 1 : 0);
  const dy = (held.down ? 1 : 0) - (held.up ? 1 : 0);

  return {
    gp, dx, dy,
    upHeld: held.up, downHeld: held.down, leftHeld: held.left, rightHeld: held.right,
    upRepeat: edgeRepeat('up', held.up, time),
    downRepeat: edgeRepeat('down', held.down, time),
    leftRepeat: edgeRepeat('left', held.left, time),
    rightRepeat: edgeRepeat('right', held.right, time),
    confirmed: edge('confirm', held.confirm),
    cancelled: edge('cancel', held.cancel),
    menued: edge('menu', held.menu),
    pageLd: edge('pageL', held.pageL),
    pageRd: edge('pageR', held.pageR),
    skilld: edge('actionSkill', held.actionSkill),
    companiond: edge('companion', held.companion),
    confirmHeld: held.confirm
  };
}

// Swallow the current edge states (call after scene transitions so a
// held confirm doesn't double-trigger in the next scene).
export function swallowInput() {
  for (const a of ['confirm', 'cancel', 'menu', 'pageL', 'pageR', 'actionSkill', 'companion']) edgeState[a] = true;
}

// True if a gamepad is currently connected (for prompt display)
export function padConnected(scene) {
  return !!(scene.input.gamepad && scene.input.gamepad.getPad(0));
}

// Wait for the next pressed key/button — used by the rebinding UI.
// cb receives {device:'keyboard', key:'Z'} or {device:'gamepad', button: 0}.
export function captureNextInput(scene, cb) {
  const keyHandler = (event) => {
    const name = keyEventToName(event);
    if (!name) return;
    cleanup();
    cb({ device: 'keyboard', key: name });
  };
  let rafId = null;
  const pollPad = () => {
    const gp = scene.input.gamepad ? scene.input.gamepad.getPad(0) : null;
    if (gp) {
      for (let i = 0; i < gp.buttons.length; i++) {
        if (gp.buttons[i] && gp.buttons[i].pressed) {
          cleanup();
          cb({ device: 'gamepad', button: i });
          return;
        }
      }
    }
    rafId = requestAnimationFrame(pollPad);
  };
  const cleanup = () => {
    window.removeEventListener('keydown', keyHandler, true);
    if (rafId) cancelAnimationFrame(rafId);
  };
  window.addEventListener('keydown', keyHandler, true);
  rafId = requestAnimationFrame(pollPad);
  return cleanup;   // caller may cancel
}

function keyEventToName(event) {
  const code = event.keyCode;
  const KCs = Phaser.Input.Keyboard.KeyCodes;
  for (const name of Object.keys(KCs)) {
    if (KCs[name] === code) return name;
  }
  return null;
}

// Human-readable binding labels for UI prompts
const PAD_LABELS = { 0: 'A', 1: 'B', 2: 'X', 3: 'Y', 4: 'LB', 5: 'RB', 6: 'LT', 7: 'RT', 8: 'Back', 9: 'Start', 12: 'D-Up', 13: 'D-Down', 14: 'D-Left', 15: 'D-Right' };
export function bindingLabel(action, device) {
  if (device === 'gamepad') {
    const b = (Settings.bindings.gamepad[action] || [])[0];
    return PAD_LABELS[b] || ('Btn' + b);
  }
  const keys = Settings.bindings.keyboard[action] || [];
  return keys.map(k => k === 'SPACE' ? 'Space' : k === 'ESC' ? 'Esc' : k === 'ENTER' ? 'Enter' : k).join('/');
}
