
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

#### Router options object
You can pass an optional ```options``` object as an option when instantiating the Router. These will all added to
the dynamic component that is controlling the views.

```js
new Router({
    routes: { ... },

    options: {
        vTransition: 'transition-name',
        keepAlive: true,
        waitFor: 'event',
        transitionMode: 'in-out'
    }
})

```

#### Context params
The params of a route(if there is any) can be accessed in a route component using ```$parent.params```