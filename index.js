
/**
 * Plugin dependencies
 */

var page = require('page')


/**
 * Register the Router component
 *
 * @param Vue
 * @param options
 */

exports.install = function (Vue, options) {
    var definition = require('./src/component')


    /**
     * Start the router when everything is set up
     */

    definition.ready = function () {
        page.start(options || {})
    }

    Vue.component('app-router', definition)
}