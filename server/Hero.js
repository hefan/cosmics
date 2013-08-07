var Hero = function(startX, startY) {
    var x = startX,
        y = startY,
        lastSign = new Date().getTime(),
        id;
   
    var getX = function() {
        return x;
    };

    var getY = function() {
        return y;
    };

    var setX = function(newX) {
        x = newX;
        this.setSign();
    };

    var setY = function(newY) {
        y = newY;
        this.setSign();
    };

    var jump = function() {  // no need to store jump state on server, only set sign
        this.setSign();
    };

    var shoot = function() {  // no need to store shoot state on server, only set sign
        this.setSign();
    };

    var explode = function() {  // no need to store explode state on server, only set sign
        this.setSign();
    };

    var ghost = function() {  // no need to store ghost state on server, only set sign
        this.setSign();
    };

    var normal = function() {  // no need to store normal state on server, only set sign
        this.setSign();
    };

    var fall = function() {  // no need to store fall state on server, only set sign
        this.setSign();
    };

    var setSign = function() {
        lastSign = new Date().getTime();
    };

    var getLastSign = function() {
        return lastSign;
    };

    return {
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        jump: jump,
        shoot: shoot,
        explode: explode,
        ghost: ghost,
        normal: normal,
        fall: fall,
        setSign: setSign,
        getLastSign: getLastSign,
        id: id
    }
};

exports.Hero = Hero;