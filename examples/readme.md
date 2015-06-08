# Examples

Here are various examples of how to use the watcher.js API.

## Create a _http connector_

```js
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
```

## Create a _socket connector_

```js
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
    resolveOnConversation: function resolveOnConnection(connection) {
        //in this implementation, for 'socket' connector there is no need to do something
        //since the resolution is performed on connection.
        //For 'http' connector any received data means that the service is up
        return up;
    },
    resolveNow: function resolveOnConnection(connection) {
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
```

## Start watcher.js with minimal configuration

```js
'use strict';
var app = require('../src/watcher');

app.watcherFactory.create().start();

/*
The web console can be accessed at:
http://localhost:7777/console
*/
```

## Start watcher.js with extended configuration

```js
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
    resolveOnConversation: function resolveOnConversation(connection, chunk) {},
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
```

## Real time event notification

```html
<script src="../src/public/js/lib/socket.io.min.js"></script>
<script>
    //modify the watcherjs URL if needed
    var socket = io.connect('http://localhost:7777');
    socket.on('wjs-connected', function (data) {
        console.log(data.message);
    });
    socket.on('connect_error', function (error) {
        console.log('Connection error with watcherjs, wait to be restored.');
    });
    socket.on('wjs-endpoints-updated', function (data) {
        console.log(data.message);
    });
</script>
```