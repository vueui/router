
module.exports = {
    template: '<pre>{{params|json}}</pre><h1>Welcome back {{params.username}}!</h1>',
    methods: {
        enter: function (context) {
            console.log('Entering the dashboard ...');
        },
        leave: function (context, next) {
            console.log('Leaving the dashboard...');
            next();
        }
    }
};