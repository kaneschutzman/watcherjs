/**
 * Created by jpsoroulas.
 */
// An example of creating http connector with custom resolution strategy
'use strict';
var s = require('underscore.string');
var connectors = require('../src/connectors');
var httpConnectorFactory = connectors.httpConnectorFactory;
var constants = require('../src/constants');
var up = constants.serviceStatus.up;
var undetermined = constants.serviceStatus.undetermined;

// Create a custom resolution strategy. In this implementation,
// the received data chunks are stored internally and the final evaluation
// is made when the response is completed
var resolutionStrategy = {
    data: [],
    reset: function reset() {
        // Clear the state
        this.data = [];
    },
    resolveOnConnection: function resolveOnConnection(connection) {
        // This method is not applied for 'http' connector type
        return void 0;
    },
    resolveOnConversation: function resolveOnConversation(connection, chunk) {
        // Store the received data chunks
        this.data.push(chunk);
        // return undefined, to perform the evaluation when the response is completed.
        // Remind that a 'undetermined' status is a valid service status. If this method returns
        // 'undetermined', the method 'resolvedNow' will not be called since the status is considered
        // resolved as 'undetermined' by the method 'resolveOnConversation'.
        return void 0;
    },
    resolveNow: function resolveNow(connection) {
        // Make the final evaluation when the response is completed
        return s.include(this.data.join(''), 'Node.js') ? up : undetermined;
    }
};

// Create the 'http' connector
var connector = httpConnectorFactory.create(({
    url: 'https://nodejs.org/',
    timeout: 3000,
    resolutionStrategy: resolutionStrategy
}));

// Start the connector
connector.start();