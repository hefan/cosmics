var http = require('http'),
    redis = require("redis"),
//    redisClient = redis.createClient();
    redisClient = redis.createClient('/home/shartman/.redis/sock');

http.createServer(function (req, res) {

    var scoreList = [];

    if (req.url != "/") { // "/favicon.ico" and other errornous requests will be ignored
        res.writeHead(404);
        res.end('\n');
    }
		else { // proper "/" request
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
