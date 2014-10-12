define(['lodash'], function(_) {
    return {
        getter: _.partial(_.partial, _.identity),
        
        expandArguments: function(fn) {
            var context = this;
            return function(arr) {
                return fn.apply(context, arr);
            };
        },
        
        flatMap: function(coll, callback, thisArg) {
            return _.flatten(_.map(coll, callback, thisArg), true);
        }
    };
});