/**
 * Constructor dependencies
 */

var page       = require('page'),
    qs         = require('qs'),
    Vue        = require('vue'),
    find       = require('101/find'),
    pluck      = require('101/pluck'),
    set        = require('101/set'),
    isString   = require('101/is-string'),
    isFunction = require('101/is-function'),
    isObject   = require('101/is-object'),
    passAny    = require('101/pass-any'),
    isArray    = require('lodash.isarray')


/**
 * Router constructor
 */

var Router = module.exports = function (vm, routes) {
    var router = this

    set(router, 'vm', vm)

    /**
     * Parse the querystring using the `qs` module
     */

    page('*', function (ctx, next) {
        Vue.nextTick(function () {
            var query = qs.parse(window.location.search.slice(1))

            set(ctx, 'query', query)
            next()
        })
    })


    /**
     * Set up middleware and callbacks for each route definition
     */

    Object.keys(routes).forEach(function (path) {
        var definition = pluck(routes, path),
            componentId, title, beforeEnter

        if (isObject(definition)) {
            title = pluck(definition, 'title')
            beforeEnter = pluck(definition, 'beforeEnter')
            componentId = pluck(definition, 'componentId')
        } else {
            componentId = definition
        }

        if (passAny(isString, isArray)(beforeEnter)) {
            router.registerMiddleware(path, beforeEnter)
        }

        router.registerRoute(path, componentId, title)
    })

}


/**
 * Registers a route definition to update the `currentPage` and document.title
 *
 * @param {String} path - The `page.js` path to listen to for changes
 * @param {String} componentId - The component assigned to be made active when `path` is entered
 * @param {String} title - The `title` expression to interpolate against the router view model and set to document.title
 */

Router.prototype.registerRoute = function (path, componentId, title) {
    var router = this,
        routerVm = this.vm

    page(path, function (ctx, next) {
        routerVm.currentPage = componentId

        Vue.nextTick(function () {
            var pageVm = routerVm.$.page,
                enterHook

            router.saveParams(ctx.params)
            router.saveQueries(ctx.query)

            // Set the document title if needed
            if (isString(title)) {
                document.title = routerVm.$interpolate(title)
            }

            /**
             * Call the `enter` method hook and emit the `hook:enter` event
             */

            if(pageVm) {
                enterHook = pageVm.$options.entered

                if (isFunction(enterHook)) {
                    enterHook(ctx)
                }

                pageVm.$emit('router:entered', ctx)
            }
        })
    })

    page.exit(path, function (ctx, next) {
        var pageVm = routerVm.$.page,
            leaveHook

        // Reset the title to the original 'origin' string
        if(isString(title)) {
            document.title = window.location.origin || '';
        }

        if(pageVm) {
            leaveHook = pageVm.$options.beforeLeave

            if (isFunction(leaveHook)) {
                leaveHook(ctx, next)
            } else {
                pageVm.$emit('router:beforeLeave', ctx)
                next()
            }
        } else {
            next()
        }
    })
}


/**
 * Register any middleware to run before the component assigned to `path` is set to be active
 *
 * @param {String} path - The `page.js` path
 * @param {String|Array} beforeEnter - A string or an array of strings declared as `methods` in the router vm
 */

Router.prototype.registerMiddleware = function (path, beforeEnter) {
    var routerVm = this.vm,
        middleware = isString(beforeEnter)
            ? [beforeEnter]
            : beforeEnter

    middleware
        .filter(methodExists)
        .map(function (methodName) {
            return pluck(routerVm, methodName)
        })
        .forEach(function (method) {
            page(path, method)
        });

    function methodExists(method) {
        return isFunction(pluck(routerVm, method))
    }
}

Router.prototype.saveQueries = function (query) {
    var vm = this.vm,
        parsed = {}

    Object.keys(query).forEach(function (key) {
        set(parsed, key, query[key])
    })

    vm.$set('query', parsed)
}

Router.prototype.saveParams = function (params) {
    var vm = this.vm,
        parsed = {}

    Object.keys(params).forEach(function (key) {
        set(parsed, key, params[key])
    })

    vm.$set('params', parsed)
}