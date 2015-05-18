/**
 * Created by jpsoroulas.
 */
/**
 * The express web framework used to expose the __{{#crossLink "Watcher"}}{{/crossLink}}__ api as HTTP requests.
 * See also at __{{#crossLink "WatcherHttp"}}{{/crossLink}}__.
 *
 * @module httpServer
 */
'use strict';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require('underscore');
var stampit = require('stampit');

var logger = require('./logger');

var httpServer = stampit().methods({
    setup: function setup(options) {
        var app = this._app = express();
        app.set('env', options.env);
        logger.debug('Setting up watcher http internal server ' + app.get('env') + ' environment.');
        app.set('port', options.port);
        app.set('host', options.host);
        // views path, view engine setup
        app.set('views', path.join(__dirname, options.views));
        app.set('view engine', 'jade');
        app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
        app.use(morgan('dev'));
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.use(bodyParser.json());
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, options.static)));

        // Execute the callback for routes setup
        options.routesCallback(app);

        // Catch 404 and forward to the error handler
        app.use(function (req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        app.locals.pretty = true;
        app.use(function (err, req, res, next) {
            var message = err.message || 'Unknown Error!';
            //var errors = err.errors || [message];
            res.status(err.status || 500).json({
                message: message,
                errors: err.errors
            });
        });
    },

    start: function start(callback) {
        var app = this._app;
        this._server = app.listen(app.get('port'), app.get('host'), callback);
    },

    addListener: function addListener(event, callback) {
        this._server.on(event, callback);
    },

    stop: function stop() {
        this._server.close();
    }
});

module.exports = {
    create: function create(options) {
        var _options = {
            env: 'production',
            port: process.env.PORT || 3000,
            host: process.env.HOST || 'localhost',
            views: './views',
            static: './public',
            routesCallback: void 0
        };
        options = options || {};
        _.defaults(options, _options);
        options.routesCallback = options.routesCallback || _.noop;

        var server = httpServer.create();
        server.setup(options);
        return server;
    }
};