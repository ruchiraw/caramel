
var on = require('/caramel.js').on;
var pre = require('/caramel.js').pre;

on('request', function(req, res, next) {

});

on('menu primary', function(menu) {
    menu.push({
        title: 'Login',
        href: '/login'
    });
});
