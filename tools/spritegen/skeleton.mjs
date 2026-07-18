// Shared direction sockets. Side views are authored layouts, never mirrored.
export const SOCKETS = {
  front: { head: [32, 12], shoulders: [32, 24], hips: [32, 36], feet: [32, 49], grip: [22, 29] },
  back: { head: [32, 12], shoulders: [32, 24], hips: [32, 36], feet: [32, 49], grip: [42, 29] },
  'side-left': { head: [31, 12], shoulders: [31, 24], hips: [31, 36], feet: [31, 49], grip: [19, 29] },
  'side-right': { head: [33, 12], shoulders: [33, 24], hips: [33, 36], feet: [33, 49], grip: [45, 29] }
};

export function resolvePose(direction, bob = 0) {
  const sockets = SOCKETS[direction];
  if (!sockets) throw new Error(`Unknown sprite direction: ${direction}`);
  return Object.fromEntries(Object.entries(sockets).map(([name, [x, y]]) => [name, [x, y + bob]]));
}
