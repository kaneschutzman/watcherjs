/**
 * Created by jpsoroulas.
 */
/**
 * The application's REST API implementation.
 * ###REST API
 * In case of failure the server returns an object with the following structure:
 * ```
 * {
 *      message: message,   //generic error message
 *      errors: errors      //array of specific errors
 * }
 *```
 *
 * #### Get information for a specific endpoint.
 * ----
 *  * __http://`<host>`:`<port>`/endpoints/`<id>`__ (request method: GET),
 *  * parameters:
 *    * __id__ the endpoint id, it should be one of those defined at endpoints configuration data,
 *  * API reference: __{{#crossLink "Watcher/getEndpoint:method"}}{{/crossLink}}__.
 *
 *
 * __Response on success:__
 *
 * ```
 * // For a socket communication type
 * {
 *      "id": "endpoint-id",            // endpoint id
 *      "desc": "an endpoint",          // endpoint description
 *      "status": "up",                 // endpoint status
 *      "timestamp": 1429860936846,     // the timestamp of the current status
 *      "since": 1429860926846,         // the timestamp since the last change of status
 *      "type": "socket",               // connector type
 *      "host": "localhost",            // endpoint host (applied for 'socket' connector)
 *      "port": 7777,                   // endpoint port (applied for 'socket' connector)
 *      "active": true,                 // whether or not the endpoint is active
 *      "notify": false                 // whether or not the notification is enabled
 * }
 * ```
 *
 * __Response on error:__
 * ```
 * If the endpoint does not exist an error message with http status 422 is send
 *```
 *
 * #### Get information for all registered endpoints.
 * ----
 *  * __http://`<host>`:`<port>`/endpoints__ (request method: GET).
 *  * API reference: __{{#crossLink "Watcher/getEndpoints:method"}}{{/crossLink}}__.
 *
 *
 *  __Response on success:__
 *
 * ```
 * An array with the information for all endpoints.
 * // For a socket and http communication types
 * [
 *      {
 *          "id": "endpoint-1",
 *          "desc": "endpoint 1",
 *          "status": "down"
 *          "timestamp": 1429860936846,
 *          "since": 1429860926846,
 *          "type": "socket",
 *          "host": "localhost",
 *          "port": 7777,
 *          "active": true,
 *          "notify": true
 *      },
 *      {
 *          "id": "endpoint-2",                     // endpoint id
 *          "desc": "endpoint 2",                   // endpoint description
 *          "status": "up"                          // endpoint status
 *          "timestamp": 1429860936846,             // the timestamp of the current status
 *          "since": 1429860926846,                 // the timestamp since the last change of status
 *          "type": "http",                         // connector type
 *          "url": "http://11.222.333.555:3333/",   // endpoint url (applied for 'http(s) connector')
 *          "active": true,                         // whether or not the endpoint is active
 *          "notify": false                         // whether or not the notification is enabled
 *      }
 * ]
 * ```
 *
 * __Response on error:__
 * ```
 * Generic error message with http status 500
 *```
 *
 * #### Add new endpoint.
 * ----
 *  * __http://`<host>`:`<port>`/endpoints__ (request method POST)
 *  * parameters (parameters in _[]_ are optional. when not set, the default values are used - those in parentheses.):
 *    * __id__ : the endpoint id,
 *    * __desc__ : the endpoint description,
 *    * __type__ : the endpoint type ('socket' or 'http'),
 *    * [__host__] (localhost): the endpoint host (applied for 'socket' communication type),
 *    * [__port__] (9999): the endpoint port (applied for 'socket' communication type),
 *    * [__url__] : the endpoint port (applied for 'http' communication type),
 *    * [__active__] (true): true/false whether or not to activate the endpoint,
 *    * [__notify__] (false): true/false whether or not to enable email notification on erroneous service status
 *  * API reference: __{{#crossLink "Watcher/addEndpoint:method"}}{{/crossLink}}__.
 *
 *
 *  __Response on success:__
 *
 * ```
 * {
 *      "id":     "<endpoint id>"         //endpoint id
 *      "uri":    "<access endpoint uri>" //endpoint uri, e.g. /endpoints/<endpoint id>
 *      "status": "<endpoint status>"     //endpoint status (e.g. 'undetermined')
 * }
 *
 * ```
 *
 * __Response on error:__
 * ```
 * Validation error messages with http status 422
 *```
 *
 * #### Remove an endpoint.
 * ----
 *  * __http://`<host>`:`<port>`/endpoints/`<id>`__ (request method: DELETE),
 *  * parameters:
 *    * __id__ : the endpoint id
 *  * API reference: __{{#crossLink "Watcher/removeEndpoint:method"}}{{/crossLink}}__.
 *
 *
 *  __Response on success:__
 *
 * ```
 * {
 *      "id": "<endpoint id>"   //removed endpoint id
 * }
 * ```
 *
 * __Response on error:__
 * ```
 * If the endpoint does not exist an error message with http status 422 is send
 *```
 *
 * #### Activate/deactivate an endpoint.
 * ----
 *  * __http://`<host>`:`<port>`/endpoints/`<id>`/activate__ (request method POST),
 *  * __http://`<host>`:`<port>`/endpoints/`<id>`/activate__ (request method DELETE),
 *  * parameters:
 *    * __id__ : the endpoint id,
 *  * API reference: __{{#crossLink "Watcher/setEndpointActivationState:method"}}{{/crossLink}}__.
 *
 *
 *  __Response on success:__
 *
 * ```
 * {
 *      "id": "<endpoint id>"           //endpoint id
 *      "active": "<activation state>"  //activation state
 *      "status": "<endpoint status>"   //endpoint status
 * }
 * ```
 *
 * __Response on error:__
 * ```
 * If the endpoint does not exist an error message with http status 422 is send
 *```
 *
 * #### Enable/disable notification for an endpoint.
 * ----
 *  * __http://`<host>`:`<port>`/endpoints/`<id>`/notify__ (request method POST),
 *  * __http://`<host>`:`<port>`/endpoints/`<id>`/notify__ (request method DELETE),
 *  * parameters:
 *    * __id__ : the endpoint id,
 *  * API reference: __{{#crossLink "Watcher/notifyOnErroneousStatus:method"}}{{/crossLink}}__.
 *
 *
 *  __Response on success:__
 *
 * ```
 * {
 *      "id": "<endpoint id>"               //endpoint id
 *      "notify": "<notification state>"    //activation state
 * }
 * ```
 *
 * __Response on error:__
 * ```
 * If the endpoint does not exist an error message with http status 422 is send
 *```
 *
 * #### Get the the unbound resolution strategies.
 * ----
 *  * __http://`<host>`:`<port>`/resolution-strategies__ (request method GET),
 *  * API reference: __{{#crossLink "Watcher/getResolutionStrategies:method"}}{{/crossLink}}__.
 *
 *
 *  __Response on success:__
 *
 * ```
 * An array with the unbound resolution strategies, e.g.:
 * [
 *  "on-connection",
 *  "always-down"
 * ]
 * ```
 *
 * __Response on error:__
 * ```
 * Generic error message with http status 500
 *```
 *
 * @module watcher-http
 */
'use strict';
var express = require('express');
//var router = express.Router();
var _ = require('underscore');
var s = require('underscore.string');

var logger = require('../logger');


function prepareEndpoint(endpoint) {
    var rec = _.omit(endpoint, 'connector', 'timeout', 'processed', 'notified', 'previousStatus');
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
            res.json(_.map(watcher.getEndpoints(), function (endpoint) {
                return prepareEndpoint(endpoint);
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
        var _self = this;
        return function (req, res, next) {
            var id = req.params.id;
            var endpoint = watcher.getEndpoint(id);
            if (!_.isUndefined(endpoint)) {
                res.json(prepareEndpoint(endpoint));
            } else {
                _self._unknownEndpointError(id, next);
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
            watcher.addEndpoint(req.body, true, function (err, endpoint) {
                if (!err) {
                    res.json({
                        id: endpoint.id,
                        uri: '/endpoints/' + id,
                        status: endpoint.status
                    });
                } else {
                    err.status = 422;
                    next(err);
                }
            });
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
        var _self = this;
        return function (req, res, next) {
            var id = req.params.id;
            watcher.removeEndpoint(id, function(err, id) {
                if (!err) {
                    res.json({id: id});
                } else {
                    _self._unknownEndpointError(id, next);
                }
            });
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
            _self._changeEndpointActivationState(watcher, req, res, true, next);
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
            _self._changeEndpointActivationState(watcher, req, res, false, next);
        };
    },

    _changeEndpointActivationState: function _changeEndpointActivationState(watcher, req, res, active, next) {
        var _self = this;
        var id = req.params.id;
        watcher.setEndpointActivationState(id, active, function(err, endpoint) {
            if (!err) {
                res.json({
                    id: endpoint.id,
                    active: endpoint.active,
                    status: endpoint.status
                });
            } else {
                _self._unknownEndpointError(id, next);
            }
        });
    },

    _unknownEndpointError: function _unknownEndpointError(id, next) {
        next({
            status: 422,
            message: 'Unknown endpoint \'' + id + '\''
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
            _self._changeEndpointNotificationState(watcher, req, res, true, next);
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
            _self._changeEndpointNotificationState(watcher, req, res, false, next);
        };
    },

    _changeEndpointNotificationState: function _changeEndpointNotificationState(watcher, req, res, notify, next) {
        var _self = this;
        var id = req.params.id;
        watcher.notifyOnErroneousStatus(id, notify, function(err, endpoint) {
            if (!err) {
                res.json({
                    id: endpoint.id,
                    notify: endpoint.notify
                });
            } else {
                _self._unknownEndpointError(id, next);
            }
        });
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
