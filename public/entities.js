// entities.js — Characters, enemies, bosses, items
var Items={
  create:function(type,rarity,level){
    var tm={
      'Plasma Blade':{type:'weapon',rarity:'Common',atk:5},
      'Void Saber':{type:'weapon',rarity:'Uncommon',atk:12},
      'Starsteel Katana':{type:'weapon',rarity:'Rare',atk:22},
      'Crown\'s Edge':{type:'weapon',rarity:'Legendary',atk:40},
      'Scrap Pistol':{type:'weapon',rarity:'Common',atk:4},
      'Pulse Rifle':{type:'weapon',rarity:'Uncommon',atk:10},
      'Nova Cannon':{type:'weapon',rarity:'Rare',atk:20},
      'Cloth Tunic':{type:'armor',rarity:'Common',def:3,hp:10},
      'Voidweave Vest':{type:'armor',rarity:'Uncommon',def:8,hp:20},
      'Starsteel Plate':{type:'armor',rarity:'Rare',def:18,hp:40},
      'Crown\'s Aegis':{type:'armor',rarity:'Legendary',def:35,hp:80},
      'Lucky Charm':{type:'accessory',rarity:'Uncommon',crit:5},
      'Void Ring':{type:'accessory',rarity:'Rare',darkRes:20,atk:5},
      'Stellar Pendant':{type:'accessory',rarity:'Rare',lightRes:20,hp:15},
      'Scrap Metal':{type:'material',rarity:'Common'},
      'Bio Gel':{type:'material',rarity:'Common'},
      'Void Essence':{type:'material',rarity:'Uncommon'},
      'Stellar Crystal':{type:'material',rarity:'Rare'},
      'Dragon Scale':{type:'material',rarity:'Rare'},
      'Nano Patch':{type:'consumable',rarity:'Common',heal:30},
      'Stim Pack':{type:'consumable',rarity:'Uncommon',heal:80},
      'Revival Kit':{type:'consumable',rarity:'Rare',revive:true}
    };
    var matching=Object.entries(tm).filter(function(e){return e[1].type===type&&e[1].rarity===rarity;});
    if(matching.length===0)matching=Object.entries(tm).filter(function(e){return e[1].type===type;});
    if(matching.length===0)return null;
    var pick=matching[Math.floor(Math.random()*matching.length)];
    var s=1+(level-1)*0.15,item={name:pick[0],type:pick[1].type,rarity:pick[1].rarity,level:level||1,id:Math.random().toString(36).substr(2,9)};
    if(pick[1].atk)item.atk=Math.floor(pick[1].atk*s);
    if(pick[1].def)item.def=Math.floor(pick[1].def*s);
    if(pick[1].hp)item.hp=Math.floor(pick[1].hp*s);
    if(pick[1].crit)item.crit=pick[1].crit;
    if(pick[1].heal)item.heal=pick[1].heal;
    if(pick[1].revive)item.revive=true;
    if(pick[1].darkRes)item.darkRes=pick[1].darkRes;
    if(pick[1].lightRes)item.lightRes=pick[1].lightRes;
    return item;
  },
  rarityColor:function(r){return{r:'#aaa',g:'#3c3',b:'#48f',p:'#a4f',y:'#fa0',f:'#f4f'}[r[0]]||'#aaa';}
};

function createLyra(){
  return {name:'Lyra',species:'human',role:'protagonist',level:1,xp:0,xpToLevel:100,
    hp:80,maxHp:80,sp:20,maxSp:20,atk:12,def:8,spd:10,crit:5,
    lightAtk:0,darkAtk:0,fireAtk:0,iceAtk:0,lightningAtk:0,
    lightRes:10,darkRes:0,fireRes:0,iceRes:0,lightningRes:0,
    equipment:{weapon:null,armor:null,accessory1:null,accessory2:null,implant:null},
    skills:[{name:'Stellar Slash',cost:5,type:'damage',element:'light',power:1.5},
            {name:'Crown Blessing',cost:8,type:'heal',power:40}],
    evolution:0,evolutionName:'Princess',
    hairColor:'#ffdd44',eyeColor:'#44ddff',skinColor:'#ffccaa',outfitColor:'#aa44ff'};
}
function createErynn(){
  return {name:'Erynn',species:'cat',role:'scout',level:1,xp:0,xpToLevel:100,
    hp:60,maxHp:60,sp:30,maxSp:30,atk:15,def:5,spd:18,crit:20,
    lightAtk:0,darkAtk:0,fireAtk:0,iceAtk:0,lightningAtk:0,
    lightRes:0,darkRes:10,fireRes:0,iceRes:0,lightningRes:0,
    equipment:{weapon:null,armor:null,accessory1:null,accessory2:null,implant:null},
    skills:[{name:'Shadow Pounce',cost:8,type:'damage',element:'physical',power:2.0,critBonus:30},
            {name:'Claw Storm',cost:6,type:'damage',element:'physical',power:1.2,hits:3}],
    evolution:0,evolutionName:'Felidae Scout',
    hairColor:'#cc8833',eyeColor:'#44ff44',skinColor:'#ffccaa',outfitColor:'#aa44ff'};
}
function createBrimble(){
  return {name:'Brimble',species:'frog',role:'tank',level:1,xp:0,xpToLevel:100,
    hp:120,maxHp:120,sp:25,maxSp:25,atk:8,def:15,spd:6,crit:3,
    lightAtk:0,darkAtk:0,fireAtk:0,iceAtk:0,lightningAtk:0,
    lightRes:0,darkRes:0,fireRes:0,iceRes:20,lightningRes:-10,
    equipment:{weapon:null,armor:null,accessory1:null,accessory2:null,implant:null},
    skills:[{name:'Tidal Shield',cost:10,type:'barrier',power:50},
            {name:'Healing Rain',cost:8,type:'heal',power:35,aoe:true}],
    evolution:0,evolutionName:'Anura Guardian',
    hairColor:null,eyeColor:'#44ff44',skinColor:'#44aa66',outfitColor:'#116633'};
}
function createDrakkor(){
  return {name:'Drakkor',species:'dragon',role:'heavy',level:1,xp:0,xpToLevel:100,
    hp:100,maxHp:100,sp:20,maxSp:20,atk:18,def:12,spd:8,crit:8,
    lightAtk:0,darkAtk:0,fireAtk:15,iceAtk:0,lightningAtk:0,
    lightRes:0,darkRes:0,fireRes:25,iceRes:-15,lightningRes:0,
    equipment:{weapon:null,armor:null,accessory1:null,accessory2:null,implant:null},
    skills:[{name:'Inferno Breath',cost:10,type:'damage',element:'fire',power:1.8,aoe:true,burn:true},
            {name:'Tail Sweep',cost:6,type:'damage',element:'physical',power:1.3,aoe:true}],
    evolution:0,evolutionName:'Drakonid Warrior',
    hairColor:null,eyeColor:'#ffaa00',skinColor:'#cc3333',outfitColor:'#881122'};
}
function createPip(){
  return {name:'Pip',species:'robot',role:'support',level:1,xp:0,xpToLevel:100,
    hp:50,maxHp:50,sp:40,maxSp:40,atk:6,def:10,spd:12,crit:5,
    lightAtk:0,darkAtk:0,fireAtk:0,iceAtk:0,lightningAtk:10,
    lightRes:15,darkRes:15,fireRes:15,iceRes:15,lightningRes:15,
    equipment:{weapon:null,armor:null,accessory1:null,accessory2:null,implant:null},
    skills:[{name:'Nano Swarm',cost:8,type:'heal',power:25,aoe:true,dot:true},
            {name:'Overclock',cost:6,type:'buff',stat:'spd',power:1.5}],
    evolution:0,evolutionName:'Omega Drone',
    hairColor:null,eyeColor:null,skinColor:'#8899aa',outfitColor:'#778899'};
}

function getStats(c){
  var s={atk:c.atk,def:c.def,spd:c.spd,crit:c.crit,hp:c.maxHp,
    lightAtk:c.lightAtk||0,darkAtk:c.darkAtk||0,fireAtk:c.fireAtk||0,iceAtk:c.iceAtk||0,
    lightRes:c.lightRes||0,darkRes:c.darkRes||0,fireRes:c.fireRes||0,iceRes:c.iceRes||0};
  ['weapon','armor','accessory1','accessory2','implant'].forEach(function(sl){
    var it=c.equipment[sl];
    if(it){if(it.atk)s.atk+=it.atk;if(it.def)s.def+=it.def;if(it.hp)s.hp+=it.hp;if(it.crit)s.crit+=it.crit;
      if(it.lightAtk)s.lightAtk+=it.lightAtk;if(it.darkAtk)s.darkAtk+=it.darkAtk;
      if(it.lightRes)s.lightRes+=it.lightRes;if(it.darkRes)s.darkRes+=it.darkRes;}
  });
  return s;
}

function gainXP(c,amt){
  c.xp+=amt;
  while(c.xp>=c.xpToLevel){
    c.xp-=c.xpToLevel;c.level++;c.xpToLevel=Math.floor(c.xpToLevel*1.5);
    c.maxHp+=8+c.level*2;c.hp=c.maxHp;c.maxSp+=3;c.sp=c.maxSp;
    c.atk+=2;c.def+=1;c.spd+=1;
    SFX.lvUp();
  }
}

var EnemyTemplates={
  'Void Shade':{hp:30,atk:8,def:3,spd:8,xp:15,gold:10,weak:['light'],resist:['dark'],zone:'void'},
  'Void Crawler':{hp:45,atk:10,def:6,spd:5,xp:20,gold:15,weak:['fire'],resist:['dark'],zone:'void'},
  'Void Knight':{hp:70,atk:14,def:10,spd:7,xp:35,gold:25,weak:['light'],resist:['dark','physical'],zone:'void'},
  'Void Wisp':{hp:20,atk:12,def:2,spd:15,xp:18,gold:12,weak:['light','fire'],resist:['dark','ice'],zone:'void'},
  'Frost Wraith':{hp:40,atk:10,def:5,spd:12,xp:25,gold:18,weak:['fire'],resist:['ice'],zone:'ice'},
  'Ice Golem':{hp:80,atk:12,def:15,spd:4,xp:40,gold:30,weak:['fire'],resist:['ice','physical'],zone:'ice'},
  'Frozen Stalker':{hp:35,atk:14,def:4,spd:16,xp:28,gold:20,weak:['fire'],resist:['ice'],zone:'ice'},
  'Blizzard Elemental':{hp:55,atk:16,def:8,spd:10,xp:45,gold:35,weak:['fire'],resist:['ice','lightning'],zone:'ice'}
};
function createEnemy(name,level){
  var t=EnemyTemplates[name];if(!t)return null;
  var s=1+(level-1)*0.2;
  return {name:name,level:level,hp:Math.floor(t.hp*s),maxHp:Math.floor(t.hp*s),
    atk:Math.floor(t.atk*s),def:Math.floor(t.def*s),spd:Math.floor(t.spd*s),
    xp:Math.floor(t.xp*s),gold:Math.floor(t.gold*s),weak:t.weak,resist:t.resist,atb:0};
}
function randomEnemy(zone,level){
  var matching=Object.entries(EnemyTemplates).filter(function(e){return e[1].zone===zone;});
  if(matching.length===0)matching=Object.entries(EnemyTemplates);
  return createEnemy(matching[Math.floor(Math.random()*matching.length)][0],level);
}
function createBoss(type){
  if(type==='void_sentinel') return {name:'Void Sentinel Kael',phase:1,hp:300,maxHp:300,atk:18,def:12,spd:10,xp:200,gold:500,weak:['light'],resist:['dark','physical'],atb:0,enraged:false,defeated:false,type:type};
  if(type==='frozen_matriarch') return {name:'Frozen Matriarch Yrtha',phase:1,hp:400,maxHp:400,atk:16,def:15,spd:8,xp:350,gold:800,weak:['fire'],resist:['ice','lightning'],atb:0,enraged:false,defeated:false,type:type};
  return null;
}
