
vueui-router 0.1.0
==================
Page.js powered simple router for Vue.js. Uses a [dynamic component](http://vuejs.org/guide/components.html#Dynamic_Components) to manage
which page component appears on the page. Works with ```Vue v0.11.1``` and up.

#### Usage

First install it:
```bash
npm install --save vueui-router
```

Then use it:
```js
var Vue = require('vue')
var router = require('vueui-router')

Vue.use(router, {
    // Page.js options
})

var Router = Vue.component('ui-router')

var app = new Router({
    routes: {
        '/dashboard/:username': 'dashboard'
    }
}).$mount('#app')


Vue.component('dashboard', {
    template: '<h1>Welcome back {{params.username}}!</h1>'
})

```

#### Router ```options``` object
You can pass an optional ```options``` option when instantiating the Router. These camel cased properties will all added to
the dynamic component that is switching the route components internally.

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
The params of a route(if there is any) can be accessed in a route component in the ```$data.params``` keypath (or just ```params```)
