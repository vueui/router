
module.exports = {

    events: {
        'router:beforeLeave': function (ctx) {
            console.log('hook:leave on dashboard')
        }
    },

    entered: function (context) {
        console.log('Entering the dashboard ...');
    },

    beforeLeave: function (context, next) {
        console.log('Leaving the dashboard...');
        next();
    },

    template:
        '<pre>{{params|json}}</pre>' +
        '<h1>Welcome back {{params.username}}!</h1>' +
        '<p>You have {{query.notifications}} new notifications.'

};