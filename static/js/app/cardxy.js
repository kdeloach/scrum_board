define(['./class'], function(Class) {
    var CardXY = Class.extend({
        defaults: {
            x: 0,
            y: 0,
            scale: 1
        }
    });
    return CardXY;
});