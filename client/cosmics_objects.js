//------------------------------------------------------------------------------------------------------------------------
function createBg() {
    gbox.addObject({
        group: 'bgs', id: 'bg', tileset:'bgTile',

        initialize: function() {  // gbox callback
            frameNr = 0;
        },

        first: function() {
            if (!paused) frameNr++;
        },

        blit: function() {
            gbox.blitFade(gbox.getBufferContext(), {alpha: 1});
            gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:0,dx:0,dy:0});
        }
    });
}
//------------------------------------------------------------------------------------------------------------------------
function createFloorPieces(floorPiecesArr) {
    var floorPieces = new Array();
    for (i=0; i<nrFloorPieces; i++) {
        floorPieces[i] = createFloorPiece(i, floorPiecesArr[i]);
    }

    return floorManager = {
        pieces: floorPieces,

        getActiveFloorTiles: function() {
            var aft = [];
            for (i=0; i<this.pieces.length; i++) {
                if (this.pieces[i].isActive) aft[i] = true;
                else aft[i] = false;
            }
            return aft;
        },

        getFunctionalFloorPlace: function(startpiece) {
            i = startpiece;
            sum = 0;

            while (true) {
                if (i >= nrFloorPieces) i = 0;  // wrap
                p = this.pieces[i];
                if (p.isActive) {
                    return p.x;
                }
                i++;
                sum++;
                if (sum > nrFloorPieces) return null; // wrap only once
            }
        }
    }
}

//------------------------------------------------------------------------------------------------------------------------
function createFloorPiece(nr, active) {
    return gbox.addObject ({
        group: 'floor', id: 'floorPiece'+nr,tileset:'floorTiles',

        initialize: function() {  // gbox callback
            this.x = 0 + (nr * floorPieceSize[0]);
            this.y = gbox.getScreenH() - (floorPieceSize[1]);
            // coords for checking the ships collision:
            // x = x + half w to the right, y = y + half h up
            this.colcheckX = this.x + Math.floor(floorPieceSize[0] / 2);
            this.colcheckY = this.y - Math.floor(floorPieceSize[1] / 2);
            this.isActive = active;
            this.animSpeed = 25; // after this nr of frames the anim will flip
            this.nr = nr;
        },

        blit: function() { // gbox callback
	    if (this.isActive) gbox.blitTile(gbox.getBufferContext(),{tileset:'floorTiles',tile:this.nr,dx:this.x,dy:this.y});
        else gbox.blitTile(gbox.getBufferContext(),{tileset:'floorBrokenTiles',tile:this.nr,dx:this.x,dy:this.y});
	}
    })
}
//------------------------------------------------------------------------------------------------------------------------
function createHero(hero_id, startX, startSpeed) {
    return gbox.addObject ({
        group: 'heros', id: hero_id, tileset:'heroTiles', x:startX,

        initialize: function() {
            // 0 = normal, 1 = jumping, 2 = landing ,
            // 3 = falling, 4 = exploding,
            // 100 = dead, 101 = ready to respawn, 102 = ghost
            this.state = 0;
            this.prevX = this.x;
            this.y = gameSize[1] - floorPieceSize[1] - this.h;
            this.floorY = this.y;
            this.frame = 0;
            this.frames = heroFrames;
            this.animSpeed = heroAnimSpeed; // after this nr of frames the anim will flip
            this.ghostAnimSpeed = heroGhostAnimSpeed;
            this.explodeAnimSpeed = heroExplodeAnimSpeed;
            this.jumpAnimSpeed = heroJumpAnimSpeed;
            this.flipAnim = 0; // set to 1 when needed
            this.accX = 0;
            this.threshold = 5; // on this point of acc the speed gets higher
            if (startSpeed == null) this.speed = 0;
            else this.speed = startSpeed;
            this.maxspeed = 3;

            this.dropFrames = 50; // frames it takes to do the full drop when falling to death
        },

        steerLeft: function() {  // PUBLIC
            this.accX--;
            if (Math.abs(this.accX) > this.threshold) {
                this.speed--;
                this.accX = 0;
            }
            this.speed = Math.max(this.speed, -(this.maxspeed));
        },

        steerRight: function() {  // PUBLIC
            this.accX++;
            if (Math.abs(this.accX) > this.threshold) {
                this.speed++;
                this.accX = 0;
            }
            this.speed = Math.min(this.speed, this.maxspeed);
        },

        resetAcc: function() { // PUBLIC
            this.accX = 0;
            this.speed = 0;
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
            this.resetAcc();
            // start on free floor
            this.x = cosmicsGame.floorManager.getFunctionalFloorPlace(Math.floor(nrFloorPieces / 2));
            if (this.x == null) this.x = Math.floor(battlegroundSize[0] / 2);

            this.y = this.floorY;
            this.state = 102;
        },

        //--------------------------------
        // PRIVATES
        setX: function() {
            this.x = this.x+this.speed;
            if (this.x < 0 ) this.x = 0;
            if (this.x > (gbox.getScreenW() - this.w) ) this.x = gbox.getScreenW()- this.w;
        },

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
            if (!paused) {
                switch (this.state) {
                    case 0:
                        this.setX();
                        this.setFrame();
                        break;
                    case 1:
                    case 2:
                        this.setX();
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
                        this.setX();
                        this.setFrame();
                        break;
                }
            }
        },

        blit: function() { // gbox callback
            if (this.state == 101) return; // dont render anything if dead
	        gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.frame,dx:this.x,dy:this.y, fliph:this.flipAnim});
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
            for (i=0; i<nrBullets; i++) {
                bullet = this.bullets[i];
                if (!bullet.isActive) {
                    gbox.hitAudio("heroshoot");
                    bullet.startShoot();
                    return true;
                }
            }
            return false;
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------
function createBullet(nr, motherObject) {
    return gbox.addObject ({
        group: 'herobullets', id: 'bullet'+nr, tileset:'heroBulletTiles',
        initialize: function() { // gbox callback
            this.x = 0;
            this.y = -this.h;
            this.frame = 0;
            this.isActive = false;
            this.animSpeed = 25; // after this nr of frames the anim will flip
            this.speed = 0;
            this.threshold = 1;  // after this nr of frames the shoot will increase speed
            this.maxspeed = 10;
        },

        startShoot: function() {  // PUBLIC
            this.x = parseInt(motherObject.x + ((motherObject.w - this.w) / 2) );
            this.y = motherObject.y - this.h;
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
            if (!paused) {
                if (this.isActive) {
                    this.fly();
                    if (this.y < 0) {
                        this.stopShoot();
                        pointsInvaderMultiplier = 1; // normal ending of missile means reset multiplier
                    }
                }
            }
        },

        blit: function() { // gbox callback
	        if (this.isActive) gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.frame,dx:this.x,dy:this.y});
	    }
    })
}
//------------------------------------------------------------------------------------------------------------------------
function createMeteors() {
    meteorobjs = new Array();
    for (i=0; i<maxNrMeteors; i++) {
        meteorobjs[i] = createMeteor(i, meteorSpeed, meteorsFlip);
    }

    return meteorManager = {
        meteors: meteorobjs,
        lastActivation : 0,
        pauseToNext: nextMeteorPause[0],

        tryNextMeteor: function() {
            if (frameNr > (this.lastActivation + (this.pauseToNext * gbox.getFps())) ) {  // its about time for the next
                for (i=0; i<maxNrMeteors; i++) {
                    meteor = this.meteors[i];
                    if (!meteor.isActive) {
                        meteor.respawn();
                        this.lastActivation = frameNr;
                        this.pauseToNext = nextMeteorPause[Math.floor(Math.random() * nextMeteorPause.length)];
                        break;
                    }
                }
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------
function createMeteor(nr, speed, mayFlip) {
    return gbox.addObject ({
        group: 'meteors', id: 'meteor'+nr, tileset:'meteorTiles',

        initialize: function() { // gbox callback
            this.x = 0;
            this.y = -meteorSize[1];
            this.frame = 0;
            this.frames = meteorFrames;
            this.isActive = false;
            this.animSpeed = meteorAnimSpeed; // after this nr of frames the anim will flip
            this.explodeAnimSpeed = meteorExplodeAnimSpeed;
            this.mayFlip = mayFlip;
            this.flipSpeed = 40; // after this nr of frames there is a 50/50 chance to change direction
            this.isFlipping = false; // indicates if there is a flipping proccess
            this.flipDestX = this.x;  // place to flip to
            this.speed = speed;
            this.explodeState = 0;
            this.explodeSpeeds = new Array(0.75, 0);
            this.explodes = false;
            this.hadCriticalHeight = false;
        },

        // PUBLIC
        respawn: function () {
			gbox.hitAudio("meteorrespawn");
            floorSlot = Math.floor(Math.random() * nrFloorPieces);
            this.x = cosmicsGame.floorManager.pieces[floorSlot].x
            this.explodes = false;
            this.tileset = 'meteorTiles';
            this.isFlipping = false;
            this.isActive = true;
            this.hadCriticalHeight = false;
        },

        initExplode: function() {   // PUBLIC
			gbox.hitAudio("meteorexplode");
            this.tileset = 'meteorExplodeTiles';
            this.frame = 0; // restart frame show
            this.explodes = true;
            this.explodeState = 0;
            this.y = this.y + speed; // looks better to go one further step
        },

        // PRIVATES
        initGroundExplode: function() {   // PUBLIC
            gbox.hitAudio("meteorground");
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
            if (this.y > (gameSize[1] - meteorSize[1] )) {
                this.initGroundExplode();
            }
        },

        flip: function() {
            if (!this.isFlipping) {
                if (this.y < (battlegroundSize[1] - meteorNoFlipHeight) ) { // only flip not in sensitive zone
                    if ((frameNr%this.flipSpeed) == 0) {
                        flipDir = (Math.floor(Math.random() * 3)) - 1;  // left = 1 or not = 0 or right = 1
                        this.flipDestX = this.x + (flipDir * meteorSize[0]);
                        this.isFlipping = true;
                    }
                }
            }
            else { // we do flipping
                if (this.x > this.flipDestX) this.x = this.x - 1;
                else if (this.x < this.flipDestX) this.x = this.x + 1;
                else this.isFlipping = false;
            }
        },

        explode: function() {
            if ((frameNr%this.explodeAnimSpeed) == 0) {
                this.frame ++;
            }
            if (this.frame >= this.frames) {
                this.reset();
                if (this.explodeState == 1) { // ignite fire after hitting the ground
                    cosmicsGame.fireManager.igniteFire(this.x);
                    cosmicsGame.fireManager.igniteFire(this.x+(fireSize[0]));
                    cosmicsGame.fireManager.igniteFire(this.x+(2*fireSize[0]));
                    cosmicsGame.fireManager.igniteFire(this.x+(3*fireSize[0]));
                }
            }
            this.y = this.y + this.explodeSpeeds[this.explodeState];
        },

        first: function () { // gbox callback
            if (!paused) {
                if (this.isActive) {
                    if (this.explodes) this.explode();
                    else {
                        this.fly();
                        if (this.mayFlip) this.flip();
                    }
                }
            }
        },

        blit: function() { // gbox callback
	       if (this.isActive) gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.frame,dx:this.x,dy:this.y});
	    }
    })
}
//------------------------------------------------------------------------------------------------------------------------
function createInvaders(initialLeftDir) {
    invaderobjs = new Array();

    invadersPerRow = (parseInt(nrInvaders / nrInvaderRows));
    for (i=0, x=invaderGapSize[0], y = invaderSize[1]; i<nrInvaders; i++) {
        invaderobjs[i] = createInvader(i, i%2, x, y, initialLeftDir);
        x = x + invaderSize[0] + invaderGapSize[0];
        if (i % invadersPerRow == (invadersPerRow - 1)) {
            x = invaderGapSize[0];
            y = y + invaderSize[1] + invaderGapSize[1];
        }
    }

    // create bombs of invaders
    bombobjs = new Array();
    maxNrBombs = nrInvaders;
    for (i=0; i<maxNrBombs; i++) {
        bombobjs[i] = createBomb(i);
    }

    return invaderManager = {
        invaders: invaderobjs,
        bombs: bombobjs,
        lastBombTime : 0,
        bombFramePause: bombEach * fps,
        landedY: (gameSize[1] - floorPieceSize[1] -(invaderSize[1] * 1.5)),

        setInvadeSpeed: function () {  
            newspeed = 1;

            activeInvaders = this.getNrOfActiveInvaders();
            if (activeInvaders <= 0) return;

            for (i = (invaderSpeedupAt.length - 1); i >= 0; i--) {
                if (activeInvaders <= invaderSpeedupAt[i]) {
                    newspeed = (i + 2);
                    break;
                }
            }
            for (i=0; i<nrInvaders; i++) {
                this.invaders[i].speed = (this.invaders[i].speed / Math.abs(this.invaders[i].speed)) * newspeed;
            }
        },

        getNrOfActiveInvaders: function () {  // returns nr of active invaders
            for (i=0, activeInvaders = 0; i<nrInvaders; i++) {
                if (this.invaders[i].isActive) activeInvaders ++;
            }
            return activeInvaders;
        },

        invadersLanded: function () {  // returns true if one invader has landed
            for (i=0; i<nrInvaders; i++) {
                if ((this.invaders[i].isActive) && (!this.invaders[i].explodes) && (this.invaders[i].y > (this.landedY))) {
					console.log(this.invaders[i]+"has landed");
					return true;
				}	
            }
            return false;
        },

        turnInvadeDir: function(direction) {
            for (i=0; i<nrInvaders; i++) {
                this.invaders[i].y = this.invaders[i].y + invaderDownstepSize;
                this.invaders[i].speed = Math.abs(this.invaders[i].speed) * direction;
                this.invaders[i].x = this.invaders[i].x + this.invaders[i].speed; // first step for not being any longer in the new dir zone
            }
        },

        tryNextBomb: function() {
            if (frameNr > (this.lastBombTime + this.bombFramePause) ) {  // its about time for the next
                for (i=0; i<this.bombs.length; i++) {
                    b = this.bombs[i];
                    if (!b.isActive) {
                        inv = this.getRandomActiveInvader();
                        if (inv != null) b.startShoot(inv.x + (Math.floor(invaderSize[0] / 2)), inv.y + (Math.floor(invaderSize[1] / 2)) );
                        break;
                    }
                }
                this.lastBombTime = frameNr;
            }
        },

        // PRIVATE
        getRandomActiveInvader: function() {
            // starts from random place and traverses once all invaders, returns first active
            i = Math.floor(Math.random()*nrInvaders);
            sum = 0;

            while (true) {
                if (i >= nrInvaders) i = 0;  // wrap
                if ( (this.invaders[i].isActive) && !(this.invaders[i].explodes) ) {
                    return this.invaders[i];
                }
                i++;
                sum++;
                if (sum > nrInvaders) return null; // wrap only once
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------
function createInvader(nr, typeNr, initX ,initY, initialLeftDir) {
    return gbox.addObject ({
        group: 'invaders',
        id:    'invader'+nr,
        tileset:'invader'+typeNr+'Tiles',

        initialize: function() {  // gbox callback
            this.x = initX;
            this.y = initY;
            this.frame = 0;
            this.frames = invaderFrames;
            this.explodeFrames = invaderFrames;
            this.isActive = true;
            this.animSpeed = invaderAnimSpeed; // after this nr of frames the anim will flip
            this.explodeAnimSpeed = invaderExplodeAnimSpeed;
            if (initialLeftDir) this.speed = -1;
            else this.speed = 1;
            this.dropSpeed = 1;
            this.explodes = false;
        },

        initExplode: function() {   // PUBLIC
            gbox.hitAudio("invaderexplode");
            this.tileset = 'invader'+typeNr+'explodeTiles';
            this.frame = 0; // restart frame show
            this.explodeAnimSpeed = help.random(4, invaderExplodeAnimSpeed);// different deaths
            this.explodes = true;
        },

        // PRIVATES
        setNormalFrame: function () {
            if ( (frameNr%this.animSpeed) == 0 ) {
                this.frame++;
                if (this.frame >= this.frames) this.frame = 0;
            }
        },

        setExplodeFrame: function() {
            if ( (frameNr%this.explodeAnimSpeed) == 0 ) {
                this.frame++;
                if (this.frame >= this.frames) {
                    this.isActive = false;
                }
            }
        },

        setFrame: function() {
            if (this.explodes) this.setExplodeFrame();
            else this.setNormalFrame();
        },

        setPos: function() {
            if (this.explodes) this.y = this.y + this.dropSpeed;
            else this.x = this.x + this.speed;
        },

        first: function () { // gbox callback
            if (!paused) {
                if (this.isActive) {
                    this.setFrame();
                    this.setPos();
                }
            }
        },

        blit: function() { // gbox callback
	    if (this.isActive) gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.frame,dx:this.x,dy:this.y});
	}
    })
}
//------------------------------------------------------------------------------------------------------------------------
function createBomb(nr) {
    return gbox.addObject ({
        group: 'invaderbombs', id: 'invaderbomb'+nr, tileset:'bombTiles',
        initialize: function() { // gbox callback
            this.x = -bombSize[0];
            this.y = -bombSize[1];
            this.frame = 0;
            this.frames = bombFrames;
            this.isActive = false;
            this.explodes = false;
            this.animSpeed = bombAnimSpeed; // after this nr of frames the anim will flip
            this.explodeAnimSpeed = bombExplodeAnimSpeed; // after this nr of frames the anim will flip
            this.speed = bombSpeed;
            this.hadCriticalHeight = false;
        },

        startShoot: function(x, y) {  // PUBLIC
            this.frame = 0;
            this.x = x;
            this.y = y;
            this.tileset = 'bombTiles';
            this.explodes = false;
            this.isActive = true;
            this.hadCriticalHeight = false;
        },

        initExplode: function() {   // PUBLIC
            this.tileset = 'bombExplodeTiles';
            this.frame = 0; // restart frame show
            this.explodes = true;
        },

        // PRIVATES
        fly: function() {
            if ((frameNr%this.animSpeed) == 0) this.frame ++;
            if (this.frame >= this.frames) this.frame = 0;

            this.y = this.y + this.speed;
            if (this.y > gameSize[1] ) {
                cosmicsGame.fireManager.igniteFire(this.x + (this.w / 2));
                this.isActive = false;
            }    
        },

        explode: function() {
            if ((frameNr%this.explodeAnimSpeed) == 0) this.frame ++;
            if (this.frame >= this.frames) {
                this.isActive = false;
            }
        },

        first: function () { // gbox callback
            if (!paused) {
                if (this.isActive) {
                    if (this.explodes) this.explode();
                    else this.fly();
                }
            }
        },

        blit: function() { // gbox callback
            if (this.isActive) gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.frame,dx:this.x,dy:this.y});
	}
    })
}
//------------------------------------------------------------------------------------------------------------------------
function createRockets() {
    rocketobjs = new Array();
    for (i=0; i<maxNrRockets; i++) {
        rocketobjs[i] = createRocket(i);
    }

    return rocketManager = {
        rockets: rocketobjs,
        lastActivation : 0,
        pauseToNext: nextRocketPause,

        launchRocket: function() {
            if (frameNr > (this.lastActivation + (this.pauseToNext * gbox.getFps())) ) {  // its about time for the next
                for (i=0; i<maxNrRockets; i++) {
                    rocket = this.rockets[i];
                    if (!rocket.isActive) {
                        rocket.launch(Math.floor(Math.random() * 2));
                        this.lastActivation = frameNr;
                        break;
                    }
                }
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------
function createRocket(nr) {
    return gbox.addObject ({
        group: 'rockets', id: 'rocket'+nr, tileset:'rocketAirTiles',
        initialize: function() { // gbox callback
            this.type = null;
            this.x = 0;
            this.y = 0;
            this.frame = 0;
            this.frames = rocketFrames;
            this.isActive = false;
            this.explodes = false;
            this.animSpeed = rocketAnimSpeed; // after this nr of frames the anim will flip
            this.explodeAnimSpeed = rocketExplodeAnimSpeed; 
            this.airSpeed = rocketAirSpeed;
            this.groundSpeed = rocketGroundSpeed;
			this.onGround = false;
            this.groundTolerance = 6; // tolerance with which the rocker flies nearer to the ground;
            this.groundY = (gameSize[1] - floorPieceSize[1] - rocketSize[1]) + this.groundTolerance;
            this.hadCriticalHeight = false;
        },

        launch: function(type) {  // PUBLIC
            gbox.hitAudio("rocketlaunch");
            this.type = type;
			this.onGround = false;
            this.frame = 0;
            this.tileset = 'rocketAirTiles';
            this.explodes = false;
            this.isActive = true;
            this.hadCriticalHeight = false;
            switch (this.type) {
                case 0:
                default:
                    this.x = 0;
                    break;

                case 1:
                    this.x = battlegroundSize[0] - rocketSize[0];
                    break;
            }
            this.y = 0;
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
            if (!paused) {
                if (this.isActive) {
                    if (this.explodes) this.explode();
                    else this.fly();
                }
            }
        },

        blit: function() { // gbox callback
            if (this.isActive) gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.frame,dx:this.x,dy:this.y,flipv:1, fliph:this.type});
    	}
    })
}
//------------------------------------------------------------------------------------------------------------------------
function createSweepers(initialLeftDir) {
    sweeperobjs = new Array();
    for (i=0; i<maxNrSweepers; i++) {
        sweeperobjs[i] = createSweeper(i, sweeperSlots[usedSweeperSlots[i]].x ,sweeperSlots[usedSweeperSlots[i]].y, initialLeftDir);
    }

    return sweeperManager = {
        sweepers: sweeperobjs,
        maxLeft: 0,
        maxRight: battlegroundSize[0] - sweeperSize[0],
        lastSwarm : 0,
        pauseToNext: nextSweeperPause,

        // PRIVATE
        turnStalkDir: function(dir) {
            for (i=0; i < this.sweepers.length; i++) {
                this.sweepers[i].stalkDir = dir;
            }
        },

        // PUBLIC
        setStalkDirection: function() {
            for (i=0; i < this.sweepers.length; i++) {
                if (this.sweepers[i].startX < this.maxLeft) {
                    this.turnStalkDir(+1);
                    return;
                }
                if (this.sweepers[i].startX > this.maxRight) {
                    this.turnStalkDir(-1);
                    return;
                }
            }
        },

        getNrOfActiveSweepers: function () {  // returns nr of active sweepers
            for (i=0, activeSweepers = 0; i<maxNrSweepers; i++) {
                if (this.sweepers[i].isActive) activeSweepers++;
            }
            return activeSweepers;
        },


        launchSweepSwarm: function() {
            if (frameNr > (this.lastSwarm + (this.pauseToNext * gbox.getFps())) ) {  // its about time for the next

                i = Math.floor(Math.random()*maxNrSweepers);  // get a random one
                sum = 0;
                while (true) {
                    if (i >= maxNrSweepers) i = 0;  // wrap
                    if ( (this.sweepers[i].isActive) && (this.sweepers[i].state == 0) ) { // has to be active and in stalk state
                        this.sweepers[i].initSwarm();
                        this.lastSwarm = frameNr;
                        return;
                    }
                    i++;
                    sum++;
                    if (sum > nrInvaders) return; // wrap only once, all sweepers are swarming or otherwise inactive
                }
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------
function createSweeper(nr, startX, startY, initialLeftDir) {
    return gbox.addObject ({
        group: 'sweepers', id:'sweeper'+nr, tileset:'sweeperStalkTiles',
        initialize: function() { // gbox callback
            // 0 = stalking, 1 = swarming, 2 = firing, 3 = queueing
            // 4 = exploding,
            this.nr = nr;
            if (initialLeftDir) this.stalkDir = -1;
            else this.stalkDir = 1;
            this.state = 0;
            this.startX = startX;
            this.startY = startY;
            this.x = this.startX;
            this.y = startY;
            this.swarmTargetX = null;
            this.swarmTargetY = null;
            this.frame = 0;
            this.frames = sweeperFrames;
            this.isActive = true;
            this.tileset = new Array('sweeperStalkTiles', 'sweeperSwarmTiles', 'sweeperFireTiles', 'sweeperStalkTiles', 'sweeperExplodeTiles' );
            this.animSpeed = new Array(sweeperStalkAnimSpeed,sweeperSwarmAnimSpeed,sweeperFireAnimSpeed,sweeperStalkAnimSpeed,sweeperExplodeAnimSpeed); // per state
            this.stalkStateFrame = 0;
            this.stalkStateFrames = nextSweeperPause * gbox.getFps();
            this.fireStateFrame = 0;
            this.fireStateFrames = sweeperFireStateLength * gbox.getFps();
            this.fireEach = sweeperFireFrequency * gbox.getFps();
            this.ammos = new Array(ammoPerSweeper);
            this.ammoVariance = 64;
            for (i=0; i<ammoPerSweeper; i++) {
                this.ammos[i] = createAmmo(nr, i);
            }
        },

        initExplode: function() {   // PUBLIC
            this.state = 4;
            this.frame = 0; // restart frame show
        },

        initSwarm: function() {   // PUBLIC
            if ( (frameNr - this.stalkStateFrame) < this.stalkStateFrames) return;
			gbox.hitAudio("sweeperswarm");
            this.state = 1;
            this.frame = 0; // restart frame show
            this.swarmTargetX = Math.floor(Math.random() * (battlegroundSize[0] - sweeperSize[0]));
            this.swarmTargetY = (Math.floor(battlegroundSize[1] / 2)) + (Math.floor(Math.random() * (Math.floor(battlegroundSize[1] / 7))));
        },

        // PRIVATES
        animate: function() {
            if ((frameNr % this.animSpeed[this.state]) == 0) this.frame ++;
            if (this.frame >= this.frames) {
                this.frame = 0;
                if (this.state == 4) this.isActive = false;  // after exploding we are ready
            }
        },

        swarmToTarget: function() {
            inTargetX = false;
            inTargetY = false;
            if ((Math.abs(this.x - this.swarmTargetX)) > sweeperSpeed) {
                if (this.x < this.swarmTargetX) this.x = this.x + sweeperSpeed;
                else if (this.x > this.swarmTargetX) this.x = this.x - sweeperSpeed;
            }
            else inTargetX = true;
            if (Math.abs(this.y - this.swarmTargetY) > sweeperSpeed) {
                if (this.y < this.swarmTargetY) this.y = this.y + sweeperSpeed;
                else if (this.y > this.swarmTargetY) this.y = this.y - sweeperSpeed;
            }
            else inTargetY = true;
            if ( inTargetX && inTargetY) {
                this.state = 2;
                this.fireStateFrame = frameNr;
            }
        },

        manageFiring: function() {
            if ( (frameNr - this.fireStateFrame) > this.fireStateFrames) this.state = 3;
            else {
                if ((frameNr % this.fireEach) == 0) {
                    for (i=0; i < this.ammos.length; i++) {
                        if ( !(this.ammos[i].isActive) ) {
							if (i==0) gbox.hitAudio("sweeperfire"); // each new salve deserves a sound
                            var targetX = cosmicsGame.hero.x + (heroSize[0] / 2) - this.ammoVariance + (Math.floor(Math.random()* 2 * this.ammoVariance));
                            var targetY = cosmicsGame.hero.y + (heroSize[1] / 2);
                            this.ammos[i].initShoot(this.x + (sweeperSize[0] * 0.375), this.y + (sweeperSize[1] * 0.75), targetX, targetY);
                            break;
                        }
                    }
                }
            }
        },

        queueBack: function() {
            inTargetX = false;
            inTargetY = false;
            if ((Math.abs(this.x - this.startX)) > sweeperSpeed) {
                if (this.x < this.startX) this.x = this.x + sweeperSpeed;
                else if (this.x > this.startX) this.x = this.x - sweeperSpeed;
            }
            else inTargetX = true;
            if (Math.abs(this.y - this.startY) > sweeperSpeed) {
                if (this.y < this.startY) this.y = this.y + sweeperSpeed;
                else if (this.y > this.startY) this.y = this.y - sweeperSpeed;
            }
            else inTargetY = true;
            if ( inTargetX && inTargetY) {
                this.x = this.startX;
                this.y = this.startY;
                this.state = 0;
                this.stalkStateFrame = frameNr;
            }
        },

        move: function() {
            this.startX = this.startX + (this.stalkDir);  // move the start slot for queueing back
            switch (this.state) {

                case 0:  // stalk
                    this.x = this.x + (this.stalkDir);
                    break;

                case 1: // swarm
                    this.swarmToTarget();
                    break;

                case 2: // fire
                    this.manageFiring();
                    break;

                case 3: // queue back
                    this.queueBack();
                    break;

                case 4: // explode
                    this.y = this.y + 1;
                    break;
            }
        },

        first: function () { // gbox callback
            if (!paused) {
                if (this.isActive) {
                    this.animate();
                    this.move();
                }
            }
        },

        blit: function() { // gbox callback
            if (this.isActive) gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset[this.state],tile:this.frame,dx:this.x,dy:this.y});
	}
    })
}
//------------------------------------------------------------------------------------------------------------------------
function createAmmo(sweeperNr, nr) {
    return gbox.addObject ({
        group: 'sweepers', id: 'sweeper'+sweeperNr+'_ammo'+nr, tileset:'ammoTiles',
        initialize: function() { // gbox callback
            this.setShootDir(0, 0, 0, 0);
            this.state = 0; // 0 = alive and kicking, 1= explode
            this.frame = 0;
            this.frames = ammoFrames;
            this.isActive = false;
            this.tileset = new Array('ammoTiles', 'ammoExplodeTiles' );
            this.animSpeed = new Array(ammoAnimSpeed,ammoExplodeAnimSpeed); // one per state
            this.hadCriticalHeight = false;
        },

        initShoot: function(startX, startY, targetX, targetY) {  // PUBLIC
            this.setShootDir(startX, startY, targetX, targetY);
            this.state = 0;
            this.frame = 0;
            this.isActive = true;
            this.hadCriticalHeight = false;
        },

        initExplode: function() {   // PUBLIC
            this.state = 1;
            this.frame = 0; // restart frame show
        },

        // PRIVATES
        setShootDir: function(startX, startY, targetX, targetY) {
            this.x = startX;
            this.y = startY;
            var dirX = 1;
            if (targetX < startX) dirX = -1;
            var dirY = 1;
            var velX = Math.abs(targetX - startX);
            var velY = Math.abs(targetY - startY);

            if (velX > velY) {
                this.dirX = 1 * dirX;
                this.dirY = (velY/velX) * dirY;
            }
            else {// velY > velX
                this.dirY = 1 * dirY;
                this.dirX = (velX/velY) * dirX;
            }
        },

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
                    this.x = this.x + (this.dirX * sweeperAmmoSpeedMultiple);
                    this.y = this.y + (this.dirY * sweeperAmmoSpeedMultiple);
                    if (this.x > gameSize[0] || this.x < 0) this.isActive = false;
                    if (this.y > gameSize[1]) {
                        cosmicsGame.fireManager.igniteFire(this.x + (this.w / 2));
                        this.isActive = false;
                    }    
                    break;
                    
                case 1:  // explode
                    break;
            }
        },

        first: function () { // gbox callback
            if (!paused) {
                if (this.isActive) {
                    this.animate();
                    this.move();
                }
            }
        },

        blit: function() { // gbox callback
            if (this.isActive) gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset[this.state],tile:this.frame,dx:this.x,dy:this.y});
	   }
    })
}
