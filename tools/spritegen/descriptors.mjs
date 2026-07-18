export const LYRA_DESCRIPTOR = {
  id: 'lyra', stage: 'base', species: 'human',
  source: 'procedural sprite-rig generator; no external pixels',
  spec: 'ART_VISION.md §3.3 / §11 Route P',
  postProcessing: ['auto-shade', 'auto-selout', 'nearest-neighbor cell fit', 'declared-ramp validation'],
  license: 'Original generated pixels; no external source material',
  hairTemplates: ['sweep', 'spikes', 'twin-tail'],
  ramps: ['lyraHair', 'lyraDress', 'lyraTrim', 'skinFair', 'lyraEye', 'starlight', 'steel'],
  accentRamps: ['starlight'],
  actions: ['idle', 'walk'], directions: ['front', 'back', 'side-left', 'side-right']
};
