import assert from 'node:assert/strict';
import { gamepadActionDown } from '../public/src/engine/input.js';

const bindings = { confirm: [0], cancel: [1], actionSkill: [2], companion: [3], pageL: [4], pageR: [5], menu: [9], up: [12], down: [13], left: [14], right: [15] };
const pad = { buttons: Array.from({ length: 16 }, () => ({ pressed: false })), axes: [{ value: 0 }, { value: 0 }] };
for (const [action, indices] of Object.entries(bindings)) {
  pad.buttons[indices[0]].pressed = true;
  assert.equal(gamepadActionDown(pad, action, bindings), true, `${action} must honor its mapped gamepad button`);
  pad.buttons[indices[0]].pressed = false;
}
pad.axes[0].value = -0.8; assert.equal(gamepadActionDown(pad, 'left', bindings), true);
pad.axes[0].value = 0.8; assert.equal(gamepadActionDown(pad, 'right', bindings), true);
pad.axes[0].value = 0; pad.axes[1].value = -0.8; assert.equal(gamepadActionDown(pad, 'up', bindings), true);
pad.axes[1].value = 0.8; assert.equal(gamepadActionDown(pad, 'down', bindings), true);
pad.axes[1].value = 0.2; assert.equal(gamepadActionDown(pad, 'down', bindings), false, 'stick deadzone must suppress drift');
console.log('OK  remappable gamepad buttons, D-pad, analog movement, and deadzone');
