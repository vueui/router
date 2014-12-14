
module.exports = {
    template: '<pre>{{params|json}}</pre><h1>Welcome to the dashboard</h1>',
    created: function () {
        console.log('Created my component');
    },
    methods: {
        enter: function (ctx, next) {
            console.log('YESSS');
        },
        leave: function (ctx, next) {
            console.log('Leaving the dashboard...');
            next();
        }
    }
}