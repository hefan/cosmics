String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}
if(!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g,'');
  };
}
//------------------------------------------------------------------------------------------------------------------------
function initSpriteSets() {
    if (clientContext != null) {  // network hero game
        gbox.addImage('completeSprites', 'assets/images/cosmics_pack.png');
    } else {  // solo training game
        gbox.addImage('completeSprites', 'assets/images/cosmics_solo_pack.png');
    }    
    gapStart = 0;
    gbox.addTiles({id:'bgTile', image:'completeSprites', tilew:gameSize[0], tileh:gameSize[1], tilerow:1, gapx:0, gapy:gapStart});

    gapStart += gameSize[1];
    gbox.addTiles({id:'floorTiles', image:'completeSprites', tilew:floorPieceSize[0], tileh:floorPieceSize[1], tilerow:nrFloorPieces, gapx:0, gapy:gapStart});
    gbox.addTiles({id:'floorBrokenTiles', image:'completeSprites', tilew:floorPieceSize[0], tileh:floorPieceSize[1], tilerow:nrFloorPieces, gapx:0, gapy:gapStart+floorPieceSize[1]});

    gapStart += 2*floorPieceSize[1];
    gbox.addTiles({id:'spectatorMaleTiles', image:'completeSprites', tilew:spectatorSize[0], tileh:spectatorSize[1], tilerow:spectatorFrames, gapx:0, gapy:gapStart});
    gbox.addTiles({id:'spectatorMaleJumpTiles', image:'completeSprites', tilew:spectatorSize[0], tileh:spectatorSize[1], tilerow:spectatorFrames, gapx:0, gapy:gapStart+spectatorSize[1]});
    gbox.addTiles({id:'spectatorMaleHopeTiles', image:'completeSprites', tilew:spectatorSize[0], tileh:spectatorSize[1], tilerow:spectatorFrames, gapx:0, gapy:gapStart+(2*spectatorSize[1])});
    gbox.addTiles({id:'spectatorMaleExplodeTiles', image:'completeSprites', tilew:spectatorSize[0], tileh:spectatorSize[1], tilerow:spectatorFrames, gapx:0, gapy:gapStart+(3*spectatorSize[1])});

    gapStart += 4*spectatorSize[1];
    gbox.addTiles({id:'spectatorFemaleTiles', image:'completeSprites', tilew:spectatorSize[0], tileh:spectatorSize[1], tilerow:spectatorFrames, gapx:0, gapy:gapStart});
    gbox.addTiles({id:'spectatorFemaleJumpTiles', image:'completeSprites', tilew:spectatorSize[0], tileh:spectatorSize[1], tilerow:spectatorFrames, gapx:0, gapy:gapStart+spectatorSize[1]});
    gbox.addTiles({id:'spectatorFemaleHopeTiles', image:'completeSprites', tilew:spectatorSize[0], tileh:spectatorSize[1], tilerow:spectatorFrames, gapx:0, gapy:gapStart+(2*spectatorSize[1])});
    gbox.addTiles({id:'spectatorFemaleExplodeTiles', image:'completeSprites', tilew:spectatorSize[0], tileh:spectatorSize[1], tilerow:spectatorFrames, gapx:0, gapy:gapStart+(3*spectatorSize[1])});

    gapStart += 4*spectatorSize[1];
    gbox.addTiles({id:'balloonInflateTiles', image:'completeSprites', tilew:balloonSize[0], tileh:balloonSize[1], tilerow:balloonFrames, gapx:0, gapy:gapStart});
    gbox.addTiles({id:'balloonFlyTiles', image:'completeSprites', tilew:balloonSize[0], tileh:balloonSize[1], tilerow:balloonFrames, gapx:0, gapy:gapStart+balloonSize[1]});
    gbox.addTiles({id:'balloonExplodeTiles', image:'completeSprites', tilew:balloonSize[0], tileh:balloonSize[1], tilerow:balloonFrames, gapx:0, gapy:gapStart+(2*balloonSize[1])});

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
    gbox.addTiles({id:'invader0explodeTiles', image:'completeSprites', tilew:invaderSize[0], tileh:invaderSize[1], tilerow:invaderFrames, gapx:0, gapy:gapStart+invaderSize[1]});

    gapStart += 2*invaderSize[1];
    gbox.addTiles({id:'invader1Tiles', image:'completeSprites', tilew:invaderSize[0], tileh:invaderSize[1], tilerow:invaderFrames, gapx:0, gapy:gapStart});
    gbox.addTiles({id:'invader1explodeTiles', image:'completeSprites', tilew:invaderSize[0], tileh:invaderSize[1], tilerow:invaderFrames, gapx:0, gapy:gapStart+invaderSize[1]});

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
    gbox.addTiles({id:'sweeperStalkTiles', image:'completeSprites', tilew:sweeperSize[0], tileh:sweeperSize[1], tilerow:sweeperFrames, gapx:0, gapy:gapStart});
    gbox.addTiles({id:'sweeperSwarmTiles', image:'completeSprites', tilew:sweeperSize[0], tileh:sweeperSize[1], tilerow:sweeperFrames, gapx:0, gapy:gapStart+(1 * sweeperSize[1])});
    gbox.addTiles({id:'sweeperFireTiles', image:'completeSprites', tilew:sweeperSize[0], tileh:sweeperSize[1], tilerow:sweeperFrames, gapx:0, gapy:gapStart+(2 * sweeperSize[1])});
    gbox.addTiles({id:'sweeperExplodeTiles', image:'completeSprites', tilew:sweeperSize[0], tileh:sweeperSize[1], tilerow:sweeperFrames, gapx:0, gapy:gapStart+(3 * sweeperSize[1])});

    gapStart += 4*sweeperSize[1];
    gbox.addTiles({id:'ammoTiles', image:'completeSprites', tilew:ammoSize[0], tileh:ammoSize[1], tilerow:ammoFrames, gapx:0, gapy:gapStart});
    gbox.addTiles({id:'ammoExplodeTiles', image:'completeSprites', tilew:ammoSize[0], tileh:ammoSize[1], tilerow:ammoFrames, gapx:0, gapy:gapStart+ammoSize[1]});
}
//------------------------------------------------------------------------------------------------------------------------
function initAudio() {
	    gbox.setAudioChannels({sfx:{volume:0.1},sfx2:{volume:0.1}});
        gbox.addAudio("heroshoot", ["assets/sounds/heroshoot.ogg","assets/sounds/heroshoot.mp3"], {channel:"sfx"});
        gbox.addAudio("heroexplode", ["assets/sounds/heroexplode.ogg","assets/sounds/heroexplode.mp3"], {channel:"sfx"});
        gbox.addAudio("herojump", ["assets/sounds/herojump.ogg","assets/sounds/herojump.mp3"], {channel:"sfx"});
        gbox.addAudio("heroland", ["assets/sounds/heroland.ogg","assets/sounds/heroland.mp3"], {channel:"sfx"});
        gbox.addAudio("herofall", ["assets/sounds/herofall.ogg","assets/sounds/herofall.mp3"], {channel:"sfx"});

        gbox.addAudio("invaderexplode", ["assets/sounds/invaderexplode.ogg","assets/sounds/invaderexplode.mp3"], {channel:"sfx"});
        gbox.addAudio("sweeperswarm", ["assets/sounds/sweeperswarm.ogg","assets/sounds/sweeperswarm.mp3"], {channel:"sfx"});
        gbox.addAudio("sweeperfire", ["assets/sounds/sweeperfire.ogg","assets/sounds/sweeperfire.mp3"], {channel:"sfx"});
        gbox.addAudio("sweeperexplode", ["assets/sounds/sweeperexplode.ogg","assets/sounds/sweeperexplode.mp3"], {channel:"sfx"});
        gbox.addAudio("shootsmeet", ["assets/sounds/shootsmeet.ogg","assets/sounds/shootsmeet.mp3"], {channel:"sfx"});
        gbox.addAudio("levelcomplete", ["assets/sounds/levelcomplete.ogg","assets/sounds/levelcomplete.mp3"], {channel:"sfx"});

        gbox.addAudio("meteorrespawn", ["assets/sounds/meteorrespawn.ogg","assets/sounds/meteorrespawn.mp3"], {channel:"sfx2"});
        gbox.addAudio("meteorground", ["assets/sounds/meteorground.ogg","assets/sounds/meteorground.mp3"], {channel:"sfx2"});
        gbox.addAudio("meteorexplode", ["assets/sounds/meteorexplode.ogg","assets/sounds/meteorexplode.mp3"], {channel:"sfx2"});
        gbox.addAudio("rocketlaunch", ["assets/sounds/rocketlaunch.ogg","assets/sounds/rocketlaunch.mp3"], {channel:"sfx2"});
        gbox.addAudio("rocketexplode", ["assets/sounds/rocketexplode.ogg","assets/sounds/rocketexplode.mp3"], {channel:"sfx2"});

        gbox.addAudio("deflate", ["assets/sounds/deflate.ogg","assets/sounds/deflate.mp3"], {channel:"sfx2"});
        gbox.addAudio("scream_female", ["assets/sounds/scream_female_distant.ogg","assets/sounds/scream_female_distant.mp3"], {channel:"sfx2"});
        gbox.addAudio("scream_male", ["assets/sounds/scream_male_distant.ogg","assets/sounds/scream_male_distant.mp3"], {channel:"sfx2"});
}
//------------------------------------------------------------------------------------------------------------------------
function swapAudioMute() {
	muted = !muted;
	if (muted) gbox.setAudioChannels({sfx:{volume:0.0},sfx2:{volume:0.0}});
	else gbox.setAudioChannels({sfx:{volume:0.1},sfx2:{volume:0.1}});
}
//------------------------------------------------------------------------------------------------------------------------
function initCosmics(hero_id, cosmicsClientContext) {
    heroId = hero_id;
    clientContext = cosmicsClientContext;
    splashData = {minilogo:"assets/images/blank.png", background:"assets/images/yo-code.png"};
    initData = {title:gameId, width: gameSize[0], height:gameSize[1], zoom:1, splash: splashData, bgcolor:"#ffffff"};

    help.akihabaraInit(initData);
    gbox.setSplashSettings({minimalTime:1000});
    if (clientContext != null) {
        gbox.addImage('logo', 'assets/images/logo.png');
    } else {  // solo game has no score
        gbox.addImage('logo', 'assets/images/logo_solo.png');
    }    

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
    cosmicsGame = gamecycle.createMaingame(gameId, 'game');
    initGamecycleCallbacks();
//    gbox.playAudio("test");

    cosmicsGame.initHero = function(startX, startSpeed) {
        delete cosmicsGame.hero;
        cosmicsGame.hero = createHero(heroId, startX, startSpeed);
        cosmicsGame.bulletManager = createBullets(cosmicsGame.hero);
    }

    cosmicsGame.destroyGame = function() {
        delete cosmicsGame.floorManager;
        delete cosmicsGame.hero;
        delete cosmicsGame.bulletManager;
        delete cosmicsGame.invaderManager;
        delete cosmicsGame.meteorManager;
        delete cosmicsGame.sweeperManager;
        delete cosmicsGame.rocketManager;
        gbox.trashGroup("rockets");
    }

    cosmicsGame.initializeGame = function() {  // gbox callback
        createBg();
        initHud();
        initLevel(curLevel);
        pointsInvaderMultiplier = 1;
        var initialLeftDir = (Math.random() >= 0.5);
        cosmicsGame.floorManager = createFloorPieces(floorPiecesArr);
        cosmicsGame.initHero(Math.floor(battlegroundSize[0] / 2), null);
        cosmicsGame.invaderManager = createInvaders(false);  // invaders should always start to the right
        cosmicsGame.meteorManager = createMeteors();
        cosmicsGame.rocketManager = createRockets();
        cosmicsGame.sweeperManager = createSweepers(initialLeftDir); // sweepers can start in different directions!
        cosmicsGame.fireManager = createFires(false);
        if (clientContext != null) {
            clientContext.commitCosmicsGameStart(cosmicsGame.hero);
            clientContext.setFloorData(floorPiecesArr);
        }

        cosmicsGame.timeoutWarning = false;
        timeoutWarningLength = 4;
        cosmicsGame.timeoutWarningFrames = timeoutWarningLength * fps;
        cosmicsGame.timeoutWarningFrame = 0;

        cosmicsGame.timeout = false;
    }

    cosmicsGame.gameEvents = function() { // gbox callback
        if (suspended) return;

        if (paused) {
            gbox.blitRect(gbox.getBufferContext(), {x:0, y: 0, w:gameSize[0], h: gameSize[1], alpha: 0.5});
            gbox.blitText(gbox.getBufferContext(),{font:"small",text:"PAUSED",valign:gbox.ALIGN_BOTTOM,halign:gbox.ALIGN_CENTER,dx:0,dy:0,dw:gbox.getScreenW(),dh:gbox.getScreenH()-100});
        } else {
            evaluateGameControls();
            evaluateGameEnemies();
            evaluateGameCollisions();
        }
        cosmicsGame.evaluateTimeouts();
        evaluateMetaGame();
    }

    cosmicsGame.triggerTimeoutWarning = function() {
        cosmicsGame.timeoutWarning = true;
        cosmicsGame.timeoutWarningFrame = frameNr;
    } 

    cosmicsGame.triggerTimeout = function() {
        cosmicsGame.timeout = true;
    } 

    cosmicsGame.evaluateTimeouts = function() {
        if (cosmicsGame.timeoutWarning) {
            if (typeof cosmicsGame.hero === "undefined") { // in start screen
                gbox.blitText(gbox.getBufferContext(),{font:"smallred",text:timeoutWarningMsg,
                        valign:gbox.ALIGN_BOTTOM,halign:gbox.ALIGN_CENTER,dx:0,dy:0,dw:gbox.getScreenW(),dh:gbox.getScreenH()-90});
            } else {  // in game
                cosmicsGame.hud.setValue('timeout1', 'value', timeoutWarningMsg);
                if (frameNr >= (cosmicsGame.timeoutWarningFrame+cosmicsGame.timeoutWarningFrames)) {
                    cosmicsGame.timeoutWarning = false;
                    cosmicsGame.hud.setValue('timeout1', 'value', "");
                    cosmicsGame.hud.redraw();
                }
            }
        }
        if (cosmicsGame.timeout) {
            suspended = true;
            if (typeof cosmicsGame.hero === "undefined") { // in start screen
                gbox.blitText(gbox.getBufferContext(),{font:"smallred",text:timeoutMsg1,
                        valign:gbox.ALIGN_BOTTOM,halign:gbox.ALIGN_CENTER,dx:0,dy:0,dw:gbox.getScreenW(),dh:gbox.getScreenH()-75});
                gbox.blitText(gbox.getBufferContext(),{font:"smallred",text:timeoutMsg2,
                        valign:gbox.ALIGN_BOTTOM,halign:gbox.ALIGN_CENTER,dx:0,dy:0,dw:gbox.getScreenW(),dh:gbox.getScreenH()-60});
            } else {  // in game
                cosmicsGame.hud.setValue('timeout2', 'value', timeoutMsg1);
                cosmicsGame.hud.setValue('timeout3', 'value', timeoutMsg2);
                cosmicsGame.hud.redraw();
            }
        }
        if (dos) {
            suspended = true;
            if (typeof cosmicsGame.hero === "undefined") { // in start screen
                gbox.blitText(gbox.getBufferContext(),{font:"smallred",text:dosMsg,
                        valign:gbox.ALIGN_BOTTOM,halign:gbox.ALIGN_CENTER,dx:0,dy:0,dw:gbox.getScreenW(),dh:gbox.getScreenH()-60});
            } else {  // in game
                cosmicsGame.hud.setValue('dos', 'value', timeoutMsg2);
                cosmicsGame.hud.redraw();
            }
        }
    }

    gbox.go();
}
//------------------------------------------------------------------------------------------------------------------------
function initHud() {
    var borderOffset = 10;

    cosmicsGame.hud.setWidget('lives', {
        widget: 'label', font:   'small', value:  heroLives,
        dx:     gameSize[0] - borderOffset - fontSize[0],
        dy:     borderOffset,
        clear:  true
    });

    cosmicsGame.hud.setWidget('livesText', {
        widget: 'label', font:   'smallred', value: 'Lives ',
        dx:     gameSize[0] - borderOffset - (7 * fontSize[0]),
        dy:     borderOffset,
        clear:  false
    });

    if (clientContext != null) {
        scoreValue = heroScore;
    } else {  // solo game has no score
        scoreValue = "Mission Training"
    }    

    cosmicsGame.hud.setWidget('score', {
        widget: 'label', font:   'small', value: scoreValue,
        dx:     borderOffset + 6 * fontSize[0],
        dy:     borderOffset * 2 + fontSize[1],
        clear:  true
    })

    cosmicsGame.hud.setWidget('scoreText', {
        widget: 'label', font:   'smallred', value: 'Score ',
        dx:     borderOffset,
        dy:     borderOffset * 2 + fontSize[1],
        clear:  false
    })

    cosmicsGame.hud.setWidget('level', {
        widget: 'label', font:   'small', value:  curLevel,
        dx:     borderOffset + 6 * fontSize[0],
        dy:     borderOffset,
        clear:  true
    })

    cosmicsGame.hud.setWidget('levelText', {
        widget: 'label', font:   'smallred', value: 'Level ',
        dx:     borderOffset,
        dy:     borderOffset,
        clear:  false
    })

    var msgsStart = gameSize[1] - (floorPieceSize[1] * 3) - heroSize[1];

    cosmicsGame.hud.setWidget('timeout1', {
        widget: 'label', font: 'smallred', value: "",
        dx:     (gameSize[0] / 2) - ((timeoutWarningMsg.length / 2) * fontSize[0]),
        dy:     msgsStart,
        clear:  true
    })

    cosmicsGame.hud.setWidget('timeout2', {
        widget: 'label', font: 'smallred', value: "",
        dx:     (gameSize[0] / 2) - ((timeoutMsg1.length / 2) * fontSize[0]),
        dy:     msgsStart + (fontSize[1] * 2),
        clear:  true
    })

    cosmicsGame.hud.setWidget('timeout3', {
        widget: 'label', font: 'smallred', value: "",
        dx:     (gameSize[0] / 2) - ((timeoutMsg2.length / 2) * fontSize[0]),
        dy:     msgsStart + (fontSize[1] * 4),
        clear:  true
    })

    cosmicsGame.hud.setWidget('dos', {
        widget: 'label', font: 'smallred', value: "",
        dx:     (gameSize[0] / 2) - ((dosMsg.length / 2) * fontSize[0]),
        dy:     msgsStart,
        clear:  true
    })
}
//------------------------------------------------------------------------------------------------------------------------
function initGamecycleCallbacks() {
    cosmicsGame.gameTitleIntroAnimation=function(reset) {  // gbox callbacks
	    gbox.blitFade(gbox.getBufferContext(),{alpha:1});
      	titlePos = {dx: 0,dy:0};
        gbox.blitAll(gbox.getBufferContext(),gbox.getImage("logo"),titlePos);
    }

    cosmicsGame.pressStartIntroAnimation=function(reset) {
        // highscore entered
        if (plsReload) {
            gbox.blitText(gbox.getBufferContext(),{font:"smallred",text:highscoreName+", your ranking is "+highscoreRank+" with "+heroScore+" Points",valign:gbox.ALIGN_BOTTOM,halign:gbox.ALIGN_CENTER,dx:0,dy:0,dw:gbox.getScreenW(),dh:gbox.getScreenH()-120});
            gbox.blitText(gbox.getBufferContext(),{font:"small",text:"reload page to inline again",valign:gbox.ALIGN_BOTTOM,halign:gbox.ALIGN_CENTER,dx:0,dy:0,dw:gbox.getScreenW(),dh:gbox.getScreenH()-100});
        }
        // enter highscore
        else if (enterHighscore) {  
            cosmicsGame.enterHighscore();
            return false;
        }
        else { // normal game start possible
            cosmicsGame.evaluateTimeouts();
            if (suspended) {
                return false;
            } 
            else {
                gbox.blitText(gbox.getBufferContext(),{font:"small",text:"fire to start",valign:gbox.ALIGN_BOTTOM,halign:gbox.ALIGN_CENTER,dx:0,dy:0,dw:gbox.getScreenW(),dh:gbox.getScreenH()-120});
            }
            return gbox.keyIsHit("a");
        }
    }

    cosmicsGame.levelIntroAnimation = function(reset) {
       gbox.blitRect(gbox.getBufferContext(), {x:0, y: 0, w:gameSize[0], h: gameSize[1], alpha: 0.5});
	   gbox.blitText(gbox.getBufferContext(),{font:"small",text:"WELL DONE",valign:gbox.ALIGN_BOTTOM,halign:gbox.ALIGN_CENTER,dx:0,dy:0,dw:gbox.getScreenW(),dh:gbox.getScreenH()-200});

        if (modalFlashStartFrame == null) modalFlashStartFrame = 0;
        else {
            modalFlashStartFrame++;
            if ( modalFlashStartFrame >= modalFlashMinFrames) {
                gbox.blitText(gbox.getBufferContext(),{font:"small",text:"fire to proceed to next Level: "+getLevelSlogan(curLevel)+ " | " +(breakMaxTime- (Math.floor(breakStartFrame / fps))),
                               valign:gbox.ALIGN_BOTTOM,halign:gbox.ALIGN_CENTER,dx:0,dy:0,dw:gbox.getScreenW(),dh:gbox.getScreenH()-140});
                breakStartFrame++
                if ( (gbox.keyIsHit("a")) || (breakStartFrame >= breakMaxFrames) ) {
                    cosmicsGame.initializeGame();
                    return true;
                }
            }
        }
        return false;
     }

    cosmicsGame.gameoverIntroAnimation=function(reset) {
        gbox.blitRect(gbox.getBufferContext(), {x:(gameSize[0] / 2) - (10 * fontSize[0]), y: (gameSize[1] / 2) -100 - (2*fontSize[1]) ,w:19 * fontSize[0] , h: 5*fontSize[1], color: 'rgb(255,0,0)'});
        gbox.blitText(gbox.getBufferContext(),{font:"smallblack",text:"GAME OVER",dx:(gameSize[0] / 2)-(5 * fontSize[0]),dy:(gameSize[1] / 2) -100});
        if (clientContext != null) {  // network game
            gbox.blitText(gbox.getBufferContext(),{font:"small",text:"fire to enter your highscore",valign:gbox.ALIGN_BOTTOM,halign:gbox.ALIGN_CENTER,dx:0,dy:0,dw:gbox.getScreenW(),dh:gbox.getScreenH()-120});
            enterHighscore = true;
        }
        else {  // solo training game
            gbox.blitText(gbox.getBufferContext(),{font:"small",text:"fire to restart",valign:gbox.ALIGN_BOTTOM,halign:gbox.ALIGN_CENTER,dx:0,dy:0,dw:gbox.getScreenW(),dh:gbox.getScreenH()-120});
        }            
        return gbox.keyIsHit("a");
    }
    // bypass all the following stuff
    cosmicsGame.gameMenu = function() {return true;};
    cosmicsGame.gameIntroAnimation = function() {return true;};
    cosmicsGame.endlevelIntroAnimation = function(reset) {return true;}

    cosmicsGame.enterHighscore=function() {
        gbox.blitText(gbox.getBufferContext(),{font:"smallred",text:"you scored "+heroScore+", enter your name for high score table",valign:gbox.ALIGN_BOTTOM,halign:gbox.ALIGN_CENTER,dx:0,dy:0,dw:gbox.getScreenW(),dh:gbox.getScreenH()-110});
        gbox.blitText(gbox.getBufferContext(),{font:"small",text:"-------------",valign:gbox.ALIGN_BOTTOM,halign:gbox.ALIGN_CENTER,dx:0,dy:0,dw:gbox.getScreenW(),dh:gbox.getScreenH()-84});
        gbox.blitText(gbox.getBufferContext(),{font:"smallred",text:"use left, right up, down, s to submit, empty names not allowed",valign:gbox.ALIGN_BOTTOM,halign:gbox.ALIGN_CENTER,dx:0,dy:0,dw:gbox.getScreenW(),dh:gbox.getScreenH()-70});

        gbox.setFps(15);
        if (gbox.keyIsHit('right')) {
            highscoreEnterPos++;
            if (highscoreEnterPos >= highscoreName.length) highscoreEnterPos = highscoreName.length - 1;
        }
        else if (gbox.keyIsHit('left')) {
            highscoreEnterPos--;
            if (highscoreEnterPos < 0) highscoreEnterPos = 0;
        } 
        else {
            var ch = highscoreName.charCodeAt(highscoreEnterPos);
            if (gbox.keyIsPressed('up')) ch++;
            if (gbox.keyIsPressed('down')) ch--;
            if (ch == 31) ch = 90;
            if (ch == 91) ch = 32;
            if (ch == 33) ch = 65;
            if (ch == 64) ch = 32;
            highscoreName = highscoreName.replaceAt(highscoreEnterPos, String.fromCharCode(ch));
        }
    
        gbox.blitText(gbox.getBufferContext(),{font:"small",text:highscoreName,
                      valign:gbox.ALIGN_BOTTOM,halign:gbox.ALIGN_CENTER,dx:0,dy:0,dw:gbox.getScreenW(),dh:gbox.getScreenH()-90});

        if (highscoreName.trim().length >= 1) {
           if (gbox.keyIsHit('b') ) { // only jump button to prevent shooting "thru" the highscore list
                highscoreName = highscoreName.trim();
                if (clientContext != null) clientContext.submitName(heroId, highscoreName);
                plsReload = true;
            }
        }    
    }
}
//------------------------------------------------------------------------------------------------------------------------
function evaluateMetaGame() {
    switch (cosmicsGame.hero.state) {
        case 100: // dead;
            heroLives--;
            pointsInvaderMultiplier = 1;
            cosmicsGame.hud.setValue('lives', 'value', heroLives);
            if (heroLives < 1) {  // game over
                gameOver();
                return;
            }
            else {  // life lost
                cosmicsGame.hero.state = 101;
            }
            break;

        case 101: // ready to respawn
                cosmicsGame.hero.initGhost();
                breakStartFrame = 0;                
                if (clientContext != null) clientContext.ghost(cosmicsGame.hero);
            break;

        case 102: // ghost
            evaluateHeroMovement(); // steer your hero to your favourite place
            
            // press fire to get back into the game (or wait until break timeout)
            gbox.blitText(gbox.getBufferContext(),{font:"small",text:"fire to get back into game " +(breakMaxTime- (Math.floor(breakStartFrame / fps))),
                          valign:gbox.ALIGN_BOTTOM,halign:gbox.ALIGN_CENTER,dx:0,dy:0,dw:gbox.getScreenW(),dh:gbox.getScreenH()-140});
            breakStartFrame++
            if ( (gbox.keyIsHit('a')) ||  (breakStartFrame >= breakMaxFrames) )  {
                cosmicsGame.initHero(cosmicsGame.hero.x, cosmicsGame.hero.speed);
                if (clientContext != null) clientContext.normal(cosmicsGame.hero);
            }
            break;
    }
    // level cleared
    if (cosmicsGame.invaderManager.getNrOfActiveInvaders() == 0) {
        if (cosmicsGame.sweeperManager.getNrOfActiveSweepers() == 0) {
			gbox.hitAudio("levelcomplete");
            nextLevel();
            return;
        }
    }
    // invaders Landed
    if (cosmicsGame.invaderManager.invadersLanded()) {
        console.log("THE INVADERS HAS LANDED");
        gameOver();
        return;
    }
    if (clientContext != null) cosmicsGame.hud.setValue('score', 'value', heroScore); // no score in training center

//    if (gbox.keyIsHit('c')) paused = !paused; // pause
    if (gbox.keyIsHit('d')) swapAudioMute(); // mute audio
}
//------------------------------------------------------------------------------------------------------------------------
function nextLevel() {
    cosmicsGame.hero.speed = 0;
    cosmicsGame.destroyGame();
    curLevel++;
    breakStartFrame = 0;
    cosmicsGame.setState(401);
    cosmicsGame.stateFirstIteration=false; // let the game stuff not hide
}
//------------------------------------------------------------------------------------------------------------------------
function gameOver() {
    heroId = cosmicsGame.hero.id;
    curLevel = 1;
    heroLives = 3;
    cosmicsGame.setState(700);
    if (clientContext != null) clientContext.gameOver(heroId, heroScore);
}
//------------------------------------------------------------------------------------------------------------------------
function evaluateGameControls() {
    if (cosmicsGame.hero.state < 3) {  // not dead or dying
        evaluateHeroMovement();

        // shoot and jump hero
        if (gbox.keyIsHit('a') && cosmicsGame.hero.state < 3) {
            if (cosmicsGame.bulletManager.tryNextBullet()) {
                if (clientContext != null) clientContext.shoot(cosmicsGame.hero);
            }
        }    
        if ( (gbox.keyIsHit('up') || gbox.keyIsHit('b')) && cosmicsGame.hero.state == 0 ) {
            cosmicsGame.hero.initJump();
            if (clientContext != null) clientContext.jump(cosmicsGame.hero);
        }    
    }
}
//------------------------------------------------------------------------------------------------------------------------
function evaluateHeroMovement() {   
    if ((gbox.keyIsReleased('left')) || gbox.keyIsReleased('right') ) cosmicsGame.hero.resetAcc(); // reset steering

    if (gbox.keyIsHit('left')) cosmicsGame.hero.speed = -1;  // start steering immediately
    if (gbox.keyIsHit('right')) cosmicsGame.hero.speed = 1;

    if (gbox.keyIsPressed('left')) {
        cosmicsGame.hero.steerLeft(); 
        if (clientContext != null) clientContext.changePos(cosmicsGame.hero);
    }    
    if (gbox.keyIsPressed('right')) {
        cosmicsGame.hero.steerRight();
        if (clientContext != null) clientContext.changePos(cosmicsGame.hero);
    }    
}
//------------------------------------------------------------------------------------------------------------------------
function evaluateGameEnemies() {
    setInvadersFormation();
    cosmicsGame.invaderManager.tryNextBomb();
    setMeteors();
    setRockets();
    setSweepers();
}
//------------------------------------------------------------------------------------------------------------------------
function setInvadersFormation() {
    for (i=0; i<nrInvaders; i++) {
        iv = cosmicsGame.invaderManager.invaders[i];
        if ( (iv.isActive) ) {
            if (iv.x < 0) { // now invade to the Right
                cosmicsGame.invaderManager.turnInvadeDir(+1);
                break;
            }
            else if (iv.x > (gameSize[0] - invaderSize[0]) ) { // now invade to the left
                cosmicsGame.invaderManager.turnInvadeDir(-1);
                break;
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------
function setMeteors() {
    cosmicsGame.meteorManager.tryNextMeteor();
}
//------------------------------------------------------------------------------------------------------------------------
function setRockets() {
    cosmicsGame.rocketManager.launchRocket();
}
//------------------------------------------------------------------------------------------------------------------------
function setSweepers() {
    cosmicsGame.sweeperManager.setStalkDirection();
    cosmicsGame.sweeperManager.launchSweepSwarm();
}
//------------------------------------------------------------------------------------------------------------------------
function evaluateGameCollisions() {
    heroBulletsColls();
    heroEnemiesColl();
    heroWithGroundColl();
    meteorWithGroundColl();
    balloonProjectilesColl();
    
    criticalHeightReached();
}
//------------------------------------------------------------------------------------------------------------------------
function heroEnemiesColl() {
    if (cosmicsGame.hero.state < 3) {  // not dead or dying
        // meteors
        for (i=0; i<maxNrMeteors; i++) {
            m = cosmicsGame.meteorManager.meteors[i];
            if ((m.isActive) &&!(m.explodes)) {
                if (gbox.collides(cosmicsGame.hero, m, 3)) {
//                   m.initExplode();
                   if (clientContext != null) clientContext.explode(cosmicsGame.hero);
                   cosmicsGame.hero.initExplode();
                }
            }
        }
        // invaders
        for (i=0; i<nrInvaders; i++) {
            iv = cosmicsGame.invaderManager.invaders[i];
            if ( (iv.isActive && !(iv.explodes)) ) {
                if (gbox.collides(cosmicsGame.hero, iv, 1)) {
                   if (clientContext != null) clientContext.explode(cosmicsGame.hero);
                   iv.initExplode();
                   cosmicsGame.hero.initExplode();
                }
            }
        }
        // bombs
        for (i=0; i<cosmicsGame.invaderManager.bombs.length; i++) {
            b = cosmicsGame.invaderManager.bombs[i];
            if ( (b.isActive) && !(b.explodes) ) {
                if (gbox.collides(cosmicsGame.hero, b, 4)) {
//                   b.initExplode();
                   if (clientContext != null) clientContext.explode(cosmicsGame.hero);
                   cosmicsGame.hero.initExplode();
                }
            }
        }
        // rockets
        for (i=0; i<cosmicsGame.rocketManager.rockets.length; i++) {
            r = cosmicsGame.rocketManager.rockets[i];
            if ( (r.isActive) && !(r.explodes) ) {
                if (gbox.collides(cosmicsGame.hero, r, 4)) {
//                   r.initExplode();
                   if (clientContext != null) clientContext.explode(cosmicsGame.hero);
                   cosmicsGame.hero.initExplode();
                }
            }
        }
        // sweepers
        for (i=0; i<cosmicsGame.sweeperManager.sweepers.length; i++) {
            s = cosmicsGame.sweeperManager.sweepers[i];
            if ( (s.isActive) && (s.state < 4) ) {   // not exploding and active
                if (gbox.collides(cosmicsGame.hero, s, 5)) {
                   if (clientContext != null) clientContext.explode(cosmicsGame.hero);
                   s.initExplode();
                   cosmicsGame.hero.initExplode();
                }
            }
            for (j=0; j < s.ammos.length; j++) { // sweepers ammo
                ammo = s.ammos[j];
                if ( (ammo.isActive)  && (ammo.state < 1) ) { // if ammo is active and not exploding
                    if (gbox.collides(cosmicsGame.hero, ammo, 4)) {
//                        ammo.initExplode();
                        if (clientContext != null) clientContext.explode(cosmicsGame.hero);
                        cosmicsGame.hero.initExplode();
                    }
                }
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------
function heroWithGroundColl() {
    if (cosmicsGame.hero.state == 0) {
        var heroHasNoGround = true;

        for (i=0; i<nrFloorPieces; i++) {
            fp = cosmicsGame.floorManager.pieces[i];
            if (fp.isActive) {
                if (gbox.pixelcollides({x: fp.colcheckX, y: fp.colcheckY}, cosmicsGame.hero, 0)) {
                    heroHasNoGround = false;
                }
            }
        }
        if (heroHasNoGround) {
            heroCenterX = cosmicsGame.hero.x + parseInt(heroSize[0] / 2) - 1;
            if ( (heroCenterX % floorPieceSize[0]) < parseInt(floorPieceSize[0] / 2) ) {
                if (clientContext != null) clientContext.fall(cosmicsGame.hero, heroCenterX, "right");
                cosmicsGame.hero.initFall(heroCenterX, "right");
            }
            else {
                if (clientContext != null) clientContext.fall(cosmicsGame.hero, heroCenterX, "left");
                cosmicsGame.hero.initFall(heroCenterX, "left");
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------
function meteorWithGroundColl() {
    for (i=0; i<maxNrMeteors; i++) {
        m = cosmicsGame.meteorManager.meteors[i]
        if ( (m.isActive) && !(m.explodes)) {
            for (j=0; j<nrFloorPieces; j++) {
                fp = cosmicsGame.floorManager.pieces[j];
                if (fp.isActive) {
                    if (gbox.collides(m, fp, 0)) {
                        m.initExplode();
						gbox.hitAudio("meteorground");
                        fp.isActive = false;
                        if (clientContext != null) clientContext.setFloorData(cosmicsGame.floorManager.getActiveFloorTiles());
                    }
                }
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------
function heroBulletsColls() {
    for (i=0; i<nrBullets; i++) {
        b = cosmicsGame.bulletManager.bullets[i];
        if (b.isActive) {
            // bullet vs invader
            for (j=0; j<nrInvaders; j++) {
                iv = cosmicsGame.invaderManager.invaders[j];
                if ( (iv.isActive && !(iv.explodes)) ) {
                    if (gbox.collides(b, iv, 1)) {
                        // multiplier for subsequent shooting of invaders, reset at all other hits or outs
                        heroScore += (pointsInvader + (10 * pointsInvaderMultiplier)); 
                        pointsInvaderMultiplier += 0.5;
                        b.stopShoot();
                        iv.initExplode();
                        cosmicsGame.invaderManager.setInvadeSpeed();
                    }
                }
            }
            // bullet vs meteor
            for (j=0; j<maxNrMeteors; j++) {
                m = cosmicsGame.meteorManager.meteors[j]
                if ( (m.isActive) && !(m.explodes)) {
                    if (gbox.collides(b, m, 0)) {
                        heroScore+=pointsMeteor;
                        pointsInvaderMultiplier = 1;
                        b.stopShoot();
                        m.initExplode();
                    }
                }
            }
            // bullet vs bombs
            for (j=0; j<cosmicsGame.invaderManager.bombs.length; j++) {
                bomb = cosmicsGame.invaderManager.bombs[j];
                if ((bomb.isActive) && !(bomb.explodes)) {
                    if (gbox.collides(b, bomb, 2)) {
						gbox.hitAudio("shootsmeet");
                        heroScore+=pointsBomb;
                        pointsInvaderMultiplier = 1;
                        b.stopShoot();
                        bomb.initExplode();
                    }
                }
            }
            // bullet vs rocket
            for (j=0; j<maxNrRockets; j++) {
                r = cosmicsGame.rocketManager.rockets[j]
                if ( (r.isActive) && !(r.explodes)) {
                    if (gbox.collides(b, r, 0)) {
						gbox.hitAudio("rocketexplode");
                        heroScore+=pointsRocket;
                        pointsInvaderMultiplier = 1;
                        b.stopShoot();
                        r.initExplode();
                    }
                }
            }
            // bullet vs sweeper
            for (j=0; j<maxNrSweepers; j++) {
                s = cosmicsGame.sweeperManager.sweepers[j];
                if ( (s.isActive) && (s.state < 4)) { // not exploding and active
                    if (gbox.collides(b, s, 1)) {
						gbox.hitAudio("sweeperexplode");
                        heroScore+=pointsSweeper;
                        pointsInvaderMultiplier = 1;
                        b.stopShoot();
                        s.initExplode();
                    }
                }
                for (k=0; k < s.ammos.length; k++) { // bullet vs sweepers ammo
                    ammo = s.ammos[k];
                    if ( (ammo.isActive)  && (ammo.state < 1) ) { // if ammo is active and not exploding
                        if (gbox.collides(b, ammo, 1)) {
							gbox.hitAudio("shootsmeet");
                            heroScore+=pointsAmmo;
                            pointsInvaderMultiplier = 1;
                            b.stopShoot();
                            ammo.initExplode();
                        }
                    }
                }
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------
function balloonProjectilesColl() {
    // meteors
    for (i=0; i<cosmicsGame.meteorManager.meteors.length; i++) {
        var m = cosmicsGame.meteorManager.meteors[i];
        if (m.isActive) {
            // balloons with meteor
            for(j=0; j<spectators.length; j++) {
                for(k=0; k<spectators[j].balloons.length; k++) {
                    var bln = spectators[j].balloons[k];
                    if ( (bln.state == 1) && (gbox.collides(m, bln, 0)) ) { // bln fly state and collision
                        bln.initExplode();
                    }    
                }    
            }    
        }
    }

    // bombs
    for (i=0; i<cosmicsGame.invaderManager.bombs.length; i++) {
        var b = cosmicsGame.invaderManager.bombs[i];
        if ((b.isActive) && !(b.explodes) ) {
            // balloons with bombs
            for(j=0; j<spectators.length; j++) {
                for(k=0; k<spectators[j].balloons.length; k++) {
                    var bln = spectators[j].balloons[k];
                    if ( (bln.state == 1) && (gbox.collides(b, bln, 0)) ) { // bln fly state and collision
                        b.initExplode();
                        bln.initExplode();
                    }    
                }    
            }    
        }
    }

    // ammos
    for (i=0; i<maxNrSweepers; i++) {
        s = cosmicsGame.sweeperManager.sweepers[i];
        for (j=0; j < s.ammos.length; j++) { // bullet vs sweepers ammo
            var a = s.ammos[j];
            if ( (a.isActive) && (a.state < 1) ) {
                // balloons with ammos
                for(k=0; k<spectators.length; k++) {
                    for(l=0; l<spectators[k].balloons.length; l++) {
                        var bln = spectators[k].balloons[l];
                        if ( (bln.state == 1) && (gbox.collides(a, bln, 0)) ) { // bln fly state and collision
                            a.initExplode();
                            bln.initExplode();
                        }    
                    }    
                }    
            }
        }    
    }
}
//------------------------------------------------------------------------------------------------------------------------
function criticalHeightReached() {
    if (clientContext == null) return; // only things with client context should happen here
    // meteors
    mCritical = criticalHeight - meteorSize[1];
    for (i=0; i<cosmicsGame.meteorManager.meteors.length; i++) {
        var m = cosmicsGame.meteorManager.meteors[i];
        if ((m.isActive) && (!m.hadCriticalHeight) && (m.y >= mCritical)) {
            m.hadCriticalHeight = true;
            clientContext.meteorApproach(m.x, m.speed);
        }
    }

    // rockets
    rCritical = criticalHeight - rocketSize[1];
    for (i=0; i<maxNrRockets; i++) {
        r = cosmicsGame.rocketManager.rockets[i];
        if ( (r.isActive) && (!r.hadCriticalHeight) && (r.y >= rCritical) ) {
            r.hadCriticalHeight = true;
            clientContext.rocketApproach(r.type, r.airSpeed, r.groundSpeed);
        }
    }

    // bombs
    bCritical = criticalHeight - bombSize[1];
    for (i=0; i<cosmicsGame.invaderManager.bombs.length; i++) {
        var b = cosmicsGame.invaderManager.bombs[i];
        if ( (b.isActive) && (!b.hadCriticalHeight) && (b.y >= bCritical)) {
            b.hadCriticalHeight = true;
            clientContext.bombApproach(b.x, b.speed);
        }
    }

    // ammos
    aCritical = criticalHeight - ammoSize[1];
    for (i=0; i<cosmicsGame.sweeperManager.sweepers.length; i++) {
        s = cosmicsGame.sweeperManager.sweepers[i];
        if ( (s.isActive) && (s.state < 4)) { 
            for (j=0; j < s.ammos.length; j++) { 
                a = s.ammos[j];
                if ( (a.isActive) && (!a.hadCriticalHeight) && (a.y >= aCritical)) {
                    a.hadCriticalHeight = true;
                    clientContext.ammoApproach(a.x, a.dirX, a.dirY, sweeperAmmoSpeedMultiple);
                }
            }
        }
    }
}
