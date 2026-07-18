// ═══════════════════════════════════════════════════════════════
// ACT II — Kessari Reach (M7). Story content is kept separate from
// map geometry. storyContent merges these registries into each
// authored map at runtime.
// ═══════════════════════════════════════════════════════════════

import { GameState } from '../game/state.js';

function hasQuest(state, id, status) {
  const quest = state && state.quests && state.quests[id];
  return !!quest && (!status || quest.status === status);
}

function hasRecruit(state, id) {
  return !!state && Array.isArray(state.roster) && state.roster.includes(id);
}

function erynnBond(state) {
  return !!(state && state.relationships && state.relationships.erynn && state.relationships.erynn.bond >= 2);
}

function evidenceComplete(state) {
  return !!(state && state.flags.kess_evidence_1 && state.flags.kess_evidence_2 && state.flags.kess_evidence_3);
}

function claimWhisperShard(scene) {
  if (!GameState) return;
  if (!Array.isArray(GameState.shards)) GameState.shards = [];
  if (!GameState.shards.includes('whisper_shard')) GameState.shards.push('whisper_shard');
  GameState.flags.whisper_shard_claimed = true;
  scene.showBanner('Crown Shard claimed: Shard of the Whisper');
}

// ─── Arrival scene: Erynn's exile made concrete (S1 Wound) ───
const KESSARI_ARRIVAL = [
  { music: null },
  { fade: 'out' },
  { wait: 300 },
  { fade: 'in' },
  { music: 'kessari' },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'Sandstone and silk. This colony survived the Crownfall better than most.'
  } },
  { say: {
    speaker: 'Pip',
    portrait: 'pip',
    text: 'Trade volume nominal. Weapon signatures elevated. Somebody here is prosperous and armed.'
  } },
  { if: state => hasRecruit(state, 'erynn'), then: [
    { say: {
      speaker: 'Erynn',
      portrait: 'erynn',
      emote: 'sad',
      text: 'I know this dock. I know it the way you know a scar.'
    } },
    { say: {
      speaker: 'Lyra',
      portrait: 'lyra',
      text: 'Erynn?'
    } },
    { say: {
      speaker: 'Erynn',
      portrait: 'erynn',
      text: 'Kessari Reach. Where I was born, where I served, and where a court I trusted decided a defiant scout was worth less than the officer she defied.'
    } },
    { say: {
      speaker: 'Erynn',
      portrait: 'erynn',
      emote: 'sad',
      text: 'I have not set foot on this sand in six years. I did not think I would ever want to again.'
    } },
    { say: {
      speaker: 'Lyra',
      portrait: 'lyra',
      text: 'Then we do this together, and you decide how much of it you want to face.'
    } },
    { say: {
      speaker: 'Erynn',
      portrait: 'erynn',
      text: 'Careful, Highness. Keep offering that and I might start expecting it.'
    } },
    { bond: { char: 'erynn', amount: 1 } },
    { quest: { id: 'q_erynn_return', stage: 1, status: 'active' } }
  ] },
  { quest: { id: 'q_kessari_whisper', stage: 1, status: 'active' } },
  { autosave: 'Kessari Docks' },
  { banner: 'Quest begun: Silk and Signature' }
];

// ─── Bazaar: the smuggling plot surfaces ───
const BAZAAR_STAGE_ADVANCE = [
  { quest: { id: 'q_kessari_whisper', stage: 2, status: 'active' } },
  { say: {
    speaker: 'Trade Broker',
    text: 'You want honest goods, shop the stalls. You want anything with a Void hum to it, that trade runs through the Baroness — and nobody asks where she gets it.'
  } },
  { say: {
    speaker: 'Erynn',
    portrait: 'erynn',
    text: 'Silk Baroness Vess. She was climbing the smuggling lanes when I still wore a Kessari badge. She climbed a lot further once I was gone.'
  } },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'Void-touched relics, moving openly through a trade colony. That is not a rumor we can leave alone.'
  } },
  { say: {
    speaker: 'Pip',
    portrait: 'pip',
    text: 'Recommend the Underway. Smugglers rarely store evidence somewhere the law remembers to check.'
  } },
  { banner: 'Objective: Search the Underway for evidence' }
];

// ─── Court: verdict choice + Erynn's S2 Return ───
const COURT_VERDICT = [
  { say: {
    speaker: 'Magistrate Corvin',
    text: 'Erynn Vexx. I did wonder if exile would eventually run out of places to send you.'
  } },
  { say: {
    speaker: 'Erynn',
    portrait: 'erynn',
    emote: 'angry',
    text: 'Corvin. Still magistrate. Still signing whatever crosses your desk without reading past the seal, I see.'
  } },
  { say: {
    speaker: 'Magistrate Corvin',
    text: 'You were exiled for insubordination, scout, not for being right. The two are not the same crime, whatever you told yourself in the years since.'
  } },
  { say: {
    speaker: 'Erynn',
    portrait: 'erynn',
    text: 'I was exiled for refusing to falsify a border incident so a smuggler\'s cargo could clear customs. Baroness Vess\'s cargo, Magistrate. I have the ledgers now. So does the Sovereign standing behind me.'
  } },
  { say: {
    speaker: 'Magistrate Corvin',
    text: 'Careful what you accuse a court of, in its own hall.'
  } },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'The evidence accuses the court. I am only reading it aloud. What happens next is a choice, not an attack — but it is Erynn\'s choice to make, not mine.'
  } },
  { choice: {
    prompt: 'How does Erynn settle it?',
    options: [
      { label: 'Expose it publicly', value: 'expose' },
      { label: 'Force it quietly', value: 'quiet' }
    ],
    results: {
      expose: [
        { world: { key: 'kessari_verdict', value: 'expose' } },
        { say: {
          speaker: 'Erynn',
          portrait: 'erynn',
          text: 'Read it to the whole court, Magistrate. Let every trader in Kessari hear exactly whose seal has been protecting the Baroness.'
        } },
        { say: {
          speaker: 'Magistrate Corvin',
          text: 'You would burn the court\'s standing to the ground over an old grudge.'
        } },
        { say: {
          speaker: 'Erynn',
          portrait: 'erynn',
          text: 'No. I would burn it down over a manifest. The grudge is just why I stayed to watch.'
        } }
      ],
      quiet: [
        { world: { key: 'kessari_verdict', value: 'quiet' } },
        { say: {
          speaker: 'Erynn',
          portrait: 'erynn',
          text: 'Fix it, Corvin. Quietly, completely, starting today — or the next copy of this ledger goes to every trade partner Kessari has left.'
        } },
        { say: {
          speaker: 'Magistrate Corvin',
          text: 'You would let me keep the seat.'
        } },
        { say: {
          speaker: 'Erynn',
          portrait: 'erynn',
          text: 'Kessari needs a court that still functions once this is over. I am not interested in burning the whole house down to prove a point to one man.'
        } }
      ]
    }
  } },
  { say: {
    speaker: 'Magistrate Corvin',
    text: 'Vess will not answer to a summons. She has never needed the court\'s permission for anything.'
  } },
  { say: {
    speaker: 'Erynn',
    portrait: 'erynn',
    text: 'Then she answers to me instead. That was always going to be the shorter conversation.'
  } },
  { bond: { char: 'erynn', amount: 1 } },
  { quest: { id: 'q_erynn_return', stage: 2, status: 'done' } },
  { quest: { id: 'q_erynn_return', stage: 3, status: 'active' } },
  { quest: { id: 'q_kessari_whisper', stage: 3, status: 'active' } },
  { flag: { key: 'kessari_court_resolved', value: true } },
  { autosave: 'The Kessari Court' },
  { banner: 'Objective: Confront Silk Baroness Vess' }
];

// ─── Spire: confrontation + boss battle ───
const VESS_CONFRONTATION = [
  { music: null },
  { say: {
    speaker: 'Silk Baroness Vess',
    text: 'Eryx Vexx. I heard the court finally choked on its own paperwork. I did wonder how long that would take.'
  } },
  { say: {
    speaker: 'Erynn',
    portrait: 'erynn',
    text: 'You cost me my badge, my home, and six years I do not get back. I am done letting that be the end of the story.'
  } },
  { say: {
    speaker: 'Silk Baroness Vess',
    text: 'A baroness does not brawl in the street. But an old debt deserves a proper accounting — you, alone, first. For old time\'s sake.'
  } },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'Erynn—'
  } },
  { say: {
    speaker: 'Erynn',
    portrait: 'erynn',
    text: 'Let her have this part, Highness. I have waited six years to collect it myself.'
  } },
  { quest: { id: 'q_kessari_whisper', stage: 4, status: 'active' } },
  { battle: {
    enemies: ['vess'],
    isBoss: true,
    canFlee: false,
    backdrop: 'kessari',
    winScript: [
      { music: null },
      { wait: 400 },
      { say: {
        speaker: 'Erynn',
        portrait: 'erynn',
        emote: 'happy',
        text: 'Six years, Vess. That is what you cost me. Consider the debt collected.'
      } },
      { say: {
        speaker: 'Lyra',
        portrait: 'lyra',
        text: 'It is done. Whatever the court decides now, it decides without her hand on the scale.'
      } },
      { flash: 0xc86ad0 },
      { shake: true },
      { say: {
        speaker: 'Memory of the Crown',
        text: 'A VISION SURFACES, UNBIDDEN, IN THE SHARD\'S LIGHT.'
      } },
      { say: {
        speaker: 'Memory of the Crown',
        text: 'A VOICE, TRAPPED, SPEAKING FROM INSIDE THE FIRST SEAL — NOT A MONSTER\'S SCREAM. A MIND, ASKING TO BE HEARD.'
      } },
      { say: {
        speaker: 'Memory of the Crown',
        text: 'THE FIRST SOVEREIGN DID NOT SILENCE IT. THE SOVEREIGN LISTENED, AND SEALED IT ANYWAY.'
      } },
      { say: {
        speaker: 'Lyra',
        portrait: 'lyra',
        emote: 'sad',
        text: 'Something inside the Crown has been asking to be heard since before any of us were born. I do not think I can keep pretending that is nothing.'
      } },
      { sfx: 'shard' },
      { run: claimWhisperShard },
      { if: state => !!(state.relationships.erynn && state.relationships.erynn.bond >= 3), then: [
        { evolve: 'erynn' },
        { world: { key: 'arc_erynn', value: 'transformed' } }
      ], else: [
        { world: { key: 'arc_erynn', value: 'resolved' } }
      ] },
      { evolve: 'lyra' },
      { quest: { id: 'q_kessari_whisper', stage: 4, status: 'done' } },
      { quest: { id: 'q_erynn_return', stage: 3, status: 'done' } },
      { autosave: 'Kessari Reach' },
      { banner: 'Shard claimed: Shard of the Whisper' }
    ]
  } }
];

export const npcsByMap = {
  kess_bazaar: [],

  nova_plaza: [
    {
      id: 'am7_reyes_debrief',
      actor: 'reyes',
      x: 16, y: 6, dir: 'down',
      if: state => !!state.flags.whisper_shard_claimed,
      script: [
        { if: state => !state.flags.kessari_debrief_seen, then: [
          { say: {
            speaker: 'Commander Reyes',
            portrait: 'reyes',
            text: 'Four shards, and now the Crown itself is asking to be heard. Kessari\'s trade routes have already reopened toward us — the market has never moved faster.'
          } },
          { say: {
            speaker: 'Lyra',
            portrait: 'lyra',
            text: 'Then let it move. Nova Prime should be able to build with what these regions are willing to give us now.'
          } },
          { flag: { key: 'kessari_debrief_seen', value: true } },
          { run: scene => { GameState.novaStage = 2; } },
          { banner: 'Nova Prime grows: the Forge is open' }
        ], else: [
          { say: {
            speaker: 'Commander Reyes',
            portrait: 'reyes',
            text: 'Kessari trade caravans keep the Forge stocked. Small mercies, and useful ones.'
          } }
        ] }
      ]
    }
  ],

  nova_market: [
    {
      id: 'nova_forge_keeper',
      actor: 'citizen_m',
      x: 9, y: 8, dir: 'down',
      if: state => state.novaStage >= 2,
      script: [
        { say: { speaker: 'Forge Keeper', text: 'Bring me trophies worth tempering and I will bring you gear worth carrying.' } },
        { forge: true }
      ]
    }
  ]
};

export const triggersByMap = {
  kess_docks: [
    {
      id: 'am7_arrival',
      // Matches kess_docks's own spawn cell exactly: Travel's kessari
      // entry lands the player at {14,19}, and the only exit here is
      // south — cells elsewhere would never be stepped on.
      cells: [{ x: 14, y: 19 }, { x: 15, y: 19 }],
      onceFlag: 'kessari_arrival_seen',
      if: state => !state.flags.kessari_arrival_seen,
      script: KESSARI_ARRIVAL
    }
  ],

  kess_bazaar: [
    {
      id: 'am7_bazaar_arrival',
      cells: [{ x: 14, y: 1 }, { x: 15, y: 1 }, { x: 14, y: 2 }, { x: 15, y: 2 }],
      onceFlag: 'kess_bazaar_stage_advanced',
      if: state => hasQuest(state, 'q_kessari_whisper', 'active') && state.quests.q_kessari_whisper.stage === 1,
      script: BAZAAR_STAGE_ADVANCE
    }
  ],

  kess_court: [
    {
      id: 'am7_court_arrival',
      cells: [{ x: 14, y: 1 }, { x: 15, y: 1 }, { x: 14, y: 2 }, { x: 15, y: 2 }],
      onceFlag: 'kessari_court_resolved',
      if: state => evidenceComplete(state) && hasQuest(state, 'q_kessari_whisper', 'active') && state.quests.q_kessari_whisper.stage === 2,
      script: COURT_VERDICT
    }
  ],

  // Combined into one trigger (rather than two triggers sharing the same
  // cells) because MapScene.handleArrival() only ever fires the first
  // matching trigger per step — a second trigger on identical cells would
  // be starved until the player happened to re-step onto that exact tile.
  kess_spire: [
    {
      id: 'am7_spire_arrival',
      cells: [{ x: 14, y: 1 }, { x: 15, y: 1 }, { x: 14, y: 2 }, { x: 15, y: 2 }],
      script: [
        { if: state => !!state.flags.kessari_court_resolved && !state.flags.whisper_shard_claimed,
          then: VESS_CONFRONTATION }
      ]
    }
  ]
};

// Evidence interactions are structural to kess_underway's own geometry
// (same convention as ash_caldera's vent puzzle) so they live directly
// on the map definition in maps/kessari.js, not merged in here.
export const interactionsByMap = {};

export const quests = {
  q_kessari_whisper: {
    id: 'q_kessari_whisper',
    title: 'Silk and Signature',
    type: 'main',
    summary: 'Follow a Void-relic smuggling trail through Kessari Reach to Silk Baroness Vess — and the shard she guards.',
    stages: [
      'Reach the Kessari Docks and learn what happened here.',
      'Search the Underway for evidence of the smuggling trade.',
      'Present the evidence to the Kessari Court.',
      'Confront Silk Baroness Vess in her spire.'
    ]
  },

  q_erynn_return: {
    id: 'q_erynn_return',
    title: 'Return',
    type: 'companion',
    summary: 'Erynn\'s exile from Kessari Reach, and the officer whose court made it permanent.',
    stages: [
      'Learn what exile cost Erynn, and who is responsible.',
      'Confront the officer who rules in her exile\'s name.',
      'Face Silk Baroness Vess and settle the debt.'
    ]
  }
};
