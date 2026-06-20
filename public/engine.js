// engine.js — Core engine: canvas, audio, input, constants, sprite drawing
var E={TILE:16,VIEW_W:480,VIEW_H:270,SCALE:4,FPS:60};
var T={FLOOR:0,WALL:1,DOOR:2,WATER:3,BRIDGE:4,GRASS:5,PATH:6,COUNTER:7,SHELF:8,PLANT:9,SIGN:10,CHEST:11,GATE:12,PORTAL:13,BED:14,TABLE:15,BAR:16,STAIRS:17,VOID:18,ICE:19,LAVA:20};

var canvas=document.getElementById('game-layer');
var ctx=canvas.getContext('2d');
var uiCanvas=document.getElementById('ui-layer');
var uiCtx=uiCanvas.getContext('2d');
var controllerStatus=document.getElementById('controller-status');

canvas.width=E.VIEW_W;canvas.height=E.VIEW_H;
uiCanvas.width=E.VIEW_W;uiCanvas.height=E.VIEW_H;
ctx.imageSmoothingEnabled=false;uiCtx.imageSmoothingEnabled=false;

// CSS scale to fill screen while maintaining aspect ratio
function resizeCanvas(){
  var vh=window.innerHeight,vw=window.innerWidth;
  var scale=Math.min(vw/E.VIEW_W,vh/E.VIEW_H);
  var w=Math.floor(E.VIEW_W*scale),h=Math.floor(E.VIEW_H*scale);
  var css='width:'+w+'px;height:'+h+'px;';
  canvas.style.cssText=css;uiCanvas.style.cssText=css;
  var container=document.getElementById('game-container');
  container.style.width=w+'px';container.style.height=h+'px';
}
resizeCanvas();window.addEventListener('resize',resizeCanvas);

// Audio
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

// Input
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
  for(var i=0;i<gps.length;i++){var g=gps[i];if(!g)continue;
    GpConnected=true;controllerStatus.textContent='🎮 Controller: Connected';controllerStatus.style.color='#4f4';
    g.buttons.forEach(function(btn,idx){if(btn.pressed&&!GpButtons[idx])GpButtonsJust[idx]=true;GpButtons[idx]=btn.pressed;});
    return g;
  }return null;
}
// Cached gamepad state — polled once per frame
var _gpCache=null;
function gpPoll(){if(!_gpCache)_gpCache=pollGamepad();return _gpCache;}
function dx(){
  var d=0,g=gpPoll();
  if(Keys['KeyA']||Keys['ArrowLeft']||(g&&g.axes[0]<-0.5))d--;
  if(Keys['KeyD']||Keys['ArrowRight']||(g&&g.axes[0]>0.5))d++;
  if(g){if(g.buttons[14]&&g.buttons[14].pressed)d--;if(g.buttons[15]&&g.buttons[15].pressed)d++;}
  return d;
}
function dy(){
  var d=0,g=gpPoll();
  if(Keys['KeyW']||Keys['ArrowUp']||(g&&g.axes[1]<-0.5))d--;
  if(Keys['KeyS']||Keys['ArrowDown']||(g&&g.axes[1]>0.5))d++;
  if(g){if(g.buttons[12]&&g.buttons[12].pressed)d--;if(g.buttons[13]&&g.buttons[13].pressed)d++;}
  return d;
}
function inpInteract(){return KeysJust['KeyZ']||KeysJust['Space']||GpButtonsJust[0];}
function inpCancel(){return KeysJust['KeyX']||KeysJust['Escape']||GpButtonsJust[1];}
function inpMenu(){return KeysJust['Enter']||GpButtonsJust[9];}
function clearJust(){KeysJust={};GpButtonsJust={};_gpCache=null;}

// Game state
var Game={state:'title',prevState:null,stateTime:0,gold:500,inventory:[],party:[],questFlags:{},time:0};
function setState(s){Game.prevState=Game.state;Game.state=s;Game.stateTime=0;}

// Sprite drawing
function drawChar(x,y,dir,frame,species,hair,eye,skin,outfit){
  var f=frame%3,lo=f===1?1:f===2?-1:0,as=f===1?1:f===2?-1:0;
  ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(x-5,y+8,12,4);
  ctx.fillStyle=outfit||'#3344aa';
  ctx.fillRect(x-4+lo,y+2,3,5);ctx.fillRect(x+1-lo,y+2,3,5);
  ctx.fillStyle='#222';
  ctx.fillRect(x-5+lo,y+6,4,2);ctx.fillRect(x+1-lo,y+6,4,2);
  ctx.fillRect(x-4,y-6,8,8);
  ctx.fillStyle=skin||'#ffccaa';
  ctx.fillRect(x-6,y-5+as,2,5);ctx.fillRect(x+5,y-5-as,2,5);
  ctx.fillRect(x-4,y-13,8,8);
  ctx.fillStyle=eye||'#44ddff';
  if(dir===0){ctx.fillRect(x-3,y-10,2,2);ctx.fillRect(x+1,y-10,2,2);}
  else if(dir===1){ctx.fillRect(x-3,y-10,2,2);}
  else if(dir===2){ctx.fillRect(x+1,y-10,2,2);}
  ctx.fillStyle=hair||'#ffdd44';
  if(dir!==3){ctx.fillRect(x-5,y-14,10,3);ctx.fillRect(x-5,y-13,2,5);ctx.fillRect(x+4,y-13,2,5);}
  else{ctx.fillRect(x-5,y-14,10,5);}
  if(species==='cat'){
    ctx.fillStyle=hair||'#ffdd44';ctx.fillRect(x-5,y-18,3,5);ctx.fillRect(x+3,y-18,3,5);
    ctx.fillStyle='#ff8866';ctx.fillRect(x-4,y-17,1,3);ctx.fillRect(x+4,y-17,1,3);
  } else if(species==='frog'){
    ctx.fillStyle='#44aa66';ctx.fillRect(x-6,y-16,4,5);ctx.fillRect(x+3,y-16,4,5);
    ctx.fillStyle='#44ff44';ctx.fillRect(x-5,y-15,2,2);ctx.fillRect(x+4,y-15,2,2);
    ctx.fillStyle='#55bb77';ctx.fillRect(x-2,y-6,4,2);
  } else if(species==='dragon'){
    ctx.fillStyle='#cc3333';ctx.fillRect(x-5,y-18,2,5);ctx.fillRect(x+4,y-18,2,5);
    ctx.fillStyle='#bb3333';ctx.fillRect(x-2,y-7,4,2);
    ctx.fillStyle='#aa2222';ctx.fillRect(x+5,y+2,5,2);ctx.fillRect(x+9,y-1,2,4);
  } else if(species==='robot'){
    ctx.fillStyle='#44ffff';ctx.fillRect(x-2,y-11,4,4);
    ctx.fillStyle='#8899aa';ctx.fillRect(x-5,y-14,10,3);ctx.fillRect(x,y-18,1,5);
    ctx.fillStyle='#44ffff';ctx.fillRect(x,y-17,1,1);
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
    townie2:{s:null,h:'#cc8833',e:'#ff4444',sk:'#ddaa88',o:'#ff66aa'},
    hermit:{s:null,h:'#aaaacc',e:'#88aaff',sk:'#aabbcc',o:'#4466aa'}
  };
  var c=cfg[type]||cfg.townie1;
  drawChar(x,y,dir,frame,c.s,c.h,c.e,c.sk,c.o);
}

function drawTile(tx,ty,type){
  var x=tx*E.TILE,y=ty*E.TILE,t=E.TILE;
  if(type===T.FLOOR){ctx.fillStyle=(tx+ty)%2===0?'#2a2a4a':'#252545';ctx.fillRect(x,y,t,t);}
  else if(type===T.WALL){ctx.fillStyle=(tx+ty)%2===0?'#444466':'#3a3a5a';ctx.fillRect(x,y,t,t);ctx.fillStyle='rgba(0,0,0,0.2)';ctx.fillRect(x,y+t-3,t,3);}
  else if(type===T.DOOR){ctx.fillStyle='#664422';ctx.fillRect(x,y,t,t);ctx.fillStyle='#553311';ctx.fillRect(x+2,y+2,t-4,t-4);ctx.fillStyle='#ffaa00';ctx.fillRect(x+t-6,y+t/2-2,4,4);}
  else if(type===T.WATER){ctx.fillStyle=(tx+ty+Math.floor(Game.time/30))%2===0?'#2244aa':'#1a33aa';ctx.fillRect(x,y,t,t);}
  else if(type===T.BRIDGE){ctx.fillStyle='#664422';ctx.fillRect(x,y,t,t);ctx.fillStyle='#553311';ctx.fillRect(x,y+3,t,3);ctx.fillRect(x,y+t-6,t,3);}
  else if(type===T.GRASS){ctx.fillStyle=(tx+ty)%2===0?'#225533':'#1a4428';ctx.fillRect(x,y,t,t);if((tx*7+ty*13)%5===0){ctx.fillStyle='#337744';ctx.fillRect(x+6+(tx%4),y+3,3,6);}}
  else if(type===T.PATH){ctx.fillStyle=(tx+ty)%2===0?'#554433':'#4a3a2a';ctx.fillRect(x,y,t,t);}
  else if(type===T.COUNTER){ctx.fillStyle='#664422';ctx.fillRect(x,y,t,t);ctx.fillStyle='#553311';ctx.fillRect(x,y,t,4);}
  else if(type===T.SHELF){ctx.fillStyle='#553311';ctx.fillRect(x,y,t,t);ctx.fillStyle='#88aacc';ctx.fillRect(x+3,y+4,6,4);ctx.fillRect(x+12,y+12,8,4);}
  else if(type===T.PLANT){ctx.fillStyle='#2a2a4a';ctx.fillRect(x,y,t,t);ctx.fillStyle='#553322';ctx.fillRect(x+8,y+12,8,10);ctx.fillStyle='#33cc66';ctx.fillRect(x+4,y+3,14,10);ctx.fillStyle='#116633';ctx.fillRect(x+7,y+6,8,6);}
  else if(type===T.SIGN){ctx.fillStyle='#664422';ctx.fillRect(x+8,y+5,6,14);ctx.fillStyle='#553311';ctx.fillRect(x+3,y+3,14,5);}
  else if(type===T.CHEST){ctx.fillStyle='#886644';ctx.fillRect(x+3,y+8,14,12);ctx.fillStyle='#553322';ctx.fillRect(x+3,y+8,14,4);ctx.fillStyle='#ffaa00';ctx.fillRect(x+7,y+12,6,4);}
  else if(type===T.GATE){ctx.fillStyle='#778899';ctx.fillRect(x,y,t,t);ctx.fillStyle='#556677';ctx.fillRect(x+3,y+3,t-6,t-6);ctx.fillStyle='#ffaa00';ctx.fillRect(x+8,y+8,6,6);}
  else if(type===T.PORTAL){var p=Math.sin(Game.time*0.1)*0.3+0.7;ctx.fillStyle='rgba(100,50,255,'+p+')';ctx.fillRect(x+3,y+3,t-6,t-6);ctx.fillStyle='rgba(150,100,255,'+(p*0.7)+')';ctx.fillRect(x+7,y+7,t-14,t-14);}
  else if(type===T.BED){ctx.fillStyle='#664422';ctx.fillRect(x,y+5,t,t-5);ctx.fillStyle='#3344aa';ctx.fillRect(x+1,y+6,t-2,t-7);ctx.fillStyle='#ffffff';ctx.fillRect(x+1,y+6,8,5);}
  else if(type===T.TABLE){ctx.fillStyle='#664422';ctx.fillRect(x+1,y+3,t-3,4);ctx.fillStyle='#553311';ctx.fillRect(x+3,y+7,3,t-7);ctx.fillRect(x+t-6,y+7,3,t-7);}
  else if(type===T.BAR){ctx.fillStyle='#553322';ctx.fillRect(x,y,t,t);ctx.fillStyle='#886644';ctx.fillRect(x,y,t,4);ctx.fillStyle='#ffaa00';ctx.fillRect(x+4,y+5,3,4);ctx.fillStyle='#ff3344';ctx.fillRect(x+12,y+5,3,4);}
  else if(type===T.STAIRS){for(var i=0;i<4;i++){ctx.fillStyle=i%2===0?'#778899':'#556677';ctx.fillRect(x,y+i*5,t,5);}}
  else if(type===T.VOID){ctx.fillStyle=(Math.sin(Game.time*0.05+tx+ty)>0)?'#1a0a2a':'#0a0a1a';ctx.fillRect(x,y,t,t);}
  else if(type===T.ICE){ctx.fillStyle=(tx+ty+Math.floor(Game.time/40))%2===0?'#aaccff':'#88aadd';ctx.fillRect(x,y,t,t);ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fillRect(x+3,y+3,6,6);}
  else if(type===T.LAVA){ctx.fillStyle=(tx+ty+Math.floor(Game.time/20))%2===0?'#ff4400':'#cc2200';ctx.fillRect(x,y,t,t);ctx.fillStyle='rgba(255,200,0,0.4)';ctx.fillRect(x+6,y+6,8,8);}
}
