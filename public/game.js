// ═══════════════════════════════════════════════════════════════
// STELLAR PRINCESSES — SCI-FI RPG v1.2
// Web-based 2D pixel RPG with controller support
// ═══════════════════════════════════════════════════════════════
(function(){
'use strict';

// ─── CONSTANTS ──────────────────────────────────────────────
var TILE=16, VIEW_W=320, VIEW_H=224, SCALE=3, FPS=60;
var T={FLOOR:0,WALL:1,DOOR:2,WATER:3,BRIDGE:4,GRASS:5,PATH:6,COUNTER:7,SHELF:8,PLANT:9,SIGN:10,CHEST:11,GATE:12,PORTAL:13,BED:14,TABLE:15,BAR:16,STAIRS:17,VOID:18};

// ─── CANVAS ─────────────────────────────────────────────────
var canvas=document.getElementById('game-layer');
var ctx=canvas.getContext('2d');
var uiCanvas=document.getElementById('ui-layer');
var uiCtx=uiCanvas.getContext('2d');
var controllerStatus=document.getElementById('controller-status');
canvas.width=VIEW_W;canvas.height=VIEW_H;
uiCanvas.width=VIEW_W;uiCanvas.height=VIEW_H;
ctx.imageSmoothingEnabled=false;
uiCtx.imageSmoothingEnabled=false;
canvas.style.width=(VIEW_W*SCALE)+'px';canvas.style.height=(VIEW_H*SCALE)+'px';
uiCanvas.style.width=(VIEW_W*SCALE)+'px';uiCanvas.style.height=(VIEW_H*SCALE)+'px';

// ─── AUDIO ──────────────────────────────────────────────────
var AudioCtx=null;
try{AudioCtx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}
function playTone(freq,dur,type,vol){
  if(!AudioCtx)return;
  var o=AudioCtx.createOscillator(),g=AudioCtx.createGain();
  o.type=type||'square';o.frequency.setValueAtTime(freq,AudioCtx.currentTime);
  g.gain.setValueAtTime(vol||0.1,AudioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001,AudioCtx.currentTime+dur);
  o.connect(g);g.connect(AudioCtx.destination);o.start();o.stop(AudioCtx.currentTime+dur);
}
function playNoise(dur,vol){
  if(!AudioCtx)return;
  var bs=AudioCtx.sampleRate*dur,b=AudioCtx.createBuffer(1,bs,AudioCtx.sampleRate),d=b.getChannelData(0);
  for(var i=0;i<bs;i++)d[i]=Math.random()*2-1;
  var s=AudioCtx.createBufferSource(),g=AudioCtx.createGain();
  s.buffer=b;g.gain.setValueAtTime(vol||0.05,AudioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001,AudioCtx.currentTime+dur);
  s.connect(g);g.connect(AudioCtx.destination);s.start();
}
var SFX={
  step:function(){playTone(200,0.05,'square',0.03);},
  select:function(){playTone(600,0.08,'square',0.06);},
  confirm:function(){playTone(800,0.1,'square',0.06);playTone(1000,0.1,'square',0.04);},
  cancel:function(){playTone(400,0.1,'square',0.05);},
  talk:function(){playTone(500,0.05,'triangle',0.04);},
  shop:function(){playTone(700,0.08,'square',0.05);playTone(900,0.08,'square',0.04);playTone(1100,0.1,'square',0.03);},
  hit:function(){playNoise(0.1,0.08);playTone(150,0.1,'sawtooth',0.06);},
  heal:function(){playTone(400,0.15,'sine',0.06);playTone(600,0.15,'sine',0.05);playTone(800,0.2,'sine',0.04);},
  lvUp:function(){[523,659,784,1047].forEach(function(f,i){setTimeout(function(){playTone(f,0.2,'square',0.06);},i*100);});},
  evo:function(){[262,330,392,523,659,784,1047,1319].forEach(function(f,i){setTimeout(function(){playTone(f,0.3,'sine',0.08);},i*120);});},
  bossWarn:function(){playTone(100,0.5,'sawtooth',0.1);},
  victory:function(){[523,659,784,1047,784,1047,1319].forEach(function(f,i){setTimeout(function(){playTone(f,0.25,'square',0.07);},i*150);});},
  defeat:function(){[400,350,300,250,200].forEach(function(f,i){setTimeout(function(){playTone(f,0.3,'sawtooth',0.06);},i*200);});}
};

// ─── INPUT ──────────────────────────────────────────────────
var Keys={},KeysJust={},GpButtons={},GpButtonsJust={},GpConnected=false;
window.addEventListener('keydown',function(e){
  if(!Keys[e.code])KeysJust[e.code]=true;Keys[e.code]=true;
  if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Tab'].indexOf(e.code)>=0)e.preventDefault();
});
window.addEventListener('keyup',function(e){Keys[e.code]=false;});
window.addEventListener('gamepadconnected',function(e){
  GpConnected=true;controllerStatus.textContent='🎮 Controller: Connected';controllerStatus.style.color='#4f4';
});
window.addEventListener('gamepaddisconnected',function(e){
  GpConnected=false;controllerStatus.textContent='🎮 Controller: Disconnected';controllerStatus.style.color='#4af';
});
function pollGamepad(){
  var gps=navigator.getGamepads?navigator.getGamepads():[];
  for(var i=0;i<gps.length;i++){
    var g=gps[i];if(!g)continue;
    GpConnected=true;controllerStatus.textContent='🎮 Controller: Connected';controllerStatus.style.color='#4f4';
    g.buttons.forEach(function(btn,idx){
      if(btn.pressed&&!GpButtons[idx])GpButtonsJust[idx]=true;GpButtons[idx]=btn.pressed;
    });return g;
  }return null;
}
function dx(){
  var d=0,g=pollGamepad();
  if(Keys['KeyA']||Keys['ArrowLeft']||(g&&g.axes[0]<-0.5))d--;
  if(Keys['KeyD']||Keys['ArrowRight']||(g&&g.axes[0]>0.5))d++;
  return d;
}
function dy(){
  var d=0,g=pollGamepad();
  if(Keys['KeyW']||Keys['ArrowUp']||(g&&g.axes[1]<-0.5))d--;
  if(Keys['KeyS']||Keys['ArrowDown']||(g&&g.axes[1]>0.5))d++;
  return d;
}
function inpInteract(){return KeysJust['KeyZ']||KeysJust['Space']||GpButtonsJust[0];}
function inpCancel(){return KeysJust['KeyX']||KeysJust['Escape']||GpButtonsJust[1];}
function inpMenu(){return KeysJust['Enter']||GpButtonsJust[9];}
function clearJust(){KeysJust={};GpButtonsJust={};}

// ─── GAME STATE ─────────────────────────────────────────────
var Game={state:'title',prevState:null,stateTime:0,gold:500,inventory:[],party:[],questFlags:{},time:0};
function setState(s){Game.prevState=Game.state;Game.state=s;Game.stateTime=0;}

// ─── SPRITE DRAWING ─────────────────────────────────────────
function drawChar(x,y,dir,frame,species,hair,eye,skin,outfit){
  var f=frame%3,lo=f===1?1:f===2?-1:0,as=f===1?1:f===2?-1:0;
  // Shadow
  ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(x-4,y+6,10,3);
  // Legs
  ctx.fillStyle=outfit||'#3344aa';
  ctx.fillRect(x-3+lo,y+1,2,4);ctx.fillRect(x+1-lo,y+1,2,4);
  // Shoes
  ctx.fillStyle='#222';ctx.fillRect(x-4+lo,y+4,3,2);ctx.fillRect(x+1-lo,y+4,3,2);
  // Body
  ctx.fillRect(x-3,y-5,7,7);
  // Arms
  ctx.fillStyle=skin||'#ffccaa';
  ctx.fillRect(x-5,y-4+as,2,4);ctx.fillRect(x+4,y-4-as,2,4);
  // Head
  ctx.fillRect(x-3,y-11,7,7);
  // Eyes
  ctx.fillStyle=eye||'#44ddff';
  if(dir===0){ctx.fillRect(x-2,y-8,2,2);ctx.fillRect(x+1,y-8,2,2);}
  else if(dir===1){ctx.fillRect(x-2,y-8,2,2);}
  else if(dir===2){ctx.fillRect(x+1,y-8,2,2);}
  // Hair
  ctx.fillStyle=hair||'#ffdd44';
  if(dir!==3){ctx.fillRect(x-4,y-12,9,3);ctx.fillRect(x-4,y-11,2,4);ctx.fillRect(x+3,y-11,2,4);}
  else{ctx.fillRect(x-4,y-12,9,4);}
  // Species
  if(species==='cat'){
    ctx.fillStyle=hair||'#ffdd44';ctx.fillRect(x-4,y-15,3,4);ctx.fillRect(x+2,y-15,3,4);
    ctx.fillStyle='#ff8866';ctx.fillRect(x-3,y-14,1,2);ctx.fillRect(x+3,y-14,1,2);
  } else if(species==='frog'){
    ctx.fillStyle='#44aa66';ctx.fillRect(x-5,y-13,4,4);ctx.fillRect(x+2,y-13,4,4);
    ctx.fillStyle='#44ff44';ctx.fillRect(x-4,y-12,2,2);ctx.fillRect(x+3,y-12,2,2);
    ctx.fillStyle='#55bb77';ctx.fillRect(x-1,y-5,3,2);
  } else if(species==='dragon'){
    ctx.fillStyle='#cc3333';ctx.fillRect(x-4,y-15,2,4);ctx.fillRect(x+3,y-15,2,4);
    ctx.fillStyle='#bb3333';ctx.fillRect(x-1,y-6,3,2);
    ctx.fillStyle='#aa2222';ctx.fillRect(x+4,y+1,4,2);ctx.fillRect(x+7,y-1,2,3);
  } else if(species==='robot'){
    ctx.fillStyle='#44ffff';ctx.fillRect(x-1,y-9,3,3);
    ctx.fillStyle='#8899aa';ctx.fillRect(x-4,y-12,9,3);ctx.fillRect(x,y-15,1,4);
    ctx.fillStyle='#44ffff';ctx.fillRect(x,y-14,1,1);
  }
}

function drawNPC(x,y,type,dir,frame){
  var cfg={
    merchant:{s:null,h:'#333',e:'#ffaa00',sk:'#ddaa88',o:'#886644'},
    blacksmith:{s:null,h:'#333333',e:'#ff4444',sk:'#ddaa88',o:'#333344'},
    healer:{s:null,h:'#ffdd44',e:'#44ff44',sk:'#ffccaa',o:'#ffffff'},
    commander:{s:null,h:'#333333',e:'#ff4444',sk:'#ddaa88',o:'#3344aa'},
    tavernkeeper:{s:null,h:'#333',e:'#ffaa00',sk:'#ddaa88',o:'#553322'},
    cat:{s:'cat',h:'#cc8833',e:'#44ff44',sk:'#ffccaa',o:'#aa44ff'},
    frog:{s:'frog',h:null,e:'#44ff44',sk:'#44aa66',o:'#116633'},
    dragon:{s:'dragon',h:null,e:'#ffaa00',sk:'#cc3333',o:'#881122'},
    robot:{s:'robot',h:null,e:null,sk:'#8899aa',o:'#778899'},
    townie1:{s:null,h:'#ff6633',e:'#44ddff',sk:'#ffccaa',o:'#33cc66'},
    townie2:{s:null,h:'#cc8833',e:'#ff4444',sk:'#ddaa88',o:'#ff66aa'}
  };
  var c=cfg[type]||cfg.townie1;
  drawChar(x,y,dir,frame,c.s,c.h,c.e,c.sk,c.o);
}

function drawTile(tx,ty,type){
  var x=tx*TILE,y=ty*TILE;
  if(type===T.FLOOR){ctx.fillStyle=(tx+ty)%2===0?'#2a2a4a':'#252545';ctx.fillRect(x,y,TILE,TILE);}
  else if(type===T.WALL){ctx.fillStyle=(tx+ty)%2===0?'#444466':'#3a3a5a';ctx.fillRect(x,y,TILE,TILE);ctx.fillStyle='rgba(0,0,0,0.2)';ctx.fillRect(x,y+TILE-2,TILE,2);}
  else if(type===T.DOOR){ctx.fillStyle='#664422';ctx.fillRect(x,y,TILE,TILE);ctx.fillStyle='#553311';ctx.fillRect(x+2,y+2,TILE-4,TILE-4);ctx.fillStyle='#ffaa00';ctx.fillRect(x+TILE-4,y+TILE/2-1,2,2);}
  else if(type===T.WATER){ctx.fillStyle=(tx+ty+Math.floor(Game.time/30))%2===0?'#2244aa':'#1a33aa';ctx.fillRect(x,y,TILE,TILE);}
  else if(type===T.BRIDGE){ctx.fillStyle='#664422';ctx.fillRect(x,y,TILE,TILE);ctx.fillStyle='#553311';ctx.fillRect(x,y+2,TILE,2);ctx.fillRect(x,y+TILE-4,TILE,2);}
  else if(type===T.GRASS){ctx.fillStyle=(tx+ty)%2===0?'#225533':'#1a4428';ctx.fillRect(x,y,TILE,TILE);if((tx*7+ty*13)%5===0){ctx.fillStyle='#337744';ctx.fillRect(x+4+(tx%3),y+2,2,4);}}
  else if(type===T.PATH){ctx.fillStyle=(tx+ty)%2===0?'#554433':'#4a3a2a';ctx.fillRect(x,y,TILE,TILE);}
  else if(type===T.COUNTER){ctx.fillStyle='#664422';ctx.fillRect(x,y,TILE,TILE);ctx.fillStyle='#553311';ctx.fillRect(x,y,TILE,3);}
  else if(type===T.SHELF){ctx.fillStyle='#553311';ctx.fillRect(x,y,TILE,TILE);ctx.fillStyle='#88aacc';ctx.fillRect(x+2,y+3,4,3);ctx.fillRect(x+8,y+8,5,3);}
  else if(type===T.PLANT){ctx.fillStyle='#2a2a4a';ctx.fillRect(x,y,TILE,TILE);ctx.fillStyle='#553322';ctx.fillRect(x+5,y+8,6,8);ctx.fillStyle='#33cc66';ctx.fillRect(x+3,y+2,10,8);ctx.fillStyle='#116633';ctx.fillRect(x+5,y+4,6,4);}
  else if(type===T.SIGN){ctx.fillStyle='#664422';ctx.fillRect(x+6,y+4,4,12);ctx.fillStyle='#553311';ctx.fillRect(x+2,y+2,12,4);}
  else if(type===T.CHEST){ctx.fillStyle='#886644';ctx.fillRect(x+2,y+6,12,10);ctx.fillStyle='#553322';ctx.fillRect(x+2,y+6,12,3);ctx.fillStyle='#ffaa00';ctx.fillRect(x+6,y+9,4,3);}
  else if(type===T.GATE){ctx.fillStyle='#778899';ctx.fillRect(x,y,TILE,TILE);ctx.fillStyle='#556677';ctx.fillRect(x+2,y+2,TILE-4,TILE-4);ctx.fillStyle='#ffaa00';ctx.fillRect(x+6,y+6,4,4);}
  else if(type===T.PORTAL){var p=Math.sin(Game.time*0.1)*0.3+0.7;ctx.fillStyle='rgba(100,50,255,'+p+')';ctx.fillRect(x+2,y+2,TILE-4,TILE-4);ctx.fillStyle='rgba(150,100,255,'+(p*0.7)+')';ctx.fillRect(x+5,y+5,TILE-10,TILE-10);}
  else if(type===T.BED){ctx.fillStyle='#664422';ctx.fillRect(x,y+4,TILE,TILE-4);ctx.fillStyle='#3344aa';ctx.fillRect(x+1,y+5,TILE-2,TILE-6);ctx.fillStyle='#ffffff';ctx.fillRect(x+1,y+5,6,4);}
  else if(type===T.TABLE){ctx.fillStyle='#664422';ctx.fillRect(x+1,y+2,TILE-2,3);ctx.fillStyle='#553311';ctx.fillRect(x+2,y+5,2,TILE-5);ctx.fillRect(x+TILE-4,y+5,2,TILE-5);}
  else if(type===T.BAR){ctx.fillStyle='#553322';ctx.fillRect(x,y,TILE,TILE);ctx.fillStyle='#886644';ctx.fillRect(x,y,TILE,3);ctx.fillStyle='#ffaa00';ctx.fillRect(x+3,y+4,2,3);ctx.fillStyle='#ff3344';ctx.fillRect(x+8,y+4,2,3);}
  else if(type===T.STAIRS){for(var i=0;i<4;i++){ctx.fillStyle=i%2===0?'#778899':'#556677';ctx.fillRect(x,y+i*4,TILE,4);}}
  else if(type===T.VOID){ctx.fillStyle=(Math.sin(Game.time*0.05+tx+ty)>0)?'#1a0a2a':'#0a0a1a';ctx.fillRect(x,y,TILE,TILE);}
}

// ─── TOWN MAP ───────────────────────────────────────────────
var TownMap={w:60,h:40,data:[],npcs:[],signs:[],chests:[]};
(function initTown(){
  var x,y;
  TownMap.data=[];
  for(y=0;y<TownMap.h;y++){TownMap.data[y]=[];for(x=0;x<TownMap.w;x++)TownMap.data[y][x]=T.FLOOR;}
  // Crown Spire
  for(y=2;y<12;y++)for(x=24;x<36;x++)TownMap.data[y][x]=T.WALL;
  for(y=3;y<11;y++)for(x=25;x<35;x++)TownMap.data[y][x]=T.FLOOR;
  TownMap.data[11][29]=T.DOOR;TownMap.data[11][30]=T.DOOR;
  TownMap.data[4][27]=T.BED;TownMap.data[4][32]=T.TABLE;
  TownMap.data[6][26]=T.SHELF;TownMap.data[6][34]=T.SHELF;
  // Weapon Shop
  for(y=14;y<22;y++)for(x=8;x<18;x++)TownMap.data[y][x]=T.WALL;
  for(y=15;y<21;y++)for(x=9;x<17;x++)TownMap.data[y][x]=T.FLOOR;
  TownMap.data[21][12]=T.DOOR;TownMap.data[21][13]=T.DOOR;
  TownMap.data[16][10]=T.COUNTER;TownMap.data[16][11]=T.COUNTER;
  TownMap.data[16][14]=T.COUNTER;TownMap.data[16][15]=T.COUNTER;
  TownMap.data[18][10]=T.SHELF;TownMap.data[18][11]=T.SHELF;
  TownMap.data[18][14]=T.SHELF;TownMap.data[18][15]=T.SHELF;
  // Armor Shop
  for(y=14;y<22;y++)for(x=42;x<52;x++)TownMap.data[y][x]=T.WALL;
  for(y=15;y<21;y++)for(x=43;x<51;x++)TownMap.data[y][x]=T.FLOOR;
  TownMap.data[21][46]=T.DOOR;TownMap.data[21][47]=T.DOOR;
  TownMap.data[16][44]=T.COUNTER;TownMap.data[16][45]=T.COUNTER;
  TownMap.data[16][48]=T.COUNTER;TownMap.data[16][49]=T.COUNTER;
  TownMap.data[18][44]=T.SHELF;TownMap.data[18][45]=T.SHELF;
  TownMap.data[18][48]=T.SHELF;TownMap.data[18][49]=T.SHELF;
  // Tavern
  for(y=26;y<36;y++)for(x=4;x<16;x++)TownMap.data[y][x]=T.WALL;
  for(y=27;y<35;y++)for(x=5;x<15;x++)TownMap.data[y][x]=T.FLOOR;
  TownMap.data[35][9]=T.DOOR;TownMap.data[35][10]=T.DOOR;
  TownMap.data[28][7]=T.BAR;TownMap.data[28][8]=T.BAR;
  TownMap.data[30][6]=T.TABLE;TownMap.data[30][10]=T.TABLE;
  TownMap.data[32][6]=T.TABLE;TownMap.data[32][10]=T.TABLE;
  // Healer's Hall
  for(y=26;y<34;y++)for(x=44;x<54;x++)TownMap.data[y][x]=T.WALL;
  for(y=27;y<33;y++)for(x=45;x<53;x++)TownMap.data[y][x]=T.FLOOR;
  TownMap.data[33][48]=T.DOOR;TownMap.data[33][49]=T.DOOR;
  TownMap.data[28][47]=T.BED;TownMap.data[28][50]=T.BED;
  TownMap.data[30][46]=T.TABLE;
  // Material Shop
  for(y=14;y<20;y++)for(x=2;x<7;x++)TownMap.data[y][x]=T.WALL;
  for(y=15;y<19;y++)for(x=3;x<6;x++)TownMap.data[y][x]=T.FLOOR;
  TownMap.data[19][4]=T.DOOR;TownMap.data[16][4]=T.COUNTER;
  // Stargate Dock
  for(y=30;y<36;y++)for(x=24;x<36;x++)TownMap.data[y][x]=T.WALL;
  for(y=31;y<35;y++)for(x=25;x<35;x++)TownMap.data[y][x]=T.FLOOR;
  TownMap.data[35][29]=T.DOOR;TownMap.data[35][30]=T.DOOR;
  TownMap.data[32][28]=T.GATE;TownMap.data[32][29]=T.GATE;TownMap.data[32][30]=T.GATE;TownMap.data[32][31]=T.GATE;
  TownMap.data[33][29]=T.PORTAL;TownMap.data[33][30]=T.PORTAL;
  // Paths
  for(x=0;x<TownMap.w;x++){TownMap.data[22][x]=T.PATH;TownMap.data[23][x]=T.PATH;}
  for(y=0;y<TownMap.h;y++){TownMap.data[y][17]=T.PATH;TownMap.data[y][42]=T.PATH;}
  for(y=12;y<22;y++)for(x=26;x<34;x++)TownMap.data[y][x]=T.PATH;
  // Gardens
  for(y=12;y<18;y++)for(x=2;x<8;x++)TownMap.data[y][x]=T.GRASS;
  for(y=12;y<18;y++)for(x=50;x<58;x++)TownMap.data[y][x]=T.GRASS;
  TownMap.data[14][3]=T.PLANT;TownMap.data[15][5]=T.PLANT;
  TownMap.data[14][55]=T.PLANT;TownMap.data[15][53]=T.PLANT;
  // Training
  for(y=2;y<8;y++)for(x=2;x<10;x++)TownMap.data[y][x]=T.WALL;
  for(y=3;y<7;y++)for(x=3;x<9;x++)TownMap.data[y][x]=T.FLOOR;
  TownMap.data[8][5]=T.DOOR;

  TownMap.signs=[
    {x:28,y:13,text:"<- Crown Spire"},{x:12,y:13,text:"-> Weapon Shop"},
    {x:46,y:13,text:"-> Armor Shop"},{x:9,y:25,text:"v The Nebula Tavern"},
    {x:48,y:25,text:"v Healer's Hall"},{x:4,y:13,text:"-> Material Shop"},
    {x:5,y:11,text:"^ Training Ground"},{x:28,y:29,text:"v Stargate Dock"}
  ];
  TownMap.chests=[
    {x:26,y:4,taken:false,item:{name:'Plasma Blade',type:'weapon',rarity:'Common',atk:5,level:1,id:'c1',desc:'Basic energy sword'}},
    {x:33,y:4,taken:false,item:{name:'Nano Patch',type:'consumable',rarity:'Common',heal:30,level:1,id:'c2',desc:'Restores 30 HP'}},
    {x:6,y:16,taken:false,item:{name:'Scrap Metal',type:'material',rarity:'Common',level:1,id:'c3',desc:'Weapon upgrade material'}},
  ];
  TownMap.npcs=[
    {x:28,y:16,type:'townie1',name:'Citizen Milo',dir:0,dialogue:["The stars have been dimming lately...","They say the Voidborn are getting closer.","Nova Prime has stood for a thousand years."]},
    {x:31,y:18,type:'townie2',name:'Citizen Ada',dir:1,dialogue:["I heard the Stargate is active again!","The Princess trains every day now.","Have you visited the Healer's Hall?"]},
    {x:12,y:17,type:'merchant',name:'Zara',dir:0,dialogue:["Welcome to Void & Spark!","Looking for something specific?","Void Essence is selling fast!"],shop:'materials'},
    {x:46,y:17,type:'blacksmith',name:'Torvin',dir:0,dialogue:["Need an edge? I'll give you one.","My forge burns hot enough for starsteel.","A good weapon is like a good friend."],shop:'weapons'},
    {x:12,y:19,type:'merchant',name:'Shopkeep',dir:0,dialogue:["Aegis Outfitters - protection you can trust.","New void-resistant armor in!","Stay safe out there."],shop:'armor'},
    {x:9,y:29,type:'tavernkeeper',name:'Old Corvus',dir:0,dialogue:["Sit down, friend. Let me tell you about the Crown...","The Celestial Crown was forged from a dying star.","Each shard holds a fragment of the First Emperor's will.","The Voidborn fear the Crown. That's why they shattered it."]},
    {x:7,y:31,type:'cat',name:'Erynn "Eryx" Vexx',dir:0,dialogue:["...You're staring. Got something to say?","I used to run with the Felidae colony.","If you're heading into the void zones... I might tag along.","I'm fast. Faster than anything you've seen."],recruitable:true},
    {x:48,y:29,type:'healer',name:'Dr. Elara',dir:0,dialogue:["Welcome to the Healer's Hall.","The Voidborn corruption rewrites living tissue.","The Crown Shards emit a frequency that repels the Void.","Rest here. You'll need your strength."],shop:'healer'},
    {x:27,y:5,type:'commander',name:'Commander Reyes',dir:0,dialogue:["Princess. The Stargate is operational.","You've trained hard. But battle is different.","Gather supplies. Recruit allies. Then go.","The galaxy is counting on you."]},
    {x:5,y:5,type:'townie1',name:'Trainer Kade',dir:0,dialogue:["Ready to spar?","Focus on fundamentals. Speed and precision win.","The Princess trains here every morning."]},
    {x:27,y:32,type:'commander',name:'Gate Guard',dir:0,dialogue:["The Stargate leads to the Void Scar.","Make sure you're equipped before you go.","The portal activates when you step on it. Good luck."]},
  ];
})();

TownMap.isSolid=function(x,y){
  if(x<0||x>=this.w||y<0||y>=this.h)return true;
  var t=this.data[y][x];
  return t===T.WALL||t===T.COUNTER||t===T.SHELF||t===T.TABLE||t===T.BAR||t===T.BED;
};
TownMap.getNPCAt=function(x,y){return this.npcs.find(function(n){return n.x===x&&n.y===y;});};
TownMap.getSignAt=function(x,y){return this.signs.find(function(s){return s.x===x&&s.y===y;});};
TownMap.getChestAt=function(x,y){return this.chests.find(function(c){return c.x===x&&c.y===y&&!c.taken;});};

// ─── OVERWORLD MAP ──────────────────────────────────────────
var OverworldMap={w:80,h:60,data:[],bosses:[],npcs:[]};
(function initOverworld(){
  var x,y;
  OverworldMap.data=[];
  for(y=0;y<OverworldMap.h;y++){OverworldMap.data[y]=[];for(x=0;x<OverworldMap.w;x++)OverworldMap.data[y][x]=T.GRASS;}
  // Path from town
  for(x=20;x<60;x++){OverworldMap.data[5][x]=T.PATH;OverworldMap.data[6][x]=T.PATH;}
  for(y=1;y<25;y++){OverworldMap.data[y][30]=T.PATH;OverworldMap.data[y][31]=T.PATH;}
  // Void Scar
  for(y=15;y<35;y++)for(x=35;x<65;x++)OverworldMap.data[y][x]=T.VOID;
  // Water
  for(y=40;y<55;y++)for(x=10;x<40;x++)OverworldMap.data[y][x]=T.WATER;
  for(x=10;x<40;x++)OverworldMap.data[47][x]=T.BRIDGE;
  // Boss arena
  for(y=20;y<30;y++)for(x=55;x<65;x++)OverworldMap.data[y][x]=T.FLOOR;
  OverworldMap.data[24][55]=T.GATE;OverworldMap.data[24][56]=T.GATE;
  OverworldMap.data[25][55]=T.GATE;OverworldMap.data[25][56]=T.GATE;
  OverworldMap.bosses=[{x:60,y:24,type:'void_sentinel',defeated:false}];
  // NPCs
  OverworldMap.npcs=[
    {x:25,y:46,type:'frog',name:'Brimble',dir:0,dialogue:["Ribbit... oh, hello traveler.","The waters here are tainted by the void. My people... they didn't make it.","You're heading into the Scar? I know those waters. Let me come with you.","...Friend. That's what I call everyone. Because everyone needs a friend."],recruitable:true},
    {x:50,y:10,type:'townie1',name:'Scout Venn',dir:0,dialogue:["The Void Scar is ahead. Be careful out there.","I've seen the Sentinel. It's massive. Don't engage alone.","There's a frog person by the bridge. Seems friendly enough."]},
  ];
})();

OverworldMap.isSolid=function(x,y){
  if(x<0||x>=this.w||y<0||y>=this.h)return true;
  return this.data[y][x]===T.WATER||this.data[y][x]===T.WALL;
};
OverworldMap.checkEncounter=function(x,y){
  return this.data[y]&&this.data[y][x]===T.VOID&&Math.random()<0.03;
};
OverworldMap.getNPCAt=function(x,y){
  if(!this.npcs)return null;
  return this.npcs.find(function(n){return n.x===x&&n.y===y;});
};

// ─── ITEMS ──────────────────────────────────────────────────
var Items={
  create:function(type,rarity,level){
    var tm={
      'Plasma Blade':{type:'weapon',rarity:'Common',atk:5},
      'Void Saber':{type:'weapon',rarity:'Uncommon',atk:12},
      'Starsteel Katana':{type:'weapon',rarity:'Rare',atk:22},
      'Scrap Pistol':{type:'weapon',rarity:'Common',atk:4},
      'Pulse Rifle':{type:'weapon',rarity:'Uncommon',atk:10},
      'Nova Cannon':{type:'weapon',rarity:'Rare',atk:20},
      'Cloth Tunic':{type:'armor',rarity:'Common',def:3,hp:10},
      'Voidweave Vest':{type:'armor',rarity:'Uncommon',def:8,hp:20},
      'Starsteel Plate':{type:'armor',rarity:'Rare',def:18,hp:40},
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

// ─── CHARACTERS ─────────────────────────────────────────────
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

function getStats(c){
  var s={atk:c.atk,def:c.def,spd:c.spd,crit:c.crit,hp:c.maxHp,
    lightAtk:c.lightAtk||0,darkAtk:c.darkAtk||0,fireAtk:c.fireAtk||0,
    lightRes:c.lightRes||0,darkRes:c.darkRes||0,fireRes:c.fireRes||0};
  var slots=['weapon','armor','accessory1','accessory2','implant'];
  slots.forEach(function(sl){
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

// ─── ENEMIES ────────────────────────────────────────────────
var EnemyTemplates={
  'Void Shade':{hp:30,atk:8,def:3,spd:8,xp:15,gold:10,weak:['light'],resist:['dark']},
  'Void Crawler':{hp:45,atk:10,def:6,spd:5,xp:20,gold:15,weak:['fire'],resist:['dark']},
  'Void Knight':{hp:70,atk:14,def:10,spd:7,xp:35,gold:25,weak:['light'],resist:['dark','physical']},
  'Void Wisp':{hp:20,atk:12,def:2,spd:15,xp:18,gold:12,weak:['light','fire'],resist:['dark','ice']}
};
function createEnemy(name,level){
  var t=EnemyTemplates[name];if(!t)return null;
  var s=1+(level-1)*0.2;
  return {name:name,level:level,hp:Math.floor(t.hp*s),maxHp:Math.floor(t.hp*s),
    atk:Math.floor(t.atk*s),def:Math.floor(t.def*s),spd:Math.floor(t.spd*s),
    xp:Math.floor(t.xp*s),gold:Math.floor(t.gold*s),weak:t.weak,resist:t.resist,atb:0};
}
function randomEnemy(level){var n=Object.keys(EnemyTemplates);return createEnemy(n[Math.floor(Math.random()*n.length)],level);}

// ─── BOSS ───────────────────────────────────────────────────
function createBoss(){
  return {name:'Void Sentinel Kael',phase:1,hp:300,maxHp:300,atk:18,def:12,spd:10,
    xp:200,gold:500,weak:['light'],resist:['dark','physical'],atb:0,
    telegraphing:null,telegraphTimer:0,enraged:false,defeated:false};
}

// ─── PLAYER ─────────────────────────────────────────────────
var Player={x:29,y:20,dir:0,frame:0,moving:false,moveTimer:0,moveDelay:8,stepCount:0,cameraX:0,cameraY:0};
Player.init=function(){this.x=29;this.y=20;this.dir=0;this.updateCamera();};
Player.updateCamera=function(){
  var map=Game.state==='town'?TownMap:OverworldMap;
  this.cameraX=Math.max(0,Math.min(map*TILE-VIEW_W,this.x*TILE-VIEW_W/2+TILE/2));
  this.cameraY=Math.max(0,Math.min(map.h*TILE-VIEW_H,this.y*TILE-VIEW_H/2+TILE/2));
};
Player.update=function(){
  if(Game.state!=='town'&&Game.state!=='overworld')return;
  var mdx=dx(),mdy=dy();
  this.moving=mdx!==0||mdy!==0;
  if(this.moving){
    if(mdx<0)this.dir=1;else if(mdx>0)this.dir=2;
    else if(mdy<0)this.dir=3;else if(mdy>0)this.dir=0;
    this.moveTimer++;
    if(this.moveTimer>=this.moveDelay){
      this.moveTimer=0;
      var nx=this.x+mdx,ny=this.y+mdy;
      var map=Game.state==='town'?TownMap:OverworldMap;
      if(!map.isSolid(nx,ny)){
        var npc=map.getNPCAt?map.getNPCAt(nx,ny):null;
        if(!npc){
          this.x=nx;this.y=ny;this.stepCount++;
          if(this.stepCount%2===0)SFX.step();
          // Warps
          if(Game.state==='town'&&this.x===29&&this.y===34&&this.dir===0){setState('overworld');this.x=30;this.y=2;return;}
          if(Game.state==='overworld'&&this.x===30&&this.y===1){setState('town');this.x=29;this.y=33;return;}
          if(Game.state==='overworld'&&this.x>=55&&this.x<=56&&this.y>=24&&this.y<=25){CombatSys.startBoss();return;}
          // Encounter
          if(Game.state==='overworld'&&map.checkEncounter&&map.checkEncounter(this.x,this.y)){CombatSys.startRandom();return;}
        }
      }
    }
  }else{this.moveTimer=0;}
  if(this.moving)this.frame=Math.floor(Game.time/15)%3;else this.frame=0;
  this.updateCamera();
};
Player.interact=function(){
  var map=Game.state==='town'?TownMap:OverworldMap;
  var ddx=[0,-1,1,0][this.dir],ddy=[1,0,0,-1][this.dir];
  var tx=this.x+ddx,ty=this.y+ddy;
  var npc=map.getNPCAt?map.getNPCAt(tx,ty):null;
  if(npc){
    SFX.talk();
    if(npc.shop&&!npc.recruitable){
      // Shop NPC: dialogue then open shop
      var shopType=npc.shop;
      var npcName=npc.name;
      var npcDialogue=npc.dialogue[Math.floor(Math.random()*npc.dialogue.length)];
      DialogueSys.showText(npcName+': '+npcDialogue,function(){
        ShopSys.start(shopType);
      });
    } else {
      DialogueSys.start(npc);
    }
    return;
  }
  var sign=map.getSignAt?map.getSignAt(tx,ty):null;
  if(sign){SFX.talk();DialogueSys.showText(sign.text);return;}
  var chest=map.getChestAt?map.getChestAt(tx,ty):null;
  if(chest){chest.taken=true;Game.inventory.push(chest.item);SFX.confirm();DialogueSys.showText('Found '+chest.item.name+'!');return;}
};

// ─── DIALOGUE ───────────────────────────────────────────────
var DialogueSys={active:false,lines:[],curLine:0,curChar:0,charTimer:0,charDelay:2,npc:null,onComplete:null,choiceMode:false,choices:[],choiceIndex:0,boxY:VIEW_H-60};
DialogueSys.start=function(npc){
  this.npc=npc;this.lines=npc.dialogue.slice();this.curLine=0;this.curChar=0;this.charTimer=0;
  this.active=true;this.choiceMode=false;this.onComplete=null;setState('dialogue');
};
DialogueSys.showText=function(text,cb){
  this.npc=null;this.lines=[text];this.curLine=0;this.curChar=0;this.charTimer=0;
  this.active=true;this.choiceMode=false;this.onComplete=cb||null;setState('dialogue');
};
DialogueSys.showChoices=function(choices,cb){
  this.npc=null;this.lines=[];this.choices=choices;this.choiceIndex=0;
  this.choiceMode=true;this.active=true;this.onComplete=cb;setState('dialogue');
};
DialogueSys.update=function(){
  if(!this.active)return;
  if(this.choiceMode){
    if(inpCancel()){SFX.cancel();this.active=false;this.choiceMode=false;if(this.onComplete)this.onComplete(null);return;}
    if(inpInteract()){SFX.confirm();var ch=this.choices[this.choiceIndex];this.active=false;this.choiceMode=false;if(this.onComplete)this.onComplete(ch);return;}
    if(KeysJust['ArrowUp']||KeysJust['KeyW']){this.choiceIndex=Math.max(0,this.choiceIndex-1);SFX.select();}
    if(KeysJust['ArrowDown']||KeysJust['KeyS']){this.choiceIndex=Math.min(this.choices.length-1,this.choiceIndex+1);SFX.select();}
    return;
  }
  if(this.curChar<this.lines[this.curLine].length){
    this.charTimer++;
    if(this.charTimer>=this.charDelay){this.charTimer=0;this.curChar++;}
  }
  if(inpInteract()){
    if(this.curChar<this.lines[this.curLine].length){this.curChar=this.lines[this.curLine].length;}
    else{this.curLine++;
      if(this.curLine>=this.lines.length){this.active=false;
        if(this.onComplete){var cb=this.onComplete;this.onComplete=null;cb();}
        else{setState(Game.prevState);}
      }else{this.curChar=0;this.charTimer=0;}
    }
  }
};
DialogueSys.render=function(){
  if(!this.active)return;
  uiCtx.fillStyle='rgba(10,10,30,0.92)';uiCtx.fillRect(4,this.boxY,VIEW_W-8,56);
  uiCtx.strokeStyle='#4488ff';uiCtx.lineWidth=1;uiCtx.strokeRect(4,this.boxY,VIEW_W-8,56);
  if(this.choiceMode){
    var self=this;
    this.choices.forEach(function(ch,i){
      var cy=self.boxY+8+i*16;
      if(i===self.choiceIndex){uiCtx.fillStyle='#4488ff';uiCtx.fillRect(8,cy-2,VIEW_W-16,16);uiCtx.fillStyle='#fff';}
      else uiCtx.fillStyle='#aaa';
      uiCtx.font='10px monospace';uiCtx.fillText(ch.text,12,cy+10);
    });return;
  }
  if(this.npc){uiCtx.fillStyle='#44ddff';uiCtx.font='10px monospace';uiCtx.fillText(this.npc.name,10,this.boxY+12);}
  var text=this.lines[this.curLine].substring(0,this.curChar);
  uiCtx.fillStyle='#ddd';uiCtx.font='10px monospace';
  var words=text.split(' '),line='',lineY=this.boxY+24;
  words.forEach(function(w){
    var test=w+' ';
    if(uiCtx.measureText(line+test).width>VIEW_W-24){uiCtx.fillText(line,10,lineY);line=test;lineY+=12;}
    else line+=test;
  });
  uiCtx.fillText(line,10,lineY);
  if(this.curChar>=this.lines[this.curLine].length&&this.curLine<this.lines.length-1){
    if(Math.floor(Game.time/30)%2){uiCtx.fillStyle='#ffcc33';uiCtx.fillText('\u25BC',VIEW_W-20,this.boxY+48);}
  }
};

// ─── SHOP ───────────────────────────────────────────────────
var ShopSys={active:false,shopType:null,items:[],cursor:0,mode:'main',message:'',messageTimer:0};
var ShopCatalogs={
  weapons:[{name:'Plasma Blade',price:100,fn:function(){return Items.create('weapon','Common',1);}},
          {name:'Void Saber',price:350,fn:function(){return Items.create('weapon','Uncommon',1);}},
          {name:'Starsteel Katana',price:800,fn:function(){return Items.create('weapon','Rare',1);}},
          {name:'Pulse Rifle',price:280,fn:function(){return Items.create('weapon','Uncommon',1);}},
          {name:'Nova Cannon',price:700,fn:function(){return Items.create('weapon','Rare',1);}}],
  armor:[{name:'Cloth Tunic',price:80,fn:function(){return Items.create('armor','Common',1);}},
         {name:'Voidweave Vest',price:300,fn:function(){return Items.create('armor','Uncommon',1);}},
         {name:'Starsteel Plate',price:750,fn:function(){return Items.create('armor','Rare',1);}}],
  materials:[{name:'Scrap Metal',price:30,fn:function(){return Items.create('material','Common',1);}},
            {name:'Bio Gel',price:30,fn:function(){return Items.create('material','Common',1);}},
            {name:'Void Essence',price:100,fn:function(){return Items.create('material','Uncommon',1);}},
            {name:'Stellar Crystal',price:250,fn:function(){return Items.create('material','Rare',1);}},
            {name:'Nano Patch',price:40,fn:function(){return Items.create('consumable','Common',1);}},
            {name:'Stim Pack',price:120,fn:function(){return Items.create('consumable','Uncommon',1);}}]
};
ShopSys.start=function(type){
  this.shopType=type;this.mode='main';this.cursor=0;this.message='';this.messageTimer=0;this.active=true;
  setState('shop');SFX.shop();
};
ShopSys.update=function(){
  if(!this.active)return;
  var self=this;
  if(this.messageTimer>0){this.messageTimer--;}
  if(this.mode==='main'){
    var opts=this.shopType==='healer'?[{t:'Heal Party (50g)',a:'heal'},{t:'Leave',a:'leave'}]:[{t:'Buy',a:'buy'},{t:'Sell',a:'sell'},{t:'Upgrade',a:'upgrade'},{t:'Leave',a:'leave'}];
    if(inpCancel()){this.end();return;}
    if(inpInteract()){var o=opts[this.cursor];this.doAction(o.a);return;}
    if(KeysJust['ArrowUp']||KeysJust['KeyW']){this.cursor=Math.max(0,this.cursor-1);SFX.select();}
    if(KeysJust['ArrowDown']||KeysJust['KeyS']){this.cursor=Math.min(opts.length-1,this.cursor+1);SFX.select();}
  } else if(this.mode==='buy'){
    if(inpCancel()){this.mode='main';this.cursor=0;return;}
    if(inpInteract()){
      var si=ShopCatalogs[this.shopType][this.cursor];
      if(si&&Game.gold>=si.price){Game.gold-=si.price;var it=si.fn();Game.inventory.push(it);this.message='Bought '+it.name+'!';SFX.confirm();}
      else this.message='Not enough gold!';
      this.messageTimer=120;return;
    }
    if(KeysJust['ArrowUp']||KeysJust['KeyW']){this.cursor=Math.max(0,this.cursor-1);SFX.select();}
    if(KeysJust['ArrowDown']||KeysJust['KeyS']){this.cursor=Math.min(ShopCatalogs[this.shopType].length-1,this.cursor+1);SFX.select();}
  } else if(this.mode==='sell'){
    if(inpCancel()){this.mode='main';this.cursor=0;return;}
    if(inpInteract()){
      var item=Game.inventory[this.cursor];
      if(item){var price=Math.floor((item.atk||item.def||item.hp||10)*2);Game.gold+=price;Game.inventory.splice(this.cursor,1);this.message='Sold '+item.name+' for '+price+'g!';SFX.confirm();this.cursor=Math.min(this.cursor,Math.max(0,Game.inventory.length-1));}
      this.messageTimer=120;return;
    }
    if(KeysJust['ArrowUp']||KeysJust['KeyW']){this.cursor=Math.max(0,this.cursor-1);SFX.select();}
    if(KeysJust['ArrowDown']||KeysJust['KeyS']){this.cursor=Math.min(Math.max(0,Game.inventory.length-1),this.cursor+1);SFX.select();}
  } else if(this.mode==='upgrade'){
    if(inpCancel()){this.mode='main';this.cursor=0;return;}
    if(inpInteract()){
      var upItem=Game.inventory[this.cursor];
      if(upItem&&(upItem.type==='weapon'||upItem.type==='armor')&&upItem.level<10){
        var cost=upItem.level*50;
        var matType=upItem.type==='weapon'?'Scrap Metal':'Bio Gel';
        var matIdx=Game.inventory.findIndex(function(i){return i.name===matType;});
        if(Game.gold>=cost&&matIdx>=0){
          Game.gold-=cost;Game.inventory.splice(matIdx,1);upItem.level++;
          if(upItem.atk)upItem.atk=Math.floor(upItem.atk*1.15);
          if(upItem.def)upItem.def=Math.floor(upItem.def*1.15);
          if(upItem.hp)upItem.hp=Math.floor(upItem.hp*1.1);
          this.message=upItem.name+' upgraded to +'+upItem.level+'!';SFX.confirm();
        } else this.message='Need '+cost+'g and '+matType+'!';
      }
      this.messageTimer=120;return;
    }
    if(KeysJust['ArrowUp']||KeysJust['KeyW']){this.cursor=Math.max(0,this.cursor-1);SFX.select();}
    if(KeysJust['ArrowDown']||KeysJust['KeyS']){this.cursor=Math.min(Math.max(0,Game.inventory.length-1),this.cursor+1);SFX.select();}
  }
};
ShopSys.doAction=function(a){
  if(a==='leave'){this.end();}
  else if(a==='heal'){
    if(Game.gold>=50){Game.gold-=50;Game.party.forEach(function(c){c.hp=c.maxHp;c.sp=c.maxSp;});this.message='Party healed!';SFX.heal();}
    else this.message='Not enough gold!';
    this.messageTimer=120;
  } else if(a==='buy'){this.mode='buy';this.cursor=0;this.items=ShopCatalogs[this.shopType]||[];}
  else if(a==='sell'){this.mode='sell';this.cursor=0;}
  else if(a==='upgrade'){this.mode='upgrade';this.cursor=0;}
};
ShopSys.end=function(){this.active=false;setState(Game.prevState==='dialogue'?'town':Game.prevState);};
ShopSys.render=function(){
  if(!this.active)return;
  uiCtx.fillStyle='rgba(10,10,30,0.95)';uiCtx.fillRect(20,10,VIEW_W-40,VIEW_H-20);
  uiCtx.strokeStyle='#4488ff';uiCtx.lineWidth=2;uiCtx.strokeRect(20,10,VIEW_W-40,VIEW_H-20);
  uiCtx.fillStyle='#ffcc33';uiCtx.font='12px monospace';
  var titles={weapons:'\u2694 Edge of Tomorrow',armor:'\u26E8 Aegis Outfitters',materials:'\u2728 Void & Spark',healer:'\u2764 Healer\'s Hall'};
  uiCtx.fillText(titles[this.shopType]||'Shop',30,30);
  uiCtx.fillStyle='#ffcc33';uiCtx.font='10px monospace';uiCtx.fillText('Gold: '+Game.gold+'g',VIEW_W-100,30);
  var self=this;
  if(this.mode==='main'){
    var opts=this.shopType==='healer'?[{t:'Heal Party (50g)',a:'heal'},{t:'Leave',a:'leave'}]:[{t:'Buy',a:'buy'},{t:'Sell',a:'sell'},{t:'Upgrade',a:'upgrade'},{t:'Leave',a:'leave'}];
    opts.forEach(function(o,i){
      var y=50+i*20;
      if(i===self.cursor){uiCtx.fillStyle='#4488ff';uiCtx.fillRect(30,y-12,VIEW_W-60,18);uiCtx.fillStyle='#fff';}
      else uiCtx.fillStyle='#aaa';
      uiCtx.font='10px monospace';uiCtx.fillText(o.t,40,y);
    });
  } else if(this.mode==='buy'){
    var catalog=ShopCatalogs[this.shopType]||[];
    catalog.forEach(function(si,i){
      var y=50+i*18;
      if(i===self.cursor){uiCtx.fillStyle='#4488ff';uiCtx.fillRect(30,y-10,VIEW_W-60,16);uiCtx.fillStyle='#fff';}
      else uiCtx.fillStyle='#aaa';
      uiCtx.font='10px monospace';uiCtx.fillText(si.name+' - '+si.price+'g',40,y);
    });
  } else if(this.mode==='sell'){
    Game.inventory.forEach(function(item,i){
      var y=50+i*18;
      if(i===self.cursor){uiCtx.fillStyle='#4488ff';uiCtx.fillRect(30,y-10,VIEW_W-60,16);uiCtx.fillStyle='#fff';}
      else uiCtx.fillStyle=Items.rarityColor(item.rarity);
      uiCtx.font='10px monospace';
      var price=Math.floor((item.atk||item.def||item.hp||10)*2);
      uiCtx.fillText(item.name+' +'+item.level+' ('+price+'g)',40,y);
    });
  } else if(this.mode==='upgrade'){
    Game.inventory.forEach(function(item,i){
      var y=50+i*18;
      if(i===self.cursor){uiCtx.fillStyle='#4488ff';uiCtx.fillRect(30,y-10,VIEW_W-60,16);uiCtx.fillStyle='#fff';}
      else uiCtx.fillStyle=Items.rarityColor(item.rarity);
      uiCtx.font='10px monospace';
      var canUp=(item.type==='weapon'||item.type==='armor')&&item.level<10;
      uiCtx.fillText(item.name+' +'+item.level+(canUp?' (Upgrade: '+item.level*50+'g)':''),40,y);
    });
  }
  if(this.message&&this.messageTimer>0){
    uiCtx.fillStyle='#ffcc33';uiCtx.font='10px monospace';uiCtx.fillText(this.message,30,VIEW_H-30);
  }
};

// ─── COMBAT SYSTEM ──────────────────────────────────────────
var CombatSys={
  active:false,enemies:[],boss:null,phase:'start', // start, playerTurn, enemyTurn, anim, victory, defeat, boss
  selectedChar:0,selectedAction:0,selectedTarget:0,
  actionQueue:[],animTimer:0,animType:'',animData:null,
  turnOrder:[],currentTurn:0,atbBars:[],
  message:'',messageTimer:0,shakeTimer:0,flashTimer:0,
  inBoss:false,expAwarded:false,goldAwarded:false
};

CombatSys.startRandom=function(){
  this.inBoss=false;this.enemies=[randomEnemy(Game.party[0].level),randomEnemy(Game.party[0].level)];
  if(Math.random()<0.3)this.enemies.push(randomEnemy(Game.party[0].level));
  this.phase='start';this.selectedChar=0;this.selectedAction=0;this.selectedTarget=0;
  this.actionQueue=[];this.animTimer=0;this.message='Enemies appeared!';this.messageTimer=90;
  this.turnOrder=[];this.currentTurn=0;this.expAwarded=false;this.goldAwarded=false;
  // Init ATB
  this.atbBars=Game.party.map(function(c){return {char:c,atb:0};});
  this.enemies.forEach(function(e,i){e.atb=0;e.idx=i;});
  this.active=true;setState('combat');
};

CombatSys.startBoss=function(){
  this.inBoss=true;this.boss=createBoss();this.enemies=[];
  this.phase='start';this.selectedChar=0;this.selectedAction=0;this.selectedTarget=0;
  this.actionQueue=[];this.animTimer=0;this.message='Void Sentinel Kael appears!';this.messageTimer=120;
  this.turnOrder=[];this.currentTurn=0;this.expAwarded=false;this.goldAwarded=false;
  this.atbBars=Game.party.map(function(c){return {char:c,atb:0};});
  this.boss.atb=0;
  SFX.bossWarn();
  this.active=true;setState('boss');
};

CombatSys.update=function(){
  if(!this.active)return;
  var self=this;
  if(this.messageTimer>0){this.messageTimer--;}
  if(this.shakeTimer>0){this.shakeTimer--;}
  if(this.flashTimer>0){this.flashTimer--;}

  // ATB fill
  if(this.phase==='start'||this.phase==='playerTurn'){
    this.atbBars.forEach(function(ab){
      if(ab.char.hp>0){ab.atb+=ab.char.spd*0.02;if(ab.atb>=100)ab.atb=100;}
    });
  }
  if(this.inBoss&&this.boss&&this.boss.hp>0){this.boss.atb+=this.boss.spd*0.015;if(this.boss.atb>=100)this.boss.atb=100;}
  this.enemies.forEach(function(e){if(e.hp>0){e.atb+=e.spd*0.018;if(e.atb>=100)e.atb=100;}});

  // Check if any party member is ready
  var readyIdx=this.atbBars.findIndex(function(ab){return ab.atb>=100&&ab.char.hp>0;});

  if(this.phase==='start'){if(this.messageTimer<=0)this.phase='playerTurn';return;}

  if(this.phase==='playerTurn'){
    if(readyIdx<0)return;
    var ab=this.atbBars[readyIdx];
    // Auto-select first ready character
    this.selectedChar=readyIdx;
    // Player chooses action
    if(inpCancel()){/* no back in combat */}

    // Navigate actions
    var char=ab.char;
    var actions=['Attack','Skill','Defend'];
    if(Game.inventory.some(function(i){return i.type==='consumable';}))actions.push('Item');

    if(inpInteract()){
      var act=actions[this.selectedAction];
      if(act==='Attack'){
        // Target selection - pick first alive enemy
        var tgt=this.getFirstAliveEnemy();
        if(tgt>=0){this.queueAction(char,'attack',tgt);ab.atb=0;}
      } else if(act==='Defend'){
        this.queueAction(char,'defend',-1);ab.atb=0;
      } else if(act==='Skill'){
        if(char.skills&&char.skills.length>0){
          var sk=char.skills[0]; // Use first skill for simplicity
          if(char.sp>=sk.cost){
            var stgt=sk.type==='heal'?this.getFirstAliveParty():this.getFirstAliveEnemy();
            if(stgt>=0||sk.type==='heal'){this.queueAction(char,'skill',stgt,sk);ab.atb=0;char.sp-=sk.cost;}
          } else{this.message='Not enough SP!';this.messageTimer=60;}
        }
      } else if(act==='Item'){
        var items=Game.inventory.filter(function(i){return i.type==='consumable';});
        if(items.length>0){
          var it=items[0];
          if(it.heal){this.queueAction(char,'item',this.getFirstAliveParty(),it);ab.atb=0;}
          else if(it.revive){var dead=Game.party.findIndex(function(c){return c.hp<=0;});
            if(dead>=0){this.queueAction(char,'item',dead,it);ab.atb=0;}}
          if(ab.atb===0){var idx=Game.inventory.indexOf(it);if(idx>=0)Game.inventory.splice(idx,1);}
        }
      }
      return;
    }
    if(KeysJust['ArrowUp']||KeysJust['KeyW']){this.selectedAction=Math.max(0,this.selectedAction-1);SFX.select();}
    if(KeysJust['ArrowDown']||KeysJust['KeyS']){this.selectedAction=Math.min(actions.length-1,this.selectedAction+1);SFX.select();}
    return;
  }

  if(this.phase==='anim'){
    this.animTimer--;
    if(this.animTimer<=0){this.processNextAction();}
    return;
  }

  if(this.phase==='enemyTurn'){
    // Process enemy turns
    var allReady=true;
    this.enemies.forEach(function(e){
      if(e.hp>0&&e.atb>=100){
        var tgt=Math.floor(Math.random()*Game.party.length);
        while(Game.party[tgt].hp<=0)tgt=(tgt+1)%Game.party.length;
        self.execAttack(e,Game.party[tgt],'enemy',tgt);e.atb=0;allReady=false;
      }
    });
    if(this.inBoss&&this.boss&&this.boss.hp>0&&this.boss.atb>=100){
      this.doBossTurn();allReady=false;
    }
    if(allReady){
      // Check victory/defeat
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
      } else {
        this.phase='playerTurn';this.selectedAction=0;
      }
    }
    return;
  }

  if(this.phase==='victory'){
    if(this.messageTimer<=0){
      // Check for boss evolution
      if(this.inBoss&&this.boss.defeated===false){
        this.boss.defeated=true;
        // Award Crown Shard - trigger evolution!
        var shard={name:'Crown Shard',type:'material',rarity:'Legendary',level:1,id:'shard1',desc:'A fragment of the Celestial Crown'};
        Game.inventory.push(shard);
        Game.party[0].evolution=1;Game.party[0].evolutionName='Crown Bearer';
        // Unlock new skill
        Game.party[0].skills.push({name:'Stellar Command',cost:12,type:'buff',stat:'all',power:1.3,desc:'Party-wide buff'});
        SFX.evo();
        startEvolution();
        return;
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
    return;
  }
};

CombatSys.getFirstAliveEnemy=function(){
  if(this.inBoss&&this.boss&&this.boss.hp>0)return -99; // special boss index
  return this.enemies.findIndex(function(e){return e.hp>0;});
};
CombatSys.getFirstAliveParty=function(){return Game.party.findIndex(function(c){return c.hp>0;});};

CombatSys.queueAction=function(char,type,target,extra){
  this.actionQueue.push({char:char,type:type,target:target,extra:extra});
  if(this.phase==='playerTurn'){this.phase='anim';this.animTimer=30;this.processNextAction();}
};

CombatSys.processNextAction=function(){
  if(this.actionQueue.length===0){
    // Check if enemies should go
    var enemyReady=this.enemies.some(function(e){return e.hp>0&&e.atb>=100;});
    var bossReady=this.inBoss&&this.boss&&this.boss.hp>0&&this.boss.atb>=100;
    if(enemyReady||bossReady){this.phase='enemyTurn';}
    else{this.phase='playerTurn';this.selectedAction=0;}
    return;
  }
  var act=this.actionQueue.shift();
  var self=this;
  if(act.type==='attack'){
    var tgt=act.target===-99?this.boss:this.enemies[act.target];
    if(tgt)this.execAttack(act.char,tgt,'party',act.target);
  } else if(act.type==='skill'){
    var sk=act.extra;
    if(sk.type==='damage'){
      var st=act.target===-99?this.boss:this.enemies[act.target];
      if(st)this.execSkill(act.char,st,sk,'party');
    } else if(sk.type==='heal'){
      if(act.target>=0&&act.target<Game.party.length)this.execHeal(act.char,Game.party[act.target],sk);
    } else if(sk.type==='buff'){
      this.execBuff(act.char,sk);
    }
  } else if(act.type==='defend'){
    act.char.defending=true;this.message=act.char.name+' is defending!';this.messageTimer=45;
  } else if(act.type==='item'){
    var it=act.extra;
    if(it.heal&&act.target>=0&&act.target<Game.party.length){
      var tc=Game.party[act.target];
      tc.hp=Math.min(tc.maxHp,tc.hp+it.heal);SFX.heal();
      this.message=tc.name+' recovered '+it.heal+' HP!';this.messageTimer=45;
    } else if(it.revive&&act.target>=0&&act.target<Game.party.length){
      var rc=Game.party[act.target];rc.hp=Math.floor(rc.maxHp*0.3);
      this.message=rc.name+' revived!';this.messageTimer=45;SFX.heal();
    }
  }
};

CombatSys.execAttack=function(attacker,target,attType,tgtIdx){
  var stats=getStats(attacker);
  var dmg=Math.max(1,stats.atk-Math.floor((target.def||0)*0.5));
  // Crit
  if(Math.random()*100<stats.crit){dmg=Math.floor(dmg*1.5);}
  // Elemental
  if(stats.lightAtk&&target.weak&&target.weak.indexOf('light')>=0){dmg=Math.floor(dmg*1.5);}
  if(target.resist){
    if(target.resist.indexOf('dark')>=0&&attType==='enemy')dmg=Math.floor(dmg*0.7);
  }
  // Defense
  if(target.defending){dmg=Math.floor(dmg*0.5);target.defending=false;}
  dmg=Math.max(1,dmg+Math.floor(Math.random()*4-2));
  target.hp=Math.max(0,target.hp-dmg);
  SFX.hit();this.shakeTimer=8;this.flashTimer=4;
  this.message=attacker.name+' deals '+dmg+' damage!';this.messageTimer=45;
  if(target.hp<=0)this.message=target.name+' defeated!';this.messageTimer=60;
};

CombatSys.execSkill=function(attacker,target,skill,attType){
  var stats=getStats(attacker);
  var dmg=Math.floor(stats.atk*skill.power);
  if(skill.critBonus&&Math.random()*100<stats.crit+skill.critBonus)dmg=Math.floor(dmg*1.5);
  if(skill.element==='light'&&target.weak&&target.weak.indexOf('light')>=0)dmg=Math.floor(dmg*1.5);
  if(target.defending){dmg=Math.floor(dmg*0.5);target.defending=false;}
  if(skill.hits){dmg=Math.floor(dmg*skill.hits);}
  dmg=Math.max(1,dmg);
  target.hp=Math.max(0,target.hp-dmg);
  SFX.hit();this.shakeTimer=10;this.flashTimer=6;
  this.message=attacker.name+' uses '+skill.name+'! '+dmg+' damage!';this.messageTimer=60;
};

CombatSys.execHeal=function(attacker,target,skill){
  var heal=skill.power;
  target.hp=Math.min(target.maxHp,target.hp+heal);
  SFX.heal();
  this.message=target.name+' recovered '+heal+' HP!';this.messageTimer=45;
};

CombatSys.execBuff=function(attacker,skill){
  this.message=attacker.name+' uses '+skill.name+'!';this.messageTimer=60;
  SFX.confirm();
};

CombatSys.doBossTurn=function(){
  var boss=this.boss;
  // Phase-based AI
  var hpPct=boss.hp/boss.maxHp;
  if(hpPct<=0.5&&boss.phase===1){boss.phase=2;this.message='Kael powers up!';this.messageTimer=90;SFX.bossWarn();}
  if(hpPct<=0.1&&!boss.enraged){boss.enraged=true;boss.atk=Math.floor(boss.atk*1.25);this.message='Kael enrages!';this.messageTimer=60;}

  var roll=Math.random();
  var tgt=Math.floor(Math.random()*Game.party.length);
  while(Game.party[tgt].hp<=0)tgt=(tgt+1)%Game.party.length;

  if(boss.phase===1){
    if(roll<0.5){this.execAttack(boss,Game.party[tgt],'enemy',tgt);boss.atb=0;}
    else if(roll<0.8){// AoE
      var self=this;Game.party.forEach(function(c){if(c.hp>0){var dmg=Math.max(1,boss.atk-Math.floor(c.def*0.3));if(c.defending){dmg=Math.floor(dmg*0.5);c.defending=false;}c.hp=Math.max(0,c.hp-dmg);}});
      SFX.hit();this.shakeTimer=12;this.message='Dark Pulse hits everyone!';this.messageTimer=60;boss.atb=0;
    } else{// Summon
      if(this.enemies.length<2){var minion=createEnemy('Void Shade',Game.party[0].level);if(minion){minion.hp=Math.floor(minion.hp*0.5);minion.maxHp=minion.hp;this.enemies.push(minion);this.message='Kael summons a Void Shade!';this.messageTimer=60;}}boss.atb=0;
    }
  } else{// Phase 2
    if(roll<0.3){this.execAttack(boss,Game.party[tgt],'enemy',tgt);boss.atb=0;}
    else if(roll<0.6){// AoE
      var self2=this;Game.party.forEach(function(c){if(c.hp>0){var dmg=Math.max(1,Math.floor(boss.atk*1.2)-Math.floor(c.def*0.3));if(c.defending){dmg=Math.floor(dmg*0.5);c.defending=false;}c.hp=Math.max(0,c.hp-dmg);}});
      SFX.hit();this.shakeTimer=15;this.message='Annihilation Wave!';this.messageTimer=60;boss.atb=0;
    } else if(roll<0.8){// Summon
      if(this.enemies.length<3){var minion2=createEnemy('Void Wisp',Game.party[0].level);if(minion2){this.enemies.push(minion2);this.message='Kael summons a Void Wisp!';this.messageTimer=60;}}boss.atb=0;
    } else{// Heavy single
      var dmg=Math.max(1,Math.floor(boss.atk*2)-Math.floor(Game.party[tgt].def*0.5));
      if(Game.party[tgt].defending){dmg=Math.floor(dmg*0.5);Game.party[tgt].defending=false;}
      Game.party[tgt].hp=Math.max(0,Game.party[tgt].hp-dmg);
      SFX.hit();this.shakeTimer=15;this.flashTimer=8;this.message='Void Slash! '+dmg+' damage to '+Game.party[tgt].name+'!';this.messageTimer=60;boss.atb=0;
    }
  }
};

CombatSys.render=function(){
  if(!this.active)return;
  var self=this;
  // Combat background
  if(this.inBoss){
    ctx.fillStyle='#0a0a2a';ctx.fillRect(0,0,VIEW_W,VIEW_H);
    // Boss arena floor
    ctx.fillStyle='#1a1a3a';ctx.fillRect(0,VIEW_H-120,VIEW_W,120);
    ctx.fillStyle='#2a2a4a';for(var i=0;i<VIEW_W;i+=16){if((i/16)%2===0)ctx.fillRect(i,VIEW_H-120,16,120);}
  } else {
    ctx.fillStyle='#1a2a1a';ctx.fillRect(0,0,VIEW_W,VIEW_H);
    ctx.fillStyle='#2a3a2a';ctx.fillRect(0,VIEW_H-120,VIEW_W,120);
  }

  // Draw enemies
  var enemySpacing=VIEW_W/(this.enemies.length+1);
  this.enemies.forEach(function(e,i){
    if(e.hp>0){
      var ex=enemySpacing*(i+1),ey=VIEW_H-160;
      // Simple enemy sprite
      ctx.fillStyle='#6633aa';ctx.fillRect(ex-8,ey-16,16,24);
      ctx.fillStyle='#9944cc';ctx.fillRect(ex-6,ey-14,12,20);
      ctx.fillStyle='#ff4444';ctx.fillRect(ex-4,ey-10,3,3);ctx.fillRect(ex+1,ey-10,3,3);
      // Name
      uiCtx.fillStyle='#ff6688';uiCtx.font='8px monospace';uiCtx.fillText(e.name,ex-20,ey+10);
      // HP bar
      uiCtx.fillStyle='#333';uiCtx.fillRect(ex-20,ey+14,40,4);
      uiCtx.fillStyle='#ff3344';uiCtx.fillRect(ex-20,ey+14,Math.max(0,40*(e.hp/e.maxHp)),4);
    }
  });

  // Draw boss
  if(this.inBoss&&this.boss&&this.boss.hp>0){
    var bx=VIEW_W/2,by=VIEW_H-170;
    // Boss sprite (large)
    var bSize=this.boss.phase===2?1.3:1;
    ctx.fillStyle='#220044';ctx.fillRect(bx-16*bSize,by-32*bSize,32*bSize,48*bSize);
    ctx.fillStyle='#440088';ctx.fillRect(bx-12*bSize,by-28*bSize,24*bSize,40*bSize);
    ctx.fillStyle='#ff0044';ctx.fillRect(bx-8*bSize,by-20*bSize,6*bSize,6*bSize);ctx.fillRect(bx+2*bSize,by-20*bSize,6*bSize,6*bSize);
    // Crown fragment on boss
    ctx.fillStyle='#ffaa00';ctx.fillRect(bx-2*bSize,by-36*bSize,4*bSize,6*bSize);
    // Name
    uiCtx.fillStyle='#ff4466';uiCtx.font='10px monospace';uiCtx.fillText(this.boss.name,bx-50,by+20);
    // HP bar
    uiCtx.fillStyle='#333';uiCtx.fillRect(bx-50,by+24,100,6);
    uiCtx.fillStyle=this.boss.phase===2?'#ff0044':'#aa0044';uiCtx.fillRect(bx-50,by+24,Math.max(0,100*(this.boss.hp/this.boss.maxHp)),6);
    // Phase indicator
    if(this.boss.enraged){uiCtx.fillStyle='#ff0000';uiCtx.font='8px monospace';uiCtx.fillText('ENRAGED',bx-20,by+40);}
  }

  // Draw party
  Game.party.forEach(function(c,i){
    if(c.hp>0){
      var px=40+i*70,py=VIEW_H-80;
      drawChar(px,py,0,0,c.species,c.hairColor,c.eyeColor,c.skinColor,c.outfitColor);
      // Name
      uiCtx.fillStyle='#44ddff';uiCtx.font='8px monospace';uiCtx.fillText(c.name,px-12,py+14);
      // HP bar
      uiCtx.fillStyle='#333';uiCtx.fillRect(px-15,py+18,30,3);
      uiCtx.fillStyle=c.hp>c.maxHp*0.3?'#33cc66':'#ff3344';uiCtx.fillRect(px-15,py+18,Math.max(0,30*(c.hp/c.maxHp)),3);
      // SP bar
      uiCtx.fillStyle='#333';uiCtx.fillRect(px-15,py+22,30,2);
      uiCtx.fillStyle='#4488ff';uiCtx.fillRect(px-15,py+22,Math.max(0,30*(c.sp/c.maxSp)),2);
      // ATB bar
      var atb=self.atbBars[i];
      if(atb){uiCtx.fillStyle='#333';uiCtx.fillRect(px-15,py+25,30,2);uiCtx.fillStyle='#ffcc33';uiCtx.fillRect(px-15,py+25,Math.max(0,30*(atb.atb/100)),2);}
      // Selection indicator
      if(self.phase==='playerTurn'&&self.selectedChar===i){
        if(Math.floor(Game.time/15)%2){uiCtx.fillStyle='#ffcc33';uiCtx.fillText('\u25B2',px-3,py-18);}
      }
    } else {
      // Dead
      uiCtx.fillStyle='#666';uiCtx.font='8px monospace';uiCtx.fillText(c.name+' (KO)',40+i*70-15,VIEW_H-60);
    }
  });

  // Action menu
  if(this.phase==='playerTurn'){
    var char=this.atbBars[this.selectedChar];
    if(char&&char.atb>=100){
      uiCtx.fillStyle='rgba(10,10,30,0.9)';uiCtx.fillRect(VIEW_W-100,5,95,60);
      uiCtx.strokeStyle='#4488ff';uiCtx.strokeRect(VIEW_W-100,5,95,60);
      var actions=['Attack','Skill','Defend','Item'];
      actions.forEach(function(a,i){
        if(i===self.selectedAction){uiCtx.fillStyle='#4488ff';uiCtx.fillRect(VIEW_W-98,10+i*14,91,13);uiCtx.fillStyle='#fff';}
        else uiCtx.fillStyle='#aaa';
        uiCtx.font='9px monospace';uiCtx.fillText(a,VIEW_W-94,20+i*14);
      });
    }
  }

  // Message
  if(this.message&&this.messageTimer>0){
    uiCtx.fillStyle='rgba(10,10,30,0.85)';uiCtx.fillRect(10,VIEW_H/2-15,VIEW_W-20,30);
    uiCtx.strokeStyle='#ffcc33';uiCtx.strokeRect(10,VIEW_H/2-15,VIEW_W-20,30);
    uiCtx.fillStyle='#fff';uiCtx.font='10px monospace';uiCtx.textAlign='center';uiCtx.fillText(this.message,VIEW_W/2,VIEW_H/2+4);uiCtx.textAlign='left';
  }

  // Screen effects
  if(this.flashTimer>0){uiCtx.fillStyle='rgba(255,255,255,'+(this.flashTimer/8)+')';uiCtx.fillRect(0,0,VIEW_W,VIEW_H);}
};

// ─── EVOLUTION SEQUENCE ────────────────────────────────────
var EvoSys={active:false,timer:0,phase:0};
function startEvolution(){
  EvoSys.active=true;EvoSys.timer=0;EvoSys.phase=0;
  setState('evolution');
}
EvoSys.update=function(){
  if(!this.active)return;
  this.timer++;
  if(inpInteract()&&this.timer>60){this.active=false;CombatSys.active=false;setState('overworld');}
};
EvoSys.render=function(){
  if(!this.active)return;
  // Flash effect
  var t=this.timer;
  if(t<30){ctx.fillStyle='rgba(255,255,255,'+(1-t/30)+')';ctx.fillRect(0,0,VIEW_W,VIEW_H);return;}
  // Evolution scene
  ctx.fillStyle='#0a0a2a';ctx.fillRect(0,0,VIEW_W,VIEW_H);
  // Stars
  for(var i=0;i<50;i++){
    var sx=(i*97+t*0.5)%VIEW_W,sy=(i*53)%VIEW_H;
    ctx.fillStyle='rgba(255,255,255,'+(0.3+Math.sin(t*0.05+i)*0.3)+')';
    ctx.fillRect(sx,sy,2,2);
  }
  // Character in center
  var cy=VIEW_H/2+20;
  // Glow
  var glowSize=40+Math.sin(t*0.08)*10;
  var grad=ctx.createRadialGradient(VIEW_W/2,cy,0,VIEW_W/2,cy,glowSize);
  grad.addColorStop(0,'rgba(255,204,51,0.6)');
  grad.addColorStop(0.5,'rgba(170,68,255,0.3)');
  grad.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=grad;ctx.fillRect(0,cy-glowSize,VIEW_W,glowSize*2);
  // Draw evolved character
  drawChar(VIEW_W/2,cy,0,0,'human','#ffee88','#88ffff','#ffccaa','#cc66ff');
  // Crown effect
  ctx.fillStyle='#ffcc33';
  ctx.fillRect(VIEW_W/2-8,cy-22,16,4);
  ctx.fillRect(VIEW_W/2-6,cy-25,3,4);
  ctx.fillRect(VIEW_W/2+3,cy-25,3,4);
  ctx.fillRect(VIEW_W/2-2,cy-26,4,3);
  // Text
  if(t>60){
    uiCtx.fillStyle='#ffcc33';uiCtx.font='12px monospace';uiCtx.textAlign='center';
    uiCtx.fillText('EVOLUTION',VIEW_W/2,40);
    uiCtx.fillStyle='#fff';uiCtx.font='10px monospace';
    uiCtx.fillText('Lyra has become the Crown Bearer!',VIEW_W/2,60);
    uiCtx.fillStyle='#aaa';uiCtx.font='9px monospace';
    uiCtx.fillText('New skill: Stellar Command',VIEW_W/2,80);
    uiCtx.fillText('Press Z to continue',VIEW_W/2,VIEW_H-20);
    uiCtx.textAlign='left';
  }
};

// ─── TITLE SCREEN ───────────────────────────────────────────
var TitleSys={timer:0};
TitleSys.update=function(){
  this.timer++;
  if(inpInteract()&&this.timer>30){
    SFX.confirm();
    // Initialize party
    Game.party=[createLyra()];
    // Give starting equipment
    var sword=Items.create('weapon','Common',1);
    if(sword){Game.party[0].equipment.weapon=sword;}
    var tunic=Items.create('armor','Common',1);
    if(tunic){Game.party[0].equipment.armor=tunic;}
    // Starting items
    Game.inventory.push(Items.create('consumable','Common',1));
    Game.inventory.push(Items.create('consumable','Common',1));
    Game.inventory.push(Items.create('material','Common',1));
    Game.gold=500;
    Player.init();
    setState('town');
  }
};
TitleSys.render=function(){
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,VIEW_W,VIEW_H);
  // Stars
  for(var i=0;i<80;i++){
    var sx=(i*97+this.timer*0.3)%VIEW_W,sy=(i*53)%VIEW_H;
    ctx.fillStyle='rgba(255,255,255,'+(0.2+Math.sin(this.timer*0.03+i)*0.2)+')';
    ctx.fillRect(sx,sy,2,2);
  }
  // Title
  ctx.fillStyle='#ffcc33';ctx.font='20px monospace';ctx.textAlign='center';
  ctx.fillText('STELLAR PRINCESSES',VIEW_W/2,80);
  ctx.fillStyle='#aa44ff';ctx.font='10px monospace';
  ctx.fillText('A Sci-Fi RPG',VIEW_W/2,100);
  // Princess sprite
  drawChar(VIEW_W/2,150,0,Math.floor(this.timer/20)%3,'human','#ffdd44','#44ddff','#ffccaa','#aa44ff');
  // Prompt
  if(this.timer>30&&Math.floor(this.timer/40)%2){
    ctx.fillStyle='#fff';ctx.font='10px monospace';
    ctx.fillText('Press Z or SPACE to start',VIEW_W/2,200);
  }
  // Version
  ctx.fillStyle='#666';ctx.font='8px monospace';
  ctx.fillText('v1.2 - Steps 1-3 Complete',VIEW_W/2,VIEW_H-10);
  ctx.textAlign='left';
};

// ─── MAP RENDERING ──────────────────────────────────────────
function renderMap(){
  var map=Game.state==='town'?TownMap:OverworldMap;
  var camX=Player.cameraX,camY=Player.cameraY;
  var startTX=Math.max(0,Math.floor(camX/TILE));
  var startTY=Math.max(0,Math.floor(camY/TILE));
  var endTX=Math.min(map.w-1,Math.ceil((camX+VIEW_W)/TILE));
  var endTY=Math.min(map.h-1,Math.ceil((camY+VIEW_H)/TILE));
  // Draw tiles
  for(var ty=startTY;ty<=endTY;ty++){
    for(var tx=startTX;tx<=endTX;tx++){
      drawTile(tx,ty,map.data[ty][tx]);
    }
  }
  // Draw signs
  if(map.signs){
    map.signs.forEach(function(s){
      if(s.x>=startTX&&s.x<=endTX&&s.y>=startTY&&s.y<=endTY){
        drawTile(s.x,s.y,T.SIGN);
      }
    });
  }
  // Draw chests
  if(map.chests){
    map.chests.forEach(function(c){
      if(!c.taken&&c.x>=startTX&&c.x<=endTX&&c.y>=startTY&&c.y<=endTY){
        drawTile(c.x,c.y,T.CHEST);
      }
    });
  }
  // Draw NPCs
  if(map.npcs){
    map.npcs.forEach(function(n){
      if(n.x>=startTX&&n.x<=endTX&&n.y>=startTY&&n.y<=endTY){
        var nf=Math.floor(Game.time/30)%3;
        drawNPC(n.x*TILE+8-camX,n.y*TILE+8-camY,n.type,n.dir,nf);
      }
    });
  }
  // Draw player
  var px=Player.x*TILE+8-camX,py=Player.y*TILE+8-camY;
  var pc=Game.party[0];
  drawChar(px,py,Player.dir,Player.frame,pc.species,pc.hairColor,pc.eyeColor,pc.skinColor,pc.outfitColor);
  // Evolution glow
  if(pc.evolution>0){
    var glowAlpha=0.2+Math.sin(Game.time*0.1)*0.1;
    ctx.fillStyle='rgba(255,204,51,'+glowAlpha+')';
    ctx.fillRect(px-6,py-14,14,18);
  }
  // Camera offset for UI
  ctx.setTransform(1,0,0,1,0,0);
}

function renderHUD(){
  if(Game.state!=='town'&&Game.state!=='overworld')return;
  // Party HP
  Game.party.forEach(function(c,i){
    var hx=4,hy=4+i*28;
    uiCtx.fillStyle='rgba(10,10,30,0.8)';uiCtx.fillRect(hx,hy,80,24);
    uiCtx.strokeStyle='#4488ff';uiCtx.lineWidth=1;uiCtx.strokeRect(hx,hy,80,24);
    uiCtx.fillStyle='#44ddff';uiCtx.font='8px monospace';uiCtx.fillText(c.name,hx+4,hy+10);
    // HP
    uiCtx.fillStyle='#333';uiCtx.fillRect(hx+4,hy+14,50,4);
    uiCtx.fillStyle=c.hp>c.maxHp*0.3?'#33cc66':'#ff3344';
    uiCtx.fillRect(hx+4,hy+14,Math.max(0,50*(c.hp/c.maxHp)),4);
    uiCtx.fillStyle='#fff';uiCtx.font='7px monospace';uiCtx.fillText('HP:'+c.hp+'/'+c.maxHp,hx+56,hy+18);
  });
  // Gold
  uiCtx.fillStyle='rgba(10,10,30,0.8)';uiCtx.fillRect(VIEW_W-70,4,66,16);
  uiCtx.fillStyle='#ffcc33';uiCtx.font='9px monospace';uiCtx.fillText(Game.gold+'g',VIEW_W-66,15);
  // Location
  uiCtx.fillStyle='rgba(10,10,30,0.8)';uiCtx.fillRect(VIEW_W-90,22,86,14);
  uiCtx.fillStyle='#aaa';uiCtx.font='8px monospace';
  uiCtx.fillText(Game.state==='town'?'Nova Prime':'Void Frontier',VIEW_W-86,32);
  // Evolution indicator
  if(Game.party[0].evolution>0){
    uiCtx.fillStyle='#ffcc33';uiCtx.font='8px monospace';
    uiCtx.fillText('\u2605 '+Game.party[0].evolutionName,VIEW_W-90,48);
  }
  // Controls hint
  uiCtx.fillStyle='rgba(10,10,30,0.6)';uiCtx.fillRect(4,VIEW_H-18,150,14);
  uiCtx.fillStyle='#888';uiCtx.font='7px monospace';
  uiCtx.fillText('WASD:Move Z:Interact X:Menu',8,VIEW_H-7);
}

// ─── INVENTORY / EQUIPMENT SCREEN ────────────────────────────
var InvSys={active:false,mode:'list',cursor:0,scroll:0,charIndex:0,slotIndex:0,slotNames:['weapon','armor','accessory1','accessory2','implant'],slotLabels:['Weapon','Armor','Accessory 1','Accessory 2','Implant']};

InvSys.open=function(){
  this.active=true;this.mode='list';this.cursor=0;this.scroll=0;this.charIndex=0;this.slotIndex=0;
  setState('inventory');
};
InvSys.close=function(){
  this.active=false;setState(Game.prevState==='inventory'?Game.prevState:'town');
};
InvSys.update=function(){
  if(!this.active)return;
  var self=this;
  if(this.mode==='list'){
    if(inpCancel()){this.close();return;}
    if(inpInteract()){
      var item=Game.inventory[this.cursor];
      if(item&&(item.type==='weapon'||item.type==='armor'||item.type==='accessory')){
        // Show equip/use options
        this.mode='itemAction';this._item=item;this._itemIdx=this.cursor;
      } else if(item&&item.type==='consumable'){
        // Use consumable
        var target=Game.party.findIndex(function(c){return c.hp>0&&c.hp<c.maxHp;});
        if(target>=0&&item.heal){
          Game.party[target].hp=Math.min(Game.party[target].maxHp,Game.party[target].hp+item.heal);
          SFX.heal();Game.inventory.splice(this.cursor,1);
          this.cursor=Math.min(this.cursor,Math.max(0,Game.inventory.length-1));
        } else if(item.revive){
          var dead=Game.party.findIndex(function(c){return c.hp<=0;});
          if(dead>=0){Game.party[dead].hp=Math.floor(Game.party[dead].maxHp*0.3);SFX.heal();Game.inventory.splice(this.cursor,1);}
        }
      }
      return;
    }
    if(KeysJust['ArrowUp']||KeysJust['KeyW']){this.cursor=Math.max(0,this.cursor-1);SFX.select();}
    if(KeysJust['ArrowDown']||KeysJust['KeyS']){this.cursor=Math.min(Math.max(0,Game.inventory.length-1),this.cursor+1);SFX.select();}
    // Switch to equip tab
    if(KeysJust['Tab']||GpButtonsJust[4]){this.mode='equip';this.charIndex=0;this.slotIndex=0;this.cursor=0;return;}
  } else if(this.mode==='itemAction'){
    var actions=['Equip','Drop','Cancel'];
    if(inpCancel()){this.mode='list';return;}
    if(inpInteract()){
      var act=actions[this.cursor];
      if(act==='Equip'){
        var item=this._item;
        // Pick party member to equip
        this.mode='pickChar';this._equipItem=item;this.cursor=0;
      } else if(act==='Drop'){
        Game.inventory.splice(this._itemIdx,1);this.mode='list';this.cursor=Math.min(this.cursor,Math.max(0,Game.inventory.length-1));
      } else {this.mode='list';}
      return;
    }
    if(KeysJust['ArrowUp']||KeysJust['KeyW']){this.cursor=Math.max(0,this.cursor-1);SFX.select();}
    if(KeysJust['ArrowDown']||KeysJust['KeyS']){this.cursor=Math.min(actions.length-1,this.cursor+1);SFX.select();}
  } else if(this.mode==='pickChar'){
    if(inpCancel()){this.mode='itemAction';this.cursor=0;return;}
    if(inpInteract()){
      var ch=Game.party[this.cursor];
      if(ch){
        var item=this._equipItem;
        var slot=item.type==='weapon'?'weapon':item.type==='armor'?'armor':item.type==='accessory'?(ch.equipment.accessory1?'accessory2':'accessory1'):item.type==='implant'?'implant':null;
        if(slot){
          var old=ch.equipment[slot];
          ch.equipment[slot]=item;
          var idx=Game.inventory.indexOf(item);
          if(idx>=0)Game.inventory.splice(idx,1);
          if(old)Game.inventory.push(old);
          SFX.confirm();
        }
      }
      this.mode='list';return;
    }
    if(KeysJust['ArrowUp']||KeysJust['KeyW']){this.cursor=Math.max(0,this.cursor-1);SFX.select();}
    if(KeysJust['ArrowDown']||KeysJust['KeyS']){this.cursor=Math.min(Game.party.length-1,this.cursor+1);SFX.select();}
  } else if(this.mode==='equip'){
    if(inpCancel()){this.mode='list';this.cursor=0;return;}
    if(inpInteract()){
      var ch=Game.party[this.charIndex];
      var slot=this.slotNames[this.slotIndex];
      var equipped=ch.equipment[slot];
      if(equipped){
        // Unequip
        Game.inventory.push(equipped);ch.equipment[slot]=null;SFX.confirm();
      } else {
        // Show inventory items that fit this slot
        var fitType=slot==='weapon'?'weapon':slot==='armor'?'armor':slot==='implant'?'implant':'accessory';
        var fitItems=Game.inventory.filter(function(i){return i.type===fitType;});
        if(fitItems.length>0){
          var first=fitItems[0];
          ch.equipment[slot]=first;
          var idx=Game.inventory.indexOf(first);
          if(idx>=0)Game.inventory.splice(idx,1);
          SFX.confirm();
        }
      }
      return;
    }
    if(KeysJust['ArrowUp']||KeysJust['KeyW']){this.slotIndex=Math.max(0,this.slotIndex-1);SFX.select();}
    if(KeysJust['ArrowDown']||KeysJust['KeyS']){this.slotIndex=Math.min(this.slotNames.length-1,this.slotIndex+1);SFX.select();}
    if(KeysJust['ArrowLeft']||KeysJust['KeyA']){this.charIndex=Math.max(0,this.charIndex-1);SFX.select();}
    if(KeysJust['ArrowRight']||KeysJust['KeyD']){this.charIndex=Math.min(Game.party.length-1,this.charIndex+1);SFX.select();}
    if(KeysJust['Tab']||GpButtonsJust[4]){this.mode='list';this.cursor=0;return;}
  }
};

InvSys.render=function(){
  if(!this.active)return;
  var self=this;
  // Background
  uiCtx.fillStyle='rgba(5,5,20,0.95)';uiCtx.fillRect(10,8,VIEW_W-20,VIEW_H-16);
  uiCtx.strokeStyle='#4488ff';uiCtx.lineWidth=2;uiCtx.strokeRect(10,8,VIEW_W-20,VIEW_H-16);

  // Tabs
  var tabs=['Inventory','Equipment'];
  tabs.forEach(function(t,i){
    var tx=20+i*80;
    if((self.mode==='list'||self.mode==='itemAction'||self.mode==='pickChar')&&i===0){uiCtx.fillStyle='#4488ff';}
    else if(self.mode==='equip'&&i===1){uiCtx.fillStyle='#4488ff';}
    else uiCtx.fillStyle='#334';
    uiCtx.fillRect(tx,14,70,16);
    uiCtx.fillStyle='#fff';uiCtx.font='9px monospace';uiCtx.fillText(t,tx+10,26);
  });

  if(this.mode==='list'||this.mode==='itemAction'||this.mode==='pickChar'){
    // Inventory list
    uiCtx.fillStyle='#aaa';uiCtx.font='8px monospace';uiCtx.fillText('Gold: '+Game.gold+'g',VIEW_W-80,26);
    var startY=36,maxVisible=12;
    var startScroll=Math.max(0,this.cursor-Math.floor(maxVisible/2));
    var visible=Game.inventory.slice(startScroll,startScroll+maxVisible);
    visible.forEach(function(item,i){
      var idx=startScroll+i,iy=startY+i*14;
      if(idx===self.cursor){uiCtx.fillStyle='#4488ff44';uiCtx.fillRect(14,iy-2,VIEW_W-28,14);}
      uiCtx.fillStyle=Items.rarityColor(item.rarity);
      uiCtx.font='9px monospace';
      var label=item.name+(item.level>1?' +'+item.level:'');
      if(item.atk)label+=' ATK:'+item.atk;
      if(item.def)label+=' DEF:'+item.def;
      if(item.hp)label+=' HP:'+item.hp;
      if(item.heal)label+=' Heal:'+item.heal;
      uiCtx.fillText(label,20,iy+9);
    });
    if(Game.inventory.length===0){
      uiCtx.fillStyle='#666';uiCtx.font='10px monospace';uiCtx.fillText('Inventory is empty',60,VIEW_H/2);
    }

    // Item action submenu
    if(this.mode==='itemAction'){
      var actions=['Equip','Drop','Cancel'];
      var ax=VIEW_W-100,ay=60;
      uiCtx.fillStyle='rgba(10,10,30,0.95)';uiCtx.fillRect(ax-4,ay-4,90,actions.length*16+8);
      uiCtx.strokeStyle='#ffcc33';uiCtx.strokeRect(ax-4,ay-4,90,actions.length*16+8);
      actions.forEach(function(a,i){
        if(i===self.cursor){uiCtx.fillStyle='#ffcc3344';uiCtx.fillRect(ax-2,ay+i*16-2,86,16);uiCtx.fillStyle='#fff';}
        else uiCtx.fillStyle='#aaa';
        uiCtx.font='9px monospace';uiCtx.fillText(a,ax+4,ay+i*16+10);
      });
    }

    // Pick character submenu
    if(this.mode==='pickChar'){
      var px=VIEW_W-120,py=60;
      uiCtx.fillStyle='rgba(10,10,30,0.95)';uiCtx.fillRect(px-4,py-4,110,Game.party.length*16+8);
      uiCtx.strokeStyle='#44ddff';uiCtx.strokeRect(px-4,py-4,110,Game.party.length*16+8);
      Game.party.forEach(function(c,i){
        if(i===self.cursor){uiCtx.fillStyle='#44ddff44';uiCtx.fillRect(px-2,py+i*16-2,106,16);uiCtx.fillStyle='#fff';}
        else uiCtx.fillStyle='#aaa';
        uiCtx.font='9px monospace';uiCtx.fillText(c.name+' Lv'+c.level,px+4,py+i*16+10);
      });
    }
  } else if(this.mode==='equip'){
    // Equipment view
    var ch=Game.party[this.charIndex];
    // Character selector at top
    Game.party.forEach(function(c,i){
      var cx=20+i*70;
      if(i===self.charIndex){uiCtx.fillStyle='#4488ff';uiCtx.fillRect(cx,34,64,14);uiCtx.fillStyle='#fff';}
      else uiCtx.fillStyle='#666';
      uiCtx.font='8px monospace';uiCtx.fillText(c.name,cx+4,44);
    });
    // Character sprite
    if(ch){
      drawChar(50,80,0,0,ch.species,ch.hairColor,ch.eyeColor,ch.skinColor,ch.outfitColor);
      // Stats
      var stats=getStats(ch);
      uiCtx.fillStyle='#44ddff';uiCtx.font='9px monospace';
      uiCtx.fillText(ch.name+' Lv'+ch.level+' '+ch.evolutionName,20,110);
      uiCtx.fillStyle='#aaa';uiCtx.font='8px monospace';
      uiCtx.fillText('HP:'+ch.hp+'/'+stats.hp+'  SP:'+ch.sp+'/'+ch.maxSp,20,122);
      uiCtx.fillText('ATK:'+stats.atk+'  DEF:'+stats.def+'  SPD:'+stats.spd+'  CRIT:'+stats.crit+'%',20,134);
      // Equipment slots
      var self2=this;
      this.slotNames.forEach(function(slot,i){
        var sy=148+i*16;
        var label=self2.slotLabels[i]+': ';
        var item=ch.equipment[slot];
        if(i===self.slotIndex){uiCtx.fillStyle='#ffcc3344';uiCtx.fillRect(14,sy-2,VIEW_W-28,16);uiCtx.fillStyle='#fff';}
        else uiCtx.fillStyle='#aaa';
        uiCtx.font='9px monospace';
        uiCtx.fillText(label+(item?item.name+(item.level>1?' +'+item.level:''):'[empty]'),20,sy+10);
      });
    }
  }

  // Controls hint
  uiCtx.fillStyle='#666';uiCtx.font='7px monospace';
  if(this.mode==='list')uiCtx.fillText('Z:Use/Equip X:Back Tab:Equip',20,VIEW_H-6);
  else if(this.mode==='equip')uiCtx.fillText('Z:Unequip/Equip X:Back Tab:Inv \u2190\u2192:Chara',20,VIEW_H-6);
  else uiCtx.fillText('Z:Select X:Back',20,VIEW_H-6);
};

// ─── MAIN GAME LOOP ─────────────────────────────────────────
function gameLoop(){
  Game.time++;
  // Update
  if(Game.state==='title'){TitleSys.update();}
  else if(Game.state==='town'||Game.state==='overworld'){
    if(inpMenu()&&Game.state!=='dialogue'&&Game.state!=='shop'){InvSys.open();}
    else {
      Player.update();
      if(inpInteract())Player.interact();
    }
  }
  else if(Game.state==='dialogue'){DialogueSys.update();}
  else if(Game.state==='shop'){ShopSys.update();}
  else if(Game.state==='combat'||Game.state==='boss'){CombatSys.update();}
  else if(Game.state==='evolution'){EvoSys.update();}
  else if(Game.state==='inventory'){InvSys.update();}

  // Render
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,VIEW_W,VIEW_H);
  uiCtx.clearRect(0,0,VIEW_W,VIEW_H);

  if(Game.state==='title'){TitleSys.render();}
  else if(Game.state==='town'||Game.state==='overworld'){
    renderMap();renderHUD();DialogueSys.render();ShopSys.render();
  }
  else if(Game.state==='dialogue'){renderMap();renderHUD();DialogueSys.render();}
  else if(Game.state==='shop'){renderMap();ShopSys.render();}
  else if(Game.state==='combat'||Game.state==='boss'){CombatSys.render();}
  else if(Game.state==='evolution'){EvoSys.render();}
  else if(Game.state==='inventory'){renderMap();InvSys.render();}

  clearJust();
  requestAnimationFrame(gameLoop);
}

// ─── INIT ───────────────────────────────────────────────────
// Give recruitable NPC a shop property for Eryrn
TownMap.npcs.forEach(function(n){
  if(n.recruitable&&!n.shop)n.shop=null;
});
// Add recruit dialogue handler
var origDialogueStart=DialogueSys.start;
DialogueSys.start=function(npc){
  var self=this;
  if(npc&&npc.recruitable&&!Game.questFlags['recruited_'+npc.name]){
    this.npc=npc;
    this.lines=npc.dialogue.slice();
    this.curLine=0;this.curChar=0;this.charTimer=0;
    this.active=true;this.choiceMode=false;
    this.onComplete=function(){
      DialogueSys.showChoices([{text:'Invite '+npc.name+' to join your party'},{text:'Maybe later'}],function(choice){
        if(choice&&choice.text.indexOf('Invite')>=0){
          if(npc.type==='cat'){
            Game.party.push(createErynn());
            Game.questFlags['recruited_'+npc.name]=true;
            DialogueSys.showText(npc.name+' joined the party!');
            var idx=TownMap.npcs.indexOf(npc);
            if(idx>=0){TownMap.npcs.splice(idx,1);npc.x=-1;npc.y=-1;}
          } else if(npc.type==='frog'){
            Game.party.push(createBrimble());
            Game.questFlags['recruited_'+npc.name]=true;
            DialogueSys.showText(npc.name+' joined the party!');
            if(OverworldMap.npcs){
              var oidx=OverworldMap.npcs.indexOf(npc);
              if(oidx>=0){OverworldMap.npcs.splice(oidx,1);npc.x=-1;npc.y=-1;}
            }
          }
        } else {
          setState(Game.prevState);
        }
      });
    };
    setState('dialogue');
    return;
  }
  origDialogueStart.call(this,npc);
};

// Start
requestAnimationFrame(gameLoop);

})();
