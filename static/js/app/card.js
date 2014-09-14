define(['./util'], function(util) {
    function Card(id, text, topLeft, topRight) {
        return {
            id: util.getter(id),
            text: util.getter(text || ''),
            topLeft: util.getter(topLeft || ''),
            topRight: util.getter(topRight || '')
        };
    }
    return Card;
});