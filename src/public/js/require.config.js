require.config({
    //enforceDefine: true,
    //urlArgs: 'bust=' +  (new Date()).getTime(),
    baseUrl: 'js',
    paths: {
        'jquery': 'lib/jquery.min',
        'jquery-validate': 'lib/jquery.validate.min',
        'jquery-ui-bootstrap': 'lib/jquery-ui/bootstrap/bootstrap.min',
        'jquery-ui': 'lib/jquery-ui/jquery-ui.min',
        'highcharts': 'lib/highcharts',
        'backbone': 'lib/backbone-min',
        'underscore': 'lib/underscore-min',
        'handlebars': 'lib/handlebars.min',
        'moment': 'lib/moment.min',
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