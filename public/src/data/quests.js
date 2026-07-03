// ═══════════════════════════════════════════════════════════════
// QUEST DATA — Display metadata and stage objectives.
// Runtime progress remains in GameState.quests; this registry is
// presentation-only so save data stays compact and stable.
// ═══════════════════════════════════════════════════════════════

export const QUESTS = {
  q_fall_aftershock: {
    id: 'q_fall_aftershock',
    title: 'After the Fall',
    type: 'main',
    summary: 'Nova Prime survived the Crownfall, but its people and Stargate remain in danger.',
    stages: [
      'Reach Stargate Dock and assess the relay.',
      'Run a diagnostic at the Stargate console.',
      'Report the relay status to Commander Reyes.',
      "Nova Prime's local relay has been restored."
    ]
  }
};

export function getQuestDefinition(id) {
  return QUESTS[id] || null;
}

export function questTitle(id) {
  const quest = getQuestDefinition(id);
  if (quest) return quest.title;
  return String(id || 'Unknown quest')
    .replace(/^q_/, '')
    .split('_')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function questObjective(id, stage) {
  const quest = getQuestDefinition(id);
  if (!quest || !quest.stages.length) return 'Objective details are not yet available.';
  const index = Math.max(0, Math.min(quest.stages.length - 1, (Number(stage) || 1) - 1));
  return quest.stages[index];
}
