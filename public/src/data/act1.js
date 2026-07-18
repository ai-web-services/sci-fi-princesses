// ═══════════════════════════════════════════════════════════════
// ACT I — The Fall / The First Claim.
// Story content is kept separate from map geometry. storyContent
// merges these registries into each authored map at runtime.
// ═══════════════════════════════════════════════════════════════

import { GameState } from '../game/state.js';

function hasQuest(state, id, status) {
  const quest = state && state.quests && state.quests[id];
  return !!quest && (!status || quest.status === status);
}

function hasRecruit(state, id) {
  return !!state && Array.isArray(state.roster) && state.roster.includes(id);
}

function claimGateShard(scene) {
  if (!GameState) return;
  if (!Array.isArray(GameState.shards)) GameState.shards = [];
  if (!GameState.shards.includes('gate_shard')) GameState.shards.push('gate_shard');
  GameState.flags.gate_shard_claimed = true;
  scene.showBanner('Crown Shard claimed: Shard of the Gate');
}

const PROLOGUE = [
  { music: null },
  { fade: 'out' },
  { say: {
    speaker: 'Commander Reyes',
    portrait: 'reyes',
    text: 'The outer wards are gone. Lyra, stay behind the palace shield.'
  } },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'The Crown answers to my blood. If I can reach it, I can hold the city.'
  } },
  { fade: 'in' },
  { music: 'nova' },
  { flash: 0xf8e8a0 },
  { shake: true },
  { say: {
    speaker: 'The Celestial Crown',
    text: 'HEIR RECOGNIZED. AUTHORITY... CONTESTED.'
  } },
  { flash: 0x9a50df },
  { shake: true },
  { say: {
    speaker: 'Commander Reyes',
    portrait: 'reyes',
    text: 'Let it go!'
  } },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    emote: 'sad',
    text: 'I am its heir. It is supposed to protect them.'
  } },
  { sfx: 'void' },
  { flash: 0xffffff },
  { shake: true },
  { wait: 500 },
  { fade: 'out' },
  { music: null },
  { wait: 600 },
  { say: {
    speaker: 'Nova Citizen',
    text: 'Your Highness? I cannot move my leg.'
  } },
  { choice: {
    prompt: 'The Crown is falling. What does Lyra reach for?',
    options: [
      { label: 'The trapped citizen', value: 'people' },
      { label: 'A Crown fragment', value: 'crown' }
    ],
    results: {
      people: [
        { flag: { key: 'prologue_instinct', value: 'people' } },
        { say: {
          speaker: 'Lyra',
          portrait: 'lyra',
          text: 'Look at me. We leave together. Reyes, lift on three.'
        } },
        { say: {
          speaker: 'Commander Reyes',
          portrait: 'reyes',
          text: 'Good. One, two, three.'
        } }
      ],
      crown: [
        { flag: { key: 'prologue_instinct', value: 'crown' } },
        { say: {
          speaker: 'Lyra',
          portrait: 'lyra',
          text: 'If one fragment still holds a ward, it can cover the wounded.'
        } },
        { say: {
          speaker: 'Commander Reyes',
          portrait: 'reyes',
          text: 'Then take it and come back. A symbol is not worth a life.'
        } },
        { say: {
          speaker: 'Lyra',
          portrait: 'lyra',
          text: 'No. But what it can do might be.'
        } }
      ]
    }
  } },
  { flag: { key: 'crownfall_survived', value: true } },
  { flag: { key: 'act1_prologue_seen', value: true } },
  { music: 'nova' },
  { fade: 'in' },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'The Crown failed. I will not make the people beneath it pay for that failure.'
  } },
  { autosave: 'Starfall Plaza' },
  { banner: 'Act I: The Fall' },
  { tutorial: 'movement' },
  { tutorial: 'journal' }
];

const FIRST_CLAIM_BRIEFING = [
  { say: {
    speaker: 'Commander Reyes',
    portrait: 'reyes',
    text: 'The local relay is stable. It also found something beyond the fractured route.'
  } },
  { say: {
    speaker: 'Dr. Elara',
    portrait: 'elara',
    text: 'A Crown signature. Strong enough to be a shard, buried in the old Gate Heart.'
  } },
  { say: {
    speaker: 'Commander Reyes',
    portrait: 'reyes',
    text: 'And something is guarding it. The transit logs call him Sentinel Kael.'
  } },
  { choice: {
    prompt: 'What does the first shard mean?',
    options: [
      { label: 'A shield for Nova', value: 'protection' },
      { label: 'A truth we need', value: 'truth' },
      { label: 'Power we cannot leave', value: 'power' }
    ],
    results: {
      protection: [
        { flag: { key: 'first_shard_intent', value: 'protection' } },
        { say: {
          speaker: 'Lyra',
          portrait: 'lyra',
          text: 'If it can restore the wards, no one else sleeps under a broken sky.'
        } }
      ],
      truth: [
        { flag: { key: 'first_shard_intent', value: 'truth' } },
        { say: {
          speaker: 'Lyra',
          portrait: 'lyra',
          text: 'The Crown called its authority contested. I need to know by whom, and why.'
        } }
      ],
      power: [
        { flag: { key: 'first_shard_intent', value: 'power' } },
        { say: {
          speaker: 'Lyra',
          portrait: 'lyra',
          text: 'Someone attacked Nova for that power. Leaving it unclaimed is still a choice.'
        } },
        { say: {
          speaker: 'Commander Reyes',
          portrait: 'reyes',
          text: 'Then remember that claiming it will be one too.'
        } }
      ]
    }
  } },
  { quest: { id: 'q_first_claim', stage: 1, status: 'active' } },
  { flag: { key: 'first_claim_started', value: true } },
  { autosave: 'Starfall Plaza' },
  { banner: 'Quest begun: The First Claim' }
];

const PIP_RECRUITMENT = [
  { say: {
    speaker: 'Damaged Construct',
    portrait: 'pip',
    text: 'Diagnostic: flight unstable, memory incomplete, optimism... still within tolerance.'
  } },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'You are hurt. Can you tell me your name?'
  } },
  { say: {
    speaker: 'Damaged Construct',
    portrait: 'pip',
    text: 'Pip. Probably. It is written on three internal panels, which feels persuasive.'
  } },
  { choice: {
    prompt: 'How does Lyra respond?',
    options: [
      { label: 'Let me help repair you', value: 'care' },
      { label: 'We need your expertise', value: 'purpose' }
    ],
    results: {
      care: [
        { flag: { key: 'pip_first_bond', value: 'care' } },
        { say: {
          speaker: 'Pip',
          portrait: 'pip',
          text: 'Assistance without a service request. I would like to understand that.'
        } }
      ],
      purpose: [
        { flag: { key: 'pip_first_bond', value: 'purpose' } },
        { say: {
          speaker: 'Pip',
          portrait: 'pip',
          text: 'A purpose offered rather than installed. Yes. I would like to test the distinction.'
        } }
      ]
    }
  } },
  { recruit: 'pip' },
  { flag: { key: 'pip_recruited', value: true } },
  { say: {
    speaker: 'Pip',
    portrait: 'pip',
    text: 'Joining party. Please note: repair advice may be applied to machines, plans, or morale.'
  } },
  { autosave: 'Stargate Dock' },
  { banner: 'Pip joined the party' }
];

const ERYNN_RECRUITMENT = [
  { say: {
    speaker: 'Felidae Scout',
    portrait: 'erynn',
    text: 'Royal expedition? Subtle. I only heard the collapsing bridge from two rooms away.'
  } },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'You crossed the fracture alone?'
  } },
  { say: {
    speaker: 'Felidae Scout',
    portrait: 'erynn',
    text: 'Alone is quieter. Usually. Kael has made the place crowded with things that bite.'
  } },
  { choice: {
    prompt: 'What does Lyra offer?',
    options: [
      { label: 'A place beside us', value: 'trust' },
      { label: 'A shared target', value: 'terms' }
    ],
    results: {
      trust: [
        { flag: { key: 'erynn_first_bond', value: 'trust' } },
        { say: {
          speaker: 'Lyra',
          portrait: 'lyra',
          text: 'Then do not be alone. Walk beside us, and leave when you choose.'
        } },
        { say: {
          speaker: 'Erynn',
          portrait: 'erynn',
          text: 'No oath, no collar. You may be the first royal who understands an invitation.'
        } }
      ],
      terms: [
        { flag: { key: 'erynn_first_bond', value: 'terms' } },
        { say: {
          speaker: 'Lyra',
          portrait: 'lyra',
          text: 'Help us reach Kael. We help you cross whatever comes after.'
        } },
        { say: {
          speaker: 'Erynn',
          portrait: 'erynn',
          text: 'Clear terms. I almost trust those.'
        } }
      ]
    }
  } },
  { recruit: 'erynn' },
  { flag: { key: 'erynn_recruited', value: true } },
  { say: {
    speaker: 'Erynn',
    portrait: 'erynn',
    text: 'Erynn Vexx. Eryx if we survive long enough to become friends.'
  } },
  { quest: { id: 'q_first_claim', stage: 2, status: 'active' } },
  { tutorial: 'resonance' },
  { autosave: 'Shattered Gate Approach' },
  { banner: 'Erynn joined the party' }
];

const KAEL_VICTORY = [
  { music: null },
  { wait: 500 },
  { say: {
    speaker: 'Void Sentinel Kael',
    portrait: 'kael',
    text: 'The gate... remembers a command older than your Crown.'
  } },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'Who gave it?'
  } },
  { say: {
    speaker: 'Void Sentinel Kael',
    portrait: 'kael',
    text: 'Ask the shard what your line ordered us to forget.'
  } },
  { flag: { key: 'kael_defeated', value: true } },
  { quest: { id: 'q_first_claim', stage: 5, status: 'active' } },
  { sfx: 'shard' },
  { run: claimGateShard },
  { flash: 0xffe79a },
  { shake: true },
  { say: {
    speaker: 'Memory of the Gate',
    text: 'WE OPENED THE ROAD. THE CROWN CHOSE WHO COULD WALK IT.'
  } },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'That is not protection. That is permission dressed as mercy.'
  } },
  { choice: {
    prompt: 'How does Lyra accept the shard?',
    options: [
      { label: 'I will carry its duty', value: 'duty' },
      { label: 'I will question its claim', value: 'question' }
    ],
    results: {
      duty: [
        { flag: { key: 'gate_shard_vow', value: 'duty' } },
        { say: {
          speaker: 'Lyra',
          portrait: 'lyra',
          text: 'Power cannot undo what happened here. It can answer for what I do next.'
        } }
      ],
      question: [
        { flag: { key: 'gate_shard_vow', value: 'question' } },
        { say: {
          speaker: 'Lyra',
          portrait: 'lyra',
          text: 'You do not make me rightful. You give me another truth to face.'
        } }
      ]
    }
  } },
  { evolve: 'lyra' },
  { flag: { key: 'lyra_crown_bearer', value: true } },
  { banner: 'Lyra evolved: Crown Bearer' },
  { say: {
    speaker: 'Pip',
    portrait: 'pip',
    text: 'Stellar output increased by forty-seven percent. Your pulse is also alarming.'
  } },
  { say: {
    speaker: 'Erynn',
    portrait: 'erynn',
    text: 'Still her, though. That is the part I was checking.'
  } },
  { quest: { id: 'q_first_claim', stage: 6, status: 'active' } },
  { flag: { key: 'nova_reaction_pending', value: true } },
  { autosave: 'Gate Heart' },
  { banner: 'Objective: Return to Nova Prime' }
];

const NOVA_RETURN = [
  { music: 'nova' },
  { say: {
    speaker: 'Commander Reyes',
    portrait: 'reyes',
    text: 'The wards felt you cross the relay. Every light in the plaza turned toward you.'
  } },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'Then they should know what came back with me. The shard remembers the Crown closing roads.'
  } },
  { say: {
    speaker: 'Dr. Elara',
    portrait: 'elara',
    text: 'A memory inside a power source. Evidence, warning, or both.'
  } },
  { if: state => state.flags.first_shard_intent === 'protection', then: [
    { say: {
      speaker: 'Commander Reyes',
      portrait: 'reyes',
      text: 'You wanted a shield. You brought home a question. Nova needs both.'
    } }
  ], else: [
    { say: {
      speaker: 'Commander Reyes',
      portrait: 'reyes',
      text: 'You went looking for an answer. Do not let the power make you stop asking.'
    } }
  ] },
  { quest: { id: 'q_first_claim', stage: 7, status: 'done' } },
  { flag: { key: 'act1_complete', value: true } },
  { flag: { key: 'nova_reaction_pending', value: false } },
  // Opens the Stargate route to Mirelight Deeps — without this, the
  // region is unreachable (Travel only ever lists a destination once
  // it appears in GameState.unlockedDestinations).
  { unlock: 'mirelight' },
  { autosave: 'Starfall Plaza' },
  { banner: 'Quest complete: The First Claim' }
];

export const npcsByMap = {
  stargate_dock: [
    {
      id: 'act1_pip',
      actor: 'pip',
      x: 19, y: 14, dir: 'left',
      if: state => hasQuest(state, 'q_fall_aftershock') && !hasRecruit(state, 'pip'),
      script: [
        { if: state => hasRecruit(state, 'pip'), then: [
          { say: { speaker: 'Pip', portrait: 'pip', text: 'Repairs holding. Optimism remains within tolerance.' } }
        ], else: PIP_RECRUITMENT }
      ]
    }
  ],

  gate_approach: [
    {
      id: 'act1_erynn',
      actor: 'erynn',
      x: 15, y: 7, dir: 'down',
      if: state => hasQuest(state, 'q_first_claim') && !hasRecruit(state, 'erynn'),
      script: [
        { if: state => hasRecruit(state, 'erynn'), then: [
          { say: { speaker: 'Erynn', portrait: 'erynn', text: 'Try not to step where the floor is glowing. Or breathing.' } }
        ], else: ERYNN_RECRUITMENT }
      ]
    }
  ],

  nova_plaza: [
    {
      id: 'act1_citizen_reaction',
      actor: 'citizen_f',
      x: 5, y: 18, dir: 'right',
      if: state => !!state.flags.kael_defeated,
      script: [
        { if: state => state.flags.prologue_instinct === 'people', then: [
          { say: {
            speaker: 'Nova Citizen',
            text: 'You pulled me from the rubble before you reached for the Crown. I remembered that when the sky lit up again.'
          } },
          { say: {
            speaker: 'Lyra',
            portrait: 'lyra',
            text: 'Remember who lifted with me. Crowns make poor rescue crews.'
          } }
        ], else: [
          { say: {
            speaker: 'Nova Citizen',
            text: 'The new ward held through the night. Maybe that fragment was worth reaching for.'
          } },
          { say: {
            speaker: 'Lyra',
            portrait: 'lyra',
            text: 'Only if we remember who it is meant to shelter.'
          } }
        ] }
      ]
    },
    {
      id: 'act1_guard_reaction',
      actor: 'guard',
      x: 24, y: 18, dir: 'left',
      if: state => !!state.flags.act1_complete,
      script: [
        { say: {
          speaker: 'Palace Guard',
          text: 'Some people are calling you Crown Bearer. Others are asking what the old Crown hid.'
        } },
        { say: {
          speaker: 'Lyra',
          portrait: 'lyra',
          text: 'Good. Nova should never be afraid to ask its heir a difficult question.'
        } }
      ]
    }
  ]
};

export const triggersByMap = {
  nova_plaza: [
    {
      id: 'act1_crownfall_prologue',
      cells: [{ x: 14, y: 17 }],
      onceFlag: 'act1_prologue_seen',
      if: state => !state.flags.act1_prologue_seen,
      script: PROLOGUE
    },
    {
      id: 'act1_first_claim_briefing',
      cells: [{ x: 14, y: 19 }, { x: 15, y: 19 }],
      onceFlag: 'first_claim_started',
      if: state => hasQuest(state, 'q_fall_aftershock', 'done') && !state.flags.first_claim_started,
      script: FIRST_CLAIM_BRIEFING
    },
    {
      id: 'act1_nova_return',
      cells: [{ x: 14, y: 19 }, { x: 15, y: 19 }],
      onceFlag: 'act1_complete',
      if: state => !!state.flags.nova_reaction_pending && !!state.flags.gate_shard_claimed,
      script: NOVA_RETURN
    }
  ],

  stargate_dock: [
    {
      id: 'act1_pip_distress',
      cells: Array.from({ length: 30 }, (_, x) => ({ x, y: 13 })),
      onceFlag: 'pip_distress_seen',
      if: state => hasQuest(state, 'q_fall_aftershock') && !hasRecruit(state, 'pip'),
      script: PIP_RECRUITMENT
    }
  ],

  gate_approach: [
    {
      id: 'act1_erynn_intercept',
      cells: [13, 14, 15, 16].map(x => ({ x, y: 10 })),
      onceFlag: 'erynn_intercept_seen',
      if: state => hasQuest(state, 'q_first_claim', 'active') && !hasRecruit(state, 'erynn'),
      script: ERYNN_RECRUITMENT
    }
  ],

  gate_hall_west: [
    {
      id: 'act1_first_ward',
      cells: [{ x: 14, y: 18 }, { x: 15, y: 18 }],
      onceFlag: 'act1_first_ward_seen',
      if: state => hasQuest(state, 'q_first_claim', 'active'),
      script: [
        { tutorial: 'stargate_barriers' },
        { say: {
          speaker: 'Pip',
          portrait: 'pip',
          text: 'Barrier logic is cycling. It expects obedience, not understanding.'
        } },
        { say: {
          speaker: 'Erynn',
          portrait: 'erynn',
          text: 'Then let us disappoint it intelligently.'
        } },
        { quest: { id: 'q_first_claim', stage: 3, status: 'active' } },
        { banner: 'Objective: Breach the Gate Heart' }
      ]
    }
  ],

  gate_heart: [
    {
      id: 'act1_kael_confrontation',
      cells: [{ x: 15, y: 12 }],
      onceFlag: 'kael_confronted',
      if: state => hasQuest(state, 'q_first_claim', 'active') && !state.flags.kael_defeated,
      script: [
        { music: null },
        { say: {
          speaker: 'Void Sentinel Kael',
          portrait: 'kael',
          text: 'CROWN AUTHORITY DETECTED. THE GATE DENIES YOUR CLAIM.'
        } },
        { say: {
          speaker: 'Lyra',
          portrait: 'lyra',
          text: 'I did not come to command the gate. I came for the people your silence trapped.'
        } },
        { say: {
          speaker: 'Void Sentinel Kael',
          portrait: 'kael',
          text: 'Your blood made silence law.'
        } },
        { quest: { id: 'q_first_claim', stage: 4, status: 'active' } },
        { tutorial: 'combat' },
        { battle: {
          enemies: ['kael'],
          isBoss: true,
          backdrop: 'stargate',
          canFlee: false,
          winScript: KAEL_VICTORY
        } }
      ]
    }
  ]
};

export const interactionsByMap = {
  stargate_dock: [
    {
      id: 'act1_pip_crash_marks',
      x: 21, y: 14,
      script: [
        { if: state => state.flags.pip_recruited, then: [
          { say: {
            speaker: 'Pip',
            portrait: 'pip',
            text: 'Impact site confirmed. I have decided not to repeat the landing.'
          } }
        ], else: [
          { say: {
            speaker: 'Lyra',
            portrait: 'lyra',
            text: 'Fresh scoring. Something small hit the dock hard and slid toward the relay.'
          } }
        ] }
      ]
    }
  ]
};

export const quests = {
  q_fall_aftershock: {
    id: 'q_fall_aftershock',
    title: 'After the Fall',
    type: 'main',
    summary: 'Stabilize Nova Prime after the Crownfall and restore its local Stargate relay.',
    stages: [
      'Reach Stargate Dock and assess the relay.',
      'Run a diagnostic at the Stargate console.',
      'Report the relay status to Commander Reyes.',
      "Nova Prime's local relay has been restored."
    ]
  },

  q_first_claim: {
    id: 'q_first_claim',
    title: 'The First Claim',
    type: 'main',
    summary: 'Follow a Crown signal into the Shattered Stargate and decide what its power means.',
    stages: [
      'Cross the fractured route to the Shattered Stargate.',
      'Join Erynn and enter the ruined gate complex.',
      'Break through the gate wards.',
      'Confront Void Sentinel Kael in the Gate Heart.',
      'Claim the Shard of the Gate.',
      'Return to Nova Prime with the shard.',
      'The first shard is claimed, and its warning has reached Nova.'
    ]
  }
};
