// ═══════════════════════════════════════════════════════════════
// INPUT — Keyboard + gamepad helpers
// ═══════════════════════════════════════════════════════════════

// Key code getters — lazy access to avoid top-level Phaser dependency
// (Phaser CDN may not be loaded when module parses)
function KC(name) { return Phaser.Input.Keyboard.KeyCodes[name]; }

export function getInput(scene) {
  const kb = scene.input.keyboard;
  const gp = scene.input.gamepad ? scene.input.gamepad.getPad(0) : null;

  let dx = 0, dy = 0;
  if (kb.addKey(KC('A')).isDown || kb.addKey(KC('LEFT')).isDown) dx = -1;
  if (kb.addKey(KC('D')).isDown || kb.addKey(KC('RIGHT')).isDown) dx = 1;
  if (kb.addKey(KC('W')).isDown || kb.addKey(KC('UP')).isDown) dy = -1;
  if (kb.addKey(KC('S')).isDown || kb.addKey(KC('DOWN')).isDown) dy = 1;

  if (gp) {
    if (gp.left || gp.axes[0] < -0.5) dx = -1;
    if (gp.right || gp.axes[0] > 0.5) dx = 1;
    if (gp.up || gp.axes[1] < -0.5) dy = -1;
    if (gp.down || gp.axes[1] > 0.5) dy = 1;
    if (gp.buttons[14] && gp.buttons[14].pressed) dx = -1;
    if (gp.buttons[15] && gp.buttons[15].pressed) dx = 1;
    if (gp.buttons[12] && gp.buttons[12].pressed) dy = -1;
    if (gp.buttons[13] && gp.buttons[13].pressed) dy = 1;
  }

  const interact = Phaser.Input.Keyboard.JustDown(kb.addKey(KC('Z'))) ||
                    Phaser.Input.Keyboard.JustDown(kb.addKey(KC('SPACE'))) ||
                    !!(gp && gp.buttons[0] && Phaser.Input.Gamepad.JustDown(gp.buttons[0]));
  const cancel = Phaser.Input.Keyboard.JustDown(kb.addKey(KC('X'))) ||
                  Phaser.Input.Keyboard.JustDown(kb.addKey(KC('ESC'))) ||
                  !!(gp && gp.buttons[1] && Phaser.Input.Gamepad.JustDown(gp.buttons[1]));
  const menu = Phaser.Input.Keyboard.JustDown(kb.addKey(KC('ENTER'))) ||
               !!(gp && gp.buttons[9] && Phaser.Input.Gamepad.JustDown(gp.buttons[9]));

  return { dx, dy, interact, cancel, menu, gp };
}

export function updateControllerStatus(scene) {
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
