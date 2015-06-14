/**
 * Created by jpsoroulas.
 */
// An example of creating socket connector with custom resolution strategy
'use strict';
var connectors = require('../src/connectors');
var resolvers = require('../src/resolvers');
var constants = require('../src/constants');

var up = constants.serviceStatus.up;
var socketConnectorFactory = connectors.socketConnectorFactory;

// Create a custom resolution strategy
// An even simpler strategy than the default implementation (no data state is kept)
var resolutionStrategy = {
    reset: function reset() {
        // It is ok, do nothing since there is no state
    },
    resolveOnConnection: function resolveOnConnection(connection) {
        // For 'socket' connector, resolve the status as 'up' on connection
        // Note that this method is applied only for 'socket' connector
        return up;
    },
    resolveOnConversation: function resolveOnConversation(connection, chunk) {
        // For a 'socket' connector, in this implementation, this method is not invoked,
        // since the resolution is performed at 'resolveOnConnection' method.
        // For a 'http' connector, in this implementation, any received data means that the service is up
        return up;
    },
    resolveNow: function resolveNow(connection) {
        // In this implementation, return always undefined
    }
};

// Create a 'socket' connector with a custom resolution strategy
var connector = socketConnectorFactory.create({
    host: 'nodejs.org',
    port: 80,
    timeout: 2000,
    // If the property is not set, the default onConnectionResolution strategy is used.
    resolutionStrategy: resolutionStrategy
});

// Add a status resolved listener (for demonstration purposes)
connector.addStatusResolvedListener(function onResolve(status) {
    console.log('Resolution callback is called');
});

// Start the connector
connector.start();