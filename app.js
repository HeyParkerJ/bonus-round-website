requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../../app',
        bootstrap: '//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js',
        jquery: '//ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js'
    },
    shim: {
        'bootstrap': {
            deps:['jquery']
        }
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['../app/main']);
