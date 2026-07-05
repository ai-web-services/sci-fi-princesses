// ═══════════════════════════════════════════════════════════════
// ACT II — Mirelight Deeps (M5). Story content is kept separate
// from map geometry. storyContent merges these registries into
// each authored map at runtime.
// ═══════════════════════════════════════════════════════════════

import { GameState } from '../game/state.js';

function hasQuest(state, id, status) {
  const quest = state && state.quests && state.quests[id];
  return !!quest && (!status || quest.status === status);
}

function hasRecruit(state, id) {
  return !!state && Array.isArray(state.roster) && state.roster.includes(id);
}

function brimbleBond(state) {
  return !!(state && state.relationships && state.relationships.brimble && state.relationships.brimble.bond >= 2);
}

function claimTideShard(scene) {
  if (!GameState) return;
  if (!Array.isArray(GameState.shards)) GameState.shards = [];
  if (!GameState.shards.includes('tide_shard')) GameState.shards.push('tide_shard');
  GameState.flags.tide_shard_claimed = true;
  GameState.flags.lyra_tide_attuned = true;
  scene.showBanner('Crown Shard claimed: Shard of the Tide');
}

// ─── Arrival scene: first sight of the drowned world ──────────────
const MIRELIGHT_ARRIVAL = [
  { music: null },
  { fade: 'out' },
  { wait: 300 },
  { fade: 'in' },
  { music: 'mirelight' },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'This was an Anura world. I have seen the old survey charts — none of them show this much water.'
  } },
  { say: {
    speaker: 'Brimble',
    portrait: 'brimble',
    emote: 'sad',
    text: 'That is because there was none. Mirelight was marsh and orchard, not a drowned sky.'
  } },
  { say: {
    speaker: 'Erynn',
    portrait: 'erynn',
    text: 'The tide line is wrong. It should not reach this high, this far from the coast.'
  } },
  { say: {
    speaker: 'Pip',
    portrait: 'pip',
    text: 'Water samples registering void contamination at forty times the Nova baseline. Recommend: do not drink it. Or touch it. Or acknowledge it.'
  } },
  { say: {
    speaker: 'Brimble',
    portrait: 'brimble',
    text: 'It is called the void-tide. It rose after the Crownfall reached us, and it has not stopped rising since.'
  } },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'Then we find out why, and we find whatever shard is buried under it. Stay close. The mud already looks like it is thinking.'
  } },
  { quest: { id: 'q_mirelight_tide', stage: 1, status: 'active' } },
  { autosave: 'Mirelight Shore' },
  { banner: 'Quest begun: The Rising Tide' }
];

// ─── Brimble homecoming: one-shot bond scene on arrival at the village ───
const BRIMBLE_HOMECOMING = [
  { say: {
    speaker: 'Brimble',
    portrait: 'brimble',
    emote: 'sad',
    text: 'I know this square. There used to be a bell here, for the flood watch. I rang it myself, twice.'
  } },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'You do not have to talk about it.'
  } },
  { say: {
    speaker: 'Brimble',
    portrait: 'brimble',
    text: 'No. I think I have to, actually. Just not all of it. Not yet.'
  } },
  { say: {
    speaker: 'Brimble',
    portrait: 'brimble',
    text: 'Thank you for bringing me home, Highness. Even like this.'
  } },
  { bond: { char: 'brimble', amount: 1 } },
  { quest: { id: 'q_brimble_return', stage: 1, status: 'active' } },
  { flag: { key: 'brimble_homecoming_seen', value: true } }
];

// ─── Optional banter beat to reach bond 2 (village or shallows) ───
const BRIMBLE_BANTER = [
  { say: {
    speaker: 'Brimble',
    portrait: 'brimble',
    text: 'My mother used to say the marsh only takes what you are not brave enough to carry yourself.'
  } },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'Did you believe her?'
  } },
  { say: {
    speaker: 'Brimble',
    portrait: 'brimble',
    text: 'Not until just now. Strange timing, but I will take it.'
  } },
  { bond: { char: 'brimble', amount: 1 } },
  { flag: { key: 'brimble_banter_shallows_seen', value: true } }
];

// ─── Village plight: quest stage 1 -> 2 on first arrival ───
const VILLAGE_STAGE_ADVANCE = [
  { quest: { id: 'q_mirelight_tide', stage: 2, status: 'active' } },
  { banner: 'Objective: Scout the Deeps' }
];

// ─── Brimble's grief scene: keep/release choice over a family relic ───
const BRIMBLE_GRIEF_SCENE = [
  { say: {
    speaker: 'Brimble',
    portrait: 'brimble',
    emote: 'sad',
    text: 'This was our home. Mira and I raised our daughter Wren in this room, back when it had a roof.'
  } },
  { say: {
    speaker: 'Brimble',
    portrait: 'brimble',
    text: 'They did not get out. I was posted at the flood watch bell when the tide came up fast and wrong.'
  } },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'Brimble. I am so sorry.'
  } },
  { say: {
    speaker: 'Brimble',
    portrait: 'brimble',
    text: 'There. Under the silt. That is Wren\'s carving kit — the one thing the water did not carry off.'
  } },
  { choice: {
    prompt: 'What does Brimble do with the relic?',
    options: [
      { label: 'Keep it', value: 'keep' },
      { label: 'Let it go', value: 'release' }
    ],
    results: {
      keep: [
        { world: { key: 'brimble_relic', value: 'kept' } },
        { say: {
          speaker: 'Brimble',
          portrait: 'brimble',
          text: 'I will carry this one thing. It does not weigh what the rest of it does.'
        } },
        { say: {
          speaker: 'Lyra',
          portrait: 'lyra',
          text: 'Then it comes with us.'
        } }
      ],
      release: [
        { world: { key: 'brimble_relic', value: 'released' } },
        { say: {
          speaker: 'Brimble',
          portrait: 'brimble',
          text: 'No. I think Wren would rather the marsh kept it than my pack. Let it stay where she left it.'
        } },
        { say: {
          speaker: 'Lyra',
          portrait: 'lyra',
          text: 'Then we leave it with her.'
        } }
      ]
    }
  } },
  { say: {
    speaker: 'Brimble',
    portrait: 'brimble',
    text: 'Thank you for standing here with me. I did not want to do this one alone.'
  } },
  { bond: { char: 'brimble', amount: 1 } },
  { quest: { id: 'q_brimble_return', stage: 2, status: 'done' } },
  { flag: { key: 'brimble_return_seen', value: true } },
  { banner: 'Companion quest complete: Return' }
];

// ─── Tide gates opened -> quest stage advance (checked passively) ───
const TIDE_GATES_STAGE_ADVANCE = [
  { quest: { id: 'q_mirelight_tide', stage: 3, status: 'active' } },
  { banner: 'Objective: Open the tide gates' }
];

// ─── Throne room: confrontation + boss battle ───
const MATRIARCH_CONFRONTATION = [
  { music: null },
  { say: {
    speaker: 'Drowned Matriarch',
    text: 'CHILDREN OF THE DRY WORLD. YOU HAVE COME TO TAKE THE LAST OF WHAT IS MINE.'
  } },
  { say: {
    speaker: 'Brimble',
    portrait: 'brimble',
    text: 'She was Mirelight\'s guardian, before the flood. Gentle, even. This is not her.'
  } },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'Then let us see if any of her is still in there.'
  } },
  { quest: { id: 'q_mirelight_tide', stage: 4, status: 'active' } },
  { battle: {
    enemies: ['matriarch'],
    isBoss: true,
    canFlee: false,
    backdrop: 'mire',
    winScript: [
      { music: null },
      { wait: 400 },
      { say: {
        speaker: 'Lyra',
        portrait: 'lyra',
        text: 'It is done. I wish it had not needed to be.'
      } },
      { flash: 0x224466 },
      { shake: true },
      { say: {
        speaker: 'Memory of the Crown',
        text: 'A VISION SURFACES, UNBIDDEN, IN THE SHARD\'S LIGHT.'
      } },
      { say: {
        speaker: 'Memory of the Crown',
        text: 'A HAND — THE FIRST SOVEREIGN\'S — CLOSING AROUND SOMETHING THAT SCREAMS.'
      } },
      { say: {
        speaker: 'Memory of the Crown',
        text: 'IT DID NOT WOUND THE VOID. IT FOUND THE WOUND, AND SEALED ITS HAND OVER IT.'
      } },
      { say: {
        speaker: 'Lyra',
        portrait: 'lyra',
        emote: 'sad',
        text: 'The Crown was never just a shield. Something is being held shut.'
      } },
      { sfx: 'shard' },
      { run: claimTideShard },
      { quest: { id: 'q_mirelight_tide', stage: 4, status: 'done' } },
      { unlock: 'mirelight' },
      { autosave: 'Mirelight Deeps' },
      { banner: 'Shard claimed: Shard of the Tide' }
    ],
    mercyScript: [
      { music: null },
      { wait: 400 },
      { say: {
        speaker: 'Drowned Matriarch',
        text: 'The Matriarch stills. The tide recedes, and remembers.'
      } },
      { say: {
        speaker: 'Brimble',
        portrait: 'brimble',
        emote: 'happy',
        text: 'There she is. Thank you for finding her instead of only fighting her.'
      } },
      { flash: 0x224466 },
      { shake: true },
      { say: {
        speaker: 'Memory of the Crown',
        text: 'A VISION SURFACES, UNBIDDEN, IN THE SHARD\'S LIGHT.'
      } },
      { say: {
        speaker: 'Memory of the Crown',
        text: 'A HAND — THE FIRST SOVEREIGN\'S — CLOSING AROUND SOMETHING THAT SCREAMS.'
      } },
      { say: {
        speaker: 'Memory of the Crown',
        text: 'IT DID NOT WOUND THE VOID. IT FOUND THE WOUND, AND SEALED ITS HAND OVER IT.'
      } },
      { say: {
        speaker: 'Lyra',
        portrait: 'lyra',
        emote: 'sad',
        text: 'The Crown was never just a shield. Something is being held shut — and mercy did not stop me from seeing it.'
      } },
      { sfx: 'shard' },
      { run: claimTideShard },
      { quest: { id: 'q_mirelight_tide', stage: 4, status: 'done' } },
      { unlock: 'mirelight' },
      { autosave: 'Mirelight Deeps' },
      { banner: 'Shard claimed: Shard of the Tide' }
    ]
  } }
];

export const npcsByMap = {
  mire_village: [
    {
      id: 'mv_brimble_banter',
      actor: 'brimble',
      x: 12, y: 16, dir: 'down',
      if: state => hasRecruit(state, 'brimble') && !!state.flags.brimble_homecoming_seen && !state.flags.brimble_banter_shallows_seen,
      script: BRIMBLE_BANTER
    }
  ],

  nova_plaza: [
    {
      id: 'am5_reyes_debrief',
      actor: 'reyes',
      x: 12, y: 6, dir: 'down',
      if: state => !!state.flags.tide_shard_claimed,
      script: [
        { if: state => !state.flags.mirelight_debrief_seen, then: [
          { say: {
            speaker: 'Commander Reyes',
            portrait: 'reyes',
            text: 'Word reached us from Mirelight before you did. Two shards claimed. I am running out of ways to say "be careful."'
          } },
          { say: {
            speaker: 'Lyra',
            portrait: 'lyra',
            text: 'Then stop, and help me figure out what the Crown was built to hold shut.'
          } },
          { flag: { key: 'mirelight_debrief_seen', value: true } },
          { run: scene => { GameState.novaStage = 1; } }
        ], else: [
          { say: {
            speaker: 'Commander Reyes',
            portrait: 'reyes',
            text: 'The Mirelight relay is still holding steady. Small mercies.'
          } }
        ] }
      ]
    }
  ]
};

export const triggersByMap = {
  mire_landing: [
    {
      id: 'am5_arrival',
      cells: [
        { x: 12, y: 14 }, { x: 13, y: 14 }, { x: 14, y: 14 }, { x: 15, y: 14 }, { x: 16, y: 14 },
        { x: 12, y: 15 }, { x: 13, y: 15 }, { x: 14, y: 15 }, { x: 15, y: 15 }, { x: 16, y: 15 }
      ],
      onceFlag: 'mirelight_arrival_seen',
      if: state => !state.flags.mirelight_arrival_seen,
      script: MIRELIGHT_ARRIVAL
    }
  ],

  mire_village: [
    // Combined into one trigger (rather than two triggers sharing the same
    // cells) because MapScene.handleArrival() only ever fires the first
    // matching trigger per step — a second trigger on identical cells would
    // be starved until the player happened to re-step onto that exact tile.
    {
      id: 'am5_village_arrival',
      cells: [{ x: 14, y: 1 }, { x: 15, y: 1 }, { x: 14, y: 2 }, { x: 15, y: 2 }],
      script: [
        { if: state => hasQuest(state, 'q_mirelight_tide', 'active') && state.quests.q_mirelight_tide.stage === 1,
          then: VILLAGE_STAGE_ADVANCE },
        { if: state => hasRecruit(state, 'brimble') && !state.flags.brimble_homecoming_seen,
          then: BRIMBLE_HOMECOMING }
      ]
    }
  ],

  mire_deeps: [
    {
      id: 'am5_tide_gates_stage',
      cells: [{ x: 14, y: 1 }, { x: 15, y: 1 }, { x: 14, y: 2 }, { x: 15, y: 2 }],
      onceFlag: 'mire_deeps_stage_advanced',
      if: state => !!state.flags.mire_tide_gates_open && hasQuest(state, 'q_mirelight_tide', 'active') && state.quests.q_mirelight_tide.stage < 3,
      script: TIDE_GATES_STAGE_ADVANCE
    }
  ],

  mire_throne: [
    {
      id: 'am5_matriarch_confrontation',
      cells: [{ x: 14, y: 1 }, { x: 15, y: 1 }, { x: 14, y: 2 }, { x: 15, y: 2 }],
      onceFlag: 'matriarch_confronted',
      if: state => hasQuest(state, 'q_mirelight_tide', 'active') && state.quests.q_mirelight_tide.stage >= 3 && !state.flags.tide_shard_claimed,
      script: MATRIARCH_CONFRONTATION
    }
  ]
};

export const interactionsByMap = {
  mire_deeps: [
    {
      id: 'am5_brimble_grief',
      x: 5, y: 17,
      if: state => hasRecruit(state, 'brimble') && brimbleBond(state) && !!state.flags.mire_tide_gates_open,
      script: [
        { if: state => !!state.flags.brimble_return_seen, then: [
          { say: {
            speaker: 'Brimble',
            portrait: 'brimble',
            text: 'I have said my goodbyes here. I do not need to say them twice.'
          } }
        ], else: BRIMBLE_GRIEF_SCENE }
      ]
    }
  ]
};

export const quests = {
  q_mirelight_tide: {
    id: 'q_mirelight_tide',
    title: 'The Rising Tide',
    type: 'main',
    summary: 'Cross the drowned region of Mirelight Deeps and confront whatever is behind its rising void-tide.',
    stages: [
      'Reach Mirelight Village and learn what happened here.',
      'Scout the flooded Deeps beyond the village.',
      'Open the tide gates by throwing all three levers.',
      'Face the Drowned Matriarch in her throne hollow.'
    ]
  },

  q_brimble_return: {
    id: 'q_brimble_return',
    title: 'Return',
    type: 'companion',
    summary: "Brimble's homecoming to his drowned homestead, and the grief he has been carrying since the flood.",
    stages: [
      'Bring Brimble home to Mirelight Village.',
      'Visit his drowned homestead in the Deeps and face what he lost there.'
    ]
  }
};
