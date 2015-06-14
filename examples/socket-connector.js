/**
 * Created by jpsoroulas.
 */
// An example of creating a socket connector with default resolution strategy
'use strict';
var connectors = require('../src/connectors');
var resolvers = require('../src/resolvers');
var constants = require('../src/constants');

var socketConnectorFactory = connectors.socketConnectorFactory;

// Create the connector
// Since the resolutionStrategy property is not set, the default onConnectionResolution strategy is used.
var connector = socketConnectorFactory.create({
    host: 'nodejs.org',
    port: 80,
    timeout: 2000
});

// Start the connector
connector.start();