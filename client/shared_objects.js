function createSpectator(startX, group, id, isDead, female, useViewport) {
    return gbox.addObject ({
        group: group, id: id, tileset:'spectatorFemaleTiles',

        initialize: function() {
            this.female = female;
            if (this.female) this.tileset = "spectatorFemaleTiles";
            else this.tileset = "spectatorMaleTiles";
            this.useViewport = useViewport;
            this.x = startX;
            this.groundY = gameSize[1] - spectatorSize[1];
            this.y = this.groundY;
            this.frame = 0;
            this.frames = spectatorFrames;
            this.animSpeed = spectatorAnimSpeed;
            this.jumpAnimSpeed = spectatorJumpAnimSpeed;
            this.explodeAnimSpeed = spectatorExplodeAnimSpeed;
            this.jumpMaxHeight = this.groundY - 11;
            this.jumpUp = true;
            this.jumpSpeed = 1;
            this.hopeLength = 50;
            this.hopeCount = 0;
            this.state = 0;  // 0 = walk, 1=hope, 2= jump, 3 = explode, 4 = dead
            this.heading = 0; //0 = left, 1= right
            if (isDead) this.initDead();
            this.balloons = new Array();
            for (i=0; i<balloonsPerSpectator; i++) {
                this.balloons[i] = createBalloon(this, i, this.useViewport);
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

        setX: function(newX, heading) {
            this.heading = heading;
            this.x = newX;
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
                this.tileset = "spectatorFemaleExplodeTiles";
                gbox.hitAudio("scream_female");
            }
            else {
                this.tileset = "spectatorMaleExplodeTiles";
                gbox.hitAudio("scream_male");
            }    
            this.frame = 0; // restart frame show
            this.state = 3;
            this.y = this.groundY;
        },

        initDead: function() {   // PUBLIC
            if (this.female) this.tileset = "spectatorFemaleExplodeTiles";
            else this.tileset = "spectatorMaleExplodeTiles";
            this.frame = this.frames - 1; // last pic of explode
            this.state = 4;
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

        blit: function() { 
           if (this.useViewport) gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.frame,dx:this.x-viewportX,dy:this.y,fliph:this.heading});
           else gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.frame,dx:this.x,dy:this.y,fliph:this.heading});
        }
    })
}
//------------------------------------------------------------------------------------------------------------------------
function createBalloon(motherObject, nr, useViewport) {
    return gbox.addObject ({
        group: motherObject.group, id: "balloon_"+motherObject.id+"_"+nr, tileset:"balloonInflateTiles",

        initialize: function() { // gbox callback
            this.motherObject = motherObject;
            this.useViewport = useViewport;
            this.offset = [0, -( balloonSize[1] - (spectatorSize[1] / 3) )];
            this.setInflatePosition();
            this.frame = 0;
            this.frames = balloonFrames;
            this.isActive = false;
            this.state = 0; // 0 = inflate, 1 = fly, 2 = explode
            this.tileset = new Array('balloonInflateTiles', 'balloonFlyTiles', 'balloonExplodeTiles' );
            this.animSpeed = new Array(balloonInflateAnimSpeed,balloonFlyAnimSpeed,balloonExplodeAnimSpeed);
        },

        inflate: function() {
            gbox.hitAudio("inflate");
            this.setInflatePosition();
            this.frame = 0;
            this.state = 0;
            this.isActive = true;
        },

        initExplode: function() {
            gbox.hitAudio("deflate");
            this.frame = 0;
            this.state = 2;
        },

        // PRIVATES
        setInflatePosition: function() {
            if (this.motherObject.heading == 0) { // mother object looks to the left
                this.x = this.motherObject.x - spectatorSize[0] + this.offset[0] + 3;
            }    
            else { // mother object looks to the right
                this.x = this.motherObject.x + this.offset[0];
            }    
            this.y = this.motherObject.y + this.offset[1];
        },

        move: function() {
            switch (this.state) {
                case 0:  // inflate
                    this.setInflatePosition();
                    break;
                case 1:  // fly
                    this.y -= balloonSpeed;
                    if (this.y <= balloonMaxHeight) {
                        this.isActive = false;
                    }
                    break;
                case 2:  // explode
                    this.y += balloonSpeed;
                    break;
            }

        },

        animate: function() {
            if ((frameNr % this.animSpeed[this.state]) == 0) {
                this.frame++;
                if (this.frame >= this.frames) {
                    this.frame = 0;

                    switch (this.state) {   // change states after animation
                        case 0:  // inflate
                            this.state = 1;
                            if ( (!this.useViewport) && (gameId != "cosmics") ) { // for balloon from own spectator: we have to use absolute position since flying
                                this.x = this.motherObject.absX;  
                            }    
                            break;
                        case 1:  // fly
                            break;
                        case 2:  // explode
                            this.state = 0;
                            this.isActive = false;
                            break;    
                    }
                }    
            }    
        },

        first: function () { // gbox callback
            if (this.isActive) {
                this.move();
                this.animate();
            }    
        },

        blit: function() { // gbox callback
            if (this.isActive) {
                if (this.useViewport) {  // always use viewport
                    gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset[this.state],tile:this.frame,dx:this.x-viewportX,dy:this.y});
                }    
                else {  // for balloon from own spectator: use viewport after balloon is released
                    if ( (this.state >= 1) && (gameId != "cosmics") ) { 
                        gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset[this.state],tile:this.frame,dx:this.x-viewportX,dy:this.y});
                    }    
                    else gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset[this.state],tile:this.frame,dx:this.x,dy:this.y});
                }
            }    
        }
    })
}
//------------------------------------------------------------------------------------------------------------------------
function createFires(useViewport) {
    var firePieces = new Array();

    for (i=0; i<nrFires; i++) {
        firePieces[i] = createFire(i, useViewport);
    }

    return fireManager = {
        fires: firePieces,

        igniteFire: function(posX) {
            findex = Math.floor(posX / fireSize[0]);
            if(typeof this.fires[findex] === "undefined") { // edge cases

            }
            else {
                this.fires[findex].setActive();
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------
function createFire(nr, useViewport) {
    return gbox.addObject ({
        group: "fires", id: "fire"+nr, tileset:"fireTiles",

        initialize: function() { 
            this.useViewport = useViewport;
            this.x = 0 + (nr * fireSize[0]);
            this.y = gbox.getScreenH() - (fireSize[1]);
            this.frame = 0;
            this.frames = fireFrames;
            this.nr = nr;
            this.isActive = false;
            this.animSpeed = fireAnimSpeed;
            this.burnFrames = burnFrames;
            this.burnFrame = 0;
        },

        setActive: function() {
//            gbox.hitAudio("fire");
            this.isActive = true;
            this.frame = 0;
            this.burnFrame = 0;
        },

        // PRIVATES
        burn: function() {
            this.burnFrame++;
            if (this.burnFrame >= this.burnFrames) {
                this.isActive = false;
            }
        },    

        animate: function() {
            if ((frameNr % this.animSpeed) == 0) {
                this.frame++;
                if (this.frame >= this.frames) {
                    this.frame = 0;
                }
            }
        },

        first: function () { // gbox callback
            if (this.isActive) {
                this.burn();
                this.animate();
            }    
        },

        blit: function() { // gbox callback
            if (this.isActive) {
                if (this.useViewport) { 
                    gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.frame,dx:this.x-viewportX,dy:this.y});
                }    
                else {  // for balloon from own spectator: use viewport after balloon is released
                    gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.frame,dx:this.x,dy:this.y});
                }
            }    
        }
    })
}
