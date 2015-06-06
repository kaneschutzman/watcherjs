require.config({
    //enforceDefine: true,
    //urlArgs: 'bust=' +  (new Date()).getTime(),
    baseUrl: 'js',
    paths: {
        'jquery': 'lib/jquery.min', //1.10.2
        'jquery-validate': 'lib/jquery.validate.min', //v1.13.1
        'jquery-ui-bootstrap': 'lib/jquery-ui/bootstrap/bootstrap.min',
        'jquery-ui': 'lib/jquery-ui/jquery-ui.min',//v1.11.4
        'highcharts': 'lib/highcharts', //v4.1.5
        'backbone': 'lib/backbone-min', //v1.1.2
        'underscore': 'lib/underscore-min', //v1.8.2
        'handlebars': 'lib/handlebars.min', //v3.0.1
        'socket.io': 'lib/socket.io.min', //v1.3.5
        'moment': 'lib/moment.min', //v2.10.2
        'moment-duration-format': 'lib/moment-duration-format',
        'endpoint-form': 'app/endpoint-form',
        'endpoint-model': 'app/endpoint-model',
        'endpoint-view': 'app/endpoint-view',
        'endpoints-model': 'app/endpoints-model',
        'endpoints-view': 'app/endpoints-view',
        'endpoint-history': 'app/endpoint-history',
        'helper': 'app/helper',
        'templates': 'templates/templates'
    },
    shim: {
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        },
        'jquery-validate': ['jquery'],
        'jquery-ui': ['jquery'],
        'jquery-ui-bootstrap': ['jquery', 'jquery-ui'],
        'moment-duration-format': ['moment'],
        'highcharts': {
            deps: ['jquery'],
            exports: 'Highcharts'
        }
    }
});
require(["main"]);