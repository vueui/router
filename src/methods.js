
/**
 * Dependencies
 */

var page = require('page');


exports.navigate = function (path) {
    page(path)
};


/**
 * Sets the component which was specified in the routes hash to the currentPage
 *
 * @param path
 */

exports.registerRoute = function (path, componentId) {
    var router = this;

    page(path, function (ctx, next) {
        setParams(ctx.params);
        router.currentPage = componentId;
    });

    /**
     * Updates the 'params' object on the router
     *
     * @param params {Object} The context params of the newly entered route
     */

    function setParams(params) {
        router.$set('params', {});

        Object.keys(params).forEach(function (key) {
            router.params.$add(key, params[key]);
        });
    }
};