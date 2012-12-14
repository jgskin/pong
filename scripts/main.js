requirejs.config({
    baseUrl: 'scripts',
    shim: {
        'lib/backbone': {
            deps: ['lib/underscore', 'lib/jquery'],
            exports: 'Backbone'
        }
    }
});

requirejs(['src/app'], function (app) {

});