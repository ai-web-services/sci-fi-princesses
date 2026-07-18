// ═══ BUILD CHOICES — deterministic, verb-changing level rewards.

import { createRng, streamSeed } from './rng.js';

export const BUILD_CHOICES = Object.freeze({
  blade_arc: {
    id: 'blade_arc', name: 'Royal Arc', category: 'weapon',
    desc: 'Blade finishers project a wider stellar arc.', apply: ({ build }) => { build.bladeArc = true; }
  },
  lance_break: {
    id: 'lance_break', name: 'Sundering Point', category: 'weapon',
    desc: 'Lance hits deal double armor and knockback.', apply: ({ build }) => { build.lanceBreak = true; }
  },
  wand_echo: {
    id: 'wand_echo', name: 'Astral Echo', category: 'weapon',
    desc: 'Every third Wand bolt repeats at half power.', apply: ({ build }) => { build.wandEcho = true; }
  },
  evasive_crown: {
    id: 'evasive_crown', name: 'Comet Wake', category: 'defense',
    desc: 'Dodging leaves a damaging stellar afterimage.', apply: ({ build }) => { build.cometWake = true; }
  },
  royal_endurance: {
    id: 'royal_endurance', name: 'Royal Endurance', category: 'defense',
    desc: 'Gain 20 stamina and faster exhausted recovery.', apply: ({ build, action }) => { build.royalEndurance = true; action.maxStamina += 20; action.stamina += 20; }
  },
  crown_surge: {
    id: 'crown_surge', name: 'Crown Surge', category: 'crown',
    desc: 'Weakness hits grant more Crown energy.', apply: ({ build }) => { build.crownSurge = true; }
  },
  erynn_mark: {
    id: 'erynn_mark', name: 'Hunter’s Accord', category: 'companion',
    desc: 'Erynn marks her target; your first hit always crits.', apply: ({ build }) => { build.erynnMark = true; }
  },
  second_wind: {
    id: 'second_wind', name: 'Second Wind', category: 'defense',
    desc: 'Once per run, lethal damage leaves Lyra at 1 HP.', apply: ({ build }) => { build.secondWind = true; }
  }
});

export function levelChoices(seed, level, build = {}, companionAvailable = false) {
  const owned = new Set(Object.entries(build).filter(([, value]) => value === true).map(([key]) => key));
  const eligible = Object.values(BUILD_CHOICES).filter(choice => {
    if (choice.id === 'erynn_mark' && !companionAvailable) return false;
    const property = { blade_arc: 'bladeArc', lance_break: 'lanceBreak', wand_echo: 'wandEcho', evasive_crown: 'cometWake', royal_endurance: 'royalEndurance', crown_surge: 'crownSurge', erynn_mark: 'erynnMark', second_wind: 'secondWind' }[choice.id];
    return !owned.has(property);
  });
  const rng = createRng(streamSeed(seed, `level:${level}`));
  const picked = [];
  const categories = ['weapon', 'defense', companionAvailable ? 'companion' : 'crown'];
  for (const category of categories) {
    const pool = eligible.filter(choice => choice.category === category && !picked.includes(choice));
    if (pool.length) picked.push(rng.pick(pool));
  }
  while (picked.length < 3) {
    const pool = eligible.filter(choice => !picked.includes(choice));
    if (!pool.length) break;
    picked.push(rng.pick(pool));
  }
  return picked.slice(0, 3);
}

export function applyBuildChoice(choiceId, character, action) {
  const choice = BUILD_CHOICES[choiceId];
  if (!choice) return false;
  character.build = character.build || {};
  choice.apply({ build: character.build, action });
  return true;
}
