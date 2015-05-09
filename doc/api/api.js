YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "AbstractConnector",
        "Dictionary",
        "DictionaryFactory",
        "EventDispatcher",
        "EventDispatcherFactory",
        "HttpConnector",
        "HttpConnectorFactory",
        "Logger",
        "OnConnectionResolution",
        "OnConnectionResolutionFactory",
        "ResolutionStrategy",
        "ResolutionStrategyFactory",
        "ResolverEvents",
        "ServiceStatus",
        "SocketConnector",
        "SocketConnectorFactory",
        "StatusResolver",
        "StatusResolverFactory",
        "Validator",
        "Watcher",
        "WatcherFactory",
        "WatcherHttp"
    ],
    "modules": [
        "connectors",
        "constants",
        "httpServer",
        "logger",
        "resolvers",
        "utils",
        "validator",
        "watcher",
        "watcher-http"
    ],
    "allModules": [
        {
            "displayName": "connectors",
            "name": "connectors",
            "description": "###Overview\nProvides the connectors. A connector is responsible for connecting, communicating\nand determining the service status using the __{{#crossLink \"StatusResolver\"}}{{/crossLink}}__\nalong with the appropriate __{{#crossLink \"ResolutionStrategy\"}}{{/crossLink}}__.\nEach connector handles a specific type of communication type with an _endpoint_. Specifically, the\n__{{#crossLink \"SocketConnector\"}}{{/crossLink}}__ enables communication via raw socket\n(the data is transmitted as utf-8 encoded string) whereas the\n__{{#crossLink \"HttpConnector\"}}{{/crossLink}}__ enables communication via http(s) protocol.\nAn endpoint is actually an access point to the service. A service could have\nmany access points, each of them is handled by one connector.\nAlthough the service status resolution is performed by the underline\n__{{#crossLink \"ResolutionStrategy\"}}{{/crossLink}}__, as mentioned above, there are cases where\nit is the connector itself that makes this decision. These cases can be summarized as follows:\n\nFor the __{{#crossLink \"HttpConnector\"}}{{/crossLink}}__\n\nHttp response status code   |status\n:---------------------------|:-----------\n404                         |__{{#crossLink \"ServiceStatus/down:property\"}}{{/crossLink}}__\n500                         |__{{#crossLink \"ServiceStatus/down:property\"}}{{/crossLink}}__\n302                         |__{{#crossLink \"ServiceStatus/undetermined:property\"}}{{/crossLink}}__\n4xx (except of 404)         |__{{#crossLink \"ServiceStatus/undetermined:property\"}}{{/crossLink}}__\n5xx (except of 500)         |__{{#crossLink \"ServiceStatus/undetermined:property\"}}{{/crossLink}}__\n\n\nconnection events|error|status\n:----------------|:----|------\n__on error__|e.g. ECONNREFUSED, ENOTFOUND|__{{#crossLink \"ServiceStatus/unreachable:property\"}}{{/crossLink}}__\n__on timeout__|no response is taken for specific period of time|__{{#crossLink \"ServiceStatus/unreachable:property\"}}{{/crossLink}}__ (if resolver's last attempt to determine the status fails)\n\nFor the __{{#crossLink \"SocketConnector\"}}{{/crossLink}}__\n\nconnection events|error|status\n:----------------|:----|------\n__on error__|e.g. EHOSTUNREACH, ENOTFOUND|__{{#crossLink \"ServiceStatus/unreachable:property\"}}{{/crossLink}}__\n__on timeout__|no response is taken for specific period of time|__{{#crossLink \"ServiceStatus/unreachable:property\"}}{{/crossLink}}__ (if resolver's last attempt to determine the status fails)\n__on end event__|remote host closes the connection|__{{#crossLink \"ServiceStatus/undetermined:property\"}}{{/crossLink}}__ (if resolver's last attempt to determine the status fails)\n\n###Configuration\nThe connector's configuration is described below (note that properties in _[]_ are optional. when not set,\nthe default values are used - those in parentheses.):\n\n\n* For the __{{#crossLink \"SocketConnector\"}}{{/crossLink}}__\n * [__port__] (9999), the service socket connection port.\n * [__host__] ('localhost'), the service host.\n * [__timeout__] (5000), the socket timeout, at ms.\n * [__resolutionStrategy__] (__{{#crossLink \"OnConnectionResolution\"}}{{/crossLink}}__),\n the applied resolution strategy.\n\n\n* For the __{{#crossLink \"HttpConnector\"}}{{/crossLink}}__\n * [__url__] (http://localhost:8080), the service endpoint url.\n * [__timeout__] (5000 ms), the http(s) request timeout, at ms.\n * [__resolutionStrategy__] (__{{#crossLink \"ResolutionStrategy\"}}{{/crossLink}}__),\n the applied resolution strategy.\n\n###Exported objects\n* __{{#crossLink \"SocketConnectorFactory\"}}{{/crossLink}}__\n* __{{#crossLink \"HttpConnectorFactory\"}}{{/crossLink}}__\n\n###API Usage samples\n   ```javascript\n// socketConnectorFactory\nvar connectors = require('connectors');\nvar socketConnectorFactory = connectors.socketConnectorFactory;\nvar aResolutionStrategy = ...; //custom resolution strategy\nvar connector = socketConnectorFactory.create({\n      host: '11.222.333.444',\n      port: 55555,\n      timeout: 2000,\n      // if the property is not set, the default onConnectionResolution strategy is used.\n      resolutionStrategy: aResolutionStrategy\n  });\nconnector.addStatusResolvedListener(function onResolve(status) {\n       logger.debug('Resolution callback is called');\n });\nconnector.start();\n   ```\n\n   ```javascript\n// httpConnectorFactory\nvar connectors = require('connectors').connectors;\nvar httpConnectorFactory = connectors.httpConnectorFactory;\nvar connector = httpConnectorFactory.create(({\n     url: 'http://11.222.333.444:8080/',\n     timeout: 3000\n}));\nconnector.start();\n   ```"
        },
        {
            "displayName": "constants",
            "name": "constants",
            "description": "Holds application's constants"
        },
        {
            "displayName": "httpServer",
            "name": "httpServer",
            "description": "The express web framework used to expose the __{{#crossLink \"Watcher\"}}{{/crossLink}}__ api as HTTP requests.\nSee also at __{{#crossLink \"WatcherHttp\"}}{{/crossLink}}__."
        },
        {
            "displayName": "logger",
            "name": "logger",
            "description": "Exports a winston logger.\n\n###Exported objects\n__{{#crossLink \"Logger\"}}{{/crossLink}}__\n\n###API Usage samples\nSee at [winston](https://github.com/winstonjs/winston)"
        },
        {
            "displayName": "resolvers",
            "name": "resolvers",
            "description": "###Overview\nProvides the status resolvers and resolution strategies.\nThe status resolver implements the context of the applying strategy for service status resolution, whereas the\n_resolution strategy_ the strategy itself.\nThe _strategy_ is described by the following set of methods,\n__{{#crossLink \"ResolutionStrategy/resolveOnConnection:method\"}}{{/crossLink}}__,\n__{{#crossLink \"ResolutionStrategy/resolveOnConversation:method\"}}{{/crossLink}}__,\n__{{#crossLink \"ResolutionStrategy/resolveNow:method\"}}{{/crossLink}}__ and\n__{{#crossLink \"ResolutionStrategy/reset:method\"}}{{/crossLink}}__.\nEach method is called at a specific stage of the conversation with the endpoint, and returns the outcome\nof the service status. The outcome of the service status could be one of the following:\n* __{{#crossLink \"ServiceStatus/up:property\"}}{{/crossLink}}__, when the service is up and running.\n* __{{#crossLink \"ServiceStatus/down:property\"}}{{/crossLink}}__, when the service is down.\n* __{{#crossLink \"ServiceStatus/undetermined:property\"}}{{/crossLink}}__, when no decision can be made.\n* __{{#crossLink \"ServiceStatus/unreachable:property\"}}{{/crossLink}}__, status that is used by the connector\nwhen no connection with the endpoint can be made. A default implementation is provided by the\n__{{#crossLink \"ResolutionStrategy\"}}{{/crossLink}}__.\n\n###Exported objects\n* __{{#crossLink \"ResolutionStrategyFactory\"}}{{/crossLink}}__\n* __{{#crossLink \"StatusResolverFactory\"}}{{/crossLink}}__\n* __{{#crossLink \"OnConnectionResolutionFactory\"}}{{/crossLink}}__\n\n###API Usage samples\n   ```javascript\n// statusResolverFactory with onConnectionResolutionFactory\nvar resolvers = require('resolvers');\nvar statusResolverFactory = resolvers.statusResolverFactory;\nvar onConnectionResolutionFactory = resolvers.onConnectionResolutionFactory;\nvar resolver = statusResolverFactory.create(onConnectionResolutionFactory.create());\n   ```\n\n   ```javascript\n// A custom resolver\n// Fix the module paths\nvar constants = require('constants');\nvar resolvers = require('resolvers');\nvar up = constants.serviceStatus.up;\nvar statusResolverFactory = resolvers.statusResolverFactory;\n// An even simpler strategy than the default implementation (no data state is kept)\nvar resolutionStrategy = {\n     reset: function reset() {\n          //it is ok, do nothing since there is no state\n     },\n     resolveOnConnection: function resolveOnConnection(connection) {\n         //for 'socket' connector, on connection. resolve the status as up\n         return up;\n     },\n     resolveOnConversation: function resolveOnConnection(connection) {\n         //in this implementation, for 'socket' connector there is no need to do something\n         //since the resolution is performed on connection.\n         //For 'http' connector any received data means that the service is up\n         return up;\n     },\n     resolveNow: function resolveOnConnection(connection) {\n         //return always undefined\n     }\n};\nvar resolver = statusResolverFactory.create(resolutionStrategy);\n   ```"
        },
        {
            "displayName": "utils",
            "name": "utils",
            "description": "###Overview\nProvides the utilities.\nExported objects:\n* __{{#crossLink \"EventDispatcherFactory\"}}{{/crossLink}}__\n* __{{#crossLink \"EventDispatcher\"}}{{/crossLink}}__\n* __{{#crossLink \"DictionaryFactory\"}}{{/crossLink}}__\n\n###API Usage samples\n   ```javascript\n//DictionaryFactory\nvar dictionary = dictionaryFactory.create();\nvar value = {};\ndictionary.put('key', value);\nvalue = dictionary.get('key');\n   ```\n\n   ```javascript\n//eventDispatcher\nvar dispatcher =  eventDispatcher.create({\n    emitter: new events.EventEmitter()\n});\n   ```\n\n   ```javascript\n//eventDispatcherFactory\nvar dispatcher = eventDispatcherFactory.create();\n   ```"
        },
        {
            "displayName": "validator",
            "name": "validator",
            "description": "Validates the __{{#crossLink \"Watcher\"}}{{/crossLink}}__ configuration.\n\n###Exported objects\n__{{#crossLink \"Validator\"}}{{/crossLink}}__"
        },
        {
            "displayName": "watcher",
            "name": "watcher",
            "description": "###Overview\nThis is the main application module. It provides the factory method for creating an application,\nthe so called __watcher.js__, that can be used to monitor service status.\nThe application architecture is very simple. At regular intervals (_service communication interval_),\nservice specific defined messages, either as http requests or as raw data to sockets (depending on the\ncommunication type of the service endpoint), are send to the monitored services, or to be more precise are send\nto the service endpoints (or simply endpoints), to find out their status (the _service_ and  endpoint_ notation\nis used interchangeably, but there is a conceptual difference between them which will be discussed shortly).\nOn the service status resolution, the status is stored internally and is made available either programmatically or\nvia http requests (aka the _status requests_).\nActually, __the entire application API is also exposed as REST services__, which, on top of this, a simple but handy\n__web gui__ is implemented. For the REST services implementation the [express](http://expressjs.com) web framework is used.\nAt the following paragraphs the REST interface is described with references to the respective application API.\n\n* A _status request_ for a specific endpoint\n * __http://`<host>`:`<port>`/endpoints/`<id>`__ (request method: GET),\n * parameters:\n   * __id__ the endpoint id, it should be one of those defined at endpoints configuration data,\n * API reference: __{{#crossLink \"Watcher/getEndpoint:method\"}}{{/crossLink}}__.\n\nThe response is a JSON message like the following example:\n\n```\n// For a socket communication type\n{\n     \"id\": \"endpoint-id\",            // endpoint id\n     \"desc\": \"an endpoint\",          // endpoint description\n     \"status\": \"up\",                 // endpoint status\n     \"timestamp\": 1429860936846,     // the timestamp of the current status\n     \"since\": 1429860926846,         // the timestamp since the last change of status\n     \"type\": \"socket\",               // connector type\n     \"host\": \"localhost\",            // endpoint host (applied for 'socket' connector)\n     \"port\": 7777,                   // endpoint port (applied for 'socket' connector)\n     \"active\": true,                 // whether or not the endpoint is active\n     \"notify\": false                 // whether or not the notification is enabled\n}\n```\n\n* A status request for all registered endpoints.\n * __http://`<host>`:`<port>`/endpoints__ (request method: GET).\n In this case the response JSON message is an array with the information for all endpoints.\n * API reference: __{{#crossLink \"Watcher/getEndpoints:method\"}}{{/crossLink}}__.\n\n```\n// For a socket and http communication types\n[\n     {\n         \"id\": \"endpoint-1\",\n         \"desc\": \"endpoint 1\",\n         \"status\": \"down\"\n         \"timestamp\": 1429860936846,\n         \"since\": 1429860926846,\n         \"type\": \"socket\",\n         \"host\": \"localhost\",\n         \"port\": 7777,\n         \"active\": true,\n         \"notify\": true\n     },\n     {\n         \"id\": \"endpoint-2\",                     // endpoint id\n         \"desc\": \"endpoint 2\",                   // endpoint description\n         \"status\": \"up\"                          // endpoint status\n         \"timestamp\": 1429860936846,             // the timestamp of the current status\n         \"since\": 1429860926846,                 // the timestamp since the last change of status\n         \"type\": \"http\",                         // connector type\n         \"url\": \"http://11.222.333.555:3333/\",   // endpoint url (applied for 'http(s) connector')\n         \"active\": true,                         // whether or not the endpoint is active\n         \"notify\": false                         // whether or not the notification is enabled\n     }\n]\n```\n\n* Add new endpoint.\n * __http://`<host>`:`<port>`/endpoints__ (request method POST)\n * parameters (parameters in _[]_ are optional. when not set, the default values are used - those in parentheses.):\n   * __id__ : the endpoint id,\n   * __desc__ : the endpoint description,\n   * __type__ : the endpoint type ('socket' or 'http'),\n   * [__host__] (localhost): the endpoint host (applied for 'socket' communication type),\n   * [__port__] (9999): the endpoint port (applied for 'socket' communication type),\n   * [__url__] : the endpoint port (applied for 'http' communication type),\n   * [__active__] (true): true/false whether or not to activate the endpoint,\n   * [__notify__] (false): true/false whether or not to enable email notification on erroneous service status\n * API reference: __{{#crossLink \"Watcher/addEndpoint:method\"}}{{/crossLink}}__.\n\n\n* Remove an endpoint\n * __http://`<host>`:`<port>`/endpoints/`<id>`__ (request method: DELETE),\n * parameters:\n   * __id__ : the endpoint id\n * API reference: __{{#crossLink \"Watcher/removeEndpoint:method\"}}{{/crossLink}}__.\n\n\n* Activate/deactivate an endpoint\n * __http://`<host>`:`<port>`/endpoints/`<id>`/activate__ (request method POST),\n * __http://`<host>`:`<port>`/endpoints/`<id>`/activate__ (request method DELETE),\n * parameters:\n   * __id__ : the endpoint id,\n * API reference: __{{#crossLink \"Watcher/setEndpointActivationState:method\"}}{{/crossLink}}__.\n\n\n* Enable/disable notification for an endpoint\n * __http://`<host>`:`<port>`/endpoints/`<id>`/notify__ (request method POST),\n * __http://`<host>`:`<port>`/endpoints/`<id>`/notify__ (request method DELETE),\n * parameters:\n   * __id__ : the endpoint id,\n * API reference: __{{#crossLink \"Watcher/notifyOnErroneousStatus:method\"}}{{/crossLink}}__.\n\n\n* Get the ids of the unbound resolution strategies\n * __http://`<host>`:`<port>`/resolution-strategies__ (request method GET),\n * API reference: __{{#crossLink \"Watcher/getResolutionStrategies:method\"}}{{/crossLink}}__.\n\n\n* __http://`<host>`:`<port>`/console__, a web graphical user interface for the monitored services. The _console_ exposes\nthe _watcher.js_ API through a simple user-friendly gui.\n\n\n###Configuration\nThe application configuration requires two kinds of data, as shown below. The one that refers to the\nexpress framework that implements the application http interface, and the other that refers to the service\nendpoints. Note that properties in _[]_ are optional. when not set, the default values are used - those in parentheses.\n\n\n* Embedded http server configuration and service communication interval\n * [__host__] ('localhost'), the http server host name.\n * [__port__] (7777), the http server port.\n * [__interval__] (10000 ms), the regular interval, at ms, that the application attempts to establish\n communication with the services to resolve their status (_service communication interval_).\n * [__routeExts__], an array of user defined route extensions for building custom responses for the status requests.\n A route extension should be a function that accepts the __{{#crossLink \"Watcher/_registry:property\"}}{{/crossLink}}__\n as parameter and return a function that conforms to [express route](http://expressjs.com/guide/routing.html) conventions\n (a function with parameters: _req_, _res_, _next_, as shown at the examples)\n * [__resolutionStrategies__], an array of objects (aka unbound resolution strategy descriptor), each of them holds the\n information for an _unbound resolution strategy_ (__{{#crossLinkModule \"resolvers\"}}{{/crossLinkModule}}__) to be registered\n at the system. These strategies are not bound to any endpoint, but they can be associated with them by setting the\n respective strategy id at the endpoint's _resolutionStrategy_ configuration property (see at endpoint configuration below).\n The descriptor is an object as follows:\n ```\n {\n     id: <the resolution strategy id>, (should be unique)\n     desc: <the resolution strategy description>\n     implementation: <the implementation of resolution strategy> (see at resolvers to see the interface)\n }\n ```\n * [__nfOpts__], the notification options. Holds the information of the sender and the email addresses\n to receive email when erroneous service status occurs. The default sender is _admin@watcherjs.com_\n (if needed, configure your email account to not filter this sender as a spam). The object structure is:\n ```\n {\n     sender: <the sender>, // default value: admin@watcherjs.com\n     recipients: [<recipient1>, <recipient1>, ...] // the array of recipients email\n }\n ```\n * [__exportDir__] (_<`project directory`>/storage/_), the storage directory of dynamically created endpoints.\n\n\n* Endpoint\n * __id__, the unique endpoint/service id. This _id_ is used for the service identification when a service request is made.\n * __type__, the endpoint type, the type determines whether the message\n exchange is performed via http requests or directly with the socket. It actually dictates the underline\n connector used for the specific service (see also at __{{#crossLinkModule \"connectors\"}}{{/crossLinkModule}}__).\n The permitted values are: __'socket'__ and __'http'__ for __{{#crossLink \"SocketConnector\"}}{{/crossLink}}__\n and __{{#crossLink \"HttpConnector\"}}{{/crossLink}}__ respectively.\n * [__desc__] (__id__), the endpoint description.\n * [__host__] (localhost), the endpoint hostname when a __{{#crossLink \"SocketConnector\"}}{{/crossLink}}__ is used.\n * [__port__] (9999), the endpoint port when a __{{#crossLink \"SocketConnector\"}}{{/crossLink}}__ is used.\n * [__url__] (http://localhost:8080), the endpoint url when __{{#crossLink \"HttpConnector\"}}{{/crossLink}}__ is used.\n * [__timeout__] (5000), the applied connector's connection timeout (see also at\n __{{#crossLink \"SocketConnectorFactory/create:method\"}}{{/crossLink}}__ and\n __{{#crossLink \"HttpConnectorFactory/create:method\"}}{{/crossLink}}__).\n * [__resolutionStrategy__] (__{{#crossLink \"OnConnectionResolution\"}}{{/crossLink}}__) the applied resolution strategy.\n This property can hold either an implementation of a resolution strategy or the id of the an unbound strategy.\n * [__active__] (true), used to indicate whether or not the endpoint should be activated\n (enables or suspends the communication between the respective connector and the endpoint).\n * [__notify__] (false), used to indicate whether or not to receive email notifications for erroneous service status.\n\n\nThe _endpoint_ notation is used to emphases that the _service_ can be proxied by another service (_the proxy_) which\nis that determines the status of the proxied service. In this case, the endpoint belongs to the proxy and not to the\nmonitored service.\n\n\n###Exported objects\n* __{{#crossLink \"WatcherFactory\"}}{{/crossLink}}__\n\n###API Usage samples\n__Service with route extension and resolution strategy registration__\n   ```javascript\n// Here is the configuration of three endpoints. Two of them are accessed via sockets and refer to the services\n// 'service-1' and 'service-2' hosted at '11.222.333.444' and '11.222.333.555' respectively, whereas the other is\n// accessed via http and refers to the service 'service-3' that is also hosted at '11.222.333.555' (note that we use\n// the notation _service_ since the _endpoint_ and the _service_ is the same component).\n// Fix the module paths\nvar watcher = require('watcher');\nvar constants = require('constants');\nvar resolvers = require('resolvers');\n\nvar down = constants.serviceStatus.down;\nvar watcherFactory = watcher.watcherFactory;\nvar onConnectionResolutionFactory = resolvers.onConnectionResolutionFactory;\n\nvar alwaysDownStrategy = {\n      reset: function reset() {},\n      resolveOnConnection: function resolveOnConnection(connection) {\n         //mark as down only for demonstration purposes\n          return down;\n      },\n      resolveOnConversation: function resolveOnConnection(connection) {},\n      resolveNow: function resolveOnConnection(connection) {}\n  };\n\nvar options = {\n    port: 7777,\n    interval: 15000,\n   routeExts: [{\n         path: '/custom-route',\n         route: function service(registry) {\n             return function (req, res, next) {\n                 var id = req.query.id;\n                 var record = registry[id];\n                 if (record) {\n                     res.send('Service status: ' + record.status);\n                 } else {\n                     res.send('Unknown service: ' + id);\n                 }\n             };\n         }\n     }],\n    resolutionStrategies: [\n          {// Actually the default implementation, added for demonstration purposes\n              id: 'on-connection',\n              desc: 'resolution on connection',\n              implementation: onConnectionResolutionFactory.create()\n          },\n          {\n              id: 'always-down',\n              desc: 'always down',\n              implementation: alwaysDownStrategy\n          }\n      ],\n    nfOpts: {\n         recipients: ['foo@foo.com']\n     },\n    endpoints: [\n         {\n             id: 'service-1',\n             desc: 'service 1',\n             type: 'socket',\n             host: '11.222.333.444',\n             port: 1234,\n             // Apply an implementation of resolution strategy\n             resolutionStrategy: alwaysDownStrategy,\n             active: true,\n             notify: true\n         },\n         {\n             id: 'service-2',\n             desc: 'service 2',\n             type: 'socket',\n             host: '11.222.333.555',\n             port: 1234,\n             // Apply the unbound resolution strategy with id 'on-connection'\n             resolutionStrategy: 'on-connection',\n             active: true,\n             notify: true\n         },\n         {\n             id: 'service-3',\n             desc: 'service 3',\n             type: 'http',\n             timeout: 3000,\n             // The query string could be anything\n             url: 'http://11.222.333.555:3333/?get-status',\n             active: true,\n             notify: true\n         }\n     ]\n };\nwatcherFactory.create(options).start();\n\nAfter starting the watcher the following status requests could be made in order to\nretrieve the status for the services with id 'service-1', 'service-2' and 'service-3' respectively\nhttp://localhost:7777/endpoint/service-1\nhttp://localhost:7777/endpoint/service-2\nhttp://localhost:7777/endpoint/service-3\nWhereas the request http://localhost:7777/custom-route?id=service-1\nis the user defined route which returns: 'Service status: <status>' where status\nthe status of the 'service-1'.\n   ```\n__Proxied services__\n   ```javascript\n// Proxied services\n// Here is the case where a proxy controls the status of two service (e.g. _proxied-service-1_\n// and _proxied-service-2_). The proxy is hosted at '11.222.333.444' and can be accessed via http.\n// Two http endpoints at the proxy are created, the 'endpoint-1' and 'endpoint-2' each one of them\n// is connected with the respective monitored proxied services (note that we use the notation _endpoint_ since\n// the _endpoint_ is not the monitored _service_).\n\n// Fix the module paths\nvar watcherFactory = require('watcher').watcherFactory;\nvar options = {\n    port: 7777,\n    interval: 15000,\n    endpoints: [\n         {\n             id: 'endpoint-1',\n             type: 'http',\n             timeout: 3000,\n             // request to the proxied service 'proxied-service-1', the query string could be anything\n             url: 'http://11.222.333.444:3333/?get-status-for=proxied-service-1'\n         },\n         {\n             id: 'endpoint-2',\n             type: 'http',\n             timeout: 3000,\n             // request to the proxied service 'proxied-service-2', the query string could be anything\n             url: 'http://11.222.333.444:3333/?get-status-for=proxied-service-2'\n         }\n     ]\n };\nwatcherFactory.create(options).start();\n\nAfter starting the watcher the following status requests could be made in order to\nretrieve the status for 'proxied-service-1' and 'proxied-service-2' respectively\nhttp://localhost:7777/endpoint/endpoint-1\nhttp://localhost:7777/endpoint/endpoint-2\n   ```\n\n__Add and remove endpoints dynamically__\n   ```javascript\n// Here is an example for dynamically adding and removing endpoints\n\n// Fix the module paths\nvar watcherFactory = require('watcher').watcherFactory;\nvar options = {\n    port: 7777,\n    interval: 15000,\n    endpoints: [\n         {\n             id: 'service-1',\n             type: 'socket',\n             host: '11.222.333.444',\n             port: 1234\n         }\n     ]\n };\nvar watcher = watcherFactory.create(options).start();\n\n// Add the endpoint 'service-2'\nsetTimeout(function() {\n       watcher.addEndpoint({\n         id: 'service-2',\n         type: 'http',\n         timeout: 3000,\n         url: 'http://11.222.333.555:3333/?get-status'\n     });\n     if (!_.isEmpty(errors)) {\n         throw new Error('validation error...');\n     }\n}, 6000);\n\n// Deactivate the endpoint 'service-2'\nsetTimeout(function () {\n     watcher.deactivateEndpoint('service-2');\n}, 12000);\n\n// Activate the endpoint 'service-2'\nsetTimeout(function () {\n       watcher.activateEndpoint('service-2');\n  }, 30000);\n\n// Remove the endpoint 'service-2'\nsetTimeout(function() {\n      watcher.removeEndpoint('service-2');\n}, 60000);\n\n// Shutdown the application\nsetTimeout(function () {\n     watcher.stop();\n}, 120000);\n\n   ```"
        },
        {
            "displayName": "watcher-http",
            "name": "watcher-http",
            "description": "The application's http interface implementation."
        }
    ]
} };
});