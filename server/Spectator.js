var Spectator = function(unique_id, startX, startPos, female) {
    var x = startX,
        id = unique_id,
        pos = startPos,
        female = female,
        dead = false,
        lastSign = new Date().getTime();
    
    var getX = function() {
        return x;
    };

    var setX = function(newX) {
        this.setSign();
        x = newX;
    };

    var getPos = function() {
        return pos;
    };

    var setPos = function(newPos) {
        this.setSign();
        pos = newPos;
    };

    var setDead = function(newDead) {
        this.setSign();
        dead = newDead;
    };

    var isDead = function() {
        return dead;
    };

    var isFemale = function() {
        return female;
    };

    var setSign = function() {
        lastSign = new Date().getTime();
    };

    var getLastSign = function() {
        return lastSign;
    };

    return {
        getX: getX,
        setX: setX,
        getPos: getPos,
        setPos: setPos,
        isFemale: isFemale,
        setDead: setDead,
        isDead: isDead,
        setSign: setSign,
        getLastSign: getLastSign,
        id: id
    }
};

exports.Spectator = Spectator;