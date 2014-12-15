var page       = require('page'),
    qs         = require('qs'),
    Vue        = require('vue'),
    find       = require('101/find'),
    pluck      = require('101/pluck'),
    set        = require('101/set'),
    isString   = require('101/is-string'),
    isFunction = require('101/is-function'),
    isObject   = require('101/is-object')

var Router = module.exports = function (vm, routes) {
    var router = this

    set(router, 'vm', vm)

    page('*', function (ctx, next) {
        Vue.nextTick(function () {
            var query = qs.parse(window.location.search.slice(1))

            set(ctx, 'query', query)
            next()
        })
    })

    Object.keys(routes).forEach(function (path) {
        var definition = pluck(routes, path)
        router.registerRoute(path, definition)
    })

}


Router.prototype.registerRoute = function (path, definition) {
    var router = this,
        routerVm = this.vm,
        componentId, title, beforeEnter

    if (isObject(definition)) {
        title = pluck(definition, 'title')
        beforeEnter = pluck(definition, 'beforeEnter')
        componentId = pluck(definition, 'componentId')
    } else {
        componentId = definition
    }

    page(path, function (ctx, next) {
        routerVm.currentPage = componentId

        Vue.nextTick(function () {
            var pageVm = router.findPageVm()

            router.saveParams(ctx.params)
            router.saveQueries(ctx.query)

            // Set the document title if needed
            if(isString(title)) {
                document.title = routerVm.$interpolate(title)
            }

            if (isFunction(pageVm.enter)) {
                pageVm.enter(ctx)
            }
        })
    })

    page.exit(path, function (ctx, next) {
        var pageVm = router.findPageVm()

        if (isFunction(pageVm.leave)) {
            pageVm.leave(ctx, next)
        } else {
            next()
        }
    })
}

/**
 * Finds the view model instance of the current page
 *
 * @returns {Vue} instance
 */

Router.prototype.findPageVm = function () {
    var routerVm = this.vm

    return find(routerVm._children, function (page) {
        return page.$options.name === routerVm.currentPage
    })
}

Router.prototype.saveQueries = function (query) {
    var vm = this.vm

    vm.$set('query', {})

    Object.keys(query).forEach(function (key) {
        vm.query.$add(key, query[key])
    })
}

Router.prototype.saveParams = function (params) {
    var vm = this.vm

    vm.$set('params', {})

    Object.keys(params).forEach(function (key) {
        vm.params.$add(key, params[key])
    })
}