var gameId = "cosmics";
var cosmicsGame;
var frameNr = 0;
var fps = 50;
var groups = new Array('bgs', 'heros', 'floor', 'spectators', 'invaders', 'invaderbombs', 'sweepers', 'rockets', 'meteors', 'herobullets', 'fires','game');
var paused = false;
var suspended = false;
var muted = false;

var timeoutWarningMsg = "The planet is under attack! Press fire and start playing to prevent timeout.";
var timeoutMsg1 = "Timeout! Sorry, you are suspended as hero.";
var timeoutMsg2 = "Press reload to inline as spectator or try mission training.";

var dos = false;
var dosMsg = "You reloaded too often. Wait a little and try again to inline as spectator.";

var gameSize = new Array(640, 512);
var battlegroundSize = new Array(640, 480);
var fontSize = new Array(8,8);
var floorPieceSize = new Array (32, 64);
var nrFloorPieces = parseInt (gameSize[0] / floorPieceSize[0]);
var spectatorSize = new Array (9, 14);
var meteorSize = new Array (32,64);
var heroSize = new Array (32, 32);
var bulletSize = new Array (10, 20);
var invaderSize = new Array(32, 32);
var bombSize = new Array (10,20);
var rocketSize = new Array (32,32);
var sweeperSize = new Array (32,32);
var ammoSize = new Array(10,10);
var balloonSize = new Array (16,16);
var fireSize = new Array (8,4);
var nrFires = 80;

var heroId = "abc";
var heroLives = 3;
var heroScore = 0;

var enterHighscore = false;
var highscoreName = "             ";
var highscoreEnterPos = 0;
var highscoreRank = "unkown...";

var plsReload = false;

var clientContext;
var criticalHeight = gameSize[1] - floorPieceSize[1] - heroSize[1] - (heroSize[1] / 2);
//-----------------------------------------------------------------------------------
// animation data
var heroFrames = 4; // nr of frames for anim
var heroAnimSpeed = 10; // after this nr of frames the anim will move (game runs with 50 fps)
var heroGhostAnimSpeed = 5;
var heroExplodeAnimSpeed = 10;
var heroJumpAnimSpeed = 5;

var spectatorFrames = 4;
var spectatorAnimSpeed = 3;
var spectatorJumpAnimSpeed = 5;
var spectatorExplodeAnimSpeed = 20;

var balloonsPerSpectator = 20;
var balloonFrames = 4;
var balloonSpeed = 0.5;
var balloonInflateAnimSpeed = 15;
var balloonFlyAnimSpeed = 8;
var balloonExplodeAnimSpeed = 8;
var balloonMaxHeight = -balloonSize[1];

var fireFrames = 10;
var fireAnimSpeed = 10;
var burnFrames = 100;

var meteorFrames = 4;
var meteorAnimSpeed = 8; 
var meteorExplodeAnimSpeed = 10;

var invaderFrames = 4;
var invaderAnimSpeed = 10; 
var invaderExplodeAnimSpeed = 4;

//(bomb from invaders)
var bombFrames = 4;
var bombAnimSpeed = 5;// (normal and exploding)
var bombExplodeAnimSpeed = 5; 

//(the enemy rocket from left or right)
var rocketFrames = 4;
var rocketAnimSpeed = 8; 
var rocketExplodeAnimSpeed = 10; 

// sweeper
var sweeperFrames = 4;
var sweeperStalkAnimSpeed = 15;  // in air (and queing back)
var sweeperSwarmAnimSpeed = 6; // greifing an 
var sweeperFireAnimSpeed = 12; // firing
var sweeperExplodeAnimSpeed = 6; // exploding

// (the shoots from the sweeper)
var ammoFrames = 2;
var ammoAnimSpeed = 15;
var ammoExplodeAnimSpeed = 10;
// end animation data
//-----------------------------------------------------------------------------------
var modalFlashMinTime = 2;
var modalFlashMinFrames = modalFlashMinTime * fps;
var modalFlashStartFrame = null;
var breakMaxTime = 9;
var breakMaxFrames = breakMaxTime * fps;
var breakStartFrame = null;

var pointsBomb = 20;
var pointsAmmo = 20;
var pointsInvader = 60;
var pointsInvaderMultiplier = 1;
var pointsMeteor = 100;
var pointsSweeper = 130;
var pointsRocket = 250;

// these three could make up a planet gravity
var heroJumpHeight = 36;
var heroJumpSpeed = 3;
var heroFallFromJumpSpeed = 0.75;
//-----------------------------------------------------------------------------------
// variable level data
var nrBullets = 3;  // shooting frequency

var maxNrMeteors;
var meteorSpeed;
var nextMeteorPause ; // pause in seconds until next meteor, one of this values is taken randomly for each next meteor
var meteorsFlip;
var meteorNoFlipHeight; // from this height on the meteors do no more flip

var maxNrRockets;
var nextRocketPause; // in seconds
var rocketAirSpeed;
var rocketGroundSpeed;

var nrInvaders;
var nrInvaderRows;
var invaderGapSize;
var invaderDownstepSize;
var invaderSpeedupAt; // remaining invaders needed for speed up

var bombSpeed;
var bombEach;  // a next bomb will be thrown each given seconds

// there are 13 possible sweeperSlots (for each row)
var sweeperSlots = new Array({x:0, y:0}, {x: 1.5 * sweeperSize[0], y:0},
                             {x: 3 * sweeperSize[0], y:0}, {x: 4.5 * sweeperSize[0], y:0},
                             {x: 6 * sweeperSize[0], y:0}, {x: 7.5 * sweeperSize[0], y:0},
                             {x: 9 * sweeperSize[0], y:0}, {x: 10.5 * sweeperSize[0], y:0},
                             {x: 12 * sweeperSize[0], y:0}, {x: 13.5 * sweeperSize[0], y:0},
                             {x: 15 * sweeperSize[0], y:0}, {x: 16.5 * sweeperSize[0], y:0},
                             {x: 18 * sweeperSize[0], y:0});
var maxNrSweepers;  // nr sweeepers
// this array should have the size of max Nr Sweepers and couldn't be bigger than sweeperSlots, it determines the used slot for each sweeper
var usedSweeperSlots; 
var sweeperSpeed;
var nextSweeperPause;  // pause till next sweeper swarms out
var ammoPerSweeper;  // ammo per sweeper at one time on the screen
var sweeperFireFrequency; // secs between each ammo
var sweeperFireStateLength; // the length of the fire state of a sweeper in secs
var sweeperAmmoSpeedMultiple;

var curLevel = 1;  // dont use 0 here
var levelSlogans = [
    "", // not existent
    "welcome aboard", // 1
    "meteors approaching",
    "squids approaching", // 3
    "global attack",
    "sweepers approaching", // 5
    "global attack two",
    "super high fire frequency bonus", // 7
    "fear of sweepers", // 8
    "global attack three",
    "its springtime",  // 10
    "midnight shower",
    "global attack four", // 12
    "rainy day", 
    "omnisweepers",  // 14
    "super high fire frequency bonus 2" // 15
];
var floorPiecesArr = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
//------------------------------------------------------------------------------------------------------------------------
function getLevelSlogan(nr) {
    if (nr >= levelSlogans.length) {
        return "global attack "+(nr-11);
    }
    else {
        return levelSlogans[nr];
    }
}    
//------------------------------------------------------------------------------------------------------------------------
function initLevel(nr) {
    paused = false;
    modalFlashStartFrame = null;
    breakStartFrame = null;
    cosmicsGame.hud.redraw();
    
    switch (nr) {
        default: // generate more and more
            floorPiecesArr = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
            maxNrRockets = maxNrRockets + 1;
            nextRocketPause = nextRocketPause - 1;
            rocketAirSpeed = 2;
            rocketGroundSpeed = 3;

            maxNrMeteors = maxNrMeteors+1;
            meteorSpeed = 3;
            nextMeteorPause = new Array(2,6); // pause in seconds until next meteor, one of this values is taken randomly for each next meteor
            meteorsFlip = true;
            meteorNoFlipHeight = meteorSize[1] * 4; // from this height on the meteors do no more flip

            nrInvaders = 48;
            nrInvaderRows = 6;
            invaderGapSize = new Array(Math.floor(invaderSize[0] / 2), Math.floor(invaderSize[1] / 2));
            invaderDownstepSize = Math.floor(invaderSize[1] / 4);
            // remaining invaders needed for speed up
            invaderSpeedupAt = new Array(21, 11, 13, 9, 5, 4, 2);

            bombSpeed = 3;
            bombEach = bombEach / 2;  // a next bomb will be thrown each given seconds

            maxNrSweepers = 3;
            usedSweeperSlots = new Array(3,5,7);
            sweeperSpeed = 3;
            nextSweeperPause = nextSweeperPause - 1;
            ammoPerSweeper = ammoPerSweeper+1;
            sweeperFireFrequency = 0.2;
            sweeperFireStateLength = 7;
            sweeperAmmoSpeedMultiple = 3;
            break;

        case 16: // hard mixture generator start
            nrBullets = 3;

            floorPiecesArr = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
            maxNrRockets = 2;
            nextRocketPause = 8;
            rocketAirSpeed = 2;
            rocketGroundSpeed = 3;

            maxNrMeteors = 4;
            meteorSpeed = 3;
            nextMeteorPause = new Array(2,6); // pause in seconds until next meteor, one of this values is taken randomly for each next meteor
            meteorsFlip = true;
            meteorNoFlipHeight = meteorSize[1] * 4; // from this height on the meteors do no more flip

            nrInvaders = 48;
            nrInvaderRows = 6;
            invaderGapSize = new Array(Math.floor(invaderSize[0] / 2), Math.floor(invaderSize[1] / 2));
            invaderDownstepSize = Math.floor(invaderSize[1] / 4);
            // remaining invaders needed for speed up
            invaderSpeedupAt = new Array(21, 11, 13, 9, 5, 4, 2);

            bombSpeed = 3;
            bombEach = 0.5;  // a next bomb will be thrown each given seconds

            maxNrSweepers = 3;
            usedSweeperSlots = new Array(3,5,7);
            sweeperSpeed = 3;
            nextSweeperPause = 7;
            ammoPerSweeper = 3;
            sweeperFireFrequency = 0.2;
            sweeperFireStateLength = 7;
            sweeperAmmoSpeedMultiple = 3;
            break;

        case 15: // bonus fun 2
            nrBullets = 10;

            floorPiecesArr = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
            maxNrRockets = 0;
            nextRocketPause = 4;
            rocketAirSpeed = 2;
            rocketGroundSpeed = 3;

            maxNrMeteors = 0;
            meteorSpeed = 3;
            nextMeteorPause = new Array(3,6); // pause in seconds until next meteor, one of this values is taken randomly for each next meteor
            meteorsFlip = true;
            meteorNoFlipHeight = meteorSize[1] * 4; // from this height on the meteors do no more flip

            nrInvaders = 240;
            nrInvaderRows = 12;
            invaderGapSize = new Array(-4, -4);
            invaderDownstepSize = Math.floor(invaderSize[1] / 16);
            // remaining invaders needed for speed up
            invaderSpeedupAt = new Array(61,31,16,9,4,2);

            bombSpeed = 0;
            bombEach = 999999999999;  // a next bomb will be thrown each given seconds

            maxNrSweepers = 0;
            usedSweeperSlots = new Array(3,5);
            sweeperSpeed = 2;
            nextSweeperPause = 9999999999999999;
            ammoPerSweeper = 3;
            sweeperFireFrequency = 0.2;
            sweeperFireStateLength = 4;
            sweeperAmmoSpeedMultiple = 2;
            break;

        case 14:  // omnisweepers
            floorPiecesArr = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
            maxNrRockets = 1;
            nextRocketPause = 8;
            rocketAirSpeed = 2;
            rocketGroundSpeed = 3;

            maxNrMeteors = 2;
            meteorSpeed = 3;
            nextMeteorPause = new Array(2,5); // pause in seconds until next meteor, one of this values is taken randomly for each next meteor
            meteorsFlip = true;
            meteorNoFlipHeight = meteorSize[1] * 4; // from this height on the meteors do no more flip

            nrInvaders = 40;
            nrInvaderRows = 5;
            invaderGapSize = new Array(Math.floor(invaderSize[0] / 2), Math.floor(invaderSize[1] / 2));
            invaderDownstepSize = Math.floor(invaderSize[1] / 4);
            // remaining invaders needed for speed up
            invaderSpeedupAt = new Array(21, 11, 13, 9, 5, 4, 2);

            bombSpeed = 2;
            bombEach = 1;  // a next bomb will be thrown each given seconds

            maxNrSweepers = 4;
            usedSweeperSlots = new Array(1,3,5,7);
            sweeperSpeed = 4;
            nextSweeperPause = 3;
            ammoPerSweeper = 10;
            sweeperFireFrequency = 0.1;
            sweeperFireStateLength = 3;
            sweeperAmmoSpeedMultiple = 2;
            break;

        case 13: // heavy bomb alarm
            floorPiecesArr = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
            maxNrRockets = 1;
            nextRocketPause = 10;
            rocketAirSpeed = 2;
            rocketGroundSpeed = 3;

            maxNrMeteors = 2;
            meteorSpeed = 3;
            nextMeteorPause = new Array(2,5); // pause in seconds until next meteor, one of this values is taken randomly for each next meteor
            meteorsFlip = true;
            meteorNoFlipHeight = meteorSize[1] * 4; // from this height on the meteors do no more flip

            nrInvaders = 48;
            nrInvaderRows = 6;
            invaderGapSize = new Array(Math.floor(invaderSize[0] / 2), Math.floor(invaderSize[1] / 2));
            invaderDownstepSize = Math.floor(invaderSize[1] / 8);
            // remaining invaders needed for speed up
            invaderSpeedupAt = new Array(25, 14, 7, 4, 2);

            bombSpeed = 2;
            bombEach = 0.15;  // a next bomb will be thrown each given seconds

            maxNrSweepers = 2;
            usedSweeperSlots = new Array(3,5);
            sweeperSpeed = 3;
            nextSweeperPause = 10;
            ammoPerSweeper = 3;
            sweeperFireFrequency = 0.2;
            sweeperFireStateLength = 4;
            sweeperAmmoSpeedMultiple = 2;
            break

        case 12:  // mixture 4
            floorPiecesArr = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
            maxNrRockets = 2;
            nextRocketPause = 8;
            rocketAirSpeed = 2;
            rocketGroundSpeed = 3;

            maxNrMeteors = 4;
            meteorSpeed = 3;
            nextMeteorPause = new Array(2,4); // pause in seconds until next meteor, one of this values is taken randomly for each next meteor
            meteorsFlip = true;
            meteorNoFlipHeight = meteorSize[1] * 4; // from this height on the meteors do no more flip

            nrInvaders = 40;
            nrInvaderRows = 5;
            invaderGapSize = new Array(Math.floor(invaderSize[0] / 2), Math.floor(invaderSize[1] / 2));
            invaderDownstepSize = Math.floor(invaderSize[1] / 4);
            // remaining invaders needed for speed up
            invaderSpeedupAt = new Array(21, 11, 13, 9, 5, 4, 2);

            bombSpeed = 3;
            bombEach = 0.5;  // a next bomb will be thrown each given seconds

            maxNrSweepers = 3;
            usedSweeperSlots = new Array(3,5,7);
            sweeperSpeed = 3;
            nextSweeperPause = 7;
            ammoPerSweeper = 3;
            sweeperFireFrequency = 0.2;
            sweeperFireStateLength = 7;
            sweeperAmmoSpeedMultiple = 3;
            break;

        case 11: //midnight shower
            floorPiecesArr = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
            maxNrRockets = 1;
            nextRocketPause = 4;
            rocketAirSpeed = 2;
            rocketGroundSpeed = 3;

            maxNrMeteors = 7;
            meteorSpeed = 4;
            nextMeteorPause = new Array(0.5,0.8); // pause in seconds until next meteor, one of this values is taken randomly for each next meteor
            meteorsFlip = true;
            meteorNoFlipHeight = meteorSize[1] * 4; // from this height on the meteors do no more flip

            nrInvaders = 40;
            nrInvaderRows = 5;
            invaderGapSize = new Array(Math.floor(invaderSize[0] / 2), Math.floor(invaderSize[1] / 2));
            invaderDownstepSize = Math.floor(invaderSize[1] / 4);
            // remaining invaders needed for speed up
            invaderSpeedupAt = new Array(21, 11, 13, 9, 5, 4, 2);

            bombSpeed = 2;
            bombEach = 0.5;  // a next bomb will be thrown each given seconds

            maxNrSweepers = 2;
            usedSweeperSlots = new Array(3,5);
            sweeperSpeed = 2;
            nextSweeperPause = 7;
            ammoPerSweeper = 2;
            sweeperFireFrequency = 0.2;
            sweeperFireStateLength = 4;
            sweeperAmmoSpeedMultiple = 2.5;
            break;

        case 10: //jumpfest
            floorPiecesArr = [true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false];
            maxNrRockets = 5;
            nextRocketPause = 4;
            rocketAirSpeed = 2;
            rocketGroundSpeed = 3;

            maxNrMeteors = 0;
            meteorSpeed = 3;
            nextMeteorPause = new Array(3,6); // pause in seconds until next meteor, one of this values is taken randomly for each next meteor
            meteorsFlip = true;
            meteorNoFlipHeight = meteorSize[1] * 4; // from this height on the meteors do no more flip

            nrInvaders = 40;
            nrInvaderRows = 5;
            invaderGapSize = new Array(Math.floor(invaderSize[0] / 2), Math.floor(invaderSize[1] / 2));
            invaderDownstepSize = Math.floor(invaderSize[1] / 4);
            // remaining invaders needed for speed up
            invaderSpeedupAt = new Array(21, 11, 13, 9, 5, 4, 2);

            bombSpeed = 3;
            bombEach = 1;  // a next bomb will be thrown each given seconds

            maxNrSweepers = 0;
            usedSweeperSlots = new Array(3,5);
            sweeperSpeed = 3;
            nextSweeperPause = 99999999999999999999;
            ammoPerSweeper = 4;
            sweeperFireFrequency = 0.2;
            sweeperFireStateLength = 4;
            sweeperAmmoSpeedMultiple = 2;
            break;

        case 9:  // mixture 3
            floorPiecesArr = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
            maxNrRockets = 2;
            nextRocketPause = 10;
            rocketAirSpeed = 2;
            rocketGroundSpeed = 3;

            maxNrMeteors = 3;
            meteorSpeed = 3;
            nextMeteorPause = new Array(2,5); // pause in seconds until next meteor, one of this values is taken randomly for each next meteor
            meteorsFlip = true;
            meteorNoFlipHeight = meteorSize[1] * 4; // from this height on the meteors do no more flip

            nrInvaders = 40;
            nrInvaderRows = 5;
            invaderGapSize = new Array(Math.floor(invaderSize[0] / 2), Math.floor(invaderSize[1] / 2));
            invaderDownstepSize = Math.floor(invaderSize[1] / 4);
            // remaining invaders needed for speed up
            invaderSpeedupAt = new Array(21, 11, 13, 9, 5, 4, 2);

            bombSpeed = 3;
            bombEach = 0.5;  // a next bomb will be thrown each given seconds

            maxNrSweepers = 2;
            usedSweeperSlots = new Array(3,5);
            sweeperSpeed = 3;
            nextSweeperPause = 7;
            ammoPerSweeper = 4;
            sweeperFireFrequency = 0.2;
            sweeperFireStateLength = 4;
            sweeperAmmoSpeedMultiple = 2;
            break;

        case 8:  // fear of sweepers
            nrBullets = 3;

            floorPiecesArr = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
            maxNrRockets = 1;
            nextRocketPause = 4;
            rocketAirSpeed = 2;
            rocketGroundSpeed = 3;

            maxNrMeteors = 3;
            meteorSpeed = 3;
            nextMeteorPause = new Array(2,5); // pause in seconds until next meteor, one of this values is taken randomly for each next meteor
            meteorsFlip = true;
            meteorNoFlipHeight = meteorSize[1] * 4; // from this height on the meteors do no more flip

            nrInvaders = 14;
            nrInvaderRows = 1;
            invaderGapSize = new Array(Math.floor(invaderSize[0] / 8), Math.floor(invaderSize[1] / 8));
            invaderDownstepSize = Math.floor(invaderSize[1] / 4);
            // remaining invaders needed for speed up
            invaderSpeedupAt = new Array(2);

            bombSpeed = 2;
            bombEach = 1;  // a next bomb will be thrown each given seconds

            maxNrSweepers = 13;
            usedSweeperSlots = new Array(0,1,2,3,4,5,6,7,8,9,10,11,12);
            sweeperSpeed = 2;
            nextSweeperPause = 3;
            ammoPerSweeper = 4;
            sweeperFireFrequency = 0.2;
            sweeperFireStateLength = 4;
            sweeperAmmoSpeedMultiple = 2;
            break;

        case 7:  // bonus
            nrBullets = 10;

            floorPiecesArr = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
            maxNrRockets = 0;
            nextRocketPause = 4;
            rocketAirSpeed = 2;
            rocketGroundSpeed = 3;

            maxNrMeteors = 0;
            meteorSpeed = 3;
            nextMeteorPause = new Array(3,6); // pause in seconds until next meteor, one of this values is taken randomly for each next meteor
            meteorsFlip = true;
            meteorNoFlipHeight = meteorSize[1] * 4; // from this height on the meteors do no more flip

            nrInvaders = 120;
            nrInvaderRows = 8;
            invaderGapSize = new Array(Math.floor(invaderSize[0] / 8), Math.floor(invaderSize[1] / 8));
            invaderDownstepSize = Math.floor(invaderSize[1] / 4);
            // remaining invaders needed for speed up
            invaderSpeedupAt = new Array(61,31,16,9,4,2);

            bombSpeed = 0;
            bombEach = 999999999999;  // a next bomb will be thrown each given seconds

            maxNrSweepers = 0;
            usedSweeperSlots = new Array(3,5);
            sweeperSpeed = 2;
            nextSweeperPause = 9999999999999999;
            ammoPerSweeper = 2;
            sweeperFireFrequency = 0.2;
            sweeperFireStateLength = 4;
            sweeperAmmoSpeedMultiple = 2;
            break;

        case 6:  // mixture two
            floorPiecesArr = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
            maxNrRockets = 1;
            nextRocketPause = 4;
            rocketAirSpeed = 2;
            rocketGroundSpeed = 3;

            maxNrMeteors = 2;
            meteorSpeed = 3;
            nextMeteorPause = new Array(2,5); // pause in seconds until next meteor, one of this values is taken randomly for each next meteor
            meteorsFlip = true;
            meteorNoFlipHeight = meteorSize[1] * 4; // from this height on the meteors do no more flip

            nrInvaders = 32;
            nrInvaderRows = 4;
            invaderGapSize = new Array(Math.floor(invaderSize[0] / 2), Math.floor(invaderSize[1] / 2));
            invaderDownstepSize = Math.floor(invaderSize[1] / 4);
            // remaining invaders needed for speed up
            invaderSpeedupAt = new Array(17, 13, 9, 5, 4, 2);

            bombSpeed = 2;
            bombEach = 0.5;  // a next bomb will be thrown each given seconds

            maxNrSweepers = 2;
            usedSweeperSlots = new Array(3,5);
            sweeperSpeed = 2;
            nextSweeperPause = 7;
            ammoPerSweeper = 3;
            sweeperFireFrequency = 0.2;
            sweeperFireStateLength = 4;
            sweeperAmmoSpeedMultiple = 2;
            break;

        case 5:  // sweeper first
            floorPiecesArr = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
            maxNrRockets = 0;
            nextRocketPause = 20;
            rocketAirSpeed = 2;
            rocketGroundSpeed = 3;

            maxNrMeteors = 2;
            meteorSpeed = 3;
            nextMeteorPause = new Array(2,5); // pause in seconds until next meteor, one of this values is taken randomly for each next meteor
            meteorsFlip = true;
            meteorNoFlipHeight = meteorSize[1] * 4; // from this height on the meteors do no more flip

            nrInvaders = 24;
            nrInvaderRows = 3;
            invaderGapSize = new Array(Math.floor(invaderSize[0] / 2), Math.floor(invaderSize[1] / 2));
            invaderDownstepSize = Math.floor(invaderSize[1] / 4);
            // remaining invaders needed for speed up
            invaderSpeedupAt = new Array(19, 13, 9, 5, 4, 2);

            bombSpeed = 2;
            bombEach = 1;  // a next bomb will be thrown each given seconds

            maxNrSweepers = 4;
            usedSweeperSlots = new Array(1,3,5,7);
            sweeperSpeed = 3;
            nextSweeperPause = 4;
            ammoPerSweeper = 2;
            sweeperFireFrequency = 0.2;
            sweeperFireStateLength = 4;
            sweeperAmmoSpeedMultiple = 2;
            break;

        case 4:  // mixture one
            floorPiecesArr = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
            maxNrRockets = 1;
            nextRocketPause = 4;
            rocketAirSpeed = 2;
            rocketGroundSpeed = 3;

            maxNrMeteors = 2;
            meteorSpeed = 3;
            nextMeteorPause = new Array(2,5); // pause in seconds until next meteor, one of this values is taken randomly for each next meteor
            meteorsFlip = true;
            meteorNoFlipHeight = meteorSize[1] * 4; // from this height on the meteors do no more flip

            nrInvaders = 24;
            nrInvaderRows = 3;
            invaderGapSize = new Array(Math.floor(invaderSize[0] / 2), Math.floor(invaderSize[1] / 2));
            invaderDownstepSize = Math.floor(invaderSize[1] / 4);
            // remaining invaders needed for speed up
            invaderSpeedupAt = new Array(19, 13, 9, 5, 4, 2);

            bombSpeed = 2;
            bombEach = 1;  // a next bomb will be thrown each given seconds

            maxNrSweepers = 0;
            usedSweeperSlots = new Array(3,5);
            sweeperSpeed = 2;
            nextSweeperPause = 999999999999;
            ammoPerSweeper = 4;
            sweeperFireFrequency = 0.2;
            sweeperFireStateLength = 7;
            sweeperAmmoSpeedMultiple = 2;
            break;

        case 3:  // intr rockets
            floorPiecesArr = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
            maxNrRockets = 2;
            nextRocketPause = 2;
            rocketAirSpeed = 2;
            rocketGroundSpeed = 2;

            maxNrMeteors = 0;
            meteorSpeed = 3;
            nextMeteorPause = new Array (3,6); // pause in seconds until next meteor, one of this values is taken randomly for each next meteor
            meteorsFlip = true;
            meteorNoFlipHeight = meteorSize[1] * 4; // from this height on the meteors do no more flip

            nrInvaders = 18;
            nrInvaderRows = 2;
            invaderGapSize = new Array(Math.floor(invaderSize[0]), Math.floor(invaderSize[1]) / 4);
            invaderDownstepSize = Math.floor(invaderSize[1] / 4);
            // remaining invaders needed for speed up
            invaderSpeedupAt = new Array(9, 4, 2);

            bombSpeed = 2;
            bombEach = 1;  // a next bomb will be thrown each given seconds

            maxNrSweepers = 0;
            usedSweeperSlots = new Array(3,5);
            sweeperSpeed = 2;
            nextSweeperPause = 999999999999;
            ammoPerSweeper = 4;
            sweeperFireFrequency = 0.2;
            sweeperFireStateLength = 7;
            sweeperAmmoSpeedMultiple = 2;
            break;

        case 2: // intr meteors
            floorPiecesArr = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
            maxNrRockets = 0;
            nextRocketPause = 20;
            rocketAirSpeed = 2;
            rocketGroundSpeed = 3;

            maxNrMeteors = 2;
            meteorSpeed = 3;
            nextMeteorPause = new Array(1,2); // pause in seconds until next meteor, one of this values is taken randomly for each next meteor
            meteorsFlip = false;
            meteorNoFlipHeight = meteorSize[1] * 4; // from this height on the meteors do no more flip

            nrInvaders = 18;
            nrInvaderRows = 2;
            invaderGapSize = new Array(Math.floor(invaderSize[0]), Math.floor(invaderSize[1]) / 4);
            invaderDownstepSize = Math.floor(invaderSize[1] / 4);
            // remaining invaders needed for speed up
            invaderSpeedupAt = new Array(9, 4, 2);

            bombSpeed = 2;
            bombEach = 1;  // a next bomb will be thrown each given seconds

            maxNrSweepers = 0;
            usedSweeperSlots = new Array(3,5);
            sweeperSpeed = 2;
            nextSweeperPause = 999999999999;
            ammoPerSweeper = 4;
            sweeperFireFrequency = 0.2;
            sweeperFireStateLength = 7;
            sweeperAmmoSpeedMultiple = 2;
            break;

        case 1: 
            nrBullets = 3;

            floorPiecesArr = [true,true,true,true,true,false,true,true,true,true,true,true,true,true,false,true,true,true,true,true];
            maxNrRockets = 0;
            nextRocketPause = 20;
            rocketAirSpeed = 2;
            rocketGroundSpeed = 3;

            maxNrMeteors = 0;
            meteorSpeed = 3;
            nextMeteorPause = new Array (3,6); // pause in seconds until next meteor, one of this values is taken randomly for each next meteor
            meteorsFlip = false;
            meteorNoFlipHeight = meteorSize[1] * 4; // from this height on the meteors do no more flip

            nrInvaders = 18;
            nrInvaderRows = 2;
            invaderGapSize = new Array(Math.floor(invaderSize[0]), Math.floor(invaderSize[1]) / 4);
            invaderDownstepSize = Math.floor(invaderSize[1] / 4);
            // remaining invaders needed for speed up
            invaderSpeedupAt = new Array(9, 4, 2);

            bombSpeed = 2;
            bombEach = 1;  // a next bomb will be thrown each given seconds

            maxNrSweepers = 0;
            usedSweeperSlots = new Array(3,5);
            sweeperSpeed = 2;
            nextSweeperPause = 999999999999;
            ammoPerSweeper = 4;
            sweeperFireFrequency = 0.2;
            sweeperFireStateLength = 7;
            sweeperAmmoSpeedMultiple = 2;
            break;

    }
    cosmicsGame.hud.setValue('level', 'value', curLevel+": "+getLevelSlogan(curLevel));
}
