// ═══════════════════════════════════════════════════════════════
// STATUSES — Buff/debuff/DoT/control registry (PRD §10.6).
// Schema:
// {
//   id, name, icon: 'up'|'down'|'dot'|'shield'|'control', color: 0xRRGGBB,
//   dotFrac?, statMods?: { atk?, def?, mag?, res?, spd? }, skipTurn?,
//   absorbs?, accMod?, maxTurns
// }
// ═══════════════════════════════════════════════════════════════

export const STATUSES = {
  burn: {
    id: 'burn', name: 'Burn', icon: 'dot', color: 0xff7733,
    dotFrac: 0.06, maxTurns: 3
  },
  poison: {
    id: 'poison', name: 'Poison', icon: 'dot', color: 0xbb66ee,
    dotFrac: 0.05, maxTurns: 3
  },
  corrupt: {
    id: 'corrupt', name: 'Corrupt', icon: 'dot', color: 0x9944cc,
    dotFrac: 0.05, statMods: { atk: -0.1, def: -0.1, mag: -0.1, res: -0.1, spd: -0.1 },
    maxTurns: 3
  },
  regen: {
    id: 'regen', name: 'Regen', icon: 'up', color: 0x66ffaa,
    regenFrac: 0.06, maxTurns: 3
  },
  shield: {
    id: 'shield', name: 'Shield', icon: 'shield', color: 0x66ccff,
    absorbs: true, maxTurns: 3
  },
  blind: {
    id: 'blind', name: 'Blind', icon: 'down', color: 0x777788,
    accMod: -0.4, maxTurns: 3
  },
  slow: {
    id: 'slow', name: 'Slow', icon: 'down', color: 0x8899aa,
    statMods: { spd: -0.3 }, maxTurns: 3
  },
  haste: {
    id: 'haste', name: 'Haste', icon: 'up', color: 0xffee44,
    statMods: { spd: 0.3 }, maxTurns: 3
  },
  stun: {
    id: 'stun', name: 'Stun', icon: 'control', color: 0xffffff,
    skipTurn: true, maxTurns: 1
  },
  atkUp: {
    id: 'atkUp', name: 'Attack Up', icon: 'up', color: 0xff9955,
    statMods: { atk: 0.25 }, maxTurns: 3
  },
  atkDown: {
    id: 'atkDown', name: 'Attack Down', icon: 'down', color: 0xaa7766,
    statMods: { atk: -0.25 }, maxTurns: 3
  },
  defUp: {
    id: 'defUp', name: 'Defense Up', icon: 'up', color: 0x66aaff,
    statMods: { def: 0.25 }, maxTurns: 3
  },
  defDown: {
    id: 'defDown', name: 'Defense Down', icon: 'down', color: 0xaa6666,
    statMods: { def: -0.25 }, maxTurns: 3
  },
  berserk: {
    id: 'berserk', name: 'Berserk', icon: 'control', color: 0xff3344,
    statMods: { atk: 0.4, def: -0.2 }, maxTurns: 3
  },
  // D19 Vess: a silk-clone veil that halves incoming physical/magic
  // damage's effective armor gap. Does not expire on its own — only a
  // Scan (see battle.js useSkill) strips it, forcing the party to use
  // the analysis tool rather than just wait it out.
  decoy: {
    id: 'decoy', name: 'Silk Veil', icon: 'shield', color: 0xc86ad0,
    statMods: { def: 0.5, res: 0.5 }, maxTurns: 99
  }
};
