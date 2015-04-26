/**
 * Created by jpsoroulas.
 */
/**
 * ###Overview
 * Provides the connectors. A connector is responsible for connecting, communicating
 * and determining the service status using the __{{#crossLink "StatusResolver"}}{{/crossLink}}__
 * along with the appropriate __{{#crossLink "ResolutionStrategy"}}{{/crossLink}}__.
 * Each connector handles a specific type of communication type with an _endpoint_. Specifically, the
 * __{{#crossLink "SocketConnector"}}{{/crossLink}}__ enables communication via raw socket
 * (the data is transmitted as utf-8 encoded string) whereas the
 * __{{#crossLink "HttpConnector"}}{{/crossLink}}__ enables communication via http(s) protocol.
 * An endpoint is actually an access point to the service. A service could have
 * many access points, each of them is handled by one connector.
 * Although the service status resolution is performed by the underline
 * __{{#crossLink "ResolutionStrategy"}}{{/crossLink}}__, as mentioned above, there are cases where
 * it is the connector itself that makes this decision. These cases can be summarized as follows:
 *
 * For the __{{#crossLink "HttpConnector"}}{{/crossLink}}__
 *
 * Http response status code   |status
 * :---------------------------|:-----------
 * 404                         |__{{#crossLink "ServiceStatus/down:property"}}{{/crossLink}}__
 * 500                         |__{{#crossLink "ServiceStatus/down:property"}}{{/crossLink}}__
 * 302                         |__{{#crossLink "ServiceStatus/undetermined:property"}}{{/crossLink}}__
 * 4xx (except of 404)         |__{{#crossLink "ServiceStatus/undetermined:property"}}{{/crossLink}}__
 * 5xx (except of 500)         |__{{#crossLink "ServiceStatus/undetermined:property"}}{{/crossLink}}__
 *
 *
 * connection events|error|status
 * :----------------|:----|------
 * __on error__|e.g. ECONNREFUSED, ENOTFOUND|__{{#crossLink "ServiceStatus/unreachable:property"}}{{/crossLink}}__
 * __on timeout__|no response is taken for specific period of time|__{{#crossLink "ServiceStatus/unreachable:property"}}{{/crossLink}}__ (if resolver's last attempt to determine the status fails)
 *
 * For the __{{#crossLink "SocketConnector"}}{{/crossLink}}__
 *
 * connection events|error|status
 * :----------------|:----|------
 * __on error__|e.g. EHOSTUNREACH, ENOTFOUND|__{{#crossLink "ServiceStatus/unreachable:property"}}{{/crossLink}}__
 * __on timeout__|no response is taken for specific period of time|__{{#crossLink "ServiceStatus/unreachable:property"}}{{/crossLink}}__ (if resolver's last attempt to determine the status fails)
 * __on end event__|remote host closes the connection|__{{#crossLink "ServiceStatus/undetermined:property"}}{{/crossLink}}__ (if resolver's last attempt to determine the status fails)
 *
 * ###Configuration
 * The connector's configuration is described below (note that properties in _[]_ are optional. when not set,
 * the default values are used - those in parentheses.):
 *
 *
 * * For the __{{#crossLink "SocketConnector"}}{{/crossLink}}__
 *  * [__port__] (9999), the service socket connection port.
 *  * [__host__] ('localhost'), the service host.
 *  * [__timeout__] (5000), the socket timeout, at ms.
 *  * [__resolutionStrategy__] (__{{#crossLink "OnConnectionResolution"}}{{/crossLink}}__),
 *  the applied resolution strategy.
 *
 *
 * * For the __{{#crossLink "HttpConnector"}}{{/crossLink}}__
 *  * [__url__] (http://localhost:8080), the service endpoint url.
 *  * [__timeout__] (5000 ms), the http(s) request timeout, at ms.
 *  * [__resolutionStrategy__] (__{{#crossLink "ResolutionStrategy"}}{{/crossLink}}__),
 *  the applied resolution strategy.
 *
 * ###Exported objects
 * * __{{#crossLink "SocketConnectorFactory"}}{{/crossLink}}__
 * * __{{#crossLink "HttpConnectorFactory"}}{{/crossLink}}__
 *
 * ###API Usage samples
 *    ```javascript
 * // socketConnectorFactory
 * var connectors = require('connectors');
 * var socketConnectorFactory = connectors.socketConnectorFactory;
 * var aResolutionStrategy = ...; //custom resolution strategy
 * var connector = socketConnectorFactory.create({
 *       host: '11.222.333.444',
 *       port: 55555,
 *       timeout: 2000,
 *       // if the property is not set, the default onConnectionResolution strategy is used.
 *       resolutionStrategy: aResolutionStrategy
 *   });
 * connector.addStatusResolvedListener(function onResolve(status) {
 *        logger.debug('Resolution callback is called');
 *  });
 * connector.start();
 *    ```
 *
 *    ```javascript
 * // httpConnectorFactory
 * var connectors = require('connectors').connectors;
 * var httpConnectorFactory = connectors.httpConnectorFactory;
 * var connector = httpConnectorFactory.create(({
 *      url: 'http://11.222.333.444:8080/',
 *      timeout: 3000
 * }));
 * connector.start();
 *    ```
 *
 * @module connectors
 */
'use strict';
//added to ignore invalid and self-signed ssl certificate in https request
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var net = require('net');
var http = require('http');
var https = require('https');
var events = require('events');
var _ = require('underscore');
var s = require('underscore.string');
var stampit = require('stampit');

var resolvers = require('./resolvers');
var constants = require('./constants');
var logger = require('./logger');
var utils = require('./utils');

var eventDispatcher = utils.eventDispatcher;
var onConnectionResolutionFactory = resolvers.onConnectionResolutionFactory;
var statusResolverFactory = resolvers.statusResolverFactory;
var down = constants.serviceStatus.down;
var unreachable = constants.serviceStatus.unreachable;
var undetermined = constants.serviceStatus.undetermined;
var resolvedEv = constants.resolverEvents.resolved;
var errorEv = constants.streamEvents.error;
var dataEv = constants.streamEvents.data;
var endEv = constants.streamEvents.end;
var closeEv = constants.streamEvents.close;

var abstractConnector, socketConnector, socketConnectorFactory, httpConnector, httpConnectorFactory;

/**
 * This class implements some common functionality for all connectors.
 *
 * @extends EventDispatcher
 * @class AbstractConnector
 */
abstractConnector = stampit.compose(eventDispatcher, stampit().state({
    options: void 0,
    resolver: void 0,
    emitter: void 0
}).enclose(function () {
    // add a listener that stops this connector when the status is resolved
    var _self = this;
    _self.addStatusResolvedListener(function (listener, status) {
        _self.stop();
    });
}).methods({
    /**
     * Registers the specified listener to receive the
     * __{{#crossLink "ResolverEvents/resolved:property"}}{{/crossLink}}__ event.
     *
     * @method addStatusResolvedListener
     * @param {Function} listener the listener.
     */
    addStatusResolvedListener: function addStatusResolvedListener(listener) {
        this.resolver.on(resolvedEv, listener);
    },

    /**
     * Removes the registered listeners for
     * __{{#crossLink "ResolverEvents/resolved:property"}}{{/crossLink}}__ event.
     *
     * @method removeStatusResolvedListeners
     */
    removeStatusResolvedListeners: function removeStatusResolvedListeners() {
        this.resolver.removeAllListeners(resolvedEv);
    },

    /**
     * Resets the connector state.
     *
     * @private
     * @method _reset
     */
    _reset: function _reset() {
        this.resolver.reset();
    },

    /**
     * Starts the connector.
     * This method should be implemented by the subclasses.
     *
     * @method start
     */
    start: function start() {
        throw 'abstractServiceHandler, start method: implementation needed';
    },

    /**
     * Stops the connector.
     * This method should be implemented by the subclasses.
     *
     * @method stop
     */
    stop: function stop() {
        throw 'abstractServiceHandler, stop method: implementation needed';
    }
}));


/**
 * This connector is used to enable communication with the service via raw socket.
 * Note that the data is transmitted as string utf-8 encoded.
 *
 * @extends AbstractConnector
 * @class SocketConnector
 */
socketConnector = stampit.compose(abstractConnector, stampit().methods({
    /**
     * Starts the connector.
     *
     * @method start
     */
    start: function start() {
        var options = this.options, _established = false;
        var resolver = this.resolver;
        // Reset the state
        this._reset();

        var client = this.client = net.connect(options, function () {
            _established = true;
            logger.debug('Connection established for host: ' + options.host + ' at port: ' + options.port);
            resolver.consumeAndResolve(client);
        });

        /* Data, in Node.js, is transmitted as a buffer or a string. It is emitted as a buffer by default,
         but if you set the socket.setEncoding() function, you will see that the data are
         transmitted as a string. We could also sent data via the Socket.write() method,
         which defaults to sending the data with UTF-8 encoding. */
        client.setEncoding('utf8');

        // Listener on data received
        client.on(dataEv, function (chunk) {
            // Collect the data and try to resolve
            resolver.consumeAndResolve(client, chunk);
        });

        // Listener on error
        client.on(errorEv, function (err) {
            // This means that the service is unreachable
            // possible errors: EHOSTUNREACH, ENOTFOUND
            logger.error('Connection Error: ' + err.message);
            resolver.resolved(unreachable);
        });

        /* This version of setTimeout() takes a timeout in milliseconds as its first argument.
         If the socket is idle for this amount of time, a timeout event is emitted. A one-time timeout event
         handler can optionally be passed as the second argument to setTimeout(). A timeout event does not
         close the socket; you are responsible for closing it using end() or destroy().*/
        client.setTimeout(options.timeout, function () {
            /* This means that the service may be reachable, but no response is taken
             for the specific period of time */
            logger.warn('Timeout elapsed: ' + options.timeout + ', closing the connection...');
            if (_established) {
                resolver.resolved();
            } else {
                resolver.resolved(unreachable);
            }
            // The end() method invocation does not close the connection
            //client.destroy(); this method is now called by the resolved callback proxy
        });

        /* When the remote host calls end() or destroy(), the local side emits an end event. If the socket was
         created with the allowHalfOpen option set to false (the default), the local side writes out any pending
         data and closes its side of the connection as well. However, if allowHalfOpen is true, the local
         side must explicitly call end() or destroy(). */
        client.on(endEv, function () {
            logger.info('The remote host has closed the connection.');
            // a socket is closed using the end() method.
            // Not need if allowHalfOpen option is to false (the default value)
            resolver.resolved();
            client.end(); // not needed in this case
        });

        /* Once both sides of the connection are closed, a close event is emitted. If a close event handler
         is present, it accepts a single Boolean argument, which is true if the socket had any transmission errors,
         or false otherwise.*/
        client.on(closeEv, function (error) {
            //the error is true when the port is closed
            //the error is false when the host is unreachable
            logger.debug('Connection is closed.');
        });
    },

    /**
     * Stops the connector.
     *
     * @method stop
     */
    stop: function stop() {
        logger.debug('Stopping handler...');
        this.client.destroy();
    }
}));

/**
 * SocketConnector factory.
 * @class SocketConnectorFactory
 * @static
 */
socketConnectorFactory = {
    /**
     * Creates a SocketConnector instance.
     * @static
     * @method create
     * @param {Object} options the SocketConnector configuration.
     * The configuration properties are (the parenthesis contains the default values):
     * * __port__ (9999), the service socket connection port
     * * __host__ ('localhost'), the service host
     * * __timeout__ (5000), the socket timeout, at ms
     * * __resolutionStrategy__ (__{{#crossLink "OnConnectionResolution"}}{{/crossLink}}__), the applied resolution strategy
     * @return {SocketConnector} the SocketConnector instance.
     */
    create: function create(options) {
        var _options = {
            port: 9999,
            host: 'localhost',
            timeout: 5000,
            resolutionStrategy: onConnectionResolutionFactory.create()
        };
        options = options || {};
        _.defaults(options, _options);
        var resolver = statusResolverFactory.create(options.resolutionStrategy);
        return socketConnector.create({
            // do not forget to create a new event emitter, stampit makes a shallow copy of state
            emitter: new events.EventEmitter(),
            options: options,
            resolver: resolver
        });
    }
};

/**
 * This connector is used to enable communication with the service via http(s) protocol.
 * @extends AbstractConnector
 * @class HttpConnector
 */
httpConnector = stampit.compose(abstractConnector, stampit().methods({
    /**
     * Starts the connector.
     *
     * @method start
     */
    start: function start() {
        var options = this.options, _established = false,
            failedStatusCode = [404, 500], redirectStatus = 302;

        var resolver = this.resolver;
        var url = options.url;
        // Find the protocol
        var protocol = http;
        if ('https' === url.split(':')[0]) {
            protocol = https;
        }
        // Reset the state
        this._reset();

        var request = this.request = protocol.get(url, function (response) {
            response.setEncoding('utf8');
            var statusCode = response.statusCode;
            logger.debug('Receiving response from: ' + url + ' with http status code: ' + statusCode);

            // Check the http status code and resolved the service status if possible
            if (_.contains(failedStatusCode, statusCode)) {
                resolver.resolved(down);
            } else if (s.startsWith(statusCode, '4') || s.startsWith(statusCode, '5') ||
                redirectStatus === statusCode) {
                resolver.resolved(undetermined);
            }

            // listener on data received
            response.on(dataEv, function (chunk) {
                logger.debug('Receiving data from: ' + url);
                _established = true;
                resolver.consumeAndResolve(request, chunk);
            });

            // listener on response completed
            response.on(endEv, function () {
                logger.debug('Connection is closed.');
                resolver.resolved();
            });
        });

        // listener on http request timeout
        request.setTimeout(options.timeout, function () {
            /* This means that the service may be reachable, but no response is taken
             for the specific period of time */
            logger.warn('Timeout elapsed: ' + options.timeout + ', aborting request...');
            if (_established) {
                resolver.resolved();
            } else {
                resolver.resolved(unreachable);
            }
        });

        request.on(errorEv, function (err) {
            // possible errors: ECONNREFUSED, ENOTFOUND
            logger.error('Connection error: ' + err.message);
            resolver.resolved(unreachable);
        });
    },

    /**
     * Stops the connector.
     *
     * @method stop
     */
    stop: function stop() {
        logger.debug('Stopping handler...');
        this.request.abort();
    }
}));


/**
 * HttpConnector factory.
 * @class HttpConnectorFactory
 * @static
 */
httpConnectorFactory = {
    /**
     * Creates a HttpConnector instance.
     * @static
     * @method create
     * @param {Object} options the HttpConnector configuration.
     * The configuration properties are (note that properties in _[]_ are optional. when not set, the default values
     * are used - those in parentheses.):
     * * [__url__] (http://localhost:8080), the service endpoint url.
     * * [__timeout__] (5000 ms), the http(s) request timeout, at ms.
     * * [__resolutionStrategy__] (__{{#crossLink "ResolutionStrategy"}}{{/crossLink}}__),
     * the applied resolution strategy.
     * @return {HttpConnector} the HttpConnector instance.
     */
    create: function create(options) {
        var _options = {
            url: 'http://localhost:8080',
            timeout: 5000,
            resolutionStrategy: void 0
        };
        options = options || {};
        _.defaults(options, _options);
        var resolver = statusResolverFactory.create(options.resolutionStrategy);
        return httpConnector.create({
            // do not forget to create a new event emitter, stampit makes a shallow copy of state
            emitter: new events.EventEmitter(),
            options: options,
            resolver: resolver
        });
    }
};


/**
 * Exported module object
 */
module.exports = {
    socketConnectorFactory: socketConnectorFactory,
    httpConnectorFactory: httpConnectorFactory
};