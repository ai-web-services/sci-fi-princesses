// ═══════════════════════════════════════════════════════════════
// ACT II — Ashfall Dominion (M6). Story content is kept separate
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

function drakkorBond(state) {
  return !!(state && state.relationships && state.relationships.drakkor && state.relationships.drakkor.bond >= 2);
}

function claimEmberShard(scene) {
  if (!GameState) return;
  if (!Array.isArray(GameState.shards)) GameState.shards = [];
  if (!GameState.shards.includes('ember_shard')) GameState.shards.push('ember_shard');
  GameState.flags.ember_shard_claimed = true;
  GameState.flags.lyra_ember_attuned = true;
  scene.showBanner('Crown Shard claimed: Shard of the Ember');
}

// ─── Arrival scene: the gate to a dying world, and Drakkor's wound ───
const ASHFALL_ARRIVAL = [
  { music: null },
  { fade: 'out' },
  { wait: 300 },
  { fade: 'in' },
  { music: 'ashfall' },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'The sky here is the color of a wound that never closed. This is Ashfall.'
  } },
  { say: {
    speaker: 'Erynn',
    portrait: 'erynn',
    text: 'The wind carries ash, not cloud. Nothing should still be alive down there — and yet.'
  } },
  { say: {
    speaker: 'Pip',
    portrait: 'pip',
    text: 'Atmospheric readings are hostile but survivable. Biosigns detected near the gate. One large. Draconic. Stationary.'
  } },
  { say: {
    speaker: 'Drakkor',
    portrait: 'drakkor',
    emote: 'sad',
    text: 'You need not announce me, construct. I already know what I will find, and I have found it already. My clutch is gone.'
  } },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'Drakkor. You came ahead of us.'
  } },
  { say: {
    speaker: 'Drakkor',
    portrait: 'drakkor',
    text: 'I came home, Highness. There is a difference, and I have only now learned it. I was posted at the outer watch when the Void-fire took the caldera. I was supposed to be the one who could not be broken through.'
  } },
  { say: {
    speaker: 'Drakkor',
    portrait: 'drakkor',
    emote: 'sad',
    text: 'Twelve hatchlings in my clutch. I have counted the survivors twice, hoping the number would change. It does not change.'
  } },
  { say: {
    speaker: 'Erynn',
    portrait: 'erynn',
    text: 'You were one warrior against whatever did this. That is not the same as failing them.'
  } },
  { say: {
    speaker: 'Drakkor',
    portrait: 'drakkor',
    text: 'Tell that to my claws. They do not believe you either.'
  } },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'Then come with us and let us find out together what did this — and whether any of it can still be answered for.'
  } },
  { say: {
    speaker: 'Drakkor',
    portrait: 'drakkor',
    text: 'Answered for. Yes. I would like that very much, Highness. Command me, and I will not fail this clutch, whatever it costs.'
  } },
  { recruit: 'drakkor' },
  { bond: { char: 'drakkor', amount: 1 } },
  { quest: { id: 'q_drakkor_return', stage: 1, status: 'active' } },
  { quest: { id: 'q_ashfall_ember', stage: 1, status: 'active' } },
  { autosave: 'Ashfall Gate' },
  { banner: 'Quest begun: Cinder and Crown' }
];

// ─── Optional banter beat to reach bond 2 (wastes or hold) ───
const DRAKKOR_BANTER = [
  { say: {
    speaker: 'Drakkor',
    portrait: 'drakkor',
    text: 'Drakonid hatchlings are taught to breathe fire before they are taught to walk. My clutch could all singe a stone by the time they could stand on it.'
  } },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'That sounds like it was as terrifying as it was proud.'
  } },
  { say: {
    speaker: 'Drakkor',
    portrait: 'drakkor',
    text: 'Both, Highness. Always both. I did not think I would miss the singed stones this much.'
  } },
  { bond: { char: 'drakkor', amount: 1 } },
  { flag: { key: 'drakkor_banter_wastes_seen', value: true } }
];

// ─── Ashfall Hold arrival: succession conflict introduced ───
const HOLD_STAGE_ADVANCE = [
  { quest: { id: 'q_ashfall_ember', stage: 2, status: 'active' } },
  { say: {
    speaker: 'Elder Vashka',
    portrait: 'drakkor',
    text: 'Outsiders. And a clutch-orphan besides. Ashveil, you bring strange company home.'
  } },
  { say: {
    speaker: 'Drakkor',
    portrait: 'drakkor',
    text: 'They are here to help, Elder. What is left of the Hold cannot afford to refuse help.'
  } },
  { say: {
    speaker: 'Claimant Rhaskor',
    text: 'What is left of the Hold cannot afford to wait on the Elder Council either. While you debate tradition, Ignis burns another vent-farm to ash.'
  } },
  { say: {
    speaker: 'Elder Vashka',
    portrait: 'drakkor',
    text: 'Tradition is the only reason any Drakonids still draw breath, whelp. Every clutch we have lost was lost to haste, not caution.'
  } },
  { say: {
    speaker: 'Claimant Rhaskor',
    text: 'And every clutch we still have will be lost to caution, if we wait for the council to agree on which mountain to die on.'
  } },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'You are both arguing about how to save the same people.'
  } },
  { say: {
    speaker: 'Elder Vashka',
    portrait: 'drakkor',
    text: 'Save them how, Sovereign-child, is the entire question. The old ways bought us three hundred years past the Crownfall. I am not eager to spend the last of us testing something new.'
  } },
  { say: {
    speaker: 'Claimant Rhaskor',
    text: 'And I am not eager to bury more hatchlings because we tested nothing at all. Someone will have to decide who leads the last Drakonids. I only ask that it be decided before there is no one left to lead.'
  } },
  { say: {
    speaker: 'Drakkor',
    portrait: 'drakkor',
    emote: 'sad',
    text: 'They have argued like this since before I left for the outer watch. I do not know which of them is right. I am no longer certain the question has a right answer.'
  } },
  { banner: 'Objective: Learn of the succession conflict' }
];

// ─── Drakkor's fortress-corner grief scene: S2 "Return" ───
const DRAKKOR_GRIEF_SCENE = [
  { say: {
    speaker: 'Drakkor',
    portrait: 'drakkor',
    emote: 'sad',
    text: 'This corner held. Everything else in the caldera burned or fell, and this one wall held. I do not know if that is mercy or mockery.'
  } },
  { say: {
    speaker: 'Drakkor',
    portrait: 'drakkor',
    text: 'This was the creche. I was meant to relieve the watch here myself that night. I was three ridges away when the sky went white.'
  } },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'Drakkor. You do not have to stand in this alone.'
  } },
  { say: {
    speaker: 'Drakkor',
    portrait: 'drakkor',
    text: 'I have stood in it alone since the night it happened, Highness. Standing in it with someone else is going to take practice.'
  } },
  { say: {
    speaker: 'Drakkor',
    portrait: 'drakkor',
    emote: 'sad',
    text: 'There. Half-buried in the slag. That is the clutch-signet — every hatchling\'s mark scratched into the one ring. It should have melted. It did not.'
  } },
  { choice: {
    prompt: 'What does Drakkor do with the clutch-signet?',
    options: [
      { label: 'Keep it', value: 'keep' },
      { label: 'Let it go', value: 'release' }
    ],
    results: {
      keep: [
        { world: { key: 'drakkor_relic', value: 'kept' } },
        { say: {
          speaker: 'Drakkor',
          portrait: 'drakkor',
          text: 'I will carry this. If I cannot carry them, I will at least carry their names.'
        } },
        { say: {
          speaker: 'Lyra',
          portrait: 'lyra',
          text: 'Then their names come with us.'
        } }
      ],
      release: [
        { world: { key: 'drakkor_relic', value: 'released' } },
        { say: {
          speaker: 'Drakkor',
          portrait: 'drakkor',
          text: 'No. I think they would rather this mountain kept it than my armor. Let the caldera hold their names instead of my grief.'
        } },
        { say: {
          speaker: 'Lyra',
          portrait: 'lyra',
          text: 'Then we leave it with them.'
        } }
      ]
    }
  } },
  { say: {
    speaker: 'Drakkor',
    portrait: 'drakkor',
    text: 'Thank you for coming back here with me, Highness. I did not think I would be able to look at this wall again, let alone with witnesses.'
  } },
  { bond: { char: 'drakkor', amount: 1 } },
  { quest: { id: 'q_drakkor_return', stage: 2, status: 'done' } },
  { flag: { key: 'drakkor_return_seen', value: true } },
  { banner: 'Companion quest complete: Return' }
];

// ─── Succession choice: Lyra backs a claimant before the throne ───
const SUCCESSION_CHOICE = [
  { say: {
    speaker: 'Drakkor',
    portrait: 'drakkor',
    text: 'Before we go further, Highness — the Elder and the Claimant have both asked for your voice in this. A Sovereign\'s word still carries weight here, whether or not it should.'
  } },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'That is not a weight I take lightly. But they cannot keep arguing while Ignis burns what is left of the Hold.'
  } },
  { choice: {
    prompt: 'Who does Lyra back to lead the last Drakonids?',
    options: [
      { label: 'Elder Vashka — tradition and caution', value: 'elder' },
      { label: 'Claimant Rhaskor — radical action', value: 'claimant' }
    ],
    results: {
      elder: [
        { world: { key: 'ashfall_heir', value: 'elder' } },
        { say: {
          speaker: 'Lyra',
          portrait: 'lyra',
          text: 'The Elder has kept you alive for three hundred years. That is not a record I will overrule on my first day here.'
        } },
        { say: {
          speaker: 'Elder Vashka',
          portrait: 'drakkor',
          text: 'Then the council thanks you, Sovereign-child. We will move carefully. We have simply run out of time to move slowly as well.'
        } }
      ],
      claimant: [
        { world: { key: 'ashfall_heir', value: 'claimant' } },
        { say: {
          speaker: 'Lyra',
          portrait: 'lyra',
          text: 'Caution has not stopped the burning. I would rather back someone willing to try something new than watch the count of survivors keep shrinking.'
        } },
        { say: {
          speaker: 'Claimant Rhaskor',
          text: 'Then I will not waste the trust, Sovereign. Whatever comes after Ignis, we move differently starting now.'
        } }
      ]
    }
  } },
  { say: {
    speaker: 'Drakkor',
    portrait: 'drakkor',
    text: 'Whatever you have decided, Highness, it changes nothing about what we do next. Ignis first. The Hold can argue about its future once it still has one.'
  } },
  { flag: { key: 'ashfall_succession_resolved', value: true } }
];

// ─── Throne room: confrontation + boss battle ───
const IGNIS_CONFRONTATION = [
  { music: null },
  { say: {
    speaker: 'Ash Tyrant Ignis',
    text: 'THE LAST OF THE CLUTCH RETURNS, AND BRINGS OUTSIDERS TO WATCH HIM FAIL A SECOND TIME.'
  } },
  { say: {
    speaker: 'Drakkor',
    portrait: 'drakkor',
    emote: 'sad',
    text: 'You wear my clutch\'s ash like a crown. I do not know what you are, but you will not wear it any longer.'
  } },
  { say: {
    speaker: 'Lyra',
    portrait: 'lyra',
    text: 'Then let us finish what the outer watch could not.'
  } },
  { say: {
    speaker: 'Ash Tyrant Ignis',
    text: 'COME, THEN. SEE HOW MUCH OF YOU IS STILL WHOLE WHEN THE ASH SETTLES.'
  } },
  { quest: { id: 'q_ashfall_ember', stage: 3, status: 'active' } },
  { battle: {
    enemies: ['ignis'],
    isBoss: true,
    canFlee: false,
    backdrop: 'ash',
    winScript: [
      { music: null },
      { wait: 400 },
      { say: {
        speaker: 'Drakkor',
        portrait: 'drakkor',
        text: 'It is done. The caldera is quiet for the first time since the night it burned.'
      } },
      { say: {
        speaker: 'Lyra',
        portrait: 'lyra',
        text: 'Your clutch did not fail you, Drakkor. Whatever this thing was, it was never a fight one warrior could have won alone.'
      } },
      { say: {
        speaker: 'Drakkor',
        portrait: 'drakkor',
        emote: 'happy',
        text: 'I am beginning to believe that, Highness. Slowly. With practice, as I said.'
      } },
      { flash: 0xaa3311 },
      { shake: true },
      { say: {
        speaker: 'Memory of the Crown',
        text: 'A VISION SURFACES, UNBIDDEN, IN THE SHARD\'S LIGHT.'
      } },
      { say: {
        speaker: 'Memory of the Crown',
        text: 'A FORGE, AND THE FIRST SOVEREIGN\'S HAND UPON IT — SHAPING SOMETHING FROM THE VOID ITSELF.'
      } },
      { say: {
        speaker: 'Memory of the Crown',
        text: 'NOT STOLEN POWER. TEMPERED POWER. THE WOUND, BEATEN INTO A BLADE, AND THE BLADE HANDED TO THOSE WHO WOULD CARRY IT.'
      } },
      { say: {
        speaker: 'Lyra',
        portrait: 'lyra',
        emote: 'sad',
        text: 'The Crown did not just hold the wound shut. It learned to forge with it. I do not yet know if that makes this easier or harder to carry.'
      } },
      { sfx: 'shard' },
      { run: claimEmberShard },
      { quest: { id: 'q_ashfall_ember', stage: 4, status: 'done' } },
      { unlock: 'ashfall' },
      { autosave: 'Ashfall Dominion' },
      { banner: 'Shard claimed: Shard of the Ember' }
    ]
  } }
];

export const npcsByMap = {
  ash_hold: [
    {
      id: 'ah_drakkor_banter',
      actor: 'drakkor',
      x: 12, y: 16, dir: 'down',
      if: state => hasRecruit(state, 'drakkor') && !state.flags.drakkor_banter_wastes_seen,
      script: DRAKKOR_BANTER
    }
  ],

  nova_plaza: [
    {
      id: 'am6_reyes_debrief',
      actor: 'reyes',
      x: 12, y: 6, dir: 'down',
      if: state => !!state.flags.ember_shard_claimed,
      script: [
        { if: state => !state.flags.ashfall_debrief_seen, then: [
          { say: {
            speaker: 'Commander Reyes',
            portrait: 'reyes',
            text: 'Ashfall reported a shockwave that registered clear out here. Three shards now. I am starting to run out of new ways to say "be careful," Highness.'
          } },
          { say: {
            speaker: 'Lyra',
            portrait: 'lyra',
            text: 'Then help me find out what the Crown was forged to carry. I think it was never meant to be carried alone.'
          } },
          { flag: { key: 'ashfall_debrief_seen', value: true } },
          // Opens the Stargate route to Kessari Reach — otherwise
          // unreachable, same gap mirelight/ashfall had before their
          // predecessor region's debrief scene.
          { unlock: 'kessari' }
        ], else: [
          { say: {
            speaker: 'Commander Reyes',
            portrait: 'reyes',
            text: 'The Ashfall relay is still holding. Ashveil\'s people send word now and then. Small mercies.'
          } }
        ] }
      ]
    }
  ]
};

export const triggersByMap = {
  ash_gate: [
    {
      id: 'am6_arrival',
      // Matches ash_gate's own spawn cell exactly: Travel's ash_gate
      // entry lands the player at {14,19}, and the only exit here is
      // south at y21 — cells anywhere north of spawn would never be
      // stepped on, leaving Drakkor's recruitment unreachable.
      cells: [{ x: 14, y: 19 }, { x: 15, y: 19 }],
      onceFlag: 'ashfall_arrival_seen',
      if: state => !state.flags.ashfall_arrival_seen,
      script: ASHFALL_ARRIVAL
    }
  ],

  ash_hold: [
    {
      id: 'am6_hold_arrival',
      cells: [{ x: 14, y: 1 }, { x: 15, y: 1 }, { x: 14, y: 2 }, { x: 15, y: 2 }],
      onceFlag: 'ash_hold_stage_advanced',
      if: state => hasQuest(state, 'q_ashfall_ember', 'active') && state.quests.q_ashfall_ember.stage === 1,
      script: HOLD_STAGE_ADVANCE
    }
  ],

  // Combined into one trigger (rather than two triggers sharing the same
  // cells) because MapScene.handleArrival() only ever fires the first
  // matching trigger per step — a second trigger on identical cells would
  // be starved until the player happened to re-step onto that exact tile.
  ash_throne: [
    {
      id: 'am6_throne_arrival',
      cells: [{ x: 14, y: 1 }, { x: 15, y: 1 }, { x: 14, y: 2 }, { x: 15, y: 2 }],
      script: [
        { if: state => !state.flags.ashfall_succession_resolved && hasQuest(state, 'q_ashfall_ember', 'active') && state.quests.q_ashfall_ember.stage >= 2,
          then: SUCCESSION_CHOICE },
        { if: state => !!state.flags.ashfall_succession_resolved && hasQuest(state, 'q_ashfall_ember', 'active') && state.quests.q_ashfall_ember.stage >= 2 && !state.flags.ember_shard_claimed,
          then: IGNIS_CONFRONTATION }
      ]
    }
  ]
};

export const interactionsByMap = {
  ash_caldera: [
    {
      id: 'am6_drakkor_grief',
      x: 24, y: 17,
      if: state => hasRecruit(state, 'drakkor') && drakkorBond(state) && !!state.flags.ash_slag_cleared,
      script: [
        { if: state => !!state.flags.drakkor_return_seen, then: [
          { say: {
            speaker: 'Drakkor',
            portrait: 'drakkor',
            text: 'I have said what needed saying to this wall. It does not need saying twice.'
          } }
        ], else: DRAKKOR_GRIEF_SCENE }
      ]
    }
  ]
};

export const quests = {
  q_ashfall_ember: {
    id: 'q_ashfall_ember',
    title: 'Cinder and Crown',
    type: 'main',
    summary: 'Cross the volcanic wasteland of the Ashfall Dominion and confront the Ash Tyrant burning the last Drakonids to ash.',
    stages: [
      'Reach the Ashfall Gate and learn what happened here.',
      'Travel to Ashfall Hold and learn of the succession conflict.',
      'Confront the Ash Tyrant Ignis in the throne caldera.',
      'Claim the shard forged in Ignis\'s wake.'
    ]
  },

  q_drakkor_return: {
    id: 'q_drakkor_return',
    title: 'Return',
    type: 'companion',
    summary: "Drakkor's homecoming to the ruins of his clutch, and the guilt he has carried since the night it burned.",
    stages: [
      'Learn what happened to Drakkor\'s clutch.',
      'Return to his fallen fortress in the Ashfall caldera.'
    ]
  }
};
