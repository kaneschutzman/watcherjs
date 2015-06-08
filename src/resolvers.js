/**
 * Created by jpsoroulas.
 */

/**
 * ###Overview
 * Provides the status resolvers and resolution strategies.
 * The status resolver implements the context of the applying strategy for service status resolution, whereas the
 * _resolution strategy_ the strategy itself.
 * The _strategy_ is described by the following set of methods,
 * __{{#crossLink "ResolutionStrategy/resolveOnConnection:method"}}{{/crossLink}}__,
 * __{{#crossLink "ResolutionStrategy/resolveOnConversation:method"}}{{/crossLink}}__,
 * __{{#crossLink "ResolutionStrategy/resolveNow:method"}}{{/crossLink}}__ and
 * __{{#crossLink "ResolutionStrategy/reset:method"}}{{/crossLink}}__.
 * Each method is called at a specific stage of the conversation with the endpoint, and returns the outcome
 * of the service status. The outcome of the service status could be one of the following:
 * * __{{#crossLink "ServiceStatus/up:property"}}{{/crossLink}}__, when the service is up and running.
 * * __{{#crossLink "ServiceStatus/down:property"}}{{/crossLink}}__, when the service is down.
 * * __{{#crossLink "ServiceStatus/undetermined:property"}}{{/crossLink}}__, when no decision can be made.
 * * __{{#crossLink "ServiceStatus/unreachable:property"}}{{/crossLink}}__, status that is used by the connector
 * when no connection with the endpoint can be made. A default implementation is provided by the
 * __{{#crossLink "ResolutionStrategy"}}{{/crossLink}}__.
 *
 * ###Exported objects
 * * __{{#crossLink "ResolutionStrategyFactory"}}{{/crossLink}}__
 * * __{{#crossLink "StatusResolverFactory"}}{{/crossLink}}__
 * * __{{#crossLink "OnConnectionResolutionFactory"}}{{/crossLink}}__
 *
 * ###API Usage samples
 *    ```javascript
 * // statusResolverFactory with onConnectionResolutionFactory
 * var resolvers = require('resolvers');
 * var statusResolverFactory = resolvers.statusResolverFactory;
 * var onConnectionResolutionFactory = resolvers.onConnectionResolutionFactory;
 * var resolver = statusResolverFactory.create(onConnectionResolutionFactory.create());
 *    ```
 *
 *    ```javascript
 * // A custom resolver
 * // Fix the module paths
 * var constants = require('constants');
 * var resolvers = require('resolvers');
 * var up = constants.serviceStatus.up;
 * var statusResolverFactory = resolvers.statusResolverFactory;
 * // An even simpler strategy than the default implementation (no data state is kept)
 * var resolutionStrategy = {
 *      reset: function reset() {
 *           //it is ok, do nothing since there is no state
 *      },
 *      resolveOnConnection: function resolveOnConnection(connection) {
 *          //for 'socket' connector, on connection. resolve the status as up
 *          return up;
 *      },
 *      resolveOnConversation: function resolveOnConversation(connection, chunk) {
 *          //in this implementation, for 'socket' connector there is no need to do something
 *          //since the resolution is performed on connection.
 *          //For 'http' connector any received data means that the service is up
 *          return up;
 *      },
 *      resolveNow: function resolveNow(connection) {
 *          //return always undefined
 *      }
 * };
 * var resolver = statusResolverFactory.create(resolutionStrategy);
 *    ```
 * @module resolvers
 */
'use strict';
var events = require('events');
var _ = require('underscore');
var stampit = require('stampit');

var constants = require('./constants');
var logger = require('./logger');
var utils = require('./utils');

var eventDispatcher = utils.eventDispatcher;
var up = constants.serviceStatus.up;
var undetermined = constants.serviceStatus.undetermined;
var resolvedEv = constants.resolverEvents.resolved;

var resolutionStrategy, resolutionStrategyFactory, statusResolver, statusResolverFactory,
    onConnectionResolution, onConnectionResolutionFactory;


/**
 * A resolution strategy implements *the strategy* for resolving the status of a service.
 * Each strategy should implement the following methods:
 * __{{#crossLink "ResolutionStrategy/resolveOnConnection:method"}}{{/crossLink}}__,
 * __{{#crossLink "ResolutionStrategy/resolveOnConversation:method"}}{{/crossLink}}__,
 * __{{#crossLink "ResolutionStrategy/resolveNow:method"}}{{/crossLink}}__,
 * __{{#crossLink "ResolutionStrategy/reset:method"}}{{/crossLink}}__.
 * This is a simple default implementation.
 *
 * @class ResolutionStrategy
 */
resolutionStrategy = stampit().state({
    /**
     * Holds the data received from the service.
     *
     * @property data
     * @type Object
     */
    _data: void 0
}).methods({
    /**
     * Clears the state (the data received from the service).
     *
     * @method reset
     */
    reset: function reset() {
        this._data = void 0;
    },
    /**
     * The method is called when the connection with the service is established.
     * Note that it applies only in cases that a __SocketConnector is used__.
     * The method could potentially trigger a handshaking protocol with the service.
     * The default implementation returns undefined.
     * @method resolveOnConnection
     * @param {Object} connection the service connection.
     * @return the service status.
     */
    resolveOnConnection: function resolveOnConnection(connection) {
        // potential a handshake implementation
        // connection.write('Starting handshaking...');
        return void 0;
    },

    /**
     * The method is called when the connector receives data from the server.
     * Any data could be received after a successful connection with a service.
     * Successful connections for a HttpConnector connector type are consider all http
     * service responses with status code 2xx. Whereas for a SocketConnector when the connection
     * is established. Note that, currently, the data is transmitted as string encoded as __utf-8__.
     * This default implementation resolves the status as __*up*__ if any chunk of data is received.
     *
     * @method resolveOnConversation
     * @param {Object} connection the service connection.
     * @param {String} chunk the received chunk of data.
     * @return the service status.
     * */
    resolveOnConversation: function resolveOnConversation(connection, chunk) {
        //TODO delimiter based implementation to decide service/app status
        /* At the moment just add the chuck to the data to show a minimal data processing.
         * In a more advanced example a decoder may be needed */
        if (_.isUndefined(this._data)) {
            this._data = ''; //data initialization
        }
        logger.debug('chunk received from server...');
        this._data += chunk;
        return up;
    },

    /**
     * The method is called when the resolution strategy must determine the service status
     * immediately (for example when a connection error or a connection timeout is occurred).
     * Ordinarily, it is the last method that is get called since the strategy must end up a result.
     * At this default implementation, the service status is resolved as __*up*__ if any data
     * has been received.
     * @method resolveNow
     * @return the service status.
     * */
    resolveNow: function resolveNow() {
        logger.debug('Forcing status resolution...');
        var status = void 0;
        if (!_.isUndefined(this._data)) {
            status = up;
        }
        return status;
    }
});

/**
 * ResolutionStrategy factory.
 * @class ResolutionStrategyFactory
 * @static
 */
resolutionStrategyFactory = {
    /**
     * Creates a ResolutionStrategy instance.
     * @static
     * @method create
     * @return {ResolutionStrategy} the ResolutionStrategy instance.
     */
    create: function create() {
        return resolutionStrategy.create();
    }
};

/**
 * The status resolver provides the context and implements the logic for applying
 * and coordinating the resolution strategy for the service. This is the component
 * that connectors directly deal with.
 *
 * @class StatusResolver
 */
statusResolver = stampit.compose(eventDispatcher, stampit().state({
    /**
     * States whether the status has been resolved or not. True if it
     * resolved, otherwise false.
     *
     * @private
     * @property _resolved
     */
    _resolved: false
}).methods({
    /**
     * Resets the resolver state.
     *
     * @method reset
     */
    reset: function reset() {
        this._resolved = false;
        this.resolutionStrategy.reset();
    },

    /**
     * This method is called from the connector when a chunk of data has been received.
     * Internally, it uses the applying status resolution strategy.
     *
     * @method consumeAndResolve
     * @return {Object} the service status. If the status cannot be determined undefined is returned.
     */
    consumeAndResolve: function consumeAndResolve(connection, chunk) {
        var status = void 0;
        //This means that the methods is called on connection callback
        if (_.isUndefined(chunk)) {
            status = this.resolutionStrategy.resolveOnConnection(connection);
        } else {
            status = this.resolutionStrategy.resolveOnConversation(connection, chunk);
        }
        if (!_.isUndefined(status)) {
            this.resolved(status);
        }
        return status;
    },

    /**
     * It is the last method that is get called when the service status has been resolved. If no status is
     * specified the resolver forces resolution strategy to end up a result. This method is also called
     * by the service connectors when the service status can be resolved by them (for example when
     * the connection can not be established, the connector resolves the status as *unreachable*)
     *
     * @method resolved
     * @param {String} [status] the service status if resolved.
     */
    resolved: function resolved(status) {
        if (!this._resolved) {
            if (_.isUndefined(status)) {
                //make the decision now according to the current value of the data
                status = this.resolutionStrategy.resolveNow();
                if (_.isUndefined(status)) {
                    logger.warn('Resolver failed to determine the status');
                    status = undetermined;
                }
            }
            logger.debug('Resolved as: ' + status);
            this._resolved = true;
            this.emit(resolvedEv, status);
        }
    }
}));

/**
 * StatusResolver factory.
 * @class StatusResolverFactory
 * @static
 */
statusResolverFactory = {
    /**
     * Creates a StatusResolver instance.
     * @static
     * @method create
     * @param {ResolutionStrategy} resolutionStrategy the applied resolution strategy.
     * If no strategy is set, the default implementation is used.
     * @return {StatusResolver} the StatusResolver instance.
     */
    create: function create(resolutionStrategy) {
        resolutionStrategy = resolutionStrategy || resolutionStrategyFactory.create();
        var options = {
            resolutionStrategy: resolutionStrategy,
            emitter: new events.EventEmitter()
        };
        return statusResolver.create(options);
    }
};


/**
 * An implementation of resolution strategy that on the service connection the service status
 * is resolved as *up*.
 * @extends ResolutionStrategy
 * @class OnConnectionResolution
 **/
onConnectionResolution = stampit.compose(resolutionStrategy, stampit().methods({
        /**
         * Always returns *up*
         * @method resolveOnConnection
         * @param {Object} connection the service connection
         */
        resolveOnConnection: function resolveOnConnection(connection) {
            return up;
        }
    })
);

/**
 * OnConnectionResolution factory.
 * @class OnConnectionResolutionFactory
 * @static
 */
onConnectionResolutionFactory = {
    /**
     * Creates an OnConnectionResolution instance.
     * @static
     * @method create
     * @return {OnConnectionResolution} the OnConnectionResolution instance.
     */
    create: function create() {
        return onConnectionResolution.create();
    }
};

/**
 * Exported module object
 */
module.exports = {
    resolutionStrategyFactory: resolutionStrategyFactory,
    statusResolverFactory: statusResolverFactory,
    onConnectionResolutionFactory: onConnectionResolutionFactory
};

