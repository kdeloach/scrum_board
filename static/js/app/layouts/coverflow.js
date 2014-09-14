define(['lodash', 'jquery', 'jquery-ui', '../class'],
  function(_, $, ui, Class) {
    
    var cardWidth = 480,
        cardHeight = 288,
        cardMargin = 10;
    
    // Display cards left-to-right in a single row and 
    // scaled to the height of parent region.
    var CoverFlowLayout = Class.extend({
        setup: function(region) {
            region.$el.addClass('h-scroll');
        },
        
        update: function(region) {
            region.$el.find('> .cards').html('');
            _.each(region.cards, _.bind(this.renderCard, this, region));
        },
        
        renderCard: function(region, card) {
            var cardEl = card.render(),
                scale = region.$el.height() / (cardHeight + cardMargin * 2),
                width = region.numCards() * (cardWidth + cardMargin * 2) * scale * 2;
            region.$el.find('> .cards').css({
                transform: 'scale(' + scale + ')'
            });
            region.$el.find('> .cards')
                .width(width)
                .append(cardEl);
        }
    });
    
    return CoverFlowLayout;
});