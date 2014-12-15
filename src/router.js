var page       = require('page'),
    qs         = require('qs'),
    Vue        = require('vue'),
    find       = require('101/find'),
    isFunction = require('101/is-function');

var Router = module.exports = function (vm) {
    var router = this;

    router.vm = vm;

    page('*', function (ctx, next) {
        Vue.nextTick(function () {
            ctx.query = qs.parse(window.location.search.slice(1));

            router.saveQueries(ctx.query);
            router.saveParams(ctx.params);

            next();
        })
    });
};


Router.prototype.registerRoute = function (path, componentId) {
    var router = this;

    page(path, function (ctx, next) {
        router.onEnter(ctx, componentId)
    });

    page.exit(path, router.onExit);
};


/**
 * Sets the current page to the componentId assigned to this path,
 * and calls the 'enter' hook on the view model instance if it is defined
 */

Router.prototype.onEnter = function (ctx, componentId) {
    var router = this,
        routerVm = this.vm;

    routerVm.currentPage = componentId;

    Vue.nextTick(function () {
        var pageVm = router.findPageVm();

        router.saveParams(ctx.params, pageVm);
        router.saveQueries(ctx.query, pageVm);

        if(isFunction(pageVm.enter)) {
            pageVm.enter(ctx);
        }
    })
};


/**
 * Calls the 'leave' middleware (if it is defined) on the view model
 * instance of the current page
 */

Router.prototype.onExit = function (ctx, next) {
    var pageVm = this.findPageVm();

    if (isFunction(pageVm.leave)) {
        pageVm.leave(ctx, next)
    } else {
        next()
    }
};


/**
 * Finds the view model instance of the current page
 *
 * @returns {Vue} instance
 */

Router.prototype.findPageVm = function () {
    var routerVm = this.vm;

    return find(routerVm._children, function (page) {
        return page.$options.name === routerVm.currentPage
    });
}

Router.prototype.saveQueries = function (query, vm) {
    vm = vm || this.vm;

    vm.$set('query', {});

    Object.keys(query).forEach(function (key) {
        vm.query.$add(key, query[key]);
    });
};

Router.prototype.saveParams = function (params, vm) {
    vm = vm || this.vm;

    vm.$set('params', {});

    Object.keys(params).forEach(function (key) {
        vm.params.$add(key, params[key]);
    });
};
