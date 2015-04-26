/**
 * Created by jpsoroulas.
 */
/**
 * The application's http interface implementation.
 *
 * @module watcher-http
 */
'use strict';
var express = require('express');
//var router = express.Router();
var _ = require('underscore');
var s = require('underscore.string');

var logger = require('../logger');


function prepareRecord(record) {
    var rec = _.omit(record, 'connector', 'timeout', 'processed', 'notified', 'previousStatus');
    rec.timestamp = rec.timestamp.valueOf();
    rec.since = rec.since.valueOf();
    return rec;
}

/**
 *The application's http interface implementation.
 *
 * @class WatcherHttp
 */
module.exports = {

    /**
     * callback for the HTTP request:
     * _http://`<host>`:`<port>`/endpoints_ (request method: GET)
     * @method endpoints
     * @param {Object} watcher the __{{#crossLink "Watcher"}}{{/crossLink}}__.
     * @return the express route function.
     * */
    endpoints: function endpoints(watcher) {
        return function (req, res, next) {
            res.json(_.map(watcher.getEndpoints(), function (record) {
                return prepareRecord(record);
            }));
        };
    },

    /**
     * callback for the HTTP request:
     * _http://`<host>`:`<port>`/endpoint/`<id>`_ (request method: GET)
     * @method endpoint
     * @param {Object} watcher the __{{#crossLink "Watcher"}}{{/crossLink}}__.
     * @return the express route function.
     * */
    endpoint: function endpoint(watcher) {
        return function (req, res, next) {
            var id = req.params.id;
            var record = watcher.getEndpoint(id);
            if (!_.isUndefined(record)) {
                res.json(prepareRecord(record));
            } else {
                var err = new Error('Unknown endpoint: ' + id);
                err.status = 404;
                next(err);
            }
        };
    },

    /**
     * callback for the HTTP request:
     * _http://`<host>`:`<port>`/endpoint/add_ (request method POST)
     * @method addEndpoint
     * @param {Object} watcher the __{{#crossLink "Watcher"}}{{/crossLink}}__.
     * @return the express route function.
     * */
    addEndpoint: function addEndpoint(watcher) {
        return function (req, res, next) {
            var id = req.body.id;
            try {
                req.body.active = s.toBoolean(req.body.active);
                req.body.notify = s.toBoolean(req.body.notify);
                watcher.addEndpoint(req.body, true);
                res.send('Endpoint \'' + id + '\' added');
            } catch (e) {
                var msg = 'Endpoint ' + id + ' registration failed: ' + e.message;
                logger.error(msg);
                res.send(msg);
            }
        };
    },

    /**
     * callback for the HTTP request:
     * _http://`<host>`:`<port>`/endpoint/remove_ (request method POST)
     * @method removeEndpoint
     * @param {Object} watcher the __{{#crossLink "Watcher"}}{{/crossLink}}__.
     * @return the express route function.
     * */
    removeEndpoint: function removeEndpoint(watcher) {
        return function (req, res, next) {
            var id = req.body.id;
            watcher.removeEndpoint(id);
            res.send('Endpoint \'' + id + '\' removed');
        };
    },

    /**
     * callback for the HTTP request:
     * _http://`<host>`:`<port>`/endpoint/activation_ (request method POST)
     * @method endpointActivation
     * @param {Object} watcher the __{{#crossLink "Watcher"}}{{/crossLink}}__.
     * @return the express route function.
     * */
    endpointActivation: function endpointActivation(watcher) {
        return function (req, res, next) {
            var id = req.body.id;
            var activate = s.toBoolean(req.body.activate);
            watcher.setEndpointActivationState(id, activate);
            res.send('Endpoint \'' + id + '\' activation: ' + activate);
        };
    },

    /**
     * callback for the HTTP request:
     * _http://`<host>`:`<port>`/endpoint/notification_ (request method POST)
     * @method endpointNotification
     * @param {Object} watcher the __{{#crossLink "Watcher"}}{{/crossLink}}__.
     * @return the express route function.
     * */
    endpointNotification: function endpointNotification(watcher) {
        return function (req, res, next) {
            var id = req.body.id;
            var notify = s.toBoolean(req.body.notify);
            watcher.notifyOnErroneousStatus(id, notify);
            res.send('Endpoint \'' + id + '\' notification: ' + notify);
        };
    },

    /**
     * callback for the HTTP request:
     * _http://`<host>`:`<port>`/resolution-strategies_ (request method GET)
     * @method resolutionStrategies
     * @param {Object} watcher the __{{#crossLink "Watcher"}}{{/crossLink}}__.
     * @return the express route function.
     * */
    resolutionStrategies: function resolutionStrategies(watcher) {
        return function (req, res, next) {
            res.json(_.pluck(watcher.getResolutionStrategies(), 'id'));
        };
    }

};
