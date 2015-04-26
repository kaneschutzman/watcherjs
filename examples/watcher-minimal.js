/**
 * Created by jpsoroulas.
 */
// An example of starting watcher.js with default configuration
'use strict';
var app = require('../src/watcher');

app.watcherFactory.create().start();

/*
The services monitor console can be accessed at:
http://localhost:7777/console
*/