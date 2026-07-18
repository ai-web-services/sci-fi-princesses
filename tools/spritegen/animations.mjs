export const DIRECTIONS = ['front', 'back', 'side-left', 'side-right'];

export const ANIMATIONS = {
  idle: { frames: 4, fps: 8 },
  walk: { frames: 6, fps: 10 },
  attack: { frames: 2, fps: 8 }
};

export function poseFor(action, frame) {
  if (action === 'walk') return { stride: [-1, 1, 0, 1, -1, 0][frame], bob: [1, 0, -1, 0, 1, 0][frame] };
  return { stride: 0, bob: [0, 1, 0, -1][frame] };
}
