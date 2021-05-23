cosmics
=======

COSMICS - A Browser Multiplayer Game
http://yo-code.de/cosmics

You are a hero and must save the world from cosmic alien invaders. There can be only one hero at a time. If there are more aspirants they have to queue up as spectators.
Each spectator can help with balloons to fight the invaders (or irritate the hero) and must try to stay alive. A dying spectator means to fall back to the taillight of the next hero queue.

----------------------------------
### Client

The client consists of a hero-, a spectator- or a solo hero game.
If there is no server available the solo client game will start.
The solo client game features only simulator-like graphics and no score.

#### Requirements

- Akihabara:

A Great html5-game framework for creating 2d canvas games.
https://github.com/kesiev/akihabara
Download master, extract, then copy the akihabara folder in the cosmics main dir.

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

- No additional setup needed

#### Start Game

- Open up *index.html* or *solo.html* in your browser (Preferably via web server)
- Play and score (no scores in solo player game)
- Get your highscore as json from your highscore server at Port 42424 or via apache proxy for example

----------------------------------
### Server

The server synchronizes Heros- and Spectator-Games. The server also handles these roles for each client.
Without the server the solo client game will start automatically.

#### Requirements

- node.js (v8.16.2 and 10.24.1 tested)
- npm (6.4.x tested)
- Redis Server

- socket.io v0.9 `npm install socket.io@0.9`
- Redis `npm install redis`

#### Setup

- Copy the contents of the server dir to your server
- start Redis Server
- enter `node cosmics_server.js` from within your dir with the server contents
- Server runs at port 54475

- enter `node highscores.js` from within your dir with the server contents
- Hiscore Server runs at port 42424 (its only used for fetching the highscores)


If here is no redis you will have no highscores, but the game should run.

----------------------------------
### Game Instructions

HERO: `left:left, right:right, up/s:jump, a:shoot`

SPECTATOR: `left:left, right:right, up/s:jump, a:launch balloon`

- Press a to start

You can play a complete version of the game at
http://yo-code.de/cosmics
