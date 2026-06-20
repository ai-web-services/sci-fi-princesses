// game.js — Main game loop, player, map rendering, recruitment
var Player={x:29,y:20,dir:0,frame:0,moving:false,moveTimer:0,moveDelay:6,stepCount:0,cameraX:0,cameraY:0};
Player.init=function(){this.x=29;this.y=20;this.dir=0;this.updateCamera();};
Player.updateCamera=function(){
  var map=Game.state==='town'?TownMap:OverworldMap;
  this.cameraX=Math.max(0,Math.min(map.w*E.TILE-E.VIEW_W,this.x*E.TILE-E.VIEW_W/2+E.TILE/2));
  this.cameraY=Math.max(0,Math.min(map.h*E.TILE-E.VIEW_H,this.y*E.TILE-E.VIEW_H/2+E.TILE/2));
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
          // Boss triggers
          if(Game.state==='overworld'){
            var boss=OverworldMap.bosses.find(function(b){return !b.defeated&&Math.abs(this.x-b.x)<=2&&Math.abs(this.y-b.y)<=2;}.bind(this));
            if(boss){CombatSys.startBoss(boss.type);return;}
          }
          // Encounter
          if(Game.state==='overworld'){var zone=map.checkEncounter(this.x,this.y);if(zone){CombatSys.startRandom(zone);return;}}
        }
      }
    }
  }else{this.moveTimer=0;}
  if(this.moving)this.frame=Math.floor(Game.time/12)%3;else this.frame=0;
  this.updateCamera();
};
Player.interact=function(){
  var map=Game.state==='town'?TownMap:OverworldMap;
  var ddx=[0,-1,1,0][this.dir],ddy=[1,0,0,-1][this.dir];
  var tx=this.x+ddx,ty=this.y+ddy;
  var npc=map.getNPCAt?map.getNPCAt(tx,ty):null;
  if(npc){
    SFX.talk();
    if(npc.shop&&!npc.recruitable){var shopType=npc.shop;DialogueSys.showText(npc.name+': '+npc.dialogue[Math.floor(Math.random()*npc.dialogue.length)],function(){ShopSys.start(shopType);});}
    else{DialogueSys.start(npc);}
    return;
  }
  var sign=map.getSignAt?map.getSignAt(tx,ty):null;
  if(sign){SFX.talk();DialogueSys.showText(sign.text);return;}
  var chest=map.getChestAt?map.getChestAt(tx,ty):null;
  if(chest){chest.taken=true;Game.inventory.push(chest.item);SFX.confirm();DialogueSys.showText('Found '+chest.item.name+'!');return;}
};

// ─── MAP RENDERING ──────────────────────────────────────────
function renderMap(){
  var map=Game.state==='town'?TownMap:OverworldMap;
  var camX=Player.cameraX,camY=Player.cameraY;
  var stx=Math.max(0,Math.floor(camX/E.TILE)),sty=Math.max(0,Math.floor(camY/E.TILE));
  var etx=Math.min(map.w-1,Math.ceil((camX+E.VIEW_W)/E.TILE)),ety=Math.min(map.h-1,Math.ceil((camY+E.VIEW_H)/E.TILE));
  for(var ty=sty;ty<=ety;ty++){for(var tx=stx;tx<=etx;tx++){drawTile(tx,ty,map.data[ty][tx]);}}
  // Signs
  if(map.signs)map.signs.forEach(function(s){if(s.x>=stx&&s.x<=etx&&s.y>=sty&&s.y<=ety)drawTile(s.x,s.y,T.SIGN);});
  // Chests
  if(map.chests)map.chests.forEach(function(c){if(!c.taken&&c.x>=stx&&c.x<=etx&&c.y>=sty&&c.y<=ety)drawTile(c.x,c.y,T.CHEST);});
  // NPCs
  if(map.npcs)map.npcs.forEach(function(n){if(n.x>=stx&&n.x<=etx&&n.y>=sty&&n.y<=ety&&n.x>=0)drawNPC(n.x*E.TILE+8-camX,n.y*E.TILE+8-camY,n.type,n.dir,Math.floor(Game.time/30)%3);});
  // Player
  var px=Player.x*E.TILE+8-camX,py=Player.y*E.TILE+8-camY;
  var pc=Game.party[0];
  drawChar(px,py,Player.dir,Player.frame,pc.species,pc.hairColor,pc.eyeColor,pc.skinColor,pc.outfitColor);
  if(pc.evolution>0){var ga=0.2+Math.sin(Game.time*0.1)*0.1;ctx.fillStyle='rgba(255,204,51,'+ga+')';ctx.fillRect(px-8,py-16,18,22);}
}

function renderHUD(){
  if(Game.state!=='town'&&Game.state!=='overworld')return;
  Game.party.forEach(function(c,i){
    var hx=6,hy=6+i*32;
    uiCtx.fillStyle='rgba(10,10,30,0.8)';uiCtx.fillRect(hx,hy,90,28);
    uiCtx.strokeStyle='#4488ff';uiCtx.lineWidth=1;uiCtx.strokeRect(hx,hy,90,28);
    uiCtx.fillStyle='#44ddff';uiCtx.font='10px monospace';uiCtx.fillText(c.name,hx+4,hy+12);
    uiCtx.fillStyle='#333';uiCtx.fillRect(hx+4,hy+16,56,4);
    uiCtx.fillStyle=c.hp>c.maxHp*0.3?'#33cc66':'#ff3344';uiCtx.fillRect(hx+4,hy+16,Math.max(0,56*(c.hp/c.maxHp)),4);
    uiCtx.fillStyle='#fff';uiCtx.font='8px monospace';uiCtx.fillText(c.hp+'/'+c.maxHp,hx+64,hy+20);
  });
  uiCtx.fillStyle='rgba(10,10,30,0.8)';uiCtx.fillRect(E.VIEW_W-80,6,74,18);
  uiCtx.fillStyle='#ffcc33';uiCtx.font='10px monospace';uiCtx.fillText(Game.gold+'g',E.VIEW_W-74,18);
  uiCtx.fillStyle='rgba(10,10,30,0.8)';uiCtx.fillRect(E.VIEW_W-100,26,94,16);
  uiCtx.fillStyle='#aaa';uiCtx.font='9px monospace';uiCtx.fillText(Game.state==='town'?'Nova Prime':'Void Frontier',E.VIEW_W-94,36);
  if(Game.party[0].evolution>0){uiCtx.fillStyle='#ffcc33';uiCtx.font='9px monospace';uiCtx.fillText('★ '+Game.party[0].evolutionName,E.VIEW_W-100,50);}
  uiCtx.fillStyle='rgba(10,10,30,0.6)';uiCtx.fillRect(6,E.VIEW_H-20,180,16);
  uiCtx.fillStyle='#888';uiCtx.font='8px monospace';uiCtx.fillText('D-Pad:Move A:Interact X:Menu',10,E.VIEW_H-7);
}

// ─── MAIN GAME LOOP ─────────────────────────────────────────
function gameLoop(){
  Game.time++;
  if(Game.state==='title'){TitleSys.update();}
  else if(Game.state==='town'||Game.state==='overworld'){
    if(inpMenu()){InvSys.open();}else{Player.update();if(inpInteract())Player.interact();}
  }
  else if(Game.state==='dialogue'){DialogueSys.update();}
  else if(Game.state==='shop'){ShopSys.update();}
  else if(Game.state==='combat'||Game.state==='boss'){CombatSys.update();}
  else if(Game.state==='evolution'){EvoSys.update();}
  else if(Game.state==='inventory'){InvSys.update();}

  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,E.VIEW_W,E.VIEW_H);
  uiCtx.clearRect(0,0,E.VIEW_W,E.VIEW_H);
  if(Game.state==='title'){TitleSys.render();}
  else if(Game.state==='town'||Game.state==='overworld'){renderMap();renderHUD();DialogueSys.render();ShopSys.render();}
  else if(Game.state==='dialogue'){renderMap();renderHUD();DialogueSys.render();}
  else if(Game.state==='shop'){renderMap();ShopSys.render();}
  else if(Game.state==='combat'||Game.state==='boss'){CombatSys.render();}
  else if(Game.state==='evolution'){EvoSys.render();}
  else if(Game.state==='inventory'){renderMap();InvSys.render();}
  clearJust();
  requestAnimationFrame(gameLoop);
}

// ─── RECRUITMENT HANDLER ────────────────────────────────────
var origDialogueStart=DialogueSys.start;
DialogueSys.start=function(npc){
  if(npc&&npc.recruitable&&!Game.questFlags['recruited_'+npc.name]){
    this.npc=npc;this.lines=npc.dialogue.slice();this.curLine=0;this.curChar=0;this.charTimer=0;
    this.active=true;this.choiceMode=false;
    this.onComplete=function(){
      DialogueSys.showChoices([{text:'Invite '+npc.name+' to join your party'},{text:'Maybe later'}],function(choice){
        if(choice&&choice.text.indexOf('Invite')>=0){
          if(npc.type==='cat'){Game.party.push(createErynn());}
          else if(npc.type==='frog'){Game.party.push(createBrimble());}
          else if(npc.type==='dragon'){Game.party.push(createDrakkor());}
          else if(npc.type==='robot'){Game.party.push(createPip());}
          Game.questFlags['recruited_'+npc.name]=true;
          DialogueSys.showText(npc.name+' joined the party!');
          // Remove NPC from map
          var map=Game.state==='town'?TownMap:OverworldMap;
          if(map.npcs){var idx=map.npcs.indexOf(npc);if(idx>=0){map.npcs.splice(idx,1);npc.x=-1;npc.y=-1;}}
        } else {setState(Game.prevState);}
      });
    };
    setState('dialogue');return;
  }
  origDialogueStart.call(this,npc);
};

// Start
requestAnimationFrame(gameLoop);
