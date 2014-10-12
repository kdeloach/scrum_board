define(['lodash', 'jquery', 'jquery-ui', '../class', '../cardxy'],
  function(_, $, ui, Class, CardXy) {

    // Display cards left-to-right.
    var FlowLayout = Class.extend({
        // Where would each card go in this region?
        calculate: function(region, cardEls) {
            // Assumes all cards have the same dimensions.
            var firstCard = _.first(cardEls),
                regionWidth = region.$el.width(),
                regionHeight = region.$el.height(),
                cardWidth = firstCard.width(),
                cardHeight = firstCard.height();

            var scale = scaleDenomStrategy({
                regionWidth: regionWidth,
                regionHeight: regionHeight,
                cardWidth: cardWidth,
                cardHeight: cardHeight,
                numCards: cardEls.length
            });

            var cols = maxCols(regionWidth, cardWidth * scale),
                getPointAt = indexToPoint(
                    cols,
                    cardWidth * scale,
                    cardHeight * scale
                );

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

    // Reduce scale by 1% until all cards fit inside region.
    // This works reasonably well.
    function scaleDenomStrategy(params) {
        var scale = 1,
            scaleDenom = 0;
        while (!willFit(params.regionWidth,
                        params.regionHeight,
                        params.cardWidth * scale,
                        params.cardHeight * scale,
                        params.numCards)) {
             console.log(1);
            scale = 1 - ++scaleDenom * 0.01;
        }
        return scale;
    }

    // Fit as many cards as possible horizontally and then increase width
    // until we run out of vertical space.
    // This works terribly.
    function fitWidthStrategy(params) {
        var cardsPerRow = params.numCards,
            scaledCardWidth = params.regionWidth / cardsPerRow,
            scale = scaledCardWidth / params.cardWidth;
        while (willFit(params.regionWidth,
                       params.regionHeight,
                       params.cardWidth * scale,
                       params.cardHeight * scale,
                       params.numCards)) {
            cardsPerRow -= 1;
            scaledCardWidth = params.regionWidth / cardsPerRow;
            scale = scaledCardWidth / params.cardWidth;
        }
        cardsPerRow += 1;
        scaledCardWidth = params.regionWidth / cardsPerRow;
        scale = scaledCardWidth / params.cardWidth;
        return scale;
    }

    // Fit all cards horizontally and keep increasing by 10px until we
    // run out of vertical space.
    function growCardsStrategy(params) {
        var scaledCardWidth = params.regionWidth / params.numCards,
            scale = scaledCardWidth / params.cardWidth;
        while (willFit(params.regionWidth,
                       params.regionHeight,
                       params.cardWidth * scale,
                       params.cardHeight * scale,
                       params.numCards)) {
            scaledCardWidth += 1;
            scale = scaledCardWidth / params.cardWidth;
        }
        return scale;
    }

    function willFit(regionWidth, regionHeight, cardWidth, cardHeight, n) {
        var cols = maxCols(regionWidth, cardWidth),
            rows = maxRows(regionHeight, cardHeight);
        return n < cols * rows;
    }

    // Will `n` amount of cards fit inside region?
    function willFit_old(regionWidth, regionHeight, cardWidth, cardHeight, n) {
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

    function maxRows(regionHeight, cardHeight) {
        return Math.max(1, Math.floor(regionHeight / cardHeight));
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