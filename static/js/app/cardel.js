define(['jquery', 'lodash', './util', 'tmpl!./templates/card'],
    function($, _, util, tmpl) {
  
    function CardEl(card) {
        var $el = null;
        
        // TODO: Move padding to layout manager.
        var width = 360 + 10,
            height = 216 + 10;
            
        var init = function() {
            $el = $(tmpl({
                card: card,
                cssClass: cssClass()
            }));
        };
        
        var move = function(cardXy) {
            $el.css({
                top: cardXy.y,
                left: cardXy.x,
                transform: 'scale(' + cardXy.scale + ')'
            });
        };
        
        var cssClass = function() {
            return [
                card.topLeft().toLowerCase(),
                card.topRight().toLowerCase()
            ].join(' ');
        };
        
        init();
        
        return {
            $el: $el,
            cardId: util.getter(card.id()),
            width: util.getter(width),
            height: util.getter(height),
            cssClass: cssClass,
            move: move
        };
    }
    return CardEl;
});