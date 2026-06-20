// combat.js — Combat system: turn-based ATB with skill/target selection
var CombatSys={
  active:false,enemies:[],boss:null,phase:'start',
  selChar:0,selAction:0,selSkill:0,selTarget:0,
  actionQueue:[],animTimer:0,
  message:'',messageTimer:0,shakeTimer:0,flashTimer:0,
  inBoss:false,expAwarded:false,goldAwarded:false,
  subMode:'action' // action, skill, target, item
};

CombatSys.startRandom=function(zone){
  this.inBoss=false;
  this.enemies=[randomEnemy(zone,Game.party[0].level),randomEnemy(zone,Game.party[0].level)];
  if(Math.random()<0.3)this.enemies.push(randomEnemy(zone,Game.party[0].level));
  this.phase='start';this.selChar=0;this.selAction=0;this.selSkill=0;this.selTarget=0;
  this.subMode='action';this.actionQueue=[];this.animTimer=0;
  this.message='Enemies appeared!';this.messageTimer=90;
  this.expAwarded=false;this.goldAwarded=false;
  this.atbBars=Game.party.map(function(c){return {char:c,atb:0};});
  this.enemies.forEach(function(e,i){e.atb=0;e.idx=i;});
  this.active=true;setState('combat');
};

CombatSys.startBoss=function(type){
  this.inBoss=true;this.boss=createBoss(type);this.enemies=[];
  this.phase='start';this.selChar=0;this.selAction=0;this.selSkill=0;this.selTarget=0;
  this.subMode='action';this.actionQueue=[];this.animTimer=0;
  this.message=this.boss.name+' appears!';this.messageTimer=120;
  this.expAwarded=false;this.goldAwarded=false;
  this.atbBars=Game.party.map(function(c){return {char:c,atb:0};});
  this.boss.atb=0;SFX.bossWarn();
  this.active=true;setState('boss');
};

CombatSys.update=function(){
  if(!this.active)return;
  var self=this;
  if(this.messageTimer>0)this.messageTimer--;
  if(this.shakeTimer>0)this.shakeTimer--;
  if(this.flashTimer>0)this.flashTimer--;
  // ATB fill
  if(this.phase==='start'||this.phase==='playerTurn'){
    this.atbBars.forEach(function(ab){if(ab.char.hp>0){ab.atb+=ab.char.spd*0.02;if(ab.atb>=100)ab.atb=100;}});
  }
  if(this.inBoss&&this.boss&&this.boss.hp>0){this.boss.atb+=this.boss.spd*0.015;if(this.boss.atb>=100)this.boss.atb=100;}
  this.enemies.forEach(function(e){if(e.hp>0){e.atb+=e.spd*0.018;if(e.atb>=100)e.atb=100;}});
  var readyIdx=this.atbBars.findIndex(function(ab){return ab.atb>=100&&ab.char.hp>0;});
  if(this.phase==='start'){if(this.messageTimer<=0)this.phase='playerTurn';return;}
  if(this.phase==='playerTurn'){
    if(readyIdx<0)return;
    this.selChar=readyIdx;
    var char=this.atbBars[readyIdx].char;
    if(this.subMode==='action'){
      var actions=['Attack','Skill','Defend'];
      if(Game.inventory.some(function(i){return i.type==='consumable';}))actions.push('Item');
      if(inpCancel())return;
      if(inpInteract()){
        var act=actions[this.selAction];
        if(act==='Attack'){this.subMode='target';this.selTarget=this.firstAliveEnemy();}
        else if(act==='Defend'){this.queueAction(char,'defend',-1);this.atbBars[readyIdx].atb=0;this.subMode='action';}
        else if(act==='Skill'){this.subMode='skill';this.selSkill=0;}
        else if(act==='Item'){this.subMode='item';this.selSkill=0;}
        return;
      }
      if(KeysJust['ArrowUp']||KeysJust['KeyW']){this.selAction=Math.max(0,this.selAction-1);SFX.select();}
      if(KeysJust['ArrowDown']||KeysJust['KeyS']){this.selAction=Math.min(actions.length-1,this.selAction+1);SFX.select();}
    } else if(this.subMode==='skill'){
      if(!char.skills||char.skills.length===0){this.subMode='action';return;}
      if(inpCancel()){this.subMode='action';return;}
      if(inpInteract()){
        var sk=char.skills[this.selSkill];
        if(char.sp>=sk.cost){
          if(sk.type==='damage'){this.subMode='target';this.selTarget=this.firstAliveEnemy();}
          else if(sk.type==='heal'){this.queueAction(char,'skill',this.firstAliveParty(),sk);this.atbBars[readyIdx].atb=0;char.sp-=sk.cost;this.subMode='action';}
          else if(sk.type==='buff'){this.queueAction(char,'skill',-1,sk);this.atbBars[readyIdx].atb=0;char.sp-=sk.cost;this.subMode='action';}
          else if(sk.type==='barrier'){this.queueAction(char,'skill',this.firstAliveParty(),sk);this.atbBars[readyIdx].atb=0;char.sp-=sk.cost;this.subMode='action';}
        } else{this.message='Not enough SP!';this.messageTimer=60;}
        return;
      }
      if(KeysJust['ArrowUp']||KeysJust['KeyW']){this.selSkill=Math.max(0,this.selSkill-1);SFX.select();}
      if(KeysJust['ArrowDown']||KeysJust['KeyS']){this.selSkill=Math.min(char.skills.length-1,this.selSkill+1);SFX.select();}
    } else if(this.subMode==='target'){
      if(inpCancel()){this.subMode=(this.selAction===1)?'skill':'action';return;}
      if(inpInteract()){
        var sk2=(this.selAction===1&&char.skills)?char.skills[this.selSkill]:null;
        this.queueAction(char,(this.selAction===1)?'skill':'attack',this.selTarget,sk2);
        this.atbBars[readyIdx].atb=0;if(sk2)char.sp-=sk2.cost;
        this.subMode='action';return;
      }
      if(KeysJust['ArrowLeft']||KeysJust['KeyA']){this.selTarget=this.prevAliveEnemy();SFX.select();}
      if(KeysJust['ArrowRight']||KeysJust['KeyD']){this.selTarget=this.nextAliveEnemy();SFX.select();}
    } else if(this.subMode==='item'){
      var items=Game.inventory.filter(function(i){return i.type==='consumable';});
      if(inpCancel()){this.subMode='action';return;}
      if(inpInteract()){
        var it=items[this.selSkill];
        if(it){
          if(it.heal){this.queueAction(char,'item',this.firstAliveParty(),it);}
          else if(it.revive){var dead=Game.party.findIndex(function(c){return c.hp<=0;});if(dead>=0)this.queueAction(char,'item',dead,it);}
          this.atbBars[readyIdx].atb=0;this.subMode='action';
          var idx=Game.inventory.indexOf(it);if(idx>=0)Game.inventory.splice(idx,1);
        }
        return;
      }
      if(KeysJust['ArrowUp']||KeysJust['KeyW']){this.selSkill=Math.max(0,this.selSkill-1);SFX.select();}
      if(KeysJust['ArrowDown']||KeysJust['KeyS']){this.selSkill=Math.min(Math.max(0,items.length-1),this.selSkill+1);SFX.select();}
    }
    return;
  }
  if(this.phase==='anim'){this.animTimer--;if(this.animTimer<=0)this.processNextAction();return;}
  if(this.phase==='enemyTurn'){
    var allReady=true;
    this.enemies.forEach(function(e){
      if(e.hp>0&&e.atb>=100){
        var tgt=Math.floor(Math.random()*Game.party.length);
        while(Game.party[tgt].hp<=0)tgt=(tgt+1)%Game.party.length;
        self.execAttack(e,Game.party[tgt],'enemy',tgt);e.atb=0;allReady=false;
      }
    });
    if(this.inBoss&&this.boss&&this.boss.hp>0&&this.boss.atb>=100){this.doBossTurn();allReady=false;}
    if(allReady){
      if(this.enemies.every(function(e){return e.hp<=0;})&&(!this.inBoss||this.boss.hp<=0)){
        this.phase='victory';this.message='Victory!';this.messageTimer=120;SFX.victory();
        if(!this.expAwarded){this.expAwarded=true;
          var totalXP=this.enemies.reduce(function(s,e){return s+e.xp;},0);
          if(this.inBoss)totalXP+=this.boss.xp;
          Game.party.forEach(function(c){if(c.hp>0)gainXP(c,Math.floor(totalXP/Game.party.length));});
        }
        if(!this.goldAwarded){this.goldAwarded=true;
          var totalG=this.enemies.reduce(function(s,e){return s+e.gold;},0);
          if(this.inBoss)totalG+=this.boss.gold;
          Game.gold+=totalG;this.message+=' +'+totalG+'g';
        }
      } else if(Game.party.every(function(c){return c.hp<=0;})){
        this.phase='defeat';this.message='Defeat...';this.messageTimer=180;SFX.defeat();
      } else {this.phase='playerTurn';this.selAction=0;this.subMode='action';}
    }
    return;
  }
  if(this.phase==='victory'){
    if(this.messageTimer<=0){
      if(this.inBoss&&this.boss.defeated===false){
        this.boss.defeated=true;
        Game.inventory.push({name:'Crown Shard',type:'material',rarity:'Legendary',level:1,id:'shard_'+this.boss.type});
        if(this.boss.type==='void_sentinel'&&Game.party[0].evolution<1){
          Game.party[0].evolution=1;Game.party[0].evolutionName='Crown Bearer';
          Game.party[0].skills.push({name:'Stellar Command',cost:12,type:'buff',stat:'all',power:1.3});
          SFX.evo();startEvolution();return;
        } else if(this.boss.type==='frozen_matriarch'&&Game.party[0].evolution<2){
          Game.party[0].evolution=2;Game.party[0].evolutionName='Starforged';
          Game.party[0].skills.push({name:'Nova Burst',cost:20,type:'damage',element:'light',power:3.0,aoe:true});
          SFX.evo();startEvolution();return;
        }
      }
      this.active=false;setState('overworld');
    }
    return;
  }
  if(this.phase==='defeat'){
    if(this.messageTimer<=0){
      Game.party.forEach(function(c){c.hp=Math.floor(c.maxHp*0.3);c.sp=Math.floor(c.maxSp*0.5);});
      this.active=false;setState('town');
    }
  }
};

CombatSys.firstAliveEnemy=function(){
  if(this.inBoss&&this.boss&&this.boss.hp>0)return -99;
  return this.enemies.findIndex(function(e){return e.hp>0;});
};
CombatSys.nextAliveEnemy=function(){
  var start=this.selTarget<0?0:this.selTarget;
  for(var i=0;i<this.enemies.length;i++){var idx=(start+i+1)%this.enemies.length;if(this.enemies[idx].hp>0)return idx;}
  return this.firstAliveEnemy();
};
CombatSys.prevAliveEnemy=function(){
  var start=this.selTarget<0?0:this.selTarget;
  for(var i=0;i<this.enemies.length;i++){var idx=(start-i-1+this.enemies.length)%this.enemies.length;if(this.enemies[idx].hp>0)return idx;}
  return this.firstAliveEnemy();
};
CombatSys.firstAliveParty=function(){return Game.party.findIndex(function(c){return c.hp>0;});};

CombatSys.queueAction=function(char,type,target,extra){
  this.actionQueue.push({char:char,type:type,target:target,extra:extra});
  if(this.phase==='playerTurn'){this.phase='anim';this.animTimer=30;this.processNextAction();}
};

CombatSys.processNextAction=function(){
  if(this.actionQueue.length===0){
    var er=this.enemies.some(function(e){return e.hp>0&&e.atb>=100;});
    var br=this.inBoss&&this.boss&&this.boss.hp>0&&this.boss.atb>=100;
    if(er||br)this.phase='enemyTurn';
    else{this.phase='playerTurn';this.selAction=0;this.subMode='action';}
    return;
  }
  var act=this.actionQueue.shift();
  if(act.type==='attack'){
    var tgt=act.target===-99?this.boss:this.enemies[act.target];
    if(tgt)this.execAttack(act.char,tgt,'party',act.target);
  } else if(act.type==='skill'){
    var sk=act.extra;
    if(sk.type==='damage'){var st=act.target===-99?this.boss:this.enemies[act.target];if(st)this.execSkill(act.char,st,sk,'party');}
    else if(sk.type==='heal'){if(act.target>=0&&act.target<Game.party.length)this.execHeal(act.char,Game.party[act.target],sk);}
    else if(sk.type==='buff'){this.execBuff(act.char,sk);}
    else if(sk.type==='barrier'){var bt=act.target>=0&&act.target<Game.party.length?Game.party[act.target]:act.char;bt.barrier=(bt.barrier||0)+sk.power;this.message=bt.name+' gains a barrier!';this.messageTimer=45;SFX.heal();}
  } else if(act.type==='defend'){act.char.defending=true;this.message=act.char.name+' is defending!';this.messageTimer=45;}
  else if(act.type==='item'){
    var it=act.extra;
    if(it&&it.heal&&act.target>=0&&act.target<Game.party.length){Game.party[act.target].hp=Math.min(Game.party[act.target].maxHp,Game.party[act.target].hp+it.heal);SFX.heal();this.message=Game.party[act.target].name+' recovered '+it.heal+' HP!';this.messageTimer=45;}
    else if(it&&it.revive&&act.target>=0&&act.target<Game.party.length&&Game.party[act.target].hp<=0){Game.party[act.target].hp=Math.floor(Game.party[act.target].maxHp*0.3);SFX.heal();this.message=Game.party[act.target].name+' revived!';this.messageTimer=45;}
  }
};

CombatSys.execAttack=function(attacker,target,attType,tgtIdx){
  var stats=getStats(attacker);
  var dmg=Math.max(1,stats.atk-Math.floor((target.def||0)*0.5));
  if(Math.random()*100<stats.crit)dmg=Math.floor(dmg*1.5);
  if(stats.lightAtk&&target.weak&&target.weak.indexOf('light')>=0)dmg=Math.floor(dmg*1.5);
  if(target.resist&&target.resist.indexOf('dark')>=0&&attType==='enemy')dmg=Math.floor(dmg*0.7);
  if(target.defending){dmg=Math.floor(dmg*0.5);target.defending=false;}
  if(target.barrier){var absorbed=Math.min(target.barrier,dmg);target.barrier-=absorbed;dmg-=absorbed;if(target.barrier<=0)target.barrier=0;}
  dmg=Math.max(1,dmg+Math.floor(Math.random()*4-2));
  target.hp=Math.max(0,target.hp-dmg);
  SFX.hit();this.shakeTimer=8;this.flashTimer=4;
  this.message=attacker.name+' deals '+dmg+' damage!';this.messageTimer=45;
  if(target.hp<=0)this.message=target.name+' was defeated!';
};

CombatSys.execSkill=function(attacker,target,skill,attType){
  var stats=getStats(attacker);
  var dmg=Math.floor(stats.atk*skill.power);
  if(skill.critBonus&&Math.random()*100<stats.crit+skill.critBonus)dmg=Math.floor(dmg*1.5);
  if(skill.element==='light'&&target.weak&&target.weak.indexOf('light')>=0)dmg=Math.floor(dmg*1.5);
  if(skill.element==='fire'&&target.weak&&target.weak.indexOf('fire')>=0)dmg=Math.floor(dmg*1.5);
  if(target.defending){dmg=Math.floor(dmg*0.5);target.defending=false;}
  if(skill.hits)dmg=Math.floor(dmg*skill.hits);
  dmg=Math.max(1,dmg);
  target.hp=Math.max(0,target.hp-dmg);
  SFX.hit();this.shakeTimer=10;this.flashTimer=6;
  this.message=attacker.name+' uses '+skill.name+'! '+dmg+' dmg!';this.messageTimer=60;
};

CombatSys.execHeal=function(attacker,target,skill){
  var heal=skill.power;
  target.hp=Math.min(target.maxHp,target.hp+heal);
  SFX.heal();this.message=target.name+' recovered '+heal+' HP!';this.messageTimer=45;
};

CombatSys.execBuff=function(attacker,skill){
  this.message=attacker.name+' uses '+skill.name+'!';this.messageTimer=60;SFX.confirm();
};

CombatSys.doBossTurn=function(){
  var boss=this.boss,hpPct=boss.hp/boss.maxHp;
  if(hpPct<=0.5&&boss.phase===1){boss.phase=2;this.message=boss.name+' powers up!';this.messageTimer=90;SFX.bossWarn();}
  if(hpPct<=0.1&&!boss.enraged){boss.enraged=true;boss.atk=Math.floor(boss.atk*1.25);this.message=boss.name+' enrages!';this.messageTimer=60;}
  var roll=Math.random(),tgt=Math.floor(Math.random()*Game.party.length);
  while(Game.party[tgt].hp<=0)tgt=(tgt+1)%Game.party.length;
  if(boss.type==='void_sentinel'){
    if(boss.phase===1){
      if(roll<0.5){this.execAttack(boss,Game.party[tgt],'enemy',tgt);}
      else if(roll<0.8){var self=this;Game.party.forEach(function(c){if(c.hp>0){var d=Math.max(1,boss.atk-Math.floor(c.def*0.3));if(c.defending){d=Math.floor(d*0.5);c.defending=false;}c.hp=Math.max(0,c.hp-d);}});SFX.hit();this.shakeTimer=12;this.message='Dark Pulse!';this.messageTimer=60;}
      else{if(this.enemies.length<2){var m=createEnemy('Void Shade',Game.party[0].level);if(m){m.hp=Math.floor(m.hp*0.5);m.maxHp=m.hp;this.enemies.push(m);}this.message='Kael summons a Void Shade!';this.messageTimer=60;}}
    } else {
      if(roll<0.3){this.execAttack(boss,Game.party[tgt],'enemy',tgt);}
      else if(roll<0.6){var self2=this;Game.party.forEach(function(c){if(c.hp>0){var d=Math.max(1,Math.floor(boss.atk*1.2)-Math.floor(c.def*0.3));if(c.defending){d=Math.floor(d*0.5);c.defending=false;}c.hp=Math.max(0,c.hp-d);}});SFX.hit();this.shakeTimer=15;this.message='Annihilation Wave!';this.messageTimer=60;}
      else{var d2=Math.max(1,Math.floor(boss.atk*2)-Math.floor(Game.party[tgt].def*0.5));if(Game.party[tgt].defending){d2=Math.floor(d2*0.5);Game.party[tgt].defending=false;}Game.party[tgt].hp=Math.max(0,Game.party[tgt].hp-d2);SFX.hit();this.shakeTimer=15;this.flashTimer=8;this.message='Void Slash! '+d2+' to '+Game.party[tgt].name+'!';this.messageTimer=60;}
    }
  } else if(boss.type==='frozen_matriarch'){
    if(boss.phase===1){
      if(roll<0.5){this.execAttack(boss,Game.party[tgt],'enemy',tgt);}
      else if(roll<0.75){var self3=this;Game.party.forEach(function(c){if(c.hp>0){var d=Math.max(1,Math.floor(boss.atk*0.8)-Math.floor(c.def*0.2));c.hp=Math.max(0,c.hp-d);}});SFX.hit();this.shakeTimer=10;this.message='Blizzard!';this.messageTimer=60;}
      else{if(this.enemies.length<2){var m2=createEnemy('Frost Wraith',Game.party[0].level);if(m2){this.enemies.push(m2);}this.message='Yrtha summons a Frost Wraith!';this.messageTimer=60;}}
    } else {
      if(roll<0.3){this.execAttack(boss,Game.party[tgt],'enemy',tgt);}
      else if(roll<0.6){var self4=this;Game.party.forEach(function(c){if(c.hp>0){var d=Math.max(1,Math.floor(boss.atk*1.5)-Math.floor(c.def*0.3));if(c.defending){d=Math.floor(d*0.5);c.defending=false;}c.hp=Math.max(0,c.hp-d);}});SFX.hit();this.shakeTimer=15;this.message='Absolute Zero!';this.messageTimer=60;}
      else{var d3=Math.max(1,Math.floor(boss.atk*2.5)-Math.floor(Game.party[tgt].def*0.5));Game.party[tgt].hp=Math.max(0,Game.party[tgt].hp-d3);SFX.hit();this.shakeTimer=15;this.flashTimer=8;this.message='Glacial Spike! '+d3+' to '+Game.party[tgt].name+'!';this.messageTimer=60;}
    }
  }
  boss.atb=0;
};

// ─── COMBAT RENDERING ───────────────────────────────────────
CombatSys.render=function(){
  if(!this.active)return;
  // Background
  if(this.inBoss){ctx.fillStyle='#0a0a2a';ctx.fillRect(0,0,E.VIEW_W,E.VIEW_H);ctx.fillStyle='#1a1a3a';ctx.fillRect(0,E.VIEW_H-100,E.VIEW_W,100);}
  else{ctx.fillStyle='#1a2a1a';ctx.fillRect(0,0,E.VIEW_W,E.VIEW_H);ctx.fillStyle='#2a3a2a';ctx.fillRect(0,E.VIEW_H-100,E.VIEW_W,100);}
  // Enemies
  var esp=E.VIEW_W/(this.enemies.length+1);
  this.enemies.forEach(function(e,i){
    if(e.hp>0){
      var ex=esp*(i+1),ey=E.VIEW_H-140;
      ctx.fillStyle='#6633aa';ctx.fillRect(ex-12,ey-24,24,36);
      ctx.fillStyle='#9944cc';ctx.fillRect(ex-9,ey-21,18,30);
      ctx.fillStyle='#ff4444';ctx.fillRect(ex-6,ey-15,4,4);ctx.fillRect(ex+2,ey-15,4,4);
      uiCtx.fillStyle='#ff6688';uiCtx.font='10px monospace';uiCtx.fillText(e.name,ex-24,ey+14);
      uiCtx.fillStyle='#333';uiCtx.fillRect(ex-24,ey+16,48,4);
      uiCtx.fillStyle='#ff3344';uiCtx.fillRect(ex-24,ey+16,Math.max(0,48*(e.hp/e.maxHp)),4);
    }
  });
  // Boss
  if(this.inBoss&&this.boss&&this.boss.hp>0){
    var bx=E.VIEW_W/2,by=E.VIEW_H-150;
    var bs=this.boss.phase===2?1.3:1;
    ctx.fillStyle='#220044';ctx.fillRect(bx-16*bs,by-32*bs,32*bs,48*bs);
    ctx.fillStyle='#440088';ctx.fillRect(bx-12*bs,by-28*bs,24*bs,40*bs);
    ctx.fillStyle='#ff0044';ctx.fillRect(bx-8*bs,by-20*bs,6*bs,6*bs);ctx.fillRect(bx+2*bs,by-20*bs,6*bs,6*bs);
    ctx.fillStyle='#ffaa00';ctx.fillRect(bx-2*bs,by-36*bs,4*bs,6*bs);
    uiCtx.fillStyle='#ff4466';uiCtx.font='12px monospace';uiCtx.fillText(this.boss.name,bx-60,by+22);
    uiCtx.fillStyle='#333';uiCtx.fillRect(bx-60,by+26,120,6);
    uiCtx.fillStyle=this.boss.phase===2?'#ff0044':'#aa0044';uiCtx.fillRect(bx-60,by+26,Math.max(0,120*(this.boss.hp/this.boss.maxHp)),6);
    if(this.boss.enraged){uiCtx.fillStyle='#ff0000';uiCtx.font='10px monospace';uiCtx.fillText('ENRAGED',bx-24,by+42);}
  }
  // Party
  var partyY=E.VIEW_H-70;
  Game.party.forEach(function(c,i){
    var px=30+i*100;
    if(c.hp>0){
      drawChar(px,partyY,0,0,c.species,c.hairColor,c.eyeColor,c.skinColor,c.outfitColor);
      uiCtx.fillStyle='#44ddff';uiCtx.font='10px monospace';uiCtx.fillText(c.name,px-16,partyY+18);
      uiCtx.fillStyle='#333';uiCtx.fillRect(px-16,partyY+22,50,4);
      uiCtx.fillStyle=c.hp>c.maxHp*0.3?'#33cc66':'#ff3344';uiCtx.fillRect(px-16,partyY+22,Math.max(0,50*(c.hp/c.maxHp)),4);
      uiCtx.fillStyle='#333';uiCtx.fillRect(px-16,partyY+28,50,3);
      uiCtx.fillStyle='#4488ff';uiCtx.fillRect(px-16,partyY+28,Math.max(0,50*(c.sp/c.maxSp)),3);
      var ab=this.atbBars[i];
      if(ab){uiCtx.fillStyle='#333';uiCtx.fillRect(px-16,partyY+33,50,3);uiCtx.fillStyle='#ffcc33';uiCtx.fillRect(px-16,partyY+33,Math.max(0,50*(ab.atb/100)),3);}
      if(this.phase==='playerTurn'&&this.selChar===i&&Math.floor(Game.time/15)%2){uiCtx.fillStyle='#ffcc33';uiCtx.fillText('▲',px-4,partyY-14);}
    } else {
      uiCtx.fillStyle='#666';uiCtx.font='10px monospace';uiCtx.fillText(c.name+' (KO)',px-20,partyY+18);
    }
  }.bind(this));
  // Action menu
  if(this.phase==='playerTurn'){
    var char=this.atbBars[this.selChar];
    if(char&&char.atb>=100){
      var actions=['Attack','Skill','Defend','Item'];
      if(!Game.inventory.some(function(i){return i.type==='consumable';}))actions.pop();
      var mx=E.VIEW_W-120,my=8;
      uiCtx.fillStyle='rgba(10,10,30,0.9)';uiCtx.fillRect(mx-4,my-4,116,actions.length*18+8);
      uiCtx.strokeStyle='#4488ff';uiCtx.lineWidth=1;uiCtx.strokeRect(mx-4,my-4,116,actions.length*18+8);
      var charName=char.char.name;
      uiCtx.fillStyle='#44ddff';uiCtx.font='10px monospace';uiCtx.fillText(charName,mx+4,my+10);
      var self=this;
      actions.forEach(function(a,i){
        var ay=my+16+i*18;
        if((self.subMode==='action'&&i===self.selAction)||(self.subMode==='skill'&&i===1)||(self.subMode==='target'&&i===0)||(self.subMode==='item'&&i===3)){
          uiCtx.fillStyle='#4488ff';uiCtx.fillRect(mx+2,ay-2,108,16);uiCtx.fillStyle='#fff';
        } else uiCtx.fillStyle='#aaa';
        uiCtx.font='10px monospace';uiCtx.fillText(a,mx+8,ay+10);
      });
      // Skill name display
      if(this.subMode==='skill'&&char.char.skills&&char.char.skills[this.selSkill]){
        var sk=char.char.skills[this.selSkill];
        uiCtx.fillStyle='#ffcc33';uiCtx.font='9px monospace';uiCtx.fillText(sk.name+' ('+sk.cost+' SP)',mx+4,my+16+actions.length*18+4);
      }
      // Item name display
      if(this.subMode==='item'){
        var items=Game.inventory.filter(function(i){return i.type==='consumable';});
        if(items[this.selSkill]){
          var it=items[this.selSkill];
          uiCtx.fillStyle='#ffcc33';uiCtx.font='9px monospace';uiCtx.fillText(it.name,mx+4,my+16+actions.length*18+4);
        }
      }
    }
  }
  // Target indicator
  if(this.subMode==='target'&&this.enemies[this.selTarget]&&this.enemies[this.selTarget].hp>0){
    var te=this.enemies[this.selTarget];
    var teidx=this.selTarget;
    var tex=esp*(teidx+1),tey=E.VIEW_H-140;
    if(Math.floor(Game.time/10)%2){uiCtx.strokeStyle='#ff4444';uiCtx.lineWidth=2;uiCtx.strokeRect(tex-14,tey-26,28,40);}
  }
  // Message
  if(this.message&&this.messageTimer>0){
    uiCtx.fillStyle='rgba(10,10,30,0.85)';uiCtx.fillRect(10,E.VIEW_H/2-12,E.VIEW_W-20,28);
    uiCtx.strokeStyle='#ffcc33';uiCtx.lineWidth=1;uiCtx.strokeRect(10,E.VIEW_H/2-12,E.VIEW_W-20,28);
    uiCtx.fillStyle='#fff';uiCtx.font='12px monospace';uiCtx.textAlign='center';uiCtx.fillText(this.message,E.VIEW_W/2,E.VIEW_H/2+4);uiCtx.textAlign='left';
  }
  // Flash
  if(this.flashTimer>0){uiCtx.fillStyle='rgba(255,255,255,'+(this.flashTimer/8)+')';uiCtx.fillRect(0,0,E.VIEW_W,E.VIEW_H);}
};
