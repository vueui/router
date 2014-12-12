
var domReady = require('domready');
var Vue = require('vue');
var vueUI = require('vue-ui');
var router = require('..');

Vue.use(vueUI);
Vue.use(router);

domReady(function () {
    var app = new Vue().$mount('body');
});