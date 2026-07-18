// ═══ GEAR PROGRESSION — enhancement, infusion, affixes, transcendence.

export const MAX_ENHANCEMENT = 10;

export const INFUSIONS = Object.freeze({
  void: { material: 'void_essence', name: 'Void', stat: 'mag', bonus: 4, damageType: 'dark' },
  stellar: { material: 'stellar_crystal', name: 'Stellar', stat: 'crit', bonus: 4, damageType: 'light' },
  flame: { material: 'dragon_scale', name: 'Drakefire', stat: 'atk', bonus: 4, damageType: 'fire' },
  frost: { material: 'bio_gel', name: 'Cryogel', stat: 'res', bonus: 4, damageType: 'ice' },
  storm: { material: 'stellar_crystal', name: 'Storm', stat: 'mag', bonus: 4, damageType: 'lightning' },
  living: { material: 'bio_gel', name: 'Living', stat: 'hp', bonus: 24, damageType: null }
});

const AFFIXES = Object.freeze([
  { id: 'keen', name: 'Keen', stat: 'crit', value: 3 },
  { id: 'mighty', name: 'Mighty', stat: 'atk', value: 3 },
  { id: 'mystic', name: 'Mystic', stat: 'mag', value: 3 },
  { id: 'guarded', name: 'Guarded', stat: 'def', value: 3 },
  { id: 'swift', name: 'Swift', stat: 'spd', value: 2 },
  { id: 'vital', name: 'Vital', stat: 'hp', value: 18 }
]);

export function normalizeGearEntry(value) {
  if (!value) return null;
  if (typeof value === 'string') return { id: value, enhancement: 0, infusion: null, affixes: [], transcended: false };
  return {
    id: String(value.id || ''),
    enhancement: clampInt(value.enhancement, 0, MAX_ENHANCEMENT),
    infusion: INFUSIONS[value.infusion] ? value.infusion : null,
    affixes: Array.isArray(value.affixes) ? value.affixes.filter(id => AFFIXES.some(affix => affix.id === id)).slice(0, 3) : [],
    transcended: !!value.transcended && Number(value.enhancement) >= MAX_ENHANCEMENT
  };
}

export function gearId(value) { return normalizeGearEntry(value)?.id || null; }

export function gearLabel(item, value) {
  const gear = normalizeGearEntry(value);
  if (!item || !gear) return 'Empty';
  const infusion = gear.infusion ? `${INFUSIONS[gear.infusion].name} ` : '';
  const rank = gear.enhancement ? ` +${gear.enhancement}` : '';
  return `${gear.transcended ? '✦ ' : ''}${infusion}${item.name}${rank}`;
}

export function enhancementCost(value) {
  const gear = normalizeGearEntry(value);
  if (!gear || gear.enhancement >= MAX_ENHANCEMENT) return null;
  const next = gear.enhancement + 1;
  return { gold: 30 + next * 20, materials: [{ id: 'scrap_metal', qty: 1 + Math.floor((next - 1) / 3) }] };
}

export function transcendCost(value) {
  const gear = normalizeGearEntry(value);
  return gear && gear.enhancement === MAX_ENHANCEMENT && !gear.transcended
    ? { gold: 600, materials: [{ id: 'celestial_shard', qty: 1 }] }
    : null;
}

export function infusionCost(type) {
  const infusion = INFUSIONS[type];
  return infusion ? { gold: 120, materials: [{ id: infusion.material, qty: 1 }] } : null;
}

export function enhanceGear(value) {
  const gear = normalizeGearEntry(value);
  if (!gear || gear.enhancement >= MAX_ENHANCEMENT) return null;
  gear.enhancement++;
  if ([3, 6, 9].includes(gear.enhancement)) {
    const candidates = AFFIXES.filter(affix => !gear.affixes.includes(affix.id));
    const affix = candidates[stableIndex(`${gear.id}:${gear.enhancement}`, candidates.length)];
    if (affix) gear.affixes.push(affix.id);
  }
  return gear;
}

export function infuseGear(value, type) {
  const gear = normalizeGearEntry(value);
  if (!gear || !INFUSIONS[type]) return null;
  gear.infusion = type;
  return gear;
}

export function transcendGear(value) {
  const gear = normalizeGearEntry(value);
  if (!gear || gear.enhancement !== MAX_ENHANCEMENT || gear.transcended) return null;
  gear.transcended = true;
  return gear;
}

export function gearStats(item, value) {
  const gear = normalizeGearEntry(value);
  const base = { ...(item?.stats || {}) };
  if (!gear) return base;
  const multiplier = 1 + gear.enhancement * 0.06 + (gear.transcended ? 0.15 : 0);
  const stats = {};
  for (const [key, amount] of Object.entries(base)) stats[key] = scaledStat(key, amount, multiplier);
  const infusion = INFUSIONS[gear.infusion];
  if (infusion) stats[infusion.stat] = (stats[infusion.stat] || 0) + infusion.bonus;
  for (const id of gear.affixes) {
    const affix = AFFIXES.find(entry => entry.id === id);
    if (affix) stats[affix.stat] = (stats[affix.stat] || 0) + affix.value;
  }
  return stats;
}

export function gearPassives(item, value) {
  const gear = normalizeGearEntry(value);
  return {
    ...(item?.passive || {}),
    ...(gear?.infusion && INFUSIONS[gear.infusion].damageType ? { infusedDamage: INFUSIONS[gear.infusion].damageType } : {}),
    ...(gear?.transcended ? { transcended: true } : {})
  };
}

export function affixLabels(value) {
  const gear = normalizeGearEntry(value);
  return (gear?.affixes || []).map(id => {
    const affix = AFFIXES.find(entry => entry.id === id);
    return affix ? `${affix.name} +${affix.value} ${affix.stat.toUpperCase()}` : id;
  });
}

function scaledStat(key, amount, multiplier) {
  const value = amount * multiplier;
  return key === 'crit' && Math.abs(amount) <= 1 ? Math.round(value * 1000) / 1000 : Math.round(value);
}
function stableIndex(text, length) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) { hash ^= text.charCodeAt(i); hash = Math.imul(hash, 16777619); }
  return length ? (hash >>> 0) % length : 0;
}
function clampInt(value, min, max) { return Math.max(min, Math.min(max, Math.trunc(Number(value) || 0))); }
