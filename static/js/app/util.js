define(['lodash'], function(_) {
    return {
        getter: _.partial(_.partial, _.identity),
        
        expandArguments: function(fn) {
            var context = this;
            return function(arr) {
                return fn.apply(context, arr);
            };
        },
        
        // TODO: Remove once flatMap is supported in lodash.
        flatMap: function(coll, callback, thisArg) {
            return _.reduce(
                _.map(coll, callback, thisArg),
                function(acc, item) {
                    return acc.concat(item);
                },
                []
            );
        }
    };
});