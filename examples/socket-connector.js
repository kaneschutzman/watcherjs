/**
 * Created by jpsoroulas.
 */
// An example of creating socket connector
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
        //it is ok, do nothing since there is no state
    },
    resolveOnConnection: function resolveOnConnection(connection) {
        //for 'socket' connector, on connection. resolve the status as up
        return up;
    },
    resolveOnConversation: function resolveOnConversation(connection, chunk) {
        //in this implementation, for 'socket' connector there is no need to do something
        //since the resolution is performed on connection.
        //For 'http' connector any received data means that the service is up
        return up;
    },
    resolveNow: function resolveNow(connection) {
        //return always undefined
    }
};

// Create the connector
var connector = socketConnectorFactory.create({
    host: 'nodejs.org',
    port: 80,
    timeout: 2000,
    // if the property is not set, the default onConnectionResolution strategy is used.
    resolutionStrategy: resolutionStrategy
});

// Add a status resolved listener (for demonstration purposes)
connector.addStatusResolvedListener(function onResolve(status) {
    console.log('Resolution callback is called');
});

// Start the connector
connector.start();