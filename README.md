
vueui-router 0.1.0
==================

#### Usage

```js
var Vue = require('vue')
var router = require('vueui-router')

Vue.use(router)

var Router = Vue.component('ui-router')

var app = new Router({
    routes: {
        '/dashboard': 'dashboard'
    }
}).$mount('#app')


Vue.component('dashboard', {
    template: '',
    data: {
        ...
    }
})

```