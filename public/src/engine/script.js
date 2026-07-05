// ═══════════════════════════════════════════════════════════════
// SCRIPT — Cutscene / interaction runner. Executes an array of ops
// against a MapScene: dialogue, choices, movement, effects, state.
// Dialogue is displayed by DialogueScene via game-level events.
//
// Op reference:
//  { say: { speaker, portrait, emote, text } }
//  { choice: { options: [{label, value}], results: {value: [ops]} } }
//  { face: { who, dir } }                       who: 'player'|'npc:<id>'
//  { move: { who, steps: ['up','up','left'] } }
//  { wait: ms }
//  { fade: 'out'|'in' }
//  { flash: color } | { shake: true }
//  { music: songId|null } | { sfx: id }
//  { flag: { key, value } }                     GameState.flags
//  { world: { key, value } }                    GameState.world (D21 consequence flags)
//  { bond: { char, amount? } }                   GameState.relationships[char].bond (D15)
//  { give: { item, qty } } | { give: { gold } }
//  { teleport: { map, x, y, dir } }
//  { unlock: destinationId }                    adds to GameState.unlockedDestinations
//  { quest: { id, stage?, status? } }
//  { battle: { enemies:[ids], isBoss?, backdrop?, canFlee?, winScript?: [ops], mercyScript?: [ops] } }
//  { setcell: { x, y, ch } }
//  { tutorial: id } | { evolve: characterId }
//  { shop: shopId }
//  { rest: { cost, location? } }
//  { autosave: locationName? }
//  { recruit: charId }
//  { banner: text }
//  { run: (scene) => {} }                       escape hatch
//  { if: (state) => bool, then: [ops], else: [ops] }
// ═══════════════════════════════════════════════════════════════

import { GameState, setFlag, setWorldFlag, autoSave } from '../game/state.js';
import { fadeIn, fadeOut, flash, shake } from './fx.js';
import { sfx, playSong, stopSong } from './audio.js';
import { addItem, addGold } from '../game/inventory.js';
import { setQuest } from '../game/quests.js';
import { recruit } from '../game/party.js';
import { addBond } from '../game/relationships.js';

function wait(scene, ms) {
  return new Promise(res => scene.time.delayedCall(ms, res));
}

function ensureDialogue(scene) {
  const dlg = scene.scene.get('DialogueScene');
  if (!scene.scene.isActive('DialogueScene')) {
    scene.scene.launch('DialogueScene');
  }
  return dlg;
}

function say(scene, payload) {
  ensureDialogue(scene);
  return new Promise(resolve => {
    // Next tick so DialogueScene create() has run
    scene.time.delayedCall(0, () => {
      scene.game.events.emit('dialogue:say', Object.assign({ resolve }, payload));
    });
  });
}

function choice(scene, payload) {
  ensureDialogue(scene);
  return new Promise(resolve => {
    scene.time.delayedCall(0, () => {
      scene.game.events.emit('dialogue:choice', Object.assign({ resolve }, payload));
    });
  });
}

function closeDialogue(scene) {
  if (scene.scene.isActive('DialogueScene')) scene.game.events.emit('dialogue:end');
}

export async function runScript(scene, ops, ctx = {}) {
  const wasRunning = scene.scriptRunning;
  scene.scriptRunning = true;
  let usedDialogue = false;
  try {
    for (const op of ops) {
      if (op.say) {
        usedDialogue = true;
        await say(scene, op.say);
      } else if (op.choice) {
        usedDialogue = true;
        const val = await choice(scene, { options: op.choice.options, prompt: op.choice.prompt });
        if (ctx.onChoice) ctx.onChoice(val);
        const branch = op.choice.results && op.choice.results[val];
        if (branch) await runScript(scene, branch, ctx);
      } else if (op.face) {
        const ent = scene.getEntity(op.face.who);
        if (ent) ent.actor.face(op.face.dir);
      } else if (op.move) {
        const ent = scene.getEntity(op.move.who);
        if (ent) {
          for (const dir of op.move.steps) {
            await scene.stepEntityAsync(ent, dir, true);
          }
        }
      } else if (op.wait !== undefined) {
        await wait(scene, op.wait);
      } else if (op.fade === 'out') {
        await new Promise(res => fadeOut(scene, 350, res));
      } else if (op.fade === 'in') {
        await new Promise(res => { fadeIn(scene, 350, res); });
      } else if (op.flash !== undefined) {
        flash(scene, op.flash === true ? 0xffffff : op.flash);
      } else if (op.shake) {
        shake(scene);
      } else if (op.music !== undefined) {
        if (op.music === null) stopSong();
        else scene.playMapSong(op.music);
      } else if (op.sfx) {
        sfx(op.sfx);
      } else if (op.flag) {
        setFlag(op.flag.key, op.flag.value !== undefined ? op.flag.value : true);
      } else if (op.world) {
        setWorldFlag(op.world.key, op.world.value !== undefined ? op.world.value : true);
      } else if (op.bond) {
        addBond(op.bond.char, op.bond.amount || 1);
      } else if (op.give) {
        if (op.give.gold) addGold(op.give.gold);
        if (op.give.item) addItem(op.give.item, op.give.qty || 1);
        if (op.give.notice !== false) {
          usedDialogue = true;
          const what = op.give.gold ? op.give.gold + ' gold' : (op.give.qty || 1) + '× ' + op.give.item;
          sfx(op.give.gold ? 'coin' : 'chest');
          await say(scene, { text: 'Received ' + what + '.' });
        }
      } else if (op.teleport) {
        await new Promise(res => fadeOut(scene, 300, res));
        if (GameState) {
          GameState.map = op.teleport.map;
          GameState.x = op.teleport.x;
          GameState.y = op.teleport.y;
          GameState.dir = op.teleport.dir || 'down';
        }
        scene.scene.restart({ mapId: op.teleport.map, entry: { x: op.teleport.x, y: op.teleport.y, dir: op.teleport.dir || 'down' } });
        return;   // scene is gone; stop executing
      } else if (op.unlock) {
        if (GameState && !GameState.unlockedDestinations.includes(op.unlock)) {
          GameState.unlockedDestinations.push(op.unlock);
        }
      } else if (op.quest) {
        setQuest(op.quest.id, op.quest);
      } else if (op.battle) {
        // close any open dialogue before combat
        closeDialogue(scene);
        const outcome = await new Promise(res => {
          scene.events.once('combat:end', (d) => res(d.outcome));
          scene.scene.launch('CombatScene', op.battle);
          scene.scene.pause();
        });
        if (outcome === 'victory' && op.battle.winScript) {
          await runScript(scene, op.battle.winScript, ctx);
        } else if (outcome === 'mercy' && (op.battle.mercyScript || op.battle.winScript)) {
          await runScript(scene, op.battle.mercyScript || op.battle.winScript, ctx);
        }
      } else if (op.setcell) {
        scene.setCell(op.setcell.x, op.setcell.y, op.setcell.ch);
      } else if (op.tutorial) {
        if (!GameState.tutorialsSeen.includes(op.tutorial)) {
          closeDialogue(scene);
          await new Promise(res => {
            scene.scene.launch('TutorialScene', {
              id: op.tutorial, parentScene: scene.sys.settings.key, resolve: res
            });
            scene.scene.pause();
          });
        }
      } else if (op.evolve) {
        closeDialogue(scene);
        await new Promise(res => {
          scene.scene.launch('EvolutionScene', {
            characterId: op.evolve, parentScene: scene.sys.settings.key, resolve: res
          });
          scene.scene.pause();
        });
      } else if (op.shop) {
        closeDialogue(scene);
        await new Promise(res => {
          scene.scene.launch('ShopScene', {
            shopId: op.shop, parentScene: scene.sys.settings.key, resolve: res
          });
          scene.scene.pause();
        });
      } else if (op.rest) {
        const cost = Math.max(0, op.rest.cost || 0);
        usedDialogue = true;
        if (GameState.gold < cost) {
          sfx('error');
          await say(scene, { text: 'Not enough gold.' });
        } else {
          addGold(-cost);
          for (const id of GameState.roster) {
            const rec = GameState.chars[id];
            if (rec) { rec.hp = rec.maxHp; rec.sp = rec.maxSp; }
          }
          sfx('heal');
          await say(scene, { text: 'The party is fully rested.' });
          autoSave(op.rest.location);
        }
      } else if (op.autosave !== undefined) {
        autoSave(typeof op.autosave === 'string' ? op.autosave : undefined);
      } else if (op.recruit) {
        recruit(op.recruit);
      } else if (op.banner) {
        scene.showBanner(op.banner);
      } else if (op.run) {
        await op.run(scene);
      } else if (op.if) {
        const branch = op.if(GameState) ? op.then : op.else;
        if (branch) await runScript(scene, branch, ctx);
      }
    }
  } finally {
    if (!wasRunning) {
      scene.scriptRunning = false;
      if (usedDialogue || scene.scene.isActive('DialogueScene')) {
        scene.game.events.emit('dialogue:end');
      }
    }
  }
}
