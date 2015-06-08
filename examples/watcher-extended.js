/**
 * Created by jpsoroulas.
 */
// An example of watcher.js with extending configuration
'use strict';
// Fix the module paths
var watcher = require('../src/watcher');
var constants = require('../src/constants');
var resolvers = require('../src/resolvers');

var down = constants.serviceStatus.down;
var watcherFactory = watcher.watcherFactory;
var onConnectionResolutionFactory = resolvers.onConnectionResolutionFactory;

var alwaysDownStrategy = {
    reset: function reset() {},
    resolveOnConnection: function resolveOnConnection(connection) {
        //mark as down only for demonstration purposes
        return down;
    },
    resolveOnConversation: function resolveOnConversation(connection, data) {},
    resolveNow: function resolveNow(connection) {}
};

var options = {
    port: 7777,
    interval: 20000,
    // Add a route extensions
    routeExts: [{
        path: '/custom-route',
        route: function service(registry) {
            return function (req, res, next) {
                var id = req.query.id;
                var record = registry[id];
                if (record) {
                    res.send('Service status: ' + record.status);
                } else {
                    res.send('Unknown service: ' + id);
                }
            };
        }
    }],
    // Register some custom resolution strategies
    resolutionStrategies: [
        {// Actually the default implementation, added for demonstration purposes
            id: 'on-connection',
            desc: 'resolution on connection',
            implementation: onConnectionResolutionFactory.create()
        },
        {
            id: 'always-down',
            desc: 'always down',
            implementation: alwaysDownStrategy
        }
    ],
    // Notification emails using the default sender 'admin@watcherjs.com'
    nfOpts: {
        recipients: ['foo@foo.com']
    },
    // Register some endpoints
    endpoints: [
        {
            id: 'endpoint-1',
            desc: 'endpoint-1 desc',
            type: 'socket',
            host: '127.0.0.1',
            port: 7777,
            // Apply the unbound resolution strategy with id 'always-down'
            resolutionStrategy: 'always-down',
            active: true,
            notify: false
        },
        {
            id: 'endpoint-2',
            desc: 'endpoint-2 desc',
            type: 'http',
            timeout: 3000,
            url: 'http://localhost:7777/console',
            active: true,
            notify: false
        },
        {
            id: 'endpoint-3',
            desc: 'endpoint-3 desc',
            type: 'http',
            timeout: 3000,
            url: 'http://localhost:7777/console',
            active: true,
            notify: false
        }
    ]
};
// Start the watcher
watcherFactory.create(options).start();

/*
After starting the watcher the following status requests could be made in order to
retrieve the status for the services with id 'node.js' and 'expressjs' respectively
http://localhost:7777/endpoint/node.js
http://localhost:7777/endpoint/expressjs
Whereas the request http://localhost:7777/custom-route?id=node.js
is the user defined route which returns: 'Service status: <status>' where status
the status of the 'node.js'.
*/