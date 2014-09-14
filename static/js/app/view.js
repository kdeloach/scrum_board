define(['jquery', 'bacon', './class'], function($, Bacon, Class) {

    var View = Class.extend({
        defaults: {
            name: '',
            rootRegion: null
        },

        init: function(options) {
            this._super(options);

            if (!this.rootRegion) {
                throw 'View requires a rootRegion.';
            }
        },
        
        render: function() {
            return this.rootRegion.render();
        }
    });

    return View;
});