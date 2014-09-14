define(['lodash', 'jquery', 'jquery-ui', '../class', '../cardxy'],
  function(_, $, ui, Class, CardXy) {

    // Display cards left-to-right.
    var FlowLayout = Class.extend({
        // Where would each card go in this region?
        calculate: function(region, cardEls) {
            // Assumes all cards have the same dimensions.
            var c = _.first(cardEls),
                regionWidth = region.$el.width(),
                regionHeight = region.$el.height(),
                cardWidth = c.width(),
                cardHeight = c.height();
                
            var scale = 1,
                scaleDenom = 0;
            while (!willFit(regionWidth,
                            regionHeight,
                            cardWidth * scale,
                            cardHeight * scale,
                            cardEls.length)) {
                scale = 1 - ++scaleDenom * 0.01;
            }

            var cols = maxCols(regionWidth, cardWidth * scale),
                getPointAt = indexToPoint(cols, cardWidth * scale, cardHeight * scale);

            return _.map(cardEls, function(cardEl, i) {
                var point = getPointAt(i);
                return new CardXy({
                    x: point.x,
                    y: point.y,
                    scale: scale
                });
            });
        }
    });

    // Will `n` amount of cards fit inside region?
    function willFit(regionWidth, regionHeight, cardWidth, cardHeight, n) {
        var cols = maxCols(regionWidth, cardWidth),
            getPointAt = indexToPoint(cols, cardWidth, cardHeight),
            point = getPointAt(n - 1);
        return point.x + cardWidth < regionWidth &&
               point.y + cardHeight < regionHeight;
    }

    // How many cards fit horizontally? Should always be at least 1, right?
    // TODO: Throw layout exception when cards won't fit.
    function maxCols(regionWidth, cardWidth) {
        return Math.max(1, Math.floor(regionWidth / cardWidth));
    }

    // Return X & Y for given index.
    function indexToPoint(numCols, colWidth, colHeight) {
        return function(i) {
            return {
                x: (i % numCols) * colWidth,
                y: Math.floor(i / numCols) * colHeight
            };
        };
    }

    return FlowLayout;
});