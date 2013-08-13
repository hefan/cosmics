if(!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g,'');
  };
}

var http = require('http'),
    redis = require("redis"),
//    redisClient = redis.createClient();
    redisClient = redis.createClient('/home/shartman/.redis/sock');

http.createServer(function (req, res) {

    var scoreList = [];

    if  (req.url == "/anon") { // anon version
        var player = "";
        var points = "";
        xy = redisClient.zrevrange("anonscores", "0", "-1", "WITHSCORES", function (err, replies) {
            var scoreEntry = {};
            replies.forEach(function (reply, i) {
                if ( (i%2) == 0) {  // the name in the even
                        // first split is given name, second is session id, we need given name, split symbol is "_"
                    scoreEntry.player = reply.split("_")[0];
                }
                else { // the score in the odd
                    scoreEntry.points = reply;
                    scoreList.push({player: scoreEntry.player, points: scoreEntry.points});  // push $
                }
            });
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(JSON.stringify(scoreList));
            res.end('\n');
        });
    }
//--------------------------------------------------------------------------------------------------------------------------    
    else if  (req.url == "/cumul") { // cumulated version
        var player = "";
        var points = "";
        xy = redisClient.zrevrange("scores", "0", "-1", "WITHSCORES", function (err, replies) {
            replies.forEach(function (reply, i) {
                if ( (i%2) == 0) {  // the name in the even
                    // first split is given name, second is session id, we need given name, split symbol is "_"
                    player = reply.split("_")[0];
                }
                else { // the score in the odd
                    points = reply;
                    scoreList = addOrCumulPlayer(scoreList, player, points);
                }
            });
            res.writeHead(200, {'Content-Type': 'text/plain'});
            scoreList.sort(function(a,b) { return b.points - a.points } );
            res.write(JSON.stringify(scoreList));
            res.end('\n');
        });
    }
//--------------------------------------------------------------------------------------------------------------------------    
    else if (req.url != "/") { // "/favicon.ico" and other errornous requests will be ignored
        res.writeHead(404);
        res.end('\n');
    }
	else { // proper "/" request, normal not cumulated version
        xy = redisClient.zrevrange("scores", "0", "-1", "WITHSCORES", function (err, replies) {
            var scoreEntry = {};
            replies.forEach(function (reply, i) {
                if ( (i%2) == 0) {  // the name in the even
                		// first split is given name, second is session id, we need given name, split symbol is "_"
                    scoreEntry.player = reply.split("_")[0];
                }
                else { // the score in the odd
                    scoreEntry.points = reply;
                    scoreList.push({player: scoreEntry.player, points: scoreEntry.points});  // push $
                }
            });
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(JSON.stringify(scoreList));
            res.end('\n');
        });
    }
}).listen(42424, "127.0.0.1");
console.log('Server running at http://127.0.0.1:42424/');
//--------------------------------------------------------------------------------------------------------------------------
function addOrCumulPlayer(scoreList, player, points) {
    player = player.trim();
    for(var i = 0; i < scoreList.length; i++) {
        if (scoreList[i].player == player) {
            scoreList[i].points += parseInt(points);
            return scoreList;
        }
    }
    // nothing found, new player
    scoreList.push({player: player, points: parseInt(points)}); 
    return scoreList;
}
