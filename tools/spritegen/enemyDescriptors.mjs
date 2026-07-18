import { ENEMIES } from '../../public/src/data/enemies.js';
import { enemyStyle } from './enemyParts.mjs';

export const ENEMY_DESCRIPTORS = Object.values(ENEMIES)
  .filter(enemy => !enemy.boss)
  .map(enemy => {
    const style = enemyStyle(enemy.id);
    return {
      id: enemy.id, category: 'enemy', stage: 'base', species: 'enemy', size: enemy.size, fitScale: enemy.size === 'small' ? 0.72 : enemy.size === 'large' ? 1.15 : 0.88, source: 'procedural enemy family generator; no external pixels',
      spec: 'ART_VISION.md §4 / §11 Route P', postProcessing: ['auto-shade', 'auto-selout', 'nearest-neighbor cell fit', 'declared-ramp validation'],
      license: 'Original generated pixels; no external source material', ramps: [...new Set([...style.ramps, 'starlight'])], accentRamps: ['starlight', style.ramps[2]],
      actions: ['idle', 'attack'], directions: ['front', 'back', 'side-left', 'side-right'], style
    };
  });
