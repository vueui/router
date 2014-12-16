
/**
 * Component dependencies
 */

var Vue       = require('vue'),
    _         = Vue.util,
    not       = require('101/not'),
    isObject  = require('101/is-object'),
    dasherize = require('dasherize'),
    page      = require('page')

var Router = require('./router')


/**
 * app-router definition
 */

module.exports = {

    created: function () {
        var routes = this.$options.routes || {}

        if (not(isObject)(routes)) {
            _.warn('routes hash must be set properly in the Router component')
        }

        this.$router = new Router(this, routes)
    },

    beforeCompile: function () {
        var router = this
        var attrs = dasherize(this.$options.options || {})
        var $component = router.$el.querySelector('div')

        Object.keys(attrs).forEach(function (attr) {
            var value = attrs[attr]
            $component.setAttribute(attr, value)
        })
    },

    data: function () {
        return {
            currentPage: '',
            params     : {},
            query      : {}
        }
    },

    methods: {
        navigate: function (path) {
            page(path)
        }
    },

    template: '<div v-component="{{currentPage}}" v-with="params: params, query: query"></div>'

}