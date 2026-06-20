// maps.js — Town map, overworld map, tile data, NPCs, warps
var TownMap={w:60,h:40,data:[],npcs:[],signs:[],chests:[]};
(function(){
  var x,y;
  TownMap.data=[];
  for(y=0;y<TownMap.h;y++){TownMap.data[y]=[];for(x=0;x<TownMap.w;x++)TownMap.data[y][x]=T.FLOOR;}
  // Crown Spire
  for(y=2;y<12;y++)for(x=24;x<36;x++)TownMap.data[y][x]=T.WALL;
  for(y=3;y<11;y++)for(x=25;x<35;x++)TownMap.data[y][x]=T.FLOOR;
  TownMap.data[11][29]=T.DOOR;TownMap.data[11][30]=T.DOOR;
  TownMap.data[4][27]=T.BED;TownMap.data[4][32]=T.TABLE;
  TownMap.data[6][26]=T.SHELF;TownMap.data[6][34]=T.SHELF;
  TownMap.data[9][28]=T.STAIRS;TownMap.data[9][29]=T.STAIRS;
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
  // Signs
  TownMap.signs=[
    {x:28,y:13,text:"<- Crown Spire"},{x:12,y:13,text:"-> Weapon Shop"},
    {x:46,y:13,text:"-> Armor Shop"},{x:9,y:25,text:"v The Nebula Tavern"},
    {x:48,y:25,text:"v Healer's Hall"},{x:4,y:13,text:"-> Material Shop"},
    {x:5,y:11,text:"^ Training Ground"},{x:28,y:29,text:"v Stargate Dock"}
  ];
  // Chests
  TownMap.chests=[
    {x:26,y:4,taken:false,item:{name:'Plasma Blade',type:'weapon',rarity:'Common',atk:5,level:1,id:'c1'}},
    {x:33,y:4,taken:false,item:{name:'Nano Patch',type:'consumable',rarity:'Common',heal:30,level:1,id:'c2'}},
    {x:6,y:16,taken:false,item:{name:'Scrap Metal',type:'material',rarity:'Common',level:1,id:'c3'}},
  ];
  // NPCs
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
    {x:28,y:8,type:'robot',name:'Pip',dir:0,dialogue:["*BEEP* Oh! A visitor!","I've been down here as long as I can remember.","I can repair things! And scan enemies!","If you're going out there... could I come?","*whirr* That means yes!"],recruitable:true},
  ];
})();
TownMap.isSolid=function(x,y){if(x<0||x>=this.w||y<0||y>=this.h)return true;var t=this.data[y][x];return t===T.WALL||t===T.COUNTER||t===T.SHELF||t===T.TABLE||t===T.BAR||t===T.BED;};
TownMap.getNPCAt=function(x,y){return this.npcs.find(function(n){return n.x===x&&n.y===y;});};
TownMap.getSignAt=function(x,y){return this.signs.find(function(s){return s.x===x&&s.y===y;});};
TownMap.getChestAt=function(x,y){return this.chests.find(function(c){return c.x===x&&c.y===y&&!c.taken;});};

var OverworldMap={w:100,h:80,data:[],bosses:[],npcs:[]};
(function(){
  var x,y;
  OverworldMap.data=[];
  for(y=0;y<OverworldMap.h;y++){OverworldMap.data[y]=[];for(x=0;x<OverworldMap.w;x++)OverworldMap.data[y][x]=T.GRASS;}
  // Path from town
  for(x=20;x<70;x++){OverworldMap.data[5][x]=T.PATH;OverworldMap.data[6][x]=T.PATH;}
  for(y=1;y<30;y++){OverworldMap.data[y][30]=T.PATH;OverworldMap.data[y][31]=T.PATH;}
  // Void Scar zone
  for(y=15;y<40;y++)for(x=35;x<70;x++)OverworldMap.data[y][x]=T.VOID;
  // Water + bridge
  for(y=42;y<60;y++)for(x=10;x<50;x++)OverworldMap.data[y][x]=T.WATER;
  for(x=10;x<50;x++)OverworldMap.data[50][x]=T.BRIDGE;
  // Boss arena 1
  for(y=20;y<30;y++)for(x=60;x<72;x++)OverworldMap.data[y][x]=T.FLOOR;
  OverworldMap.data[24][60]=T.GATE;OverworldMap.data[24][61]=T.GATE;
  OverworldMap.data[25][60]=T.GATE;OverworldMap.data[25][61]=T.GATE;
  // Path to Frozen Wastes
  for(x=70;x<90;x++){OverworldMap.data[25][x]=T.PATH;OverworldMap.data[26][x]=T.PATH;}
  for(y=25;y<50;y++){OverworldMap.data[y][85]=T.PATH;OverworldMap.data[y][86]=T.PATH;}
  // Frozen Wastes zone
  for(y=40;y<70;y++)for(x=60;x<95;x++)OverworldMap.data[y][x]=T.ICE;
  // Lava patches
  for(y=55;y<65;y++)for(x=70;x<80;x++)OverworldMap.data[y][x]=T.LAVA;
  // Boss arena 2
  for(y=58;y<62;y++)for(x=88;x<92;x++)OverworldMap.data[y][x]=T.FLOOR;
  OverworldMap.data[59][87]=T.GATE;OverworldMap.data[59][88]=T.GATE;
  OverworldMap.data[60][87]=T.GATE;OverworldMap.data[60][88]=T.GATE;
  // Bosses
  OverworldMap.bosses=[
    {x:65,y:24,type:'void_sentinel',defeated:false},
    {x:89,y:59,type:'frozen_matriarch',defeated:false}
  ];
  // NPCs
  OverworldMap.npcs=[
    {x:25,y:49,type:'frog',name:'Brimble',dir:0,dialogue:["Ribbit... oh, hello traveler.","The waters here are tainted by the void.","You're heading into the Scar? Let me come with you.","...Friend. That's what I call everyone."],recruitable:true},
    {x:50,y:10,type:'townie1',name:'Scout Venn',dir:0,dialogue:["The Void Scar is ahead. Be careful.","I've seen the Sentinel. It's massive.","There's a frog person by the bridge."]},
    {x:75,y:25,type:'dragon',name:'Drakkor Ashveil',dir:0,dialogue:["...You dare approach the last Drakonid?","My clutch fell to the Void. I alone remain.","I have nothing left but my fire. It is yours.","Do not mistake this for friendship. I fight for vengeance.","...But I suppose you'll do. Lead on."],recruitable:true},
    {x:80,y:45,type:'hermit',name:'Frost Hermit',dir:0,dialogue:["The Frozen Wastes are deadly.","There's something ancient beneath the ice. The Matriarch.","She was once a guardian. The Void corrupted her.","Bring fire. Lots of it."]},
  ];
})();
OverworldMap.isSolid=function(x,y){if(x<0||x>=this.w||y<0||y>=this.h)return true;return this.data[y][x]===T.WATER||this.data[y][x]===T.WALL||this.data[y][x]===T.LAVA;};
OverworldMap.checkEncounter=function(x,y){if(this.data[y]&&this.data[y][x]===T.VOID&&Math.random()<0.03)return 'void';if(this.data[y]&&this.data[y][x]===T.ICE&&Math.random()<0.025)return 'ice';return false;};
OverworldMap.getNPCAt=function(x,y){if(!this.npcs)return null;return this.npcs.find(function(n){return n.x===x&&n.y===y;});};
