/**
 * Created by jpsoroulas.
 */
/**
 * ###Overview
 * This is the main application module. It provides the factory method for creating an application,
 * the so called __watcher.js__, that can be used to monitor service status.
 * The application architecture is very simple. At regular intervals (_service communication interval_),
 * service specific defined messages, either as http requests or as raw data to sockets (depending on the
 * communication type of the service endpoint), are send to the monitored services, or to be more precise are send
 * to the service endpoints (or simply endpoints), to find out their status (the _service_ and  endpoint_ notation
 * is used interchangeably, but there is a conceptual difference between them which will be discussed shortly).
 * On the service status resolution, the status is stored internally and is made available either programmatically or
 * via http requests (aka the _status requests_).
 * Actually, __the entire application API is also exposed as REST API__, which, on top of this, a simple but handy
 * __web gui__ is implemented. For the REST API implementation the [express](http://expressjs.com) web framework is used.
 * The REST interface description with references to the respective application API can be found at
 * __{{#crossLinkModule "watcher-http"}}{{/crossLinkModule}}__.
 *
 *
 * ###Configuration
 * The application configuration requires two kinds of data, as shown below. The one that refers to the
 * express framework that implements the application http interface, and the other that refers to the service
 * endpoints. Note that properties in _[]_ are optional. when not set, the default values are used - those in parentheses.
 *
 *
 * * Embedded http server configuration and service communication interval
 *  * [__host__] ('localhost'), the http server host name.
 *  * [__port__] (7777), the http server port.
 *  * [__interval__] (10000 ms), the regular interval, at ms, that the application attempts to establish
 *  communication with the services to resolve their status (_service communication interval_).
 *  * [__routeExts__], an array of user defined route extensions for building custom responses for the status requests.
 *  A route extension should be a function that accepts the __{{#crossLink "Watcher/_registry:property"}}{{/crossLink}}__
 *  as parameter and return a function that conforms to [express route](http://expressjs.com/guide/routing.html) conventions
 *  (a function with parameters: _req_, _res_, _next_, as shown at the examples)
 *  * [__resolutionStrategies__], an array of objects (aka unbound resolution strategy descriptor), each of them holds the
 *  information for an _unbound resolution strategy_ (__{{#crossLinkModule "resolvers"}}{{/crossLinkModule}}__) to be registered
 *  at the system. These strategies are not bound to any endpoint, but they can be associated with them by setting the
 *  respective strategy id at the endpoint's _resolutionStrategy_ configuration property (see at endpoint configuration below).
 *  The descriptor is an object as follows:
 *  ```
 *  {
 *      id: <the resolution strategy id>, (should be unique)
 *      desc: <the resolution strategy description>
 *      implementation: <the implementation of resolution strategy> (see at resolvers to see the interface)
 *  }
 *  ```
 *  * [__nfOpts__], the notification options. Holds the information of the sender and the email addresses
 *  to receive email when erroneous service status occurs. The default sender is _admin@watcherjs.com_
 *  (if needed, configure your email account to not filter this sender as a spam). The object structure is:
 *  ```
 *  {
 *      sender: <the sender>, // default value: admin@watcherjs.com
 *      recipients: [<recipient1>, <recipient1>, ...] // the array of recipients email
 *  }
 *  ```
 *  * [__exportDir__] (_<`project directory`>/storage/_), the storage directory of dynamically created endpoints.
 *
 *
 * * Endpoint
 *  * __id__, the unique endpoint/service id. This _id_ is used for the service identification when a service request is made.
 *  * __type__, the endpoint type, the type determines whether the message
 *  exchange is performed via http requests or directly with the socket. It actually dictates the underline
 *  connector used for the specific service (see also at __{{#crossLinkModule "connectors"}}{{/crossLinkModule}}__).
 *  The permitted values are: __'socket'__ and __'http'__ for __{{#crossLink "SocketConnector"}}{{/crossLink}}__
 *  and __{{#crossLink "HttpConnector"}}{{/crossLink}}__ respectively.
 *  * [__desc__] (__id__), the endpoint description.
 *  * [__host__] (localhost), the endpoint hostname when a __{{#crossLink "SocketConnector"}}{{/crossLink}}__ is used.
 *  * [__port__] (9999), the endpoint port when a __{{#crossLink "SocketConnector"}}{{/crossLink}}__ is used.
 *  * [__url__] (http://localhost:8080), the endpoint url when __{{#crossLink "HttpConnector"}}{{/crossLink}}__ is used.
 *  * [__timeout__] (5000), the applied connector's connection timeout (see also at
 *  __{{#crossLink "SocketConnectorFactory/create:method"}}{{/crossLink}}__ and
 *  __{{#crossLink "HttpConnectorFactory/create:method"}}{{/crossLink}}__).
 *  * [__resolutionStrategy__] (__{{#crossLink "OnConnectionResolution"}}{{/crossLink}}__) the applied resolution strategy.
 *  This property can hold either an implementation of a resolution strategy or the id of the an unbound strategy.
 *  * [__active__] (true), used to indicate whether or not the endpoint should be activated
 *  (enables or suspends the communication between the respective connector and the endpoint).
 *  * [__notify__] (false), used to indicate whether or not to receive email notifications for erroneous service status.
 *
 *
 * The _endpoint_ notation is used to emphases that the _service_ can be proxied by another service (_the proxy_) which
 * is that determines the status of the proxied service. In this case, the endpoint belongs to the proxy and not to the
 * monitored service.
 *
 *
 * ###Exported objects
 * * __{{#crossLink "WatcherFactory"}}{{/crossLink}}__
 *
 *
 * ###API Usage samples
 * __Service with route extension and resolution strategy registration__
 *    ```javascript
 * // Here is the configuration of three endpoints. Two of them are accessed via sockets and refer to the services
 * // 'service-1' and 'service-2' hosted at '11.222.333.444' and '11.222.333.555' respectively, whereas the other is
 * // accessed via http and refers to the service 'service-3' that is also hosted at '11.222.333.555' (note that we use
 * // the notation _service_ since the _endpoint_ and the _service_ is the same component).
 * // Fix the module paths
 * var watcher = require('watcher');
 * var constants = require('constants');
 * var resolvers = require('resolvers');
 *
 * var down = constants.serviceStatus.down;
 * var watcherFactory = watcher.watcherFactory;
 * var onConnectionResolutionFactory = resolvers.onConnectionResolutionFactory;
 *
 * var alwaysDownStrategy = {
 *       reset: function reset() {},
 *       resolveOnConnection: function resolveOnConnection(connection) {
 *          //mark as down only for demonstration purposes
 *           return down;
 *       },
 *       resolveOnConversation: function resolveOnConnection(connection) {},
 *       resolveNow: function resolveOnConnection(connection) {}
 *   };
 *
 * var options = {
 *     port: 7777,
 *     interval: 15000,
 *    routeExts: [{
 *          path: '/custom-route',
 *          route: function service(registry) {
 *              return function (req, res, next) {
 *                  var id = req.query.id;
 *                  var endpoint = registry[id];
 *                  if (endpoint) {
 *                      res.send('Service status: ' + endpoint.status);
 *                  } else {
 *                      res.send('Unknown service: ' + id);
 *                  }
 *              };
 *          }
 *      }],
 *     resolutionStrategies: [
 *           {// Actually the default implementation, added for demonstration purposes
 *               id: 'on-connection',
 *               desc: 'resolution on connection',
 *               implementation: onConnectionResolutionFactory.create()
 *           },
 *           {
 *               id: 'always-down',
 *               desc: 'always down',
 *               implementation: alwaysDownStrategy
 *           }
 *       ],
 *     nfOpts: {
 *          recipients: ['foo@foo.com']
 *      },
 *     endpoints: [
 *          {
 *              id: 'service-1',
 *              desc: 'service 1',
 *              type: 'socket',
 *              host: '11.222.333.444',
 *              port: 1234,
 *              // Apply an implementation of resolution strategy
 *              resolutionStrategy: alwaysDownStrategy,
 *              active: true,
 *              notify: true
 *          },
 *          {
 *              id: 'service-2',
 *              desc: 'service 2',
 *              type: 'socket',
 *              host: '11.222.333.555',
 *              port: 1234,
 *              // Apply the unbound resolution strategy with id 'on-connection'
 *              resolutionStrategy: 'on-connection',
 *              active: true,
 *              notify: true
 *          },
 *          {
 *              id: 'service-3',
 *              desc: 'service 3',
 *              type: 'http',
 *              timeout: 3000,
 *              // The query string could be anything
 *              url: 'http://11.222.333.555:3333/?get-status',
 *              active: true,
 *              notify: true
 *          }
 *      ]
 *  };
 * watcherFactory.create(options).start();
 *
 * After starting the watcher the following status requests could be made in order to
 * retrieve the status for the services with id 'service-1', 'service-2' and 'service-3' respectively
 * http://localhost:7777/endpoints/service-1
 * http://localhost:7777/endpoints/service-2
 * http://localhost:7777/endpoints/service-3
 * Whereas the request http://localhost:7777/custom-route?id=service-1
 * is the user defined route which returns: 'Service status: <status>' where status
 * the status of the 'service-1'.
 *    ```
 * __Proxied services__
 *    ```javascript
 * // Proxied services
 * // Here is the case where a proxy controls the status of two service (e.g. _proxied-service-1_
 * // and _proxied-service-2_). The proxy is hosted at '11.222.333.444' and can be accessed via http.
 * // Two http endpoints at the proxy are created, the 'endpoint-1' and 'endpoint-2' each one of them
 * // is connected with the respective monitored proxied services (note that we use the notation _endpoint_ since
 * // the _endpoint_ is not the monitored _service_).
 *
 * // Fix the module paths
 * var watcherFactory = require('watcher').watcherFactory;
 * var options = {
 *     port: 7777,
 *     interval: 15000,
 *     endpoints: [
 *          {
 *              id: 'endpoint-1',
 *              type: 'http',
 *              timeout: 3000,
 *              // request to the proxied service 'proxied-service-1', the query string could be anything
 *              url: 'http://11.222.333.444:3333/?get-status-for=proxied-service-1'
 *          },
 *          {
 *              id: 'endpoint-2',
 *              type: 'http',
 *              timeout: 3000,
 *              // request to the proxied service 'proxied-service-2', the query string could be anything
 *              url: 'http://11.222.333.444:3333/?get-status-for=proxied-service-2'
 *          }
 *      ]
 *  };
 * watcherFactory.create(options).start();
 *
 * After starting the watcher the following status requests could be made in order to
 * retrieve the status for 'proxied-service-1' and 'proxied-service-2' respectively
 * http://localhost:7777/endpoints/endpoint-1
 * http://localhost:7777/endpoints/endpoint-2
 *    ```
 *
 * __Add and remove endpoints dynamically__
 *    ```javascript
 * // Here is an example for dynamically adding and removing endpoints
 *
 * // Fix the module paths
 * var watcherFactory = require('watcher').watcherFactory;
 * var options = {
 *     port: 7777,
 *     interval: 15000,
 *     endpoints: [
 *          {
 *              id: 'service-1',
 *              type: 'socket',
 *              host: '11.222.333.444',
 *              port: 1234
 *          }
 *      ]
 *  };
 * var watcher = watcherFactory.create(options).start();
 *
 * // Add the endpoint 'service-2'
 * setTimeout(function() {
 *        watcher.addEndpoint({
 *          id: 'service-2',
 *          type: 'http',
 *          timeout: 3000,
 *          url: 'http://11.222.333.555:3333/?get-status'
 *      }, false, function() {
 *            if (!_.isEmpty(errors)) {
 *               throw new Error('validation error...');
 *           }
 *      });
 * }, 6000);
 *
 * // Deactivate the endpoint 'service-2'
 * setTimeout(function () {
 *      watcher.setEndpointActivationState('service-2', false);
 * }, 12000);
 *
 * // Activate the endpoint 'service-2'
 * setTimeout(function () {
 *        watcher.setEndpointActivationState('service-2', true);
 *   }, 30000);
 *
 * // Remove the endpoint 'service-2'
 * setTimeout(function() {
 *       watcher.removeEndpoint('service-2');
 * }, 60000);
 *
 * // Shutdown the application
 * setTimeout(function () {
 *      watcher.stop();
 * }, 120000);
 *
 *    ```
 *
 * @module watcher
 */
'use strict';
var fs = require('fs-extra');
var events = require('events');
var path = require('path');
var stampit = require('stampit');
var _ = require('underscore');
var async = require('async');
var asyncTimeout = require('async-timeout');
var moment = require('moment');
var nodemailer = require('nodemailer');
var directTransport = require('nodemailer-direct-transport');
//var http = require('http');
//var query = require('connect-query');
//var fs = require('fs');
//var connect = require('connect');
//var s = require('underscore.string');

var logger = require('./logger');
var validator = require('./validator');
var constants = require('./constants');
var connectors = require('./connectors');
var httpServerFactory = require('./http-server');
var db = require('./database');
//var utils = require('./utils');

var up = constants.serviceStatus.up;
var socketConnectorFactory = connectors.socketConnectorFactory;
var httpConnectorFactory = connectors.httpConnectorFactory;
var undetermined = constants.serviceStatus.undetermined;
var watcherConfigured = constants.watcherEvents.watcherConfigured;
var watcherReady = constants.watcherEvents.watcherReady;
var socketConnectorType = constants.connectorType.socket;
var httpConnectorType = constants.connectorType.http;

var watcher, watcherFactory;

function createConnector(endpoint) {
    var connector, type = endpoint.type;
    switch (type) {
        case socketConnectorType:
            connector = socketConnectorFactory.create(endpoint);
            break;
        case httpConnectorType:
            connector = httpConnectorFactory.create(endpoint);
            break;
        default:
            throw new Error('Can not create connector type: ' + type);
    }
    return connector;
}

/**
 * The application that can be used to monitor your services status.
 * An application overview and detailed configuration instructions and examples can be found at
 * __{{#crossLinkModule "watcher"}}{{/crossLinkModule}}__
 *
 * @class Watcher
 */
watcher = stampit().state({
    options: void 0,
    emitter: void 0
}).enclose(function () {
    // listen for terminal signal e.g. kill
    process.on('SIGTERM', _.bind(this.stop, this));

    // listen for interrupt signal e.g. Ctrl-C
    process.on('SIGINT', _.bind(this.stop, this));
    /**
     * Holds the registered endpoints.
     *
     * @private
     * @property _registry
     * @type Object
     */
    this._registry = {};

    this._transporter = nodemailer.createTransport(directTransport({}));

    this._passive = false;
}).methods({
        /**
         * Registers an endpoint.
         *
         * @private
         * @method _registerEndpoint
         * @param {Object} config the endpoint configuration.
         * @return the endpoint.
         */
        _registerEndpoint: function _registerEndpoint(config) {
            var now = moment.utc();
            var _endpoint = {
                status: undetermined,
                timestamp: now,
                since: now,
                processed: false,
                active: true,
                notify: false
            };
            config = _.clone(config);
            var connector = createConnector(config);
            var endpoint = _.omit(_.defaults(config, _endpoint), 'resolutionStrategy');
            var id = endpoint.id;
            endpoint.desc = endpoint.desc || id;
            endpoint.connector = connector;
            // Register status resolved listener
            var listener = _.bind(_.partial(this._onStatusResolve, endpoint), this);
            connector.addStatusResolvedListener(listener);

            this._registry[id] = endpoint;
            logger.debug('New endpoint registered: ' + id);
            return endpoint;
        },

        /**
         * Sends notification email if erroneous service status occurs.
         *
         * @private
         * @method _notify
         */
        _notify: function _notify() {
            var toBeNotified;
            var sender = this.options.nfOpts.sender;
            var recipients = this.options.nfOpts.recipients;
            if (!_.isEmpty(recipients)) {
                toBeNotified = _.filter(this._registry, function (endpoint) {
                    var status = endpoint.status;
                    if (endpoint.active && up !== status && undetermined !== status) {
                        if (endpoint.notify && (status !== endpoint.previousStatus || !endpoint.notified)) {
                            return true;
                        }
                    } else {
                        endpoint.notified = false;
                    }
                    return false;
                });

                if (!_.isEmpty(toBeNotified)) {
                    var msg = [];
                    _.each(toBeNotified, function (endpoint) {
                        msg.push('Endpoint, \'' + endpoint.id + '\', status: ' + endpoint.status +
                        ', timestamp: ' + endpoint.timestamp.format('MMMM Do YYYY, h:mm:ss'));
                    });
                    msg = msg.join('');
                    this._transporter.sendMail({
                        from: sender,
                        to: recipients.join(','),
                        subject: 'Notification',
                        text: msg
                    }, function (error, response) {
                        if (error) {
                            logger.warn('Notification message failed: ' + error);
                        } else {
                            logger.info('Notification message send: ' + msg);
                            _.each(toBeNotified, function (endpoint) {
                                endpoint.notified = true;
                            });
                        }
                    });
                }

            }
        },

        _onStatusResolve: function _onStatusResolve(endpoint, status) {
            if (!this._stopped) {
                var now = moment.utc();
                endpoint.timestamp = now;
                if (status !== endpoint.status) {
                    endpoint.since = endpoint.timestamp;
                    //store to database
                    db.history.insert({
                        endpoint: endpoint.id,
                        timestamp: now.valueOf(),
                        status: status
                    }, function (err, docs) {
                        if (err) {
                            logger.warn('Unable to update the persistent state of \'' + endpoint.id + '\', ' + err);
                        }
                    });
                }
                endpoint.previousStatus = endpoint.status;
                endpoint.status = status;
                endpoint.processed = true;
                logger.debug('Update registry, id/status: ' + endpoint.id + '/' + status);
                if (_.every(this._registry,
                        function (endpoint) {
                            return (endpoint.processed === true);
                        })) {
                    this._notify();
                    setTimeout(_.bind(this._pollEndpoints, this), this.options.interval).unref();
                }
            }
        },

        _pollEndpoints: function _pollEndpoints() {
            var _self = this;
            if (!_self._stopped) {
                var registry = _self._registry;
                _.each(registry, function (endpoint) {
                    endpoint.processed = false;
                });
                var passive = this._passive = _.every(registry, function (endpoint) {
                    return !(endpoint.active);
                });
                if (passive) {
                    logger.debug('No active endpoints, system passivated.');
                } else {
                    logger.debug('Poll for services status...');
                    _.each(registry, function (endpoint) {
                        if (endpoint.active) {
                            endpoint.connector.start.call(endpoint.connector);
                        } else {
                            endpoint.processed = true;
                        }
                    });
                }
            }
        },

        _writeEndpointConfigToFile: function _writeEndpointConfigToFile(fileName, config, callback) {
            fs.outputJson(fileName, config, function (err) {
                if (err) {
                    logger.error('Endpoint storage \'' + config.id + '\' failed: ' + err);
                    err = 'Update endpoint configuration at storage failed (' + err.message + ')';
                }
                callback(err, config);
            });
        },

        /**
         * Activates the system again if it is passivated.
         *
         * @private
         * @method _restartIfPassive
         */
        _restartIfPassive: function _restartIfPassive() {
            if (true === this._passive) {
                logger.debug('Active endpoint found, system activated.');
                setTimeout(_.bind(this._pollEndpoints, this), 0).unref();
            }
        },

        /**
         * Stores endpoint at the persistence storage
         * (at the moment, the filesystem is used).
         *
         * @private
         * @method _persistEndpointConfig
         * @param {Object} config the endpoint configuration.
         * @param {Function} callback callback function to async write operation.
         * @throws {Error} An error when the operation can not be performed (e.g. no write permissions).
         */
        _persistEndpointConfig: function _persistEndpointConfig(config, callback) {
            var fileName = path.join(this.options.exportDir, config.id + '.json');
            config = _.clone(config);
            var strategy = config.resolutionStrategy;
            if (strategy) {
                config.resolutionStrategy = strategy.id;
            }
            this._writeEndpointConfigToFile(fileName, config, callback);
        },

        /**
         * Deletes the endpoint of the specified id from the persistence storage
         * (at the moment, the filesystem is used).
         *
         * @private
         * @method _deleteEndpoint
         * @param {String} id the endpoint id.
         * @param {Function} callback the callback(err) of the async process.
         */
        _deleteEndpoint: function _deleteEndpoint(id, callback) {
            var fileName = path.join(this.options.exportDir, id + '.json');
            fs.exists(fileName, function (exists) {
                if (exists) {
                    fs.remove(fileName, function (err) {
                        if (!err) {
                            logger.info('Endpoint \'' + id + '\' removed from storage: ' + fileName);
                        }
                        callback(err);
                    });
                } else {
                    logger.debug('Endpoint \'' + id + '\' is not persisted at local store.');
                    callback(null);
                }
            });
        },

        /**
         * Updates the endpoint of the specified id from the persistence storage
         * (at the moment, the filesystem is used).
         *
         * @private
         * @method _updateEndpointConfig
         * @param {String} id the endpoint id.
         * @param {Object} properties updated properties.
         * @param {Function} callback the callback(err, properties) of the async process.
         */
        _updateEndpointConfig: function _updateEndpointConfig(id, properties, callback) {
            var _self = this;
            var fileName = path.join(this.options.exportDir, id + '.json');
            fs.exists(fileName, function (exists) {
                if (exists) {
                    fs.readJson(fileName, function (err, config) {
                        if (!err) {
                            _.extend(config, properties);
                            _self._writeEndpointConfigToFile(fileName, config, callback);
                        } else {
                            logger.warn('Unable to update endpoint persistence state, invalid json file: ' + fileName);
                            callback(err, properties);
                        }
                    });
                } else {
                    logger.debug('Endpoint \'' + id + '\' not found at local store, not permanent changes.');
                    callback(null, properties);
                }
            });
        },

        /**
         * Stores endpoint info at persistence storage (currently, at the filesystem).
         *
         * @private
         * @method _getStoredEndpoints
         * @return {Array} the persistent endpoints.
         */
        _getStoredEndpoints: function _getStoredEndpoints() {
            var storage = this.options.exportDir;
            fs.ensureDirSync(storage);
            logger.debug('Ensuring existence of endpoints storage directory: ' + storage);
            var storedEnpoints = [];
            fs.readdirSync(storage).forEach(function (file) {
                var entry = path.join(storage, file);
                var stats = fs.statSync(entry);
                if (!stats.isDirectory()) {
                    var endpoint = fs.readJsonSync(entry, {throws: false});
                    if (!_.isNull(endpoint)) {
                        storedEnpoints.push(endpoint);
                        logger.info('Get endpoint from storage: ' + entry);
                    } else {
                        logger.warn('Unable to construct endpoint from storage, invalid json file: ' + entry);
                    }
                }
            });
            return storedEnpoints;
        },

        /**
         * Returns the endpoint with the specified id.
         *
         * @method getEndpoint
         * @param {String} id the endpoint id.
         * @return {Object} the endpoint.
         */
        getEndpoint: function getEndpoint(id) {
            return this._registry[id];
        },

        /**
         * Returns the endpoints.
         *
         * @method getEndpoints
         * @return {Array} the endpoints.
         */
        getEndpoints: function getEndpoints() {
            return _.values(this._registry);
        },

        /**
         * Adds an endpoint with the specified configuration.
         * For the configuration see at {{#crossLinkModule "watcher"}}{{/crossLinkModule}}
         *
         * @method addEndpoint
         * @param {Object} config the endpoint configuration (see at
         * __{{#crossLink "WatcherFactory/create:method"}}{{/crossLink}}__).
         * @param {Boolean} store used to indicate whether or not to store the endpoint.
         * @param {Function} callback the callback(err, endpoint) of the async process.
         */
        addEndpoint: function addEndpoint(config, store, callback) {
            callback = callback || _.noop;
            var endpoint, registry = this._registry;
            var errors = validator.validateEndpointConfig(
                config, _.keys(registry), this.options.resolutionStrategies);
            if (_.isEmpty(errors)) {
                endpoint = this._registerEndpoint(config);
                if (endpoint.active) {
                    this._restartIfPassive();
                }
                if (store) {
                    this._persistEndpointConfig(config, function (err) {
                        if (err) {
                            err = {message: err};
                        }
                        callback(err, endpoint);
                    });
                } else {
                    callback(null, endpoint);
                }
            } else {
                callback({
                    message: 'validation errors',
                    errors: errors
                }, config);
            }
        },

        /**
         * Removes the endpoint with the specified id.
         *
         * @method removeEndpoint
         * @param {String} id the endpoint id.
         * @param {Function} callback the callback(err, id) of the async process.
         */
        removeEndpoint: function removeEndpoint(id, callback) {
            callback = callback || _.noop;
            var endpoint = this.getEndpoint(id);
            if (endpoint) {
                delete this._registry[id];
                this._deleteEndpoint(id, function (err) {
                    if (err) {
                        err = {message: err};
                    }
                    callback(err, id);
                });
            }
            logger.debug('Endpoint \'' + id + '\' has been removed!');
            return endpoint;
        },

        /**
         * Activate/Deactivates the endpoint with the specified id.
         *
         * @method setEndpointActivationState
         * @param {String} id the endpoint id.
         * @param {Boolean} active true or false to activate or deactivate the specific endpoint respectively.
         * @return {Object} the endpoint or undefined if the endpoint does not exist.
         * @param {Function} callback the callback(err, endpoint) of the async process.
         */
        setEndpointActivationState: function setEndpointActivationState(id, active, callback) {
            callback = callback || _.noop;
            var endpoint = this._registry[id];
            if (endpoint) {
                var now = moment().utc();
                endpoint.active = active;
                endpoint.status = undetermined;
                endpoint.timestamp = now;
                endpoint.since = now;
                logger.debug('Endpoint ' + id + ' activation state set to: ' + active);
                if (active) {
                    this._restartIfPassive();
                }
                this._updateEndpointConfig(id, {active: active}, function (err, config) {
                    if (err) {
                        err = {message: err};
                    }
                    callback(err, endpoint);
                });
            } else {
                logger.warn('Unable to set the activation state, endpoint \'' + id + '\' does not exist.');
            }
            return endpoint;
        },

        /**
         * Enables/disables the notification on erroneous status for the endpoint with the specified id.
         *
         * @method notifyOnErroneousStatus
         * @param {String} id the endpoint id.
         * @param {Boolean} notify true or false to enable or disable the notification respectively.
         * @param {Function} callback the callback(err, endpoint) of the async process.
         */
        notifyOnErroneousStatus: function notifyOnErroneousStatus(id, notify, callback) {
            callback = callback || _.noop;
            var endpoint = this._registry[id];
            if (endpoint) {
                endpoint.notify = notify;
                logger.debug('Endpoint \'' + id + '\' notification state set to: ' + notify);
                this._updateEndpointConfig(id, {notify: notify}, function (err, config) {
                    if (err) {
                        err = {message: err};
                    }
                    callback(err, endpoint);
                });
            } else {
                logger.warn('Unable to set the notification state, endpoint \'' + id + '\' does not exist.');
            }
            return endpoint;
        },

        /**
         * Returns the registered resolution strategies.
         *
         * @method getResolutionStrategies
         * @return {Array} the strategies.
         */
        getResolutionStrategies: function getResolutionStrategies() {
            return this.options.resolutionStrategies;
        },

        /**
         * Setup the Watcher.
         *
         * @private
         * @method _setup
         */
        _setup: function _setup() {
            logger.debug('Setting up watcher engine...');
            var _self = this;
            var options = _self.options, registry = _self._registry;

            var serverValErrors = validator.validateServerConfig(options);
            if (_.isEmpty(serverValErrors)) {

                _self.server = httpServerFactory.create({
                    port: options.port,
                    host: options.host,
                    routesCallback: function routesCallback(app) {
                        var routes = require('./routes/watcher-http');
                        app.param('id', function (req, res, next, id) {
                            req.id = id;
                            next();
                        });
                        app.get('/endpoints', routes.endpoints(_self));
                        app.get('/endpoints/:id', routes.endpoint(_self));
                        app.post('/endpoints/:id', routes.addEndpoint(_self));
                        app.delete('/endpoints/:id', routes.removeEndpoint(_self));
                        app.post('/endpoints/:id/activate', routes.endpointActivate(_self));
                        app.delete('/endpoints/:id/activate', routes.endpointDeactivate(_self));
                        app.post('/endpoints/:id/notify', routes.endpointEnableNotification(_self));
                        app.delete('/endpoints/:id/notify', routes.endpointDisableNotification(_self));
                        app.get('/resolution-strategies', routes.resolutionStrategies(_self));
                        app.get('/console', function (req, res) {
                            res.render('console');
                        });

                        // put here the route extensions
                        _.each(options.routeExts, function (routeExt) {
                            app.use(routeExt.path, routeExt.route(registry));
                        });
                    }
                });

                // Retrieve stored endpoints
                var storedEnpoints = this._getStoredEndpoints();
                // Concat stored and configured endpoints
                var endpoints = options.endpoints.concat(storedEnpoints);
                // Register service endpoint
                _.each(endpoints, function (endpoint) {
                    _self.addEndpoint(endpoint, false, function (err, endpoint) {
                        if (err) {
                            logger.error('Endpoint \'' + endpoint.id + '\' registration failed: ' + err.message);
                        }
                    });
                });
                logger.info('Properties are successfully loaded: ' + JSON.stringify(options));
            } else {
                logger.error('validation errors:');
                _.each(serverValErrors, function (error) {
                    logger.error(error);
                });
                _self.stop();
            }
            _self.emitter.emit(watcherConfigured);
            return _self;
        },

        /**
         * Starts the Watcher.
         *
         * @method start
         */
        start: _.once(function start() {
            var _self = this;
            _self._stopped = false;
            _self._setup();

            var port = _self.options.port,
                host = _self.options.host,
                interval = _self.options.interval;

            _self.server.start(function () {
                _self.emitter.emit(watcherReady);
                logger.info('Watcher is up and running (host/port/interval): (' +
                host + '/' + port + '/' + interval + ')');
                setTimeout(_.bind(_self._pollEndpoints, _self), 0).unref();
            });

            return _self;
        }),

        /**
         * Stops the Watcher.
         *
         * @method stop
         */
        stop: _.once(function stop() {
            logger.info('Shutting down Watcher app...');
            var _self = this;
            _self._stopped = true;
            async.parallel([
                function (callback) {
                    //insert new entries with 'undetermined'
                    var entries = [];
                    var now = moment.utc();
                    _.each(_self.getEndpoints(), function (endpoint) {
                        if (undetermined !== endpoint.status) {
                            entries.push({
                                endpoint: endpoint.id,
                                timestamp: now.valueOf(),
                                status: undetermined
                            });
                        }
                    });
                    db.history.insert(entries, function (err, docs) {
                        callback(err);
                        db.close();
                    });
                },
                asyncTimeout(function (callback) {
                    _self.server.stop();
                }, 2000, 'Give 2 secs to shutdown http server')
            ], function (errors, results) {
                logger.info('Shutdown details: ' + errors);
                process.exit();
            });
            //process.kill(process.pid, 'SIGHUP');
        }),

        /**
         * Add listener specific events of the Watcher.
         *
         * @method addListener
         * @param {String} event the event.
         * @param {Object} listener the listener.
         */
        addListener: function addListener(event, listener) {
            this.emitter.on(event, listener);
        }

    }
);

/**
 * Watcher factory.
 * @class WatcherFactory
 * @static
 */
watcherFactory = {
    /**
     * Creates a Watcher instance.
     * @static
     * @method create
     * @param {Object} [options] the Watcher configuration.
     * Properties in _[]_ are optional. when not set, the default values are used - those in parentheses.
     * * Embedded http server configuration and service communication interval
     *  * [__host__] ('localhost'), the http server host name.
     *  * [__port__] (7777), the http server port.
     *  * [__interval__] (10000 ms), the service communication interval, at ms.
     *  * [__routeExts__], an array of user defined route extensions for building custom responses for the status requests.
     *  * [__resolutionStrategies__], an array of _unbound resolution strategy descriptors_.
     *  The descriptor is an object as follows:
     *  ```
     *  {
     *      id: <the resolution strategy id>, (should be unique)
     *      desc: <the resolution strategy description>
     *      implementation: <the implementation of resolution strategy> (see at resolvers to see the interface)
     *  }
     *  ```
     *  * [__nfOpts__], the notification options. Holds the information of the sender and the email addresses
     *  to receive email when erroneous service status occurs. The default sender is _admin@watcherjs.com_
     *  (if needed, configure your email account to not filter this sender as a spam). The object structure is:
     *  ```
     *  {
     *      sender: <the sender>, // default value: admin@watcherjs.com
     *      recipients: [<recipient1>, <recipient1>, ...] // the array of recipients email
     *  }
     *  ```
     *  * [__exportDir__] (_<`project directory`>/storage/_), the storage directory of dynamically created endpoints.
     * * Endpoint
     *  * __id__, the unique endpoint id.
     *  * __type__, the endpoint type.
     *  * [__host__] (localhost), the endpoint hostname, applied for __{{#crossLink "SocketConnector"}}{{/crossLink}}__.
     *  * [__port__] (9999), the endpoint port, applied for __{{#crossLink "SocketConnector"}}{{/crossLink}}__.
     *  * [__url__] (http://localhost:8080), the endpoint url, applied for __{{#crossLink "HttpConnector"}}{{/crossLink}}__.
     *  * [__timeout__](5000), the applied connector's connection timeout.
     *  * [__resolutionStrategy__] (__{{#crossLink "OnConnectionResolution"}}{{/crossLink}}__) the applied resolution
     *  strategy, either as an implementation of a resolution strategy or as a reference id of an unbound strategy.
     *  * [__active__] (true), whether or not the endpoint should be activated (enables or suspends
     *  the communication between the respective connector and the endpoint).
     *  * [__notify__] (false), used to indicate whether or not to receive email notifications for
     *  erroneous service status.
     *
     * More details at __{{#crossLinkModule "watcher"}}{{/crossLinkModule}}__.
     *
     * @return {Watcher} the Watcher instance.
     */
    create: function create(options) {
        var _options = {
            port: 7777,
            host: 'localhost',
            interval: 10000,
            routeExts: [],
            resolutionStrategies: [],
            nfOpts: {},
            exportDir: __dirname + '/../storage',
            endpoints: []
        };
        options = options || {};
        _.defaults(options, _options);
        options.nfOpts.sender = options.nfOpts.sender || 'admin@watcherjs.com';
        options.exportDir = path.normalize(options.exportDir);
        return watcher.create({
            options: options,
            emitter: new events.EventEmitter()
        });
    }
};

/**
 * Exported module object
 */
module.exports = {
    watcherFactory: watcherFactory
};
