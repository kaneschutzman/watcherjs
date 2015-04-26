/**
 * Created by jpsoroulas on 3/15/15.
 */
var watcher = require('./build/watcher');
var connectors = require('./build/connectors');
var resolvers = require('./build/resolvers');

module.exports = {
    watcher: watcher,
    connectors: connectors,
    resolvers: resolvers
};