
/**
 * Component dependencies
 */

var _ = require('vue').util;
var page = require('page');
var not = require('101/not');
var isObject = require('101/is-object');


/**
 * app-router definition
 */

exports.created = function () {
    var router = this;
    var routes = this.$options.routes;

    if(not(isObject)(routes)) {
        _.warn('routes hash must be set properly in the Router component');
    }

    Object.keys(routes).forEach(registerRoute)

    /**
     * Sets the component which was specified in the routes hash to the currentPage
     *
     * @param path
     */

    function registerRoute(path) {
        var componentId = routes[path];

        page(path, function (ctx, next) {
            setParams(ctx.params);
            router.currentPage = componentId;
        });
    }

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

exports.data = function () {
    return {
        currentPage: 'home',
        params: {}
    }
};

exports.methods = {
    navigate: function (path) {
        page(path)
    }
};

exports.template = '<div v-component="{{currentPage}}" keep-alive v-ref="page"></div>'