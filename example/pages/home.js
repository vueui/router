

module.exports = {
    template: '<h1>Welcome to the home page</h1>',
    created: function () {
        console.log('Created my component');
    },
    methods: {
        enter: function (ctx, next) {
            console.log('Welcome to the home page');
        }
    }
}