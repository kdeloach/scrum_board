requirejs.config({
    baseUrl: 'static/js/lib',
    paths: {
        app: '../app',
        tmpl: 'loader'
    },
    shim: {
        'bootstrap.min': {
            deps: ['jquery']
        }
    }
});