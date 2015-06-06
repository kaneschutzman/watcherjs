/**
 * Created by jpsoroulas.
 */
/**
 * Holds application's constants
 *
 * @module constants
 */
'use strict';

var serviceStatus, connectorType, watcherEvents, resolverEvents, streamEvents, streamErrors;

/**
 * Service status constants.
 *
 * @class ServiceStatus
 */
serviceStatus = {
    /**
     * Indicates that the service is up and running
     *
     * @property up
     * @type String
     * @static
     * @final
     */
    up: 'up',

    /**
     * Indicates that the service down
     *
     * @property down
     * @type String
     * @static
     * @final
     */
    down: 'down',

    /**
     * Indicates that the service can not be reached
     *
     * @property unreachable
     * @type String
     * @static
     * @final
     */
    unreachable: 'unreachable',

    /**
     * Indicates that the service status can not be determined
     *
     * @property undetermined
     * @type String
     * @static
     * @final
     */
    undetermined: 'undetermined'
};

connectorType = {
    socket: 'socket',
    http: 'http'
};

watcherEvents = {
    watcherConfigured: 'watcher-configured',
    watcherReady: 'watcher-ready',
    endpointsStatusResolved: 'endpoints-status-resolved',
    wjsConnected: 'wjs-connected',
    wjsEndpointsUpdated: 'wjs-endpoints-updated'
};

/**
 * __{{#crossLink "StatusResolver"}}{{/crossLink}}__ constants.
 *
 * @class ResolverEvents
 */
resolverEvents = {
    /**
     * Event fired when the service status has been resolved.
     *
     * @property resolved
     * @type String
     * @static
     * @final
     */
    resolved: 'status-resolved'
};

streamEvents = {
    error: 'error',
    data: 'data',
    end: 'end',
    close: 'close'
};

streamErrors = {
    unreachableHost: 'ENOTFOUND',
    portNotRespond: 'EHOSTUNREACH'
};

module.exports = {
    serviceStatus: serviceStatus,
    connectorType: connectorType,
    watcherEvents: watcherEvents,
    resolverEvents: resolverEvents,
    streamEvents: streamEvents,
    streamErrors: streamErrors
};
