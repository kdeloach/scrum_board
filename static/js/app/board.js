define(['jquery', 'lodash', 'bacon', './class'],
    function($, _, Bacon, Class) {

    // Light wrapper around a single (root) region.
    var Board = Class.extend({
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
        
        regions: function() {
            var result = [],
                nodes = this.rootRegion.children();
            while (nodes.length > 0) {
                var node = nodes.pop(0),
                    children = node.children();
                // Don't include container regions (HRegion, VRegion) in the result set.
                if (children) {
                    nodes = nodes.concat(children);
                } else {
                    result.push(node);
                }
            }
            return result;
        },
        
        findRegion: function(regionId) {
            return this.rootRegion.findRegion(regionId);
        },
        
        render: function() {
            return this.rootRegion.render();
        }
    });

    return Board;
});