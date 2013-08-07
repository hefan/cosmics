cosmics
=======

COSMICS - A Browser Multiplayer Game

You are a hero and must save the world from cosmic alien invaders. There can be only one hero at a time. If there are more aspirants they have to queue up as spectators.
Each spectator can help with balloons to fight the invaders (or irritate the hero) and must try to stay alive. A dying spectator means to fall back to the taillight of the next hero queue.

### Client

The client consists of a Hero, a Spectator or a Solo Hero Game. If there is no Server available it will start the solo Client Game.

#### Requirements

- Akihabara: 

A Great html5-game framework for creating 2d canvas games.
https://github.com/kesiev/akihabara
Download Master, extract, then copy the akihabara folder in the cosmics main dir.

- require js

Copy require.js from https://github.com/jrburke/requirejs in the cosmics main dir

- fingerprint

Copy fingerprint.min.js from https://github.com/Valve/fingerprintjs in the cosmics main dir

#### Setup

##### Multiplayer Client Game

- Edit index.html
  - change `var gameServer= "yo-code.de";` to your server with path (http:// not required)
  - its also possible to run your client with the yo-code server.

##### Soloplayer Client Game

- No Additional Setup needed

#### Start Game

- Open up *index.html* or *solo.html* in your Browser (Preferably via web server)
- Play and score (no scores in solo player game)
- Get your Highscore as json from your highscore Server at Port 42424 or via apache proxy for example


### Server

The Server synchronizes Heros- and Spectator-Games. The Server also handles these roles for each client.
Without the server only the solo client game will start automatically.

#### Requirements

- node.js (v0.8.19 or above tested)
- npm (v 1.2.10 or above tested)
- Redis Server

- socket.io `npm install socket.io`
- Redis `npm install redis`

#### Setup

- Copy the contents of the server dir to your server
- start Redis Server
- enter `node cosmics_server.js` from within your dir with the server contents
- Server runs at port 54475

- enter `node highscores.js` from within your dir with the server contents
- Hiscore Server runs at port 42424 (its only used for fetching the highscores)


If here is no redis you will have no highscores, but the game should run.


### Game Instructions

You can play a complete Version of the game at
http://yo-code.de/cosmics


HERO: `left:left, right:right, up/s:jump, a:shoot`

SPECTATOR: `left:left, right:right, up/s:jump, a:launch balloon`

- Press a to start
