define(['lodash', 'baseclass'], function(_, BaseClass) {
    var Class = BaseClass.extend({
        defaults: {},
        init: function(options) {
            _.assign(this, _.defaults(options, this.defaults));
        }
    });
    return Class;
});