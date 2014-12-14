
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
            '/dashboard/:name': 'dashboard'
        },

        components: {
            home: {
                template: '<h1>Welcome to the home page</h1>',
                created: function () {
                    console.log('Created my component');
                },
                methods: {
                    enter: function (ctx, next) {
                        console.log('Welcome to the home page');
                    }
                }
            },
            dashboard: {
                template: '<pre>{{$parent.params|json}}</pre><h1>Welcome to the dashboard</h1>',
                created: function () {
                    console.log('Created my component');
                }
            }
        },

        options: {
            transition: '',
            keepAlive: false,
            waitFor: ''
        }
    });

    app.$mount('#app');

    window.Vue = Vue;
});