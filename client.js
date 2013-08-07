var socket;
var onlookers = []; // additional spectators but you on spectator game
var spectators = []; // spectators on hero game
var queuepos = "X";

require.config({
  urlArgs: "bust=" +  (new Date()).getTime()
});

require(
        ["akihabara/gbox.js",
         "akihabara/iphopad.js",
         "akihabara/trigo.js",
         "akihabara/toys.js",
         "akihabara/help.js",
         "akihabara/tool.js",
         "akihabara/gamecycle.js",
         "fingerprint.min.js"], 
         function() {
            initCosmicsOrSpectators();
          });
//----------------------------------------------------------------------------------------------------
function initCosmicsOrSpectators() {
    if (typeof io != 'undefined') {
        socket = io.connect("http://"+gameServer, {port: 54475, transports: ["websocket"]});
        socket.on("connect", onSocketConnected);
        socket.on("disconnect", onSocketDisconnect);

        socket.on("init hero", initHeroGame);
        socket.on("init spectator", initSpectatorGame);
    }
    else {
        console.log("no server available");
        initSoloHeroGame();
    }    
}
function initSoloHeroGame() {
    require(["client/cosmics_objects"+minExt+".js", "client/shared_objects"+minExt+".js", 
             "client/cosmics"+minExt+".js", "client/levels"+minExt+".js"], function() {    
        console.log("initSoloHeroGame");
        initCosmics("the_one", null);
    });  
}
//----------------------------------------------------------------------------------------------------
// clientContexts for callbacks from games
// cosmics game
var cosmicsClientContext = {
    commitCosmicsGameStart: function(hero) {  
        console.log("commitCosmicsGameStart with "+hero.id+" / "+hero.x);
        // if one hero can play multiple games one after another
        // we need to empty specator queue and remove listeners
        spectators.length = 0; 
        socket.removeListener("new spectator", onNewSpectator);
        socket.removeListener('remove spectator', onRemoveSpectator);
        socket.removeListener('pos spectator', onPosSpectator);
        socket.removeListener('hope spectator', onHopeSpectator);
        socket.removeListener('jump spectator', onJumpSpectator);
        socket.removeListener('explode spectator', onExplodeSpectator);
        socket.removeListener('walk spectator', onWalkSpectator);
        socket.on("new spectator", onNewSpectator);
        socket.on("remove spectator", onRemoveSpectator);
        socket.on("pos spectator", onPosSpectator);
        socket.on("hope spectator", onHopeSpectator);
        socket.on("jump spectator", onJumpSpectator);
        socket.on("explode spectator", onExplodeSpectator);
        socket.on("walk spectator", onWalkSpectator);
        socket.on("show rank", onShowRank);

        socket.emit("commit cosmics", {id:hero.id, x:hero.x });
    },
    changePos: function(hero) {  
        socket.emit("pos hero", {id:hero.id, x:hero.x });
    },
    jump: function(hero) {  
        socket.emit("jump hero", {id:hero.id });
    },
    shoot: function(hero) {  
        socket.emit("shoot hero", {id:hero.id });
    },
    explode: function(hero) {  
        socket.emit("explode hero", {id:hero.id });
    },
    ghost: function(hero) {  
        socket.emit("ghost hero", {id:hero.id });
    },
    normal: function(hero) {  
        socket.emit("normal hero", {id:hero.id });
    },
    fall: function(hero, centerX, direction) {  
        socket.emit("fall hero", {id:hero.id, x:centerX, dir:direction});
    },
    setFloorData: function(floorTiles) {  // array of true or false
        socket.emit("floor data", floorTiles );
    },
    meteorApproach: function(x, speed) {  // pos and speed
        socket.emit("meteor approach", {x:x, speed:speed });
    },
    rocketApproach: function(rocketType, airSpeed, groundSpeed) {  // rocket type (left=0/right=1), air and ground speed
        socket.emit("rocket approach", {rocketType:rocketType, airSpeed:airSpeed, groundSpeed:groundSpeed });
    },
    bombApproach: function(x, speed) {  // pos and speed
        socket.emit("bomb approach", {x:x, speed:speed });
    },
    ammoApproach: function(x, dirX, dirY, speed) {  // startpos, direction and speed
        socket.emit("ammo approach", {x:x, dirX: dirX, dirY: dirY, speed:speed });
    },
    gameOver: function(heroId, score) {
        socket.emit("game over", {id: heroId, score:score} );
    },
    submitName: function(heroId, name) {
        socket.emit("submit name", {id: heroId, name:name} );
    }
};
//----------------------------------------------------------------------------------------------------
// spectator game
var spectatorClientContext = {
    queuepos: queuepos,
    onlookers: onlookers,
    commitSpectatorGameStart: function(spectator) { 
        console.log("commitSpectatorGameStart with "+spectator.id+" / "+spectator.absX);
        socket.on("new spectator", onNewOnlooker);
        socket.on("remove spectator", onRemoveOnlooker);
        socket.on("pos spectator", onPosOnlooker);
        socket.on("hope spectator", onHopeOnlooker);
        socket.on("jump spectator", onJumpOnlooker);
        socket.on("explode spectator", onExplodeOnlooker);
        socket.on("walk spectator", onWalkOnlooker);

        socket.on("new hero", onNewHero);
        socket.on("remove hero", onRemoveHero);
        socket.on("pos hero", onPosHero);
        socket.on("jump hero", onJumpHero);
        socket.on("shoot hero", onShootHero);
        socket.on("explode hero", onExplodeHero);
        socket.on("ghost hero", onGhostHero);
        socket.on("normal hero", onNormalHero);
        socket.on("fall hero", onFallHero);

        socket.on("floor data", onFloorData);

        socket.on("meteor approach", onMeteorApproach);
        socket.on("rocket approach", onRocketApproach);
        socket.on("bomb approach", onBombApproach);
        socket.on("ammo approach", onAmmoApproach);

        socket.on("set queuepos", onSetQueuepos);
        socket.on("be hero", onBeHero);
        socket.on("get caught", onGetCaught);

        socket.emit("commit spectator", {id:spectator.id, x:spectator.absX, female:spectator.female });
    },
    changePos: function(spectator) { 
        socket.emit("pos spectator", {id:spectator.id, x:spectator.absX, heading:spectator.heading });
    },
    hope: function(spectator) { 
        socket.emit("hope spectator", {id:spectator.id });
    },
    jump: function(spectator) { 
        socket.emit("jump spectator", {id:spectator.id });
    },
    explode: function(spectator) {  
        socket.emit("explode spectator", {id:spectator.id });
    },
    walkAgain: function(spectator) {  
        socket.emit("walk spectator", {id:spectator.id });
    }
};
//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------
// callbacks from server
// connect, init and timeout stuff
function onSocketConnected() {
    console.log("Connected to socket server");
};

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
}; 

function initHeroGame(data) {
    require(["client/cosmics_objects"+minExt+".js", "client/shared_objects"+minExt+".js", 
             "client/cosmics"+minExt+".js", "client/levels"+minExt+".js"], function() {    
        console.log("initHeroGame");
        fp = new Fingerprint().get();
        socket.emit('fingerprint hero', { id:data.id, fp:fp });
        destroySpectatorGame();
        initCosmics(data.id, cosmicsClientContext);
        socket.on("timeout warn", onTimeoutWarnHero);
        socket.on("timeout", onTimeoutHero);
        socket.on("dos", onDosHero);
    });  
}

function onTimeoutWarnHero() {
    cosmicsGame.triggerTimeoutWarning();
}

function onTimeoutHero() {
    cosmicsGame.triggerTimeout();
}

function onDosHero() {
    dos = true;
}


function initSpectatorGame(data) {
    require(["client/spectators_objects"+minExt+".js", "client/shared_objects"+minExt+".js", 
             "client/spectators"+minExt+".js"], function() {
        destroyCosmicsGame();
        console.log("initSpectatorGame");
        initSpectators(data.id, spectatorClientContext);
    });  
}
//----------------------------------------------------------------------------------------------------
// for cosmics game
function onNewSpectator(data) {
    console.log("onNewSpectator, id: "+data.id+", pos:"+data.x);
    var spectator = createSpectator(data.x, "spectators", data.id, data.dead, data.female, false);
    spectators.push(spectator);
};

function onPosSpectator(data) {
    var spectator = spectatorById(data.id);
    spectator.setX(data.x, data.heading);
};

function onHopeSpectator(data) {
    var spectator = spectatorById(data.id);
    spectator.initHope();
};

function onJumpSpectator(data) {
    var spectator = spectatorById(data.id);
    spectator.initJump();
};

function onExplodeSpectator(data) {
    var spectator = spectatorById(data.id);
    spectator.initExplode();
};

function onWalkSpectator(data) {
    var spectator = spectatorById(data.id);
    spectator.initWalk();
};

function onShowRank(data) {
    highscoreRank = data.rank;
};

function onRemoveSpectator(data) {
    console.log("onRemoveSpectator, id: "+data.id);
    var spectator = spectatorById(data.id);
    if (!spectator) {
        util.log("spectator to remove not found: "+data.id);
        return;
    };
    spectators.splice(spectators.indexOf(spectator), 1);
    gbox.trashObject(spectator);
};
//----------------------------------------------------------------------------------------------------
// for spectator game
function onNewHero(data) {
    console.log("onNewHero, id: "+data.id+"/ x:"+data.x);
    spectatorsGame.hero.initNormal();
    spectatorsGame.hero.setX(data.x);
    if (data.x >= 0) {  // show hero msg only if hero is also playing
        arbitMsg = "     New Level      ";
        spectatorsGame.initArbitMsg();
    }    
};

function onPosHero(data) {
    spectatorsGame.hero.setX(data.x);
};

function onJumpHero(data) {
    spectatorsGame.hero.initJump();
};

function onShootHero(data) {
    spectatorsGame.bulletManager.tryNextBullet();
};

function onExplodeHero(data) {
    spectatorsGame.hero.initExplode();
};

function onGhostHero(data) {
    spectatorsGame.hero.initGhost();
};

// back to normal state
function onNormalHero(data) {
    spectatorsGame.hero.initNormal();
};

function onFallHero(data) {
    spectatorsGame.hero.initFall(data.x, data.dir);
};

function onFloorData(data) {
    spectatorsGame.floorManager.setActiveFloorTiles(data);
};


function onMeteorApproach(data) {
    spectatorsGame.meteorManager.spawnNextMeteor(data.x, data.speed);
};

function onRocketApproach(data) {
    spectatorsGame.rocketManager.spawnNextRocket(data.rocketType, data.airSpeed, data.groundSpeed);
};

function onBombApproach(data) {
    spectatorsGame.bombManager.spawnNextBomb(data.x, data.speed);
};

function onAmmoApproach(data) {
    spectatorsGame.ammoManager.spawnNextAmmo(data.x, data.dirX, data.dirY, data.speed);
};


function onSetQueuepos(data) {
    spectatorClientContext.queuepos = data.pos;
};

function onBeHero(data) {
    window.location.reload(false);  // reload should start the hero game
};

function onGetCaught(data) {
    arbitMsg = "invaders has landed!";
    spectatorsGame.initArbitMsg();
    spectatorsGame.invader.setActive(spectatorsGame.you);
};


function onRemoveHero(data) {
    console.log("onRemoveHero, id: "+data.id);
    spectatorsGame.hero.setX(gameSize[0]);
};

function onNewOnlooker(data) {
    console.log("onNewOnlooker, id, female: "+data.id+","+data.female);
    var onlooker = createSpectator(data.x, "onlookers", data.id, data.dead, data.female, true);
    onlookers.push(onlooker);
};

function onPosOnlooker(data) {
    var onlooker = onlookerById(data.id);
    onlooker.setX(data.x, data.heading);
};

function onHopeOnlooker(data) {
    var onlooker = onlookerById(data.id);
    onlooker.initHope();
};

function onJumpOnlooker(data) {
    var onlooker = onlookerById(data.id);
    onlooker.initJump();
};

function onExplodeOnlooker(data) {
    var onlooker = onlookerById(data.id);
    onlooker.initExplode();
};

function onWalkOnlooker(data) {
    var onlooker = onlookerById(data.id);
    onlooker.initWalk();
};

function onRemoveOnlooker(data) {
    console.log("onRemoveOnlooker, id: "+data.id);
    var onlooker = onlookerById(data.id);
    if (!onlooker) {
        util.log("onlooker to remove not found: "+data.id);
        return;
    };
    onlookers.splice(onlookers.indexOf(onlooker), 1);
    gbox.trashObject(onlooker);
};
//----------------------------------------------------------------------------------------------------
// helpers
function onlookerById(id) {
    var i;
    for (i = 0; i < onlookers.length; i++) {
        if (onlookers[i].id == id)
            return onlookers[i];
    }
    return false;
};
//----------------------------------------------------------------------------------------------------
function spectatorById(id) {
    var i;
    for (i = 0; i < spectators.length; i++) {
        if (spectators[i].id == id)
            return spectators[i];
    }
    return false;
};
//----------------------------------------------------------------------------------------------------
// deleting cosmics game
function destroyCosmicsGame() {
    if (typeof cosmicsGame != 'undefined') {
        cosmicsGame.destroyGame();
        delete cosmicsGame;
        grouplist = gbox.getGroups();
        for (i=0; i < grouplist.length; i++) {
            gbox.trashGroup(grouplist[i]);
        }
        delete gbox;
    } 
}
//----------------------------------------------------------------------------------------------------
// deleting spectator game
function destroySpectatorGame() {
    if (typeof spectatorGame != 'undefined') {
        spectatorGame.destroyGame();
        delete spectatorGame;
        grouplist = gbox.getGroups();
        for (i=0; i < grouplist.length; i++) {
            gbox.trashGroup(grouplist[i]);
        }
        delete gbox;
    } 
}