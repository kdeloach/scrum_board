define(['lodash', 'jquery', 'jquery-ui'],
  function(_, $, ui) {
    
    function ManualLayout(cards) {
        $('#cards').html('');
        _.each(_.map(cards, 'render'), appendToBody);
        
        $('.card').draggable({
            stack: '.card'
        });
        
        function appendToBody(html) {
            $('#cards').append(html);
        }
    }
    return ManualLayout;
});