// ui.js — UI systems: dialogue, shop, inventory, HUD, title screen, evolution
var DialogueSys={active:false,lines:[],curLine:0,curChar:0,charTimer:0,charDelay:2,npc:null,onComplete:null,choiceMode:false,choices:[],choiceIndex:0,boxY:E.VIEW_H-70};
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
  if(this.curChar<this.lines[this.curLine].length){this.charTimer++;if(this.charTimer>=this.charDelay){this.charTimer=0;this.curChar++;}}
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
  uiCtx.fillStyle='rgba(10,10,30,0.92)';uiCtx.fillRect(4,this.boxY,E.VIEW_W-8,64);
  uiCtx.strokeStyle='#4488ff';uiCtx.lineWidth=1;uiCtx.strokeRect(4,this.boxY,E.VIEW_W-8,64);
  if(this.choiceMode){
    var self=this;this.choices.forEach(function(ch,i){var cy=self.boxY+10+i*18;
      if(i===self.choiceIndex){uiCtx.fillStyle='#4488ff';uiCtx.fillRect(8,cy-2,E.VIEW_W-16,18);uiCtx.fillStyle='#fff';}else uiCtx.fillStyle='#aaa';
      uiCtx.font='11px monospace';uiCtx.fillText(ch.text,14,cy+12);
    });return;
  }
  if(this.npc){uiCtx.fillStyle='#44ddff';uiCtx.font='11px monospace';uiCtx.fillText(this.npc.name,12,this.boxY+14);}
  var text=this.lines[this.curLine].substring(0,this.curChar);
  uiCtx.fillStyle='#ddd';uiCtx.font='11px monospace';
  var words=text.split(' '),line='',lineY=this.boxY+28;
  words.forEach(function(w){var test=w+' ';
    if(uiCtx.measureText(line+test).width>E.VIEW_W-28){uiCtx.fillText(line,12,lineY);line=test;lineY+=14;}else line+=test;
  });
  uiCtx.fillText(line,12,lineY);
  if(this.curChar>=this.lines[this.curLine].length&&this.curLine<this.lines.length-1){
    if(Math.floor(Game.time/30)%2){uiCtx.fillStyle='#ffcc33';uiCtx.fillText('▼',E.VIEW_W-24,this.boxY+54);}
  }
};

// ─── SHOP ───────────────────────────────────────────────────
var ShopSys={active:false,shopType:null,cursor:0,mode:'main',message:'',messageTimer:0};
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
ShopSys.start=function(type){this.shopType=type;this.mode='main';this.cursor=0;this.message='';this.messageTimer=0;this.active=true;setState('shop');SFX.shop();};
ShopSys.update=function(){
  if(!this.active)return;
  var self=this;if(this.messageTimer>0)this.messageTimer--;
  if(this.mode==='main'){
    var opts=this.shopType==='healer'?[{t:'Heal Party (50g)',a:'heal'},{t:'Leave',a:'leave'}]:[{t:'Buy',a:'buy'},{t:'Sell',a:'sell'},{t:'Upgrade',a:'upgrade'},{t:'Leave',a:'leave'}];
    if(inpCancel()){this.end();return;}
    if(inpInteract()){this.doAction(opts[this.cursor].a);return;}
    if(KeysJust['ArrowUp']||KeysJust['KeyW']){this.cursor=Math.max(0,this.cursor-1);SFX.select();}
    if(KeysJust['ArrowDown']||KeysJust['KeyS']){this.cursor=Math.min(opts.length-1,this.cursor+1);SFX.select();}
  } else if(this.mode==='buy'){
    if(inpCancel()){this.mode='main';this.cursor=0;return;}
    if(inpInteract()){var si=ShopCatalogs[this.shopType][this.cursor];if(si&&Game.gold>=si.price){Game.gold-=si.price;var it=si.fn();Game.inventory.push(it);this.message='Bought '+it.name+'!';SFX.confirm();}else this.message='Not enough gold!';this.messageTimer=120;return;}
    if(KeysJust['ArrowUp']||KeysJust['KeyW']){this.cursor=Math.max(0,this.cursor-1);SFX.select();}
    if(KeysJust['ArrowDown']||KeysJust['KeyS']){this.cursor=Math.min(ShopCatalogs[this.shopType].length-1,this.cursor+1);SFX.select();}
  } else if(this.mode==='sell'){
    if(inpCancel()){this.mode='main';this.cursor=0;return;}
    if(inpInteract()){var item=Game.inventory[this.cursor];if(item){var price=Math.floor((item.atk||item.def||item.hp||10)*2);Game.gold+=price;Game.inventory.splice(this.cursor,1);this.message='Sold '+item.name+' for '+price+'g!';SFX.confirm();this.cursor=Math.min(this.cursor,Math.max(0,Game.inventory.length-1));}this.messageTimer=120;return;}
    if(KeysJust['ArrowUp']||KeysJust['KeyW']){this.cursor=Math.max(0,this.cursor-1);SFX.select();}
    if(KeysJust['ArrowDown']||KeysJust['KeyS']){this.cursor=Math.min(Math.max(0,Game.inventory.length-1),this.cursor+1);SFX.select();}
  } else if(this.mode==='upgrade'){
    if(inpCancel()){this.mode='main';this.cursor=0;return;}
    if(inpInteract()){var upItem=Game.inventory[this.cursor];if(upItem&&(upItem.type==='weapon'||upItem.type==='armor')&&upItem.level<10){var cost=upItem.level*50;var matType=upItem.type==='weapon'?'Scrap Metal':'Bio Gel';var matIdx=Game.inventory.findIndex(function(i){return i.name===matType;});if(Game.gold>=cost&&matIdx>=0){Game.gold-=cost;Game.inventory.splice(matIdx,1);upItem.level++;if(upItem.atk)upItem.atk=Math.floor(upItem.atk*1.15);if(upItem.def)upItem.def=Math.floor(upItem.def*1.15);if(upItem.hp)upItem.hp=Math.floor(upItem.hp*1.1);this.message=upItem.name+' upgraded to +'+upItem.level+'!';SFX.confirm();}else this.message='Need '+cost+'g and '+matType+'!';}this.messageTimer=120;return;}
    if(KeysJust['ArrowUp']||KeysJust['KeyW']){this.cursor=Math.max(0,this.cursor-1);SFX.select();}
    if(KeysJust['ArrowDown']||KeysJust['KeyS']){this.cursor=Math.min(Math.max(0,Game.inventory.length-1),this.cursor+1);SFX.select();}
  }
};
ShopSys.doAction=function(a){
  if(a==='leave'){this.end();}
  else if(a==='heal'){if(Game.gold>=50){Game.gold-=50;Game.party.forEach(function(c){c.hp=c.maxHp;c.sp=c.maxSp;});this.message='Party healed!';SFX.heal();}else this.message='Not enough gold!';this.messageTimer=120;}
  else if(a==='buy'){this.mode='buy';this.cursor=0;}
  else if(a==='sell'){this.mode='sell';this.cursor=0;}
  else if(a==='upgrade'){this.mode='upgrade';this.cursor=0;}
};
ShopSys.end=function(){this.active=false;setState(Game.prevState==='dialogue'?'town':Game.prevState);};
ShopSys.render=function(){
  if(!this.active)return;
  uiCtx.fillStyle='rgba(10,10,30,0.95)';uiCtx.fillRect(30,15,E.VIEW_W-60,E.VIEW_H-30);
  uiCtx.strokeStyle='#4488ff';uiCtx.lineWidth=2;uiCtx.strokeRect(30,15,E.VIEW_W-60,E.VIEW_H-30);
  uiCtx.fillStyle='#ffcc33';uiCtx.font='14px monospace';
  var titles={weapons:'⚔ Edge of Tomorrow',armor:'🛡 Aegis Outfitters',materials:'✨ Void & Spark',healer:'💚 Healer\'s Hall'};
  uiCtx.fillText(titles[this.shopType]||'Shop',42,34);
  uiCtx.fillStyle='#ffcc33';uiCtx.font='11px monospace';uiCtx.fillText('Gold: '+Game.gold+'g',E.VIEW_W-120,34);
  var self=this;
  if(this.mode==='main'){
    var opts=this.shopType==='healer'?[{t:'Heal Party (50g)',a:'heal'},{t:'Leave',a:'leave'}]:[{t:'Buy',a:'buy'},{t:'Sell',a:'sell'},{t:'Upgrade',a:'upgrade'},{t:'Leave',a:'leave'}];
    opts.forEach(function(o,i){var y=55+i*24;
      if(i===self.cursor){uiCtx.fillStyle='#4488ff';uiCtx.fillRect(42,y-14,E.VIEW_W-84,22);uiCtx.fillStyle='#fff';}else uiCtx.fillStyle='#aaa';
      uiCtx.font='11px monospace';uiCtx.fillText(o.t,52,y);
    });
  } else if(this.mode==='buy'){
    (ShopCatalogs[this.shopType]||[]).forEach(function(si,i){var y=55+i*20;
      if(i===self.cursor){uiCtx.fillStyle='#4488ff';uiCtx.fillRect(42,y-12,E.VIEW_W-84,20);uiCtx.fillStyle='#fff';}else uiCtx.fillStyle='#aaa';
      uiCtx.font='11px monospace';uiCtx.fillText(si.name+' - '+si.price+'g',52,y);
    });
  } else if(this.mode==='sell'){
    Game.inventory.forEach(function(item,i){var y=55+i*20;
      if(i===self.cursor){uiCtx.fillStyle='#4488ff';uiCtx.fillRect(42,y-12,E.VIEW_W-84,20);uiCtx.fillStyle='#fff';}else uiCtx.fillStyle=Items.rarityColor(item.rarity);
      uiCtx.font='11px monospace';uiCtx.fillText(item.name+' +'+item.level+' ('+Math.floor((item.atk||item.def||item.hp||10)*2)+'g)',52,y);
    });
  } else if(this.mode==='upgrade'){
    Game.inventory.forEach(function(item,i){var y=55+i*20;
      if(i===self.cursor){uiCtx.fillStyle='#4488ff';uiCtx.fillRect(42,y-12,E.VIEW_W-84,20);uiCtx.fillStyle='#fff';}else uiCtx.fillStyle=Items.rarityColor(item.rarity);
      uiCtx.font='11px monospace';var canUp=(item.type==='weapon'||item.type==='armor')&&item.level<10;
      uiCtx.fillText(item.name+' +'+item.level+(canUp?' (Upgrade: '+item.level*50+'g)':''),52,y);
    });
  }
  if(this.message&&this.messageTimer>0){uiCtx.fillStyle='#ffcc33';uiCtx.font='11px monospace';uiCtx.fillText(this.message,42,E.VIEW_H-40);}
};

// ─── INVENTORY / EQUIPMENT ──────────────────────────────────
var InvSys={active:false,mode:'list',cursor:0,charIndex:0,slotIndex:0,slotNames:['weapon','armor','accessory1','accessory2','implant'],slotLabels:['Weapon','Armor','Accessory 1','Accessory 2','Implant']};
InvSys.open=function(){this.active=true;this.mode='list';this.cursor=0;this.charIndex=0;this.slotIndex=0;setState('inventory');};
InvSys.close=function(){this.active=false;setState(Game.prevState==='inventory'?Game.prevState:'town');};
InvSys.update=function(){
  if(!this.active)return;
  var self=this;
  if(this.mode==='list'){
    if(inpCancel()){this.close();return;}
    if(inpInteract()){var item=Game.inventory[this.cursor];if(item&&(item.type==='weapon'||item.type==='armor'||item.type==='accessory')){this.mode='itemAction';this._item=item;this._itemIdx=this.cursor;}else if(item&&item.type==='consumable'){var target=Game.party.findIndex(function(c){return c.hp>0&&c.hp<c.maxHp;});if(target>=0&&item.heal){Game.party[target].hp=Math.min(Game.party[target].maxHp,Game.party[target].hp+item.heal);SFX.heal();Game.inventory.splice(this.cursor,1);this.cursor=Math.min(this.cursor,Math.max(0,Game.inventory.length-1));}else if(item.revive){var dead=Game.party.findIndex(function(c){return c.hp<=0;});if(dead>=0){Game.party[dead].hp=Math.floor(Game.party[dead].maxHp*0.3);SFX.heal();Game.inventory.splice(this.cursor,1);}}}return;}
    if(KeysJust['ArrowUp']||KeysJust['KeyW']){this.cursor=Math.max(0,this.cursor-1);SFX.select();}
    if(KeysJust['ArrowDown']||KeysJust['KeyS']){this.cursor=Math.min(Math.max(0,Game.inventory.length-1),this.cursor+1);SFX.select();}
    if(KeysJust['Tab']||GpButtonsJust[4]){this.mode='equip';this.charIndex=0;this.slotIndex=0;return;}
  } else if(this.mode==='itemAction'){
    var actions=['Equip','Drop','Cancel'];
    if(inpCancel()){this.mode='list';return;}
    if(inpInteract()){var act=actions[this.cursor];if(act==='Equip'){this.mode='pickChar';this._equipItem=this.cursor;this.cursor=0;}else if(act==='Drop'){Game.inventory.splice(this._itemIdx,1);this.mode='list';this.cursor=Math.min(this.cursor,Math.max(0,Game.inventory.length-1));}else{this.mode='list';}return;}
    if(KeysJust['ArrowUp']||KeysJust['KeyW']){this.cursor=Math.max(0,this.cursor-1);SFX.select();}
    if(KeysJust['ArrowDown']||KeysJust['KeyS']){this.cursor=Math.min(actions.length-1,this.cursor+1);SFX.select();}
  } else if(this.mode==='pickChar'){
    if(inpCancel()){this.mode='itemAction';this.cursor=0;return;}
    if(inpInteract()){var ch=Game.party[this.cursor];if(ch){var item=Game.inventory[this._itemIdx];var slot=item.type==='weapon'?'weapon':item.type==='armor'?'armor':item.type==='accessory'?(ch.equipment.accessory1?'accessory2':'accessory1'):item.type==='implant'?'implant':null;if(slot){var old=ch.equipment[slot];ch.equipment[slot]=item;var idx=Game.inventory.indexOf(item);if(idx>=0)Game.inventory.splice(idx,1);if(old)Game.inventory.push(old);SFX.confirm();}}this.mode='list';return;}
    if(KeysJust['ArrowUp']||KeysJust['KeyW']){this.cursor=Math.max(0,this.cursor-1);SFX.select();}
    if(KeysJust['ArrowDown']||KeysJust['KeyS']){this.cursor=Math.min(Game.party.length-1,this.cursor+1);SFX.select();}
  } else if(this.mode==='equip'){
    if(inpCancel()){this.mode='list';this.cursor=0;return;}
    if(inpInteract()){var ch2=Game.party[this.charIndex];var slot=this.slotNames[this.slotIndex];var equipped=ch2.equipment[slot];if(equipped){Game.inventory.push(equipped);ch2.equipment[slot]=null;SFX.confirm();}else{var fitType=slot==='weapon'?'weapon':slot==='armor'?'armor':slot==='implant'?'implant':'accessory';var fitItems=Game.inventory.filter(function(i){return i.type===fitType;});if(fitItems.length>0){ch2.equipment[slot]=fitItems[0];var idx2=Game.inventory.indexOf(fitItems[0]);if(idx2>=0)Game.inventory.splice(idx2,1);SFX.confirm();}}return;}
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
  uiCtx.fillStyle='rgba(5,5,20,0.95)';uiCtx.fillRect(15,10,E.VIEW_W-30,E.VIEW_H-20);
  uiCtx.strokeStyle='#4488ff';uiCtx.lineWidth=2;uiCtx.strokeRect(15,10,E.VIEW_W-30,E.VIEW_H-20);
  var tabs=['Inventory','Equipment'];
  tabs.forEach(function(t,i){var tx=25+i*100;
    if((self.mode==='list'||self.mode==='itemAction'||self.mode==='pickChar')&&i===0)uiCtx.fillStyle='#4488ff';
    else if(self.mode==='equip'&&i===1)uiCtx.fillStyle='#4488ff';
    else uiCtx.fillStyle='#334';
    uiCtx.fillRect(tx,16,90,18);uiCtx.fillStyle='#fff';uiCtx.font='11px monospace';uiCtx.fillText(t,tx+10,28);
  });
  if(this.mode==='list'||this.mode==='itemAction'||this.mode==='pickChar'){
    uiCtx.fillStyle='#aaa';uiCtx.font='10px monospace';uiCtx.fillText('Gold: '+Game.gold+'g',E.VIEW_W-100,28);
    var startY=40,maxVisible=10;
    var visible=Game.inventory.slice(0,maxVisible);
    visible.forEach(function(item,i){var iy=startY+i*16;
      if(i===self.cursor){uiCtx.fillStyle='#4488ff44';uiCtx.fillRect(20,iy-2,E.VIEW_W-40,16);}
      uiCtx.fillStyle=Items.rarityColor(item.rarity);uiCtx.font='10px monospace';
      var label=item.name+(item.level>1?' +'+item.level:'');
      if(item.atk)label+=' ATK:'+item.atk;if(item.def)label+=' DEF:'+item.def;if(item.hp)label+=' HP:'+item.hp;if(item.heal)label+=' Heal:'+item.heal;
      uiCtx.fillText(label,28,iy+10);
    });
    if(Game.inventory.length===0){uiCtx.fillStyle='#666';uiCtx.font='11px monospace';uiCtx.fillText('Inventory is empty',80,E.VIEW_H/2);}
    if(this.mode==='itemAction'){var actions=['Equip','Drop','Cancel'];var ax=E.VIEW_W-110,ay=60;uiCtx.fillStyle='rgba(10,10,30,0.95)';uiCtx.fillRect(ax-4,ay-4,100,actions.length*18+8);uiCtx.strokeStyle='#ffcc33';uiCtx.strokeRect(ax-4,ay-4,100,actions.length*18+8);
      actions.forEach(function(a,i){if(i===self.cursor){uiCtx.fillStyle='#ffcc3344';uiCtx.fillRect(ax-2,ay+i*16-2,96,16);uiCtx.fillStyle='#fff';}else uiCtx.fillStyle='#aaa';uiCtx.font='10px monospace';uiCtx.fillText(a,ax+4,ay+i*16+10);});
    }
    if(this.mode==='pickChar'){var px=E.VIEW_W-130,py=60;uiCtx.fillStyle='rgba(10,10,30,0.95)';uiCtx.fillRect(px-4,py-4,120,Game.party.length*18+8);uiCtx.strokeStyle='#44ddff';uiCtx.strokeRect(px-4,py-4,120,Game.party.length*18+8);
      Game.party.forEach(function(c,i){if(i===self.cursor){uiCtx.fillStyle='#44ddff44';uiCtx.fillRect(px-2,py+i*16-2,116,16);uiCtx.fillStyle='#fff';}else uiCtx.fillStyle='#aaa';uiCtx.font='10px monospace';uiCtx.fillText(c.name+' Lv'+c.level,px+4,py+i*16+10);});
    }
  } else if(this.mode==='equip'){
    var ch=Game.party[this.charIndex];
    Game.party.forEach(function(c,i){var cx=25+i*80;if(i===self.charIndex){uiCtx.fillStyle='#4488ff';uiCtx.fillRect(cx,38,74,16);uiCtx.fillStyle='#fff';}else uiCtx.fillStyle='#666';uiCtx.font='10px monospace';uiCtx.fillText(c.name,cx+4,48);});
    if(ch){drawChar(60,90,0,0,ch.species,ch.hairColor,ch.eyeColor,ch.skinColor,ch.outfitColor);var stats=getStats(ch);uiCtx.fillStyle='#44ddff';uiCtx.font='11px monospace';uiCtx.fillText(ch.name+' Lv'+ch.level+' '+ch.evolutionName,20,120);uiCtx.fillStyle='#aaa';uiCtx.font='10px monospace';uiCtx.fillText('HP:'+ch.hp+'/'+stats.hp+'  SP:'+ch.sp+'/'+ch.maxSp,20,134);uiCtx.fillText('ATK:'+stats.atk+'  DEF:'+stats.def+'  SPD:'+stats.spd+'  CRIT:'+stats.crit+'%',20,148);
      var self2=this;this.slotNames.forEach(function(slot,i){var sy=164+i*18;var label=self2.slotLabels[self2.slotNames.indexOf(slot)]+': ';var item=ch.equipment[slot];if(i===self.slotIndex){uiCtx.fillStyle='#ffcc3344';uiCtx.fillRect(20,sy-2,E.VIEW_W-40,18);uiCtx.fillStyle='#fff';}else uiCtx.fillStyle='#aaa';uiCtx.font='10px monospace';uiCtx.fillText(label+(item?item.name+(item.level>1?' +'+item.level:''):'[empty]'),28,sy+10);});
    }
  }
  uiCtx.fillStyle='#666';uiCtx.font='9px monospace';
  if(this.mode==='list')uiCtx.fillText('Z:Use/Equip X:Back Tab:Equip',25,E.VIEW_H-8);
  else if(this.mode==='equip')uiCtx.fillText('Z:Unequip/Equip X:Back Tab:Inv ←→:Chara',25,E.VIEW_H-8);
  else uiCtx.fillText('Z:Select X:Back',25,E.VIEW_H-8);
};

// ─── TITLE SCREEN ───────────────────────────────────────────
var TitleSys={timer:0};
TitleSys.update=function(){
  this.timer++;
  if(inpInteract()&&this.timer>30){
    SFX.confirm();
    if(gameHasSave()){
      if(gameLoad()){Player.updateCamera();setState('town');autoSave();return;}
    }
    Game.party=[createLyra()];
    var sword=Items.create('weapon','Common',1);if(sword)Game.party[0].equipment.weapon=sword;
    var tunic=Items.create('armor','Common',1);if(tunic)Game.party[0].equipment.armor=tunic;
    Game.inventory.push(Items.create('consumable','Common',1));
    Game.inventory.push(Items.create('consumable','Common',1));
    Game.inventory.push(Items.create('material','Common',1));
    Game.gold=500;Player.init();setState('town');autoSave();
  }
};
TitleSys.render=function(){
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,E.VIEW_W,E.VIEW_H);
  for(var i=0;i<80;i++){var sx=(i*97+this.timer*0.3)%E.VIEW_W,sy=(i*53)%E.VIEW_H;ctx.fillStyle='rgba(255,255,255,'+(0.2+Math.sin(this.timer*0.03+i)*0.2)+')';ctx.fillRect(sx,sy,2,2);}
  ctx.fillStyle='#ffcc33';ctx.font='24px monospace';ctx.textAlign='center';ctx.fillText('STELLAR PRINCESSES',E.VIEW_W/2,80);
  ctx.fillStyle='#aa44ff';ctx.font='12px monospace';ctx.fillText('A Sci-Fi RPG',E.VIEW_W/2,100);
  drawChar(E.VIEW_W/2,160,0,Math.floor(this.timer/20)%3,'human','#ffdd44','#44ddff','#ffccaa','#aa44ff');
  if(this.timer>30&&Math.floor(this.timer/40)%2){ctx.fillStyle='#fff';ctx.font='12px monospace';ctx.fillText('Press A / Z / SPACE to start',E.VIEW_W/2,220);}
  ctx.fillStyle='#666';ctx.font='10px monospace';ctx.fillText('v2.0 — Modular Engine',E.VIEW_W/2,E.VIEW_H-12);
  ctx.textAlign='left';
};

// ─── EVOLUTION SEQUENCE ────────────────────────────────────
var EvoSys={active:false,timer:0};
function startEvolution(){EvoSys.active=true;EvoSys.timer=0;setState('evolution');}
EvoSys.update=function(){if(!this.active)return;this.timer++;if(inpInteract()&&this.timer>60){this.active=false;CombatSys.active=false;setState('overworld');}};
EvoSys.render=function(){
  if(!this.active)return;
  var t=this.timer;
  if(t<30){ctx.fillStyle='rgba(255,255,255,'+(1-t/30)+')';ctx.fillRect(0,0,E.VIEW_W,E.VIEW_H);return;}
  ctx.fillStyle='#0a0a2a';ctx.fillRect(0,0,E.VIEW_W,E.VIEW_H);
  for(var i=0;i<50;i++){var sx=(i*97+t*0.5)%E.VIEW_W,sy=(i*53)%E.VIEW_H;ctx.fillStyle='rgba(255,255,255,'+(0.3+Math.sin(t*0.05+i)*0.3)+')';ctx.fillRect(sx,sy,2,2);}
  var cy=E.VIEW_H/2+30;
  var glowSize=50+Math.sin(t*0.08)*12;
  var grad=ctx.createRadialGradient(E.VIEW_W/2,cy,0,E.VIEW_W/2,cy,glowSize);
  grad.addColorStop(0,'rgba(255,204,51,0.6)');grad.addColorStop(0.5,'rgba(170,68,255,0.3)');grad.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=grad;ctx.fillRect(0,cy-glowSize,E.VIEW_W,glowSize*2);
  drawChar(E.VIEW_W/2,cy,0,0,'human','#ffee88','#88ffff','#ffccaa','#cc66ff');
  ctx.fillStyle='#ffcc33';ctx.fillRect(E.VIEW_W/2-10,cy-24,20,5);ctx.fillRect(E.VIEW_W/2-8,cy-28,4,5);ctx.fillRect(E.VIEW_W/2+4,cy-28,4,5);ctx.fillRect(E.VIEW_W/2-2,cy-29,4,4);
  if(t>60){
    uiCtx.fillStyle='#ffcc33';uiCtx.font='14px monospace';uiCtx.textAlign='center';uiCtx.fillText('EVOLUTION',E.VIEW_W/2,40);
    uiCtx.fillStyle='#fff';uiCtx.font='11px monospace';uiCtx.fillText('Lyra has become the '+Game.party[0].evolutionName+'!',E.VIEW_W/2,60);
    uiCtx.fillStyle='#aaa';uiCtx.font='10px monospace';uiCtx.fillText('Press A / Z to continue',E.VIEW_W/2,E.VIEW_H-20);
    uiCtx.textAlign='left';
  }
};
