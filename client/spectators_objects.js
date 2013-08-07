//------------------------------------------------------------------------------------------------------------------------
function createBg() {
    return gbox.addObject({
        group: 'bgs', id: 'bg', tileset:'bgTile',

        initialize: function() {  // gbox callback
            frameNr = 0;
            this.x = 0;
        },

        first: function() {
            frameNr++;
        },

        blit: function() {
            gbox.blitFade(gbox.getBufferContext(), {alpha: 1});
            gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:0,dx:this.x-viewportX,dy:0});
        }
    });
}
//------------------------------------------------------------------------------------------------------------------------
function createQueueInfo(motherObject) {
    return gbox.addObject({
        group: 'info', id: 'queue_info', tileset:'queueNrTiles',

        initialize: function() {  // gbox callback
            this.motherObject = motherObject;
            frameNr = 0;
            this.xOffset = queueNrSize[0];
            this.yOffset = queueNrSize[1] + 2;
            this.x = this.motherObject.x - this.xOffset;
            this.y = this.motherObject.y - this.yOffset;
            this.queuepos = "1";
            this.total = "0";
            this.transp = 1;
            this.blendSpeed = 1;
        },

        setNr: function(queuepos, total) {
            this.queuepos = queuepos.toString();
            this.total = total.toString();
        },

        first: function() {
            this.x = this.motherObject.x - this.xOffset;
            this.y = this.motherObject.y - this.yOffset;

            // blend queueinfo or not
            if ( (frameNr%this.blendSpeed) == 0 ) {
                if (this.motherObject.isStanding) {  
                    this.transp = this.transp + 0.1;
                    if (this.transp >= 0.9) this.transp = 0.999999;
                }
                else {
                    this.transp = this.transp - 0.1;
                    if (this.transp <= 0.1) this.transp = 0.01;
                }
            }
            if (this.motherObject.state == 0) this.motherObject.isStanding = true; // reset standing variable if motherObject when state is walk
            else this.motherObject.isStanding = false;
        },

        blit: function() { // only blit when mother object is standing
            var x = this.x;
            var i;
            for (i=0; i<this.queuepos.length; i++) {
                gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.queuepos[i],dx:x,dy:this.y,alpha:this.transp});
                x = x + this.w;
            }
            gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:10,dx:x,dy:this.y,alpha:this.transp});
            x = x + this.w;
            for (i=0; i<this.total.length; i++) {
                gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.total[i],dx:x,dy:this.y,alpha:this.transp});
                x = x + this.w;
            }    
        }
    });
}
//------------------------------------------------------------------------------------------------------------------------
function createFloorPieces() {
    var floorPieces = new Array();

    for (i=0; i<nrFloorPieces; i++) {
        floorPieces[i] = createFloorPiece(i);
    }

    return floorManager = {
        pieces: floorPieces,

        setActiveFloorTiles: function(data) {
            for (i=0; i<this.pieces.length; i++) {
                this.pieces[i].isActive = data[i];
            }
        },

        moveAllPieces: function(acc) {
            for (i=0; i<nrFloorPieces; i++) {
                this.pieces[i].x = this.pieces[i].x + acc;
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------
function createFloorPiece(nr) {
    return gbox.addObject ({
        group: 'floor', id: 'floorPiece'+nr,tileset:'floorTiles',

        initialize: function() {  // gbox callback
            this.x = 0 + (nr * floorPieceSize[0]);
            this.y = gbox.getScreenH() - (floorPieceSize[1]);
            this.nr = nr;
//            this.isActive = true;
            this.animSpeed = 25; // after this nr of frames the anim will flip
        },

        blit: function() { // gbox callback
        if (this.isActive) gbox.blitTile(gbox.getBufferContext(),{tileset:'floorTiles',tile:this.nr,dx:this.x - viewportX,dy:this.y});
        else gbox.blitTile(gbox.getBufferContext(),{tileset:'floorBrokenTiles',tile:this.nr,dx:this.x - viewportX,dy:this.y});
    	}
    })
}
//------------------------------------------------------------------------------------------------------------------------
function createHero(startX, startSpeed) {
    return gbox.addObject ({
        group: 'heros', id: 'hero', tileset:'heroTiles', x:startX,

        initialize: function() {
            // 0 = normal, 1 = jumping, 2 = landing ,
            // 3 = falling, 4 = exploding,
            // 100 = dead, 101 = ready to respawn, 102 = ghost
            this.state = 0;
            this.y = this.h / 2;
            this.floorY = this.y;
            this.frame = 0;
            this.frames = heroFrames;
            this.animSpeed = heroAnimSpeed; // after this nr of frames the anim will flip
            this.ghostAnimSpeed = heroGhostAnimSpeed;
            this.explodeAnimSpeed = heroExplodeAnimSpeed;
            this.jumpAnimSpeed = heroJumpAnimSpeed;
            this.flipAnim = 0; // set to 1 when needed
            this.dropFrames = 50; // frames it takes to do the full drop when falling to death
        },

        initJump: function() {  // PUBLIC
	        gbox.hitAudio("herojump");
            this.state = 1;
            this.tileset = 'heroJumpTiles';
            this.frame = 0; // restart frame show
        },

        initFall: function(heroCenterX, direction) {  // PUBLIC
            gbox.hitAudio("herofall");
            if (direction == "right") this.flipAnim = 0;  // default anim = 0 is right handed
            else if (direction == "left") this.flipAnim = 1;

            this.state = 3;
            this.tileset = 'heroFallTiles';
            this.frame = 0; // restart frame show
            this.dropStartX = this.x;
            this.dropStartY = this.y;
            this.dropEndX = floorPieceSize[0] * Math.floor(heroCenterX / floorPieceSize[0]);
            this.dropEndY = this.floorY + (floorPieceSize[1]);

            this.dropStepX = (this.dropEndX - this.dropStartX) / this.dropFrames;
            this.dropStepY = (this.dropEndY - this.dropStartY) / this.dropFrames;
            this.dropFallFrameCounter = 0;
        },

        initExplode: function() {   // PUBLIC
            gbox.hitAudio("heroexplode");
            this.tileset = 'heroExplodeTiles';
            this.frame = 0; // restart frame show
            this.y = this.floorY;  // go to ground
            this.state = 4;
        },

        initGhost: function() {   // PUBLIC
            this.tileset = 'heroGhostTiles';
            this.frame = 0; // restart frame show
            this.y = this.floorY;
            this.state = 102;
        },

        initNormal: function() {   // PUBLIC
            this.tileset = 'heroTiles';
            this.frame = 0; // restart frame show
            this.y = this.floorY;
            this.state = 0;
        },

        setX: function(newX) {
            this.x = newX;
        },

        //--------------------------------
        // PRIVATES
        setNormalFrame: function() {
            if ( (frameNr%this.animSpeed) == 0 ) {
                this.frame++;
                if (this.frame >= this.frames) this.frame = 0;
            }
        },

        setExplodeFrame: function() {
            if ( (frameNr%this.explodeAnimSpeed) == 0 ) {
                this.frame++;
                if (this.frame >= this.frames) {
                    this.frame = this.frames - 1;
                    this.state = 100; // dead
                }
            }
        },

        setGhostFrame: function() {
            if ( (frameNr%this.ghostAnimSpeed) == 0 ) {
                this.frame++;
                if (this.frame >= this.frames) this.frame = 0;
            }
        },

        setJumpFrame: function() {
            if ( (frameNr%this.jumpAnimSpeed) == 0 ) {
                this.frame++;
                if (this.frame >= this.frames) this.frame = 0;
            }
        },

        fall: function() {
            this.dropFallFrameCounter++;
            // position
            this.x += this.dropStepX;
            this.y += this.dropStepY;

            if (this.dropStepX > 0) {
                if (this.x > this.dropEndX) this.x = this.dropEndX;
            } else {
                if (this.x < this.dropEndX) this.x = this.dropEndX;
            }

            if (this.y > this.dropEndY) this.y = this.dropEndY;
            // animation
            if ( (frameNr%(parseInt(this.dropFrames / this.frames))) == 0 ) {
                this.frame++;
                if (this.frame >= this.frames) this.frame = this.frames - 1;
            }
            // end?
            if (this.dropFallFrameCounter > (this.dropFrames * 3)) {
                this.state = 100; // dead
            }
        },

        setFrame: function() {
            switch (this.state) {
                case 0:
                    this.setNormalFrame();
                    break;
                case 1:
                case 2:
                    this.setJumpFrame();
                    break;
                case 4:
                    this.setExplodeFrame();
                    break;
                case 102:
                    this.setGhostFrame();
                    break;
            }
        },

        endJump: function() {
            this.y = this.floorY;
            this.state = 0;
            this.tileset = 'heroTiles';
            this.frame = 0;
        },

        jumpUp: function() {
            this.y = this.y - heroJumpSpeed;
            if (this.y <= (this.floorY - heroJumpHeight)) { // doesnt get higher
                this.y = (this.floorY - heroJumpHeight);
	            gbox.hitAudio("heroland");
                this.state = 2; // landing
            }
        },

        fallFromJump: function () {
            this.y += heroFallFromJumpSpeed;
            if (this.y >= this.floorY) { // landed again
                this.endJump();
            }
        },

        jump: function() {
            if (this.state == 2) {
                this.fallFromJump()
            }
            else {
                this.jumpUp();
            }
        },

        first: function () {  // gbox callback
            switch (this.state) {
                case 0:
                    this.setFrame();
                    break;
                case 1:
                case 2:
                    this.jump();
                    this.setFrame();
                    break;
                case 3:
                    this.fall();
                    break;
                case 4:
                    this.setFrame();
                    break;
                case 102:
                    this.setFrame();
                    break;
            }
        },

        blit: function() { // gbox callback
            if (this.state == 100 || this.state == 101) return; // dont render anything if dead
	        gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.frame,dx:this.x-viewportX ,dy:this.y, fliph:this.flipAnim});
	   }
    })
}
//------------------------------------------------------------------------------------------------------------------------
function createBullets(motherObject) {
    bulletobjs = new Array();
    for (i=0; i<nrBullets; i++) {
        bulletobjs[i] = createBullet(i, motherObject);
    }

    return bulletManager = {
        bullets: bulletobjs,

        tryNextBullet: function() {
            for (i=0; i<this.bullets.length; i++) {
                bullet = this.bullets[i];
                if (!bullet.isActive) {
                    gbox.hitAudio("heroshoot");
                    bullet.startShoot();
                    return;
                }
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------
function createBullet(nr, motherObject) {
    return gbox.addObject ({
        group: 'game_action', id: 'bullet'+nr, tileset:'heroBulletTiles',
        initialize: function() { // gbox callback
            this.motherObject = motherObject;
            this.x = 0;
            this.y = -this.h;
            this.frame = 0;
            this.isActive = false;
            this.animSpeed = 25;
            this.speed = 0;
            this.threshold = 1; 
            this.maxspeed = 10;
        },

        startShoot: function() {  // PUBLIC
            this.x = parseInt(this.motherObject.x + ((this.motherObject.w - this.w) / 2) );
            this.y = this.motherObject.y;
            this.speed = 1;
            this.isActive = true;
        },

        stopShoot: function() {  // PUBLIC
            this.isActive = false;
        },

        // PRIVATES
        accSpeed: function() {
            this.speed++;
            if (this.speed > this.maxspeed) this.speed = this.maxspeed;
        },

        setY: function() {
            this.y = this.y - this.speed;
        },

        fly: function() {
            if ((frameNr%this.threshold) == 0) {
                this.accSpeed();
            }
            this.setY();
        },

        first: function () { // gbox callback
            if (this.isActive) {
                this.fly();
                if (this.y < 0) this.stopShoot();
            }
        },

        blit: function() { // gbox callback
            if (this.isActive) gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.frame,dx:this.x-viewportX,dy:this.y});
        }
    })
}
//------------------------------------------------------------------------------------------------------------------------
function createMeteors() {
    meteorobjs = new Array();
    for (i=0; i<6; i++) {
        meteorobjs[i] = createMeteor(i);
    }

    return meteorManager = {
        meteors: meteorobjs,

        spawnNextMeteor: function(x, speed) {
            for (i=0; i<this.meteors.length; i++) {
                if (!(this.meteors[i].isActive)) {
                    this.meteors[i].respawn(x, speed);
                    return;
                }    
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------
function createMeteor(nr) {
    return gbox.addObject ({
        group: 'game_action', id: 'meteor'+nr, tileset:'meteorTiles',

        initialize: function() { // gbox callback
            this.x = 0;
            this.y = -meteorSize[1];
            this.speed = 0;
            this.frame = 0;
            this.frames = meteorFrames;
            this.isActive = false;
            this.animSpeed = meteorAnimSpeed; // after this nr of frames the anim will flip
            this.explodeAnimSpeed = meteorExplodeAnimSpeed;
            this.explodeState = 0;
            this.explodeSpeeds = new Array(0.75, 0);
            this.explodes = false;
        },

        // PUBLIC
        respawn: function (x, speed) {
			gbox.hitAudio("meteorrespawn");
            this.x = x;
            this.speed = speed;
            this.explodes = false;
            this.tileset = 'meteorTiles';
            this.isActive = true;
        },

        initExplode: function() {   // PUBLIC
			gbox.hitAudio("meteorexplode");
            this.tileset = 'meteorExplodeTiles';
            this.frame = 0; // restart frame show
            this.explodes = true;
            this.explodeState = 0;
            this.y = this.y + this.speed; // looks better to go one further step
        },

        // PRIVATES
        initGroundExplode: function() {   // PUBLIC
            gbox.hitAudio("meteorexplode");
            this.tileset = 'meteorExplodeTiles';
            this.frame = 0; // restart frame show
            this.explodes = true;
            this.explodeState = 1;
        },

        reset: function() {
            this.y = -meteorSize[1];
            this.isActive = false;
            this.frame = 0;
        },

        fly: function() {
            if ((frameNr%this.animSpeed) == 0) {
                this.frame ++;
            }
            if (this.frame >= this.frames) this.frame = 0;

            this.y = this.y + this.speed;
            if (this.y > (gameSize[1] - meteorSize[1])) {
                this.initGroundExplode();
            }
        },

        explode: function() {
            if ((frameNr%this.explodeAnimSpeed) == 0) {
                this.frame ++;
            }
            if (this.frame >= this.frames) {
                this.reset();
                if (this.explodeState == 1) { // ignite fire after hitting the ground
                    spectatorsGame.fireManager.igniteFire(this.x);
                    spectatorsGame.fireManager.igniteFire(this.x+(fireSize[0]));
                    spectatorsGame.fireManager.igniteFire(this.x+(2*fireSize[0]));
                    spectatorsGame.fireManager.igniteFire(this.x+(3*fireSize[0]));
                }
            }
            this.y = this.y + this.explodeSpeeds[this.explodeState];
        },

        first: function () { // gbox callback
            if (this.isActive) {
                if (this.explodes) this.explode();
                else this.fly();
            }
        },

        blit: function() { // gbox callback
	        if (this.isActive) gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.frame,dx:this.x-viewportX,dy:this.y});
	    }
    })
}
//------------------------------------------------------------------------------------------------------------------------
function createBombs() {
    bombobjs = new Array();
    for (i=0; i<20; i++) {
        bombobjs[i] = createBomb(i);
    }

    return bombManager = {
        bombs: bombobjs,

        spawnNextBomb: function(x, speed) {
            for (i=0; i<this.bombs.length; i++) {
                if (!(this.bombs[i].isActive)) {
                    this.bombs[i].respawn(x, speed);
                    return;
                }    
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------
function createBomb(nr) {
    return gbox.addObject ({
        group: 'game_action', id: 'bomb'+nr, tileset:'bombTiles',

        initialize: function() { // gbox callback
            this.x = 0;
            this.y = -bombSize[1];
            this.speed = 0;
            this.frame = 0;
            this.frames = bombFrames;
            this.isActive = false;
            this.animSpeed = bombAnimSpeed; 
            this.explodeAnimSpeed = bombExplodeAnimSpeed; 
            this.tileset = 'bombTiles';
        },

        // PUBLIC
        respawn: function (x, speed) {
            this.x = x;
            this.speed = speed;
            this.isActive = true;
        },

        initExplode: function() {   // PUBLIC
            this.tileset = 'bombExplodeTiles';
            this.frame = 0; // restart frame show
            this.explodes = true;
        },

        // PRIVATES
        reset: function() {
            this.tileset = 'bombTiles';
            this.y = -bombSize[1];
            this.isActive = false;
            this.explodes = false;
            this.frame = 0;
        },

        fly: function() {
            if ((frameNr%this.animSpeed) == 0) {
                this.frame ++;
            }
            if (this.frame >= this.frames) this.frame = 0;

            this.y = this.y + this.speed;
            if (this.y > (gameSize[1]) - bombSize[1]) {
                spectatorsGame.fireManager.igniteFire(this.x + (this.w / 2));
                this.reset();
            }
        },

        explode: function() {
            if ((frameNr%this.explodeAnimSpeed) == 0) this.frame ++;
            if (this.frame >= this.frames) {
                this.reset();
            }
        },

        first: function () { // gbox callback
            if (this.isActive) {
                if (this.explodes) this.explode();
                else this.fly();
            }
        },

        blit: function() { // gbox callback
            if (this.isActive) gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.frame,dx:this.x-viewportX,dy:this.y});
        }
    })
}
//------------------------------------------------------------------------------------------------------------------------
function createInvader(typeNr) {
    return gbox.addObject ({
        group: 'game_action', id:'invader', tileset:'invader'+typeNr+'Tiles',

        initialize: function() {  // gbox callback
            this.x = -invaderSize[0];
            this.y = gameSize[1]-invaderSize[1] - 3;
            this.groundY = this.y;
            this.frame = 0;
            this.frames = invaderFrames;
            this.isActive = false;
            this.state = 0; // 0 = go kill, 1 = go back
            this.animSpeed = invaderAnimSpeed; 
            this.speed = 4;
            this.backspeed = 1;
            this.tolerance = 5;
            this.cageTimer = 0;
            this.cageTime = 50;
            this.targetObject = this;
        },

        setActive: function(toObject) {
            gbox.hitAudio("alien");
            this.x = -invaderSize[0];
            this.isActive = true;
            this.frame = 0;
            this.state = 0;
            this.cageTimer = 0;
            this.targetObject = toObject;
        },

        goBack: function(toObject) {
            this.cageTimer = 0;
            this.state = 1;
        },

        // PRIVATES
        setFrame: function() {
            if ( (frameNr%this.animSpeed) == 0 ) {
                this.frame++;
                if (this.frame >= this.frames) this.frame = 0;
            }
        },

        setBackPos: function() {
            this.x = this.x - this.backspeed;
            if (this.x < (-invaderSize[0])) {
                this.isActive = false;
            }
        },

        setPos: function() {
            targetX = this.targetObject.absX - (this.w / 2) + (this.targetObject.w / 2);
            if ((this.x + this.tolerance) < targetX ) {
                this.x = this.x + this.speed;
            }
            else if ((this.x - this.tolerance) > targetX) {
                this.x = this.x - this.speed;
            }
            else {
                this.cageTimer++;
                if (this.cageTimer >= this.cageTime) {
                    this.goBack();
                    this.targetObject.initExplode();
                }
            }
        },

        first: function () { // gbox callback
            if (this.isActive) {
                this.setFrame();
                if (this.state == 0) {
                    this.setPos();
                }
                else {  // state = 1
                    this.setBackPos();
                }
            }
        },

        blit: function() { // gbox callback
            if (this.isActive) gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.frame,dx:this.x-viewportX,dy:this.y});
        }
    })
}
//------------------------------------------------------------------------------------------------------------------------
function createAmmos() {
    ammoobjs = new Array();
    for (i=0; i<50; i++) {
        ammoobjs[i] = createAmmo(i);
    }

    return ammoManager = {
        ammos: ammoobjs,

        spawnNextAmmo: function(x, dirX, dirY, speed) {
            for (i=0; i<this.ammos.length; i++) {
                if (!(this.ammos[i].isActive)) {
                    this.ammos[i].respawn(x, dirX, dirY, speed);
                    return;
                }    
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------
function createAmmo(nr) {
    return gbox.addObject ({
        group: 'game_action', id: 'ammo'+nr, tileset:'ammoTiles',

        initialize: function() { // gbox callback
            this.state = 0; // 0 = alive and kicking, 1= explode
            this.x = 0;
            this.y = -ammoSize[1];
            this.speed = 0;
            this.frame = 0;
            this.frames = ammoFrames;
            this.isActive = false;
            this.tileset = new Array('ammoTiles', 'ammoExplodeTiles' );
            this.animSpeed = new Array(ammoAnimSpeed,ammoExplodeAnimSpeed); // one per state
        },

        respawn: function(x, dirX, dirY, speed) {
            this.x = x;
            this.y = -ammoSize[1];
            this.dirX = dirX;
            this.dirY = dirY;
            this.speed = speed;
            this.state = 0;
            this.isActive = true;
        },

        initExplode: function() {   // PUBLIC
            this.state = 1;
            this.frame = 0; // restart frame show
        },

        // PRIVATES
        animate: function() {
            if ((frameNr % this.animSpeed[this.state]) == 0) this.frame++;
            if (this.frame >= this.frames) {
                this.frame = 0;
                if (this.state == 1) this.isActive = false; 
            }

        },

        move: function() {
            switch (this.state) {
                case 0:  // alive and kicking
                default:
                        this.x = this.x + (this.dirX * this.speed);
                        this.y = this.y + (this.dirY * this.speed);
                        if (this.x > gameSize[0] || this.x < 0) this.isActive = false;
                        if (this.y > gameSize[1]) {
                            spectatorsGame.fireManager.igniteFire(this.x + (this.w / 2));
                            this.isActive = false;
                        }    
                    break;
                    
                case 1:  // explode
                    break;
            }

        },

        first: function () { // gbox callback
            if (this.isActive) {
                this.animate();
                this.move();
            }
        },

        blit: function() { // gbox callback
            if (this.isActive) {
                gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset[this.state],tile:this.frame,dx:this.x-viewportX,dy:this.y});
            }    
       }
    })
}
//------------------------------------------------------------------------------------------------------------------------
function createRockets() {
    rocketobjs = new Array();
    for (i=0; i<10; i++) {
        rocketobjs[i] = createRocket(i);
    }

    return rocketManager = {
        rockets: rocketobjs,

        spawnNextRocket: function(rocketType, airSpeed, groundSpeed) {
            for (i=0; i<this.rockets.length; i++) {
                if (!(this.rockets[i].isActive)) {
                    this.rockets[i].respawn(rocketType, airSpeed, groundSpeed);
                    return;
                }    
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------
function createRocket(nr) {
    return gbox.addObject ({
        group: 'game_action', id: 'rocket'+nr, tileset:'rocketAirTiles',
        initialize: function() { // gbox callback
            this.type = null;
            this.x = 0;
            this.y = -rocketSize[1];
            this.frame = 0;
            this.frames = rocketFrames;
            this.isActive = false;
            this.explodes = false;
            this.animSpeed = rocketAnimSpeed;
            this.explodeAnimSpeed = rocketExplodeAnimSpeed; 
            this.onGround = false;
            this.groundTolerance = 6; // tolerance with which the rocker flies nearer to the ground;
            this.groundY = (gameSize[1] - floorPieceSize[1] - rocketSize[1]) + this.groundTolerance;
        },

        respawn: function(rocketType, airSpeed, groundSpeed) {
            this.type = rocketType;
            if (this.type == 0) this.x = 0;
            else this.x = battlegroundSize[0] - rocketSize[0];
            this.y = -rocketSize[1];
            this.airSpeed = airSpeed;
            this.groundSpeed = groundSpeed;
            this.onGround = false;
            this.explodes = false;
            this.frame = 0;
            this.tileset = 'rocketAirTiles';
            this.isActive = true;
        },

        initExplode: function() {   // PUBLIC
            this.tileset = 'rocketExplodeTiles';
            this.frame = 0; // restart frame show
            this.explodes = true;
        },

        // PRIVATES
        fly: function() {
            if ((frameNr%this.animSpeed) == 0) this.frame ++;
            if (this.frame >= this.frames) this.frame = 0;

            if (!this.onGround) {
                this.y = this.y + this.airSpeed;
                if (this.y >= this.groundY) {  // switch to on ground mode
                    gbox.hitAudio("rocketlaunch");
                    this.tileset = 'rocketGroundTiles';
                    this.y = this.groundY;
                    this.onGround = true;
                }
            }
            else {  // on ground
                switch (this.type) {  // fly left or right
                    case 0:
                    default:
                        this.x = this.x + this.groundSpeed;
                        if (this.x > battlegroundSize[0]) this.isActive = false;
                        break;

                    case 1:
                        this.x = this.x - this.groundSpeed;
                        if (this.x < (- rocketSize[0])) this.isActive = false;
                        break;
                }
            }
        },

        explode: function() {
            if ((frameNr%this.explodeAnimSpeed) == 0) this.frame ++;
            if (this.frame >= this.frames) this.isActive = false; 
        },

        first: function () { // gbox callback
            if (this.isActive) {
                if (this.explodes) this.explode();
                else this.fly();
            }    
        },

        blit: function() { // gbox callback
            if (this.isActive) gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.frame,dx:this.x-viewportX,dy:this.y,flipv:1,fliph:this.type});
        }
    })
}
//------------------------------------------------------------------------------------------------------------------------
function createYou(startX, absX, group, id, female) {
    return gbox.addObject ({
        group: group, id: id, absX:absX, female:female, tileset:'spectatorFemaleTiles',

        initialize: function() {
            if (this.female) this.tileset = "spectatorFemaleTiles";
            else this.tileset = "spectatorMaleTiles";
            this.x = startX;
            this.groundY = viewportSize[1] - spectatorSize[1];
            this.y = this.groundY;
            this.frame = 0;
            this.frames = spectatorFrames;
            this.animSpeed = spectatorAnimSpeed;
            this.jumpAnimSpeed = spectatorJumpAnimSpeed;
            this.explodeAnimSpeed = spectatorExplodeAnimSpeed;
            this.speed = spectatorSpeed;
            this.jumpWalkSpeed = spectatorJumpSpeed;
            this.state = 0;  // 0 = walk, 1=hope, 2= jump, 3 = explode, 4 = dead
            this.states = ["walk", "hope", "jump", "explode", "dead"];
            this.hopeLength = 50;
            this.hopeCount = 0;
            this.jumpMaxHeight = this.groundY - 11;
            this.jumpUp = true;
            this.jumpSpeed = 1;
            this.heading = 0; //0 = left, 1= right
            this.isStanding = true;  // needed for queue info
            this.dieTime = 0;
            this.dieAgainIn = 250;
            this.balloons = new Array();
            for (i=0; i<balloonsPerSpectator; i++) {
                this.balloons[i] = createBalloon(this, i, false);
            }
        },

        inflateBalloon: function() {
            for (i=0; i<this.balloons.length; i++) {
                if (!(this.balloons[i].isActive)) {
                    this.balloons[i].inflate();
                    return;
                }    
            }
        },

        collBox: function() { // returning normalized you for calculating gbox collisions
            return {x:this.absX, y:this.y, w:this.w, h:this.h};
        },

        steerLeft: function() { 
            if (this.state >= 3) return; // only allow steering when walking, hoping or jumping state
            this.heading = 0; 
            if (this.state == 2) this.steer(-this.jumpWalkSpeed); 
            else this.steer(-this.speed); 
        },
        steerRight: function() { 
            if (this.state >= 3) return; // only allow steering when walking, hoping or jumping state
            this.heading = 1; 
            if (this.state == 2) this.steer(this.jumpWalkSpeed); 
            else this.steer(this.speed); 
        },

        steer: function(acc) { 
            this.isStanding = false;  // needed for queue info
            this.absX = this.absX + acc;
            // do not walk out of screen
            if (this.absX <= 0) {
                this.absX = 0;
                return;
            } 
            else if (this.absX >= (gameSize[0] - this.w)) {
                this.absX = (gameSize[0] - this.w);
                return;
            }
            // stop scrolling left
            else if (this.absX >= (gameSize[0] - viewportCenterX) ) {
                this.x = this.absX - (gameSize[0] - viewportSize[0]);
            } // stop scrolling right
            else if (this.absX < (viewportCenterX + (this.w / 2)) ) {
                this.x = this.absX;
            }
            else { // normal move => move all other stuff
                 viewportX = this.absX - viewportCenterX;  
            }
            this.walk();
        },

        initWalk: function() {
            if (this.female) this.tileset = "spectatorFemaleTiles";
            else this.tileset = "spectatorMaleTiles";
            this.state = 0;
            this.jumpUp = true;
        },

        initHope: function() {
            if (this.female) this.tileset = "spectatorFemaleHopeTiles";
            else this.tileset = "spectatorMaleHopeTiles";
            this.state = 1;
            this.hopeCount = 0;
            this.inflateBalloon();
        },

        initJump: function() {
            if (this.female) this.tileset = "spectatorFemaleJumpTiles";
            else this.tileset = "spectatorMaleJumpTiles";                
            this.frame = 0; // restart frame show
            this.state = 2;
        },

        initExplode: function() {   // PUBLIC
            if (this.state >= 3) return; // return if explode already
            if (this.female) {
                gbox.hitAudio("scream_female");
                this.tileset = "spectatorFemaleExplodeTiles";
            } 
            else {
                gbox.hitAudio("scream_male");
                this.tileset = "spectatorMaleExplodeTiles";
            }                
            this.frame = 0; // restart frame show
            this.state = 3;
            this.y = this.groundY;
        },

        initDead: function() {   // PUBLIC
            this.dieTime = frameNr;
            if (this.female) this.tileset = "spectatorFemaleExplodeTiles";
            else this.tileset = "spectatorMaleExplodeTiles";
            this.frame = this.frames - 1; // last pic of explode
            this.state = 4;
            arbitMsg2 = "Press up to respawn";
            spectatorsGame.initArbitMsg2();
        },

        move: function() {
            switch (this.state) {
                case 0:  // walk
                    break;
                case 1:  // hope a while
                    this.hopeCount++;
                    if (this.hopeCount >= this.hopeLength) {
                        this.initWalk();
                    }
                    break;
                case 2: //jump
                    if ((frameNr%this.jumpSpeed) != 0) return;

                    if (this.jumpUp) {
                        this.y = this.y - 1;
                        if (this.y < this.jumpMaxHeight) this.jumpUp = false;
                    }
                    else { //down
                        this.y = this.y + 1;   
                        if (this.y >= this.groundY) {
                            // back to walk and ready to jump again
                            this.y = this.groundY;
                            this.initWalk();
                        }
                    }
                    break;
                case 3:  // explode
                    break;
                case 4:  // dead
                    if ((frameNr - this.dieTime) > this.dieAgainIn) { // die over and over, you should only step up in queue when living!
                        this.initDead();
                        clientContext.explode(spectatorsGame.you);
                    }
                    break;
            }
        },

        animate: function() {
            switch (this.state) {
                case 0:  // walk anim only when steering
                    break;
                case 1:  // walk anim only when steering
                    break;
                case 2: // jumping
                    if ((frameNr % this.jumpAnimSpeed) == 0) {
                        this.frame++;
                        if (this.frame >= this.frames) {
                            this.frame = 0;
                        }
                    }    
                    break;
                case 3:  // explode
                    if ((frameNr % this.explodeAnimSpeed) == 0) this.frame++;
                    if (this.frame >= this.frames) this.initDead();
                    break;
                case 4:  // dead
                    this.frame = this.frames - 1; // last pic of explode
                    break;
            }
        },

        walk: function() {
            if (this.state >= 2) return; // only walk when walking or hoping state

            if ((frameNr%this.animSpeed) == 0) {
                this.frame ++;
            }
            if (this.frame >= this.frames) {
                this.frame = 0;
            }
        },
        //--------------------------------
        first: function () { // gbox callback
            this.move();
            this.animate();
        },

        // gbox callbacks
        blit: function() { 
           gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.frame,dx:this.x,dy:this.y,fliph:this.heading});
        }
    })
}
