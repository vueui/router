
/**
 * Component dependencies
 */

var Vue = require('vue');
var _ = Vue.util;
var page = require('page');
var not = require('101/not');
var isObject = require('101/is-object');
var dasherize = require('dasherize');


/**
 * app-router definition
 */

module.exports = {

    created: function () {
        var router = this;
        var routes = this.$options.routes;

        if(not(isObject)(routes)) {
            _.warn('routes hash must be set properly in the Router component');
        }


        /**
         * Parse the query
         */
        var qs = require('qs');

        page('*', function parse(ctx, next) {
            Vue.nextTick(function () {
                ctx.query = qs.parse(window.location.search.slice(1));
                next()
            })
        });


        /**
         * Register the listeners for each path(route)
         */

        Object.keys(routes).forEach(function (path) {
            var componentId = routes[path];
            router.registerRoute(path, componentId)
        })
    },

    beforeCompile: function () {
        var router = this;
        var attrs = dasherize(this.$options.options || {});
        var $component = router.$el.querySelector('div');

        Object.keys(attrs).forEach(function (attr) {
            var value = attrs[attr];
            $component.setAttribute(attr, value);
        });
    },

    data: function () {
        return {
            currentPage: 'home'
        }
    },

    methods: require('./methods'),

    template: '<div v-component="{{currentPage}}" v-ref="page"></div>'

};