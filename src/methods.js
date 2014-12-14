
/**
 * Dependencies
 */

var page = require('page');
var Vue = require('vue');
var find = require('101/find');
var isFunction = require('101/is-function');


/**
 * A shorthand to page.show(path|String)
 * @param path
 */

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

    page(path, onEnter);
    page.exit(path, onExit);


    /**
     * Sets the active page to the componentId assigned to this path,
     * and calls the 'enter' hook on the view model instance if it is specified
     */

    function onEnter(ctx, next) {
        router.currentPage = componentId;

        Vue.nextTick(function () {
            var pageVm = findPageVm();

            setParams(pageVm, ctx.params);

            if(isFunction(pageVm.enter)) {
                pageVm.enter(ctx)
            }
        })
    }


    /**
     * Calls the 'leave' middleware on the active page view model instance if it is specified
     */

    function onExit(ctx, next) {
        var pageVm = findPageVm();

        if(isFunction(pageVm.leave)) {
            pageVm.leave(ctx, next)
        } else {
            next()
        }
    }


    /**
     * Finds the view model instance of the active page
     * @returns {Vue} instance
     */

    function findPageVm() {
        return find(router._children, function (page) {
            return page.$options.name === router.currentPage
        });
    }


    /**
     * Updates the 'params' object on the view model instance of the currentPage
     * @param params {Object} The context params of the newly entered route
     */

    function setParams(pageVm, params) {
        pageVm.$set('params', {});

        Object.keys(params).forEach(function (key) {
            pageVm.params.$add(key, params[key]);
        });
    }
};