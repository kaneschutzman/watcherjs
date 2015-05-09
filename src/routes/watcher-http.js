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
     * _http://`<host>`:`<port>`/endpoints/`<id>`_ (request method: GET)
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
     * _http://`<host>`:`<port>`/endpoints_ (request method POST)
     * @method addEndpoint
     * @param {Object} watcher the __{{#crossLink "Watcher"}}{{/crossLink}}__.
     * @return the express route function.
     * */
    addEndpoint: function addEndpoint(watcher) {
        return function (req, res, next) {
            var id = req.body.id;
            req.body.active = s.toBoolean(req.body.active);
            req.body.notify = s.toBoolean(req.body.notify);
            var info = watcher.addEndpoint(req.body, true);
            if (_.isEmpty(info.errors)) {
                var resp = {};
                resp.id = id;
                resp.uri = '/endpoints/' + id;
                resp.status = info.endpoint.status;
                res.json(resp);
            } else {
                next({
                    //message: 'validation errors',
                    status: 422,
                    errors: info.errors
                });
            }
        };
    },

    /**
     * callback for the HTTP request:
     * _http://`<host>`:`<port>`/endpoints/`<id>`_ (request method DELETE)
     * @method removeEndpoint
     * @param {Object} watcher the __{{#crossLink "Watcher"}}{{/crossLink}}__.
     * @return the express route function.
     * */
    removeEndpoint: function removeEndpoint(watcher) {
        return function (req, res, next) {
            var id = req.params.id;
            watcher.removeEndpoint(id);
            res.json({id: id});
        };
    },

    /**
     * callback for the HTTP request:
     * _http://`<host>`:`<port>`/endpoints/`<id>`/activate_ (request method POST)
     * @method endpointActivate
     * @param {Object} watcher the __{{#crossLink "Watcher"}}{{/crossLink}}__.
     * @return the express route function.
     * */
    endpointActivate: function endpointActivate(watcher) {
        var _self = this;
        return function (req, res, next) {
            _self._changeEndpointActivationState(watcher, req, res, true);
        };
    },

    /**
     * callback for the HTTP request:
     * _http://`<host>`:`<port>`/endpoint/`<id>`/activate_ (request method DELETE)
     * @method endpointDeactivate
     * @param {Object} watcher the __{{#crossLink "Watcher"}}{{/crossLink}}__.
     * @return the express route function.
     * */
    endpointDeactivate: function endpointDeactivate(watcher) {
        var _self = this;
        return function (req, res, next) {
            _self._changeEndpointActivationState(watcher, req, res, false);
        };
    },

    _changeEndpointActivationState: function _changeEndpointActivationState(watcher, req, res, active) {
        var id = req.params.id;
        var endpoint = watcher.setEndpointActivationState(id, active);
        res.json({
            id: id,
            active: endpoint.active,
            status: endpoint.status
        });
    },

    /**
     * callback for the HTTP request:
     * _http://`<host>`:`<port>`/endpoints/`<id>`/notify_ (request method POST)
     * @method endpointEnableNotification
     * @param {Object} watcher the __{{#crossLink "Watcher"}}{{/crossLink}}__.
     * @return the express route function.
     * */
    endpointEnableNotification: function endpointEnableNotification(watcher) {
        var _self = this;
        return function (req, res, next) {
            _self._changeEndpointNotificationState(watcher, req, res, true);
        };
    },

    /**
     * callback for the HTTP request:
     * _http://`<host>`:`<port>`/endpoints/`<id>`/notify_ (request method DELETE)
     * @method endpointEnableNotification
     * @param {Object} watcher the __{{#crossLink "Watcher"}}{{/crossLink}}__.
     * @return the express route function.
     * */
    endpointDisableNotification: function endpointDisableNotification(watcher) {
        var _self = this;
        return function (req, res, next) {
            _self._changeEndpointNotificationState(watcher, req, res, false);
        };
    },


    _changeEndpointNotificationState: function _changeEndpointNotificationState(watcher, req, res, notify) {
        var id = req.params.id;
        watcher.notifyOnErroneousStatus(id, notify);
        res.json({id: id, notify: notify});
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
