
var omit = require('101/omit');
var page = require('page');

/**
 * Register the Router component
 *
 * @param Vue
 * @param options
 */

exports.install = function (Vue, options) {
    var definition = require('./src/router')

    // Grab the options which will be passed to page.js
    options = omit(options || {});

    definition.ready = function () {
        page.start(options)
    }

    Vue.component('app-router', definition)
};