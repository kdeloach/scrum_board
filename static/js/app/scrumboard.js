define(['lodash', 'jquery', 'jquery-ui', 'moment', 'bacon', './util',
        './card', './cardel', './region', './board', './random',
        './layouts/manual',  './layouts/flow',   './layouts/coverflow'],
  function(_, $, ui, moment, Bacon, util,
           Card, CardEl, region, Board, random,
           ManualLayout, FlowLayout, CoverFlowLayout) {

    function init() {
        var cards = getCards(),
            cardEls = _.map(cards, function(card) {
                return new CardEl(card);
            });
            
        $('#pool').append(_.pluck(cardEls, '$el'));
    
        var board = createDefaultBoard(),
            cardRegions = getCardRegions(board);
        
        $('#container').append(board.render());

        Bacon.mergeAll(
            $('#container').asEventStream('dragstop', '.region'),
            $(window).asEventStream('resize')
        ).onValue(redraw, board, cardEls, cardRegions);
            
        redraw(board, cardEls, cardRegions);
    }
    
    function createDefaultBoard() {
        var rootRegion = new region.HRegion({
                name: 'root',
                topHeight: 0.25
            }),
            scratchRegion = new region.Region({
                name: 'scratch'
            }),
            defaultRegion = new region.Region({
                name: 'default'
            });

        var tmp2 = new region.HRegion({
            name: 'baz'
        });
        tmp2.setTopRegion(defaultRegion);
        tmp2.setBottomRegion(new region.Region({
            name: 'bing'
        }));
            
        var tmp = new region.VRegion({
            name: 'foo'
        });
        tmp.setLeftRegion(tmp2);
        tmp.setRightRegion(new region.Region({
            name: 'bar'
        }));
        
        rootRegion.setTopRegion(scratchRegion);
        rootRegion.setBottomRegion(tmp);
        
        return new Board({
            name: 'default',
            rootRegion: rootRegion
        });
    }

    function redraw(board, cardEls, cardRegions) {
        var groupedRegions = _.groupBy(cardRegions, 'regionId'),
            cardsPerRegion = _.mapValues(groupedRegions, function(cardRegions) {
                return _.sortBy(
                    _.map(cardRegions, function(cardRegion) {
                        return _.findWhere(cardEls, function(cardEl) {
                            return cardEl.cardId() === cardRegion.cardId;
                        });
                    }),
                    function(cardEl) {
                        return cardEl.cssClass();
                    }
                );
            }),
            cardLayouts = util.flatMap(cardsPerRegion, function(cardEls, regionId) {
                var region = board.findRegion(regionId),
                    cardXys = region.layout.calculate(region, cardEls);
                    
                    // XXX: Card elements must be inside the region element
                    // because layout positions are relative.
                    region.$el.prepend(_.pluck(cardEls, '$el'));
                    
                return _.zip(cardEls, cardXys);
            });
        _.each(cardLayouts, util.expandArguments(function(cardEl, cardXy) {
            cardEl.move(cardXy);
        }));
    }
    
    function getCards() {
        var topLeft = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'],
            cards = _.times(25, function(i) {
                return new Card(
                    i,
                    random.pick(random.phrases),
                    Math.random() > 0.25 ? random.pick(topLeft) : ''
                );
            });
        return cards;
    }
    
    function getCardRegions(board) {
        var regionNames = _.invoke(board.regions(), 'getFullPath'),
            cardRegions = _.times(25, function(i) {
                return {cardId: i, regionId: random.pick(regionNames)};
            });
        return cardRegions;
    }
    
    return {
        init: init
    };
});