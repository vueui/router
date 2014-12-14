
var domReady = require('domready');
var Vue = require('vue');
var vueUI = require('vue-ui');
var router = require('..');

Vue.use(vueUI);
Vue.use(router);

domReady(function () {

    var Router = Vue.component('app-router');

    window.app = new Router({

        routes: {
            '/': 'home',
            '/dashboard/:username/:name?': 'dashboard'
        },

        components: require('./pages'),

        options: {
			vTransition: 'fade-up',
			transitionMode: 'out-in',
            keepAlive: true
        }
    });

    app.$mount('#app');

    window.Vue = Vue;
    window.page = require('page');
});
