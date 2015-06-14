/**
 * Created by jpsoroulas.
 */
// An example of creating http connector with default resolution strategy
'use strict';
var connectors = require('../src/connectors');
var httpConnectorFactory = connectors.httpConnectorFactory;

// Create the connector
var connector = httpConnectorFactory.create(({
    url: 'https://nodejs.org/',
    timeout: 3000
}));

// Start the connector
connector.start();