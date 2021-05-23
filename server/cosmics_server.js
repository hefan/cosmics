var util = require("util"),
    io = require("socket.io"),
    redis = require("redis"),
    redisClient = redis.createClient();
//    redisClient = redis.createClient('/home/shartman/.redis/sock');
    Hero = require("./Hero").Hero;
    Spectator = require("./Spectator").Spectator;

var socket,
	  hero,
    spectators,
    floors,

    gameSize = new Array(640, 80),
    viewportSize = new Array(160, 80),
    viewportCenterX = viewportSize[0] / 2;
    highestSpectatorPos = 1,

    vitalSignTestEach = 5000,
    heroTimeoutWarnAt = 15000,
    heroTimeoutAt = 35000,
    spectatorTimeoutAt = 35000,

    currentFingerprint = null;
    lastFingerprintAt = 0;
    fingerprintTimeoutAt = 10000; // time one may press reload again after being the last hero
//---------------------------------------------------------------------------------------------
function init() {
	  hero = null;
    spectators = [];
    floors = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
    socket = io.listen(54475);
		socket.configure(function() {
    	socket.set("transports", ["websocket"]);
    	socket.set("log level", 2);
	});
	setEventHandlers();

  var vitalSignInterval = setInterval(function() {
      if (hero !== null) {
          checkHeroVitalSign();
      }

      for (var i=0; i < spectators.length; i++) {
          checkSpectatorVitalSign(spectators[i]);
      };

  } , vitalSignTestEach );
};
//---------------------------------------------------------------------------------------------
function checkHeroVitalSign() {
    var timeGone = (new Date().getTime() - hero.getLastSign());
//    util.log("last Hero vital sign: "+timeGone+" milliseconds");
    if ( timeGone >= heroTimeoutAt) {
      socket.sockets.socket(hero.id).emit("timeout");
      onGameOver(hero);
    }
    else if ( timeGone >= heroTimeoutWarnAt) {
      socket.sockets.socket(hero.id).emit("timeout warn");
    }
}
//---------------------------------------------------------------------------------------------
function checkSpectatorVitalSign(spectator) {
    var timeGone = (new Date().getTime() - spectator.getLastSign());
//    util.log("last Spectator pos:"+spectator.getPos()+", id:"+spectator.id+" vital sign: "+timeGone+" milliseconds");
    if ( timeGone >= spectatorTimeoutAt) {
        onExplodeSpectator(spectator);
    }
}
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
var setEventHandlers = function() {
    socket.sockets.on("connection", onSocketConnection);
};
//---------------------------------------------------------------------------------------------
function onSocketConnection(client) {
   util.log("New client has connected: "+client.id);
    if (hero === null) {
    	  createHero(client);
    }
    else { //spectator
    	  createSpectator(client);
  	}
    // comes from all
  	client.on("disconnect", onClientDisconnect);

    // comes from cosmics game
    client.on("fingerprint hero", onHeroFingerprint);
  	client.on("commit cosmics", onCommitCosmics);
    client.on("pos hero", onPosHero);
    client.on("jump hero", onJumpHero);
    client.on("shoot hero", onShootHero);
    client.on("explode hero", onExplodeHero);
    client.on("ghost hero", onGhostHero);
    client.on("normal hero", onNormalHero);
    client.on("fall hero", onFallHero);

    client.on("floor data", onFloorData);

    client.on("meteor approach", onMeteorApproach);
    client.on("rocket approach", onRocketApproach);
    client.on("bomb approach", onBombApproach);
    client.on("ammo approach", onAmmoApproach);

    client.on("game over", onGameOver);
    client.on("submit name", onSubmitHighscoreName);

    // comes from spectator game
  	client.on("commit spectator", onCommitSpectator);
  	client.on("pos spectator", onPosSpectator);
    client.on("hope spectator", onHopeSpectator);
    client.on("jump spectator", onJumpSpectator);
    client.on("explode spectator", onExplodeSpectator);
    client.on("walk spectator", onWalkSpectator);
};
//---------------------------------------------------------------------------------------------
function onClientDisconnect() {
    util.log("Client has disconnected: "+this.id);
    if (isHero(this.id)) {
    	removeHero(this);
    }
    else { // spectator
    	removeSpectator(this);
    }
};
//---------------------------------------------------------------------------------------------
function createHero(client) {
  socket.sockets.socket(client.id).emit('init hero', { id:client.id });
  util.log("hero with id "+client.id+" connected");
	hero = new Hero(-100,0);
	hero.id = client.id;
}
//---------------------------------------------------------------------------------------------
function onHeroFingerprint(client) {
  util.log("hero with id "+client.id+" has sent fingerprint "+client.fp);
  if (client.id != hero.id) return; // spectator or other than currently connected hero has send fingerprint

  if (!checkHeroFingerprint(client.fp)) {
      socket.sockets.socket(hero.id).emit("dos");
      onGameOver(hero);
  }
}
//---------------------------------------------------------------------------------------------
function onCommitCosmics(client) { // cosmics game started, tell hero about existing spectators
  util.log("hero with id "+client.id+" / "+client.x+" commited");
  if (isHero(client.id)) {
      hero.setX(client.x);
      this.broadcast.emit('new hero', { id:hero.id, x:hero.getX() }); // tell spectators about hero
      for (var i = 0; i < spectators.length; i++) { // tell hero about existing spectators
          this.emit("new spectator", { id: spectators[i].id, x:spectators[i].getX(), dead:spectators[i].isDead(), female:spectators[i].isFemale() });
      };
  }
  else {
      util.log("COMMITED HERO NOT FOUND");
  }
}
//---------------------------------------------------------------------------------------------
function removeHero(client) {
    // just act like game over
    onGameOver(client);
}
//---------------------------------------------------------------------------------------------
function onPosHero(client) {
//  util.log("hero with id "+client.id+" / "+client.x+" should be positioned");
  if (isHero(client.id)) {
      hero.setX(client.x);
      this.broadcast.emit('pos hero', { id:hero.id, x:hero.getX() });
  }
  else {
      util.log("HERO TO POSITION NOT FOUND");
  }
}
//---------------------------------------------------------------------------------------------
function onJumpHero(client) {
  if (isHero(client.id)) {
      hero.jump();
      this.broadcast.emit('jump hero', { id:hero.id });
  }
  else {
      util.log("HERO TO JUMP NOT FOUND");
  }
}
//---------------------------------------------------------------------------------------------
function onShootHero(client) {
  if (isHero(client.id)) {
      hero.shoot();
      this.broadcast.emit('shoot hero', { id:hero.id });
  }
  else {
      util.log("HERO TO SHOOT BULLET FROM NOT FOUND");
  }
}
//---------------------------------------------------------------------------------------------
function onExplodeHero(client) {
  if (isHero(client.id)) {
      hero.explode();
      this.broadcast.emit('explode hero', { id:hero.id });
  }
  else {
      util.log("HERO TO EXPLODE NOT FOUND");
  }
}
//---------------------------------------------------------------------------------------------
function onGhostHero(client) {
  if (isHero(client.id)) {
      hero.ghost();
      this.broadcast.emit('ghost hero', { id:hero.id });
  }
  else {
      util.log("HERO TO GHOST NOT FOUND");
  }
}
//---------------------------------------------------------------------------------------------
function onNormalHero(client) {
  if (isHero(client.id)) {
      hero.normal();
      this.broadcast.emit('normal hero', { id:hero.id });
  }
  else {
      util.log("HERO TO NORMALIZE NOT FOUND");
  }
}
//---------------------------------------------------------------------------------------------
function onFallHero(client) {
  if (isHero(client.id)) {
      hero.fall();
      this.broadcast.emit('fall hero', { id:hero.id, x:client.x, dir:client.dir });
  }
  else {
      util.log("HERO TO FALL NOT FOUND");
  }
}

//---------------------------------------------------------------------------------------------
function onFloorData(client) {
    if (hero != null) hero.setSign();
    floors = client;
    this.broadcast.emit('floor data', floors);
}
//---------------------------------------------------------------------------------------------
function onMeteorApproach(client) {
    if (hero != null) hero.setSign();
    this.broadcast.emit('meteor approach', { x: client.x, speed: client.speed });
}

//---------------------------------------------------------------------------------------------
function onRocketApproach(client) {
    if (hero != null) hero.setSign();
    this.broadcast.emit('rocket approach', { rocketType: client.rocketType, airSpeed: client.airSpeed, groundSpeed: client.groundSpeed });
}

//---------------------------------------------------------------------------------------------
function onBombApproach(client) {
    if (hero != null) hero.setSign();
    this.broadcast.emit('bomb approach', { x: client.x, speed: client.speed });
}

//---------------------------------------------------------------------------------------------
function onAmmoApproach(client) {
    if (hero != null) hero.setSign();
    this.broadcast.emit('ammo approach', { x: client.x, dirX: client.dirX, dirY: client.dirY, speed: client.speed });
}

//---------------------------------------------------------------------------------------------
// game over from hero, set null, tell spectators
function onGameOver(client) {
    util.log("game over: "+client.id);
    if (isHero(client.id)) {

      // tell spectators about hero
      socket.sockets.emit('remove hero', { id:client.id });
      hero = null;

      // tell first spectator he should be a hero now
      fs = firstSpectator();
      if (fs != null) socket.sockets.socket(fs.id).emit("be hero");

      // tell other spectators the game is over and they are gonna get by the invaders
      for (i=0; i < spectators.length; i++) {
          if (spectators[i].id != fs.id) {
            socket.sockets.socket(spectators[i].id).emit("get caught");
          }
      }
      saveAnonHighscore(client.id, client.score);
    }
    else {
      util.log("hero with id "+client.id+" for game over not found");
    }
}
//---------------------------------------------------------------------------------------------
function createSpectator(client) { // init spectator and give id to client
  socket.sockets.socket(client.id).emit("init spectator", { id:client.id } );
  util.log("spectator with id "+client.id+" connected");
//  logSpectators();
}
//---------------------------------------------------------------------------------------------
function onCommitSpectator(client) { // spectator game started
  // if there is no more hero (removed during not starting the spectaor game and stay in the start screen)
  // start cosmics game instead
  if (hero == null){
    socket.sockets.socket(client.id).emit("be hero");
    return;
  }
  console.log("spectator with id / x / female "+client.id+" / "+client.x+" / "+client.female+" commited");

	var spectator = new Spectator(client.id, client.x, highestSpectatorPos, client.female);
  highestSpectatorPos++;
  this.broadcast.emit("new spectator", { id:spectator.id, x:spectator.getX(), dead:spectator.isDead(), female:spectator.isFemale() } );

  // tell new spectator his pos in queue
  this.emit("set queuepos", { pos:spectator.getPos() });

  // tell new spectator about existing spectators
	var i;
	for (i=0; i < spectators.length; i++) {
    	this.emit("new spectator", { id: spectators[i].id, x:spectators[i].getX(), dead:spectators[i].isDead(), female:spectators[i].isFemale() });
	};

  // tell new spectator about hero
  if (hero !== null ) this.emit("new hero", { id: hero.id, x:hero.getX() });

  // tell new spectator about condition of the floor
  this.emit('floor data', floors);

	spectators.push(spectator);
  logSpectators();
}
//---------------------------------------------------------------------------------------------
function onPosSpectator(client) {
//  util.log("spectator with id "+client.id+" / "+client.x+" should be positioned");
	var spectator = spectatorById(client.id);
	if (!spectator) {
	    util.log("Spectator to position not found: "+client.id);
	    return;
	};
	spectator.setX(client.x);
	this.broadcast.emit("pos spectator", { id: spectator.id, x: spectator.getX(), heading: client.heading });
//	logSpectators();
}
//---------------------------------------------------------------------------------------------
function onHopeSpectator(client) {
//  util.log("spectator with id "+client.id+" / "+client.x+" should be hoped up");
  var spectator = spectatorById(client.id);
  if (!spectator) {
      util.log("Spectator to hope not found: "+client.id);
      return;
  };
  spectator.setSign();
  this.broadcast.emit("hope spectator", { id: spectator.id });
}
//---------------------------------------------------------------------------------------------
function onJumpSpectator(client) {
//  util.log("spectator with id "+client.id+" / "+client.x+" should be positioned");
  var spectator = spectatorById(client.id);
  if (!spectator) {
      util.log("Spectator to jump not found: "+client.id);
      return;
  };
  spectator.setSign();
  this.broadcast.emit("jump spectator", { id: spectator.id });
}
//---------------------------------------------------------------------------------------------
function onExplodeSpectator(client) {
  var spectator = spectatorById(client.id);
  if (!spectator) {
      util.log("Spectator to explode not found: "+client.id);
      return;
  };
  spectator.setDead(true);
  socket.sockets.emit("explode spectator", { id: spectator.id });
//  this.broadcast.emit("explode spectator", { id: spectator.id });

  // put spectator to the end of the queue
  spectators.splice(spectators.indexOf(spectator), 1);
  spectators.push(spectator);
  computeSpectatorPositions();
  // tell all spectators about their queue positions
  var i;
  for (i=0; i < spectators.length; i++) {
      socket.sockets.socket(spectators[i].id).emit('set queuepos', { pos:spectators[i].getPos() } );
  };
  logSpectators();
}
//---------------------------------------------------------------------------------------------
function onWalkSpectator(client) {
  var spectator = spectatorById(client.id);
  if (!spectator) {
      util.log("Spectator to walk not found: "+client.id);
      return;
  };
  spectator.setDead(false);
  this.broadcast.emit("walk spectator", { id: spectator.id });
}
//---------------------------------------------------------------------------------------------
function removeSpectator(client) {
  util.log("remove spectator with id "+client.id);
	var spectator = spectatorById(client.id);
	if (!spectator) {
	    util.log("Disconnected Spectator not found or no commited game: "+client.id);
	    return;
	};
  spectators.splice(spectators.indexOf(spectator), 1);
  computeSpectatorPositions();

  //tell spectators their new pos in queue
  var i;
  for (i=0; i < spectators.length; i++) {
      socket.sockets.socket(spectators[i].id).emit('set queuepos', { pos:spectators[i].getPos() } );
  };
  client.broadcast.emit('remove spectator', { id:spectator.id } );
	logSpectators();
}
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
function checkHeroFingerprint(fp) {
    // old fingerprint, do not allow same fp if no timeout occured for current fingerprint
    if (fp == currentFingerprint) {
        var timeGone = (new Date().getTime() - lastFingerprintAt);
        if (timeGone >= fingerprintTimeoutAt) {
            // renew fpAt
            lastFingerprintAt = new Date().getTime();
            return true
        }
        return false; // reloaded too fast
    }
    else { // new fingerprint
        currentFingerprint = fp;
        lastFingerprintAt = new Date().getTime();
        return true;
    }
};
//---------------------------------------------------------------------------------------------
function isHero(id) {
	if (hero !== null) {
		if (hero.id == id) {
			return hero;
		}
	}
	return null;
};
//---------------------------------------------------------------------------------------------
function spectatorById(id) {
    var i;
    for (i = 0; i < spectators.length; i++) {
        if (spectators[i].id == id)
            return spectators[i];
    }
    return false;
};
//---------------------------------------------------------------------------------------------
function firstSpectator() {
    if (spectators.length == 0) return null;
    return spectators[0];
};
//---------------------------------------------------------------------------------------------
function computeSpectatorPositions() {
    var i;
    for (i = 0; i < spectators.length; i++) {
        spectators[i].setPos(i+1);
    }
    highestSpectatorPos = i+1;
};
//---------------------------------------------------------------------------------------------
function logSpectators() {
		util.log("SPECTATORS:");
    for (i = 0; i < spectators.length; i++) {
        util.log(i+": "+spectators[i].id+", POS:"+spectators[i].getPos()+", X:"+spectators[i].getX()+", female:"+spectators[i].isFemale());
    }
};
//---------------------------------------------------------------------------------------------
function saveAnonHighscore(id, score) {
//  util.log("id "+id+" has score: "+score);
  redisClient.zadd("anonscores", score, id, redis.print);
}
//---------------------------------------------------------------------------------------------
function onSubmitHighscoreName(client) {
//  util.log("submit highscore name for id "+client.id+", with name: "+client.name);

  idScore = redisClient.zscore("anonscores", client.id, function (err, retval) {
//    util.log("found score: "+retval);
    if (retval >= 1) {
      redisClient.zadd("scores", retval, client.name+"_"+client.id, redis.print);
      redisClient.zrem("anonscores", client.id);

      // send rank back to client
      redisClient.zrevrank("scores", client.name+"_"+client.id, function (err, rank) {
        if (rank >= 0) {  // rank 0 means 1st place
          socket.sockets.socket(client.id).emit("show rank", { rank:rank + 1 });
        }
      });
    }
  });
}

init();
