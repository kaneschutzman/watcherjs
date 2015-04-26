/**
 * Created by jpsoroulas.
 */
'use strict';
var assert = require('chai').assert;

var logger = require('../src/logger');
var constants = require('../src/constants');
var resolvers = require('../src/resolvers');

var up = constants.serviceStatus.up;
var resolutionStrategyFactory = resolvers.resolutionStrategyFactory;
var statusResolverFactory = resolvers.statusResolverFactory;

describe('Resolvers', function () {
    describe('#default resolution strategy', function () {
        var resolutionStrategy;
        var connectionMock = {
            write: function write(data) {
            }
        };
        beforeEach(function () {
            resolutionStrategy = resolutionStrategyFactory.create();
        });

        it('on connection returns undefined', function () {
            var res = resolutionStrategy.resolveOnConnection(connectionMock);
            assert.isUndefined(res, 'return status should be undefined');
        });

        it('resolve on conversation returns up', function () {
            var res = resolutionStrategy.resolveOnConversation(connectionMock);
            assert.equal(res, up);
        });

        it('resolve now returns up when data exists', function () {
            resolutionStrategy._data = 'some data';
            var res = resolutionStrategy.resolveNow();
            assert.equal(res, up);
        });

        it('resolve now returns undefined when no data exists', function () {
            var res = resolutionStrategy.resolveNow(connectionMock);
            assert.isUndefined(res);
        });
    });

    describe('#status resolver', function () {
        it('when no chunk is provided resolveOnConnection is called ', function () {
            var invocation = 0;
            var resolverMock = {
                resolveOnConnection: function resolveOnConnection(connection) {
                    invocation++;
                    return void 0;
                }
            };
            var resolver = statusResolverFactory.create(resolverMock);
            resolver.consumeAndResolve();
            assert.equal(invocation, 1);
        });

        it('when chunk is provided resolveOnConversation is called ', function () {
            var invocation = 0;
            var resolverMock = {
                resolveOnConversation: function resolveOnConversation(client, chunk) {
                    invocation++;
                    return void 0;
                }
            };
            var resolver = statusResolverFactory.create(resolverMock);
            resolver.consumeAndResolve({}, 'some data');
            assert.equal(invocation, 1);
        });
    });

});