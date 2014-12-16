
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
```

At this point a component with id of ```app-router``` is available for use:
```js
var Router = Vue.component('app-router')

var app = new Router({
    routes: {
        '/': 'home',
        '/dashboard/:username': 'dashboard',
        '/statistics/:category': {
            componentId: 'statistics',
            beforeEnter: [ 'isAuthenticated', 'isAuthorized' ],
            title: 'Viewing stats for {{params.category}}'
        }
    },
    methods: {
        isAuthenticated: function(ctx, next) {
            if(!ctx.user) {
                page('/login')
            } else {
                next()
            }
        },
        isAuthorized: function(ctx, next) {
            // Check if the user is authorized to view these stats
            next()
        }
    },
    components: {
        home: { ... },
        dashboard: {
            template: '<h1>Welcome back {{params.username}}!</h1>'
        },
        statistics: { ... }
    }
}).$mount('#app')

```

#### Defining a route
You can define a route in the ```routes``` hash either by specifying ```"/path/:params?query": "componentId"``` or
with an object containing at least the ```componentId``` property:
```js
routes: {
    '/profile/:username': {
        componentId: 'profile',

        // Middleware to run before entering this route
        // Can also be an array(see above) with 'methods' executed in order
        beforeEnter: 'isAuthenticated',

        // An expression $interpolate'd against the routerVm, you can use `params` and `query` here
        // The output is assigned to document.title
        title: '{params.username} profile'
    }
}
```

#### Hooks
There is two hooks(similar to ```ready, created, etc```) which you can specify on a *page component*:
 * ***enter: function(ctx) { }***         Runs on nextTick after the component for this route is activated
 * ***leave: function(ctx, next) { }***   Runs on .exit for the given path, you must call ```next``` when
    you are done to proceed to the next route

There is also the ```hook:enter``` and ```hook:leave``` events which receive the raw page.js ```ctx``` as an argument


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

#### Context query
The [```qs```](https://github.com/hapijs/qs) module is included to parse the ```search``` property of the location, ie the querystring,
and just like with params, you can access the queries in the ```$data.query``` keypath.