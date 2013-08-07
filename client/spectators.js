var gameId = "spectators";
var spectatorsGame;
var frameNr = 0;
var fps = 50;
var groups = new Array('bgs', 'heros', 'floor', 'game_action', 'onlookers', 'you', 'fires', 'info', 'game');
var muted = false;

var gameSize = new Array(640, 112);
var battlegroundSize = new Array(640, 80);
var viewportX = 0;
var viewportSize = new Array(160, 112);
var viewportCenterX = viewportSize[0] / 2;
var fontSize = new Array(8,8);
var queueNrSize = new Array(4,7);
var floorPieceSize = new Array (32,64);
var nrFloorPieces = 20;
var meteorSize = new Array (32,64);
var rocketSize = new Array (32,32);
var heroSize = new Array (32, 32);
var bulletSize = new Array (10, 20);
var spectatorSize = new Array (9, 14);
var invaderSize = new Array(32, 32);
var bombSize = new Array (10,20);
var ammoSize = new Array(10,10);
var balloonSize = new Array (16,16);
var fireSize = new Array (8,4);
var nrFires = 80;

var nextHeroMsgShown = true;
var nextHeroMsgBlinkFrames = 25;
var nextHeroMsg = "Prepare for Boarding";

var arbitMsgVisible = false;
var arbitMsgStartFrame = 0;
var arbitMsgShowFrames = 150;
var arbitMsg = "";

var arbitMsg2Visible = false;
var arbitMsg2StartFrame = 0;
var arbitMsg2 = "";

var youId = "abc";
var youFemale = "";
var youAbsPos = 100;
var clientContext;
//-----------------------------------------------------------------------------------
// animation data
var heroFrames = 4; // nr of frames for anim
var heroAnimSpeed = 10; // after this nr of frames the anim will move (game runs with 50 fps)
var heroGhostAnimSpeed = 5;
var heroExplodeAnimSpeed = 10;
var heroJumpAnimSpeed = 5;

var nrBullets = 2;

// these three could make up a planet gravity
var heroJumpHeight = 36;
var heroJumpSpeed = 3;
var heroFallFromJumpSpeed = 0.75;

var meteorFrames = 4;
var meteorAnimSpeed = 8; 
var meteorExplodeAnimSpeed = 10;

var rocketFrames = 4;
var rocketAnimSpeed = 8; 
var rocketExplodeAnimSpeed = 10; 

var invaderFrames = 4;
var invaderAnimSpeed = 10; 

var bombFrames = 4;
var bombAnimSpeed = 5;
var bombExplodeAnimSpeed = 5; 

var ammoFrames = 2;
var ammoAnimSpeed = 15;
var ammoExplodeAnimSpeed = 10;

var spectatorFrames = 4;
var spectatorSpeed = 1;//0.5;
var spectatorJumpSpeed = 1;
var spectatorAnimSpeed = 3;
var spectatorJumpAnimSpeed = 5;
var spectatorExplodeAnimSpeed = 20;

var balloonsPerSpectator = 20;
var balloonFrames = 4;
var balloonSpeed = 0.5;
var balloonInflateAnimSpeed = 15;
var balloonFlyAnimSpeed = 8;
var balloonExplodeAnimSpeed = 4;
var balloonMaxHeight = -(400 + balloonSize[1]);

var fireFrames = 10;
var fireAnimSpeed = 10;
var burnFrames = 100;
// end animation data
//------------------------------------------------------------------------------------------------------------------------
function computeSpectatorPos() {
    return Math.floor(Math.random() * (gameSize[0] - (2 * viewportCenterX))) + viewportCenterX;
}    
//------------------------------------------------------------------------------------------------------------------------
function initSpriteSets() {
    gbox.addImage('completeSprites', 'assets/images/spectators_pack.png');

    gapStart = 0;
    gbox.addTiles({id:'bgTile', image:'completeSprites', tilew:gameSize[0], tileh:gameSize[1], tilerow:1, gapx:0, gapy:gapStart});

    gapStart += gameSize[1];
    gbox.addTiles({id:'floorTiles', image:'completeSprites', tilew:floorPieceSize[0], tileh:floorPieceSize[1], tilerow:nrFloorPieces, gapx:0, gapy:gapStart});
    gbox.addTiles({id:'floorBrokenTiles', image:'completeSprites', tilew:floorPieceSize[0], tileh:floorPieceSize[1], tilerow:nrFloorPieces, gapx:0, gapy:gapStart+floorPieceSize[1]});

    gapStart += 2*floorPieceSize[1];
    gbox.addTiles({id:'spectatorMaleTiles', image:'completeSprites', tilew:spectatorSize[0], tileh:spectatorSize[1], tilerow:spectatorFrames, gapx:0, gapy:gapStart});
    gbox.addTiles({id:'spectatorMaleJumpTiles', image:'completeSprites', tilew:spectatorSize[0], tileh:spectatorSize[1], tilerow:spectatorFrames, gapx:0, gapy:gapStart+spectatorSize[1]});
    gbox.addTiles({id:'spectatorMaleHopeTiles', image:'completeSprites', tilew:spectatorSize[0], tileh:spectatorSize[1], tilerow:spectatorFrames, gapx:0, gapy:gapStart+2*spectatorSize[1]});
    gbox.addTiles({id:'spectatorMaleExplodeTiles', image:'completeSprites', tilew:spectatorSize[0], tileh:spectatorSize[1], tilerow:spectatorFrames, gapx:0, gapy:gapStart+3*spectatorSize[1]});

    gapStart += 4*spectatorSize[1];
    gbox.addTiles({id:'spectatorFemaleTiles', image:'completeSprites', tilew:spectatorSize[0], tileh:spectatorSize[1], tilerow:spectatorFrames, gapx:0, gapy:gapStart});
    gbox.addTiles({id:'spectatorFemaleJumpTiles', image:'completeSprites', tilew:spectatorSize[0], tileh:spectatorSize[1], tilerow:spectatorFrames, gapx:0, gapy:gapStart+spectatorSize[1]});
    gbox.addTiles({id:'spectatorFemaleHopeTiles', image:'completeSprites', tilew:spectatorSize[0], tileh:spectatorSize[1], tilerow:spectatorFrames, gapx:0, gapy:gapStart+2*spectatorSize[1]});
    gbox.addTiles({id:'spectatorFemaleExplodeTiles', image:'completeSprites', tilew:spectatorSize[0], tileh:spectatorSize[1], tilerow:spectatorFrames, gapx:0, gapy:gapStart+3*spectatorSize[1]});

    gapStart += 4*spectatorSize[1];   // slightly modified gap params  firefox/akihabara canvas glitch?!
    gbox.addTiles({id:'balloonInflateTiles', image:'completeSprites', tilew:balloonSize[0], tileh:balloonSize[1] - 1, tilerow:balloonFrames, gapx:0, gapy:gapStart+1});
    gbox.addTiles({id:'balloonFlyTiles', image:'completeSprites', tilew:balloonSize[0], tileh:balloonSize[1], tilerow:balloonFrames, gapx:0, gapy:gapStart+balloonSize[1]});
    gbox.addTiles({id:'balloonExplodeTiles', image:'completeSprites', tilew:balloonSize[0], tileh:balloonSize[1], tilerow:balloonFrames, gapx:0, gapy:gapStart+2*balloonSize[1]});

    gapStart += 3*balloonSize[1];
    gbox.addTiles({id:'fireTiles', image:'completeSprites', tilew:fireSize[0], tileh:fireSize[1], tilerow:fireFrames, gapx:0, gapy:gapStart});

    gapStart += fireSize[1];
    gbox.addTiles({id:'heroTiles', image:'completeSprites', tilew:heroSize[0], tileh:heroSize[1], tilerow:heroFrames, gapx:0, gapy:gapStart});
    gbox.addTiles({id:'heroJumpTiles', image:'completeSprites', tilew:heroSize[0], tileh:heroSize[1], tilerow:heroFrames, gapx:0, gapy:gapStart+heroSize[1]});
    gbox.addTiles({id:'heroFallTiles', image:'completeSprites', tilew:heroSize[0], tileh:heroSize[1], tilerow:heroFrames, gapx:0, gapy:gapStart+(2 * heroSize[1])});
    gbox.addTiles({id:'heroExplodeTiles', image:'completeSprites', tilew:heroSize[0], tileh:heroSize[1], tilerow:heroFrames, gapx:0, gapy:gapStart+(3 * heroSize[1])});
    gbox.addTiles({id:'heroGhostTiles', image:'completeSprites', tilew:heroSize[0], tileh:heroSize[1], tilerow:heroFrames, gapx:0, gapy:gapStart+(4 * heroSize[1])});

    gapStart += 5*heroSize[1];
    gbox.addTiles({id:'heroBulletTiles', image:'completeSprites', tilew:bulletSize[0], tileh:bulletSize[1], tilerow:1, gapx:0, gapy:gapStart});

    gapStart += bulletSize[1];
    gbox.addTiles({id:'invader0Tiles', image:'completeSprites', tilew:invaderSize[0], tileh:invaderSize[1], tilerow:invaderFrames, gapx:0, gapy:gapStart});

    gapStart += 2*invaderSize[1];
    gbox.addTiles({id:'invader1Tiles', image:'completeSprites', tilew:invaderSize[0], tileh:invaderSize[1], tilerow:invaderFrames, gapx:0, gapy:gapStart});

    gapStart += 2*invaderSize[1];
    gbox.addTiles({id:'bombTiles', image:'completeSprites', tilew:bombSize[0], tileh:bombSize[1], tilerow:bombFrames, gapx:0, gapy:gapStart});
    gbox.addTiles({id:'bombExplodeTiles', image:'completeSprites', tilew:bombSize[0], tileh:bombSize[1], tilerow:bombFrames, gapx:0, gapy:gapStart+bombSize[1]});

    gapStart += 2*bombSize[1];
    gbox.addTiles({id:'meteorTiles', image:'completeSprites', tilew:meteorSize[0], tileh:meteorSize[1], tilerow:meteorFrames, gapx:0, gapy:gapStart});
    gbox.addTiles({id:'meteorExplodeTiles', image:'completeSprites', tilew:meteorSize[0], tileh:meteorSize[1], tilerow:meteorFrames, gapx:0, gapy:gapStart+meteorSize[1]});

    gapStart += 2*meteorSize[1];
    gbox.addTiles({id:'rocketAirTiles', image:'completeSprites', tilew:rocketSize[0], tileh:rocketSize[1], tilerow:rocketFrames, gapx:0, gapy:gapStart});
    gbox.addTiles({id:'rocketGroundTiles', image:'completeSprites', tilew:rocketSize[0], tileh:rocketSize[1], tilerow:rocketFrames, gapx:0, gapy:gapStart+(1 * rocketSize[1])});
    gbox.addTiles({id:'rocketExplodeTiles', image:'completeSprites', tilew:rocketSize[0], tileh:rocketSize[1], tilerow:rocketFrames, gapx:0, gapy:gapStart+(2 * rocketSize[1])});

    gapStart += 3*rocketSize[1];
    gbox.addTiles({id:'ammoTiles', image:'completeSprites', tilew:ammoSize[0], tileh:ammoSize[1], tilerow:ammoFrames, gapx:0, gapy:gapStart});
    gbox.addTiles({id:'ammoExplodeTiles', image:'completeSprites', tilew:ammoSize[0], tileh:ammoSize[1], tilerow:ammoFrames, gapx:0, gapy:gapStart+ammoSize[1]});

    gapStart += 2*ammoSize[1];
    gbox.addTiles({id:'queueNrTiles', image:'completeSprites', tilew:queueNrSize[0], tileh:queueNrSize[1], tilerow:11, gapx:0, gapy:gapStart});
}
//------------------------------------------------------------------------------------------------------------------------
function initAudio() {
    gbox.setAudioChannels({sfx:{volume:0.1},sfx2:{volume:0.1}});
    gbox.addAudio("heroshoot", ["assets/sounds/heroshoot.ogg","assets/sounds/heroshoot.mp3"], {channel:"sfx"});
    gbox.addAudio("heroexplode", ["assets/sounds/heroexplode.ogg","assets/sounds/heroexplode.mp3"], {channel:"sfx"});
    gbox.addAudio("herojump", ["assets/sounds/herojump.ogg","assets/sounds/herojump.mp3"], {channel:"sfx"});
    gbox.addAudio("heroland", ["assets/sounds/heroland.ogg","assets/sounds/heroland.mp3"], {channel:"sfx"});
    gbox.addAudio("herofall", ["assets/sounds/herofall.ogg","assets/sounds/herofall.mp3"], {channel:"sfx"});
    gbox.addAudio("shootsmeet", ["assets/sounds/shootsmeet.ogg","assets/sounds/shootsmeet.mp3"], {channel:"sfx"});

    gbox.addAudio("meteorground", ["assets/sounds/meteorground.ogg","assets/sounds/meteorground.mp3"], {channel:"sfx2"});
    gbox.addAudio("meteorexplode", ["assets/sounds/meteorexplode.ogg","assets/sounds/meteorexplode.mp3"], {channel:"sfx2"});
    gbox.addAudio("rocketlaunch", ["assets/sounds/rocketlaunch.ogg","assets/sounds/rocketlaunch.mp3"], {channel:"sfx2"});

    gbox.addAudio("inflate", ["assets/sounds/inflate.ogg","assets/sounds/inflate.mp3"], {channel:"sfx2"});
    gbox.addAudio("deflate", ["assets/sounds/deflate.ogg","assets/sounds/deflate.mp3"], {channel:"sfx2"});
    gbox.addAudio("scream_female", ["assets/sounds/scream_female.ogg","assets/sounds/scream_female.mp3"], {channel:"sfx2"});
    gbox.addAudio("scream_male", ["assets/sounds/scream_male.ogg","assets/sounds/scream_male.mp3"], {channel:"sfx2"});
    gbox.addAudio("alien", ["assets/sounds/alien.ogg","assets/sounds/alien.mp3"], {channel:"sfx2"});
}
//------------------------------------------------------------------------------------------------------------------------
function swapAudioMute() {
	muted = !muted;
	if (muted) gbox.setAudioChannels({sfx:{volume:0.0},sfx2:{volume:0.0}});
	else gbox.setAudioChannels({sfx:{volume:0.1},sfx2:{volume:0.1}});
}
//------------------------------------------------------------------------------------------------------------------------
function initSpectators(your_id, spectatorClientContext) {
    youFemale = (Math.random() >= 0.5);
    youId = your_id;
    clientContext = spectatorClientContext;
    youAbsPos = computeSpectatorPos();
    viewportX = youAbsPos - viewportCenterX;

    splashData = {minilogo:"assets/images/blank.png", background:"assets/images/yo-code_spectator.png"};
    initData = {title:gameId, width:viewportSize[0], height:viewportSize[1], zoom:4, splash: splashData, bgcolor:"#ffffff"};

    help.akihabaraInit(initData);
    gbox.setSplashSettings({minimalTime:2000});
    gbox.addImage('logo', 'assets/images/logo_spectator.png');

    initSpriteSets();
    initAudio();

    gbox.addImage('font', 'assets/images/font.png');
    gbox.addFont({id:'small', image:'font', firstletter:' ', tilew:fontSize[0], tileh:fontSize[1], tilerow:255, gapx:0, gapy:0});
    gbox.addFont({id:'smallblack', image:'font', firstletter:' ', tilew:fontSize[0], tileh:fontSize[1], tilerow:255, gapx:0, gapy:1*fontSize[1]});
    gbox.addFont({id:'smallred', image:'font', firstletter:' ', tilew:fontSize[0], tileh:fontSize[1], tilerow:255, gapx:0, gapy:2*fontSize[1]});

    gbox.setFps(fps);
    gbox.setDoubleBuffering(true);
    gbox._keymap = {up:38,down:40,right:39,left:37,a:65,b:83,c:80,d:77};

    gbox.setCallback(main);
    gbox.loadAll();
}
//------------------------------------------------------------------------------------------------------------------------
function main() {
    gbox.setGroups(groups);
    spectatorsGame = gamecycle.createMaingame(gameId, 'game');
    initGamecycleCallbacks();

    spectatorsGame.initHero = function(startX, startSpeed) {
        delete spectatorsGame.hero;
        spectatorsGame.hero = createHero(startX, startSpeed);
        spectatorsGame.bulletManager = createBullets(spectatorsGame.hero);        
    }

    spectatorsGame.destroyGame = function() {
        delete spectatorsGame.floorManager;
        delete spectatorsGame.hero;
        delete spectatorsGame.bulletManager;
        delete spectatorsGame.meteorManager;
        delete spectatorsGame.rocketManager;
        delete spectatorsGame.bombManager;
        delete spectatorsGame.ammoManager;
        delete spectatorsGame.you;
        delete spectatorsGame.queueInfo;
    }

    spectatorsGame.initializeGame = function() {  // gbox callback
        spectatorsGame.bg = createBg();
        initHud();
        spectatorsGame.floorManager = createFloorPieces();
        spectatorsGame.initHero(gameSize[0] , null); // one hero, not seen at start
        spectatorsGame.meteorManager = createMeteors();
        spectatorsGame.rocketManager = createRockets();
        spectatorsGame.bombManager = createBombs();
        spectatorsGame.ammoManager = createAmmos();        
        spectatorsGame.fireManager = createFires(true);
        spectatorsGame.you = createYou(viewportCenterX, youAbsPos, "you", youId, youFemale);
        var invaderType = spectatorsGame.you.female ? "1" : "0";
        spectatorsGame.invader = createInvader(invaderType);
        spectatorsGame.queueInfo = createQueueInfo(spectatorsGame.you);
        clientContext.commitSpectatorGameStart(spectatorsGame.you);
    }

    spectatorsGame.gameEvents = function() { // gbox callback
        evaluateGameControls();
        evaluateMetaGame();
        evaluateGameCollisions();
    }

    spectatorsGame.initArbitMsg = function() {
        if (frameNr >= 50) { // do not show hero msg if its shown because we are new!
            arbitMsgVisible = true;
            arbitMsgStartFrame = frameNr;
        }
    }
    spectatorsGame.initArbitMsg2 = function() {
        arbitMsg2Visible = true;
        arbitMsg2StartFrame = frameNr;
    }

    gbox.go();
}
//------------------------------------------------------------------------------------------------------------------------
function initHud() {
    spectatorsGame.hud.setWidget('nextHero', {
        widget: 'label', font: 'smallred', value: "",
        dx:     (viewportSize[0] / 2) - ((nextHeroMsg.length / 2) * fontSize[0]),
        dy:     2,
        clear:  true
    })

    spectatorsGame.hud.setWidget('arbitMsg', {
        widget: 'label', font: 'small', value: "",
        dx:     (viewportSize[0] / 2) - ((20 / 2) * fontSize[0]),
        dy:     24,
        clear:  true
    })
    spectatorsGame.hud.setWidget('arbitMsg2', {
        widget: 'label', font: 'small', value: "",
        dx:     (viewportSize[0] / 2) - ((20 / 2) * fontSize[0]),
        dy:     34,
        clear:  true
    })
}
//------------------------------------------------------------------------------------------------------------------------
function initGamecycleCallbacks() {
    spectatorsGame.gameTitleIntroAnimation=function(reset) {  // gbox callbacks
	gbox.blitFade(gbox.getBufferContext(),{alpha:1});
      	titlePos = {dx: 0,dy:0};
        gbox.blitAll(gbox.getBufferContext(),gbox.getImage("logo"),titlePos);
    }

    spectatorsGame.pressStartIntroAnimation=function(reset) {
        gbox.blitText(gbox.getBufferContext(), {font:"small",text:"fire to start",dx:30,dy:65});
    	return gbox.keyIsHit("a");
    }

    // bypass all the following stuff
    spectatorsGame.gameoverIntroAnimation=function() { return true;}
    spectatorsGame.levelIntroAnimation = function() { return true;}

    spectatorsGame.gameMenu = function() {return true;};
    spectatorsGame.gameIntroAnimation = function() {return true;};
    spectatorsGame.endlevelIntroAnimation = function(reset) {return true;}
}
//------------------------------------------------------------------------------------------------------------------------
function evaluateMetaGame() {
    spectatorsGame.queueInfo.setNr(clientContext.queuepos, clientContext.onlookers.length + 1);

    // next hero msgs
    if (clientContext.queuepos == 1) {
        if ((frameNr % nextHeroMsgBlinkFrames) == 0) {
            nextHeroMsgShown = !nextHeroMsgShown;
        }
        if (nextHeroMsgShown) spectatorsGame.hud.setValue('nextHero', 'value', nextHeroMsg);
        else spectatorsGame.hud.setValue('nextHero', 'value', "");
    }
    else {
        spectatorsGame.hud.setValue('nextHero', 'value', "");
    }

    // hero entered msg
    if (arbitMsgVisible) {
        if ((frameNr - arbitMsgShowFrames) <= arbitMsgStartFrame) {
            spectatorsGame.hud.setValue('arbitMsg', 'value', arbitMsg);
        }
        else {
            spectatorsGame.hud.setValue('arbitMsg', 'value', "");
            arbitMsgVisible = false;
        }
    }

    // you have died and can stand up message
    if (arbitMsg2Visible) {
        if ((frameNr - arbitMsgShowFrames) <= arbitMsg2StartFrame) {
            spectatorsGame.hud.setValue('arbitMsg2', 'value', arbitMsg2);
        }
        else {
            spectatorsGame.hud.setValue('arbitMsg2', 'value', "");
            arbitMsg2Visible = false;
        }
    }
    spectatorsGame.hud.redraw();

    if (gbox.keyIsHit('d')) swapAudioMute(); // mute audio
}
//------------------------------------------------------------------------------------------------------------------------
function evaluateGameControls() {
    if (gbox.keyIsPressed('left') && gbox.keyIsPressed('right')) {
        return;
    }    
    if (gbox.keyIsPressed('left')) {
        spectatorsGame.you.steerLeft();
        clientContext.changePos(spectatorsGame.you);
    }    
    if (gbox.keyIsPressed('right')) {
        spectatorsGame.you.steerRight();  
        clientContext.changePos(spectatorsGame.you);
    } 

    if (gbox.keyIsHit('up')  || gbox.keyIsHit('b') ) { 
        if (spectatorsGame.you.states[spectatorsGame.you.state] == "dead") {
           clientContext.walkAgain(spectatorsGame.you);
           spectatorsGame.you.initWalk();
        }
        else if (spectatorsGame.you.states[spectatorsGame.you.state] == "walk") {
           clientContext.jump(spectatorsGame.you);
           spectatorsGame.you.initJump();
        }
    }
    if ( gbox.keyIsHit('a') ) {
        if (spectatorsGame.you.states[spectatorsGame.you.state] == "dead") {
           clientContext.walkAgain(spectatorsGame.you);
           spectatorsGame.you.initWalk();
        }
        else if (spectatorsGame.you.states[spectatorsGame.you.state] == "walk") {
           clientContext.hope(spectatorsGame.you);
           spectatorsGame.you.initHope();
        }   
    }
}
//------------------------------------------------------------------------------------------------------------------------
function evaluateGameCollisions() {
    meteorWithGroundColl();
    heroBulletsColl();
    projectilesColl();
    firesColl();
}
//------------------------------------------------------------------------------------------------------------------------
function meteorWithGroundColl() {
    for (i=0; i<spectatorsGame.meteorManager.meteors.length; i++) {
        m = spectatorsGame.meteorManager.meteors[i]
        if ( (m.isActive) && !(m.explodes)) {
            for (j=0; j<spectatorsGame.floorManager.pieces.length; j++) {
                fp = spectatorsGame.floorManager.pieces[j];
                if (fp.isActive) {
                    if (gbox.collides(m, fp, 0)) {
                        m.initExplode();
                        gbox.hitAudio("meteorground");
                    }
                }
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------
function heroBulletsColl() {
    for (i=0; i<spectatorsGame.bulletManager.bullets.length; i++) {
        bull = spectatorsGame.bulletManager.bullets[i];
        if (bull.isActive) {
            // bullet vs meteor
            for (j=0; j<spectatorsGame.meteorManager.meteors.length; j++) {
                m = spectatorsGame.meteorManager.meteors[j]
                if ( (m.isActive) && !(m.explodes)) {
                    if (gbox.collides(bull, m, 0)) {
                        bull.stopShoot();
                        m.initExplode();
                    }
                }
            }
            // bullet vs bombs
            for (j=0; j<spectatorsGame.bombManager.bombs.length; j++) {
                bomb = spectatorsGame.bombManager.bombs[j];
                if ((bomb.isActive) && !(bomb.explodes)) {
                    if (gbox.collides(bull, bomb, 2)) {
                        gbox.hitAudio("shootsmeet");
                        bull.stopShoot();
                        bomb.initExplode();
                    }
                }
            }
            // bullet vs rocket
            for (j=0; j<spectatorsGame.rocketManager.rockets.length; j++) {
                r = spectatorsGame.rocketManager.rockets[j]
                if ( (r.isActive) && !(r.explodes)) {
                    if (gbox.collides(bull, r, 0)) {
                        bull.stopShoot();
                        r.initExplode();
                    }
                }
            }
            // with ammos
            for (j=0; j<spectatorsGame.ammoManager.ammos.length; j++) {
                ammo = spectatorsGame.ammoManager.ammos[j];
                if ( (ammo.isActive)  && (ammo.state < 1) ) { // if ammo is active and not exploding
                    if (gbox.collides(bull, ammo, 1)) {
                        gbox.hitAudio("shootsmeet");
                        bull.stopShoot();
                        ammo.initExplode();
                    }
                }
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------
function projectilesColl() {
    // meteors
    for (i=0; i<spectatorsGame.meteorManager.meteors.length; i++) {
        var m = spectatorsGame.meteorManager.meteors[i];
        if (m.isActive) {
            // you with meteor
            if ((spectatorsGame.you.state < 3) && (gbox.collides(m, spectatorsGame.you.collBox(), 1)) ) {
                clientContext.explode(spectatorsGame.you);
                spectatorsGame.you.initExplode();
            }
            // balloons with meteor
            for(j=0; j<spectatorsGame.you.balloons.length; j++) {
                var bln = spectatorsGame.you.balloons[j];
                if ( (bln.state == 1) && (gbox.collides(m, bln, 0)) ) {  // bln fly state and collision
                    bln.initExplode();
                }    
            }
            for(j=0; j<onlookers.length; j++) {
                for(k=0; k<onlookers[j].balloons.length; k++) {
                    var bln = onlookers[j].balloons[k];
                    if ( (bln.state == 1) && (gbox.collides(m, bln, 0)) ) {  // bln fly state and collision
                        bln.initExplode();
                    }    
                }    
            }    
        }
    }

    // bombs
    for (i=0; i<spectatorsGame.bombManager.bombs.length; i++) {
        var b = spectatorsGame.bombManager.bombs[i];
        if ((b.isActive) && !(b.explodes) ) {
            // you with bombs
            if ((spectatorsGame.you.state < 3) && (gbox.collides(b, spectatorsGame.you.collBox(), 1)) ) {
                clientContext.explode(spectatorsGame.you);
                spectatorsGame.you.initExplode();
            }
            // balloons with bombs
            for(j=0; j<spectatorsGame.you.balloons.length; j++) {
                var bln = spectatorsGame.you.balloons[j];
                if ( (bln.state == 1) && (gbox.collides(b, bln, 0)) ) { // bln fly state and collision
                    b.initExplode();
                    bln.initExplode();
                }    
            }
            for(j=0; j<onlookers.length; j++) {
                for(k=0; k<onlookers[j].balloons.length; k++) {
                    var bln = onlookers[j].balloons[k];
                    if ( (bln.state == 1) && (gbox.collides(b, bln, 0)) ) { // bln fly state and collision
                        b.initExplode();
                        bln.initExplode();
                    }    
                }    
            }    
        }
    }

    // ammos
    for (i=0; i<spectatorsGame.ammoManager.ammos.length; i++) {
        var a = spectatorsGame.ammoManager.ammos[i];
        if ( (a.isActive) && (a.state < 1) ) {
            // you with ammos
            if ((spectatorsGame.you.state < 3) && (gbox.collides(a, spectatorsGame.you.collBox(), 1)) ) {
                clientContext.explode(spectatorsGame.you);
                spectatorsGame.you.initExplode();
            }
            // balloons with ammos
            for(j=0; j<spectatorsGame.you.balloons.length; j++) {
                var bln = spectatorsGame.you.balloons[j];
                if ( (bln.state == 1) && (gbox.collides(a, bln, 0)) ) { // bln fly state and collision
                    a.initExplode();
                    bln.initExplode();
                }    
            }
            for(j=0; j<onlookers.length; j++) {
                for(k=0; k<onlookers[j].balloons.length; k++) {
                    var bln = onlookers[j].balloons[k];
                    if ( (bln.state == 1) && (gbox.collides(a, bln, 0)) ) { // bln fly state and collision
                        a.initExplode();
                        bln.initExplode();
                    }    
                }    
            }    
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------
function firesColl() {
    for (i=0; i<spectatorsGame.fireManager.fires.length; i++) {
        fire = spectatorsGame.fireManager.fires[i];
        if (fire.isActive) { // fire burns
            if (spectatorsGame.you.state < 3) { // you are not explding already
                if ( gbox.collides(fire, spectatorsGame.you.collBox(), 1) ) {
                    clientContext.explode(spectatorsGame.you);
                    spectatorsGame.you.initExplode();
                }
            }
        }
    }    
}
